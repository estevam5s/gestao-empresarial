<template>
  <div class="admin">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="brand"><img src="/logo-round.png" alt="" class="brand-img" />GestãoZe <span>Admin</span></div>
      <nav>
        <button v-for="t in tabs" :key="t.id" :class="{ active: tab === t.id }" @click="go(t.id)">
          <span class="ic">{{ t.icon }}</span> {{ t.label }}
        </button>
      </nav>
      <router-link to="/dashboard" class="exit">← Voltar ao app</router-link>
    </aside>

    <!-- Conteúdo -->
    <main class="content">
      <div v-if="msg" class="toast" :class="msgType">{{ msg }}</div>

      <!-- DASHBOARD -->
      <section v-if="tab === 'dashboard'">
        <h1>Dashboard executivo</h1>
        <p v-if="loading" class="muted">Carregando métricas…</p>
        <template v-else-if="ov">
          <div class="cards">
            <div class="kpi"><span>MRR</span><strong>{{ fmtBRL(ov.mrr) }}</strong><small>Receita recorrente mensal</small></div>
            <div class="kpi"><span>ARR</span><strong>{{ fmtBRL(ov.arr) }}</strong><small>Receita recorrente anual</small></div>
            <div class="kpi"><span>ARPU</span><strong>{{ fmtBRL(ov.arpu) }}</strong><small>Receita média por pagante</small></div>
            <div class="kpi"><span>LTV</span><strong>{{ fmtBRL(ov.ltv) }}</strong><small>Valor do tempo de vida</small></div>
            <div class="kpi"><span>Churn</span><strong>{{ fmtPct(ov.churnRate) }}</strong><small>Taxa de cancelamento</small></div>
            <div class="kpi"><span>Conversão</span><strong>{{ fmtPct(ov.conversion) }}</strong><small>Grátis → pagante</small></div>
          </div>
          <div class="cards small">
            <div class="kpi2"><strong>{{ ov.totalUsers }}</strong><span>Usuários</span></div>
            <div class="kpi2"><strong>{{ ov.activeUsers }}</strong><span>Ativos</span></div>
            <div class="kpi2"><strong>{{ ov.trialUsers }}</strong><span>Em teste</span></div>
            <div class="kpi2"><strong>{{ ov.payingUsers }}</strong><span>Pagantes</span></div>
            <div class="kpi2"><strong>{{ ov.canceledUsers }}</strong><span>Cancelados</span></div>
            <div class="kpi2"><strong>{{ ov.newThisMonth }}</strong><span>Novos no mês</span></div>
          </div>
          <div class="panel-row">
            <div class="panel">
              <h3>Novos cadastros (6 meses)</h3>
              <div class="bars">
                <div v-for="(b, i) in ov.signupByMonth" :key="i" class="bar-col">
                  <div class="bar" :style="{ height: barH(b.value) + 'px' }"><span>{{ b.value }}</span></div>
                  <small>{{ b.label }}</small>
                </div>
              </div>
            </div>
            <div class="panel">
              <h3>Distribuição por plano</h3>
              <div v-for="(c, slug) in ov.byPlan" :key="slug" class="dist-row">
                <span class="dist-name">{{ slug }}</span>
                <div class="dist-bar"><div :style="{ width: distW(c) + '%' }"></div></div>
                <span class="dist-val">{{ c }}</span>
              </div>
            </div>
          </div>
        </template>
      </section>

      <!-- USUÁRIOS -->
      <section v-if="tab === 'users'">
        <h1>Usuários e clientes</h1>
        <input v-model="userSearch" class="search" placeholder="Buscar por nome, e-mail ou usuário…" />
        <table class="tbl">
          <thead><tr><th>Usuário</th><th>E-mail</th><th>Plano</th><th>Status</th><th>Criado</th><th>Ações</th></tr></thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td><strong>{{ u.name || u.username }}</strong><br /><small class="muted">@{{ u.username }} {{ u.role==='admin' ? '· admin' : '' }}</small></td>
              <td>{{ u.email }}</td>
              <td><span class="tag">{{ u.subscription?.plan_slug || u.plan_slug }}</span></td>
              <td>
                <span class="badge" :class="u.is_active ? 'b-ok' : 'b-off'">{{ u.is_active ? 'Ativo' : 'Suspenso' }}</span>
                <small v-if="u.subscription" class="muted"> · {{ u.subscription.status }}</small>
              </td>
              <td>{{ fmtDate(u.created_at) }}</td>
              <td class="row-actions">
                <button v-if="u.is_active" class="mini warn" @click="toggleActive(u, false)">Suspender</button>
                <button v-else class="mini ok" @click="toggleActive(u, true)">Reativar</button>
                <button class="mini danger" @click="askDelete(u)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ASSINATURAS -->
      <section v-if="tab === 'subs'">
        <h1>Assinaturas</h1>
        <table class="tbl">
          <thead><tr><th>Usuário</th><th>Plano</th><th>Ciclo</th><th>Status</th><th>Renova/expira</th><th>Stripe</th></tr></thead>
          <tbody>
            <tr v-for="s in subs" :key="s.user_id">
              <td><small class="muted">{{ s.user_id.slice(0,8) }}</small></td>
              <td><span class="tag">{{ s.plan_slug }}</span></td>
              <td>{{ s.billing_cycle }}</td>
              <td><span class="badge" :class="s.cancel_at_period_end ? 'b-warn' : 'b-ok'">{{ s.cancel_at_period_end ? 'cancelando' : s.status }}</span></td>
              <td>{{ fmtDate(s.current_period_end) }}</td>
              <td><small class="muted">{{ s.stripe_subscription_id ? '✓ ' + s.stripe_subscription_id.slice(0,14) : '—' }}</small></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- PLANOS -->
      <section v-if="tab === 'plans'">
        <h1>Planos</h1>
        <p class="muted">Edite preços e limites. Mudanças de preço aqui não alteram o Stripe automaticamente (somente exibição/limites).</p>
        <div v-for="p in plans" :key="p.slug" class="plan-edit">
          <div class="plan-edit-head">
            <strong>{{ p.name }}</strong> <span class="tag">{{ p.slug }}</span>
            <span v-if="p.highlight" class="badge b-ok">destaque</span>
          </div>
          <div class="plan-fields">
            <label>Mensal R$ <input type="number" v-model.number="p.monthly_price" /></label>
            <label>Anual R$ <input type="number" v-model.number="p.yearly_price" /></label>
            <label>Produtos <input type="number" v-model.number="p.limits.produtos" /></label>
            <label>Usuários <input type="number" v-model.number="p.limits.usuarios" /></label>
            <label>Fornecedores <input type="number" v-model.number="p.limits.fornecedores" /></label>
            <button class="mini ok" @click="savePlan(p)">Salvar</button>
          </div>
        </div>
      </section>

      <!-- CUPONS -->
      <section v-if="tab === 'coupons'">
        <h1>Promoções e cupons</h1>
        <div class="coupon-form">
          <input v-model="newCoupon.code" placeholder="CÓDIGO (ex: BEMVINDO10)" />
          <input v-model.number="newCoupon.percent_off" type="number" placeholder="% off" />
          <select v-model="newCoupon.duration">
            <option value="once">Uma vez</option>
            <option value="repeating">Recorrente (meses)</option>
            <option value="forever">Para sempre</option>
          </select>
          <input v-if="newCoupon.duration === 'repeating'" v-model.number="newCoupon.months" type="number" placeholder="meses" />
          <button class="mini ok" @click="createCoupon">Criar cupom</button>
        </div>
        <div class="quick-coupons">
          <button class="chip" @click="quickCoupon('BEMVINDO10', 10)">+ 10% primeira compra</button>
          <button class="chip" @click="quickCoupon('ANUAL20', 20)">+ 20% plano anual</button>
          <button class="chip" @click="quickCoupon('BLACKFRIDAY30', 30)">+ 30% Black Friday</button>
        </div>
        <table class="tbl">
          <thead><tr><th>Código(s)</th><th>Desconto</th><th>Duração</th><th>Resgates</th><th></th></tr></thead>
          <tbody>
            <tr v-for="c in coupons" :key="c.id">
              <td><span v-for="cd in c.codes" :key="cd.id" class="tag">{{ cd.code }}</span><span v-if="!c.codes.length" class="muted">{{ c.id }}</span></td>
              <td>{{ c.percent_off ? c.percent_off + '%' : fmtBRL((c.amount_off||0)/100) }}</td>
              <td>{{ c.duration }}{{ c.duration_in_months ? ' ('+c.duration_in_months+'m)' : '' }}</td>
              <td>{{ c.times_redeemed }}</td>
              <td><button class="mini danger" @click="removeCoupon(c.id)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- FEEDBACK / LEADS / ORIGEM -->
      <section v-if="tab === 'feedback'">
        <h1>Feedback, leads e origem</h1>
        <h3>Motivos de cancelamento</h3>
        <table class="tbl">
          <thead><tr><th>Plano</th><th>Motivo</th><th>Comentário</th><th>Data</th></tr></thead>
          <tbody>
            <tr v-for="f in feedback" :key="f.id"><td><span class="tag">{{ f.plan_slug }}</span></td><td>{{ f.reason }}</td><td>{{ f.comment || '—' }}</td><td>{{ fmtDate(f.created_at) }}</td></tr>
            <tr v-if="!feedback.length"><td colspan="4" class="muted">Sem cancelamentos registrados.</td></tr>
          </tbody>
        </table>
        <h3>Origem dos cadastros (onde nos encontraram)</h3>
        <div class="dist">
          <div v-for="(c, src) in sourceCounts" :key="src" class="dist-row">
            <span class="dist-name">{{ src }}</span><div class="dist-bar"><div :style="{ width: srcW(c) + '%' }"></div></div><span class="dist-val">{{ c }}</span>
          </div>
          <p v-if="!sources.length" class="muted">Sem dados de origem ainda.</p>
        </div>
        <h3>Leads e contatos</h3>
        <table class="tbl">
          <thead><tr><th>Nome</th><th>E-mail</th><th>Mensagem</th><th>Data</th></tr></thead>
          <tbody>
            <tr v-for="l in leadsAndContacts" :key="l.id"><td>{{ l.name }}</td><td>{{ l.email }}</td><td>{{ (l.message || l.subject || '').slice(0,60) }}</td><td>{{ fmtDate(l.created_at) }}</td></tr>
            <tr v-if="!leadsAndContacts.length"><td colspan="4" class="muted">Sem leads/contatos.</td></tr>
          </tbody>
        </table>
      </section>

      <!-- SAÚDE -->
      <section v-if="tab === 'health'">
        <h1>Saúde do SaaS</h1>
        <div v-for="h in healthChecks" :key="h.name" class="health-row">
          <span class="dot" :class="h.ok ? 'g' : 'r'"></span>
          <strong>{{ h.name }}</strong>
          <span class="muted">{{ h.detail }}</span>
        </div>
        <button class="mini ok" style="margin-top:14px" @click="loadHealth">Reverificar</button>
      </section>

      <!-- LOGS -->
      <section v-if="tab === 'logs'">
        <h1>Logs e auditoria</h1>
        <table class="tbl">
          <thead><tr><th>Quando</th><th>Usuário</th><th>Ação</th><th>Recurso</th><th>Sev.</th></tr></thead>
          <tbody>
            <tr v-for="l in logs" :key="l.id"><td>{{ fmtDateTime(l.created_at) }}</td><td>{{ l.username }}</td><td>{{ l.action }}</td><td>{{ l.resource }}</td><td><span class="badge" :class="sevClass(l.severity)">{{ l.severity }}</span></td></tr>
            <tr v-if="!logs.length"><td colspan="5" class="muted">Sem logs registrados.</td></tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Modal excluir -->
    <div v-if="deleteTarget" class="overlay" @click.self="deleteTarget = null">
      <div class="modal">
        <h3>Excluir definitivamente?</h3>
        <p class="muted">Remove <strong>{{ deleteTarget.email }}</strong> e todos os dados. O e-mail fica liberado para novo cadastro. Esta ação é irreversível.</p>
        <div class="modal-actions">
          <button class="mini" @click="deleteTarget = null">Cancelar</button>
          <button class="mini danger" @click="confirmDelete">Excluir tudo</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService, fmtBRL, fmtPct, type Overview } from '@/services/adminService'

const route = useRoute()
const router = useRouter()
const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Usuários', icon: '👥' },
  { id: 'subs', label: 'Assinaturas', icon: '💳' },
  { id: 'plans', label: 'Planos', icon: '🧩' },
  { id: 'coupons', label: 'Cupons', icon: '🎟️' },
  { id: 'feedback', label: 'Feedback & Leads', icon: '💬' },
  { id: 'health', label: 'Saúde', icon: '🩺' },
  { id: 'logs', label: 'Logs', icon: '📜' },
]
const tab = ref<string>((route.query.tab as string) || 'dashboard')
const loading = ref(false)
const msg = ref(''); const msgType = ref('ok')

const ov = ref<Overview | null>(null)
const users = ref<any[]>([]); const userSearch = ref('')
const subs = ref<any[]>([])
const plans = ref<any[]>([])
const coupons = ref<any[]>([])
const feedback = ref<any[]>([])
const leads = ref<any[]>([]); const contacts = ref<any[]>([]); const sources = ref<any[]>([])
const logs = ref<any[]>([])
const healthChecks = ref<any[]>([])
const deleteTarget = ref<any>(null)
const newCoupon = ref<any>({ code: '', percent_off: 10, duration: 'once', months: 3 })

const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'
const fmtDateTime = (d: string | null) => d ? new Date(d).toLocaleString('pt-BR') : '—'
const flash = (m: string, t = 'ok') => { msg.value = m; msgType.value = t; setTimeout(() => (msg.value = ''), 5000) }
const sevClass = (s: string) => s === 'error' || s === 'critical' ? 'b-off' : s === 'warning' ? 'b-warn' : 'b-ok'

const filteredUsers = computed(() => {
  const q = userSearch.value.toLowerCase()
  return users.value.filter((u) => !q || [u.name, u.email, u.username].some((x) => (x || '').toLowerCase().includes(q)))
})
const leadsAndContacts = computed(() => [...leads.value, ...contacts.value].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)))
const sourceCounts = computed(() => { const m: Record<string, number> = {}; sources.value.forEach((s) => { const k = s.source || 'desconhecido'; m[k] = (m[k] || 0) + 1 }); return m })

const barH = (v: number) => { const max = Math.max(1, ...(ov.value?.signupByMonth || []).map((b) => b.value)); return 20 + (v / max) * 90 }
const distW = (v: number) => { const max = Math.max(1, ...Object.values(ov.value?.byPlan || {})); return (v / max) * 100 }
const srcW = (v: number) => { const max = Math.max(1, ...Object.values(sourceCounts.value)); return (v / max) * 100 }

async function go(id: string) { tab.value = id; router.replace({ query: { tab: id } }); await loadTab(id) }

async function loadTab(id: string) {
  try {
    if (id === 'dashboard' && !ov.value) { loading.value = true; ov.value = await adminService.getOverview() }
    else if (id === 'users' && !users.value.length) users.value = await adminService.listUsers()
    else if (id === 'subs' && !subs.value.length) subs.value = await adminService.listSubscriptions()
    else if (id === 'plans' && !plans.value.length) plans.value = await adminService.listPlans()
    else if (id === 'coupons') await loadCoupons()
    else if (id === 'feedback') { feedback.value = await adminService.listFeedback(); leads.value = await adminService.listLeads(); contacts.value = await adminService.listContacts(); sources.value = await adminService.listSignupSources() }
    else if (id === 'health') await loadHealth()
    else if (id === 'logs' && !logs.value.length) logs.value = await adminService.listLogs()
  } catch (e: any) { flash(e.message || 'Erro ao carregar', 'err') } finally { loading.value = false }
}
async function loadCoupons() { try { const r: any = await adminService.listCoupons(); coupons.value = r.coupons || [] } catch (e: any) { flash(e.message, 'err') } }
async function loadHealth() { healthChecks.value = await adminService.health() }

async function toggleActive(u: any, active: boolean) {
  try { await adminService.setActive(u.id, active); u.is_active = active; flash(active ? 'Usuário reativado.' : 'Usuário suspenso.') }
  catch (e: any) { flash(e.message, 'err') }
}
function askDelete(u: any) { deleteTarget.value = u }
async function confirmDelete() {
  try { await adminService.deleteUser(deleteTarget.value.id); users.value = users.value.filter((x) => x.id !== deleteTarget.value.id); flash('Usuário excluído.'); deleteTarget.value = null }
  catch (e: any) { flash(e.message, 'err') }
}
async function savePlan(p: any) {
  try { await adminService.updatePlan(p.slug, { monthly_price: p.monthly_price, yearly_price: p.yearly_price, limits: p.limits }); flash(`Plano ${p.name} salvo.`) }
  catch (e: any) { flash(e.message, 'err') }
}
async function createCoupon() {
  try { await adminService.createCoupon({ ...newCoupon.value }); flash('Cupom criado na Stripe.'); await loadCoupons() }
  catch (e: any) { flash(e.message, 'err') }
}
function quickCoupon(code: string, pct: number) { newCoupon.value = { code, percent_off: pct, duration: 'once', months: 3 }; createCoupon() }
async function removeCoupon(id: string) {
  try { await adminService.deleteCoupon(id); flash('Cupom excluído.'); await loadCoupons() } catch (e: any) { flash(e.message, 'err') }
}

onMounted(() => loadTab(tab.value))
</script>

<style scoped>
.admin { display: flex; min-height: 100vh; background: #0f172a; color: #e2e8f0; font-family: 'Inter', system-ui, sans-serif; }
.sidebar { width: 230px; background: #111827; border-right: 1px solid #1f2937; padding: 20px 14px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
.brand { font-size: 18px; font-weight: 800; margin-bottom: 22px; padding: 0 8px; display: flex; align-items: center; gap: 8px; }
.brand-img { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }
.brand span { color: #34d399; }
.sidebar nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.sidebar nav button { display: flex; align-items: center; gap: 10px; background: none; border: 0; color: #94a3b8; padding: 10px 12px; border-radius: 9px; font-weight: 600; font-size: 14px; cursor: pointer; text-align: left; }
.sidebar nav button:hover { background: #1f2937; color: #e2e8f0; }
.sidebar nav button.active { background: linear-gradient(135deg,#16a34a,#0d9488); color: #fff; }
.ic { width: 18px; text-align: center; }
.exit { color: #64748b; text-decoration: none; font-size: 13px; padding: 8px; }
.exit:hover { color: #34d399; }
.content { flex: 1; padding: 28px 32px; overflow-x: auto; }
h1 { font-size: 24px; font-weight: 800; margin-bottom: 18px; }
h3 { font-size: 15px; font-weight: 700; margin: 26px 0 10px; color: #cbd5e1; }
.muted { color: #64748b; }
.toast { position: fixed; top: 16px; right: 16px; padding: 12px 18px; border-radius: 10px; font-weight: 600; z-index: 100; }
.toast.ok { background: #064e3b; color: #6ee7b7; } .toast.err { background: #7f1d1d; color: #fca5a5; }
.cards { display: grid; grid-template-columns: repeat(auto-fit,minmax(170px,1fr)); gap: 14px; }
.cards.small { margin-top: 14px; grid-template-columns: repeat(auto-fit,minmax(110px,1fr)); }
.kpi { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 4px; }
.kpi span { font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; font-weight: 700; }
.kpi strong { font-size: 26px; font-weight: 800; color: #fff; }
.kpi small { color: #64748b; font-size: 11px; }
.kpi2 { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 14px; text-align: center; }
.kpi2 strong { font-size: 24px; font-weight: 800; display: block; color: #34d399; }
.kpi2 span { font-size: 12px; color: #94a3b8; }
.panel-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
.panel { background: #1e293b; border: 1px solid #334155; border-radius: 14px; padding: 18px; }
.bars { display: flex; align-items: flex-end; gap: 14px; height: 140px; padding-top: 10px; }
.bar-col { flex: 1; text-align: center; }
.bar { background: linear-gradient(180deg,#34d399,#0d9488); border-radius: 6px 6px 0 0; position: relative; min-height: 20px; display: flex; align-items: flex-start; justify-content: center; }
.bar span { font-size: 11px; color: #fff; margin-top: 2px; font-weight: 700; }
.bar-col small { color: #64748b; font-size: 11px; }
.dist-row { display: flex; align-items: center; gap: 10px; margin: 7px 0; }
.dist-name { width: 90px; font-size: 13px; text-transform: capitalize; }
.dist-bar { flex: 1; background: #334155; border-radius: 6px; height: 10px; overflow: hidden; }
.dist-bar div { height: 100%; background: linear-gradient(90deg,#34d399,#0d9488); }
.dist-val { width: 30px; text-align: right; font-weight: 700; font-size: 13px; }
.search { width: 100%; max-width: 380px; padding: 10px 14px; border-radius: 10px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; margin-bottom: 14px; }
.tbl { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 12px; overflow: hidden; font-size: 13.5px; }
.tbl th { text-align: left; padding: 11px 14px; background: #0f172a; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
.tbl td { padding: 11px 14px; border-top: 1px solid #334155; vertical-align: middle; }
.tag { display: inline-block; background: #334155; color: #cbd5e1; padding: 2px 9px; border-radius: 6px; font-size: 12px; font-weight: 600; margin-right: 4px; text-transform: capitalize; }
.badge { font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 999px; }
.b-ok { background: #064e3b; color: #6ee7b7; } .b-warn { background: #78350f; color: #fcd34d; } .b-off { background: #7f1d1d; color: #fca5a5; }
.row-actions { display: flex; gap: 6px; }
.mini { padding: 6px 11px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; font-weight: 600; font-size: 12px; cursor: pointer; }
.mini:hover { background: #334155; }
.mini.ok { background: #16a34a; border: 0; color: #fff; } .mini.warn { color: #fcd34d; } .mini.danger { color: #fca5a5; border-color: #7f1d1d; }
.plan-edit { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
.plan-edit-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.plan-fields { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end; }
.plan-fields label { font-size: 12px; color: #94a3b8; display: flex; flex-direction: column; gap: 4px; }
.plan-fields input { width: 90px; padding: 7px 9px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #e2e8f0; }
.coupon-form { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
.coupon-form input, .coupon-form select { padding: 9px 12px; border-radius: 9px; border: 1px solid #334155; background: #1e293b; color: #e2e8f0; }
.quick-coupons { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
.chip { background: #1e293b; border: 1px dashed #475569; color: #94a3b8; padding: 7px 12px; border-radius: 999px; cursor: pointer; font-size: 13px; }
.chip:hover { border-color: #34d399; color: #34d399; }
.health-row { display: flex; align-items: center; gap: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px; }
.dot { width: 11px; height: 11px; border-radius: 50%; } .dot.g { background: #34d399; box-shadow: 0 0 8px #34d399; } .dot.r { background: #f87171; box-shadow: 0 0 8px #f87171; }
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px; }
.modal { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 26px; max-width: 420px; }
.modal h3 { margin: 0 0 8px; color: #fff; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
@media (max-width: 860px) { .panel-row { grid-template-columns: 1fr; } .sidebar { width: 64px; } .sidebar .brand, .sidebar nav button span:not(.ic), .exit { display: none; } }
</style>
