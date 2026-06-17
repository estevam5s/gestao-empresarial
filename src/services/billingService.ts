import { supabase } from '@/config/supabase'
import { authService } from './authService'

const API_BASE = (import.meta.env.VITE_API_URL as string) || ''

export interface Plan {
  slug: string
  name: string
  description: string
  billing_type: 'free' | 'recurring' | 'lifetime'
  monthly_price: number
  yearly_price: number
  lifetime_price: number
  included_users: number
  highlight: boolean
  sort_order: number
  cta: string
  limits: Record<string, number>
  features: string[]
}

export interface Subscription {
  user_id: string
  plan_slug: string
  status: string
  billing_cycle: string
  current_period_end: string | null
  trial_end: string | null
  cancel_at_period_end: boolean
  pending_plan_slug: string | null
  pending_cycle: string | null
  pending_effective_at: string | null
}

async function post(path: string, body?: any) {
  const token = await authService.getAccessToken()
  const res = await fetch(`${API_BASE}/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body || {}),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || json.error || 'Erro na requisição')
  return json
}

export const billingService = {
  async getPlans(): Promise<Plan[]> {
    const { data } = await supabase.from('plans').select('*').order('sort_order')
    return (data || []) as Plan[]
  },

  async getSubscription(): Promise<Subscription | null> {
    const user = authService.getCurrentUser()
    if (!user) return null
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).single()
    return (data || null) as Subscription | null
  },

  async startCheckout(planSlug: string, cycle: 'monthly' | 'yearly' = 'monthly') {
    const { url } = await post('checkout', { plan_slug: planSlug, cycle })
    if (url) window.location.href = url
  },

  async openPortal() {
    const { url } = await post('portal', {})
    if (url) window.location.href = url
  },

  async changePlan(planSlug: string, cycle: 'monthly' | 'yearly' = 'monthly') {
    return post('subscription', { action: 'change', plan_slug: planSlug, cycle })
  },

  async cancel(reason: string, comment?: string) {
    return post('subscription', { action: 'cancel', reason, comment })
  },

  async reactivate() {
    return post('subscription', { action: 'reactivate' })
  },
}

export const fmtBRL = (v: number | string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0))
