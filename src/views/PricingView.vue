<template>
  <div class="pricing-container">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">
          <span class="logo-text">GestãoZe</span>
        </router-link>
        <router-link to="/" class="btn btn-outline">← Voltar ao Início</router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="pulse-dot"></span>
          Sistema Completo de Gestão Empresarial
        </div>

        <h1 class="hero-title">
          Transforme sua Empresa com Tecnologia Profissional
        </h1>

        <p class="hero-description">
          Sistema completo de gestão empresarial com aplicativos móveis e desktop.
          Gerencie seu negócio de qualquer lugar, a qualquer momento.
        </p>

        <!-- Pricing Card -->
        <div class="main-pricing-card">
          <div class="price-header">
            <div class="price-badge">Plano Profissional</div>
          </div>

          <div class="price-amount">
            <span class="currency">R$</span>
            <span class="value">114</span>
            <span class="period">/mês</span>
          </div>

          <p class="price-subtitle">
            Acesso completo a todas as funcionalidades
          </p>

          <div class="platforms-section">
            <h3 class="platforms-title">Disponível em todas as plataformas:</h3>

            <div class="platforms-grid">
              <!-- Mobile -->
              <div class="platform-group">
                <div class="platform-label">Mobile</div>
                <div class="platform-icons">
                  <div class="platform-icon" title="Android">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6,11.48 L19.44,8.3 C19.5,8.18 19.56,8.04 19.56,7.88 C19.56,7.64 19.43,7.43 19.23,7.3 C19.08,7.2 18.9,7.14 18.72,7.14 C18.44,7.14 18.17,7.28 18.03,7.5 L16.17,10.71 C15.33,10.35 14.41,10.14 13.44,10.14 C12.47,10.14 11.55,10.35 10.71,10.71 L8.85,7.5 C8.71,7.28 8.44,7.14 8.16,7.14 C7.98,7.14 7.8,7.2 7.65,7.3 C7.45,7.43 7.32,7.64 7.32,7.88 C7.32,8.04 7.38,8.18 7.44,8.3 L9.28,11.48 C7.18,12.5 5.76,14.67 5.76,17.14 L21.12,17.14 C21.12,14.67 19.7,12.5 17.6,11.48 M10.32,14.62 C9.92,14.62 9.6,14.3 9.6,13.9 C9.6,13.5 9.92,13.18 10.32,13.18 C10.72,13.18 11.04,13.5 11.04,13.9 C11.04,14.3 10.72,14.62 10.32,14.62 M16.56,14.62 C16.16,14.62 15.84,14.3 15.84,13.9 C15.84,13.5 16.16,13.18 16.56,13.18 C16.96,13.18 17.28,13.5 17.28,13.9 C17.28,14.3 16.96,14.62 16.56,14.62 M7.32,18.54 L7.32,22.26 C7.32,22.83 7.78,23.28 8.35,23.28 C8.92,23.28 9.37,22.83 9.37,22.26 L9.37,18.54 L10.8,18.54 L10.8,22.26 C10.8,22.83 11.26,23.28 11.83,23.28 C12.4,23.28 12.85,22.83 12.85,22.26 L12.85,18.54 L14.03,18.54 L14.03,22.26 C14.03,22.83 14.49,23.28 15.06,23.28 C15.63,23.28 16.08,22.83 16.08,22.26 L16.08,18.54 L17.51,18.54 L17.51,22.26 C17.51,22.83 17.97,23.28 18.54,23.28 C19.11,23.28 19.56,22.83 19.56,22.26 L19.56,18.54 L19.56,17.14 L7.32,17.14 L7.32,18.54 Z"/>
                    </svg>
                    <span>Android</span>
                  </div>
                  <div class="platform-icon" title="iOS">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                    </svg>
                    <span>iOS</span>
                  </div>
                </div>
              </div>

              <!-- Desktop -->
              <div class="platform-group">
                <div class="platform-label">Desktop</div>
                <div class="platform-icons">
                  <div class="platform-icon" title="Windows">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,12V6.75L9,5.43V11.91L3,12M20,3V11.75L10,11.9V5.21L20,3M3,13L9,13.09V19.9L3,18.75V13M20,13.25V22L10,20.09V13.1L20,13.25Z"/>
                    </svg>
                    <span>Windows</span>
                  </div>
                  <div class="platform-icon" title="macOS">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                    </svg>
                    <span>macOS</span>
                  </div>
                  <div class="platform-icon" title="Linux">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.62,8.35C14.2,8.63 12.87,9.39 12.67,9.54C12.28,9.85 11.92,9.83 11.53,9.53C11.33,9.37 10,8.61 9.58,8.34C9.1,8.03 9.13,7.64 9.66,7.42C11.3,6.73 12.94,6.78 14.57,7.45C15.06,7.66 15.08,8.05 14.62,8.35M21.84,15.63C20.91,13.54 19.64,11.64 18,9.97C17.47,9.42 17.14,8.8 16.94,8.09C16.84,7.76 16.77,7.42 16.7,7.08C16.5,6.2 16.41,5.3 16,4.47C15.27,2.89 14,2.07 12.16,2C10.35,2.05 9.05,2.93 8.34,4.5C8,5.25 7.83,6.06 7.66,6.86C7.58,7.25 7.5,7.65 7.4,8.04C7.2,8.75 6.84,9.36 6.3,9.92C4.68,11.64 3.39,13.54 2.44,15.63C2.28,15.93 2.07,16.19 2.06,16.56C2.06,16.86 2.23,17.15 2.44,17.4C2.82,17.69 3.26,17.85 3.72,17.88C4.11,17.89 4.45,17.77 4.76,17.59C4.96,17.5 5.15,17.38 5.33,17.25C6.49,16.57 7.65,15.89 8.81,15.21C9.1,15.04 9.37,15.04 9.65,15.21C10.38,15.61 11.11,16 11.84,16.42C11.98,16.5 12.12,16.55 12.3,16.55C12.5,16.55 12.63,16.5 12.77,16.42C13.5,16 14.23,15.61 14.96,15.21C15.24,15.04 15.5,15.04 15.79,15.21C16.95,15.89 18.11,16.57 19.27,17.25C19.45,17.38 19.64,17.5 19.84,17.59C20.15,17.77 20.5,17.89 20.88,17.88C21.34,17.85 21.78,17.69 22.16,17.4C22.37,17.15 22.54,16.86 22.54,16.56C22.54,16.19 22.32,15.93 22.16,15.63C22.06,15.44 21.95,15.24 21.84,15.63M7.3,12C6.75,12.94 6.2,13.89 5.66,14.83C5.6,14.94 5.53,15.05 5.47,15.15C5.23,15.31 4.95,15.19 4.88,14.87C4.84,14.64 4.92,14.44 5,14.25C5.5,13.35 6,12.46 6.5,11.56C6.85,10.91 7.2,10.27 7.55,9.62C7.84,9.11 8.27,8.97 8.76,9.26C9.27,9.56 9.34,10 9.03,10.53C8.45,11.35 7.87,12.17 7.3,12M16.7,12C16.12,12.82 15.54,13.64 14.97,14.47C14.66,15 14.73,15.44 15.24,15.74C15.73,16.03 16.16,15.89 16.45,15.38C17.26,14.05 18.07,12.72 18.88,11.39C19.28,10.71 19.12,10.05 18.5,9.74C17.94,9.46 17.44,9.68 17.14,10.28C17,10.53 16.84,10.76 16.7,11M12,13.28C11.15,13.28 10.46,12.59 10.47,11.74C10.47,10.88 11.16,10.2 12,10.21C12.86,10.21 13.54,10.9 13.53,11.76C13.53,12.61 12.84,13.29 12,13.28Z"/>
                    </svg>
                    <span>Linux</span>
                  </div>
                  <div class="platform-icon" title="Arch Linux">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2C11.5,2.23 11,2.45 10.5,2.68C9.5,3.11 8.5,3.56 7.5,4C6.5,4.44 5.5,4.89 4.5,5.33C3.84,5.61 3.17,5.89 2.5,6.17C2.5,6.17 2.5,6.17 2.5,6.18C5.5,11.39 9.5,16.61 12,22C14.5,16.61 18.5,11.39 21.5,6.18C20.83,5.89 20.16,5.61 19.5,5.33C18.5,4.89 17.5,4.44 16.5,4C15.5,3.56 14.5,3.11 13.5,2.68C13,2.45 12.5,2.23 12,2M12,7C12.78,8.45 13.56,9.89 14.33,11.33C13.56,11.33 12.78,11.33 12,11.33C11.22,11.33 10.44,11.33 9.67,11.33C10.44,9.89 11.22,8.45 12,7M12,13.67C12.78,13.67 13.56,13.67 14.33,13.67C15.5,15.89 16.67,18.11 17.83,20.33C15.89,18.11 13.94,15.89 12,13.67M9.67,13.67C7.72,15.89 5.78,18.11 3.83,20.33C5,18.11 6.17,15.89 7.33,13.67C8.11,13.67 8.89,13.67 9.67,13.67Z"/>
                    </svg>
                    <span>Arch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Gestão completa de estoque e inventário</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Módulo financeiro com fluxo de caixa</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Gestão de funcionários e ponto eletrônico</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Relatórios avançados e analytics com IA</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Cardápio digital e gestão de menu</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>API completa para integrações</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Suporte dedicado 24/7</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Usuários ilimitados</span>
            </div>
            <div class="feature-item">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span>Armazenamento ilimitado</span>
            </div>
          </div>

          <router-link to="/register" class="cta-button">
            <span>Começar teste grátis de 14 dias</span>
            <svg class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </router-link>

          <p class="guarantee-text">
            <svg class="shield-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            Sem necessidade de cartão de crédito
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">Uptime Garantido</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Suporte Dedicado</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">100%</div>
          <div class="stat-label">Segurança de Dados</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">∞</div>
          <div class="stat-label">Escalabilidade</div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pricing-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.btn {
  padding: 0.75rem 1.75rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  transform: translateY(-2px);
}

/* Hero Section */
.hero-section {
  padding: 100px 2rem 80px;
  max-width: 900px;
  margin: 0 auto;
}

.hero-content {
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: #1a202c;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -1px;
}

.hero-description {
  font-size: 1.25rem;
  color: #718096;
  margin-bottom: 3rem;
  line-height: 1.7;
}

/* Main Pricing Card */
.main-pricing-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
  overflow: hidden;
}

.main-pricing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.price-header {
  text-align: center;
  margin-bottom: 2rem;
}

.price-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-amount {
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.currency {
  font-size: 2rem;
  color: #718096;
  font-weight: 700;
}

.value {
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.period {
  font-size: 1.5rem;
  color: #718096;
  font-weight: 600;
}

.price-subtitle {
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

/* Platforms Section */
.platforms-section {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
}

.platforms-title {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.platform-group {
  text-align: center;
}

.platform-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.platform-icons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.platform-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  transition: all 0.3s ease;
  cursor: pointer;
}

.platform-icon:hover {
  color: #667eea;
  transform: translateY(-3px);
}

.platform-icon svg {
  width: 36px;
  height: 36px;
}

.platform-icon span {
  font-size: 0.85rem;
  font-weight: 600;
}

/* Features List */
.features-list {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}

.check-icon {
  width: 24px;
  height: 24px;
  color: #48bb78;
  flex-shrink: 0;
}

.feature-item span {
  color: #2d3748;
  font-size: 1rem;
  font-weight: 500;
}

/* CTA Button */
.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  margin-bottom: 1.5rem;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(5px);
}

.guarantee-text {
  text-align: center;
  color: #718096;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.shield-icon {
  width: 18px;
  height: 18px;
  color: #48bb78;
}

/* Stats Section */
.stats-section {
  padding: 60px 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #718096;
  font-size: 1rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }

  .value {
    font-size: 4rem;
  }

  .main-pricing-card {
    padding: 2rem;
  }

  .platforms-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .value {
    font-size: 3rem;
  }

  .currency {
    font-size: 1.5rem;
  }

  .period {
    font-size: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
