<template>
  <div class="home-container">
    <!-- Navbar -->
    <nav class="navbar" :class="{ 'scrolled': scrolled }">
      <div class="nav-content">
        <div class="nav-brand">
          <div class="logo">
            <span class="logo-text">GestaoZe</span>
          </div>
        </div>

        <div class="nav-menu" :class="{ 'mobile-open': mobileMenuOpen }">
          <a href="#features" class="nav-link" @click="closeMenu">Recursos</a>
          <router-link to="/pricing" class="nav-link" @click="closeMenu">Preços</router-link>
          <router-link to="/apps" class="nav-link" @click="closeMenu">Apps</router-link>
          <a href="#testimonials" class="nav-link" @click="closeMenu">Depoimentos</a>
          <router-link to="/faq" class="nav-link" @click="closeMenu">FAQ</router-link>
          <router-link to="/contact" class="nav-link" @click="closeMenu">Contato</router-link>
        </div>

        <div class="nav-actions">
          <router-link to="/login" class="btn btn-outline">Entrar</router-link>
          <router-link to="/register" class="btn btn-primary">Começar Grátis</router-link>
        </div>

        <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">✨</span>
          <span>Plataforma completa de gestão empresarial</span>
        </div>

        <h1 class="hero-title">
          Gerencie seu negócio com
          <span class="gradient-text">inteligência e facilidade</span>
        </h1>

        <p class="hero-subtitle">
          Sistema completo de gestão para restaurantes, bares e estabelecimentos.
          Controle estoque, vendas, finanças e funcionários em um só lugar.
        </p>

        <div class="hero-cta">
          <router-link to="/register" class="btn btn-large btn-primary">
            <span>Começar teste gratuito</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <button class="btn btn-large btn-outline" @click="scrollToSection('features')">
            <span>Ver demonstração</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16 10,8"/>
            </svg>
          </button>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">Empresas ativas</div>
          </div>
          <div class="stat">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Uptime</div>
          </div>
          <div class="stat">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Suporte</div>
          </div>
          <div class="stat">
            <div class="stat-number">4.9/5</div>
            <div class="stat-label">Avaliação</div>
          </div>
        </div>
      </div>

      <div class="hero-image">
        <div class="dashboard-preview">
          <div class="preview-window">
            <div class="window-header">
              <div class="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="window-title">Dashboard - GestaoZe</div>
            </div>
            <div class="window-content">
              <!-- Simulação de dashboard -->
              <div class="mock-dashboard">
                <div class="mock-sidebar">
                  <div class="sidebar-item active"></div>
                  <div class="sidebar-item"></div>
                  <div class="sidebar-item"></div>
                  <div class="sidebar-item"></div>
                  <div class="sidebar-item"></div>
                </div>
                <div class="mock-main">
                  <div class="mock-header">
                    <div class="header-title"></div>
                    <div class="header-actions">
                      <div class="action-btn"></div>
                      <div class="action-btn primary"></div>
                    </div>
                  </div>
                  <div class="mock-cards">
                    <div class="mock-card card-primary">
                      <div class="card-icon">📊</div>
                      <div class="card-info">
                        <div class="card-value">1,234</div>
                        <div class="card-label">Produtos</div>
                      </div>
                      <div class="card-trend positive">+12%</div>
                    </div>
                    <div class="mock-card card-warning">
                      <div class="card-icon">📦</div>
                      <div class="card-info">
                        <div class="card-value">89</div>
                        <div class="card-label">Estoque Baixo</div>
                      </div>
                      <div class="card-trend negative">-5%</div>
                    </div>
                    <div class="mock-card card-success">
                      <div class="card-icon">💰</div>
                      <div class="card-info">
                        <div class="card-value">R$ 45.2K</div>
                        <div class="card-label">Vendas Hoje</div>
                      </div>
                      <div class="card-trend positive">+28%</div>
                    </div>
                    <div class="mock-card card-info">
                      <div class="card-icon">📈</div>
                      <div class="card-info">
                        <div class="card-value">R$ 1.2M</div>
                        <div class="card-label">Total Mensal</div>
                      </div>
                      <div class="card-trend positive">+15%</div>
                    </div>
                  </div>
                  <div class="mock-charts-row">
                    <div class="mock-chart">
                      <div class="chart-header">
                        <div class="chart-title">Vendas dos últimos 7 dias</div>
                        <div class="chart-legend"></div>
                      </div>
                      <div class="chart-content">
                        <div class="chart-bar" style="height: 60%"></div>
                        <div class="chart-bar" style="height: 75%"></div>
                        <div class="chart-bar" style="height: 55%"></div>
                        <div class="chart-bar" style="height: 85%"></div>
                        <div class="chart-bar" style="height: 70%"></div>
                        <div class="chart-bar" style="height: 90%"></div>
                        <div class="chart-bar" style="height: 95%"></div>
                      </div>
                    </div>
                    <div class="mock-activities">
                      <div class="activities-header">Atividades Recentes</div>
                      <div class="activity-item">
                        <div class="activity-dot"></div>
                        <div class="activity-text"></div>
                      </div>
                      <div class="activity-item">
                        <div class="activity-dot"></div>
                        <div class="activity-text"></div>
                      </div>
                      <div class="activity-item">
                        <div class="activity-dot"></div>
                        <div class="activity-text"></div>
                      </div>
                      <div class="activity-item">
                        <div class="activity-dot"></div>
                        <div class="activity-text"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights Section -->
    <section class="highlights">
      <div class="highlights-container">
        <div class="section-header">
          <span class="section-label">Destaques</span>
          <h2 class="section-title">Por que escolher o GestaoZe?</h2>
          <p class="section-subtitle">
            Recursos que fazem a diferença no dia a dia do seu negócio
          </p>
        </div>

        <div class="highlights-grid">
          <div v-for="highlight in highlights" :key="highlight.title"
               class="highlight-card"
               :style="{ '--card-gradient': highlight.gradient }">
            <div class="highlight-icon">{{ highlight.icon }}</div>
            <div class="highlight-content">
              <h3 class="highlight-title">{{ highlight.title }}</h3>
              <p class="highlight-description">{{ highlight.description }}</p>
              <div class="highlight-stats">
                <div class="highlight-stat" v-for="stat in highlight.stats" :key="stat.label">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="section-header">
        <span class="section-label">Recursos</span>
        <h2 class="section-title">Tudo que você precisa em um só lugar</h2>
        <p class="section-subtitle">
          Ferramentas poderosas para gerenciar todos os aspectos do seu negócio
        </p>
      </div>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon" :style="{ background: feature.color }">
            <span>{{ feature.icon }}</span>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="how-it-works">
      <div class="section-header">
        <span class="section-label">Como funciona</span>
        <h2 class="section-title">Comece em 3 passos simples</h2>
      </div>

      <div class="steps">
        <div v-for="(step, index) in steps" :key="index" class="step">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="testimonials">
      <div class="section-header">
        <span class="section-label">Depoimentos</span>
        <h2 class="section-title">O que nossos clientes dizem</h2>
      </div>

      <div class="testimonials-grid">
        <div v-for="(testimonial, index) in testimonials" :key="testimonial.author"
             class="testimonial-card"
             :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="testimonial-image-wrapper">
            <img :src="testimonial.image" :alt="testimonial.author" class="testimonial-image" />
            <div class="image-overlay"></div>
          </div>
          <div class="testimonial-content">
            <div class="testimonial-rating">
              <span v-for="i in 5" :key="i" class="star">⭐</span>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-info">
                <div class="author-name">{{ testimonial.author }}</div>
                <div class="author-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Pronto para transformar seu negócio?</h2>
        <p class="cta-subtitle">
          Junte-se a centenas de empresas que já confiam no GestaoZe
        </p>
        <div class="cta-actions">
          <router-link to="/register" class="btn btn-large btn-white">
            Começar teste gratuito de 14 dias
          </router-link>
          <p class="cta-note">Não é necessário cartão de crédito</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const mobileMenuOpen = ref(false)

const highlights = [
  {
    icon: '🚀',
    title: 'Performance Excepcional',
    description: 'Infraestrutura escalável com alta disponibilidade, garantindo operações em tempo real sem interrupções',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stats: [
      { value: '99.9%', label: 'Uptime' },
      { value: '<100ms', label: 'Resposta' }
    ]
  },
  {
    icon: '💡',
    title: 'Inteligência Artificial Avançada',
    description: 'Machine Learning que aprende com padrões do seu negócio, oferecendo insights preditivos e sugestões de otimização',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    stats: [
      { value: '85%', label: 'Precisão' },
      { value: '24/7', label: 'Análise' }
    ]
  },
  {
    icon: '🎯',
    title: 'ROI Comprovado',
    description: 'Empresas reduzem até 40% dos custos operacionais com automação inteligente e gestão otimizada de recursos',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    stats: [
      { value: '40%', label: 'Economia' },
      { value: '3x', label: 'ROI Médio' }
    ]
  },
  {
    icon: '🔒',
    title: 'Segurança de Nível Empresarial',
    description: 'Criptografia de ponta a ponta, conformidade com LGPD e certificações internacionais de segurança',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    stats: [
      { value: '256-bit', label: 'Criptografia' },
      { value: 'ISO 27001', label: 'Certificado' }
    ]
  },
  {
    icon: '⚡',
    title: 'Automação Inteligente',
    description: 'Automatize processos repetitivos e foque no crescimento estratégico do seu negócio',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    stats: [
      { value: '70%', label: 'Tempo Economizado' },
      { value: '5h/dia', label: 'Produtividade' }
    ]
  },
  {
    icon: '🌐',
    title: 'Acesso Multiplataforma',
    description: 'Gerencie de qualquer lugar: desktop, tablet ou smartphone com sincronização em tempo real',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    stats: [
      { value: '100%', label: 'Mobile Ready' },
      { value: 'Cloud', label: 'Sync Instantâneo' }
    ]
  },
  {
    icon: '📊',
    title: 'Analytics Avançado',
    description: 'Dashboards personalizáveis com métricas em tempo real e relatórios detalhados para decisões estratégicas',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    stats: [
      { value: '50+', label: 'KPIs' },
      { value: 'Real-time', label: 'Updates' }
    ]
  },
  {
    icon: '🤝',
    title: 'Suporte Premium',
    description: 'Equipe especializada disponível 24/7 com SLA garantido e tempo de resposta inferior a 2 horas',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    stats: [
      { value: '24/7', label: 'Disponível' },
      { value: '<2h', label: 'Resposta' }
    ]
  }
]

const features = [
  {
    icon: '📊',
    title: 'Dashboard Inteligente',
    description: 'Visualize métricas importantes em tempo real com gráficos interativos e insights automáticos.',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    icon: '📦',
    title: 'Gestão de Estoque',
    description: 'Controle completo do inventário com alertas de estoque baixo e previsão de demanda.',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    icon: '💰',
    title: 'Financeiro Completo',
    description: 'Gerencie receitas, despesas, fluxo de caixa e gere relatórios financeiros detalhados.',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    icon: '👥',
    title: 'Gestão de Equipe',
    description: 'Administre funcionários, controle de ponto, folha de pagamento e comissões.',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    icon: '🤖',
    title: 'IA e Analytics',
    description: 'Análise preditiva com inteligência artificial para otimizar suas operações.',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    icon: '📱',
    title: 'Mobile First',
    description: 'Acesse de qualquer lugar, em qualquer dispositivo. App nativo para iOS e Android.',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  },
  {
    icon: '🔐',
    title: 'Segurança Total',
    description: 'Criptografia de ponta, backups automáticos e conformidade com LGPD.',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  {
    icon: '🔌',
    title: 'Integrações',
    description: 'Conecte com ERPs, sistemas de pagamento e outras ferramentas que você já usa.',
    color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  }
]

const steps = [
  {
    title: 'Cadastre-se gratuitamente',
    description: 'Crie sua conta em menos de 2 minutos. Não é necessário cartão de crédito.'
  },
  {
    title: 'Configure seu negócio',
    description: 'Importe seus dados ou comece do zero com nossos templates prontos.'
  },
  {
    title: 'Comece a gerenciar',
    description: 'Aproveite todos os recursos e veja seus resultados melhorarem.'
  }
]

const testimonials = [
  {
    text: 'O GestaoZe transformou completamente a gestão do meu restaurante. Consigo acompanhar tudo em tempo real e tomar decisões mais assertivas.',
    author: 'Maria Silva',
    role: 'Proprietária - Restaurante Sabor Caseiro',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces'
  },
  {
    text: 'Reduzimos 30% dos custos com estoque em 6 meses. A ferramenta de previsão de demanda é impressionante!',
    author: 'João Santos',
    role: 'Gerente - Padaria do Bairro',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces'
  },
  {
    text: 'Excelente custo-benefício. O suporte é muito atencioso e a plataforma é super intuitiva.',
    author: 'Ana Costa',
    role: 'Diretora - Rede FastFood Premium',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=faces'
  },
  {
    text: 'A integração com nossos sistemas foi perfeita. Em poucos dias já estávamos operando com 100% de eficiência.',
    author: 'Carlos Mendes',
    role: 'CEO - Grupo Alimentar Excellence',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces'
  },
  {
    text: 'A mobilidade que o GestaoZe oferece é incrível. Consigo gerenciar meu negócio de qualquer lugar.',
    author: 'Patricia Oliveira',
    role: 'Proprietária - Cafeteria Moderna',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces'
  },
  {
    text: 'Depois do GestaoZe, nossa produtividade aumentou 45%. A equipe adora a interface intuitiva!',
    author: 'Roberto Lima',
    role: 'Diretor de Operações - Fast Delivery',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces'
  }
]

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

function closeMenu() {
  mobileMenuOpen.value = false
}

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  closeMenu()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  min-height: 100vh;
  background: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #667eea;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
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
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
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

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-menu-toggle span {
  width: 24px;
  height: 2px;
  background: #4a5568;
  transition: all 0.3s ease;
}

/* Hero Section */
.hero {
  position: relative;
  padding: 120px 2rem 80px;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.05;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: #667eea;
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: #764ba2;
  bottom: -100px;
  right: -100px;
  animation-delay: -10s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: #f093fb;
  top: 50%;
  left: 50%;
  animation-delay: -5s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
  margin-bottom: 4rem;
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
  border: 2px solid rgba(30, 64, 175, 0.1);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn svg {
  width: 20px;
  height: 20px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 4rem;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

/* Hero Image */
.hero-image {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
}

.dashboard-preview {
  perspective: 1000px;
}

.preview-window {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform: rotateX(5deg) rotateY(-2deg);
  transition: transform 0.3s ease;
}

.preview-window:hover {
  transform: rotateX(0deg) rotateY(0deg);
}

.window-header {
  background: #f7fafc;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.window-dots {
  display: flex;
  gap: 0.5rem;
}

.window-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e0;
}

.window-dots span:nth-child(1) { background: #fc8181; }
.window-dots span:nth-child(2) { background: #f6e05e; }
.window-dots span:nth-child(3) { background: #68d391; }

.window-title {
  font-size: 0.9rem;
  color: #718096;
  font-weight: 600;
}

.window-content {
  padding: 2rem;
  min-height: 400px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

/* Mock Dashboard */
.mock-dashboard {
  display: flex;
  gap: 1rem;
  height: 100%;
  min-height: 400px;
}

.mock-sidebar {
  width: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.sidebar-item {
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.sidebar-item.active {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mock-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}

.header-title {
  width: 200px;
  height: 24px;
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 60px;
  height: 28px;
  background: #e2e8f0;
  border-radius: 6px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.mock-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.mock-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.mock-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mock-card.card-primary::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mock-card.card-warning::before {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.mock-card.card-success::before {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.mock-card.card-info::before {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.mock-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 1.75rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.card-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.card-trend {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  align-self: flex-start;
}

.card-trend.positive {
  background: #d1fae5;
  color: #065f46;
}

.card-trend.negative {
  background: #fee2e2;
  color: #991b1b;
}

.mock-charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  flex: 1;
}

.mock-chart {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;
}

.chart-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a202c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chart-legend {
  width: 80px;
  height: 16px;
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 100%);
  border-radius: 4px;
}

.chart-content {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px 6px 0 0;
  min-height: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 -2px 8px rgba(102, 126, 234, 0.3);
  animation: growBar 1.5s ease-out;
}

@keyframes growBar {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

.chart-bar:hover {
  background: linear-gradient(180deg, #5a67d8 0%, #6d28d9 100%);
  box-shadow: 0 -4px 12px rgba(102, 126, 234, 0.5);
}

.mock-activities {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activities-header {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a202c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f7fafc;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f7fafc;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
}

.activity-text {
  flex: 1;
  height: 12px;
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e0 50%, #e2e8f0 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
}

/* Highlights Section */
.highlights {
  padding: 80px 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
  position: relative;
  overflow: hidden;
}

.highlights-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.highlight-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.highlight-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-gradient);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.highlight-card:hover::before {
  transform: scaleX(1);
}

.highlight-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.highlight-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.highlight-content {
  position: relative;
}

.highlight-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.75rem;
  background: var(--card-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.highlight-description {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.highlight-stats {
  display: flex;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f7fafc;
}

.highlight-stat {
  flex: 1;
  text-align: center;
}

.highlight-stat .stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  background: var(--card-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.highlight-stat .stat-label {
  font-size: 0.85rem;
  color: #a0aec0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Features Section */
.features {
  padding: 80px 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-label {
  display: inline-block;
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
}

/* How it Works */
.how-it-works {
  padding: 80px 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.steps {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #718096;
  line-height: 1.6;
}

/* Testimonials */
.testimonials {
  padding: 80px 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
}

.testimonial-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.testimonial-image-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.testimonial-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-card:hover .testimonial-image {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  transition: background 0.4s ease;
}

.testimonial-card:hover .image-overlay {
  background: linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.3) 100%);
}

.testimonial-content {
  padding: 2rem;
}

.testimonial-rating {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.125rem;
  filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3));
  transition: transform 0.2s ease;
}

.testimonial-card:hover .star {
  transform: scale(1.1);
}

.testimonial-text {
  font-size: 1.05rem;
  color: #2d3748;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-style: italic;
  position: relative;
  padding-left: 1.5rem;
}

.testimonial-text::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -10px;
  font-size: 3rem;
  color: #667eea;
  opacity: 0.3;
  font-family: Georgia, serif;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f7fafc;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 700;
  color: #1a202c;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.4;
}

/* CTA Section */
.cta-section {
  padding: 80px 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
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

.cta-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-note {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Footer */
.footer {
  background: #1a202c;
  color: white;
  padding: 60px 2rem 30px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: #a0aec0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: white;
}

.footer-heading {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.footer-link {
  display: block;
  color: #a0aec0;
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
  text-align: center;
  color: #a0aec0;
  font-size: 0.9rem;
}

/* Responsivo */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .nav-menu.mobile-open {
    transform: translateX(0);
  }

  .nav-actions {
    display: none;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-title {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-image-wrapper {
    height: 200px;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }

  .mock-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .mock-charts-row {
    grid-template-columns: 1fr;
  }

  .mock-sidebar {
    width: 50px;
    padding: 0.75rem 0.25rem;
  }

  .sidebar-item {
    height: 30px;
  }

  .card-icon {
    font-size: 1.25rem;
  }

  .card-value {
    font-size: 1.15rem;
  }

  .card-label {
    font-size: 0.65rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .mock-cards {
    grid-template-columns: 1fr;
  }

  .chart-bar {
    min-width: 20px;
  }
}
</style>
