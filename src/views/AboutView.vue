<template>
  <div class="about-container">
    <header class="page-header">
      <div class="header-content">
        <h1>
          <Info :size="28" />
          Sobre o Sistema
        </h1>
        <div class="version-badge">
          v{{ systemInfo.version }}
        </div>
      </div>
    </header>

    <div class="about-content">
      <!-- Informações Principais -->
      <div class="main-info">
        <div class="logo-section">
          <div class="system-logo">
            <ChefHat :size="64" />
          </div>
          <div class="system-details">
            <h2>Sistema de Gestão Pedacinho do Céu</h2>
            <p class="tagline">Solução completa para gestão de estoque e cardápio</p>
            <div class="system-stats">
              <div class="stat">
                <Calendar :size="16" />
                <span>Desenvolvido em 2025</span>
              </div>
              <div class="stat">
                <Users :size="16" />
                <span>Para restaurantes e estabelecimentos alimentícios</span>
              </div>
              <div class="stat">
                <Shield :size="16" />
                <span>Licença Proprietária</span>
              </div>
            </div>
          </div>
        </div>

        <div class="description">
          <h3>Sobre o Sistema</h3>
          <p>
            O Sistema de Gestão Pedacinho do Céu foi desenvolvido especificamente para atender às necessidades
            de restaurantes, lanchonetes e estabelecimentos do setor alimentício. Nossa plataforma oferece
            ferramentas completas para controle de estoque, gestão de cardápio, relatórios financeiros e
            muito mais.
          </p>
          <p>
            Com interface intuitiva e recursos avançados, o sistema permite que você tenha controle total
            sobre seu negócio, desde o controle de ingredientes até a análise de vendas e lucratividade.
          </p>
        </div>
      </div>

      <!-- Funcionalidades -->
      <div class="features-section">
        <h3>Principais Funcionalidades</h3>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon inventory">
              <Package :size="24" />
            </div>
            <div class="feature-content">
              <h4>Gestão de Estoque</h4>
              <p>Controle completo de produtos, ingredientes, fornecedores e movimentações com alertas automáticos.</p>
              <ul>
                <li>Controle de estoque mínimo</li>
                <li>Alertas de produtos em falta</li>
                <li>Gestão de fornecedores</li>
                <li>Histórico de movimentações</li>
              </ul>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon menu">
              <ChefHat :size="24" />
            </div>
            <div class="feature-content">
              <h4>Cardápio Inteligente</h4>
              <p>Crie e gerencie seu cardápio com cálculo automático de custos e margem de lucro.</p>
              <ul>
                <li>Receitas com ingredientes</li>
                <li>Cálculo de custos automático</li>
                <li>Controle nutricional</li>
                <li>Planejamento semanal</li>
              </ul>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon reports">
              <BarChart3 :size="24" />
            </div>
            <div class="feature-content">
              <h4>Relatórios e Análises</h4>
              <p>Dashboards e relatórios detalhados para tomada de decisões estratégicas.</p>
              <ul>
                <li>Análise de vendas</li>
                <li>Relatórios financeiros</li>
                <li>Gráficos interativos</li>
                <li>Exportação de dados</li>
              </ul>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon ai">
              <Brain :size="24" />
            </div>
            <div class="feature-content">
              <h4>Inteligência Artificial</h4>
              <p>IA integrada para sugestões inteligentes e otimização de processos.</p>
              <ul>
                <li>Previsão de demanda</li>
                <li>Sugestões de compra</li>
                <li>Análise de tendências</li>
                <li>Otimização de cardápio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações Técnicas -->
      <div class="technical-section">
        <h3>Informações Técnicas</h3>
        <div class="tech-grid">
          <div class="tech-card">
            <h4>
              <Code :size="20" />
              Tecnologias
            </h4>
            <div class="tech-list">
              <div class="tech-item">
                <span class="tech-name">Frontend:</span>
                <span class="tech-value">Vue 3, TypeScript, Vite</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Backend:</span>
                <span class="tech-value">Supabase, PostgreSQL</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Gráficos:</span>
                <span class="tech-value">Chart.js, Vue-Chartjs</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Ícones:</span>
                <span class="tech-value">Lucide Vue</span>
              </div>
            </div>
          </div>

          <div class="tech-card">
            <h4>
              <Server :size="20" />
              Sistema
            </h4>
            <div class="tech-list">
              <div class="tech-item">
                <span class="tech-name">Versão:</span>
                <span class="tech-value">{{ systemInfo.version }}</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Build:</span>
                <span class="tech-value">{{ systemInfo.build }}</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Ambiente:</span>
                <span class="tech-value">{{ systemInfo.environment }}</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Última Atualização:</span>
                <span class="tech-value">{{ systemInfo.lastUpdate }}</span>
              </div>
            </div>
          </div>

          <div class="tech-card">
            <h4>
              <Database :size="20" />
              Base de Dados
            </h4>
            <div class="tech-list">
              <div class="tech-item">
                <span class="tech-name">Banco:</span>
                <span class="tech-value">PostgreSQL 15</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">ORM:</span>
                <span class="tech-value">Supabase Client</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Backup:</span>
                <span class="tech-value">Automático Diário</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">SSL/TLS:</span>
                <span class="tech-value">Habilitado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status do Sistema -->
      <div class="status-section">
        <h3>Status do Sistema</h3>
        <div class="status-grid">
          <div class="status-card">
            <div class="status-header">
              <h4>Serviços</h4>
              <div class="status-indicator online">
                <div class="status-dot"></div>
                Online
              </div>
            </div>
            <div class="status-services">
              <div class="service-item">
                <span>API Principal</span>
                <span class="service-status online">✓ Online</span>
              </div>
              <div class="service-item">
                <span>Base de Dados</span>
                <span class="service-status online">✓ Online</span>
              </div>
              <div class="service-item">
                <span>Autenticação</span>
                <span class="service-status online">✓ Online</span>
              </div>
              <div class="service-item">
                <span>Backup</span>
                <span class="service-status online">✓ Ativo</span>
              </div>
            </div>
          </div>

          <div class="status-card">
            <div class="status-header">
              <h4>Performance</h4>
              <div class="status-indicator good">
                <div class="status-dot"></div>
                Excelente
              </div>
            </div>
            <div class="performance-metrics">
              <div class="metric-item">
                <div class="metric-label">Tempo de Resposta</div>
                <div class="metric-value">{{ performance.responseTime }}ms</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Uptime</div>
                <div class="metric-value">{{ performance.uptime }}%</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Usuários Ativos</div>
                <div class="metric-value">{{ performance.activeUsers }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suporte e Contato -->
      <div class="support-section">
        <h3>Suporte e Contato</h3>
        <div class="support-grid">
          <div class="support-card">
            <div class="support-icon">
              <HelpCircle :size="24" />
            </div>
            <h4>Documentação</h4>
            <p>Acesse nossa documentação completa com guias e tutoriais</p>
            <a href="https://github.com/Gestao-de-estoque/gestao-estoque-vue" target="_blank" rel="noopener noreferrer" class="btn-outline">
              <ExternalLink :size="16" />
              Ver Documentação
            </a>
          </div>

          <div class="support-card">
            <div class="support-icon">
              <MessageCircle :size="24" />
            </div>
            <h4>Suporte Técnico</h4>
            <p>Entre em contato conosco para suporte técnico especializado</p>
            <a href="mailto:suporte@pedacinhodoceu.com" class="btn-outline">
              <Mail :size="16" />
              Contatar Suporte
            </a>
          </div>

          <div class="support-card">
            <div class="support-icon">
              <Github :size="24" />
            </div>
            <h4>Código Fonte</h4>
            <p>Projeto open source disponível no GitHub</p>
            <a href="https://github.com/Gestao-de-estoque/gestao-estoque-vue" target="_blank" rel="noopener noreferrer" class="btn-outline">
              <Github :size="16" />
              Ver no GitHub
            </a>
          </div>
        </div>
      </div>

      <!-- Changelog -->
      <div class="changelog-section">
        <h3>Atualizações Recentes</h3>
        <div class="changelog-list">
          <div v-for="update in changelog" :key="update.version" class="changelog-item">
            <div class="changelog-header">
              <div class="changelog-version">v{{ update.version }}</div>
              <div class="changelog-date">{{ update.date }}</div>
            </div>
            <div class="changelog-content">
              <div class="changelog-type">{{ update.type }}</div>
              <ul>
                <li v-for="change in update.changes" :key="change">{{ change }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Icons
import {
  Info, ChefHat, Calendar, Users, Shield, Package, BarChart3, Brain,
  Code, Server, Database, HelpCircle, MessageCircle, Github, ExternalLink,
  Mail
} from 'lucide-vue-next'

// System Information
const systemInfo = reactive({
  version: '1.0.0',
  build: 'build-20250923',
  environment: 'production',
  lastUpdate: format(new Date(), 'dd/MM/yyyy', { locale: ptBR })
})

const performance = reactive({
  responseTime: 120,
  uptime: 99.9,
  activeUsers: 1
})

const changelog = ref([
  {
    version: '1.0.0',
    date: '23/09/2025',
    type: 'Atualização de Funcionalidades',
    changes: [
      'Novo sistema de relatórios com gráficos interativos',
      'Melhorias na gestão de fornecedores',
      'Otimização do cardápio com análise nutricional',
      'Correções de bugs e melhorias de performance'
    ]
  },
  {
    version: '1.0.1',
    date: '15/09/2025',
    type: 'Correções e Melhorias',
    changes: [
      'Correção no cálculo de margem de lucro',
      'Melhorias na interface do dashboard',
      'Otimização das consultas ao banco de dados',
      'Novos filtros para relatórios'
    ]
  },
  {
    version: '1.0.2',
    date: '08/09/2025',
    type: 'Atualização de Segurança',
    changes: [
      'Melhorias na autenticação de usuários',
      'Atualizações de segurança',
      'Novo sistema de backup automático',
      'Correções menores na interface'
    ]
  }
])
</script>

<style scoped>
.about-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--theme-background-solid);
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--theme-surface);
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--theme-text-primary);
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.version-badge {
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.main-info {
  background: var(--theme-surface);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 40px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.logo-section {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  align-items: center;
}

.system-logo {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.system-details h2 {
  color: var(--theme-text-primary);
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.tagline {
  color: var(--theme-text-secondary);
  font-size: 18px;
  margin: 0 0 24px 0;
  font-weight: 500;
  line-height: 1.4;
}

.system-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--theme-text-secondary);
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.stat svg {
  color: var(--theme-primary);
  transition: color 0.3s ease;
}

.description h3 {
  color: var(--theme-text-primary);
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
}

.description p {
  color: var(--theme-text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
  font-size: 16px;
}

.features-section,
.technical-section,
.status-section,
.support-section,
.changelog-section {
  background: var(--theme-surface);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 40px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.features-section h3,
.technical-section h3,
.status-section h3,
.support-section h3,
.changelog-section h3 {
  color: var(--theme-text-primary);
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 32px 0;
  padding-bottom: 16px;
  border-bottom: 3px solid var(--theme-border);
  letter-spacing: -0.02em;
  position: relative;
}

.features-section h3::after,
.technical-section h3::after,
.status-section h3::after,
.support-section h3::after,
.changelog-section h3::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.feature-card {
  background: var(--theme-background-solid);
  border-radius: 20px;
  padding: 32px;
  border: 2px solid var(--theme-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-card:hover {
  border-color: var(--theme-primary);
  transform: translateY(-8px);
  box-shadow: 0 20px 60px var(--theme-shadow);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-icon.inventory { background: linear-gradient(135deg, #667eea, #764ba2); }
.feature-icon.menu { background: linear-gradient(135deg, #f093fb, #f5576c); }
.feature-icon.reports { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.feature-icon.ai { background: linear-gradient(135deg, #43e97b, #38f9d7); }

.feature-content h4 {
  color: var(--theme-text-primary);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.01em;
}

.feature-content p {
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 16px;
}

.feature-content ul {
  color: var(--theme-text-secondary);
  font-size: 15px;
  margin-left: 24px;
  line-height: 1.6;
}

.feature-content li {
  margin-bottom: 4px;
}

.tech-grid,
.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.tech-card,
.status-card {
  background: var(--theme-background-solid);
  border-radius: 20px;
  padding: 28px;
  border: 2px solid var(--theme-border);
  transition: all 0.3s ease;
  position: relative;
}

.tech-card:hover,
.status-card:hover {
  border-color: var(--theme-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--theme-shadow);
}

.tech-card h4,
.status-card h4 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--theme-text-primary);
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tech-name {
  color: var(--theme-text-secondary);
  font-weight: 600;
  font-size: 15px;
}

.tech-value {
  color: var(--theme-text-primary);
  font-weight: 700;
  font-size: 15px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}

.status-indicator.online {
  background: rgba(80, 250, 123, 0.2);
  color: var(--theme-accent-success);
  border: 1px solid rgba(80, 250, 123, 0.3);
}

.status-indicator.good {
  background: rgba(59, 130, 246, 0.2);
  color: var(--theme-accent-info);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-services {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.service-status.online {
  color: var(--theme-accent-success);
  font-weight: 700;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  color: var(--theme-text-secondary);
  font-size: 15px;
  font-weight: 500;
}

.metric-value {
  color: var(--theme-text-primary);
  font-weight: 800;
  font-size: 18px;
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.support-card {
  background: var(--theme-background-solid);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  border: 2px solid var(--theme-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.support-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.support-card:hover {
  border-color: var(--theme-primary);
  transform: translateY(-8px);
  box-shadow: 0 20px 60px var(--theme-shadow);
}

.support-card:hover::before {
  transform: scaleX(1);
}

.support-card:hover .support-icon {
  transform: scale(1.1) rotate(5deg);
}

.support-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.support-card h4 {
  color: var(--theme-text-primary);
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.01em;
}

.support-card p {
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
  font-size: 16px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: transparent;
  border: 2px solid var(--theme-primary);
  color: var(--theme-primary);
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-outline::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  transition: left 0.3s ease;
  z-index: -1;
}

.btn-outline:hover {
  color: white;
  border-color: var(--theme-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.btn-outline:hover::before {
  left: 0;
}

.changelog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.changelog-item {
  border-left: 4px solid var(--theme-primary);
  padding-left: 24px;
  position: relative;
  transition: all 0.3s ease;
}

.changelog-item:hover {
  border-left-color: var(--theme-secondary);
  transform: translateX(4px);
}

.changelog-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 12px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  border-radius: 50%;
  box-shadow: 0 0 0 4px var(--theme-background-solid);
  transition: all 0.3s ease;
}

.changelog-item:hover::before {
  transform: scale(1.3);
  box-shadow: 0 0 0 6px var(--theme-background-solid), 0 4px 12px rgba(102, 126, 234, 0.3);
}

.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.changelog-version {
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  color: white;
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.changelog-date {
  color: var(--theme-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.changelog-type {
  color: var(--theme-text-primary);
  font-weight: 700;
  margin-bottom: 12px;
  font-size: 16px;
}

.changelog-content ul {
  color: var(--theme-text-secondary);
  font-size: 15px;
  margin-left: 20px;
  line-height: 1.6;
}

.changelog-content li {
  margin-bottom: 4px;
}

/* Responsividade */
@media (max-width: 768px) {
  .about-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .logo-section {
    flex-direction: column;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid,
  .status-grid {
    grid-template-columns: 1fr;
  }

  .support-grid {
    grid-template-columns: 1fr;
  }

  .system-stats {
    align-items: center;
  }
}
</style>