/**
 * Script de Inicialização do Sistema Avançado de Logs
 * Configura e inicializa todos os componentes necessários
 */

import { logService } from '@/services/logService'
import { reportService } from '@/services/reportService'
import { logInterceptor } from '@/middleware/logInterceptor'
import { logsSystemTester, runQuickTest } from '@/tests/logsSystem.test'

export interface InitializationConfig {
  enableInterceptors: boolean
  enableAutoCleanup: boolean
  cleanupIntervalDays: number
  enablePerformanceMonitoring: boolean
  enableSecurityAlerts: boolean
  testSystem: boolean
  createSampleData: boolean
}

export class LogsSystemInitializer {
  private config: InitializationConfig

  constructor(config: Partial<InitializationConfig> = {}) {
    this.config = {
      enableInterceptors: true,
      enableAutoCleanup: true,
      cleanupIntervalDays: 90,
      enablePerformanceMonitoring: true,
      enableSecurityAlerts: true,
      testSystem: false,
      createSampleData: false,
      ...config
    }
  }

  /**
   * Inicializa o sistema completo
   */
  async initialize(): Promise<boolean> {
    console.log('🚀 Inicializando Sistema Avançado de Logs GestaoZe...\n')

    try {
      // 1. Verificar dependências
      await this.checkDependencies()

      // 2. Configurar interceptadores
      if (this.config.enableInterceptors) {
        await this.setupInterceptors()
      }

      // 3. Configurar limpeza automática
      if (this.config.enableAutoCleanup) {
        this.setupAutoCleanup()
      }

      // 4. Configurar monitoramento
      if (this.config.enablePerformanceMonitoring) {
        this.setupPerformanceMonitoring()
      }

      // 5. Configurar alertas de segurança
      if (this.config.enableSecurityAlerts) {
        this.setupSecurityAlerts()
      }

      // 6. Criar dados de exemplo (se solicitado)
      if (this.config.createSampleData) {
        await this.createSampleData()
      }

      // 7. Testar sistema (se solicitado)
      if (this.config.testSystem) {
        await this.testSystem()
      }

      // 8. Log de inicialização
      await this.logInitialization()

      console.log('✅ Sistema de Logs inicializado com sucesso!')
      console.log('📊 Interface disponível na rota: /logs')
      console.log('🔧 Comandos disponíveis: help, stats, logs, export, etc.')
      console.log('📄 Relatórios técnicos podem ser gerados via interface ou comando "report"\n')

      return true
    } catch (error) {
      console.error('❌ Erro durante inicialização:', error)
      return false
    }
  }

  /**
   * Verifica dependências necessárias
   */
  private async checkDependencies(): Promise<void> {
    console.log('🔍 Verificando dependências...')

    // Verifica se o Supabase está configurado
    try {
      await logService.getLogs({ limit: 1 })
      console.log('✅ Conexão com banco de dados funcionando')
    } catch (error) {
      console.warn('⚠️  Aviso: Conexão com banco pode estar indisponível, usando fallback local')
    }

    // Verifica serviços
    if (typeof logService.createLog !== 'function') {
      throw new Error('LogService não está disponível')
    }

    if (typeof reportService.generateReport !== 'function') {
      throw new Error('ReportService não está disponível')
    }

    console.log('✅ Dependências verificadas')
  }

  /**
   * Configura interceptadores
   */
  private async setupInterceptors(): Promise<void> {
    console.log('🕵️ Configurando interceptadores...')

    // Ativar interceptador
    logInterceptor.setEnabled(true)

    // Configurar interceptadores específicos do projeto
    if (typeof window !== 'undefined') {
      // Interceptar mudanças de rota específicas do GestaoZe
      const originalPushState = history.pushState
      history.pushState = function(data: any, title: string, url?: string | null) {
        logInterceptor.logUserAction('route_change', 'navigation', {
          from: window.location.pathname,
          to: url,
          method: 'pushState'
        })
        return originalPushState.call(history, data, title, url)
      }

      // Interceptar clicks em elementos importantes
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement

        // Log clicks em botões importantes
        if (target.matches('[data-log-action]')) {
          const action = target.getAttribute('data-log-action')
          const resource = target.getAttribute('data-log-resource') || 'ui'

          logInterceptor.logUserAction(`ui_click_${action}`, resource, {
            element: target.tagName,
            text: target.textContent?.trim(),
            className: target.className
          })
        }

        // Log clicks em links de navegação
        if (target.matches('a[href]') || target.closest('a[href]')) {
          const link = target.matches('a[href]') ? target : target.closest('a[href]')
          const href = (link as HTMLAnchorElement).href

          if (href.includes('/')) {
            logInterceptor.logUserAction('navigation_click', 'navigation', {
              href,
              text: link?.textContent?.trim()
            })
          }
        }
      })

      console.log('✅ Interceptadores configurados')
    }
  }

  /**
   * Configura limpeza automática
   */
  private setupAutoCleanup(): void {
    console.log('🧹 Configurando limpeza automática...')

    // Executa limpeza a cada 24 horas
    setInterval(async () => {
      try {
        const deletedCount = await logService.cleanOldLogs(this.config.cleanupIntervalDays)

        if (deletedCount > 0) {
          console.log(`🧹 Limpeza automática: ${deletedCount} logs antigos removidos`)

          await logService.createLog({
            action: 'auto_cleanup_completed',
            resource: 'maintenance',
            details: {
              deletedCount,
              daysKept: this.config.cleanupIntervalDays
            },
            category: 'system',
            severity: 'info'
          })
        }
      } catch (error) {
        console.error('❌ Erro na limpeza automática:', error)

        await logService.createLog({
          action: 'auto_cleanup_failed',
          resource: 'maintenance',
          details: { error: (error as Error).message },
          category: 'system',
          severity: 'error',
          status: 'failed'
        })
      }
    }, 24 * 60 * 60 * 1000) // 24 horas

    console.log(`✅ Limpeza automática configurada (${this.config.cleanupIntervalDays} dias)`)
  }

  /**
   * Configura monitoramento de performance
   */
  private setupPerformanceMonitoring(): void {
    console.log('⚡ Configurando monitoramento de performance...')

    // Monitor de performance de página
    if (typeof window !== 'undefined' && window.performance) {
      // Monitorar tempo de carregamento
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.timing
          const loadTime = perfData.loadEventEnd - perfData.navigationStart

          logService.createLog({
            action: 'page_load_complete',
            resource: 'performance',
            details: {
              loadTime,
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
              firstPaint: perfData.responseStart - perfData.navigationStart,
              url: window.location.pathname
            },
            category: 'performance',
            severity: loadTime > 3000 ? 'warning' : 'info',
            execution_time: loadTime
          })
        }, 0)
      })

      // Monitorar uso de memória (se disponível)
      if ('memory' in performance) {
        setInterval(() => {
          const memory = (performance as any).memory
          const memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100

          if (memoryUsage > 80) {
            logService.createLog({
              action: 'high_memory_usage',
              resource: 'performance',
              details: {
                usedMemory: memory.usedJSHeapSize,
                totalMemory: memory.jsHeapSizeLimit,
                percentage: memoryUsage.toFixed(2)
              },
              category: 'performance',
              severity: 'warning'
            })
          }
        }, 30000) // A cada 30 segundos
      }

      console.log('✅ Monitoramento de performance ativo')
    }
  }

  /**
   * Configura alertas de segurança
   */
  private setupSecurityAlerts(): void {
    console.log('🔒 Configurando alertas de segurança...')

    // Monitor de tentativas de acesso suspeitas
    let failedAttempts = new Map<string, number>()

    const originalCreateLog = logService.createLog.bind(logService)
    logService.createLog = async function(logData) {
      await originalCreateLog(logData)

      // Detectar múltiplas falhas de autenticação
      if (logData.category === 'auth' && logData.status === 'failed') {
        const key = `${logData.details?.username || 'unknown'}_${logData.details?.ip || 'unknown'}`
        const attempts = (failedAttempts.get(key) || 0) + 1
        failedAttempts.set(key, attempts)

        if (attempts >= 5) {
          await originalCreateLog({
            action: 'security_alert_multiple_failed_logins',
            resource: 'security',
            details: {
              attempts,
              username: logData.details?.username,
              ip: logData.details?.ip,
              timeWindow: '5 minutes'
            },
            category: 'security',
            severity: 'critical'
          })

          failedAttempts.delete(key) // Reset counter
        }
      }

      // Detectar acessos de IPs suspeitos
      if (logData.details?.ip && logData.category === 'auth' && (logData.action ?? '').includes('login')) {
        const suspiciousIPs = ['127.0.0.1', '0.0.0.0'] // IPs para monitorar
        if (suspiciousIPs.includes(logData.details.ip)) {
          await originalCreateLog({
            action: 'security_alert_suspicious_ip',
            resource: 'security',
            details: {
              ip: logData.details.ip,
              action: logData.action,
              username: logData.details?.username
            },
            category: 'security',
            severity: 'warning'
          })
        }
      }
    }

    // Limpar contadores a cada 5 minutos
    setInterval(() => {
      failedAttempts.clear()
    }, 5 * 60 * 1000)

    console.log('✅ Alertas de segurança configurados')
  }

  /**
   * Cria dados de exemplo para demonstração
   */
  private async createSampleData(): Promise<void> {
    console.log('📝 Criando dados de exemplo...')

    const sampleLogs = [
      {
        action: 'system_startup',
        resource: 'application',
        details: { version: '2.0.0', environment: 'production' },
        category: 'system' as const,
        severity: 'info' as const
      },
      {
        action: 'admin_login',
        resource: 'authentication',
        details: { username: 'admin', ip: '192.168.1.1', browser: 'Chrome 120' },
        category: 'auth' as const,
        severity: 'info' as const
      },
      {
        action: 'create_product',
        resource: 'products',
        resource_id: 'prod_001',
        details: { name: 'Produto Demo', category: 'electronics', price: 299.99 },
        category: 'crud' as const,
        severity: 'info' as const
      },
      {
        action: 'database_backup',
        resource: 'maintenance',
        details: { tables: 15, size: '2.3GB', duration: 120000 },
        category: 'system' as const,
        severity: 'info' as const,
        execution_time: 120000
      },
      {
        action: 'failed_payment_processing',
        resource: 'payments',
        details: { orderId: 'ORD_001', amount: 150.50, reason: 'Invalid card' },
        category: 'api' as const,
        severity: 'error' as const,
        status: 'failed' as const,
        error_message: 'Payment declined by bank'
      },
      {
        action: 'security_scan_completed',
        resource: 'security',
        details: { vulnerabilities: 0, scannedFiles: 1250, duration: 45000 },
        category: 'security' as const,
        severity: 'info' as const,
        execution_time: 45000
      }
    ]

    for (const log of sampleLogs) {
      await logService.createLog(log)
    }

    console.log(`✅ ${sampleLogs.length} logs de exemplo criados`)
  }

  /**
   * Testa o sistema
   */
  private async testSystem(): Promise<void> {
    console.log('🧪 Testando sistema...')

    const isWorking = await runQuickTest()

    if (isWorking) {
      console.log('✅ Teste rápido passou')

      // Executar testes mais detalhados se solicitado
      const runDetailedTests = (import.meta as any).env?.DEV === true
      if (runDetailedTests) {
        console.log('🔬 Executando testes detalhados...')
        await logsSystemTester.runAllTests()
      }
    } else {
      console.warn('⚠️  Teste rápido falhou - sistema pode ter problemas')
    }
  }

  /**
   * Registra log de inicialização
   */
  private async logInitialization(): Promise<void> {
    await logService.createLog({
      action: 'logs_system_initialized',
      resource: 'system_startup',
      details: {
        version: '2.0.0',
        config: this.config,
        features: {
          interceptors: this.config.enableInterceptors,
          autoCleanup: this.config.enableAutoCleanup,
          performanceMonitoring: this.config.enablePerformanceMonitoring,
          securityAlerts: this.config.enableSecurityAlerts
        },
        timestamp: new Date().toISOString()
      },
      category: 'system',
      severity: 'info'
    })
  }

  /**
   * Método de limpeza (para desenvolvimento)
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Limpando sistema de logs...')

    try {
      const deletedCount = await logService.cleanOldLogs(0) // Remove todos os logs
      console.log(`✅ ${deletedCount} logs removidos`)
    } catch (error) {
      console.error('❌ Erro na limpeza:', error)
    }
  }

  /**
   * Status do sistema
   */
  async getSystemStatus(): Promise<any> {
    try {
      const stats = await logService.getLogStatistics(7)
      const recentLogs = await logService.getLogs({ limit: 5 })

      return {
        isHealthy: stats.errorRate < 10 && stats.criticalIssues === 0,
        statistics: stats,
        recentActivity: recentLogs.data.length,
        lastActivity: recentLogs.data[0]?.created_at ?? recentLogs.data[0]?.timestamp,
        uptime: Date.now() - (window.sessionStartTime || Date.now())
      }
    } catch (error) {
      return {
        isHealthy: false,
        error: (error as Error).message
      }
    }
  }
}

// Instância global
export const logsSystemInitializer = new LogsSystemInitializer()

// Função de conveniência para inicialização rápida
export async function initializeLogsSystem(config?: Partial<InitializationConfig>): Promise<boolean> {
  const initializer = new LogsSystemInitializer(config)
  return await initializer.initialize()
}

// Auto-inicialização em desenvolvimento
if ((import.meta as any).env?.DEV === true && typeof window !== 'undefined') {
  // Aguarda carregamento da página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => initializeLogsSystem({ testSystem: false }), 1000)
    })
  } else {
    setTimeout(() => initializeLogsSystem({ testSystem: false }), 1000)
  }
}
