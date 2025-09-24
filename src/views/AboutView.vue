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
                <span>Desenvolvido em 2024</span>
              </div>
              <div class="stat">
                <Users :size="16" />
                <span>Para restaurantes e estabelecimentos alimentícios</span>
              </div>
              <div class="stat">
                <Shield :size="16" />
                <span>Licença MIT</span>
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
            <button class="btn-outline">
              <ExternalLink :size="16" />
              Ver Documentação
            </button>
          </div>

          <div class="support-card">
            <div class="support-icon">
              <MessageCircle :size="24" />
            </div>
            <h4>Suporte Técnico</h4>
            <p>Entre em contato conosco para suporte técnico especializado</p>
            <button class="btn-outline">
              <Mail :size="16" />
              Contatar Suporte
            </button>
          </div>

          <div class="support-card">
            <div class="support-icon">
              <Github :size="24" />
            </div>
            <h4>Código Fonte</h4>
            <p>Projeto open source disponível no GitHub</p>
            <button class="btn-outline">
              <Github :size="16" />
              Ver no GitHub
            </button>
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
  version: '1.2.3',
  build: 'build-20240923',
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
    version: '1.2.3',
    date: '23/09/2024',
    type: 'Atualização de Funcionalidades',
    changes: [
      'Novo sistema de relatórios com gráficos interativos',
      'Melhorias na gestão de fornecedores',
      'Otimização do cardápio com análise nutricional',
      'Correções de bugs e melhorias de performance'
    ]
  },
  {
    version: '1.2.2',
    date: '15/09/2024',
    type: 'Correções e Melhorias',
    changes: [
      'Correção no cálculo de margem de lucro',
      'Melhorias na interface do dashboard',
      'Otimização das consultas ao banco de dados',
      'Novos filtros para relatórios'
    ]
  },
  {
    version: '1.2.1',
    date: '08/09/2024',
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
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a202c;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.version-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.main-info {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logo-section {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  align-items: center;
}

.system-logo {
  width: 96px;
  height: 96px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.system-details h2 {
  color: #1a202c;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.tagline {
  color: #64748b;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.system-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 14px;
}

.stat svg {
  color: #667eea;
}

.description h3 {
  color: #1a202c;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.description p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
}

.features-section,
.technical-section,
.status-section,
.support-section,
.changelog-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.features-section h3,
.technical-section h3,
.status-section h3,
.support-section h3,
.changelog-section h3 {
  color: #1a202c;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f5f9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.feature-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 16px;
}

.feature-icon.inventory { background: linear-gradient(135deg, #667eea, #764ba2); }
.feature-icon.menu { background: linear-gradient(135deg, #f093fb, #f5576c); }
.feature-icon.reports { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.feature-icon.ai { background: linear-gradient(135deg, #43e97b, #38f9d7); }

.feature-content h4 {
  color: #1a202c;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.feature-content p {
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}

.feature-content ul {
  color: #4a5568;
  font-size: 14px;
  margin-left: 20px;
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
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.tech-card h4,
.status-card h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a202c;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
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
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
}

.tech-value {
  color: #1a202c;
  font-weight: 600;
  font-size: 14px;
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
  background: #c6f6d5;
  color: #2f855a;
}

.status-indicator.good {
  background: #bee3f8;
  color: #2b6cb0;
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
  color: #38a169;
  font-weight: 600;
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
  color: #64748b;
  font-size: 14px;
}

.metric-value {
  color: #1a202c;
  font-weight: 700;
  font-size: 16px;
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.support-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.support-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.support-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 16px;
}

.support-card h4 {
  color: #1a202c;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.support-card p {
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 20px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.changelog-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.changelog-item {
  border-left: 4px solid #667eea;
  padding-left: 20px;
  position: relative;
}

.changelog-item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 8px;
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
}

.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.changelog-version {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
}

.changelog-date {
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
}

.changelog-type {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 8px;
}

.changelog-content ul {
  color: #4a5568;
  font-size: 14px;
  margin-left: 16px;
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