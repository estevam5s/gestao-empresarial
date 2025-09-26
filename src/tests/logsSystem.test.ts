/**
 * Testes abrangentes para o Sistema Avançado de Logs
 */

import { logService } from '@/services/logService'
import { reportService } from '@/services/reportService'
import { logInterceptor } from '@/middleware/logInterceptor'

// Simulação de dados para teste
const testLogs = [
  {
    action: 'user_login',
    resource: 'authentication',
    details: { ip: '192.168.1.1', browser: 'Chrome' },
    category: 'auth' as const,
    severity: 'info' as const
  },
  {
    action: 'create_product',
    resource: 'products',
    resource_id: '123',
    details: { name: 'Produto Teste', price: 100 },
    category: 'crud' as const,
    severity: 'info' as const
  },
  {
    action: 'database_error',
    resource: 'database',
    details: { error: 'Connection timeout', query: 'SELECT * FROM products' },
    category: 'database' as const,
    severity: 'error' as const,
    status: 'failed' as const,
    error_message: 'Database connection failed'
  },
  {
    action: 'security_breach_attempt',
    resource: 'security',
    details: { ip: '192.168.1.100', attempts: 5 },
    category: 'security' as const,
    severity: 'critical' as const,
    status: 'failed' as const
  }
]

/**
 * Classe de testes para o sistema de logs
 */
export class LogsSystemTester {
  private results: Array<{ test: string; status: 'PASS' | 'FAIL'; message?: string; duration: number }> = []

  async runAllTests(): Promise<void> {
    console.log('🧪 Iniciando testes do Sistema Avançado de Logs...\n')

    try {
      await this.testLogService()
      await this.testCommandSystem()
      await this.testReportGeneration()
      await this.testInterceptors()
      await this.testPerformance()

      this.displayResults()
    } catch (error) {
      console.error('❌ Erro crítico durante os testes:', error)
    }
  }

  /**
   * Testa o serviço básico de logs
   */
  private async testLogService(): Promise<void> {
    console.log('📝 Testando LogService...')

    // Teste 1: Criação de log
    await this.runTest('Criação de Log', async () => {
      await logService.createLog(testLogs[0])
      return true
    })

    // Teste 2: Busca de logs
    await this.runTest('Busca de Logs', async () => {
      const result = await logService.getLogs({ limit: 10 })
      return result.data.length >= 0 && typeof result.total === 'number'
    })

    // Teste 3: Estatísticas
    await this.runTest('Estatísticas de Logs', async () => {
      const stats = await logService.getLogStatistics(7)
      return typeof stats.totalLogs === 'number' &&
             typeof stats.errorRate === 'number' &&
             Array.isArray(stats.topUsers)
    })

    // Teste 4: Filtros avançados
    await this.runTest('Filtros Avançados', async () => {
      const result = await logService.getLogs({
        severity: ['error', 'critical'],
        category: ['security'],
        limit: 5
      })
      return Array.isArray(result.data)
    })

    // Teste 5: Limpeza de logs antigos
    await this.runTest('Limpeza de Logs Antigos', async () => {
      const deletedCount = await logService.cleanOldLogs(365)
      return typeof deletedCount === 'number'
    })
  }

  /**
   * Testa o sistema de comandos
   */
  private async testCommandSystem(): Promise<void> {
    console.log('⌨️ Testando Sistema de Comandos...')

    const commands = [
      'help',
      'stats --days 7',
      'logs --limit 5',
      'status',
      'users',
      'export --format json --days 1',
      'search --query "login"',
      'clear'
    ]

    for (const command of commands) {
      await this.runTest(`Comando: ${command}`, async () => {
        const parts = command.split(' ')
        const cmd = parts[0]
        const args = parts.slice(1)

        const result = await logService.executeCommand(cmd, args)
        return result.success !== undefined &&
               typeof result.message === 'string' &&
               typeof result.executionTime === 'number'
      })
    }

    // Teste de comando inválido
    await this.runTest('Comando Inválido', async () => {
      try {
        const result = await logService.executeCommand('invalid_command', [])
        return !result.success
      } catch (error) {
        return true // Esperado falhar
      }
    })
  }

  /**
   * Testa geração de relatórios
   */
  private async testReportGeneration(): Promise<void> {
    console.log('📊 Testando Geração de Relatórios...')

    // Teste 1: Relatório técnico
    await this.runTest('Relatório Técnico', async () => {
      const report = await logService.generateTechnicalReport(7)
      return typeof report === 'string' &&
             report.includes('RELATÓRIO TÉCNICO') &&
             report.length > 1000
    })

    // Teste 2: Templates de relatório
    await this.runTest('Templates de Relatório', async () => {
      const templates = reportService.getAvailableTemplates()
      return Object.keys(templates).length > 0 &&
             templates.executive &&
             templates.technical &&
             templates.security
    })

    // Teste 3: Configuração de relatório
    await this.runTest('Configuração de Relatório', async () => {
      const config = {
        title: 'Teste Report',
        period: {
          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
          days: 7
        },
        includeCharts: true,
        includeDetails: false,
        includeRecommendations: true,
        format: 'json' as const,
        template: 'technical' as const
      }

      const reportData = await reportService.generateReport(config)
      return reportData.metadata &&
             reportData.summary &&
             reportData.statistics &&
             Array.isArray(reportData.recommendations)
    })

    // Teste 4: Exportação para diferentes formatos
    await this.runTest('Exportação PDF', async () => {
      const quickReport = await reportService.generateQuickReport(1)
      return typeof quickReport === 'string'
    })
  }

  /**
   * Testa interceptadores
   */
  private async testInterceptors(): Promise<void> {
    console.log('🕵️ Testando Interceptadores...')

    // Teste 1: Log de ação do usuário
    await this.runTest('Log de Ação do Usuário', async () => {
      logInterceptor.logUserAction('test_action', 'test_resource', { test: true })
      return true // Não há retorno direto, apenas execução
    })

    // Teste 2: Log de erro
    await this.runTest('Log de Erro', async () => {
      const testError = new Error('Erro de teste')
      logInterceptor.logError(testError, 'test_context', { additional: 'data' })
      return true
    })

    // Teste 3: Log de autenticação
    await this.runTest('Log de Autenticação', async () => {
      logInterceptor.logAuth('test_login', { username: 'test_user' }, true)
      logInterceptor.logAuth('test_login_failed', { username: 'invalid_user' }, false)
      return true
    })

    // Teste 4: Log de segurança
    await this.runTest('Log de Segurança', async () => {
      logInterceptor.logSecurity('suspicious_activity', { ip: '192.168.1.100' }, 'warning')
      return true
    })

    // Teste 5: Ativar/Desativar interceptador
    await this.runTest('Controle de Interceptador', async () => {
      logInterceptor.setEnabled(false)
      logInterceptor.setEnabled(true)
      return true
    })
  }

  /**
   * Testa performance do sistema
   */
  private async testPerformance(): Promise<void> {
    console.log('⚡ Testando Performance...')

    // Teste 1: Inserção em lote
    await this.runTest('Inserção em Lote', async () => {
      const startTime = Date.now()

      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(logService.createLog({
          ...testLogs[1],
          details: { ...testLogs[1].details, index: i }
        }))
      }

      await Promise.all(promises)
      const duration = Date.now() - startTime

      console.log(`   ⏱️  Tempo de inserção (10 logs): ${duration}ms`)
      return duration < 5000 // Menos de 5 segundos para 10 logs
    })

    // Teste 2: Busca com paginação
    await this.runTest('Busca Paginada', async () => {
      const startTime = Date.now()

      const result = await logService.getLogs({
        limit: 50,
        offset: 0
      })

      const duration = Date.now() - startTime
      console.log(`   ⏱️  Tempo de busca (50 logs): ${duration}ms`)

      return duration < 2000 && Array.isArray(result.data)
    })

    // Teste 3: Geração de estatísticas
    await this.runTest('Geração de Estatísticas', async () => {
      const startTime = Date.now()

      const stats = await logService.getLogStatistics(30)

      const duration = Date.now() - startTime
      console.log(`   ⏱️  Tempo de estatísticas (30 dias): ${duration}ms`)

      return duration < 3000 && typeof stats.totalLogs === 'number'
    })

    // Teste 4: Execução de comando complexo
    await this.runTest('Comando Complexo', async () => {
      const startTime = Date.now()

      const result = await logService.executeCommand('stats', ['--days', '7'])

      const duration = Date.now() - startTime
      console.log(`   ⏱️  Tempo de comando stats: ${duration}ms`)

      return duration < 1000 && result.success
    })
  }

  /**
   * Executa um teste individual
   */
  private async runTest(testName: string, testFunction: () => Promise<boolean>): Promise<void> {
    const startTime = Date.now()

    try {
      const result = await testFunction()
      const duration = Date.now() - startTime

      if (result) {
        this.results.push({ test: testName, status: 'PASS', duration })
        console.log(`   ✅ ${testName} (${duration}ms)`)
      } else {
        this.results.push({ test: testName, status: 'FAIL', message: 'Teste retornou false', duration })
        console.log(`   ❌ ${testName} - FAIL: Teste retornou false`)
      }
    } catch (error: any) {
      const duration = Date.now() - startTime
      this.results.push({
        test: testName,
        status: 'FAIL',
        message: error.message,
        duration
      })
      console.log(`   ❌ ${testName} - FAIL: ${error.message}`)
    }
  }

  /**
   * Exibe resultados finais
   */
  private displayResults(): void {
    console.log('\n' + '='.repeat(80))
    console.log('📋 RESUMO DOS TESTES')
    console.log('='.repeat(80))

    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0)

    console.log(`✅ Testes Aprovados: ${passed}`)
    console.log(`❌ Testes Falhados: ${failed}`)
    console.log(`⏱️  Tempo Total: ${totalTime}ms`)
    console.log(`📊 Taxa de Sucesso: ${((passed / this.results.length) * 100).toFixed(1)}%`)

    if (failed > 0) {
      console.log('\n❌ FALHAS DETECTADAS:')
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => {
          console.log(`   • ${r.test}: ${r.message}`)
        })
    }

    console.log('\n' + '='.repeat(80))

    if (passed === this.results.length) {
      console.log('🎉 TODOS OS TESTES PASSARAM! Sistema de logs está funcionando perfeitamente.')
    } else {
      console.log('⚠️  Alguns testes falharam. Verifique os erros acima.')
    }

    // Gera log do teste
    logService.createLog({
      action: 'system_tests_completed',
      resource: 'testing',
      details: {
        totalTests: this.results.length,
        passed,
        failed,
        totalTime,
        successRate: ((passed / this.results.length) * 100).toFixed(1)
      },
      category: 'system',
      severity: failed > 0 ? 'warning' : 'info'
    })
  }

  /**
   * Testa cenário real de uso
   */
  async testRealScenario(): Promise<void> {
    console.log('🎭 Testando Cenário Real de Uso...\n')

    // Simular login de usuário
    await logService.createLog({
      action: 'user_login',
      resource: 'authentication',
      details: { username: 'admin', ip: '192.168.1.10' },
      category: 'auth',
      severity: 'info'
    })

    // Simular operações CRUD
    await logService.createLog({
      action: 'create_product',
      resource: 'products',
      resource_id: 'prod_001',
      details: { name: 'Produto A', category: 'electronics' },
      category: 'crud',
      severity: 'info'
    })

    await logService.createLog({
      action: 'update_product',
      resource: 'products',
      resource_id: 'prod_001',
      details: { field: 'price', oldValue: 100, newValue: 120 },
      category: 'crud',
      severity: 'info'
    })

    // Simular erro
    await logService.createLog({
      action: 'delete_product_failed',
      resource: 'products',
      resource_id: 'prod_002',
      details: { reason: 'Product in use' },
      category: 'crud',
      severity: 'error',
      status: 'failed',
      error_message: 'Cannot delete product: still in use'
    })

    // Executar alguns comandos
    await logService.executeCommand('stats', ['--days', '1'])
    await logService.executeCommand('logs', ['--limit', '5', '--severity', 'error'])

    // Gerar relatório
    const report = await logService.generateTechnicalReport(1)

    console.log('📊 Cenário real executado com sucesso!')
    console.log(`📄 Relatório gerado (${report.length} caracteres)`)

    // Verificar se os logs foram criados
    const recentLogs = await logService.getLogs({ limit: 10 })
    console.log(`📝 ${recentLogs.data.length} logs encontrados no sistema`)

    console.log('\n✨ Cenário real concluído com sucesso!')
  }
}

// Instância para uso
export const logsSystemTester = new LogsSystemTester()

// Função para executar todos os testes
export async function runLogsSystemTests(): Promise<void> {
  const tester = new LogsSystemTester()
  await tester.runAllTests()
  await tester.testRealScenario()
}

// Função para executar apenas teste rápido
export async function runQuickTest(): Promise<boolean> {
  try {
    // Teste básico de funcionamento
    await logService.createLog({
      action: 'quick_test',
      resource: 'testing',
      details: { timestamp: Date.now() },
      category: 'system',
      severity: 'info'
    })

    const stats = await logService.getLogStatistics(1)
    const command = await logService.executeCommand('help', [])

    return typeof stats.totalLogs === 'number' && command.success
  } catch (error) {
    console.error('❌ Teste rápido falhou:', error)
    return false
  }
}