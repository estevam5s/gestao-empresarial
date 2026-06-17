<template>
  <div class="pricing-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <BrandLogo to="/" :size="36" :text-size="20" />
        <div class="nav-actions">
          <router-link v-if="!isAuth" to="/login" class="btn btn-ghost">Entrar</router-link>
          <router-link v-if="!isAuth" to="/register" class="btn btn-primary">Criar conta grátis</router-link>
          <router-link v-else to="/dashboard" class="btn btn-primary">Ir para o painel</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-badge"><span class="pulse-dot"></span> Planos para negócios de alimentação</div>
      <h1 class="hero-title">Planos que crescem com a sua operação</h1>
      <p class="hero-desc">
        Estoque, financeiro, equipe, cardápio, relatórios e IA num só lugar.
        Comece grátis e evolua quando precisar — 7 dias de teste nos planos pagos, sem cartão.
      </p>

      <!-- Toggle -->
      <div class="cycle-toggle">
        <button :class="{ active: cycle === 'monthly' }" @click="cycle = 'monthly'">Mensal</button>
        <button :class="{ active: cycle === 'yearly' }" @click="cycle = 'yearly'">
          Anual <span class="save-tag">economize ~2 meses</span>
        </button>
      </div>
    </section>

    <!-- Plans -->
    <section class="plans">
      <p v-if="loading" class="loading">Carregando planos…</p>
      <div v-else class="plans-grid">
        <div v-for="plan in plans" :key="plan.slug" class="plan-card" :class="{ highlight: plan.highlight }">
          <div v-if="plan.highlight" class="ribbon">★ Mais recomendado</div>
          <span v-if="cycle === 'yearly' && offPct(plan) > 0" class="off-badge">-{{ offPct(plan) }}%</span>

          <h3 class="plan-name">{{ plan.name }}</h3>
          <p class="plan-desc">{{ plan.description }}</p>

          <div class="plan-price">
            <span class="currency">{{ priceFor(plan) === 0 ? '' : 'R$' }}</span>
            <span class="amount">{{ priceFor(plan) === 0 ? 'Grátis' : fmtNum(priceFor(plan)) }}</span>
            <span class="period">{{ periodLabel(plan) }}</span>
          </div>
          <p v-if="plan.included_users" class="users-line">{{ plan.included_users }} usuário(s) incluído(s)</p>

          <button class="plan-cta" :class="{ primary: plan.highlight }" :disabled="busy === plan.slug" @click="select(plan)">
            {{ busy === plan.slug ? 'Aguarde…' : plan.cta }}
          </button>

          <ul class="features">
            <li v-for="(f, i) in plan.features" :key="i"><span class="check">✓</span>{{ f }}</li>
          </ul>
        </div>
      </div>

      <p class="fine-print">
        7 dias de teste grátis · Cancele quando quiser · Reembolso conforme política · Pagamento seguro via Stripe.
        Uso conforme limites do plano (política de uso justo).
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import { billingService, type Plan } from '@/services/billingService'
import { authService } from '@/services/authService'

const router = useRouter()
const plans = ref<Plan[]>([])
const loading = ref(true)
const cycle = ref<'monthly' | 'yearly'>('monthly')
const busy = ref<string | null>(null)
const isAuth = ref(authService.isAuthenticated())

onMounted(async () => {
  try { plans.value = await billingService.getPlans() } finally { loading.value = false }
})

const fmtNum = (v: number) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)

function priceFor(p: Plan): number {
  if (p.billing_type === 'free') return 0
  if (p.billing_type === 'lifetime') return Number(p.lifetime_price)
  return cycle.value === 'yearly' ? Number(p.yearly_price) : Number(p.monthly_price)
}
function periodLabel(p: Plan): string {
  if (p.billing_type === 'free') return ''
  if (p.billing_type === 'lifetime') return ' único'
  return cycle.value === 'yearly' ? ' /ano' : ' /mês'
}
function offPct(p: Plan): number {
  if (p.billing_type !== 'recurring' || !p.monthly_price) return 0
  return Math.round(((Number(p.monthly_price) * 12 - Number(p.yearly_price)) / (Number(p.monthly_price) * 12)) * 100)
}

async function select(p: Plan) {
  if (p.billing_type === 'free') { router.push(isAuth.value ? '/dashboard' : '/register'); return }
  if (p.slug === 'enterprise') { router.push('/contact?assunto=enterprise'); return }
  if (!isAuth.value) { router.push(`/register?plan=${p.slug}&cycle=${cycle.value}`); return }
  try {
    busy.value = p.slug
    await billingService.startCheckout(p.slug, cycle.value === 'yearly' ? 'yearly' : 'monthly')
  } catch (e: any) {
    alert(e.message || 'Erro ao iniciar o checkout')
    busy.value = null
  }
}
</script>

<style scoped>
.pricing-container { min-height: 100vh; background: #f8fafc; color: #0f172a; font-family: 'Inter', system-ui, sans-serif; }
.navbar { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.9); backdrop-filter: blur(10px); border-bottom: 1px solid #e2e8f0; }
.nav-content { max-width: 1180px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
.logo-text { font-size: 22px; font-weight: 800; background: linear-gradient(135deg,#16a34a,#0d9488); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-actions { display: flex; gap: 10px; }
.btn { padding: 9px 16px; border-radius: 10px; font-weight: 600; font-size: 14px; text-decoration: none; cursor: pointer; border: 0; transition: .2s; }
.btn-ghost { color: #334155; }
.btn-ghost:hover { background: #f1f5f9; }
.btn-primary { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; }
.btn-primary:hover { filter: brightness(1.05); transform: translateY(-1px); }

.hero { max-width: 820px; margin: 0 auto; padding: 56px 20px 8px; text-align: center; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; background: #ecfdf5; color: #047857; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600; }
.pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; animation: pulse 1.6s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
.hero-title { font-size: 40px; font-weight: 800; margin: 18px 0 12px; letter-spacing: -.02em; }
.hero-desc { color: #475569; font-size: 17px; line-height: 1.6; }
.cycle-toggle { display: inline-flex; margin-top: 26px; background: #fff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 4px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
.cycle-toggle button { border: 0; background: transparent; padding: 9px 20px; border-radius: 999px; font-weight: 600; color: #475569; cursor: pointer; font-size: 14px; }
.cycle-toggle button.active { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; }
.save-tag { font-size: 11px; opacity: .9; }

.plans { max-width: 1240px; margin: 0 auto; padding: 40px 20px 70px; }
.loading { text-align: center; color: #94a3b8; padding: 60px; }
.plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; align-items: start; }
.plan-card { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 26px 22px; box-shadow: 0 1px 3px rgba(0,0,0,.04); display: flex; flex-direction: column; }
.plan-card.highlight { border-color: #16a34a; box-shadow: 0 12px 34px rgba(22,163,74,.16); transform: translateY(-6px); }
.ribbon { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; white-space: nowrap; }
.off-badge { position: absolute; top: 16px; right: 16px; background: #16a34a; color: #fff; font-size: 12px; font-weight: 700; padding: 3px 9px; border-radius: 8px; }
.plan-name { font-size: 19px; font-weight: 800; margin: 6px 0 4px; }
.plan-desc { color: #64748b; font-size: 13px; min-height: 54px; line-height: 1.45; }
.plan-price { display: flex; align-items: baseline; gap: 3px; margin: 8px 0 2px; }
.currency { font-size: 16px; font-weight: 700; color: #16a34a; }
.amount { font-size: 32px; font-weight: 800; }
.period { color: #94a3b8; font-size: 14px; }
.users-line { color: #94a3b8; font-size: 12px; margin-bottom: 14px; }
.plan-cta { width: 100%; padding: 12px; border-radius: 11px; border: 1px solid #cbd5e1; background: #fff; color: #0f172a; font-weight: 700; cursor: pointer; transition: .2s; }
.plan-cta:hover { background: #f1f5f9; }
.plan-cta.primary { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; border: 0; }
.plan-cta.primary:hover { filter: brightness(1.05); }
.plan-cta:disabled { opacity: .6; cursor: default; }
.features { list-style: none; padding: 0; margin: 18px 0 0; display: flex; flex-direction: column; gap: 9px; }
.features li { display: flex; gap: 8px; font-size: 13.5px; color: #334155; line-height: 1.4; }
.check { color: #16a34a; font-weight: 800; }
.fine-print { text-align: center; color: #94a3b8; font-size: 13px; margin-top: 34px; }
@media (max-width: 640px) { .hero-title { font-size: 30px; } .plan-card.highlight { transform: none; } }
</style>
