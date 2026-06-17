<template>
  <div class="ob">
    <div class="ob-head">
      <BrandLogo :size="44" :text-size="24" style="justify-content:center;margin-bottom:12px" />
      <h1>Bem-vindo! Escolha como começar 🎉</h1>
      <p>Sua conta foi criada. Comece grátis ou ative um plano com <strong>7 dias de teste</strong> — sem cobrança hoje.</p>
      <div class="cycle-toggle">
        <button :class="{ active: cycle === 'monthly' }" @click="cycle = 'monthly'">Mensal</button>
        <button :class="{ active: cycle === 'yearly' }" @click="cycle = 'yearly'">Anual (~2 meses grátis)</button>
      </div>
    </div>

    <p v-if="loading" class="loading">Carregando planos…</p>
    <div v-else class="grid">
      <div v-for="p in plans" :key="p.slug" class="card" :class="{ hi: p.highlight }">
        <div v-if="p.highlight" class="tag">Recomendado</div>
        <h3>{{ p.name }}</h3>
        <div class="price">
          <strong>{{ priceFor(p) === 0 ? 'Grátis' : 'R$ ' + fmtNum(priceFor(p)) }}</strong>
          <span>{{ periodLabel(p) }}</span>
        </div>
        <p class="desc">{{ p.description }}</p>
        <button class="cta" :class="{ primary: p.highlight }" :disabled="busy === p.slug" @click="choose(p)">
          {{ busy === p.slug ? 'Aguarde…' : ctaLabel(p) }}
        </button>
      </div>
    </div>

    <button class="skip" @click="$router.push('/dashboard')">Pular e continuar no plano grátis →</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { billingService, type Plan } from '@/services/billingService'
import BrandLogo from '@/components/BrandLogo.vue'

const route = useRoute()
const router = useRouter()
const plans = ref<Plan[]>([])
const loading = ref(true)
const busy = ref<string | null>(null)
const cycle = ref<'monthly' | 'yearly'>((route.query.cycle as any) === 'yearly' ? 'yearly' : 'monthly')

const fmtNum = (v: number) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)
const priceFor = (p: Plan) => p.billing_type === 'free' ? 0 : p.billing_type === 'lifetime' ? Number(p.lifetime_price) : cycle.value === 'yearly' ? Number(p.yearly_price) : Number(p.monthly_price)
const periodLabel = (p: Plan) => p.billing_type === 'free' ? '' : p.billing_type === 'lifetime' ? ' único' : cycle.value === 'yearly' ? '/ano' : '/mês'
const ctaLabel = (p: Plan) => p.billing_type === 'free' ? 'Começar grátis' : p.slug === 'enterprise' ? 'Falar com especialista' : 'Ativar teste de 7 dias'

async function choose(p: Plan) {
  if (p.billing_type === 'free') { router.push('/dashboard'); return }
  if (p.slug === 'enterprise') { router.push('/contact?assunto=enterprise'); return }
  try { busy.value = p.slug; await billingService.startCheckout(p.slug, cycle.value) }
  catch (e: any) { alert(e.message || 'Erro ao iniciar checkout'); busy.value = null }
}

onMounted(async () => {
  try {
    plans.value = await billingService.getPlans()
    // plano pré-selecionado na página de preços → vai direto ao checkout
    const pre = route.query.plan as string
    if (pre) {
      const plan = plans.value.find((x) => x.slug === pre)
      if (plan && plan.billing_type !== 'free' && plan.slug !== 'enterprise') choose(plan)
    }
  } finally { loading.value = false }
})
</script>

<style scoped>
.ob { min-height: 100vh; background: linear-gradient(160deg,#f0fdf4,#f8fafc); padding: 48px 20px 80px; font-family: 'Inter', system-ui, sans-serif; color: #0f172a; }
.ob-head { max-width: 720px; margin: 0 auto 36px; text-align: center; }
.logo-text { font-size: 22px; font-weight: 800; background: linear-gradient(135deg,#16a34a,#0d9488); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
.ob-head h1 { font-size: 30px; font-weight: 800; margin-bottom: 10px; }
.ob-head p { color: #475569; font-size: 16px; }
.cycle-toggle { display: inline-flex; margin-top: 22px; background: #fff; border: 1px solid #e2e8f0; border-radius: 999px; padding: 4px; }
.cycle-toggle button { border: 0; background: transparent; padding: 9px 18px; border-radius: 999px; font-weight: 600; color: #475569; cursor: pointer; font-size: 14px; }
.cycle-toggle button.active { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; }
.loading { text-align: center; color: #94a3b8; }
.grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 16px; }
.card { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px; text-align: center; }
.card.hi { border-color: #16a34a; box-shadow: 0 10px 30px rgba(22,163,74,.15); }
.tag { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 999px; }
.card h3 { font-size: 18px; font-weight: 800; margin: 4px 0 8px; }
.price strong { font-size: 26px; font-weight: 800; } .price span { color: #94a3b8; font-size: 13px; }
.desc { color: #64748b; font-size: 13px; min-height: 56px; margin: 10px 0 14px; line-height: 1.45; }
.cta { width: 100%; padding: 11px; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; font-weight: 700; cursor: pointer; }
.cta.primary { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; border: 0; }
.cta:disabled { opacity: .6; }
.skip { display: block; margin: 36px auto 0; background: none; border: 0; color: #64748b; font-weight: 600; cursor: pointer; font-size: 14px; }
.skip:hover { color: #16a34a; }
</style>
