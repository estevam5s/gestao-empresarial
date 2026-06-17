// API externa do admin — outros sistemas SaaS consomem métricas via chave (gat_...).
// Auth: header Authorization: Bearer gat_xxxxx  (gerada no painel admin)
import { admin, cors } from './_lib.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'missing_token' })

  const { data: key } = await admin.from('admin_api_keys').select('id,active').eq('token', token).single()
  if (!key || !key.active) return res.status(403).json({ error: 'invalid_token' })
  admin.from('admin_api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', key.id).then(() => {})

  const [{ data: profiles }, { data: subs }, { data: plans }] = await Promise.all([
    admin.from('profiles').select('id,created_at,is_active,plan_slug'),
    admin.from('subscriptions').select('plan_slug,status,billing_cycle'),
    admin.from('plans').select('slug,monthly_price,yearly_price,billing_type'),
  ])
  const planMap = {}; (plans || []).forEach((p) => (planMap[p.slug] = p))
  let mrr = 0, paying = 0, trial = 0, canceled = 0
  ;(subs || []).forEach((s) => {
    const p = planMap[s.plan_slug]
    if (s.status === 'trialing') trial++
    if (s.status === 'canceled') canceled++
    if (s.status === 'active' && p?.billing_type === 'recurring' && s.plan_slug !== 'inicial') {
      mrr += s.billing_cycle === 'yearly' ? Number(p.yearly_price) / 12 : Number(p.monthly_price); paying++
    }
  })
  const byPlan = {}; (profiles || []).forEach((p) => { byPlan[p.plan_slug] = (byPlan[p.plan_slug] || 0) + 1 })
  const arpu = paying ? mrr / paying : 0
  const churn = paying + canceled ? canceled / (paying + canceled) : 0

  return res.status(200).json({
    generated_at: new Date().toISOString(),
    revenue: { mrr: +mrr.toFixed(2), arr: +(mrr * 12).toFixed(2), arpu: +arpu.toFixed(2), ltv: +(churn > 0 ? arpu / churn : arpu * 24).toFixed(2), churn_rate: +churn.toFixed(4) },
    customers: { total: (profiles || []).length, active: (profiles || []).filter((p) => p.is_active).length, paying, trial, canceled, conversion: (profiles || []).length ? +(paying / profiles.length).toFixed(4) : 0 },
    by_plan: byPlan,
    plans: (plans || []).map((p) => ({ slug: p.slug, monthly: Number(p.monthly_price), yearly: Number(p.yearly_price), type: p.billing_type })),
  })
}
