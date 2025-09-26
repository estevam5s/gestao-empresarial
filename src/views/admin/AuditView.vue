<template>
  <div class="audit-view">
    <HamburgerMenu :show="true" />

    <div class="audit-container">
      <div class="audit-header">
        <div class="header-content">
          <h1 class="page-title">
            <Shield :size="28" />
            Auditoria do Sistema
          </h1>
          <p class="page-subtitle">Histórico completo de ações e eventos do sistema</p>
        </div>
        <div class="header-actions">
          <button @click="exportAudit" class="btn-primary">
            <Download :size="20" />
            Exportar
          </button>
          <button @click="refreshAudit" class="btn-secondary">
            <RefreshCw :size="20" />
            Atualizar
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-section">
        <div class="search-box">
          <Search :size="20" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar na auditoria..."
            @input="filterAudit"
          />
        </div>
        <div class="filters">
          <select v-model="categoryFilter" @change="filterAudit" class="filter-select">
            <option value="">Todas as Categorias</option>
            <option value="user">Usuário</option>
            <option value="inventory">Estoque</option>
            <option value="financial">Financeiro</option>
            <option value="system">Sistema</option>
            <option value="security">Segurança</option>
          </select>
          <select v-model="actionFilter" @change="filterAudit" class="filter-select">
            <option value="">Todas as Ações</option>
            <option value="create">Criar</option>
            <option value="update">Atualizar</option>
            <option value="delete">Excluir</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
          <select v-model="severityFilter" @change="filterAudit" class="filter-select">
            <option value="">Todas as Severidades</option>
            <option value="info">Info</option>
            <option value="warning">Aviso</option>
            <option value="error">Erro</option>
            <option value="critical">Crítico</option>
          </select>
          <input
            v-model="dateFilter"
            type="date"
            class="filter-date"
            @change="filterAudit"
          />
        </div>
      </div>

      <!-- Estatísticas Rápidas -->
      <div class="stats-grid">
        <div class="stat-card info">
          <div class="stat-icon">
            <Info :size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.info }}</div>
            <div class="stat-label">Info</div>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">
            <AlertTriangle :size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.warning }}</div>
            <div class="stat-label">Avisos</div>
          </div>
        </div>
        <div class="stat-card error">
          <div class="stat-icon">
            <AlertCircle :size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.error }}</div>
            <div class="stat-label">Erros</div>
          </div>
        </div>
        <div class="stat-card critical">
          <div class="stat-icon">
            <XCircle :size="20" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.critical }}</div>
            <div class="stat-label">Críticos</div>
          </div>
        </div>
      </div>

      <!-- Timeline de Auditoria -->
      <div class="audit-timeline">
        <div
          v-for="event in paginatedEvents"
          :key="event.id"
          class="timeline-event"
          :class="event.severity"
        >
          <div class="event-indicator">
            <component :is="getEventIcon(event)" :size="16" />
          </div>
          <div class="event-content">
            <div class="event-header">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-time">{{ formatDate(event.timestamp) }}</div>
            </div>
            <div class="event-description">{{ event.description }}</div>
            <div class="event-metadata">
              <span class="metadata-item">
                <User :size="14" />
                {{ event.user }}
              </span>
              <span class="metadata-item">
                <Tag :size="14" />
                {{ getCategoryName(event.category) }}
              </span>
              <span class="metadata-item">
                <Monitor :size="14" />
                {{ event.ip_address }}
              </span>
              <span v-if="event.details" class="metadata-item details" @click="toggleDetails(event)">
                <Eye :size="14" />
                Ver Detalhes
              </span>
            </div>
            <div v-if="event.showDetails" class="event-details">
              <pre>{{ JSON.stringify(event.details, null, 2) }}</pre>
            </div>
          </div>
        </div>

        <div v-if="filteredEvents.length === 0" class="no-events">
          <FileX :size="48" />
          <p>Nenhum evento encontrado</p>
        </div>
      </div>

      <!-- Paginação -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-btn">
          <ChevronsLeft :size="16" />
        </button>
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
          <ChevronLeft :size="16" />
        </button>
        <span class="page-info">{{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
          <ChevronRight :size="16" />
        </button>
        <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="page-btn">
          <ChevronsRight :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import {
  Shield, Search, Download, RefreshCw, Info, AlertTriangle, AlertCircle,
  XCircle, User, Tag, Monitor, Eye, FileX, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, UserPlus, Edit, Trash2, Key, Lock,
  Package, DollarSign, Settings
} from 'lucide-vue-next'

// Estados reativos
const searchTerm = ref('')
const categoryFilter = ref('')
const actionFilter = ref('')
const severityFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

// Dados simulados de auditoria
const allEvents = ref([
  {
    id: 1,
    timestamp: new Date('2024-01-20T10:30:00'),
    title: 'Login de Usuário',
    description: 'João Silva fez login no sistema',
    category: 'security',
    action: 'login',
    severity: 'info',
    user: 'João Silva',
    ip_address: '192.168.1.100',
    details: { user_id: 1, session_id: 'abc123', browser: 'Chrome 91.0' },
    showDetails: false
  },
  {
    id: 2,
    timestamp: new Date('2024-01-20T10:25:00'),
    title: 'Produto Criado',
    description: 'Novo produto "Notebook Dell" foi adicionado ao estoque',
    category: 'inventory',
    action: 'create',
    severity: 'info',
    user: 'Maria Santos',
    ip_address: '192.168.1.101',
    details: { product_id: 15, name: 'Notebook Dell', category: 'Eletrônicos', price: 2500.00 },
    showDetails: false
  },
  {
    id: 3,
    timestamp: new Date('2024-01-20T10:20:00'),
    title: 'Tentativa de Login Falhada',
    description: 'Tentativa de login com credenciais inválidas',
    category: 'security',
    action: 'login',
    severity: 'warning',
    user: 'Usuário Desconhecido',
    ip_address: '203.45.67.89',
    details: { email: 'hacker@example.com', attempts: 3, blocked: true },
    showDetails: false
  },
  {
    id: 4,
    timestamp: new Date('2024-01-20T10:15:00'),
    title: 'Backup do Sistema',
    description: 'Backup automático realizado com sucesso',
    category: 'system',
    action: 'backup',
    severity: 'info',
    user: 'Sistema',
    ip_address: 'localhost',
    details: { backup_size: '145MB', tables: 15, duration: '2.3s' },
    showDetails: false
  },
  {
    id: 5,
    timestamp: new Date('2024-01-20T10:10:00'),
    title: 'Usuário Desativado',
    description: 'Usuário Pedro Costa foi desativado',
    category: 'user',
    action: 'update',
    severity: 'warning',
    user: 'João Silva',
    ip_address: '192.168.1.100',
    details: { target_user_id: 3, previous_status: 'active', new_status: 'inactive' },
    showDetails: false
  },
  {
    id: 6,
    timestamp: new Date('2024-01-20T10:05:00'),
    title: 'Erro de Conexão com BD',
    description: 'Falha na conexão com o banco de dados',
    category: 'system',
    action: 'error',
    severity: 'error',
    user: 'Sistema',
    ip_address: 'localhost',
    details: { error: 'Connection timeout', database: 'inventory_db', duration: '30s' },
    showDetails: false
  },
  {
    id: 7,
    timestamp: new Date('2024-01-20T10:00:00'),
    title: 'Venda Processada',
    description: 'Venda de R$ 1.200,00 processada com sucesso',
    category: 'financial',
    action: 'create',
    severity: 'info',
    user: 'Ana Oliveira',
    ip_address: '192.168.1.102',
    details: { sale_id: 45, amount: 1200.00, payment_method: 'credit_card', items: 3 },
    showDetails: false
  },
  {
    id: 8,
    timestamp: new Date('2024-01-20T09:55:00'),
    title: 'Configuração Alterada',
    description: 'Configurações de segurança foram atualizadas',
    category: 'system',
    action: 'update',
    severity: 'warning',
    user: 'João Silva',
    ip_address: '192.168.1.100',
    details: { setting: 'password_policy', old_value: 'medium', new_value: 'strict' },
    showDetails: false
  }
])

const filteredEvents = ref([...allEvents.value])

// Computed properties
const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage)
})

const stats = computed(() => {
  const counts = { info: 0, warning: 0, error: 0, critical: 0 }
  filteredEvents.value.forEach(event => {
    counts[event.severity as keyof typeof counts]++
  })
  return counts
})

// Métodos
function getCategoryName(category: string): string {
  const categories: Record<string, string> = {
    user: 'Usuário',
    inventory: 'Estoque',
    financial: 'Financeiro',
    system: 'Sistema',
    security: 'Segurança'
  }
  return categories[category] || category
}

function getEventIcon(event: any) {
  const iconMap: Record<string, any> = {
    login: Key,
    logout: Key,
    create: UserPlus,
    update: Edit,
    delete: Trash2,
    error: AlertCircle,
    backup: Package,
    security: Lock,
    financial: DollarSign,
    system: Settings
  }
  return iconMap[event.action] || Info
}

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })
}

function filterAudit() {
  let filtered = [...allEvents.value]

  // Filtro por texto
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.user.toLowerCase().includes(term)
    )
  }

  // Filtro por categoria
  if (categoryFilter.value) {
    filtered = filtered.filter(event => event.category === categoryFilter.value)
  }

  // Filtro por ação
  if (actionFilter.value) {
    filtered = filtered.filter(event => event.action === actionFilter.value)
  }

  // Filtro por severidade
  if (severityFilter.value) {
    filtered = filtered.filter(event => event.severity === severityFilter.value)
  }

  // Filtro por data
  if (dateFilter.value) {
    const filterDate = new Date(dateFilter.value)
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.timestamp)
      return eventDate.toDateString() === filterDate.toDateString()
    })
  }

  filteredEvents.value = filtered
  currentPage.value = 1
}

function toggleDetails(event: any) {
  event.showDetails = !event.showDetails
}

function exportAudit() {
  // Implementar exportação
  alert('Exportando auditoria...')
}

function refreshAudit() {
  // Implementar atualização
  filterAudit()
  alert('Auditoria atualizada!')
}

onMounted(() => {
  filterAudit()
})
</script>

<style scoped>
.audit-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.audit-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--theme-text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-content p {
  color: var(--theme-text-secondary);
  margin: 0;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--theme-surface);
  border: 2px solid var(--theme-border);
  border-radius: 12px;
  padding: 0 1rem;
  flex: 1;
  min-width: 250px;
}

.search-box input {
  background: none;
  border: none;
  outline: none;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  color: var(--theme-text-primary);
  flex: 1;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select, .filter-date {
  padding: 0.75rem 1rem;
  border: 2px solid var(--theme-border);
  border-radius: 12px;
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  font-size: 0.9rem;
  min-width: 130px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--theme-surface);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-card.info .stat-icon { background: #3b82f6; }
.stat-card.warning .stat-icon { background: #f59e0b; }
.stat-card.error .stat-icon { background: #ef4444; }
.stat-card.critical .stat-icon { background: #dc2626; }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--theme-text-secondary);
}

.audit-timeline {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  max-height: 70vh;
  overflow-y: auto;
}

.timeline-event {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid var(--theme-border);
}

.timeline-event.info { border-left-color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
.timeline-event.warning { border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
.timeline-event.error { border-left-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
.timeline-event.critical { border-left-color: #dc2626; background: rgba(220, 38, 38, 0.1); }

.event-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.timeline-event.info .event-indicator { background: #3b82f6; }
.timeline-event.warning .event-indicator { background: #f59e0b; }
.timeline-event.error .event-indicator { background: #ef4444; }
.timeline-event.critical .event-indicator { background: #dc2626; }

.event-content {
  flex: 1;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.event-title {
  font-weight: 600;
  color: var(--theme-text-primary);
  font-size: 1rem;
}

.event-time {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
  white-space: nowrap;
}

.event-description {
  color: var(--theme-text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.event-metadata {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.metadata-item.details {
  cursor: pointer;
  color: var(--theme-primary);
}

.metadata-item.details:hover {
  text-decoration: underline;
}

.event-details {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--theme-background);
  border-radius: 8px;
  border: 1px solid var(--theme-border);
}

.event-details pre {
  font-size: 0.8rem;
  color: var(--theme-text-primary);
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.no-events {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--theme-text-secondary);
  gap: 1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--theme-primary);
  color: var(--theme-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--theme-text-secondary);
  font-weight: 500;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid;
}

.btn-primary {
  background: var(--theme-primary);
  color: white;
  border-color: var(--theme-primary);
}

.btn-primary:hover {
  background: var(--theme-primary-hover);
  border-color: var(--theme-primary-hover);
}

.btn-secondary {
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  border-color: var(--theme-border);
}

.btn-secondary:hover {
  background: var(--theme-border);
}

@media (max-width: 768px) {
  .audit-view {
    padding-left: 0;
  }

  .audit-container {
    padding: 1rem;
  }

  .audit-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions > * {
    flex: 1;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: unset;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .event-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .event-metadata {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>