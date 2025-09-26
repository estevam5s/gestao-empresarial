/**
 * Plugin para inicializar o sistema de interceptação de logs
 */

import { App } from 'vue'
import { logInterceptor } from '@/middleware/logInterceptor'
import { logService } from '@/services/logService'

export default {
  install(app: App) {
    // Registra o interceptador globalmente
    app.provide('logInterceptor', logInterceptor)

    // Adiciona propriedades globais para fácil acesso
    app.config.globalProperties.$logUserAction = logInterceptor.logUserAction.bind(logInterceptor)
    app.config.globalProperties.$logError = logInterceptor.logError.bind(logInterceptor)
    app.config.globalProperties.$logAuth = logInterceptor.logAuth.bind(logInterceptor)
    app.config.globalProperties.$logSecurity = logInterceptor.logSecurity.bind(logInterceptor)

    // Registra hooks de ciclo de vida da aplicação
    app.mixin({
      mounted() {
        // Log quando componentes são montados
        if (this.$options.name && this.$options.name !== 'RouterView') {
          logInterceptor.logUserAction(
            'component_mounted',
            'frontend',
            {
              component: this.$options.name,
              route: this.$route?.path
            }
          )
        }
      },

      errorCaptured(err: unknown, instance: any, info: string): boolean | void {
        // Captura erros em componentes
        logInterceptor.logError(err as Error, 'component_error', {
          component: instance?.$options.name,
          errorInfo: info,
          route: this.$route?.path
        })

        return false // Permite que o erro continue sendo propagado
      }
    })

    // Log de inicialização da aplicação
    logService.createLog({
      action: 'app_initialized',
      resource: 'application',
      details: {
        version: (import.meta as any).env?.VITE_APP_VERSION || '1.0.0',
        environment: (import.meta as any).env?.MODE,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString()
      },
      category: 'system',
      severity: 'info',
      status: 'success'
    })

    console.log('🚀 Sistema de logs avançado inicializado')
  }
}
