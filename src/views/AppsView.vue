<template>
  <div class="apps-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo-text">GestaoZe</router-link>
        <router-link to="/" class="btn btn-outline">← Voltar</router-link>
      </div>
    </nav>

    <!-- Hero -->
    <section class="apps-hero">
      <div class="hero-badge">
        <span class="badge-icon">📱</span>
        <span>Aplicativos Oficiais</span>
      </div>
      <h1 class="hero-title">Baixe nossos apps e gerencie de qualquer lugar</h1>
      <p class="hero-subtitle">
        Disponível para iOS, Android, Windows, macOS e Linux
      </p>
    </section>

    <!-- Apps Grid -->
    <section class="apps-section">
      <div class="apps-grid">
        <!-- Mobile Apps -->
        <div class="apps-category">
          <h2 class="category-title">
            <span class="category-icon">📱</span>
            Aplicativos Mobile
          </h2>

          <div class="apps-cards">
            <!-- iOS -->
            <div class="app-card" :class="{ 'premium-only': !hasPremium }">
              <div class="app-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </div>
              <div class="app-info">
                <h3>iOS App</h3>
                <p>iPhone e iPad</p>
                <span class="app-version">v1.0.0</span>
              </div>
              <button
                class="btn btn-download"
                @click="handleDownload('ios')"
                :disabled="!hasPremium"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                <span v-if="hasPremium">Download</span>
                <span v-else>Premium</span>
              </button>
            </div>

            <!-- Android -->
            <div class="app-card" :class="{ 'premium-only': !hasPremium }">
              <div class="app-icon android">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.5 11.5 0 0 0-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.37 11.14 2.94 13.6 2.88 16.4h18.25c-.07-2.8-1.49-5.26-3.54-6.92zM7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
              </div>
              <div class="app-info">
                <h3>Android App</h3>
                <p>Smartphones e Tablets</p>
                <span class="app-version">v1.0.0</span>
              </div>
              <button
                class="btn btn-download"
                @click="handleDownload('android')"
                :disabled="!hasPremium"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                <span v-if="hasPremium">Download</span>
                <span v-else>Premium</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Apps -->
        <div class="apps-category">
          <h2 class="category-title">
            <span class="category-icon">💻</span>
            Aplicativos Desktop
          </h2>

          <div class="apps-cards">
            <!-- Windows -->
            <div class="app-card" :class="{ 'premium-only': !hasPremium }">
              <div class="app-icon windows">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5.45v6.1l7-1v-6.9L3 5.45zm7 13l-7-1v-6.1l7 1v6.1zm1-13.1l10-1.4v7.6l-10-1.4v-4.8zm10 7.6v7.6l-10-1.4v-4.8l10-1.4z"/>
                </svg>
              </div>
              <div class="app-info">
                <h3>Windows</h3>
                <p>Windows 10 e 11</p>
                <span class="app-version">v1.0.0</span>
              </div>
              <button
                class="btn btn-download"
                @click="handleDownload('windows')"
                :disabled="!hasPremium"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                <span v-if="hasPremium">Download</span>
                <span v-else>Premium</span>
              </button>
            </div>

            <!-- macOS -->
            <div class="app-card" :class="{ 'premium-only': !hasPremium }">
              <div class="app-icon mac">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </div>
              <div class="app-info">
                <h3>macOS</h3>
                <p>macOS 11+ (Intel & M1/M2)</p>
                <span class="app-version">v1.0.0</span>
              </div>
              <button
                class="btn btn-download"
                @click="handleDownload('macos')"
                :disabled="!hasPremium"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                <span v-if="hasPremium">Download</span>
                <span v-else">Premium</span>
              </button>
            </div>

            <!-- Linux -->
            <div class="app-card" :class="{ 'premium-only': !hasPremium }">
              <div class="app-icon linux">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="app-info">
                <h3>Linux</h3>
                <p>Ubuntu, Debian, Fedora</p>
                <span class="app-version">v1.0.0</span>
              </div>
              <button
                class="btn btn-download"
                @click="handleDownload('linux')"
                :disabled="!hasPremium"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                <span v-if="hasPremium">Download</span>
                <span v-else>Premium</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium CTA -->
      <div v-if="!hasPremium" class="premium-cta">
        <div class="cta-icon">🔒</div>
        <h2>Acesso Exclusivo Premium</h2>
        <p>Os aplicativos mobile e desktop são exclusivos para assinantes dos planos Profissional e Empresarial.</p>
        <router-link to="/pricing" class="btn btn-large btn-primary">
          Ver Planos Premium
        </router-link>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Por que usar nossos apps?</h2>

      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">⚡</div>
          <h3>Performance Nativa</h3>
          <p>Aplicativos otimizados para cada plataforma com máxima performance</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🔄</div>
          <h3>Sincronização em Tempo Real</h3>
          <p>Dados sincronizados automaticamente entre todos os dispositivos</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📴</div>
          <h3>Modo Offline</h3>
          <p>Continue trabalhando mesmo sem internet, sincroniza quando conectar</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🔔</div>
          <h3>Notificações Push</h3>
          <p>Receba alertas importantes instantaneamente em todos os dispositivos</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🎨</div>
          <h3>Interface Nativa</h3>
          <p>Design adaptado para cada sistema operacional</p>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🔐</div>
          <h3>Segurança Avançada</h3>
          <p>Autenticação biométrica e criptografia de dados</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Verificar se tem plano premium
const hasPremium = computed(() => {
  // TODO: Implementar verificação real do plano
  // Por enquanto, verifica se está autenticado e tem role admin/owner
  const user = authStore.user
  return user && (user.role === 'admin' || user.role === 'owner')
})

function handleDownload(platform: string) {
  if (!hasPremium.value) {
    // Redirecionar para página de planos
    router.push('/pricing')
    return
  }

  // TODO: Implementar download real
  console.log(`Download iniciado para: ${platform}`)

  // Simular download
  alert(`Download do app ${platform} será iniciado em breve!`)
}

onMounted(() => {
  // Verificar se está autenticado
  if (!authStore.isAuthenticated && !hasPremium.value) {
    // Pode mostrar uma mensagem ou não
  }
})
</script>

<style scoped>
.apps-container {
  min-height: 100vh;
  background: #f7fafc;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
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

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

/* Hero */
.apps-hero {
  padding: 80px 2rem 60px;
  text-align: center;
  background: white;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #1e40af;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.badge-icon {
  font-size: 1.25rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #718096;
}

/* Apps Section */
.apps-section {
  padding: 60px 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.apps-grid {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.apps-category {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 2.5rem;
}

.category-icon {
  font-size: 2.5rem;
}

.apps-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.app-card {
  background: #f7fafc;
  padding: 2rem;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.app-card:hover:not(.premium-only) {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.app-card.premium-only {
  opacity: 0.6;
  position: relative;
  overflow: hidden;
}

.app-card.premium-only::before {
  content: '🔒 Premium';
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.app-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.app-icon svg {
  width: 48px;
  height: 48px;
}

.app-icon.android {
  background: linear-gradient(135deg, #3ddc84 0%, #2ba05f 100%);
}

.app-icon.windows {
  background: linear-gradient(135deg, #00a8e8 0%, #0078d4 100%);
}

.app-icon.mac {
  background: linear-gradient(135deg, #8e8e93 0%, #636366 100%);
}

.app-icon.linux {
  background: linear-gradient(135deg, #f9ab00 0%, #e69500 100%);
}

.app-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.app-info p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.app-version {
  display: inline-block;
  background: #e2e8f0;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-download {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 100%;
  justify-content: center;
  padding: 0.875rem;
}

.btn-download:disabled {
  background: #cbd5e0;
  color: #718096;
  cursor: not-allowed;
}

.btn-download svg {
  width: 20px;
  height: 20px;
}

/* Premium CTA */
.premium-cta {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  margin-top: 4rem;
}

.cta-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.premium-cta h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.premium-cta p {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.premium-cta .btn {
  background: white;
  color: #667eea;
}

/* Features Section */
.features-section {
  padding: 80px 2rem;
  background: white;
  max-width: 1400px;
  margin: 4rem auto 0;
  border-radius: 20px;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-item h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.feature-item p {
  color: #718096;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .apps-category {
    padding: 2rem 1.5rem;
  }

  .apps-cards {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
