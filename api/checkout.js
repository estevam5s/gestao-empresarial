// Cria uma sessão de Checkout do Stripe (assinatura c/ 7 dias grátis ou pagamento único vitalício)
import { stripe, admin, cors, getUser, readJson, siteUrl } from './_lib.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  const user = await getUser(req)
  if (!user) return res.status(401).json({ error: 'unauthorized' })

  const { plan_slug, cycle = 'monthly' } = await readJson(req)
  if (!plan_slug) return res.status(400).json({ error: 'plan_slug_required' })

  const { data: plan } = await admin.from('plans').select('*').eq('slug', plan_slug).single()
  if (!plan || plan.billing_type === 'free') return res.status(400).json({ error: 'invalid_plan' })

  const isLifetime = plan.billing_type === 'lifetime'
  const priceId = isLifetime
    ? plan.stripe_price_lifetime
    : cycle === 'yearly' ? plan.stripe_price_yearly : plan.stripe_price_monthly
  if (!priceId) return res.status(400).json({ error: 'price_not_configured' })

  // Cliente Stripe (reaproveita se já existir)
  const { data: sub } = await admin.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).single()
  let customerId = sub?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id, app: 'gestaoze' },
    })
    customerId = customer.id
    await admin.from('subscriptions').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
  }

  const base = siteUrl(req)
  const meta = { user_id: user.id, plan_slug, cycle: isLifetime ? 'lifetime' : cycle, app: 'gestaoze' }

  const session = await stripe.checkout.sessions.create({
    mode: isLifetime ? 'payment' : 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    locale: 'pt-BR',
    metadata: meta,
    success_url: `${base}/dashboard/billing?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?status=cancelled`,
    ...(isLifetime
      ? { payment_intent_data: { metadata: meta } }
      : { subscription_data: { trial_period_days: 7, metadata: meta } }),
  })

  return res.status(200).json({ url: session.url, id: session.id })
}
