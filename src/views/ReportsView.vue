<template>
  <div class="reports-container">
    <header class="page-header">
      <div class="header-content">
        <h1>
          <BarChart3 :size="28" />
          Relatórios - Análises e Gráficos
        </h1>
        <div class="header-actions">
          <div class="export-dropdown" ref="exportDropdown">
            <button @click="toggleExportMenu" class="btn-secondary">
              <Download :size="18" />
              Exportar
              <svg :class="{ 'rotate-180': showExportMenu }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <div v-if="showExportMenu" class="export-menu">
              <button @click="exportToPDF" class="export-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                PDF com Gráficos
              </button>
              <button @click="exportToExcel" class="export-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M9 9h6v6H9z"/>
                </svg>
                Excel (.xlsx)
              </button>
              <button @click="exportToCSV" class="export-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                CSV (.csv)
              </button>
              <button @click="exportToJSON" class="export-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                JSON (.json)
              </button>
              <button @click="exportToImage" class="export-option">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                Imagem (.png)
              </button>
            </div>
          </div>
          <button @click="refreshData" class="btn-primary" :disabled="loading">
            <RefreshCw :size="18" :class="{ 'animate-spin': loading }" />
            Atualizar
          </button>
        </div>
      </div>
    </header>

    <!-- Filtros de período -->
    <div class="filters-section">
      <div class="period-selector">
        <label>Período de análise:</label>
        <div class="period-buttons">
          <button
            v-for="period in periods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="{ active: selectedPeriod === period.value }"
            class="period-btn"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <TrendingUp :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">R$ {{ formatCurrency(analytics.sales.totalSales || 0) }}</div>
          <div class="stat-label">Total de Vendas</div>
          <div class="stat-change positive">
            <TrendingUp :size="12" />
            +12.5% vs período anterior
          </div>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">
          <Package :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ analytics.stock.totalProducts || 0 }}</div>
          <div class="stat-label">Total de Produtos</div>
          <div class="stat-change neutral">
            <Minus :size="12" />
            {{ analytics.stock.lowStockCount || 0 }} com estoque baixo
          </div>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <AlertTriangle :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ analytics.stock.outOfStockCount || 0 }}</div>
          <div class="stat-label">Produtos em Falta</div>
          <div class="stat-change negative">
            <AlertTriangle :size="12" />
            Requer atenção imediata
          </div>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <DollarSign :size="24" />
        </div>
        <div class="stat-content">
          <div class="stat-value">R$ {{ formatCurrency(analytics.stock.totalValue || 0) }}</div>
          <div class="stat-label">Valor do Estoque</div>
          <div class="stat-change positive">
            <TrendingUp :size="12" />
            Inventário total
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-grid">
      <!-- Gráfico de Vendas -->
      <section class="chart-panel">
        <div class="panel-header">
          <h2>
            <TrendingUp :size="20" />
            Evolução das Vendas
          </h2>
          <div class="chart-controls">
            <button @click="chartType = 'line'" :class="{ active: chartType === 'line' }" class="chart-btn">
              Linha
            </button>
            <button @click="chartType = 'bar'" :class="{ active: chartType === 'bar' }" class="chart-btn">
              Barra
            </button>
          </div>
        </div>
        <div class="chart-container">
          <Line
            v-if="salesChartData.datasets.length > 0 && chartType === 'line'"
            :data="salesChartData"
            :options="chartOptions.line"
          />
          <Bar
            v-else-if="salesChartData.datasets.length > 0 && chartType === 'bar'"
            :data="salesChartData"
            :options="chartOptions.bar"
          />
          <div v-else class="chart-loading">
            <Loader2 :size="32" class="animate-spin" />
            <p>Carregando dados de vendas...</p>
          </div>
        </div>
      </section>

      <!-- Gráfico de Categorias -->
      <section class="chart-panel">
        <div class="panel-header">
          <h2>
            <PieChart :size="20" />
            Distribuição por Categoria
          </h2>
        </div>
        <div class="chart-container">
          <Doughnut
            v-if="categoryChartData.datasets.length > 0"
            :data="categoryChartData"
            :options="chartOptions.doughnut"
          />
          <div v-else class="chart-loading">
            <Loader2 :size="32" class="animate-spin" />
            <p>Carregando dados de categorias...</p>
          </div>
        </div>
      </section>

      <!-- Gráfico de Movimentações -->
      <section class="chart-panel full-width">
        <div class="panel-header">
          <h2>
            <BarChart3 :size="20" />
            Movimentações de Estoque
          </h2>
        </div>
        <div class="chart-container">
          <Bar
            v-if="movementsChartData.datasets.length > 0"
            :data="movementsChartData"
            :options="chartOptions.movements"
          />
          <div v-else class="chart-loading">
            <Loader2 :size="32" class="animate-spin" />
            <p>Carregando dados de movimentações...</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Tabelas de Dados -->
    <div class="tables-grid">
      <!-- Produtos com Estoque Baixo -->
      <section class="data-panel">
        <div class="panel-header">
          <h2>
            <AlertTriangle :size="20" />
            Produtos com Estoque Baixo
          </h2>
          <span class="count-badge warning">{{ analytics.stock.lowStockProducts?.length || 0 }}</span>
        </div>
        <div class="table-container">
          <table v-if="analytics.stock.lowStockProducts?.length > 0" class="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Estoque Atual</th>
                <th>Estoque Mínimo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in analytics.stock.lowStockProducts" :key="product.id">
                <td class="product-name">{{ product.nome }}</td>
                <td class="stock-current">{{ product.current_stock }} {{ product.unidade }}</td>
                <td class="stock-min">{{ product.min_stock }} {{ product.unidade }}</td>
                <td>
                  <span class="status-badge warning">
                    <AlertTriangle :size="14" />
                    Baixo
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-table">
            <CheckCircle :size="32" />
            <p>Todos os produtos estão com estoque adequado!</p>
          </div>
        </div>
      </section>

      <!-- Movimentações Recentes -->
      <section class="data-panel">
        <div class="panel-header">
          <h2>
            <Activity :size="20" />
            Movimentações Recentes
          </h2>
          <router-link to="/inventory" class="view-all-link">
            Ver todas
            <ExternalLink :size="14" />
          </router-link>
        </div>
        <div class="table-container">
          <table v-if="analytics.movements.recentMovements?.length > 0" class="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="movement in analytics.movements.recentMovements" :key="movement.id">
                <td class="product-name">{{ movement.produtos?.nome }}</td>
                <td>
                  <span :class="`status-badge ${movement.type === 'in' ? 'success' : 'danger'}`">
                    <ArrowUp v-if="movement.type === 'in'" :size="14" />
                    <ArrowDown v-else :size="14" />
                    {{ movement.type === 'in' ? 'Entrada' : 'Saída' }}
                  </span>
                </td>
                <td class="quantity">{{ movement.quantity }}</td>
                <td class="date">{{ formatDate(movement.created_at) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-table">
            <Activity :size="32" />
            <p>Nenhuma movimentação recente encontrada.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { reportsService } from '@/services/reportsService'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'

// Icons
import {
  BarChart3, Download, RefreshCw, TrendingUp, Package, AlertTriangle,
  DollarSign, Minus, PieChart, Loader2, CheckCircle, Activity,
  ExternalLink, ArrowUp, ArrowDown
} from 'lucide-vue-next'

// Chart.js configuration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

// State
const loading = ref(false)
const selectedPeriod = ref<'7d' | '30d' | '90d'>('30d')
const chartType = ref<'line' | 'bar'>('line')
const showExportMenu = ref(false)
const exportDropdown = ref<HTMLElement | null>(null)

const periods = [
  { label: '7 dias', value: '7d' as const },
  { label: '30 dias', value: '30d' as const },
  { label: '90 dias', value: '90d' as const }
]

interface AnalyticsData {
  sales: {
    totalSales?: number;
  };
  stock: {
    totalProducts?: number;
    lowStockCount?: number;
    outOfStockCount?: number;
    totalValue?: number;
    lowStockProducts: any[];
  };
  movements: {
    recentMovements: any[];
  };
  suppliers: any;
}

const analytics = ref<AnalyticsData>({
  sales: {},
  stock: {
    lowStockProducts: [],
  },
  movements: {
    recentMovements: [],
  },
  suppliers: {}
})

const salesChartData = ref<any>({ labels: [], datasets: [] })
const categoryChartData = ref<any>({ labels: [], datasets: [] })
const movementsChartData = ref<any>({ labels: [], datasets: [] })

// Chart options
const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { color: 'rgba(0,0,0,0.1)' } }
    },
    elements: {
      line: { tension: 0.4 },
      point: { radius: 4, hoverRadius: 6 }
    }
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { color: 'rgba(0,0,0,0.1)' } }
    }
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { padding: 20, usePointStyle: true }
      }
    }
  },
  movements: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      x: { display: true, grid: { display: false } },
      y: { display: true, grid: { color: 'rgba(0,0,0,0.1)' } }
    }
  }
}

// Methods
async function loadAnalytics() {
  loading.value = true
  try {
    const [salesData, stockData, movementsData, suppliersData] = await Promise.all([
      reportsService.getSalesAnalytics(selectedPeriod.value),
      reportsService.getStockAnalytics(),
      reportsService.getMovementsAnalytics(selectedPeriod.value),
      reportsService.getSuppliersAnalytics()
    ])

    analytics.value = {
      sales: salesData,
      stock: stockData,
      movements: movementsData,
      suppliers: suppliersData
    }

    // Load chart data
    await loadChartData()
  } catch (error) {
    console.error('Erro ao carregar analytics:', error)
  } finally {
    loading.value = false
  }
}

async function loadChartData() {
  try {
    const [salesChart, stockChart, movementsChart] = await Promise.all([
      reportsService.getChartData('sales', selectedPeriod.value),
      reportsService.getChartData('stock'),
      reportsService.getChartData('movements', selectedPeriod.value)
    ])

    salesChartData.value = salesChart
    categoryChartData.value = stockChart
    movementsChartData.value = movementsChart
  } catch (error) {
    console.error('Erro ao carregar dados dos gráficos:', error)
  }
}

async function refreshData() {
  await loadAnalytics()
}

function toggleExportMenu() {
  showExportMenu.value = !showExportMenu.value
}

async function exportToPDF() {
  try {
    loading.value = true
    showExportMenu.value = false

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let currentY = 20

    // Header do relatório
    pdf.setFontSize(20)
    pdf.setTextColor(102, 126, 234)
    pdf.text('Relatório de Análises - GestãoZe', 20, currentY)

    currentY += 10
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Período: ${periods.find(p => p.value === selectedPeriod.value)?.label}`, 20, currentY)
    pdf.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 20, currentY + 5)

    currentY += 20

    // Estatísticas resumo
    pdf.setFontSize(16)
    pdf.setTextColor(26, 32, 44)
    pdf.text('Resumo Executivo', 20, currentY)
    currentY += 10

    pdf.setFontSize(10)
    pdf.setTextColor(77, 85, 104)
    const stats = [
      `Total de Vendas: R$ ${formatCurrency(analytics.value.sales.totalSales || 0)}`,
      `Total de Produtos: ${analytics.value.stock.totalProducts || 0}`,
      `Produtos em Falta: ${analytics.value.stock.outOfStockCount || 0}`,
      `Valor do Estoque: R$ ${formatCurrency(analytics.value.stock.totalValue || 0)}`
    ]

    stats.forEach((stat, index) => {
      pdf.text(stat, 20, currentY + (index * 5))
    })

    currentY += 30

    // Capturar gráficos
    const chartsContainer = document.querySelector('.charts-grid') as HTMLElement
    if (chartsContainer) {
      const canvas = await html2canvas(chartsContainer, {
        background: '#ffffff',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = pageWidth - 40
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (currentY + imgHeight > pageHeight - 20) {
        pdf.addPage()
        currentY = 20
      }

      pdf.text('Gráficos de Análise', 20, currentY)
      currentY += 10
      pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight)
    }

    // Nova página para tabelas
    pdf.addPage()
    currentY = 20

    pdf.setFontSize(16)
    pdf.setTextColor(26, 32, 44)
    pdf.text('Dados Detalhados', 20, currentY)
    currentY += 15

    // Tabela de produtos com estoque baixo
    if (analytics.value.stock.lowStockProducts?.length > 0) {
      pdf.setFontSize(12)
      pdf.text('Produtos com Estoque Baixo', 20, currentY)
      currentY += 10

      // Cabeçalhos da tabela
      pdf.setFontSize(9)
      pdf.setTextColor(77, 85, 104)
      pdf.text('Produto', 20, currentY)
      pdf.text('Estoque Atual', 80, currentY)
      pdf.text('Estoque Mínimo', 130, currentY)
      pdf.text('Status', 170, currentY)
      currentY += 5

      // Linha separadora
      pdf.line(20, currentY, pageWidth - 20, currentY)
      currentY += 5

      // Dados da tabela
      analytics.value.stock.lowStockProducts.slice(0, 15).forEach((product: any) => {
        pdf.setTextColor(26, 32, 44)
        pdf.text(product.nome.substring(0, 25), 20, currentY)
        pdf.text(`${product.current_stock} ${product.unidade}`, 80, currentY)
        pdf.text(`${product.min_stock} ${product.unidade}`, 130, currentY)
        pdf.setTextColor(220, 38, 38)
        pdf.text('Baixo', 170, currentY)
        currentY += 5

        if (currentY > pageHeight - 20) {
          pdf.addPage()
          currentY = 20
        }
      })
    }

    // Salvar PDF
    pdf.save(`relatorio-gestao-${selectedPeriod.value}-${format(new Date(), 'yyyy-MM-dd')}.pdf`)

  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    alert('Erro ao exportar relatório em PDF')
  } finally {
    loading.value = false
  }
}

async function exportToExcel() {
  try {
    showExportMenu.value = false

    const workbook = XLSX.utils.book_new()

    // Planilha de Resumo
    const summaryData = [
      ['Relatório de Análises - GestãoZe'],
      [''],
      [`Período: ${periods.find(p => p.value === selectedPeriod.value)?.label}`],
      [`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`],
      [''],
      ['RESUMO EXECUTIVO'],
      ['Total de Vendas', `R$ ${formatCurrency(analytics.value.sales.totalSales || 0)}`],
      ['Total de Produtos', analytics.value.stock.totalProducts || 0],
      ['Produtos em Falta', analytics.value.stock.outOfStockCount || 0],
      ['Valor do Estoque', `R$ ${formatCurrency(analytics.value.stock.totalValue || 0)}`]
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')

    // Planilha de Produtos com Estoque Baixo
    if (analytics.value.stock.lowStockProducts?.length > 0) {
      const lowStockData = [
        ['Produto', 'Estoque Atual', 'Unidade', 'Estoque Mínimo', 'Status'],
        ...analytics.value.stock.lowStockProducts.map((product: any) => [
          product.nome,
          product.current_stock,
          product.unidade,
          product.min_stock,
          'Baixo'
        ])
      ]

      const lowStockSheet = XLSX.utils.aoa_to_sheet(lowStockData)
      XLSX.utils.book_append_sheet(workbook, lowStockSheet, 'Estoque Baixo')
    }

    // Planilha de Movimentações
    if (analytics.value.movements.recentMovements?.length > 0) {
      const movementsData = [
        ['Produto', 'Tipo', 'Quantidade', 'Data'],
        ...analytics.value.movements.recentMovements.map((movement: any) => [
          movement.produtos?.nome || 'N/A',
          movement.type === 'in' ? 'Entrada' : 'Saída',
          movement.quantity,
          format(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })
        ])
      ]

      const movementsSheet = XLSX.utils.aoa_to_sheet(movementsData)
      XLSX.utils.book_append_sheet(workbook, movementsSheet, 'Movimentações')
    }

    // Salvar arquivo
    XLSX.writeFile(workbook, `relatorio-gestao-${selectedPeriod.value}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)

  } catch (error) {
    console.error('Erro ao exportar Excel:', error)
    alert('Erro ao exportar relatório em Excel')
  }
}

function exportToCSV() {
  try {
    showExportMenu.value = false

    let csvContent = 'data:text/csv;charset=utf-8,'
    csvContent += 'Relatório de Análises - GestãoZe\n\n'
    csvContent += `Período: ${periods.find(p => p.value === selectedPeriod.value)?.label}\n`
    csvContent += `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}\n\n`

    // Resumo
    csvContent += 'RESUMO EXECUTIVO\n'
    csvContent += `Total de Vendas,R$ ${formatCurrency(analytics.value.sales.totalSales || 0)}\n`
    csvContent += `Total de Produtos,${analytics.value.stock.totalProducts || 0}\n`
    csvContent += `Produtos em Falta,${analytics.value.stock.outOfStockCount || 0}\n`
    csvContent += `Valor do Estoque,R$ ${formatCurrency(analytics.value.stock.totalValue || 0)}\n\n`

    // Produtos com estoque baixo
    if (analytics.value.stock.lowStockProducts?.length > 0) {
      csvContent += 'PRODUTOS COM ESTOQUE BAIXO\n'
      csvContent += 'Produto,Estoque Atual,Unidade,Estoque Mínimo,Status\n'

      analytics.value.stock.lowStockProducts.forEach((product: any) => {
        csvContent += `"${product.nome}",${product.current_stock},"${product.unidade}",${product.min_stock},Baixo\n`
      })
    }

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `relatorio-gestao-${selectedPeriod.value}-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (error) {
    console.error('Erro ao exportar CSV:', error)
    alert('Erro ao exportar relatório em CSV')
  }
}

function exportToJSON() {
  try {
    showExportMenu.value = false

    const reportData = {
      metadata: {
        title: 'Relatório de Análises - GestãoZe',
        period: periods.find(p => p.value === selectedPeriod.value)?.label,
        generatedAt: format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
        periodValue: selectedPeriod.value
      },
      analytics: analytics.value,
      charts: {
        salesData: salesChartData.value,
        categoryData: categoryChartData.value,
        movementsData: movementsChartData.value
      }
    }

    const jsonString = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-gestao-${selectedPeriod.value}-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Erro ao exportar JSON:', error)
    alert('Erro ao exportar relatório em JSON')
  }
}

async function exportToImage() {
  try {
    loading.value = true
    showExportMenu.value = false

    const container = document.querySelector('.reports-container') as HTMLElement
    if (!container) return

    const canvas = await html2canvas(container, {
      background: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true
    })

    const link = document.createElement('a')
    link.download = `relatorio-gestao-${selectedPeriod.value}-${format(new Date(), 'yyyy-MM-dd')}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (error) {
    console.error('Erro ao exportar imagem:', error)
    alert('Erro ao exportar relatório como imagem')
  } finally {
    loading.value = false
  }
}

// Fechar dropdown ao clicar fora
function handleClickOutside(event: Event) {
  if (exportDropdown.value && !exportDropdown.value.contains(event.target as Node)) {
    showExportMenu.value = false
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function formatDate(dateString: string): string {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

// Watchers
watch(selectedPeriod, () => {
  loadAnalytics()
})

// Lifecycle
onMounted(() => {
  loadAnalytics()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.reports-container {
  padding: 0;
  width: 100vw;
  background: var(--theme-background);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.page-header {
  margin: 0;
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--theme-surface);
  padding: 24px 32px;
  border-bottom: 1px solid var(--theme-border);
  box-shadow: 0 2px 10px var(--theme-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--theme-text-primary);
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Dropdown de Exportação */
.export-dropdown {
  position: relative;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.export-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  border-radius: 12px;
  box-shadow: 0 10px 40px var(--theme-shadow);
  min-width: 200px;
  z-index: 1000;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.export-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: var(--theme-text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border-radius: 0;
}

.export-option:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.export-option:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.export-option:hover {
  background: var(--theme-primary);
  color: white;
}

.export-option svg {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.export-option:hover svg {
  opacity: 1;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px var(--theme-shadow);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  border: 2px solid var(--theme-border);
}

.btn-secondary:hover {
  background: var(--theme-border);
  border-color: var(--theme-primary);
}

.filters-section {
  margin: 0;
  background: var(--theme-surface);
  padding: 24px 32px;
  border-bottom: 1px solid var(--theme-border);
}

.period-selector label {
  display: block;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 12px;
}

.period-buttons {
  display: flex;
  gap: 8px;
}

.period-btn {
  padding: 8px 16px;
  background: var(--theme-surface);
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: var(--theme-text-secondary);
}

.period-btn:hover {
  background: var(--theme-border);
  color: var(--theme-text-primary);
}

.period-btn.active {
  background: var(--theme-primary);
  color: white;
  border-color: var(--theme-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 32px;
  margin: 0;
}

.stat-card {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.primary .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-card.info .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.stat-card.warning .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-card.success .stat-icon { background: linear-gradient(135deg, #10b981, #059669); }

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--theme-text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--theme-text-secondary);
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
}

.stat-change.positive { color: #10b981; }
.stat-change.negative { color: #ef4444; }
.stat-change.neutral { color: #64748b; }

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 0 32px 32px;
  margin: 0;
}

.chart-panel {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.chart-panel.full-width {
  grid-column: span 2;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.panel-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-btn {
  padding: 6px 12px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

.chart-btn:hover {
  background: #e2e8f0;
}

.chart-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  gap: 16px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 0 32px 32px;
  margin: 0;
}

.data-panel {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.count-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.count-badge.warning {
  background: #fed7d7;
  color: #c53030;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.data-table th {
  background: var(--theme-border);
  font-weight: 600;
  color: var(--theme-text-primary);
  font-size: 14px;
}

.data-table td {
  color: var(--theme-text-secondary);
  font-size: 14px;
}

.product-name {
  font-weight: 600;
  color: var(--theme-text-primary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.warning {
  background: #fed7d7;
  color: #c53030;
}

.status-badge.success {
  background: #c6f6d5;
  color: #2f855a;
}

.status-badge.danger {
  background: #fed7d7;
  color: #c53030;
}

.empty-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--theme-text-muted);
  gap: 12px;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--theme-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: var(--theme-secondary);
}

/* Responsividade */
@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-panel.full-width {
    grid-column: span 1;
  }

  .tables-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
  }

  .header-actions {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .charts-grid {
    padding: 0 20px 20px;
  }

  .tables-grid {
    padding: 0 20px 20px;
  }

  .filters-section {
    padding: 20px;
  }

  .period-buttons {
    flex-direction: column;
  }

  .export-menu {
    right: auto;
    left: 0;
    min-width: 180px;
  }
}
</style>