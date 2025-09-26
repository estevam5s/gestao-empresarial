<template>
  <div class="logs-view">
    <div class="logs-header">
      <h1><i class="fas fa-terminal"></i> Sistema Avançado de Logs</h1>
      <p>Monitoramento profissional, análise em tempo real e controle administrativo</p>
    </div>

    <!-- Terminal Section -->
    <div class="terminal-section">
      <div class="terminal-header">
        <div class="terminal-controls">
          <span class="control-btn close"></span>
          <span class="control-btn minimize"></span>
          <span class="control-btn maximize"></span>
        </div>
        <h3><i class="fas fa-code"></i> Terminal de Comandos Administrativos</h3>
        <button @click="toggleTerminal" class="toggle-terminal-btn">
          {{ showTerminal ? 'Minimizar' : 'Expandir' }} Terminal
        </button>
      </div>

      <div v-show="showTerminal" class="terminal-container">
        <div class="terminal-output" ref="terminalOutput">
          <div v-for="(entry, index) in terminalHistory" :key="index" class="terminal-entry">
            <div v-if="entry.type === 'command'" class="command-line">
              <span class="prompt">admin@gestaeze:~$</span>
              <span class="command">{{ entry.content }}</span>
            </div>
            <div v-else-if="entry.type === 'output'" class="output-line">
              <pre v-if="typeof entry.content === 'object'">{{ JSON.stringify(entry.content, null, 2) }}</pre>
              <span v-else>{{ entry.content }}</span>
            </div>
            <div v-else-if="entry.type === 'error'" class="error-line">
              <i class="fas fa-exclamation-triangle"></i> {{ entry.content }}
            </div>
            <div v-else-if="entry.type === 'success'" class="success-line">
              <i class="fas fa-check-circle"></i> {{ entry.content }}
            </div>
          </div>
        </div>

        <div class="terminal-input-container">
          <span class="prompt">admin@gestaeze:~$</span>
          <input
            ref="terminalInput"
            v-model="currentCommand"
            @keyup.enter="executeCommand"
            @keyup.up="previousCommand"
            @keyup.down="nextCommand"
            @keyup.tab.prevent="autoComplete"
            class="terminal-input"
            placeholder="Digite um comando (help para ajuda)"
            autocomplete="off"
            spellcheck="false"
          >
          <button @click="executeCommand" class="execute-btn">
            <i class="fas fa-play"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Dashboard -->
    <div class="stats-dashboard">
      <div class="stat-card critical">
        <div class="stat-icon"><i class="fas fa-exclamation-circle"></i></div>
        <div class="stat-info">
          <h3>{{ systemStats.criticalIssues || 0 }}</h3>
          <p>Problemas Críticos</p>
        </div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="stat-info">
          <h3>{{ Math.round(systemStats.errorRate || 0) }}%</h3>
          <p>Taxa de Erro</p>
        </div>
      </div>
      <div class="stat-card success">
        <div class="stat-icon"><i class="fas fa-tachometer-alt"></i></div>
        <div class="stat-info">
          <h3>{{ Math.round(systemStats.averageResponseTime || 0) }}ms</h3>
          <p>Tempo Médio</p>
        </div>
      </div>
      <div class="stat-card info">
        <div class="stat-icon"><i class="fas fa-database"></i></div>
        <div class="stat-info">
          <h3>{{ (systemStats.totalLogs || 0).toLocaleString() }}</h3>
          <p>Total de Logs</p>
        </div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="advanced-filters">
      <div class="filter-section">
        <h4><i class="fas fa-filter"></i> Filtros Avançados</h4>
        <div class="filters-grid">
          <div class="filter-group">
            <label>Categoria:</label>
            <select v-model="filters.category" @change="applyFilters">
              <option value="">Todas</option>
              <option value="auth">Autenticação</option>
              <option value="crud">CRUD</option>
              <option value="system">Sistema</option>
              <option value="security">Segurança</option>
              <option value="performance">Performance</option>
              <option value="user">Usuário</option>
              <option value="api">API</option>
              <option value="database">Database</option>
              <option value="command">Comandos</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Severidade:</label>
            <select v-model="filters.severity" @change="applyFilters">
              <option value="">Todas</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Período:</label>
            <input type="datetime-local" v-model="filters.startDate" @change="applyFilters">
          </div>

          <div class="filter-group">
            <label>Até:</label>
            <input type="datetime-local" v-model="filters.endDate" @change="applyFilters">
          </div>

          <div class="filter-group">
            <label>Busca:</label>
            <input
              type="text"
              v-model="filters.search"
              @input="debounceSearch"
              placeholder="Buscar nos logs..."
            >
          </div>

          <div class="filter-group">
            <button @click="clearAllFilters" class="clear-btn">
              <i class="fas fa-times"></i> Limpar
            </button>
            <button @click="generateReport" class="report-btn">
              <i class="fas fa-file-alt"></i> Relatório
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Logs Table -->
    <div class="logs-container">
      <div class="logs-header-actions">
        <h3><i class="fas fa-list"></i> Registro Detalhado do Sistema</h3>
        <div class="header-actions">
          <button @click="toggleRealTimeUpdates" :class="{ active: realTimeUpdates }" class="realtime-btn">
            <i class="fas fa-wifi"></i> {{ realTimeUpdates ? 'Pausar' : 'Tempo Real' }}
          </button>
          <button @click="exportAdvanced" class="export-btn">
            <i class="fas fa-download"></i> Exportar
          </button>
          <button @click="refreshData" class="refresh-btn">
            <i class="fas fa-sync-alt"></i> Atualizar
          </button>
        </div>
      </div>

      <div class="logs-table-wrapper">
        <table class="professional-table">
          <thead>
            <tr>
              <th><i class="fas fa-clock"></i> Timestamp</th>
              <th><i class="fas fa-tag"></i> Categoria</th>
              <th><i class="fas fa-layer-group"></i> Severidade</th>
              <th><i class="fas fa-play"></i> Ação</th>
              <th><i class="fas fa-user"></i> Usuário</th>
              <th><i class="fas fa-cube"></i> Recurso</th>
              <th><i class="fas fa-info-circle"></i> Detalhes</th>
              <th><i class="fas fa-check-circle"></i> Status</th>
              <th><i class="fas fa-tachometer-alt"></i> Tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id || Math.random()" :class="getSeverityClass(log.severity)">
              <td class="timestamp-cell">
                <div class="timestamp-container">
                  <span class="date">{{ formatDate(log.created_at || log.timestamp || '') }}</span>
                  <span class="time">{{ formatTime(log.created_at || log.timestamp || '') }}</span>
                </div>
              </td>
              <td>
                <span :class="getCategoryClass(log.category)">
                  <i :class="getCategoryIcon(log.category)"></i>
                  {{ (log.category || 'SYSTEM').toUpperCase() }}
                </span>
              </td>
              <td>
                <span :class="getSeverityBadgeClass(log.severity)">
                  <i :class="getSeverityIcon(log.severity)"></i>
                  {{ (log.severity || 'INFO').toUpperCase() }}
                </span>
              </td>
              <td class="action-cell">
                <code>{{ log.action || 'N/A' }}</code>
              </td>
              <td class="user-cell">
                <div class="user-info">
                  <i class="fas fa-user-circle"></i>
                  {{ log.username || 'Sistema' }}
                </div>
              </td>
              <td class="resource-cell">
                <span class="resource-name">{{ log.resource || 'N/A' }}</span>
                <span v-if="log.resource_id" class="resource-id">#{{ log.resource_id }}</span>
              </td>
              <td class="details-cell">
                <div class="details-preview" @click="showDetailsModal(log)">
                  <span v-if="typeof log.details === 'string'">{{ truncateText(log.details, 50) }}</span>
                  <span v-else-if="log.details && typeof log.details === 'object'">{{ Object.keys(log.details).length }} propriedades</span>
                  <span v-else>-</span>
                  <i class="fas fa-external-link-alt"></i>
                </div>
              </td>
              <td>
                <span :class="getStatusBadgeClass(log.status)">
                  <i :class="getStatusIcon(log.status)"></i>
                  {{ (log.status || 'SUCCESS').toUpperCase() }}
                </span>
              </td>
              <td class="execution-time">
                <span v-if="log.execution_time">
                  {{ log.execution_time }}ms
                </span>
                <span v-else class="na">-</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner">
            <i class="fas fa-cog fa-spin"></i>
            <p>Carregando dados do sistema...</p>
          </div>
        </div>

        <div v-else-if="logs.length === 0" class="empty-state">
          <i class="fas fa-database" style="font-size: 4rem; color: #6c757d;"></i>
          <h3>Nenhum log encontrado</h3>
          <p>Não há registros para os critérios selecionados</p>
          <button @click="createSampleData" class="sample-btn">
            <i class="fas fa-plus"></i> Criar Dados de Exemplo
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination-container" v-if="totalPages > 1">
        <div class="pagination-info">
          Mostrando {{ logs.length }} de {{ totalLogs }} registros
        </div>
        <div class="pagination-controls">
          <button @click="changePage(1)" :disabled="currentPage === 1" class="page-btn">
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
            <i class="fas fa-angle-left"></i>
          </button>

          <span class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="{ active: page === currentPage }"
              class="page-number"
            >
              {{ page }}
            </button>
          </span>

          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
            <i class="fas fa-angle-right"></i>
          </button>
          <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="page-btn">
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedLog" class="modal-overlay" @click="closeModal">
      <div class="details-modal" @click.stop>
        <div class="modal-header">
          <h4><i class="fas fa-info-circle"></i> Detalhes do Log</h4>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="detail-row">
            <strong>ID:</strong> {{ selectedLog.id || 'N/A' }}
          </div>
          <div class="detail-row">
            <strong>Timestamp:</strong> {{ formatFullDateTime(selectedLog.created_at || selectedLog.timestamp || '') }}
          </div>
          <div class="detail-row">
            <strong>Usuário:</strong> {{ selectedLog.username || 'Sistema' }}
          </div>
          <div class="detail-row">
            <strong>Ação:</strong> <code>{{ selectedLog.action || 'N/A' }}</code>
          </div>
          <div class="detail-row">
            <strong>Recurso:</strong> {{ selectedLog.resource || 'N/A' }}
          </div>
          <div class="detail-row" v-if="selectedLog.resource_id">
            <strong>ID do Recurso:</strong> {{ selectedLog.resource_id }}
          </div>
          <div class="detail-row">
            <strong>IP:</strong> {{ selectedLog.ip_address || 'N/A' }}
          </div>
          <div class="detail-row">
            <strong>User Agent:</strong> {{ selectedLog.user_agent || 'N/A' }}
          </div>
          <div class="detail-row" v-if="selectedLog.execution_time">
            <strong>Tempo de Execução:</strong> {{ selectedLog.execution_time }}ms
          </div>
          <div class="detail-row" v-if="selectedLog.error_message">
            <strong>Mensagem de Erro:</strong>
            <pre class="error-message">{{ selectedLog.error_message }}</pre>
          </div>
          <div class="detail-section">
            <strong>Detalhes:</strong>
            <pre class="json-viewer">{{ JSON.stringify(selectedLog.details || {}, null, 2) }}</pre>
          </div>
          <div class="detail-section" v-if="selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0">
            <strong>Metadata:</strong>
            <pre class="json-viewer">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div v-if="showReportModal" class="modal-overlay" @click="closeReportModal">
      <div class="report-modal" @click.stop>
        <div class="modal-header">
          <h4><i class="fas fa-chart-line"></i> Relatório Técnico do Sistema</h4>
          <button @click="closeReportModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content report-content">
          <div v-if="isGeneratingReport" class="generating-report">
            <i class="fas fa-cog fa-spin"></i>
            <p>Gerando relatório profissional...</p>
          </div>
          <div v-else-if="generatedReport" class="report-viewer">
            <div class="report-actions">
              <button @click="downloadReport" class="download-btn">
                <i class="fas fa-download"></i> Download PDF
              </button>
              <button @click="copyReport" class="copy-btn">
                <i class="fas fa-copy"></i> Copiar Texto
              </button>
            </div>
            <div class="report-text" v-html="formatReportForDisplay(generatedReport)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import { logService, type SystemLog, type LogStatistics, type CommandResult } from '@/services/logService'

// Estados principais
const logs = ref<SystemLog[]>([])
const systemStats = ref<LogStatistics>({
  totalLogs: 0,
  errorRate: 0,
  warningRate: 0,
  topUsers: [],
  topResources: [],
  severityDistribution: {},
  categoryDistribution: {},
  timelineData: [],
  averageResponseTime: 0,
  criticalIssues: 0
})

// Estados do terminal
const showTerminal = ref(true)
const terminalHistory = ref<Array<{ type: 'command' | 'output' | 'error' | 'success', content: any, timestamp: string }>>([])
const currentCommand = ref('')
const commandHistory = ref<string[]>([])
const historyIndex = ref(-1)
const terminalOutput = ref<HTMLElement>()
const terminalInput = ref<HTMLInputElement>()

// Estados de filtros
const filters = ref<any>({
  startDate: '',
  endDate: '',
  severity: '',
  category: '',
  search: '',
  limit: 50,
  offset: 0
})

// Estados da interface
const isLoading = ref(false)
const realTimeUpdates = ref(false)
const currentPage = ref(1)
const totalLogs = ref(0)
const selectedLog = ref<SystemLog | null>(null)
const showReportModal = ref(false)
const isGeneratingReport = ref(false)
const generatedReport = ref('')
const searchDebounceTimer = ref<number>()

// Estados computados
const totalPages = computed(() => Math.ceil(totalLogs.value / (filters.value.limit || 50)))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Timer para atualizações em tempo real
let realTimeInterval: number

// Funções principais
const loadData = async () => {
  isLoading.value = true
  try {
    const queryFilters: any = {
      ...filters.value,
      offset: (currentPage.value - 1) * (filters.value.limit || 50)
    }

    // Converter filtros para o formato correto
    if (queryFilters.severity) {
      queryFilters.severity = [queryFilters.severity]
    }
    if (queryFilters.category) {
      queryFilters.category = [queryFilters.category]
    }

    console.log('Carregando dados com filtros:', queryFilters)

    const [logsResult, statsResult] = await Promise.all([
      logService.getLogs(queryFilters),
      logService.getLogStatistics(30)
    ])

    logs.value = logsResult.data || []
    totalLogs.value = logsResult.total || 0
    systemStats.value = statsResult

    console.log('Dados carregados:', logs.value.length, 'logs')

    // Log da ação
    await logService.logUserAction('view_logs', 'logs_page', {
      filters: queryFilters,
      results: logsResult.data?.length || 0
    })
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    addTerminalEntry('error', `Erro ao carregar dados: ${error}`, new Date().toISOString())
  } finally {
    isLoading.value = false
  }
}

// Funções do terminal
const toggleTerminal = () => {
  showTerminal.value = !showTerminal.value
  if (showTerminal.value) {
    nextTick(() => {
      terminalInput.value?.focus()
    })
  }
}

const addTerminalEntry = (type: 'command' | 'output' | 'error' | 'success', content: any, timestamp: string) => {
  terminalHistory.value.push({ type, content, timestamp })
  nextTick(() => {
    if (terminalOutput.value) {
      terminalOutput.value.scrollTop = terminalOutput.value.scrollHeight
    }
  })
}

const executeCommand = async () => {
  const command = currentCommand.value.trim()
  if (!command) return

  const timestamp = new Date().toISOString()
  addTerminalEntry('command', command, timestamp)

  // Adicionar ao histórico
  commandHistory.value.unshift(command)
  if (commandHistory.value.length > 50) {
    commandHistory.value = commandHistory.value.slice(0, 50)
  }
  historyIndex.value = -1

  try {
    const parts = command.split(' ')
    const cmd = parts[0]
    const args = parts.slice(1)

    const result: CommandResult = await logService.executeCommand(cmd, args)

    if (result.success) {
      addTerminalEntry('success', result.message, result.timestamp)
      if (result.data) {
        addTerminalEntry('output', result.data, result.timestamp)
      }
    } else {
      addTerminalEntry('error', result.message, result.timestamp)
    }
  } catch (error: any) {
    addTerminalEntry('error', `Erro: ${error.message}`, timestamp)
  }

  currentCommand.value = ''
}

const previousCommand = () => {
  if (historyIndex.value < commandHistory.value.length - 1) {
    historyIndex.value++
    currentCommand.value = commandHistory.value[historyIndex.value] || ''
  }
}

const nextCommand = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    currentCommand.value = commandHistory.value[historyIndex.value] || ''
  } else if (historyIndex.value === 0) {
    historyIndex.value = -1
    currentCommand.value = ''
  }
}

const autoComplete = () => {
  const availableCommands = ['logs', 'stats', 'clear', 'users', 'status', 'backup', 'help', 'export', 'search', 'monitor']
  const currentInput = currentCommand.value.toLowerCase()

  const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput))
  if (matches.length === 1) {
    currentCommand.value = matches[0]
  } else if (matches.length > 1) {
    addTerminalEntry('output', `Opções disponíveis: ${matches.join(', ')}`, new Date().toISOString())
  }
}

// Funções de filtros
const applyFilters = () => {
  currentPage.value = 1
  loadData()
}

const clearAllFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    severity: '',
    category: '',
    search: '',
    limit: 50,
    offset: 0
  }
  currentPage.value = 1
  loadData()
}

const debounceSearch = () => {
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
  searchDebounceTimer.value = setTimeout(() => {
    applyFilters()
  }, 500) as unknown as number
}

// Funções de interface
const refreshData = () => {
  loadData()
  addTerminalEntry('success', 'Dados atualizados com sucesso', new Date().toISOString())
}

const changePage = (page: number) => {
  currentPage.value = page
  loadData()
}

const toggleRealTimeUpdates = () => {
  realTimeUpdates.value = !realTimeUpdates.value

  if (realTimeUpdates.value) {
    realTimeInterval = setInterval(() => {
      loadData()
    }, 10000) as unknown as number
    addTerminalEntry('success', 'Monitoramento em tempo real ativado (10s)', new Date().toISOString())
  } else {
    if (realTimeInterval) {
      clearInterval(realTimeInterval)
    }
    addTerminalEntry('success', 'Monitoramento em tempo real desativado', new Date().toISOString())
  }
}

const showDetailsModal = (log: SystemLog) => {
  selectedLog.value = log
  logService.logUserAction('view_log_details', 'logs_page', { logId: log.id })
}

const closeModal = () => {
  selectedLog.value = null
}

const exportAdvanced = async () => {
  try {
    const result = await logService.executeCommand('export', ['--format', 'json', '--days', '7'])
    if (result.success) {
      addTerminalEntry('success', 'Exportação iniciada', new Date().toISOString())
    }
  } catch (error: any) {
    addTerminalEntry('error', `Erro na exportação: ${error.message}`, new Date().toISOString())
  }
}

const generateReport = async () => {
  showReportModal.value = true
  isGeneratingReport.value = true

  try {
    generatedReport.value = await logService.generateTechnicalReport(30)
    addTerminalEntry('success', 'Relatório técnico gerado com sucesso', new Date().toISOString())
  } catch (error: any) {
    addTerminalEntry('error', `Erro ao gerar relatório: ${error.message}`, new Date().toISOString())
  } finally {
    isGeneratingReport.value = false
  }
}

const closeReportModal = () => {
  showReportModal.value = false
  generatedReport.value = ''
}

const downloadReport = () => {
  const blob = new Blob([generatedReport.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-sistema-${new Date().toISOString().split('T')[0]}.md`
  a.click()
  URL.revokeObjectURL(url)
}

const copyReport = async () => {
  try {
    await navigator.clipboard.writeText(generatedReport.value)
    addTerminalEntry('success', 'Relatório copiado para a área de transferência', new Date().toISOString())
  } catch (error) {
    console.error('Erro ao copiar:', error)
  }
}

const createSampleData = async () => {
  try {
    addTerminalEntry('success', 'Criando dados de exemplo...', new Date().toISOString())

    // Criar alguns logs de exemplo
    const sampleLogs = [
      {
        action: 'user_login',
        resource: 'authentication',
        details: { ip: '192.168.1.1', browser: 'Chrome' },
        category: 'auth',
        severity: 'info'
      },
      {
        action: 'create_product',
        resource: 'products',
        resource_id: '123',
        details: { name: 'Produto Teste', price: 100 },
        category: 'crud',
        severity: 'info'
      },
      {
        action: 'database_error',
        resource: 'database',
        details: { error: 'Connection timeout' },
        category: 'database',
        severity: 'error',
        status: 'failed',
        error_message: 'Database connection failed'
      }
    ]

    for (const log of sampleLogs) {
      await logService.createLog(log as any)
    }

    addTerminalEntry('success', `${sampleLogs.length} logs de exemplo criados`, new Date().toISOString())
    await loadData()
  } catch (error: any) {
    addTerminalEntry('error', `Erro ao criar dados: ${error.message}`, new Date().toISOString())
  }
}

// Funções de formatação
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('pt-BR')
}

const formatFullDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR')
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatReportForDisplay = (report: string) => {
  return report
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
}

// Funções de classes CSS
const getSeverityClass = (severity: string) => {
  return `log-row severity-${severity || 'info'}`
}

const getSeverityBadgeClass = (severity: string) => {
  const classes = {
    info: 'badge badge-info',
    warning: 'badge badge-warning',
    error: 'badge badge-error',
    critical: 'badge badge-critical',
    debug: 'badge badge-debug'
  }
  return classes[severity as keyof typeof classes] || 'badge badge-info'
}

const getSeverityIcon = (severity: string) => {
  const icons = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    critical: 'fas fa-skull-crossbones',
    debug: 'fas fa-bug'
  }
  return icons[severity as keyof typeof icons] || 'fas fa-info-circle'
}

const getCategoryClass = (category: string) => {
  return `category-badge category-${category || 'system'}`
}

const getCategoryIcon = (category: string) => {
  const icons = {
    auth: 'fas fa-shield-alt',
    crud: 'fas fa-database',
    system: 'fas fa-cogs',
    security: 'fas fa-lock',
    performance: 'fas fa-tachometer-alt',
    user: 'fas fa-user',
    api: 'fas fa-plug',
    database: 'fas fa-server',
    command: 'fas fa-terminal'
  }
  return icons[category as keyof typeof icons] || 'fas fa-tag'
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    success: 'status-badge status-success',
    failed: 'status-badge status-failed',
    pending: 'status-badge status-pending'
  }
  return classes[status as keyof typeof classes] || 'status-badge status-success'
}

const getStatusIcon = (status: string) => {
  const icons = {
    success: 'fas fa-check',
    failed: 'fas fa-times',
    pending: 'fas fa-clock'
  }
  return icons[status as keyof typeof icons] || 'fas fa-check'
}

// Lifecycle
onMounted(async () => {
  await loadData()

  // Mensagem de boas-vindas no terminal
  addTerminalEntry('success', 'Sistema de Logs GestaoZe v2.0 - Terminal Administrativo Iniciado', new Date().toISOString())
  addTerminalEntry('output', 'Digite "help" para ver os comandos disponíveis', new Date().toISOString())

  // Focus no input do terminal
  nextTick(() => {
    terminalInput.value?.focus()
  })
})

onBeforeUnmount(() => {
  if (realTimeInterval) {
    clearInterval(realTimeInterval)
  }
  if (searchDebounceTimer.value) {
    clearTimeout(searchDebounceTimer.value)
  }
})
</script>

<style src="@/styles/logs-advanced.css" scoped>
/* Estilos base */
.logs-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: #e2e8f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 20px;
  position: relative;
}

.logs-view::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #f59e0b);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.sample-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.sample-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}
</style>
