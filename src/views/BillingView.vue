<template>
  <div class="billing">
    <div class="topbar">
      <router-link to="/dashboard" class="back">← Painel</router-link>
      <div class="logo-text">Assinatura</div>
    </div>

    <div v-if="statusMsg" class="banner" :class="statusType">{{ statusMsg }}</div>

    <p v-if="loading" class="loading">Carregando…</p>

    <template v-else>
      <!-- Plano atual -->
      <section class="current">
        <div>
          <span class="label">Seu plano</span>
          <h2>{{ currentPlan?.name || sub?.plan_slug }}
            <span class="badge" :class="badgeClass">{{ statusLabel }}</span>
          </h2>
          <p v-if="sub?.trial_end && isTrial" class="muted">Teste grátis até {{ fmtDate(sub.trial_end) }}.</p>
          <p v-else-if="sub?.current_period_end" class="muted">
            {{ sub?.cancel_at_period_end ? 'Acesso até' : 'Renova em' }} {{ fmtDate(sub.current_period_end) }}.
          </p>
          <p v-if="sub?.pending_plan_slug" class="muted pending">
            ⏳ Downgrade para <strong>{{ sub.pending_plan_slug }}</strong> agendado para {{ fmtDate(sub.pending_effective_at) }}.
          </p>
        </div>
        <div class="actions">
          <button v-if="hasStripe" class="btn ghost" @click="openPortal">Gerenciar pagamento</button>
          <button v-if="sub?.cancel_at_period_end" class="btn primary" :disabled="acting" @click="reactivate">Reativar assinatura</button>
          <button v-else-if="hasStripe" class="btn danger" :disabled="acting" @click="showCancel = true">Cancelar assinatura</button>
        </div>
      </section>

      <!-- Trocar de plano -->
      <h3 class="section-title">Trocar de plano</h3>
      <div class="cycle-toggle">
        <button :class="{ active: cycle === 'monthly' }" @click="cycle = 'monthly'">Mensal</button>
        <button :class="{ active: cycle === 'yearly' }" @click="cycle = 'yearly'">Anual</button>
      </div>
      <div class="grid">
        <div v-for="p in payablePlans" :key="p.slug" class="card" :class="{ hi: p.highlight, cur: p.slug === sub?.plan_slug }">
          <div v-if="p.slug === sub?.plan_slug" class="tag cur-tag">Plano atual</div>
          <h4>{{ p.name }}</h4>
          <div class="price"><strong>R$ {{ fmtNum(priceFor(p)) }}</strong><span>{{ p.billing_type==='lifetime' ? ' único' : cycle==='yearly' ? '/ano' : '/mês' }}</span></div>
          <button class="btn block" :class="{ primary: p.highlight }" :disabled="p.slug === sub?.plan_slug || acting" @click="change(p)">
            {{ p.slug === sub?.plan_slug ? 'Atual' : changeLabel(p) }}
          </button>
        </div>
      </div>
    </template>

    <!-- Modal cancelamento com feedback -->
    <div v-if="showCancel" class="modal-overlay" @click.self="showCancel = false">
      <div class="modal">
        <h3>Que pena ver você ir 😢</h3>
        <p class="muted">Conte-nos o motivo — isso nos ajuda a melhorar. Seu acesso continua até o fim do período pago.</p>
        <label class="fl">Motivo</label>
        <select v-model="cancelReason" class="inp">
          <option value="">Selecione…</option>
          <option>Muito caro</option>
          <option>Faltam recursos que preciso</option>
          <option>Encontrei outra solução</option>
          <option>Não usei o suficiente</option>
          <option>Problemas técnicos / bugs</option>
          <option>Fechei o negócio</option>
          <option>Outro</option>
        </select>
        <label class="fl">Comentário (opcional)</label>
        <textarea v-model="cancelComment" class="inp" rows="3" placeholder="O que poderíamos ter feito melhor?"></textarea>
        <div class="modal-actions">
          <button class="btn ghost" @click="showCancel = false">Voltar</button>
          <button class="btn danger" :disabled="!cancelReason || acting" @click="confirmCancel">Confirmar cancelamento</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { billingService, type Plan, type Subscription } from '@/services/billingService'

const route = useRoute()
const loading = ref(true)
const acting = ref(false)
const plans = ref<Plan[]>([])
const sub = ref<Subscription | null>(null)
const cycle = ref<'monthly' | 'yearly'>('monthly')
const showCancel = ref(false)
const cancelReason = ref('')
const cancelComment = ref('')
const statusMsg = ref('')
const statusType = ref('ok')

const currentPlan = computed(() => plans.value.find((p) => p.slug === sub.value?.plan_slug))
const payablePlans = computed(() => plans.value.filter((p) => p.billing_type !== 'free'))
const hasStripe = computed(() => !!sub.value && sub.value.plan_slug !== 'inicial' && sub.value.billing_cycle !== 'lifetime')
const isTrial = computed(() => sub.value?.status === 'trialing')
const statusLabel = computed(() => {
  if (sub.value?.cancel_at_period_end) return 'Cancelando'
  const m: Record<string, string> = { trialing: 'Em teste', active: 'Ativo', past_due: 'Pagamento pendente', canceled: 'Cancelado' }
  return m[sub.value?.status || ''] || sub.value?.status || ''
})
const badgeClass = computed(() => sub.value?.cancel_at_period_end ? 'b-warn' : sub.value?.status === 'past_due' ? 'b-warn' : 'b-ok')

const fmtNum = (v: number) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(Number(v || 0))
const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'
const priceFor = (p: Plan) => p.billing_type === 'lifetime' ? Number(p.lifetime_price) : cycle.value === 'yearly' ? Number(p.yearly_price) : Number(p.monthly_price)
function changeLabel(p: Plan) {
  const cur = currentPlan.value
  if (!cur || !sub.value || sub.value.plan_slug === 'inicial') return 'Assinar'
  return Number(p.monthly_price) >= Number(cur.monthly_price) ? 'Fazer upgrade' : 'Fazer downgrade'
}

function flash(msg: string, type = 'ok') { statusMsg.value = msg; statusType.value = type; setTimeout(() => (statusMsg.value = ''), 6000) }

async function load() {
  loading.value = true
  try {
    plans.value = await billingService.getPlans()
    sub.value = await billingService.getSubscription()
    cycle.value = sub.value?.billing_cycle === 'yearly' ? 'yearly' : 'monthly'
  } finally { loading.value = false }
}

async function change(p: Plan) {
  // sem assinatura ativa (free) → checkout normal
  if (!hasStripe.value) { try { acting.value = true; await billingService.startCheckout(p.slug, cycle.value) } finally { acting.value = false } ; return }
  try {
    acting.value = true
    const r: any = await billingService.changePlan(p.slug, cycle.value)
    flash(r.message || 'Plano atualizado.')
    await load()
  } catch (e: any) {
    if (e.message?.includes('no_active')) { await billingService.startCheckout(p.slug, cycle.value) }
    else flash(e.message || 'Erro ao trocar de plano', 'err')
  } finally { acting.value = false }
}

async function confirmCancel() {
  try {
    acting.value = true
    const r: any = await billingService.cancel(cancelReason.value, cancelComment.value)
    showCancel.value = false
    flash(r.message || 'Assinatura cancelada no fim do período.')
    await load()
  } catch (e: any) { flash(e.message || 'Erro ao cancelar', 'err') } finally { acting.value = false }
}

async function reactivate() {
  try { acting.value = true; const r: any = await billingService.reactivate(); flash(r.message || 'Assinatura reativada.'); await load() }
  catch (e: any) { flash(e.message || 'Erro', 'err') } finally { acting.value = false }
}

async function openPortal() { try { await billingService.openPortal() } catch (e: any) { flash(e.message || 'Erro', 'err') } }

onMounted(async () => {
  if (route.query.status === 'success') flash('Pagamento confirmado! Bem-vindo ao seu novo plano. 🎉')
  await load()
})
</script>

<style scoped>
.billing { min-height: 100vh; background: #f8fafc; color: #0f172a; padding: 0 0 70px; font-family: 'Inter', system-ui, sans-serif; }
.topbar { display: flex; align-items: center; gap: 16px; padding: 16px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 10; }
.back { color: #475569; text-decoration: none; font-weight: 600; font-size: 14px; }
.logo-text { font-weight: 800; }
.banner { margin: 16px 24px 0; padding: 12px 16px; border-radius: 10px; font-weight: 600; font-size: 14px; }
.banner.ok { background: #ecfdf5; color: #047857; }
.banner.err { background: #fef2f2; color: #b91c1c; }
.loading { text-align: center; color: #94a3b8; padding: 60px; }
.current { max-width: 980px; margin: 22px auto 0; padding: 24px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.label { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; font-weight: 700; }
.current h2 { font-size: 24px; font-weight: 800; margin: 4px 0; display: flex; align-items: center; gap: 10px; }
.badge { font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
.b-ok { background: #dcfce7; color: #166534; } .b-warn { background: #fef3c7; color: #92400e; }
.muted { color: #64748b; font-size: 14px; } .pending { color: #b45309; }
.actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.section-title { max-width: 980px; margin: 34px auto 12px; padding: 0 24px; font-size: 18px; font-weight: 800; }
.cycle-toggle { max-width: 980px; margin: 0 auto; padding: 0 24px 14px; display: flex; gap: 6px; }
.cycle-toggle button { border: 1px solid #e2e8f0; background: #fff; padding: 7px 16px; border-radius: 999px; font-weight: 600; color: #475569; cursor: pointer; font-size: 13px; }
.cycle-toggle button.active { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; border: 0; }
.grid { max-width: 980px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 14px; }
.card { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; text-align: center; }
.card.hi { border-color: #16a34a; } .card.cur { background: #f0fdf4; border-color: #16a34a; }
.tag { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: #16a34a; color: #fff; }
.card h4 { font-size: 16px; font-weight: 800; margin: 2px 0 6px; }
.price strong { font-size: 22px; font-weight: 800; } .price span { color: #94a3b8; font-size: 12px; }
.btn { padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 14px; border: 1px solid #cbd5e1; background: #fff; color: #0f172a; cursor: pointer; transition: .15s; }
.btn:hover:not(:disabled) { background: #f1f5f9; }
.btn.primary { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; border: 0; }
.btn.danger { color: #b91c1c; border-color: #fecaca; } .btn.danger:hover:not(:disabled) { background: #fef2f2; }
.btn.ghost { background: #f8fafc; }
.btn.block { width: 100%; margin-top: 12px; }
.btn:disabled { opacity: .55; cursor: default; }
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.modal { background: #fff; border-radius: 16px; padding: 28px; max-width: 440px; width: 100%; }
.modal h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
.fl { display: block; font-size: 13px; font-weight: 600; color: #334155; margin: 14px 0 6px; }
.inp { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; font-family: inherit; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
</style>
