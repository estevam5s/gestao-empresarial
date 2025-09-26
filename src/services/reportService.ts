/**
 * Serviço Avançado de Relatórios Técnicos
 * Sistema profissional para geração de relatórios detalhados
 */

import { logService, type SystemLog, type LogStatistics } from '@/services/logService'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Interfaces para relatórios
export interface ReportConfig {
  title: string
  subtitle?: string
  period: {
    start: string
    end: string
    days: number
  }
  includeCharts: boolean
  includeDetails: boolean
  includeRecommendations: boolean
  format: 'pdf' | 'excel' | 'html' | 'json'
  template: 'executive' | 'technical' | 'security' | 'performance' | 'audit'
  filters?: {
    severity?: string[]
    category?: string[]
    users?: string[]
    resources?: string[]
  }
}

export interface ReportData {
  metadata: {
    generatedAt: string
    generatedBy: string
    period: string
    totalLogs: number
    reportId: string
  }
  summary: {
    systemHealth: string
    criticalIssues: number
    errorRate: number
    averageResponseTime: number
    topIssues: Array<{ issue: string; count: number; severity: string }>
  }
  statistics: LogStatistics
  logs: SystemLog[]
  analytics: {
    performanceMetrics: any
    securityIncidents: any
    userActivity: any
    systemUtilization: any
  }
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low'
    category: string
    title: string
    description: string
    actionItems: string[]
  }>
}

class ReportService {
  private reportTemplates: Record<string, any> = {}

  constructor() {
    this.initializeTemplates()
  }

  /**
   * Inicializa templates de relatório
   */
  private initializeTemplates(): void {
    this.reportTemplates = {
      executive: {
        name: 'Relatório Executivo',
        description: 'Visão estratégica para tomada de decisões',
        sections: ['summary', 'key_metrics', 'trends', 'recommendations'],
        charts: true,
        detailLevel: 'summary'
      },
      technical: {
        name: 'Relatório Técnico Detalhado',
        description: 'Análise técnica completa para equipes de desenvolvimento',
        sections: ['summary', 'technical_details', 'performance', 'errors', 'logs', 'recommendations'],
        charts: true,
        detailLevel: 'detailed'
      },
      security: {
        name: 'Relatório de Segurança',
        description: 'Análise focada em segurança e conformidade',
        sections: ['security_summary', 'incidents', 'authentication', 'access_control', 'recommendations'],
        charts: true,
        detailLevel: 'security'
      },
      performance: {
        name: 'Relatório de Performance',
        description: 'Análise de performance e otimizações',
        sections: ['performance_summary', 'response_times', 'bottlenecks', 'optimization', 'recommendations'],
        charts: true,
        detailLevel: 'performance'
      },
      audit: {
        name: 'Relatório de Auditoria',
        description: 'Relatório completo para auditoria e compliance',
        sections: ['audit_summary', 'compliance', 'user_actions', 'data_integrity', 'full_logs'],
        charts: false,
        detailLevel: 'audit'
      }
    }
  }

  /**
   * Gera relatório completo
   */
  async generateReport(config: ReportConfig): Promise<ReportData> {
    const startTime = Date.now()

    try {
      // Log da geração do relatório
      await logService.createLog({
        action: 'generate_report_started',
        resource: 'reports',
        details: {
          template: config.template,
          format: config.format,
          period: config.period,
          filters: config.filters
        },
        category: 'system',
        severity: 'info'
      })

      // Coleta dados base
      const [statistics, logs] = await Promise.all([
        logService.getLogStatistics(config.period.days),
        this.getFilteredLogs(config)
      ])

      // Gera analytics avançados
      const analytics = await this.generateAnalytics(logs, statistics)

      // Gera recomendações
      const recommendations = this.generateRecommendations(statistics, logs, config.template)

      // Monta o relatório
      const reportData: ReportData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          generatedBy: 'Sistema GestaoZe',
          period: `${config.period.start} - ${config.period.end}`,
          totalLogs: statistics.totalLogs,
          reportId: this.generateReportId()
        },
        summary: {
          systemHealth: this.calculateSystemHealth(statistics),
          criticalIssues: statistics.criticalIssues,
          errorRate: statistics.errorRate,
          averageResponseTime: statistics.averageResponseTime,
          topIssues: this.identifyTopIssues(logs)
        },
        statistics,
        logs: config.includeDetails ? logs : [],
        analytics,
        recommendations: config.includeRecommendations ? recommendations : []
      }

      // Log de conclusão
      const executionTime = Date.now() - startTime
      await logService.createLog({
        action: 'generate_report_completed',
        resource: 'reports',
        details: {
          reportId: reportData.metadata.reportId,
          template: config.template,
          format: config.format,
          executionTime,
          totalLogs: reportData.metadata.totalLogs
        },
        category: 'system',
        severity: 'info',
        execution_time: executionTime
      })

      return reportData
    } catch (error: any) {
      const executionTime = Date.now() - startTime

      await logService.createLog({
        action: 'generate_report_failed',
        resource: 'reports',
        details: {
          template: config.template,
          format: config.format,
          error: error.message,
          executionTime
        },
        category: 'system',
        severity: 'error',
        status: 'failed',
        error_message: error.message,
        execution_time: executionTime
      })

      throw error
    }
  }

  /**
   * Exporta relatório em formato específico
   */
  async exportReport(reportData: ReportData, format: 'pdf' | 'excel' | 'html' | 'json'): Promise<Blob> {
    switch (format) {
      case 'pdf':
        return await this.exportToPDF(reportData)
      case 'excel':
        return await this.exportToExcel(reportData)
      case 'html':
        return await this.exportToHTML(reportData)
      case 'json':
        return await this.exportToJSON(reportData)
      default:
        throw new Error(`Formato não suportado: ${format}`)
    }
  }

  /**
   * Exporta para PDF
   */
  private async exportToPDF(reportData: ReportData): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4')
    let yPosition = 20

    // Cabeçalho
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RELATÓRIO TÉCNICO DO SISTEMA', 20, yPosition)
    yPosition += 15

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Período: ${reportData.metadata.period}`, 20, yPosition)
    yPosition += 10
    pdf.text(`Gerado em: ${new Date(reportData.metadata.generatedAt).toLocaleString('pt-BR')}`, 20, yPosition)
    yPosition += 20

    // Resumo Executivo
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('RESUMO EXECUTIVO', 20, yPosition)
    yPosition += 15

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')

    const summaryData = [
      ['Saúde do Sistema', reportData.summary.systemHealth],
      ['Total de Logs', reportData.metadata.totalLogs.toLocaleString()],
      ['Problemas Críticos', reportData.summary.criticalIssues.toString()],
      ['Taxa de Erro', `${reportData.summary.errorRate.toFixed(2)}%`],
      ['Tempo Médio de Resposta', `${reportData.summary.averageResponseTime.toFixed(2)}ms`]
    ]

    ;(pdf as any).autoTable({
      head: [['Métrica', 'Valor']],
      body: summaryData,
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: 20, right: 20 }
    })

    yPosition = (pdf as any).lastAutoTable.finalY + 20

    // Distribuição de Severidade
    if (yPosition > 250) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('DISTRIBUIÇÃO DE SEVERIDADE', 20, yPosition)
    yPosition += 15

    const severityData = Object.entries(reportData.statistics.severityDistribution).map(([severity, count]) => [
      severity.toUpperCase(),
      count.toString(),
      `${((count / reportData.metadata.totalLogs) * 100).toFixed(1)}%`
    ])

    ;(pdf as any).autoTable({
      head: [['Severidade', 'Quantidade', 'Percentual']],
      body: severityData,
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [231, 76, 60] },
      margin: { left: 20, right: 20 }
    })

    yPosition = (pdf as any).lastAutoTable.finalY + 20

    // Top Usuários
    if (yPosition > 200) {
      pdf.addPage()
      yPosition = 20
    }

    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('USUÁRIOS MAIS ATIVOS', 20, yPosition)
    yPosition += 15

    const usersData = reportData.statistics.topUsers.slice(0, 10).map((user, index) => [
      (index + 1).toString(),
      user.username,
      user.count.toString(),
      `${((user.count / reportData.metadata.totalLogs) * 100).toFixed(1)}%`
    ])

    ;(pdf as any).autoTable({
      head: [['#', 'Usuário', 'Ações', '%']],
      body: usersData,
      startY: yPosition,
      theme: 'grid',
      headStyles: { fillColor: [46, 204, 113] },
      margin: { left: 20, right: 20 }
    })

    yPosition = (pdf as any).lastAutoTable.finalY + 20

    // Recomendações
    if (reportData.recommendations.length > 0) {
      if (yPosition > 150) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('RECOMENDAÇÕES TÉCNICAS', 20, yPosition)
      yPosition += 15

      reportData.recommendations.forEach((rec, index) => {
        if (yPosition > 250) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text(`${index + 1}. ${rec.title}`, 20, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const splitDescription = pdf.splitTextToSize(rec.description, 170)
        pdf.text(splitDescription, 25, yPosition)
        yPosition += splitDescription.length * 5 + 10
      })
    }

    // Rodapé
    const pageCount = pdf.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Página ${i} de ${pageCount}`, 170, 290)
      pdf.text('Relatório gerado automaticamente pelo Sistema GestaoZe', 20, 290)
    }

    return new Blob([pdf.output('blob')], { type: 'application/pdf' })
  }

  /**
   * Exporta para Excel
   */
  private async exportToExcel(reportData: ReportData): Promise<Blob> {
    const workbook = XLSX.utils.book_new()

    // Aba: Resumo
    const summaryData = [
      ['RELATÓRIO TÉCNICO DO SISTEMA'],
      [''],
      ['Período', reportData.metadata.period],
      ['Gerado em', new Date(reportData.metadata.generatedAt).toLocaleString('pt-BR')],
      ['Total de Logs', reportData.metadata.totalLogs],
      [''],
      ['MÉTRICAS PRINCIPAIS'],
      ['Saúde do Sistema', reportData.summary.systemHealth],
      ['Problemas Críticos', reportData.summary.criticalIssues],
      ['Taxa de Erro (%)', reportData.summary.errorRate.toFixed(2)],
      ['Tempo Médio de Resposta (ms)', reportData.summary.averageResponseTime.toFixed(2)]
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo')

    // Aba: Distribuição de Severidade
    const severityData = [
      ['Severidade', 'Quantidade', 'Percentual'],
      ...Object.entries(reportData.statistics.severityDistribution).map(([severity, count]) => [
        severity.toUpperCase(),
        count,
        `${((count / reportData.metadata.totalLogs) * 100).toFixed(1)}%`
      ])
    ]

    const severitySheet = XLSX.utils.aoa_to_sheet(severityData)
    XLSX.utils.book_append_sheet(workbook, severitySheet, 'Severidade')

    // Aba: Top Usuários
    const usersData = [
      ['Posição', 'Usuário', 'Quantidade de Ações', 'Percentual'],
      ...reportData.statistics.topUsers.slice(0, 20).map((user, index) => [
        index + 1,
        user.username,
        user.count,
        `${((user.count / reportData.metadata.totalLogs) * 100).toFixed(1)}%`
      ])
    ]

    const usersSheet = XLSX.utils.aoa_to_sheet(usersData)
    XLSX.utils.book_append_sheet(workbook, usersSheet, 'Top Usuários')

    // Aba: Top Recursos
    const resourcesData = [
      ['Posição', 'Recurso', 'Quantidade de Acessos'],
      ...reportData.statistics.topResources.slice(0, 20).map((resource, index) => [
        index + 1,
        resource.resource,
        resource.count
      ])
    ]

    const resourcesSheet = XLSX.utils.aoa_to_sheet(resourcesData)
    XLSX.utils.book_append_sheet(workbook, resourcesSheet, 'Top Recursos')

    // Aba: Timeline
    const timelineData = [
      ['Data', 'Total de Eventos', 'Erros'],
      ...reportData.statistics.timelineData.map(day => [
        day.date,
        day.count,
        day.errors
      ])
    ]

    const timelineSheet = XLSX.utils.aoa_to_sheet(timelineData)
    XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Timeline')

    // Aba: Logs Detalhados (se incluído)
    if (reportData.logs.length > 0) {
      const logsData = [
        ['Timestamp', 'Severidade', 'Categoria', 'Ação', 'Usuário', 'Recurso', 'Status', 'Detalhes'],
        ...reportData.logs.slice(0, 1000).map(log => [
          log.timestamp,
          log.severity,
          log.category,
          log.action,
          log.username,
          log.resource,
          log.status,
          typeof log.details === 'object' ? JSON.stringify(log.details) : log.details
        ])
      ]

      const logsSheet = XLSX.utils.aoa_to_sheet(logsData)
      XLSX.utils.book_append_sheet(workbook, logsSheet, 'Logs Detalhados')
    }

    // Aba: Recomendações
    if (reportData.recommendations.length > 0) {
      const recommendationsData = [
        ['Prioridade', 'Categoria', 'Título', 'Descrição', 'Ações'],
        ...reportData.recommendations.map(rec => [
          rec.priority.toUpperCase(),
          rec.category,
          rec.title,
          rec.description,
          rec.actionItems.join('; ')
        ])
      ]

      const recommendationsSheet = XLSX.utils.aoa_to_sheet(recommendationsData)
      XLSX.utils.book_append_sheet(workbook, recommendationsSheet, 'Recomendações')
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  /**
   * Exporta para HTML
   */
  private async exportToHTML(reportData: ReportData): Promise<Blob> {
    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Técnico do Sistema</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f7fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .section {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .section-header {
            background: #4a5568;
            color: white;
            padding: 15px 20px;
            font-weight: bold;
            font-size: 18px;
        }
        .section-content {
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .metric-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        .metric-label {
            color: #7f8c8d;
            font-size: 14px;
        }
        .recommendations {
            list-style: none;
            padding: 0;
        }
        .recommendation {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 0 5px 5px 0;
        }
        .priority-high { border-left-color: #dc3545; background: #f8d7da; }
        .priority-medium { border-left-color: #ffc107; background: #fff3cd; }
        .priority-low { border-left-color: #28a745; background: #d4edda; }
        .footer {
            text-align: center;
            color: #6c757d;
            margin-top: 40px;
            padding: 20px;
            background: white;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 RELATÓRIO TÉCNICO DO SISTEMA</h1>
        <p>Período: ${reportData.metadata.period}</p>
        <p>Gerado em: ${new Date(reportData.metadata.generatedAt).toLocaleString('pt-BR')}</p>
    </div>

    <div class="section">
        <div class="section-header">📈 Resumo Executivo</div>
        <div class="section-content">
            <div class="metric-grid">
                <div class="metric-card">
                    <div class="metric-value">${reportData.summary.systemHealth}</div>
                    <div class="metric-label">Saúde do Sistema</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${reportData.metadata.totalLogs.toLocaleString()}</div>
                    <div class="metric-label">Total de Logs</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${reportData.summary.criticalIssues}</div>
                    <div class="metric-label">Problemas Críticos</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${reportData.summary.errorRate.toFixed(2)}%</div>
                    <div class="metric-label">Taxa de Erro</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-header">⚡ Distribuição de Severidade</div>
        <div class="section-content">
            <table>
                <thead>
                    <tr>
                        <th>Severidade</th>
                        <th>Quantidade</th>
                        <th>Percentual</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(reportData.statistics.severityDistribution).map(([severity, count]) => `
                    <tr>
                        <td><strong>${severity.toUpperCase()}</strong></td>
                        <td>${count}</td>
                        <td>${((count / reportData.metadata.totalLogs) * 100).toFixed(1)}%</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-header">👥 Top Usuários</div>
        <div class="section-content">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Usuário</th>
                        <th>Ações</th>
                        <th>Percentual</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.statistics.topUsers.slice(0, 10).map((user, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.username}</td>
                        <td>${user.count}</td>
                        <td>${((user.count / reportData.metadata.totalLogs) * 100).toFixed(1)}%</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>

    ${reportData.recommendations.length > 0 ? `
    <div class="section">
        <div class="section-header">💡 Recomendações Técnicas</div>
        <div class="section-content">
            <ul class="recommendations">
                ${reportData.recommendations.map(rec => `
                <li class="recommendation priority-${rec.priority}">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <strong>Ações:</strong>
                    <ul>
                        ${rec.actionItems.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </li>
                `).join('')}
            </ul>
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p>🤖 Relatório gerado automaticamente pelo Sistema GestaoZe</p>
        <p>ID: ${reportData.metadata.reportId}</p>
    </div>
</body>
</html>`

    return new Blob([html], { type: 'text/html;charset=utf-8' })
  }

  /**
   * Exporta para JSON
   */
  private async exportToJSON(reportData: ReportData): Promise<Blob> {
    const jsonString = JSON.stringify(reportData, null, 2)
    return new Blob([jsonString], { type: 'application/json;charset=utf-8' })
  }

  /**
   * Coleta logs filtrados
   */
  private async getFilteredLogs(config: ReportConfig): Promise<SystemLog[]> {
    const query: any = {
      startDate: config.period.start,
      endDate: config.period.end,
      limit: 5000 // Limite para análise
    }

    if (config.filters?.severity) {
      query.severity = config.filters.severity
    }

    if (config.filters?.category) {
      query.category = config.filters.category
    }

    const result = await logService.getLogs(query)
    return result.data
  }

  /**
   * Gera analytics avançados
   */
  private async generateAnalytics(logs: SystemLog[], statistics: LogStatistics): Promise<any> {
    return {
      performanceMetrics: this.analyzePerformance(logs),
      securityIncidents: this.analyzeSecurityIncidents(logs),
      userActivity: this.analyzeUserActivity(logs),
      systemUtilization: this.analyzeSystemUtilization(logs, statistics)
    }
  }

  /**
   * Analisa performance
   */
  private analyzePerformance(logs: SystemLog[]): any {
    const performanceLogs = logs.filter(log => log.execution_time !== undefined)

    if (performanceLogs.length === 0) {
      return { averageTime: 0, slowQueries: [], recommendations: [] }
    }

    const executionTimes = performanceLogs.map(log => log.execution_time!).filter(time => time > 0)
    const averageTime = executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
    const slowQueries = performanceLogs.filter(log => (log.execution_time || 0) > 1000)

    return {
      averageTime: Math.round(averageTime),
      slowQueries: slowQueries.slice(0, 10),
      p95: this.calculatePercentile(executionTimes, 95),
      p99: this.calculatePercentile(executionTimes, 99),
      recommendations: this.generatePerformanceRecommendations(averageTime, slowQueries.length)
    }
  }

  /**
   * Analisa incidentes de segurança
   */
  private analyzeSecurityIncidents(logs: SystemLog[]): any {
    const securityLogs = logs.filter(log =>
      log.category === 'security' ||
      log.category === 'auth' ||
      log.severity === 'critical'
    )

    const failedLogins = securityLogs.filter(log =>
      log.action.includes('login') && log.status === 'failed'
    )

    const suspiciousActivity = securityLogs.filter(log =>
      log.severity === 'critical' ||
      log.action.includes('unauthorized')
    )

    return {
      totalSecurityEvents: securityLogs.length,
      failedLogins: failedLogins.length,
      suspiciousActivity: suspiciousActivity.length,
      topSecurityIssues: this.getTopSecurityIssues(securityLogs),
      recommendations: this.generateSecurityRecommendations(securityLogs)
    }
  }

  /**
   * Analisa atividade dos usuários
   */
  private analyzeUserActivity(logs: SystemLog[]): any {
    const userLogs = logs.filter(log => log.username && log.username !== 'Sistema')
    const uniqueUsers = [...new Set(userLogs.map(log => log.username))]

    const userStats = uniqueUsers.map(username => {
      const userActions = userLogs.filter(log => log.username === username)
      const errorActions = userActions.filter(log => log.status === 'failed')

      return {
        username,
        totalActions: userActions.length,
        errorRate: userActions.length > 0 ? (errorActions.length / userActions.length) * 100 : 0,
        lastActivity: Math.max(...userActions.map(log => new Date(log.timestamp).getTime()))
      }
    })

    return {
      totalUsers: uniqueUsers.length,
      activeUsers: userStats.filter(user => Date.now() - user.lastActivity < 24 * 60 * 60 * 1000).length,
      userStats: userStats.sort((a, b) => b.totalActions - a.totalActions).slice(0, 20)
    }
  }

  /**
   * Analisa utilização do sistema
   */
  private analyzeSystemUtilization(logs: SystemLog[], statistics: LogStatistics): any {
    const hourlyDistribution = this.calculateHourlyDistribution(logs)
    const resourceUtilization = statistics.topResources.slice(0, 10)

    return {
      hourlyDistribution,
      resourceUtilization,
      peakHours: this.identifyPeakHours(hourlyDistribution),
      systemLoad: this.calculateSystemLoad(logs)
    }
  }

  /**
   * Gera recomendações baseadas no template
   */
  private generateRecommendations(
    statistics: LogStatistics,
    logs: SystemLog[],
    template: string
  ): Array<any> {
    const recommendations: Array<any> = []

    // Recomendações baseadas em taxa de erro
    if (statistics.errorRate > 10) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Performance',
        title: 'Taxa de Erro Crítica',
        description: `A taxa de erro atual de ${statistics.errorRate.toFixed(2)}% está acima do limite aceitável de 10%.`,
        actionItems: [
          'Implementar monitoramento proativo de erros',
          'Revisar logs de erro mais frequentes',
          'Implementar retry automático para operações falhas',
          'Melhorar tratamento de exceções'
        ]
      })
    }

    // Recomendações para problemas críticos
    if (statistics.criticalIssues > 0) {
      recommendations.push({
        priority: 'high' as const,
        category: 'Sistema',
        title: 'Problemas Críticos Identificados',
        description: `${statistics.criticalIssues} problemas críticos foram identificados no período analisado.`,
        actionItems: [
          'Investigar e resolver problemas críticos imediatamente',
          'Implementar alertas automáticos para eventos críticos',
          'Estabelecer procedimento de resposta a incidentes',
          'Revisar e fortalecer monitoramento'
        ]
      })
    }

    // Recomendações de performance
    if (statistics.averageResponseTime > 1000) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Performance',
        title: 'Otimização de Performance Necessária',
        description: `O tempo médio de resposta de ${statistics.averageResponseTime.toFixed(2)}ms está acima do ideal.`,
        actionItems: [
          'Identificar e otimizar consultas lentas',
          'Implementar cache estratégico',
          'Revisar índices do banco de dados',
          'Considerar otimização de código'
        ]
      })
    }

    // Recomendações de segurança
    const authLogs = logs.filter(log => log.category === 'auth' && log.status === 'failed')
    if (authLogs.length > 50) {
      recommendations.push({
        priority: 'medium' as const,
        category: 'Segurança',
        title: 'Alto Número de Falhas de Autenticação',
        description: `${authLogs.length} tentativas de login falharam no período analisado.`,
        actionItems: [
          'Implementar limite de tentativas de login',
          'Adicionar captcha após múltiplas falhas',
          'Monitorar tentativas de força bruta',
          'Considerar autenticação de dois fatores'
        ]
      })
    }

    // Recomendações gerais
    recommendations.push({
      priority: 'low' as const,
      category: 'Manutenção',
      title: 'Manutenção Preventiva',
      description: 'Implementar rotinas de manutenção preventiva para garantir a saúde do sistema.',
      actionItems: [
        'Estabelecer rotina de limpeza de logs antigos',
        'Implementar backups automáticos',
        'Revisar e atualizar documentação',
        'Treinar equipe em procedimentos operacionais'
      ]
    })

    return recommendations
  }

  /**
   * Métodos auxiliares
   */
  private calculateSystemHealth(statistics: LogStatistics): string {
    if (statistics.errorRate < 2 && statistics.criticalIssues === 0) {
      return 'EXCELENTE'
    } else if (statistics.errorRate < 5 && statistics.criticalIssues < 3) {
      return 'BOM'
    } else if (statistics.errorRate < 10) {
      return 'ACEITÁVEL'
    } else {
      return 'CRÍTICO'
    }
  }

  private identifyTopIssues(logs: SystemLog[]): Array<{ issue: string; count: number; severity: string }> {
    const issues = new Map()

    logs.filter(log => log.status === 'failed' || log.severity === 'error' || log.severity === 'critical')
      .forEach(log => {
        const key = `${log.action}_${log.resource}`
        const existing = issues.get(key) || { issue: `${log.action} em ${log.resource}`, count: 0, severity: log.severity }
        existing.count++
        if (log.severity === 'critical') existing.severity = 'critical'
        else if (log.severity === 'error' && existing.severity !== 'critical') existing.severity = 'error'
        issues.set(key, existing)
      })

    return Array.from(issues.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = values.slice().sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index] || 0
  }

  private generatePerformanceRecommendations(avgTime: number, slowQueriesCount: number): string[] {
    const recommendations = []

    if (avgTime > 1000) {
      recommendations.push('Otimizar consultas com tempo de execução elevado')
    }

    if (slowQueriesCount > 10) {
      recommendations.push('Implementar cache para consultas frequentes')
      recommendations.push('Revisar índices do banco de dados')
    }

    return recommendations
  }

  private getTopSecurityIssues(securityLogs: SystemLog[]): Array<{ issue: string; count: number }> {
    const issues = new Map()

    securityLogs.forEach(log => {
      const key = log.action
      issues.set(key, (issues.get(key) || 0) + 1)
    })

    return Array.from(issues.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  private generateSecurityRecommendations(securityLogs: SystemLog[]): string[] {
    const recommendations = []

    const failedLogins = securityLogs.filter(log => log.action.includes('login') && log.status === 'failed')
    if (failedLogins.length > 20) {
      recommendations.push('Implementar bloqueio automático após múltiplas tentativas de login')
    }

    if (securityLogs.some(log => log.severity === 'critical')) {
      recommendations.push('Revisar e fortalecer políticas de segurança')
    }

    return recommendations
  }

  private calculateHourlyDistribution(logs: SystemLog[]): Array<{ hour: number; count: number }> {
    const distribution = new Array(24).fill(0).map((_, index) => ({ hour: index, count: 0 }))

    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours()
      distribution[hour].count++
    })

    return distribution
  }

  private identifyPeakHours(hourlyDistribution: Array<{ hour: number; count: number }>): number[] {
    const avgCount = hourlyDistribution.reduce((sum, h) => sum + h.count, 0) / 24
    return hourlyDistribution
      .filter(h => h.count > avgCount * 1.5)
      .map(h => h.hour)
  }

  private calculateSystemLoad(logs: SystemLog[]): string {
    const totalActions = logs.length
    const timeSpan = 24 * 60 * 60 * 1000 // 24 horas em ms
    const actionsPerSecond = totalActions / (timeSpan / 1000)

    if (actionsPerSecond < 0.1) return 'BAIXO'
    if (actionsPerSecond < 1) return 'MÉDIO'
    if (actionsPerSecond < 10) return 'ALTO'
    return 'MUITO ALTO'
  }

  private generateReportId(): string {
    return `RPT_${Date.now()}_${Math.random().toString(36).substring(2, 15).toUpperCase()}`
  }

  /**
   * Lista templates disponíveis
   */
  getAvailableTemplates(): Record<string, any> {
    return this.reportTemplates
  }

  /**
   * Gera relatório rápido (versão simplificada)
   */
  async generateQuickReport(days: number = 7): Promise<string> {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    const config: ReportConfig = {
      title: 'Relatório Rápido do Sistema',
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days
      },
      includeCharts: false,
      includeDetails: false,
      includeRecommendations: true,
      format: 'json',
      template: 'executive'
    }

    const reportData = await this.generateReport(config)
    return await logService.generateTechnicalReport(days)
  }
}

export const reportService = new ReportService()