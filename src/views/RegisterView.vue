<template>
  <div class="register-container">
    <!-- Botão Voltar ao Site -->
    <router-link to="/" class="back-to-site">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Voltar ao site</span>
    </router-link>

    <!-- Background animado -->
    <div class="animated-background">
      <div class="floating-shapes">
        <div class="shape shape-1" :style="{ animationDelay: '0s' }"></div>
        <div class="shape shape-2" :style="{ animationDelay: '2s' }"></div>
        <div class="shape shape-3" :style="{ animationDelay: '4s' }"></div>
        <div class="shape shape-4" :style="{ animationDelay: '1s' }"></div>
        <div class="shape shape-5" :style="{ animationDelay: '3s' }"></div>
        <div class="shape shape-6" :style="{ animationDelay: '5s' }"></div>
      </div>

      <!-- Partículas flutuantes -->
      <div class="particles">
        <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <!-- Lado esquerdo - Informações -->
      <div class="info-panel" :class="{ 'slide-in-left': mounted }">
        <div class="brand-section">
          <div class="logo-container">
            <div class="logo-circle">
              <div class="logo-inner">
                <span class="logo-text">GZ</span>
              </div>
            </div>
            <div class="brand-ripple"></div>
          </div>

          <h1 class="brand-title">
            <span class="word" :style="{ animationDelay: '0.5s' }">Gestao</span><span class="word highlight" :style="{ animationDelay: '0.7s' }">Ze</span>
          </h1>

          <p class="brand-subtitle" :style="{ animationDelay: '0.9s' }">
            Sistema Inteligente de Gestão
          </p>
        </div>

        <div class="features-showcase" :style="{ animationDelay: '1.1s' }">
          <h3>Por que escolher o GestaoZe?</h3>
          <div class="feature-list">
            <div class="feature-item" v-for="(feature, index) in features" :key="feature.icon"
                 :style="{ animationDelay: `${1.3 + index * 0.1}s` }">
              <div class="feature-icon">{{ feature.icon }}</div>
              <div class="feature-text">
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="stats-section" :style="{ animationDelay: '1.8s' }">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Lado direito - Formulário de registro -->
      <div class="register-panel" :class="{ 'slide-in-right': mounted }">
        <div class="register-card">
          <!-- Header do cartão -->
          <div class="card-header">
            <div class="welcome-badge">
              <span class="badge-icon">✨</span>
              <span class="badge-text">Comece sua jornada!</span>
            </div>
            <h2 class="register-title">Criar nova conta</h2>
            <p class="register-subtitle">Preencha os dados abaixo para começar seu teste grátis</p>
          </div>

          <!-- Formulário -->
          <form @submit.prevent="handleRegister" class="register-form">
            <!-- Nome da empresa -->
            <div class="form-group" :class="{ 'has-content': formData.companyName }">
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <input
                  id="companyName"
                  v-model="formData.companyName"
                  type="text"
                  required
                  :disabled="loading"
                  class="form-input"
                />
                <label for="companyName" class="form-label">Nome da empresa</label>
                <div class="input-border"></div>
              </div>
            </div>

            <!-- Email -->
            <div class="form-group" :class="{ 'has-content': formData.email }">
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  :disabled="loading"
                  class="form-input"
                />
                <label for="email" class="form-label">Email corporativo</label>
                <div class="input-border"></div>
              </div>
            </div>

            <!-- Nome do responsável -->
            <div class="form-group" :class="{ 'has-content': formData.ownerName }">
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input
                  id="ownerName"
                  v-model="formData.ownerName"
                  type="text"
                  required
                  :disabled="loading"
                  class="form-input"
                />
                <label for="ownerName" class="form-label">Seu nome completo</label>
                <div class="input-border"></div>
              </div>
            </div>

            <!-- Senha -->
            <div class="form-group" :class="{ 'has-content': formData.password }">
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  :disabled="loading"
                  class="form-input"
                />
                <label for="password" class="form-label">Senha (mínimo 8 caracteres)</label>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <div class="input-border"></div>
              </div>
            </div>

            <!-- Confirmar senha -->
            <div class="form-group" :class="{ 'has-content': formData.confirmPassword }">
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  :disabled="loading"
                  class="form-input"
                />
                <label for="confirmPassword" class="form-label">Confirmar senha</label>
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="password-toggle"
                >
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <div class="input-border"></div>
              </div>
            </div>

            <!-- Mensagem de erro -->
            <transition name="error-slide">
              <div v-if="error" class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-text">{{ error }}</div>
                <button @click="error = ''" class="error-close">×</button>
              </div>
            </transition>

            <!-- Mensagem de validação -->
            <div v-if="!isFormValid" class="validation-message">
              <div class="validation-icon">ℹ️</div>
              <div class="validation-text">Preencha todos os campos para continuar</div>
            </div>

            <!-- Botão de registro -->
            <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="register-button"
              :class="{ 'loading': loading }"
            >
              <span v-if="!loading" class="button-content">
                <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                <span class="button-text">Criar minha conta grátis</span>
              </span>
              <span v-else class="loading-content">
                <div class="loading-spinner"></div>
                <span>Criando conta...</span>
              </span>
            </button>

            <!-- Separador -->
            <div class="divider">
              <span class="divider-text">ou</span>
            </div>

            <!-- Botão login -->
            <router-link to="/login" class="login-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10,17 15,12 10,7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              <span>Já tenho uma conta</span>
            </router-link>
          </form>
        </div>

        <!-- Informações de sistema -->
        <div class="system-info">
          <div class="info-item">
            <div class="status-indicator online"></div>
            <span>Sistema online</span>
          </div>
          <div class="info-item">
            <span>🔒 Conexão segura</span>
          </div>
          <div class="info-item">
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-logo">
            <div class="loading-circle"></div>
            <span class="loading-text">GZ</span>
          </div>
          <p class="loading-message">Criando sua conta...</p>
          <div class="loading-progress">
            <div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const mounted = ref(false)
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
const loadingProgress = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed property para validar o formulário
const isFormValid = computed(() => {
  return !!(
    formData.value.companyName &&
    formData.value.email &&
    formData.value.ownerName &&
    formData.value.password &&
    formData.value.confirmPassword
  )
})

const features = [
  {
    icon: '✓',
    title: '14 dias grátis',
    description: 'Teste completo sem compromisso'
  },
  {
    icon: '✓',
    title: 'Sem cartão',
    description: 'Não precisa cadastrar cartão'
  },
  {
    icon: '✓',
    title: 'Suporte 24/7',
    description: 'Equipe sempre disponível'
  },
  {
    icon: '✓',
    title: 'Fácil configuração',
    description: 'Comece em minutos'
  }
]

const stats = [
  { number: '500+', label: 'Empresas' },
  { number: '99.9%', label: 'Uptime' },
  { number: '4.9/5', label: 'Avaliação' }
]

function getParticleStyle(_index: number) {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDuration = Math.random() * 20 + 10
  const animationDelay = Math.random() * 20

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`
  }
}

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

  loading.value = true
  loadingProgress.value = 0

  // Simular progresso de loading
  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += Math.random() * 10
    }
  }, 100)

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

    loadingProgress.value = 100

    setTimeout(() => {
      if (!result.success) {
        error.value = result.error || 'Erro ao criar conta. Tente novamente.'
        clearInterval(progressInterval)
        loading.value = false
        loadingProgress.value = 0
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
    }, 500)
  } catch (err) {
    console.error('Erro no registro:', err)
    error.value = 'Erro ao criar conta. Tente novamente.'
    clearInterval(progressInterval)
    loading.value = false
    loadingProgress.value = 0
  }
}

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
  }, 100)
})
</script>

<style scoped>
/* Reutilizar os mesmos estilos do LoginView */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.25);
  --shadow-soft: 0 8px 32px rgba(31, 38, 135, 0.4);
  --shadow-strong: 0 15px 35px rgba(31, 38, 135, 0.3);
  --text-primary: #1a202c;
  --text-secondary: #2d3748;
  --border-color: #cbd5e0;
  --bg-light: #f7fafc;
  --success-color: #48bb78;
  --error-color: #f56565;
  --warning-color: #ed8936;
}

/* Botão Voltar ao Site */
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

/* Container principal */
.register-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Background animado */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #3b82f6 50%, #667eea 75%, #764ba2 100%);
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  left: 80%;
  background: rgba(255, 255, 255, 0.08);
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 30%;
  left: 70%;
  background: rgba(255, 255, 255, 0.12);
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 80%;
  left: 20%;
  background: rgba(255, 255, 255, 0.06);
}

.shape-5 {
  width: 140px;
  height: 140px;
  top: 20%;
  left: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.shape-6 {
  width: 90px;
  height: 90px;
  top: 70%;
  left: 60%;
  background: rgba(255, 255, 255, 0.09);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-30px) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translateY(30px) rotate(240deg) scale(0.9);
  }
}

/* Partículas */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat infinite linear;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-10vh) rotate(360deg);
    opacity: 0;
  }
}

/* Conteúdo principal */
.main-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 100vh;
}

/* Painel de informações */
.info-panel {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  opacity: 0;
  transform: translateX(-50px);
}

.info-panel.slide-in-left {
  animation: slideInLeft 0.8s forwards;
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Seção da marca */
.brand-section {
  text-align: center;
  margin-bottom: 60px;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.logo-circle {
  width: 120px;
  height: 120px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 2px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  animation: logoGlow 3s ease-in-out infinite;
}

.logo-inner {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-ripple {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: ripple 2s ease-out infinite;
}

@keyframes logoGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  }
}

@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.brand-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.word {
  opacity: 0;
  animation: wordReveal 0.6s forwards;
}

.word.highlight {
  background: var(--secondary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes wordReveal {
  to {
    opacity: 1;
  }
}

.brand-subtitle {
  font-size: 20px;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 1px;
  opacity: 0;
  animation: fadeInUp 0.6s forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* Showcase de recursos */
.features-showcase {
  margin-bottom: 40px;
  opacity: 0;
  animation: fadeInUp 0.8s forwards;
}

.features-showcase h3 {
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 600;
}

.feature-list {
  display: grid;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s forwards;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-strong);
}

.feature-icon {
  font-size: 24px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.feature-text h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-text p {
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
}

/* Seção de estatísticas */
.stats-section {
  display: flex;
  justify-content: center;
  gap: 40px;
  opacity: 0;
  animation: fadeInUp 1s forwards;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Painel de registro */
.register-panel {
  flex: 0 0 500px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(25px);
  border-left: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateX(50px);
  overflow-y: auto;
  max-height: 100vh;
}

.register-panel.slide-in-right {
  animation: slideInRight 0.8s forwards;
}

@keyframes slideInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Cartão de registro */
.register-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(31, 38, 135, 0.15);
  border: 2px solid rgba(203, 213, 224, 0.5);
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #1e40af;
  padding: 10px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  border: 2px solid rgba(30, 64, 175, 0.1);
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.1);
}

.badge-icon {
  font-size: 16px;
}

.register-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 8px;
  text-shadow: none;
}

.register-subtitle {
  color: #4a5568;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 500;
}

/* Formulário */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  z-index: 2;
  transition: color 0.3s ease;
}

.form-input {
  width: 100%;
  height: 56px;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: white;
  color: #1a202c;
  transition: all 0.3s ease;
  outline: none;
  font-weight: 500;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  background: #fafbff;
}

.form-input:focus + .form-label,
.form-group.has-content .form-label {
  top: -8px;
  left: 12px;
  font-size: 12px;
  color: #3b82f6;
  background: white;
  padding: 0 4px;
  font-weight: 600;
}

.form-label {
  position: absolute;
  left: 48px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
  background: transparent;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--text-primary);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.form-input:focus ~ .input-border {
  width: 100%;
}

/* Opções do formulário */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  user-select: none;
  position: relative;
  z-index: 10;
  pointer-events: auto;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkbox-checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #94a3b8;
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  pointer-events: auto;
}

.checkbox-container:hover .checkbox-checkmark {
  border-color: #667eea;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.2);
}

.checkbox-container input[type="checkbox"]:checked + .checkbox-checkmark {
  background: var(--primary-gradient);
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.checkbox-container input[type="checkbox"]:checked + .checkbox-checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  cursor: pointer;
  pointer-events: auto;
}

.checkbox-text a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  pointer-events: auto;
  position: relative;
  z-index: 20;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

/* Mensagem de validação */
.validation-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;
  border-radius: 12px;
  padding: 16px;
  color: #1e40af;
  margin-bottom: 12px;
  pointer-events: none;
}

.validation-icon {
  font-size: 18px;
}

.validation-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

/* Mensagem de erro */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #fef5e7 0%, #fff2f2 100%);
  border: 1px solid #fed7d7;
  border-radius: 12px;
  padding: 16px;
  color: var(--error-color);
  animation: shake 0.5s ease-in-out;
}

.error-icon {
  font-size: 18px;
}

.error-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.error-close {
  background: none;
  border: none;
  color: var(--error-color);
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Botões */
.register-button {
  height: 56px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
}

.register-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.register-button:hover:before {
  left: 100%;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
  background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.button-text {
  color: white !important;
  font-weight: 700 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
  font-size: 16px !important;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Separador */
.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider-text {
  background: white;
  color: var(--text-secondary);
  padding: 0 16px;
  font-size: 14px;
  position: relative;
}

/* Botão login */
.login-button {
  height: 48px;
  background: var(--bg-light);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.login-button svg {
  width: 20px;
  height: 20px;
}

.login-button:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Informações do sistema */
.system-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success-color);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
  color: white;
  max-width: 300px;
}

.loading-logo {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.loading-circle {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 800;
}

.loading-message {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: var(--accent-gradient);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .info-panel {
    flex: none;
    padding: 20px;
    min-height: 40vh;
  }

  .register-panel {
    flex: none;
    border-left: none;
    border-top: 1px solid var(--glass-border);
    max-height: none;
  }

  .brand-title {
    font-size: 36px;
  }

  .stats-section {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .info-panel,
  .register-panel {
    padding: 20px;
  }

  .register-card {
    padding: 24px;
  }

  .brand-title {
    font-size: 28px;
  }

  .features-showcase {
    margin-bottom: 20px;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stats-section {
    flex-direction: column;
    gap: 15px;
  }

  .form-options {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .system-info {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;
  }

  .register-card {
    padding: 20px;
    border-radius: 16px;
  }

  .register-title {
    font-size: 24px;
  }

  .brand-title {
    font-size: 24px;
  }

  .logo-circle {
    width: 80px;
    height: 80px;
  }

  .logo-inner {
    width: 60px;
    height: 60px;
  }

  .logo-text {
    font-size: 24px;
  }
}
</style>
