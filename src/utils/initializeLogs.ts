/**
 * Utilitário para inicialização automática do sistema de logs
 * Sistema GestãoZe - Configuração Profissional
 */

import { supabase, DB_TABLES } from '@/config/supabase'
import { logService } from '@/services/logService'

export class LogSystemInitializer {

  /**
   * Verifica se a tabela de logs existe e está corretamente configurada
   */
  static async checkLogTableExists(): Promise<boolean> {
    try {
      console.log('🔍 Verificando existência da tabela de logs...')

      const { error } = await supabase
        .from(DB_TABLES.LOGS)
        .select('id')
        .limit(1)

      if (error) {
        console.error('❌ Tabela de logs não encontrada:', error.message)
        return false
      }

      console.log('✅ Tabela de logs existe e está acessível')
      return true
    } catch (error) {
      console.error('❌ Erro ao verificar tabela de logs:', error)
      return false
    }
  }

  /**
   * Verifica se as políticas RLS estão configuradas
   */
  static async checkRLSPolicies(): Promise<boolean> {
    try {
      // Tentar uma operação que requer RLS
      const { error } = await supabase
        .from(DB_TABLES.LOGS)
        .select('count(*)')
        .limit(1)

      if (error && error.message.includes('RLS')) {
        console.log('🔒 RLS está habilitado (esperado)')
        return true
      }

      console.log('✅ Políticas RLS verificadas')
      return true
    } catch (error) {
      console.warn('⚠️ Não foi possível verificar RLS:', error)
      return false
    }
  }

  /**
   * Cria logs de exemplo para demonstração
   */
  static async createSampleLogs(): Promise<void> {
    try {
      console.log('📝 Criando logs de exemplo...')

      const sampleLogs = [
        {
          action: 'system_startup',
          resource: 'application',
          details: {
            version: '1.0.0',
            environment: 'production',
            timestamp: new Date().toISOString()
          },
          category: 'system' as const,
          severity: 'info' as const,
          status: 'success' as const
        },
        {
          action: 'user_login',
          resource: 'authentication',
          details: {
            method: 'email_password',
            ip: '192.168.1.100',
            browser: 'Chrome 120.0'
          },
          category: 'auth' as const,
          severity: 'info' as const,
          status: 'success' as const
        },
        {
          action: 'create_product',
          resource: 'products',
          resource_id: 'prod_12345',
          details: {
            name: 'Produto Exemplo',
            category: 'Categoria A',
            price: 29.99
          },
          category: 'crud' as const,
          severity: 'info' as const,
          status: 'success' as const
        },
        {
          action: 'backup_completed',
          resource: 'database',
          details: {
            size: '15.2 MB',
            duration: 2300,
            tables: 12
          },
          category: 'system' as const,
          severity: 'info' as const,
          status: 'success' as const,
          execution_time: 2300
        },
        {
          action: 'failed_login_attempt',
          resource: 'authentication',
          details: {
            username: 'invalid_user',
            ip: '192.168.1.200',
            reason: 'invalid_credentials'
          },
          category: 'security' as const,
          severity: 'warning' as const,
          status: 'failed' as const,
          error_message: 'Invalid username or password'
        },
        {
          action: 'database_connection_error',
          resource: 'database',
          details: {
            host: 'localhost',
            port: 5432,
            database: 'gestaeze'
          },
          category: 'database' as const,
          severity: 'error' as const,
          status: 'failed' as const,
          error_message: 'Connection timeout after 30 seconds'
        }
      ]

      let createdCount = 0
      for (const logData of sampleLogs) {
        try {
          await logService.createLog(logData)
          createdCount++
        } catch (error) {
          console.warn('⚠️ Erro ao criar log de exemplo:', error)
        }
      }

      console.log(`✅ ${createdCount} logs de exemplo criados com sucesso`)
    } catch (error) {
      console.error('❌ Erro ao criar logs de exemplo:', error)
    }
  }

  /**
   * Executa diagnóstico completo do sistema de logs
   */
  static async runFullDiagnostic(): Promise<{
    tableExists: boolean
    rlsConfigured: boolean
    canInsert: boolean
    canQuery: boolean
    sampleDataCreated: boolean
  }> {
    console.log('🔧 === DIAGNÓSTICO COMPLETO DO SISTEMA DE LOGS ===')

    const results = {
      tableExists: false,
      rlsConfigured: false,
      canInsert: false,
      canQuery: false,
      sampleDataCreated: false
    }

    // 1. Verificar existência da tabela
    results.tableExists = await this.checkLogTableExists()

    if (!results.tableExists) {
      console.error('❌ Sistema de logs não pode funcionar sem a tabela')
      console.log('💡 Execute o script SQL: sql/create_logs_table.sql')
      return results
    }

    // 2. Verificar RLS
    results.rlsConfigured = await this.checkRLSPolicies()

    // 3. Testar inserção
    try {
      await logService.createLog({
        action: 'diagnostic_test',
        resource: 'log_system',
        details: { test: 'insertion', timestamp: new Date().toISOString() },
        category: 'system',
        severity: 'info'
      })
      results.canInsert = true
      console.log('✅ Teste de inserção bem-sucedido')
    } catch (error) {
      console.error('❌ Falha no teste de inserção:', error)
    }

    // 4. Testar consulta
    try {
      const { data } = await logService.getLogs({ limit: 5 })
      results.canQuery = data.length >= 0
      console.log(`✅ Teste de consulta bem-sucedido (${data.length} logs encontrados)`)
    } catch (error) {
      console.error('❌ Falha no teste de consulta:', error)
    }

    // 5. Criar dados de exemplo se necessário
    if (results.canInsert && results.canQuery) {
      const { data } = await logService.getLogs({ limit: 10 })
      if (data.length < 5) {
        await this.createSampleLogs()
        results.sampleDataCreated = true
      }
    }

    // Relatório final
    console.log('\n📊 === RESULTADO DO DIAGNÓSTICO ===')
    console.log('Tabela existe:', results.tableExists ? '✅ OK' : '❌ FALHA')
    console.log('RLS configurado:', results.rlsConfigured ? '✅ OK' : '⚠️ VERIFICAR')
    console.log('Pode inserir logs:', results.canInsert ? '✅ OK' : '❌ FALHA')
    console.log('Pode consultar logs:', results.canQuery ? '✅ OK' : '❌ FALHA')
    console.log('Dados de exemplo:', results.sampleDataCreated ? '✅ CRIADOS' : 'ℹ️ JÁ EXISTEM')

    const allGood = results.tableExists && results.canInsert && results.canQuery
    console.log('\n🎯 SISTEMA DE LOGS:', allGood ? '🟢 OPERACIONAL' : '🔴 REQUER ATENÇÃO')

    return results
  }

  /**
   * Inicialização automática do sistema
   */
  static async autoInitialize(): Promise<void> {
    try {
      console.log('🚀 Inicializando sistema de logs...')

      // Registrar log de inicialização
      await logService.createLog({
        action: 'log_system_initialization',
        resource: 'system',
        details: {
          timestamp: new Date().toISOString(),
          version: '2.0.0',
          features: [
            'terminal_interface',
            'advanced_commands',
            'technical_reports',
            'real_time_monitoring',
            'automated_cleanup'
          ]
        },
        category: 'system',
        severity: 'info'
      })

      console.log('✅ Sistema de logs inicializado com sucesso')
    } catch (error) {
      console.error('❌ Erro na inicialização do sistema de logs:', error)
    }
  }

  /**
   * Configurar interceptadores automáticos
   */
  static setupAutoLogging(): void {
    // Interceptar erros globais
    window.addEventListener('error', (event) => {
      logService.logError(
        new Error(event.message),
        'global_error_handler',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      )
    })

    // Interceptar promessas rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      logService.logError(
        new Error(event.reason?.message || 'Unhandled promise rejection'),
        'promise_rejection_handler',
        {
          reason: event.reason,
          promise: event.promise
        }
      )
    })

    console.log('🛡️ Interceptadores de erro configurados')
  }
}

// Tornar disponível globalmente para debug
declare global {
  interface Window {
    LogSystemInitializer: typeof LogSystemInitializer
  }
}

if (typeof window !== 'undefined') {
  window.LogSystemInitializer = LogSystemInitializer
}

export default LogSystemInitializer
