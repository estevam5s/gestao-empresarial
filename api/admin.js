// API administrativa — ações que exigem service-role/Stripe. Protegida: só role='admin'.
import { stripe, admin, cors, getUser, readJson } from './_lib.js'

async function requireAdmin(req) {
  const user = await getUser(req)
  if (!user) return null
  const { data } = await admin.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin' ? user : null
}

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const me = await requireAdmin(req)
  if (!me) return res.status(403).json({ error: 'forbidden' })

  const body = await readJson(req)
  const action = body.action

  try {
    // ---- Excluir usuário definitivamente (libera o e-mail) ----
    if (action === 'delete_user') {
      if (!body.user_id) return res.status(400).json({ error: 'user_id_required' })
      // cancela assinatura Stripe se houver
      const { data: sub } = await admin.from('subscriptions').select('stripe_subscription_id').eq('user_id', body.user_id).single()
      if (sub?.stripe_subscription_id) { try { await stripe.subscriptions.cancel(sub.stripe_subscription_id) } catch {} }
      const { error } = await admin.auth.admin.deleteUser(body.user_id)
      if (error) throw new Error(error.message)
      return res.status(200).json({ ok: true })
    }

    // ---- Suspender / reativar ----
    if (action === 'set_active') {
      await admin.from('profiles').update({ is_active: !!body.is_active }).eq('id', body.user_id)
      return res.status(200).json({ ok: true })
    }

    // ---- Cancelar assinatura de um usuário (admin) ----
    if (action === 'admin_cancel') {
      const { data: sub } = await admin.from('subscriptions').select('*').eq('user_id', body.user_id).single()
      if (sub?.stripe_subscription_id) await stripe.subscriptions.update(sub.stripe_subscription_id, { cancel_at_period_end: true })
      await admin.from('subscriptions').update({ cancel_at_period_end: true, canceled_at: new Date().toISOString() }).eq('user_id', body.user_id)
      return res.status(200).json({ ok: true })
    }

    // ---- Cupons (Stripe Coupons + Promotion Codes) ----
    if (action === 'create_coupon') {
      const { code, percent_off, amount_off, duration = 'once', months } = body
      const couponPayload = { duration, metadata: { app: 'gestaoze' } }
      if (percent_off) couponPayload.percent_off = Number(percent_off)
      else if (amount_off) { couponPayload.amount_off = Math.round(Number(amount_off) * 100); couponPayload.currency = 'brl' }
      else return res.status(400).json({ error: 'percent_or_amount_required' })
      if (duration === 'repeating' && months) couponPayload.duration_in_months = Number(months)
      const coupon = await stripe.coupons.create(couponPayload)
      let promo = null
      if (code) promo = await stripe.promotionCodes.create({ coupon: coupon.id, code, metadata: { app: 'gestaoze' } })
      return res.status(200).json({ ok: true, coupon, promo })
    }
    if (action === 'list_coupons') {
      const coupons = await stripe.coupons.list({ limit: 100 })
      const promos = await stripe.promotionCodes.list({ limit: 100 })
      const data = coupons.data.filter((c) => c.metadata?.app === 'gestaoze').map((c) => ({
        ...c, codes: promos.data.filter((p) => p.coupon.id === c.id).map((p) => ({ code: p.code, active: p.active, id: p.id })),
      }))
      return res.status(200).json({ ok: true, coupons: data })
    }
    if (action === 'delete_coupon') {
      await stripe.coupons.del(body.coupon_id)
      return res.status(200).json({ ok: true })
    }

    // ---- Restaurar configuração a partir de um backup (upsert) ----
    if (action === 'restore_config') {
      const data = body.data || {}
      const result = {}
      if (Array.isArray(data.plans) && data.plans.length) {
        const { error } = await admin.from('plans').upsert(data.plans, { onConflict: 'slug' })
        result.plans = error ? error.message : data.plans.length
      }
      if (Array.isArray(data.offers) && data.offers.length) {
        const { error } = await admin.from('offers').upsert(data.offers, { onConflict: 'id' })
        result.offers = error ? error.message : data.offers.length
      }
      if (Array.isArray(data.faq_items) && data.faq_items.length) {
        const { error } = await admin.from('faq_items').upsert(data.faq_items, { onConflict: 'id' })
        result.faq_items = error ? error.message : data.faq_items.length
      }
      return res.status(200).json({ ok: true, restored: result })
    }

    return res.status(400).json({ error: 'unknown_action' })
  } catch (e) {
    return res.status(500).json({ error: 'server_error', message: e.message })
  }
}
