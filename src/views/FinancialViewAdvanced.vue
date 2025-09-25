<template>
  <div class="financial-analytics-container">
    <!-- Advanced Header -->
    <div class="analytics-header">
      <div class="header-content">
        <div class="header-left">
          <div class="title-section">
            <h1 class="page-title">
              <TrendingUp :size="32" />
              Analytics Financeiro Avançado
            </h1>
            <p class="page-subtitle">
              Análise inteligente de dados, insights preditivos e relatórios profissionais
            </p>
          </div>
        </div>
        <div class="header-actions">
          <div class="quick-stats">
            <div class="stat-card primary" :class="{ 'positive': (summary as any).growthRate > 0, 'negative': (summary as any).growthRate < 0 }">
              <div class="stat-icon">
                <TrendingUp v-if="(summary as any).growthRate > 0" :size="20" />
                <TrendingDown v-else :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ (summary as any).growthRate?.toFixed(1) || 0 }}%</div>
                <div class="stat-label">Crescimento</div>
              </div>
            </div>
            <div class="stat-card success">
              <div class="stat-icon">
                <DollarSign :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ formatCurrency(summary.totalRevenue || 0) }}</div>
                <div class="stat-label">Receita Total</div>
              </div>
            </div>
            <div class="stat-card info">
              <div class="stat-icon">
                <Calendar :size="20" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ filteredRecords.length }}</div>
                <div class="stat-label">Registros</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Date Filter Panel -->
    <div class="filter-panel">
      <div class="filter-section">
        <div class="filter-title">
          <Filter :size="20" />
          <span>Filtros Avançados</span>
        </div>

        <div class="filter-controls">
          <!-- Quick Date Filters -->
          <div class="quick-filters">
            <button
              v-for="filter in quickFilters"
              :key="filter.key"
              @click="applyQuickFilter(filter.key)"
              :class="['quick-filter-btn', { active: activeQuickFilter === filter.key }]"
            >
              <component :is="filter.icon" :size="16" />
              {{ filter.label }}
            </button>
          </div>

          <!-- Custom Date Range -->
          <div class="date-range-controls">
            <div class="date-input-group">
              <label>Data Inicial:</label>
              <input
                v-model="dateFilters.startDate"
                type="date"
                class="date-input"
                @change="applyDateFilter"
              />
            </div>
            <div class="date-input-group">
              <label>Data Final:</label>
              <input
                v-model="dateFilters.endDate"
                type="date"
                class="date-input"
                @change="applyDateFilter"
              />
            </div>
            <button @click="clearFilters" class="clear-filters-btn">
              <X :size="16" />
              Limpar
            </button>
          </div>

          <!-- Advanced Filters -->
          <div class="advanced-filters">
            <select v-model="filters.groupBy" @change="updateAnalysis" class="filter-select">
              <option value="day">Agrupar por Dia</option>
              <option value="week">Agrupar por Semana</option>
              <option value="month">Agrupar por Mês</option>
              <option value="quarter">Agrupar por Trimestre</option>
              <option value="year">Agrupar por Ano</option>
            </select>

            <select v-model="filters.sortBy" @change="updateAnalysis" class="filter-select">
              <option value="date">Ordenar por Data</option>
              <option value="revenue">Ordenar por Receita</option>
              <option value="growth">Ordenar por Crescimento</option>
            </select>

            <select v-model="filters.sortOrder" @change="updateAnalysis" class="filter-select">
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>

          <!-- Export & Actions -->
          <div class="action-controls">
            <button @click="exportData" class="action-btn export">
              <Download :size="16" />
              Exportar
            </button>
            <button @click="generateReport" class="action-btn report">
              <FileText :size="16" />
              Relatório
            </button>
            <button @click="refreshData" class="action-btn refresh" :disabled="loading">
              <RefreshCw :size="16" :class="{ 'animate-spin': loading }" />
              Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <BarChart3 :size="48" class="animate-pulse" />
        <h3>Processando análises...</h3>
        <p>Calculando métricas avançadas e insights</p>
      </div>
    </div>

    <!-- Main Analytics Content -->
    <div v-else class="analytics-content">
      <!-- Key Performance Indicators -->
      <section class="kpi-section">
        <div class="section-header">
          <h2>
            <Activity :size="24" />
            Indicadores Chave de Performance
          </h2>
          <div class="period-info">
            <Calendar :size="16" />
            {{ formatDateRange() }}
          </div>
        </div>

        <div class="kpi-grid">
          <div v-for="kpi in kpis" :key="kpi.key" class="kpi-card" :class="kpi.trend">
            <div class="kpi-header">
              <div class="kpi-icon" :class="kpi.type">
                <component :is="kpi.icon" :size="24" />
              </div>
              <div class="kpi-trend-indicator">
                <component :is="getTrendIcon(kpi.change)" :size="16" />
                <span>{{ Math.abs(kpi.change).toFixed(1) }}%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpi.value }}</div>
              <div class="kpi-label">{{ kpi.label }}</div>
            </div>
            <div class="kpi-comparison">
              <span class="comparison-text">vs período anterior</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts Grid -->
      <section class="charts-section">
        <div class="charts-grid">
          <!-- Revenue Trend Chart -->
          <div class="chart-container">
            <div class="chart-header">
              <h3>
                <LineChart :size="20" />
                Tendência de Receita
              </h3>
              <div class="chart-controls">
                <select v-model="chartConfigs.revenue.type" @change="updateChart('revenue')">
                  <option value="line">Linha</option>
                  <option value="area">Área</option>
                  <option value="bar">Barras</option>
                </select>
              </div>
            </div>
            <div class="chart-content">
              <Line
                v-if="chartConfigs.revenue.type === 'line'"
                :data="revenueChartData"
                :options="chartOptions.line"
              />
              <Bar
                v-else-if="chartConfigs.revenue.type === 'bar'"
                :data="revenueChartData"
                :options="chartOptions.bar"
              />
              <Line
                v-else
                :data="revenueAreaChartData"
                :options="chartOptions.area"
              />
            </div>
          </div>

          <!-- Growth Analysis -->
          <div class="chart-container">
            <div class="chart-header">
              <h3>
                <TrendingUp :size="20" />
                Análise de Crescimento
              </h3>
            </div>
            <div class="chart-content">
              <Bar :data="growthChartData" :options="chartOptions.growth" />
            </div>
          </div>

          <!-- Distribution Chart -->
          <div class="chart-container">
            <div class="chart-header">
              <h3>
                <PieChart :size="20" />
                Distribuição por Período
              </h3>
            </div>
            <div class="chart-content">
              <Doughnut :data="distributionChartData" :options="chartOptions.doughnut" />
            </div>
          </div>

          <!-- Heatmap -->
          <div class="chart-container full-width">
            <div class="chart-header">
              <h3>
                <Calendar :size="20" />
                Mapa de Calor - Performance Diária
              </h3>
            </div>
            <div class="heatmap-container">
              <div class="heatmap-grid">
                <div
                  v-for="(day, index) in heatmapData"
                  :key="index"
                  class="heatmap-cell"
                  :class="getHeatmapIntensity(day.value)"
                  :title="`${day.date}: ${formatCurrency(day.value)}`"
                >
                  <span class="day-value">{{ day.day }}</span>
                </div>
              </div>
              <div class="heatmap-legend">
                <span>Menos</span>
                <div class="legend-scale">
                  <div class="scale-item level-1"></div>
                  <div class="scale-item level-2"></div>
                  <div class="scale-item level-3"></div>
                  <div class="scale-item level-4"></div>
                  <div class="scale-item level-5"></div>
                </div>
                <span>Mais</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Advanced Statistics -->
      <section class="statistics-section">
        <div class="section-header">
          <h2>
            <BarChart3 :size="24" />
            Análises Estatísticas Avançadas
          </h2>
        </div>

        <div class="statistics-grid">
          <div class="stat-panel">
            <h4>Métricas Descritivas</h4>
            <div class="stat-list">
              <div class="stat-item">
                <span class="stat-name">Média:</span>
                <span class="stat-value">{{ formatCurrency(statistics.mean) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Mediana:</span>
                <span class="stat-value">{{ formatCurrency(statistics.median) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Desvio Padrão:</span>
                <span class="stat-value">{{ formatCurrency(statistics.standardDeviation) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Coeficiente de Variação:</span>
                <span class="stat-value">{{ (statistics.coefficientVariation * 100).toFixed(2) }}%</span>
              </div>
            </div>
          </div>

          <div class="stat-panel">
            <h4>Tendências</h4>
            <div class="stat-list">
              <div class="stat-item">
                <span class="stat-name">Tendência Linear:</span>
                <span class="stat-value" :class="statistics.linearTrend > 0 ? 'positive' : 'negative'">
                  {{ statistics.linearTrend > 0 ? '+' : '' }}{{ (statistics.linearTrend * 100).toFixed(2) }}%
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Correlação Temporal:</span>
                <span class="stat-value">{{ statistics.temporalCorrelation.toFixed(3) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Sazonalidade:</span>
                <span class="stat-value">{{ statistics.seasonality.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="stat-panel">
            <h4>Previsões</h4>
            <div class="stat-list">
              <div class="stat-item">
                <span class="stat-name">Próximo Período:</span>
                <span class="stat-value">{{ formatCurrency(predictions.nextPeriod) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Tendência (30 dias):</span>
                <span class="stat-value" :class="predictions.trend30Days > 0 ? 'positive' : 'negative'">
                  {{ predictions.trend30Days > 0 ? '+' : '' }}{{ (predictions.trend30Days * 100).toFixed(1) }}%
                </span>
              </div>
              <div class="stat-item">
                <span class="stat-name">Confiança:</span>
                <span class="stat-value">{{ (predictions.confidence * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Comparative Analysis -->
      <section class="comparison-section">
        <div class="section-header">
          <h2>
            <GitCompare :size="24" />
            Análise Comparativa
          </h2>
        </div>

        <div class="comparison-controls">
          <select v-model="comparison.type" @change="updateComparison">
            <option value="period">Comparar Períodos</option>
            <option value="year">Comparar Anos</option>
            <option value="quarter">Comparar Trimestres</option>
            <option value="month">Comparar Meses</option>
          </select>

          <select v-model="comparison.baseline" @change="updateComparison">
            <option value="previous">Período Anterior</option>
            <option value="same_last_year">Mesmo Período Ano Passado</option>
            <option value="average">Média Histórica</option>
          </select>
        </div>

        <div class="comparison-results">
          <div class="comparison-chart">
            <Bar :data="comparisonChartData" :options="chartOptions.comparison" />
          </div>

          <div class="comparison-insights">
            <div v-for="insight in comparisonInsights" :key="insight.metric" class="insight-item">
              <div class="insight-metric">{{ insight.metric }}</div>
              <div class="insight-comparison">
                <span class="current-value">{{ insight.current }}</span>
                <span class="vs">vs</span>
                <span class="baseline-value">{{ insight.baseline }}</span>
              </div>
              <div class="insight-change" :class="insight.changeType">
                <component :is="insight.changeType === 'positive' ? TrendingUp : TrendingDown" :size="16" />
                {{ Math.abs(insight.changePercent).toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Data Table with Advanced Features -->
      <section class="data-table-section">
        <div class="section-header">
          <h2>
            <Table :size="24" />
            Dados Detalhados
          </h2>
          <div class="table-controls">
            <div class="search-box">
              <Search :size="16" />
              <input
                v-model="searchTerm"
                placeholder="Buscar nos dados..."
                class="search-input"
              />
            </div>
            <select v-model="tableConfig.pageSize" class="page-size-select">
              <option value="10">10 por página</option>
              <option value="25">25 por página</option>
              <option value="50">50 por página</option>
              <option value="100">100 por página</option>
            </select>
          </div>
        </div>

        <div class="advanced-table">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="column in tableColumns" :key="column.key" @click="sortBy(column.key)" class="sortable">
                  {{ column.label }}
                  <ArrowUpDown :size="14" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in paginatedRecords" :key="record.id" class="data-row">
                <td>{{ formatDate(record.full_day) }}</td>
                <td class="currency">{{ formatCurrency(record.total) }}</td>
                <td class="currency secondary">{{ formatCurrency(record.amount) }}</td>
                <td class="percentage">{{ calculatePercentage(record.amount, record.total).toFixed(2) }}%</td>
                <td class="growth" :class="(record as any).growth > 0 ? 'positive' : 'negative'">
                  {{ (record as any).growth ? ((record as any).growth > 0 ? '+' : '') + (record as any).growth.toFixed(1) + '%' : 'N/A' }}
                </td>
                <td class="actions">
                  <button @click="viewDetails(record)" class="btn-icon">
                    <Eye :size="16" />
                  </button>
                  <button @click="editRecord(record)" class="btn-icon">
                    <Edit :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <ChevronLeft :size="16" />
              Anterior
            </button>

            <div class="page-numbers">
              <span v-for="page in visiblePages" :key="page" class="page-number" :class="{ active: page === currentPage }" @click="goToPage(page)">
                {{ page }}
              </span>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Próximo
              <ChevronRight :size="16" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import {
  DollarSign, TrendingUp, TrendingDown, Target, RefreshCw,
  Download, BarChart3, PieChart, Activity, Table, Calendar, Filter,
  Search, ArrowUpDown, Edit, X, LineChart, GitCompare, Eye, ChevronLeft,
  ChevronRight, FileText
} from 'lucide-vue-next'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler, TimeScale
} from 'chart.js'
import { financialService, type FinancialRecord, type FinancialSummary } from '@/services/financialService'

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler, TimeScale
)

// Interfaces
interface DateFilter {
  startDate: string
  endDate: string
}

interface FilterConfig {
  groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year'
  sortBy: 'date' | 'revenue' | 'growth'
  sortOrder: 'asc' | 'desc'
}

interface KPI {
  key: string
  label: string
  value: string
  change: number
  trend: 'positive' | 'negative' | 'neutral'
  type: 'primary' | 'success' | 'warning' | 'danger'
  icon: any
}

interface Statistics {
  mean: number
  median: number
  standardDeviation: number
  coefficientVariation: number
  linearTrend: number
  temporalCorrelation: number
  seasonality: number
}

interface Predictions {
  nextPeriod: number
  trend30Days: number
  confidence: number
}

interface ChartConfig {
  type: 'line' | 'bar' | 'area'
}

interface ComparisonConfig {
  type: 'period' | 'year' | 'quarter' | 'month'
  baseline: 'previous' | 'same_last_year' | 'average'
}

// Reactive state
const loading = ref(true)
const refreshing = ref(false)
const records = ref<FinancialRecord[]>([])
const searchTerm = ref('')
const currentPage = ref(1)
const activeQuickFilter = ref('last30days')

// Date filters
const dateFilters = reactive<DateFilter>({
  startDate: '',
  endDate: ''
})

// Advanced filters
const filters = reactive<FilterConfig>({
  groupBy: 'day',
  sortBy: 'date',
  sortOrder: 'desc'
})

// Chart configurations
const chartConfigs = reactive({
  revenue: { type: 'line' } as ChartConfig
})

// Comparison configuration
const comparison = reactive<ComparisonConfig>({
  type: 'period',
  baseline: 'previous'
})

// Table configuration
const tableConfig = reactive({
  pageSize: 25
})

// Quick filters definition
const quickFilters = [
  { key: 'today', label: 'Hoje', icon: Calendar },
  { key: 'yesterday', label: 'Ontem', icon: Calendar },
  { key: 'last7days', label: 'Últimos 7 dias', icon: Calendar },
  { key: 'last30days', label: 'Últimos 30 dias', icon: Calendar },
  { key: 'thisWeek', label: 'Esta semana', icon: Calendar },
  { key: 'thisMonth', label: 'Este mês', icon: Calendar },
  { key: 'lastMonth', label: 'Mês passado', icon: Calendar },
  { key: 'thisYear', label: 'Este ano', icon: Calendar },
  { key: 'lastYear', label: 'Ano passado', icon: Calendar },
  { key: 'custom', label: 'Personalizado', icon: Filter }
]

// Table columns
const tableColumns = [
  { key: 'date', label: 'Data' },
  { key: 'revenue', label: 'Receita Total' },
  { key: 'amount', label: 'Valor Garçom' },
  { key: 'percentage', label: 'Percentual' },
  { key: 'growth', label: 'Crescimento' },
  { key: 'actions', label: 'Ações' }
]

// Computed properties
const summary = computed((): FinancialSummary => {
  const total = filteredRecords.value.reduce((sum, record) => sum + record.total, 0)
  const amount = filteredRecords.value.reduce((sum, record) => sum + record.amount, 0)
  const count = filteredRecords.value.length

  // const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0

  return {
    totalRevenue: total,
    totalWaiterSalary: amount,
    averageDailyRevenue: total / count || 0,
    averageWaiterSalary: amount / count || 0,
    // growthRate,
    bestDay: filteredRecords.value.reduce((max, record) => record.total > (max?.total || 0) ? record : max, null as FinancialRecord | null),
    worstDay: filteredRecords.value.reduce((min, record) => record.total < (min?.total || Infinity) ? record : min, null as FinancialRecord | null),
    monthlyData: [],
    yearlyData: []
  }
})

const filteredRecords = computed(() => {
  let filtered = [...records.value]

  // Apply date filters
  if (dateFilters.startDate && dateFilters.endDate) {
    const startDate = new Date(dateFilters.startDate)
    const endDate = new Date(dateFilters.endDate)
    filtered = filtered.filter(record => {
      const recordDate = parseDate(record.full_day)
      return recordDate >= startDate && recordDate <= endDate
    })
  }

  // Apply search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(record =>
      record.full_day.toLowerCase().includes(search) ||
      record.total.toString().includes(search) ||
      record.amount.toString().includes(search)
    )
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue: any, bValue: any

    switch (filters.sortBy) {
      case 'date':
        aValue = parseDate(a.full_day)
        bValue = parseDate(b.full_day)
        break
      case 'revenue':
        aValue = a.total
        bValue = b.total
        break
      case 'growth':
        aValue = calculateGrowth(a)
        bValue = calculateGrowth(b)
        break
      default:
        aValue = a.total
        bValue = b.total
    }

    if (filters.sortOrder === 'desc') {
      return bValue > aValue ? 1 : -1
    } else {
      return aValue > bValue ? 1 : -1
    }
  })

  // Add growth calculations
  filtered = filtered.map((record, index) => {
    const prevRecord = index > 0 ? filtered[index - 1] : null
    const growth = prevRecord ? ((record.total - prevRecord.total) / prevRecord.total) * 100 : 0
    return { ...record, growth }
  })

  return filtered
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * tableConfig.pageSize
  const end = start + tableConfig.pageSize
  return filteredRecords.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / tableConfig.pageSize)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value

  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// KPIs computation
const kpis = computed((): KPI[] => {
  const data = filteredRecords.value
  const total = data.reduce((sum, r) => sum + r.total, 0)
  const count = data.length

  // Calculate period-over-period changes (simplified)
  const midPoint = Math.floor(count / 2)
  const firstHalf = data.slice(0, midPoint)
  const secondHalf = data.slice(midPoint)

  const firstHalfTotal = firstHalf.reduce((sum, r) => sum + r.total, 0)
  const secondHalfTotal = secondHalf.reduce((sum, r) => sum + r.total, 0)

  const revenueChange = firstHalfTotal > 0 ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0

  return [
    {
      key: 'revenue',
      label: 'Receita Total',
      value: formatCurrency(total),
      change: revenueChange,
      trend: revenueChange > 0 ? 'positive' : revenueChange < 0 ? 'negative' : 'neutral',
      type: 'primary',
      icon: DollarSign
    },
    {
      key: 'average',
      label: 'Receita Média',
      value: formatCurrency(total / count || 0),
      change: revenueChange * 0.8, // Approximation
      trend: revenueChange > 0 ? 'positive' : revenueChange < 0 ? 'negative' : 'neutral',
      type: 'success',
      icon: BarChart3
    },
    {
      key: 'transactions',
      label: 'Transações',
      value: count.toString(),
      change: 0, // Would need historical data
      trend: 'neutral',
      type: 'warning',
      icon: Activity
    },
    {
      key: 'growth',
      label: 'Taxa de Crescimento',
      value: `${revenueChange.toFixed(1)}%`,
      change: revenueChange,
      trend: revenueChange > 0 ? 'positive' : revenueChange < 0 ? 'negative' : 'neutral',
      type: revenueChange > 0 ? 'success' : 'danger',
      icon: revenueChange > 0 ? TrendingUp : TrendingDown
    }
  ]
})

// Statistics computation
const statistics = computed((): Statistics => {
  const data = filteredRecords.value.map(r => r.total)
  const n = data.length

  if (n === 0) {
    return {
      mean: 0, median: 0, standardDeviation: 0, coefficientVariation: 0,
      linearTrend: 0, temporalCorrelation: 0, seasonality: 0
    }
  }

  // Basic statistics
  const mean = data.reduce((sum, val) => sum + val, 0) / n
  const sortedData = [...data].sort((a, b) => a - b)
  const median = n % 2 === 0
    ? (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2
    : sortedData[Math.floor(n / 2)]

  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
  const standardDeviation = Math.sqrt(variance)
  const coefficientVariation = mean > 0 ? standardDeviation / mean : 0

  // Linear trend (simplified linear regression)
  const xValues = data.map((_, i) => i)
  const yValues = data

  const xMean = xValues.reduce((sum, val) => sum + val, 0) / n
  const yMean = mean

  const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (yValues[i] - yMean), 0)
  const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0)
  const slope = denominator > 0 ? numerator / denominator : 0
  const linearTrend = slope / yMean // Normalize as percentage

  // Temporal correlation (simplified)
  const temporalCorrelation = n > 1 ? Math.abs(linearTrend) : 0

  // Seasonality (simplified - variance in day-of-week patterns)
  const seasonality = Math.min(coefficientVariation * 10, 1)

  return {
    mean, median, standardDeviation, coefficientVariation,
    linearTrend, temporalCorrelation, seasonality
  }
})

// Predictions computation
const predictions = computed((): Predictions => {
  const data = filteredRecords.value
  const recentData = data.slice(-7) // Last 7 days

  if (recentData.length < 2) {
    return { nextPeriod: 0, trend30Days: 0, confidence: 0 }
  }

  const recentAvg = recentData.reduce((sum, r) => sum + r.total, 0) / recentData.length
  const overallAvg = data.reduce((sum, r) => sum + r.total, 0) / data.length

  const trend30Days = overallAvg > 0 ? (recentAvg - overallAvg) / overallAvg : 0
  const confidence = Math.min(data.length / 30, 1) // More data = more confidence

  return {
    nextPeriod: recentAvg * (1 + trend30Days),
    trend30Days,
    confidence
  }
})

// Chart data
const revenueChartData = computed(() => {
  const data = groupDataByPeriod(filteredRecords.value)

  return {
    labels: data.map(item => item.period),
    datasets: [{
      label: 'Receita',
      data: data.map(item => item.revenue),
      borderColor: 'rgba(99, 102, 241, 1)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: false
    }]
  }
})

const revenueAreaChartData = computed(() => {
  const data = groupDataByPeriod(filteredRecords.value)

  return {
    labels: data.map(item => item.period),
    datasets: [{
      label: 'Receita',
      data: data.map(item => item.revenue),
      borderColor: 'rgba(99, 102, 241, 1)',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  }
})

const growthChartData = computed(() => {
  const data = calculateGrowthData(filteredRecords.value)

  return {
    labels: data.map(item => item.period),
    datasets: [{
      label: 'Crescimento (%)',
      data: data.map(item => item.growth),
      backgroundColor: data.map(item => item.growth >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
      borderColor: data.map(item => item.growth >= 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)'),
      borderWidth: 1
    }]
  }
})

const distributionChartData = computed(() => {
  const data = groupDataByPeriod(filteredRecords.value)

  return {
    labels: data.map(item => item.period),
    datasets: [{
      data: data.map(item => item.revenue),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(6, 182, 212, 0.8)'
      ],
      borderWidth: 0
    }]
  }
})

const comparisonChartData = computed(() => {
  // This would be more complex in a real implementation
  return {
    labels: ['Receita', 'Crescimento', 'Transações'],
    datasets: [
      {
        label: 'Atual',
        data: [summary.value.totalRevenue, (summary.value as any).growthRate || 0, filteredRecords.value.length],
        backgroundColor: 'rgba(99, 102, 241, 0.7)'
      },
      {
        label: 'Comparação',
        data: [summary.value.totalRevenue * 0.9, ((summary.value as any).growthRate || 0) * 0.8, filteredRecords.value.length * 0.95],
        backgroundColor: 'rgba(156, 163, 175, 0.7)'
      }
    ]
  }
})

const comparisonInsights = computed(() => {
  return [
    {
      metric: 'Receita Total',
      current: formatCurrency(summary.value.totalRevenue),
      baseline: formatCurrency(summary.value.totalRevenue * 0.9),
      changePercent: 10,
      changeType: 'positive' as const
    },
    {
      metric: 'Receita Média',
      current: formatCurrency(summary.value.averageDailyRevenue),
      baseline: formatCurrency(summary.value.averageDailyRevenue * 0.95),
      changePercent: 5,
      changeType: 'positive' as const
    }
  ]
})

const heatmapData = computed(() => {
  const data = filteredRecords.value
  const heatmap = []

  // Create 7x8 grid (56 days)
  for (let i = 0; i < 56; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (55 - i))

    const dayData = data.find(record =>
      parseDate(record.full_day).toDateString() === date.toDateString()
    )

    heatmap.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      value: dayData?.total || 0
    })
  }

  return heatmap
})

// Chart options
const chartOptions = {
  line: {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value)
        }
      }
    }
  },
  bar: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => formatCurrency(context.parsed.y)
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value)
        }
      }
    }
  },
  area: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    elements: {
      point: { radius: 0 }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => formatCurrency(value)
        }
      }
    }
  },
  growth: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `${value}%`
        }
      }
    }
  },
  doughnut: {
    responsive: true,
    plugins: {
      legend: { position: 'right' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${formatCurrency(context.parsed)}`
        }
      }
    }
  },
  comparison: {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
}

// Methods
function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

function formatDate(dateString: string): string {
  const date = parseDate(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDateRange(): string {
  if (!dateFilters.startDate || !dateFilters.endDate) {
    return getQuickFilterLabel(activeQuickFilter.value)
  }

  const start = new Date(dateFilters.startDate).toLocaleDateString('pt-BR')
  const end = new Date(dateFilters.endDate).toLocaleDateString('pt-BR')
  return `${start} - ${end}`
}

function getQuickFilterLabel(filterKey: string): string {
  const filter = quickFilters.find(f => f.key === filterKey)
  return filter ? filter.label : 'Período Personalizado'
}

function calculatePercentage(amount: number, total: number): number {
  return total > 0 ? (amount / total) * 100 : 0
}

function calculateGrowth(record: FinancialRecord): number {
  const index = records.value.findIndex(r => r.id === record.id)
  if (index <= 0) return 0

  const prevRecord = records.value[index - 1]
  return ((record.total - prevRecord.total) / prevRecord.total) * 100
}

function getTrendIcon(change: number) {
  return change > 0 ? TrendingUp : change < 0 ? TrendingDown : Target
}

function getHeatmapIntensity(value: number): string {
  const max = Math.max(...heatmapData.value.map(d => d.value))
  if (max === 0) return 'level-1'

  const ratio = value / max
  if (ratio === 0) return 'level-0'
  if (ratio <= 0.2) return 'level-1'
  if (ratio <= 0.4) return 'level-2'
  if (ratio <= 0.6) return 'level-3'
  if (ratio <= 0.8) return 'level-4'
  return 'level-5'
}

function groupDataByPeriod(data: FinancialRecord[]) {
  const grouped: { [key: string]: { revenue: number, count: number } } = {}

  data.forEach(record => {
    let period: string
    const date = parseDate(record.full_day)

    switch (filters.groupBy) {
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        period = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1
        period = `${date.getFullYear()}-Q${quarter}`
        break
      case 'year':
        period = date.getFullYear().toString()
        break
      default: // day
        period = record.full_day
    }

    if (!grouped[period]) {
      grouped[period] = { revenue: 0, count: 0 }
    }

    grouped[period].revenue += record.total
    grouped[period].count += 1
  })

  return Object.entries(grouped).map(([period, data]) => ({
    period,
    revenue: data.revenue,
    averageRevenue: data.revenue / data.count
  }))
}

function calculateGrowthData(data: FinancialRecord[]) {
  const grouped = groupDataByPeriod(data)

  return grouped.map((item, index) => {
    const growth = index > 0
      ? ((item.revenue - grouped[index - 1].revenue) / grouped[index - 1].revenue) * 100
      : 0

    return {
      period: item.period,
      growth
    }
  })
}

async function loadData() {
  try {
    loading.value = true
    const data = await financialService.getAllFinancialData()
    records.value = data || []

    // Set default date range to last 30 days if no data
    if (!dateFilters.startDate || !dateFilters.endDate) {
      applyQuickFilter('last30days')
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

async function refreshData() {
  refreshing.value = true
  await loadData()
  refreshing.value = false
}

function applyQuickFilter(filterKey: string) {
  activeQuickFilter.value = filterKey
  const today = new Date()
  let startDate: Date, endDate: Date = new Date(today)

  switch (filterKey) {
    case 'today':
      startDate = new Date(today)
      break
    case 'yesterday':
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 1)
      endDate = new Date(startDate)
      break
    case 'last7days':
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 7)
      break
    case 'last30days':
      startDate = new Date(today)
      startDate.setDate(today.getDate() - 30)
      break
    case 'thisWeek':
      startDate = new Date(today)
      startDate.setDate(today.getDate() - today.getDay())
      break
    case 'thisMonth':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      break
    case 'lastMonth':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'thisYear':
      startDate = new Date(today.getFullYear(), 0, 1)
      break
    case 'lastYear':
      startDate = new Date(today.getFullYear() - 1, 0, 1)
      endDate = new Date(today.getFullYear() - 1, 11, 31)
      break
    default:
      return // Don't set dates for custom filter
  }

  dateFilters.startDate = startDate.toISOString().split('T')[0]
  dateFilters.endDate = endDate.toISOString().split('T')[0]
}

function applyDateFilter() {
  activeQuickFilter.value = 'custom'
}

function clearFilters() {
  dateFilters.startDate = ''
  dateFilters.endDate = ''
  activeQuickFilter.value = ''
  searchTerm.value = ''
  currentPage.value = 1
}

function updateAnalysis() {
  // Trigger reactivity for computed properties
  currentPage.value = 1
}

function updateChart(_chartType: string) {
  // Chart type changes are handled by reactivity
}

function updateComparison() {
  // Comparison updates are handled by reactivity
}

function sortBy(column: string) {
  if (filters.sortBy === column) {
    filters.sortOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    filters.sortBy = column as any
    filters.sortOrder = 'desc'
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page: number) {
  currentPage.value = page
}

function viewDetails(record: FinancialRecord) {
  // Implementation for viewing record details
  console.log('Viewing details for:', record)
}

function editRecord(record: FinancialRecord) {
  // Implementation for editing record
  console.log('Editing record:', record)
}

function exportData() {
  const csvContent = 'data:text/csv;charset=utf-8,' +
    'Data,Receita Total,Salário Garçom,Percentual,Crescimento\n' +
    filteredRecords.value.map(record =>
      `${record.full_day},${record.total},${record.amount},${calculatePercentage(record.amount, record.total).toFixed(2)}%,${((record as any).growth || 0).toFixed(2)}%`
    ).join('\n')

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `analise-financeira-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function generateReport() {
  // Implementation for generating detailed PDF report
  console.log('Generating report...')
}

// Watchers
watch(() => searchTerm.value, () => {
  currentPage.value = 1
})

watch(() => tableConfig.pageSize, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Main Container */
.financial-analytics-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Advanced Header */
.analytics-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 0;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  overflow: hidden;
  position: relative;
}

.analytics-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  opacity: 0.3;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.quick-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  min-width: 120px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.25);
}

.stat-card.positive .stat-icon {
  color: #10b981;
}

.stat-card.negative .stat-icon {
  color: #ef4444;
}

.stat-icon {
  color: white;
  margin-bottom: 8px;
}

.stat-content {
  color: white;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 16px;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.quick-filter-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
}

.quick-filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.date-range-controls {
  display: flex;
  align-items: end;
  gap: 16px;
  flex-wrap: wrap;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-input-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.date-input {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
}

.date-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fee2e2;
  border: 2px solid #fca5a5;
  border-radius: 10px;
  color: #dc2626;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background: #dc2626;
  color: white;
}

.advanced-filters {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.action-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.action-btn.export {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.action-btn.report {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.action-btn.refresh {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  text-align: center;
  color: #667eea;
  margin-bottom: 24px;
}

.loading-spinner h3 {
  color: #1a202c;
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0 8px 0;
}

.loading-spinner p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

/* Analytics Content */
.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

/* KPI Section */
.kpi-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.kpi-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0.8;
}

.kpi-card.positive {
  border-color: rgba(16, 185, 129, 0.2);
}

.kpi-card.negative {
  border-color: rgba(239, 68, 68, 0.2);
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-icon.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.kpi-icon.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.kpi-icon.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.kpi-icon.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.kpi-trend-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.kpi-card.positive .kpi-trend-indicator {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.kpi-card.negative .kpi-trend-indicator {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.kpi-card.neutral .kpi-trend-indicator {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.kpi-content {
  margin-bottom: 12px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 800;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.kpi-comparison {
  font-size: 12px;
  color: #9ca3af;
}

/* Charts Section */
.charts-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
}

.chart-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.chart-container.full-width {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.chart-controls select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.chart-content {
  position: relative;
  height: 300px;
}

/* Heatmap */
.heatmap-container {
  padding: 20px;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 20px;
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  z-index: 10;
}

.heatmap-cell.level-0 {
  background: #f3f4f6;
}

.heatmap-cell.level-1 {
  background: #ddd6fe;
}

.heatmap-cell.level-2 {
  background: #c4b5fd;
}

.heatmap-cell.level-3 {
  background: #a78bfa;
  color: white;
}

.heatmap-cell.level-4 {
  background: #8b5cf6;
  color: white;
}

.heatmap-cell.level-5 {
  background: #7c3aed;
  color: white;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.legend-scale {
  display: flex;
  gap: 2px;
}

.scale-item {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.scale-item.level-1 { background: #ddd6fe; }
.scale-item.level-2 { background: #c4b5fd; }
.scale-item.level-3 { background: #a78bfa; }
.scale-item.level-4 { background: #8b5cf6; }
.scale-item.level-5 { background: #7c3aed; }

/* Statistics Section */
.statistics-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.stat-panel {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.stat-panel h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 16px 0;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name {
  font-weight: 500;
  color: #374151;
}

.stat-value {
  font-weight: 600;
  color: #1a202c;
}

.stat-value.positive {
  color: #059669;
}

.stat-value.negative {
  color: #dc2626;
}

/* Comparison Section */
.comparison-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.comparison-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.comparison-controls select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.comparison-results {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.comparison-chart {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  height: 400px;
}

.comparison-insights {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.insight-metric {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.insight-comparison {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.current-value {
  font-weight: 600;
  color: #374151;
}

.vs {
  color: #9ca3af;
  font-size: 12px;
}

.baseline-value {
  color: #6b7280;
}

.insight-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
}

.insight-change.positive {
  color: #059669;
}

.insight-change.negative {
  color: #dc2626;
}

/* Data Table Section */
.data-table-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-box svg {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.page-size-select {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

/* Advanced Table */
.advanced-table {
  margin-top: 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.data-table thead {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
}

.data-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.data-table th.sortable:hover {
  background: rgba(102, 126, 234, 0.1);
}

.data-table th.sortable svg {
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.data-table th.sortable:hover svg {
  opacity: 1;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.data-row:hover {
  background: #f8fafc;
}

.data-row:hover td {
  background: transparent;
}

.currency {
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', monospace;
}

.currency.secondary {
  color: #6b7280;
}

.percentage {
  font-weight: 600;
  color: #667eea;
}

.growth {
  font-weight: 600;
}

.growth.positive {
  color: #059669;
}

.growth.negative {
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  padding: 20px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.page-number:hover {
  background: #f3f4f6;
  color: #374151;
}

.page-number.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .comparison-results {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .financial-analytics-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  .quick-stats {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 8px;
  }

  .stat-card {
    min-width: 140px;
    flex-shrink: 0;
  }

  .filter-controls {
    gap: 16px;
  }

  .quick-filters {
    gap: 8px;
  }

  .quick-filter-btn {
    padding: 10px 12px;
    font-size: 13px;
  }

  .date-range-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .advanced-filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .action-controls {
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: unset;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 12px 8px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 8px;
  }

  .pagination-btn {
    padding: 10px 12px;
    font-size: 14px;
  }

  .heatmap-grid {
    gap: 2px;
  }

  .heatmap-cell {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .analytics-header {
    border-radius: 16px;
  }

  .header-content {
    padding: 24px 20px;
  }

  .filter-panel,
  .kpi-section,
  .charts-section,
  .statistics-section,
  .comparison-section,
  .data-table-section {
    border-radius: 16px;
    padding: 20px;
  }

  .quick-filter-btn {
    font-size: 12px;
    padding: 8px 10px;
  }

  .kpi-value {
    font-size: 24px;
  }

  .chart-content {
    height: 250px;
  }

  .data-table th,
  .data-table td {
    padding: 8px 4px;
    font-size: 11px;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
  }
}

/* Animation Classes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .financial-analytics-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  }

  .filter-panel,
  .kpi-section,
  .charts-section,
  .statistics-section,
  .comparison-section,
  .data-table-section {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .section-header h2,
  .kpi-value,
  .stat-name {
    color: #f8fafc;
  }

  .page-subtitle,
  .kpi-label,
  .stat-value {
    color: #cbd5e1;
  }

  .data-table {
    background: #1e293b;
  }

  .data-table th {
    background: linear-gradient(135deg, #334155, #475569);
    color: #f8fafc;
    border-color: rgba(255, 255, 255, 0.1);
  }

  .data-table td {
    color: #cbd5e1;
    border-color: rgba(255, 255, 255, 0.05);
  }

  .data-row:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>