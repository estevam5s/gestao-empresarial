import { supabase } from '@/config/supabase'
import { authService } from './authService'

const API_BASE = (import.meta.env.VITE_API_URL as string) || ''

async function adminPost(action: string, payload: Record<string, any> = {}) {
  const token = await authService.getAccessToken()
  const res = await fetch(`${API_BASE}/api/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ action, ...payload }),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || json.error || 'Erro')
  return json
}

export interface Overview {
  mrr: number; arr: number; arpu: number; ltv: number; churnRate: number; conversion: number
  totalUsers: number; activeUsers: number; trialUsers: number; payingUsers: number; canceledUsers: number
  newThisMonth: number; byPlan: Record<string, number>; signupByMonth: { label: string; value: number }[]
}

const monthlyEquivalent = (sub: any, plan: any) => {
  if (!plan || plan.billing_type !== 'recurring') return 0
  if (sub.billing_cycle === 'yearly') return Number(plan.yearly_price) / 12
  return Number(plan.monthly_price)
}

export const adminService = {
  async getOverview(): Promise<Overview> {
    const [{ data: profiles }, { data: subs }, { data: plans }] = await Promise.all([
      supabase.from('profiles').select('id,created_at,is_active,plan_slug'),
      supabase.from('subscriptions').select('*'),
      supabase.from('plans').select('*'),
    ])
    const planMap: Record<string, any> = {}
    ;(plans || []).forEach((p) => (planMap[p.slug] = p))

    let mrr = 0, paying = 0, trial = 0, canceled = 0
    ;(subs || []).forEach((s) => {
      const plan = planMap[s.plan_slug]
      if (s.status === 'trialing') trial++
      if (s.status === 'canceled') canceled++
      if (s.status === 'active' && plan?.billing_type === 'recurring' && s.plan_slug !== 'inicial') {
        mrr += monthlyEquivalent(s, plan); paying++
      }
    })
    const totalUsers = (profiles || []).length
    const activeUsers = (profiles || []).filter((p) => p.is_active).length
    const byPlan: Record<string, number> = {}
    ;(profiles || []).forEach((p) => { byPlan[p.plan_slug] = (byPlan[p.plan_slug] || 0) + 1 })

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const newThisMonth = (profiles || []).filter((p) => new Date(p.created_at) >= monthStart).length

    const signupByMonth: { label: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const count = (profiles || []).filter((p) => { const c = new Date(p.created_at); return c >= d && c < next }).length
      signupByMonth.push({ label: d.toLocaleDateString('pt-BR', { month: 'short' }), value: count })
    }

    const arpu = paying ? mrr / paying : 0
    const churnRate = paying + canceled ? canceled / (paying + canceled) : 0
    const ltv = churnRate > 0 ? arpu / churnRate : arpu * 24
    const conversion = totalUsers ? paying / totalUsers : 0

    return {
      mrr, arr: mrr * 12, arpu, ltv, churnRate, conversion,
      totalUsers, activeUsers, trialUsers: trial, payingUsers: paying, canceledUsers: canceled,
      newThisMonth, byPlan, signupByMonth,
    }
  },

  async listUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    const { data: subs } = await supabase.from('subscriptions').select('*')
    const subMap: Record<string, any> = {}
    ;(subs || []).forEach((s) => (subMap[s.user_id] = s))
    return (data || []).map((u) => ({ ...u, subscription: subMap[u.id] || null }))
  },
  async listSubscriptions() {
    const { data } = await supabase.from('subscriptions').select('*').order('updated_at', { ascending: false })
    return data || []
  },
  async listPlans() { const { data } = await supabase.from('plans').select('*').order('sort_order'); return data || [] },
  async listFeedback() { const { data } = await supabase.from('cancellation_feedback').select('*').order('created_at', { ascending: false }); return data || [] },
  async listLeads() { const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }); return data || [] },
  async listSignupSources() { const { data } = await supabase.from('signup_sources').select('*').order('created_at', { ascending: false }); return data || [] },
  async listContacts() { const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }); return data || [] },
  async listLogs() { const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(200); return data || [] },

  async updatePlan(slug: string, patch: Record<string, any>) {
    const { error } = await supabase.from('plans').update(patch).eq('slug', slug)
    if (error) throw new Error(error.message)
  },

  setActive: (user_id: string, is_active: boolean) => adminPost('set_active', { user_id, is_active }),
  deleteUser: (user_id: string) => adminPost('delete_user', { user_id }),
  adminCancel: (user_id: string) => adminPost('admin_cancel', { user_id }),
  listCoupons: () => adminPost('list_coupons'),
  createCoupon: (payload: Record<string, any>) => adminPost('create_coupon', payload),
  deleteCoupon: (coupon_id: string) => adminPost('delete_coupon', { coupon_id }),

  // ---- Ofertas / Promoções ----
  async listOffers() { const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false }); return data || [] },
  async saveOffer(offer: any) {
    const { error } = offer.id
      ? await supabase.from('offers').update(offer).eq('id', offer.id)
      : await supabase.from('offers').insert(offer)
    if (error) throw new Error(error.message)
  },
  async deleteOffer(id: string) { const { error } = await supabase.from('offers').delete().eq('id', id); if (error) throw new Error(error.message) },

  // ---- Visitantes ----
  async getVisitors() {
    const { data } = await supabase.from('visitors').select('country,country_code,city,device,created_at').order('created_at', { ascending: false }).limit(1000)
    const rows = data || []
    const byCountry: Record<string, { name: string; count: number }> = {}
    const byDevice: Record<string, number> = {}
    rows.forEach((v: any) => {
      const cc = v.country_code || '??'
      byCountry[cc] = byCountry[cc] || { name: v.country || cc, count: 0 }
      byCountry[cc].count++
      byDevice[v.device || 'desktop'] = (byDevice[v.device || 'desktop'] || 0) + 1
    })
    return { total: rows.length, byCountry, byDevice, recent: rows.slice(0, 50) }
  },

  // ---- Chaves de API do admin ----
  async listApiKeys() { const { data } = await supabase.from('admin_api_keys').select('*').order('created_at', { ascending: false }); return data || [] },
  async createApiKey(label: string) {
    const token = 'gat_' + Array.from(crypto.getRandomValues(new Uint8Array(24))).map((b) => b.toString(16).padStart(2, '0')).join('')
    const { error } = await supabase.from('admin_api_keys').insert({ label, token })
    if (error) throw new Error(error.message)
    return token
  },
  async deleteApiKey(id: string) { await supabase.from('admin_api_keys').delete().eq('id', id) },

  // ---- Segurança ----
  async listSecurityEvents() { const { data } = await supabase.from('security_events').select('*').order('created_at', { ascending: false }).limit(200); return data || [] },

  // ---- Backup ----
  async exportBackup() {
    const tables = ['profiles', 'subscriptions', 'plans', 'offers', 'faq_items', 'cancellation_feedback', 'leads', 'contact_messages', 'signup_sources']
    const out: Record<string, any> = { _meta: { app: 'gestaoze', exported_at: new Date().toISOString() } }
    for (const t of tables) { const { data } = await supabase.from(t).select('*'); out[t] = data || [] }
    return out
  },
  async restoreConfig(data: any) { return adminPost('restore_config', { data }) },

  async health() {
    const checks: { name: string; ok: boolean; detail: string }[] = []
    const t0 = performance.now()
    const { error: dbErr } = await supabase.from('plans').select('slug').limit(1)
    checks.push({ name: 'Banco de dados (Supabase)', ok: !dbErr, detail: dbErr ? dbErr.message : `${Math.round(performance.now() - t0)}ms` })
    try {
      const r = await fetch(`${API_BASE}/api/webhook`, { method: 'GET' })
      checks.push({ name: 'Webhook Stripe (/api/webhook)', ok: r.status === 405, detail: `HTTP ${r.status} (ativo)` })
    } catch (e: any) { checks.push({ name: 'Webhook Stripe', ok: false, detail: e.message }) }
    const { count } = await supabase.from('plans').select('*', { count: 'exact', head: true })
    checks.push({ name: 'Planos configurados', ok: (count || 0) >= 5, detail: `${count} planos` })
    return checks
  },
}

export const fmtBRL = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0))
export const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`
