<template>
  <div class="faq-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo-text">GestaoZe</router-link>
        <router-link to="/" class="btn btn-outline">← Voltar</router-link>
      </div>
    </nav>

    <section class="faq-hero">
      <h1>Perguntas Frequentes</h1>
      <p>Encontre respostas para as dúvidas mais comuns</p>

      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="Buscar...">
      </div>
    </section>

    <section class="faq-content">
      <div class="faq-categories">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="{ 'active': selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="faq-list">
        <div
          v-for="(item, index) in filteredFaqs"
          :key="index"
          class="faq-item"
          :class="{ 'open': openIndex === index }"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <span>{{ item.question }}</span>
            <span class="toggle-icon">{{ openIndex === index ? '−' : '+' }}</span>
          </div>
          <div class="faq-answer" v-if="openIndex === index">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-cta">
      <h2>Ainda tem dúvidas?</h2>
      <p>Nossa equipe está pronta para ajudar</p>
      <router-link to="/contact" class="btn btn-primary">Entrar em contato</router-link>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('Geral')
const openIndex = ref<number | null>(null)

const categories = ['Geral', 'Planos e Preços', 'Pagamentos', 'Segurança', 'Migração', 'Suporte']

const faqs = [
  { category: 'Geral', question: 'Como funciona o período de teste gratuito?', answer: 'Oferecemos 14 dias de teste gratuito em todos os planos. Durante este período, você terá acesso completo a todas as funcionalidades do plano escolhido, sem precisar cadastrar cartão de crédito. Ao final do período, você pode optar por assinar ou não o serviço.' },
  { category: 'Planos e Preços', question: 'Posso mudar de plano a qualquer momento?', answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. No caso de upgrade, a diferença será calculada proporcionalmente. No downgrade, o valor será creditado para o próximo ciclo de cobrança.' },
  { category: 'Pagamentos', question: 'Quais formas de pagamento são aceitas?', answer: 'Aceitamos cartões de crédito (Visa, Mastercard, Amex), boleto bancário e PIX. Também oferecemos desconto de 20% para pagamentos anuais.' },
  { category: 'Segurança', question: 'Os meus dados estão seguros?', answer: 'Sim! Utilizamos criptografia de ponta a ponta (SSL/TLS) e seguimos as melhores práticas de segurança. Somos compliance com LGPD e realizamos backups automáticos diários dos seus dados.' },
  { category: 'Migração', question: 'Posso importar dados do meu sistema atual?', answer: 'Sim! Oferecemos ferramentas de importação para os principais formatos (CSV, Excel). Nossa equipe de suporte também pode auxiliar na migração de dados de outros sistemas.' },
  { category: 'Suporte', question: 'Existe suporte técnico disponível?', answer: 'Sim! Todos os planos incluem suporte por email. Os planos Profissional e Empresarial também incluem suporte prioritário e, no caso do plano Empresarial, suporte por telefone e gerente de conta dedicado.' },
  { category: 'Geral', question: 'Posso usar em vários dispositivos?', answer: 'Sim! O GestaoZe funciona em qualquer dispositivo com acesso à internet: computadores, tablets e smartphones. Também oferecemos aplicativos nativos para iOS e Android.' },
  { category: 'Pagamentos', question: 'Existe contrato de fidelidade?', answer: 'Não! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas de cancelamento. Seus dados ficam salvos por 30 dias caso queira reativar.' },
  { category: 'Segurança', question: 'Vocês são compliance com LGPD?', answer: 'Sim! Somos totalmente compliance com a LGPD (Lei Geral de Proteção de Dados). Você tem total controle sobre seus dados e pode exportá-los ou excluí-los a qualquer momento.' }
]

const filteredFaqs = computed(() => {
  let result = faqs

  if (selectedCategory.value !== 'Geral') {
    result = result.filter(f => f.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(f =>
      f.question.toLowerCase().includes(query) ||
      f.answer.toLowerCase().includes(query)
    )
  }

  return result
})

function toggleFaq(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-container {
  min-height: 100vh;
  background: #f7fafc;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
}

.btn {
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-outline {
  background: transparent;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.faq-hero {
  padding: 60px 2rem;
  text-align: center;
  background: white;
}

.faq-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}

.faq-hero p {
  font-size: 1.25rem;
  color: #718096;
  margin-bottom: 2rem;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.search-box input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.faq-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.faq-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.faq-categories button {
  padding: 0.625rem 1.25rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
}

.faq-categories button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.faq-item.open {
  border-color: #667eea;
}

.faq-question {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1a202c;
  gap: 1rem;
}

.toggle-icon {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  flex-shrink: 0;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #718096;
  line-height: 1.6;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-cta {
  padding: 60px 2rem;
  text-align: center;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.contact-cta h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.contact-cta p {
  color: #718096;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .faq-hero h1 {
    font-size: 2rem;
  }
}
</style>
