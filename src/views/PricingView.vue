<template>
  <div class="pricing-container">
    <!-- Navbar simples -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">
          <span class="logo-text">GestaoZe</span>
        </router-link>
        <router-link to="/" class="btn btn-outline">← Voltar</router-link>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pricing-hero">
      <h1 class="hero-title">Escolha o plano ideal para seu negócio</h1>
      <p class="hero-subtitle">
        Todos os planos incluem 14 dias de teste grátis. Sem compromisso.
      </p>

      <!-- Billing Toggle -->
      <div class="billing-toggle">
        <button
          :class="{ 'active': billingCycle === 'monthly' }"
          @click="billingCycle = 'monthly'"
        >
          Mensal
        </button>
        <button
          :class="{ 'active': billingCycle === 'yearly' }"
          @click="billingCycle = 'yearly'"
        >
          Anual
          <span class="discount-badge">Economize 20%</span>
        </button>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pricing-section">
      <div class="pricing-grid">
        <div
          v-for="plan in plans"
          :key="plan.slug"
          class="pricing-card"
          :class="{
            'popular': plan.isPopular,
            'recommended': plan.isRecommended
          }"
        >
          <div v-if="plan.isRecommended" class="badge">Mais Popular</div>

          <div class="card-header">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-description">{{ plan.description }}</p>
          </div>

          <div class="card-price">
            <div class="price">
              <span class="currency">R$</span>
              <span class="amount">{{ getPrice(plan) }}</span>
              <span class="period">/mês</span>
            </div>
            <p v-if="billingCycle === 'yearly'" class="billing-info">
              Cobrado anualmente (R$ {{ plan.priceYearly.toFixed(2) }})
            </p>
          </div>

          <div class="card-features">
            <div class="feature-item">
              <span class="check-icon">✓</span>
              <span>{{ plan.maxUsers === -1 ? 'Usuários ilimitados' : `Até ${plan.maxUsers} usuários` }}</span>
            </div>
            <div class="feature-item">
              <span class="check-icon">✓</span>
              <span>{{ plan.maxStorage === -1 ? 'Armazenamento ilimitado' : `${plan.maxStorage}GB de armazenamento` }}</span>
            </div>
            <div v-for="feature in getFeaturesList(plan.features)" :key="feature" class="feature-item">
              <span class="check-icon">✓</span>
              <span>{{ feature }}</span>
            </div>
          </div>

          <div class="card-action">
            <router-link
              :to="{ name: 'register', query: { plan: plan.slug } }"
              class="btn"
              :class="plan.isRecommended ? 'btn-primary' : 'btn-outline'"
            >
              Começar teste grátis
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Comparison -->
    <section class="comparison-section">
      <h2 class="section-title">Comparação detalhada de recursos</h2>

      <div class="comparison-table">
        <table>
          <thead>
            <tr>
              <th class="feature-col">Recursos</th>
              <th v-for="plan in plans" :key="plan.slug">{{ plan.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feature in comparisonFeatures" :key="feature.name">
              <td class="feature-col">
                <strong>{{ feature.name }}</strong>
                <p v-if="feature.description" class="feature-desc">{{ feature.description }}</p>
              </td>
              <td v-for="plan in plans" :key="plan.slug" class="comparison-cell">
                <span v-if="feature.getValue">
                  {{ feature.getValue(plan) }}
                </span>
                <span v-else-if="plan.features[feature.key]" class="check">✓</span>
                <span v-else class="cross">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <h2 class="section-title">Perguntas frequentes</h2>

      <div class="faq-grid">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <h3 class="faq-question">{{ faq.question }}</h3>
          <p class="faq-answer">{{ faq.answer }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <h2 class="cta-title">Pronto para começar?</h2>
      <p class="cta-subtitle">Experimente grátis por 14 dias. Não é necessário cartão de crédito.</p>
      <router-link to="/register" class="btn btn-large btn-white">
        Começar agora
      </router-link>
    </section>

    <!-- Footer simples -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 GestaoZe. Todos os direitos reservados.</p>
        <div class="footer-links">
          <router-link to="/legal/terms">Termos</router-link>
          <router-link to="/legal/privacy">Privacidade</router-link>
          <router-link to="/contact">Contato</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const billingCycle = ref<'monthly' | 'yearly'>('monthly')

interface Plan {
  name: string
  slug: string
  description: string
  priceMonthly: number
  priceYearly: number
  maxUsers: number
  maxStorage: number
  features: Record<string, boolean>
  isPopular: boolean
  isRecommended: boolean
}

const plans: Plan[] = [
  {
    name: 'Básico',
    slug: 'basico',
    description: 'Perfeito para pequenos negócios que estão começando',
    priceMonthly: 49.90,
    priceYearly: 479.00,
    maxUsers: 5,
    maxStorage: 1,
    features: {
      dashboard: true,
      inventory: true,
      basicReports: true,
      emailSupport: true,
      apiAccess: false,
      aiAnalytics: false,
      prioritySupport: false,
      customBranding: false,
      advancedReports: false,
      financialModule: false,
      employeeManagement: false
    },
    isPopular: false,
    isRecommended: false
  },
  {
    name: 'Profissional',
    slug: 'profissional',
    description: 'Para empresas em crescimento que precisam de mais recursos',
    priceMonthly: 99.90,
    priceYearly: 959.00,
    maxUsers: 20,
    maxStorage: 5,
    features: {
      dashboard: true,
      inventory: true,
      basicReports: true,
      advancedReports: true,
      financialModule: true,
      employeeManagement: true,
      emailSupport: true,
      apiAccess: true,
      aiAnalytics: true,
      prioritySupport: false,
      customBranding: false,
      dedicatedSupport: false
    },
    isPopular: true,
    isRecommended: true
  },
  {
    name: 'Empresarial',
    slug: 'empresarial',
    description: 'Solução completa para grandes empresas',
    priceMonthly: 199.90,
    priceYearly: 1919.00,
    maxUsers: -1,
    maxStorage: -1,
    features: {
      dashboard: true,
      inventory: true,
      basicReports: true,
      advancedReports: true,
      financialModule: true,
      employeeManagement: true,
      emailSupport: true,
      phoneSupport: true,
      apiAccess: true,
      aiAnalytics: true,
      prioritySupport: true,
      customBranding: true,
      dedicatedSupport: true,
      customIntegrations: true
    },
    isPopular: false,
    isRecommended: false
  }
]

const comparisonFeatures = [
  {
    name: 'Usuários',
    key: 'users',
    getValue: (plan: Plan) => plan.maxUsers === -1 ? 'Ilimitado' : `Até ${plan.maxUsers}`
  },
  {
    name: 'Armazenamento',
    key: 'storage',
    getValue: (plan: Plan) => plan.maxStorage === -1 ? 'Ilimitado' : `${plan.maxStorage}GB`
  },
  {
    name: 'Dashboard completo',
    key: 'dashboard',
    description: 'Visualização em tempo real de métricas importantes'
  },
  {
    name: 'Gestão de estoque',
    key: 'inventory',
    description: 'Controle completo de produtos e inventário'
  },
  {
    name: 'Relatórios básicos',
    key: 'basicReports',
    description: 'Relatórios de vendas e estoque'
  },
  {
    name: 'Relatórios avançados',
    key: 'advancedReports',
    description: 'Analytics detalhado com gráficos customizados'
  },
  {
    name: 'Módulo financeiro',
    key: 'financialModule',
    description: 'Gestão completa de finanças e fluxo de caixa'
  },
  {
    name: 'Gestão de funcionários',
    key: 'employeeManagement',
    description: 'Controle de ponto, pagamentos e comissões'
  },
  {
    name: 'IA e Analytics',
    key: 'aiAnalytics',
    description: 'Análise preditiva e sugestões inteligentes'
  },
  {
    name: 'API de integração',
    key: 'apiAccess',
    description: 'Conecte com outros sistemas via API'
  },
  {
    name: 'Suporte por email',
    key: 'emailSupport'
  },
  {
    name: 'Suporte telefônico',
    key: 'phoneSupport'
  },
  {
    name: 'Suporte prioritário',
    key: 'prioritySupport',
    description: 'Atendimento em até 2 horas'
  },
  {
    name: 'Marca personalizada',
    key: 'customBranding',
    description: 'White label com sua marca'
  },
  {
    name: 'Gerente dedicado',
    key: 'dedicatedSupport'
  },
  {
    name: 'Integrações customizadas',
    key: 'customIntegrations'
  }
]

const faqs = [
  {
    question: 'Como funciona o período de teste?',
    answer: 'Todos os planos incluem 14 dias de teste grátis com acesso completo aos recursos. Não é necessário cadastrar cartão de crédito.'
  },
  {
    question: 'Posso mudar de plano depois?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. A diferença será calculada proporcionalmente.'
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartões de crédito (Visa, Mastercard, Amex), boleto bancário e PIX.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, você pode cancelar seu plano a qualquer momento. Não há multas ou taxas de cancelamento.'
  },
  {
    question: 'Os dados ficam salvos se eu cancelar?',
    answer: 'Sim, seus dados ficam salvos por 30 dias após o cancelamento. Você pode reativar sua conta a qualquer momento neste período.'
  },
  {
    question: 'Existe desconto para pagamento anual?',
    answer: 'Sim! Oferecemos 20% de desconto para pagamentos anuais em todos os planos.'
  }
]

function getPrice(plan: Plan): string {
  if (billingCycle.value === 'yearly') {
    return (plan.priceYearly / 12).toFixed(2).replace('.', ',')
  }
  return plan.priceMonthly.toFixed(2).replace('.', ',')
}

function getFeaturesList(features: Record<string, boolean>): string[] {
  const featureNames: Record<string, string> = {
    dashboard: 'Dashboard completo',
    inventory: 'Gestão de estoque',
    basicReports: 'Relatórios básicos',
    advancedReports: 'Relatórios avançados',
    financialModule: 'Módulo financeiro',
    employeeManagement: 'Gestão de funcionários',
    emailSupport: 'Suporte por email',
    phoneSupport: 'Suporte telefônico',
    apiAccess: 'Acesso à API',
    aiAnalytics: 'IA e Analytics',
    prioritySupport: 'Suporte prioritário',
    customBranding: 'Marca personalizada',
    dedicatedSupport: 'Gerente dedicado',
    customIntegrations: 'Integrações customizadas'
  }

  return Object.entries(features)
    .filter(([_, value]) => value)
    .map(([key, _]) => featureNames[key])
    .filter(Boolean)
    .slice(2, 8) // Pega apenas alguns features principais
}
</script>

<style scoped>
.pricing-container {
  min-height: 100vh;
  background: #f7fafc;
}

/* Navbar */
.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.btn-outline {
  background: transparent;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

.btn-white {
  background: white;
  color: #667eea;
}

/* Hero */
.pricing-hero {
  padding: 80px 2rem 60px;
  text-align: center;
  background: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #718096;
  margin-bottom: 3rem;
}

.billing-toggle {
  display: inline-flex;
  background: #edf2f7;
  border-radius: 12px;
  padding: 0.5rem;
  gap: 0.5rem;
}

.billing-toggle button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #718096;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.billing-toggle button.active {
  background: white;
  color: #1a202c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.discount-badge {
  background: #48bb78;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* Pricing Cards */
.pricing-section {
  padding: 60px 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  align-items: start;
}

.pricing-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.pricing-card.recommended {
  border-color: #667eea;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.pricing-card.recommended:hover {
  transform: scale(1.05) translateY(-8px);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.card-header {
  margin-bottom: 2rem;
}

.plan-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.plan-description {
  color: #718096;
  line-height: 1.6;
}

.card-price {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.currency {
  font-size: 1.25rem;
  color: #718096;
  font-weight: 600;
}

.amount {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1;
}

.period {
  font-size: 1rem;
  color: #718096;
}

.billing-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #718096;
}

.card-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.check-icon {
  color: #48bb78;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-action .btn {
  width: 100%;
  justify-content: center;
}

/* Comparison Table */
.comparison-section {
  padding: 80px 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  color: #1a202c;
  margin-bottom: 3rem;
}

.comparison-table {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 1.5rem 1rem;
  text-align: left;
  font-weight: 700;
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
  background: #f7fafc;
}

th:first-child {
  border-radius: 8px 0 0 0;
}

th:last-child {
  border-radius: 0 8px 0 0;
}

td {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.feature-col {
  min-width: 250px;
}

.feature-desc {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.25rem;
}

.comparison-cell {
  text-align: center;
  font-weight: 600;
}

.check {
  color: #48bb78;
  font-size: 1.5rem;
}

.cross {
  color: #cbd5e0;
  font-size: 1.25rem;
}

/* FAQ */
.faq-section {
  padding: 80px 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.faq-grid {
  display: grid;
  gap: 2rem;
}

.faq-item {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.faq-question {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.faq-answer {
  color: #718096;
  line-height: 1.6;
}

/* CTA */
.cta-section {
  padding: 80px 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Footer */
.footer {
  background: #1a202c;
  color: white;
  padding: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

/* Responsivo */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .pricing-card.recommended {
    transform: scale(1);
  }

  .section-title {
    font-size: 2rem;
  }

  .comparison-table {
    padding: 1rem;
  }

  th, td {
    padding: 1rem 0.5rem;
    font-size: 0.9rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
