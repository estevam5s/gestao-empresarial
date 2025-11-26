<template>
  <div class="register-container">
    <!-- Botão Voltar ao Site -->
    <router-link to="/" class="back-to-site">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Voltar ao site</span>
    </router-link>

    <div class="register-split">
      <!-- Lado esquerdo - Info -->
      <div class="register-info">
        <router-link to="/" class="logo">
          <span class="logo-text">GestaoZe</span>
        </router-link>

        <div class="info-content">
          <h2>Comece sua jornada hoje</h2>
          <p>Junte-se a centenas de empresas que já transformaram sua gestão com o GestaoZe.</p>

          <div class="benefits">
            <div class="benefit">
              <span class="icon">✓</span>
              <span>14 dias de teste grátis</span>
            </div>
            <div class="benefit">
              <span class="icon">✓</span>
              <span>Não precisa cartão de crédito</span>
            </div>
            <div class="benefit">
              <span class="icon">✓</span>
              <span>Suporte completo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lado direito - Formulário -->
      <div class="register-form-section">
        <div class="form-container">
          <h1>Criar conta</h1>
          <p class="form-subtitle">Preencha os dados abaixo para começar</p>

          <form @submit.prevent="handleRegister" class="register-form">
            <!-- Dados da empresa -->
            <div class="form-section">
              <h3>Dados da empresa</h3>

              <div class="form-group">
                <label>Nome da empresa *</label>
                <input v-model="formData.companyName" type="text" required>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Email corporativo *</label>
                  <input v-model="formData.email" type="email" required>
                </div>
                <div class="form-group">
                  <label>Telefone</label>
                  <input v-model="formData.phone" type="tel">
                </div>
              </div>

              <div class="form-group">
                <label>CNPJ (opcional)</label>
                <input v-model="formData.cnpj" type="text" placeholder="00.000.000/0000-00">
              </div>
            </div>

            <!-- Dados do usuário -->
            <div class="form-section">
              <h3>Seu dados</h3>

              <div class="form-group">
                <label>Seu nome completo *</label>
                <input v-model="formData.ownerName" type="text" required>
              </div>

              <div class="form-group">
                <label>Senha *</label>
                <input v-model="formData.password" type="password" required minlength="8">
                <small>Mínimo de 8 caracteres</small>
              </div>

              <div class="form-group">
                <label>Confirmar senha *</label>
                <input v-model="formData.confirmPassword" type="password" required>
              </div>
            </div>

            <!-- Plano selecionado -->
            <div class="form-section" v-if="selectedPlan">
              <h3>Plano selecionado</h3>
              <div class="plan-info">
                <div class="plan-name">{{ selectedPlan.name }}</div>
                <div class="plan-price">R$ {{ selectedPlan.price }}/mês</div>
              </div>
              <router-link to="/pricing" class="change-plan">Alterar plano</router-link>
            </div>

            <!-- Erro -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <!-- Termos -->
            <div class="form-group checkbox-group">
              <label>
                <input v-model="formData.acceptedTerms" type="checkbox" required>
                <span>
                  Eu concordo com os
                  <router-link to="/legal/terms" target="_blank">Termos de Uso</router-link>
                  e a
                  <router-link to="/legal/privacy" target="_blank">Política de Privacidade</router-link>
                </span>
              </label>
            </div>

            <!-- Botão -->
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="!loading">Criar minha conta grátis</span>
              <span v-else>Criando conta...</span>
            </button>
          </form>

          <div class="form-footer">
            Já tem uma conta?
            <router-link to="/login">Fazer login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const formData = ref({
  companyName: '',
  email: '',
  phone: '',
  cnpj: '',
  ownerName: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
})

const error = ref('')
const loading = ref(false)

const plans = {
  basico: { name: 'Básico', price: '49,90' },
  profissional: { name: 'Profissional', price: '99,90' },
  empresarial: { name: 'Empresarial', price: '199,90' }
}

const selectedPlan = computed(() => {
  const planSlug = route.query.plan as string
  return planSlug && plans[planSlug as keyof typeof plans]
    ? plans[planSlug as keyof typeof plans]
    : plans.profissional
})

async function handleRegister() {
  error.value = ''

  // Validações
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'As senhas não coincidem'
    return
  }

  if (formData.value.password.length < 8) {
    error.value = 'A senha deve ter no mínimo 8 caracteres'
    return
  }

  if (!formData.value.acceptedTerms) {
    error.value = 'Você precisa aceitar os termos de uso'
    return
  }

  loading.value = true

  try {
    // Importar o serviço de registro
    const { registrationService } = await import('@/services/registrationService')

    // Registrar a empresa e usuário
    const result = await registrationService.registerTenant({
      companyName: formData.value.companyName,
      email: formData.value.email,
      phone: formData.value.phone,
      cnpj: formData.value.cnpj,
      ownerName: formData.value.ownerName,
      password: formData.value.password,
      planSlug: route.query.plan as string || 'profissional'
    })

    if (!result.success) {
      error.value = result.error || 'Erro ao criar conta. Tente novamente.'
      return
    }

    // Redireciona para o login com mensagem de sucesso
    router.push({
      path: '/login',
      query: {
        registered: 'true',
        email: formData.value.email
      }
    })
  } catch (err) {
    console.error('Erro no registro:', err)
    error.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.back-to-site {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.back-to-site svg {
  width: 18px;
  height: 18px;
}

.back-to-site:hover {
  background: white;
  transform: translateX(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

.register-container {
  min-height: 100vh;
  display: flex;
}

.register-split {
  display: flex;
  width: 100%;
}

.register-info {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: white;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
}

.info-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.info-content p {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.125rem;
}

.benefit .icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.register-form-section {
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 500px;
}

.form-container h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #718096;
  margin-bottom: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group small {
  color: #718096;
  font-size: 0.85rem;
}

.checkbox-group label {
  display: flex;
  align-items: start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 0.25rem;
  cursor: pointer;
}

.checkbox-group span {
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
}

.checkbox-group a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.plan-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.plan-name {
  font-weight: 700;
  color: #1a202c;
}

.plan-price {
  font-weight: 700;
  color: #667eea;
  font-size: 1.125rem;
}

.change-plan {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.btn {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  color: #718096;
  margin-top: 1.5rem;
}

.form-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
}

@media (max-width: 968px) {
  .register-split {
    flex-direction: column;
  }

  .register-info {
    padding: 2rem;
  }

  .info-content h2 {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
