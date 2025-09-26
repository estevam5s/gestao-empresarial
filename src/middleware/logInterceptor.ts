/**
 * Middleware de interceptação de logs para capturar automaticamente
 * todas as ações administrativas do sistema
 */

import { logService } from '@/services/logService'
import { authService } from '@/services/authService'

// Interface para o contexto de interceptação
export interface LogInterceptorContext {
  action: string
  resource: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  details?: Record<string, any>
  severity?: 'info' | 'warning' | 'error' | 'critical' | 'debug'
  category?: 'auth' | 'crud' | 'system' | 'security' | 'performance' | 'user' | 'api' | 'database' | 'command'
  resourceId?: string | number
  startTime?: number
}

class LogInterceptor {
  private isEnabled: boolean = true
  private pendingRequests = new Map<string, LogInterceptorContext>()

  constructor() {
    this.setupAxiosInterceptors()
    this.setupRouterInterceptors()
    this.setupWindowInterceptors()
  }

  /**
   * Ativa/desativa o interceptor
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Configura interceptadores do Axios para APIs
   */
  private setupAxiosInterceptors(): void {
    // Interceptar requisições HTTP
    if (typeof window !== 'undefined' && window.axios) {
      // Requisição
      window.axios.interceptors.request.use(
        (config: any) => {
          if (!this.isEnabled) return config

          const requestId = this.generateRequestId()
          const context: LogInterceptorContext = {
            action: `${config.method?.toUpperCase()}_${this.extractResourceFromUrl(config.url)}`,
            resource: this.extractResourceFromUrl(config.url),
            method: config.method?.toUpperCase(),
            startTime: Date.now(),
            category: this.categorizeRequest(config),
            severity: 'info',
            details: {
              url: config.url,
              method: config.method,
              headers: this.sanitizeHeaders(config.headers),
              params: config.params,
              data: this.sanitizeRequestData(config.data)
            }
          }

          this.pendingRequests.set(requestId, context)
          config.metadata = { requestId }

          return config
        },
        (error: any) => {
          this.logError('request_interceptor_error', error)
          return Promise.reject(error)
        }
      )

      // Resposta
      window.axios.interceptors.response.use(
        (response: any) => {
          if (!this.isEnabled) return response

          const requestId = response.config?.metadata?.requestId
          const context = this.pendingRequests.get(requestId)

          if (context && context.startTime) {
            const executionTime = Date.now() - context.startTime

            logService.createLog({
              action: context.action,
              resource: context.resource,
              resource_id: this.extractResourceId(response.config.url, response.data),
              details: {
                ...context.details,
                responseStatus: response.status,
                responseData: this.sanitizeResponseData(response.data),
                executionTime
              },
              category: context.category || 'api',
              severity: 'info',
              status: 'success',
              execution_time: executionTime
            })

            this.pendingRequests.delete(requestId)
          }

          return response
        },
        (error: any) => {
          if (!this.isEnabled) return Promise.reject(error)

          const requestId = error.config?.metadata?.requestId
          const context = this.pendingRequests.get(requestId)

          if (context && context.startTime) {
            const executionTime = Date.now() - context.startTime

            logService.createLog({
              action: context.action,
              resource: context.resource,
              details: {
                ...context.details,
                errorStatus: error.response?.status,
                errorMessage: error.message,
                errorData: error.response?.data,
                executionTime
              },
              category: context.category || 'api',
              severity: this.determineSeverityFromError(error),
              status: 'failed',
              execution_time: executionTime,
              error_message: error.message
            })

            this.pendingRequests.delete(requestId)
          }

          return Promise.reject(error)
        }
      )
    }
  }

  /**
   * Configura interceptadores de rota
   */
  private setupRouterInterceptors(): void {
    if (typeof window !== 'undefined') {
      // Interceptar mudanças de rota
      window.addEventListener('popstate', (event) => {
        if (!this.isEnabled) return

        this.logNavigation({
          action: 'route_navigation',
          resource: 'navigation',
          details: {
            to: window.location.pathname,
            method: 'popstate',
            state: event.state
          },
          category: 'user',
          severity: 'info'
        })
      })

      // Interceptar cliques em links
      document.addEventListener('click', (event) => {
        if (!this.isEnabled) return

        const target = event.target as HTMLElement
        const link = target.closest('a')

        if (link && link.href) {
          this.logNavigation({
            action: 'link_click',
            resource: 'navigation',
            details: {
              href: link.href,
              text: link.textContent?.trim(),
              target: link.target
            },
            category: 'user',
            severity: 'info'
          })
        }
      })
    }
  }

  /**
   * Configura interceptadores globais da janela
   */
  private setupWindowInterceptors(): void {
    if (typeof window !== 'undefined') {
      // Interceptar erros JavaScript
      window.addEventListener('error', (event) => {
        if (!this.isEnabled) return

        logService.createLog({
          action: 'javascript_error',
          resource: 'frontend',
          details: {
            message: event.message,
            filename: event.filename,
            line: event.lineno,
            column: event.colno,
            stack: event.error?.stack,
            userAgent: navigator.userAgent
          },
          category: 'system',
          severity: 'error',
          status: 'failed',
          error_message: event.message
        })
      })

      // Interceptar erros de Promise rejeitadas
      window.addEventListener('unhandledrejection', (event) => {
        if (!this.isEnabled) return

        logService.createLog({
          action: 'unhandled_promise_rejection',
          resource: 'frontend',
          details: {
            reason: event.reason,
            stack: event.reason?.stack,
            userAgent: navigator.userAgent
          },
          category: 'system',
          severity: 'error',
          status: 'failed',
          error_message: event.reason?.message || 'Unhandled Promise Rejection'
        })
      })

      // Interceptar mudanças de visibilidade da página
      document.addEventListener('visibilitychange', () => {
        if (!this.isEnabled) return

        logService.createLog({
          action: document.hidden ? 'page_hidden' : 'page_visible',
          resource: 'user_session',
          details: {
            visibilityState: document.visibilityState,
            timestamp: new Date().toISOString()
          },
          category: 'user',
          severity: 'info',
          status: 'success'
        })
      })

      // Interceptar beforeunload para sessões
      window.addEventListener('beforeunload', () => {
        if (!this.isEnabled) return

        logService.createLog({
          action: 'session_end',
          resource: 'user_session',
          details: {
            sessionDuration: Date.now() - (window.sessionStartTime || Date.now()),
            url: window.location.href,
            timestamp: new Date().toISOString()
          },
          category: 'user',
          severity: 'info',
          status: 'success'
        })
      })
    }
  }

  /**
   * Log de navegação
   */
  private logNavigation(context: LogInterceptorContext): void {
    logService.createLog({
      action: context.action,
      resource: context.resource,
      details: context.details,
      category: context.category || 'user',
      severity: context.severity || 'info',
      status: 'success'
    })
  }

  /**
   * Log de erro
   */
  private logError(action: string, error: any): void {
    logService.createLog({
      action,
      resource: 'system',
      details: {
        error: error.message,
        stack: error.stack,
        code: error.code
      },
      category: 'system',
      severity: 'error',
      status: 'failed',
      error_message: error.message
    })
  }

  /**
   * Extrai o recurso da URL
   */
  private extractResourceFromUrl(url: string): string {
    if (!url) return 'unknown'

    try {
      const path = url.split('?')[0]
      const segments = path.split('/').filter(Boolean)

      // Remove prefixos comuns de API
      if (segments[0] === 'api') segments.shift()
      if (segments[0] === 'v1') segments.shift()

      return segments[0] || 'root'
    } catch {
      return 'unknown'
    }
  }

  /**
   * Extrai ID do recurso
   */
  private extractResourceId(url: string, responseData: any): string | undefined {
    try {
      // Tenta extrair da URL
      const pathSegments = url.split('/').filter(Boolean)
      const lastSegment = pathSegments[pathSegments.length - 1]

      if (lastSegment && /^\d+$/.test(lastSegment)) {
        return lastSegment
      }

      // Tenta extrair da resposta
      if (responseData && typeof responseData === 'object') {
        return responseData.id || responseData._id || responseData.uuid
      }
    } catch {
      // Ignora erros
    }

    return undefined
  }

  /**
   * Categoriza a requisição
   */
  private categorizeRequest(config: any): string {
    const url = config.url?.toLowerCase() || ''
    const method = config.method?.toUpperCase() || ''

    if (url.includes('auth') || url.includes('login') || url.includes('logout')) {
      return 'auth'
    }

    if (url.includes('user') || url.includes('profile')) {
      return 'user'
    }

    if (method === 'GET') {
      return 'api'
    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return 'crud'
    }

    return 'api'
  }

  /**
   * Determina severidade do erro
   */
  private determineSeverityFromError(error: any): 'error' | 'critical' | 'warning' {
    const status = error.response?.status

    if (!status) return 'error'

    if (status >= 500) return 'critical'
    if (status >= 400 && status < 500) return 'error'

    return 'warning'
  }

  /**
   * Sanitiza cabeçalhos removendo dados sensíveis
   */
  private sanitizeHeaders(headers: any): any {
    if (!headers || typeof headers !== 'object') return {}

    const sanitized = { ...headers }
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key', 'x-auth-token']

    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[SANITIZED]'
      }
    })

    return sanitized
  }

  /**
   * Sanitiza dados da requisição
   */
  private sanitizeRequestData(data: any): any {
    if (!data) return data

    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch {
        return '[NON_JSON_DATA]'
      }
    }

    if (typeof data !== 'object') return data

    const sanitized = { ...data }
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential']

    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[SANITIZED]'
      }
    })

    return sanitized
  }

  /**
   * Sanitiza dados da resposta
   */
  private sanitizeResponseData(data: any): any {
    if (!data || typeof data !== 'object') return data

    const sanitized = { ...data }
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth']

    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[SANITIZED]'
      }
    })

    // Limita o tamanho dos dados de resposta
    const jsonString = JSON.stringify(sanitized)
    if (jsonString.length > 1000) {
      return {
        ...sanitized,
        _truncated: true,
        _originalSize: jsonString.length,
        _preview: jsonString.substring(0, 500) + '...'
      }
    }

    return sanitized
  }

  /**
   * Gera ID único para requisição
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Log manual de ação do usuário
   */
  public logUserAction(
    action: string,
    resource: string,
    details?: any,
    resourceId?: string | number
  ): void {
    if (!this.isEnabled) return

    logService.logUserAction(action, resource, details, resourceId)
  }

  /**
   * Log manual de erro
   */
  public logError(error: Error, context: string, details?: any): void {
    if (!this.isEnabled) return

    logService.logError(error, context, details)
  }

  /**
   * Log de autenticação
   */
  public logAuth(action: string, details?: any, success: boolean = true): void {
    if (!this.isEnabled) return

    logService.createLog({
      action,
      resource: 'authentication',
      details: {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      category: 'auth',
      severity: success ? 'info' : 'warning',
      status: success ? 'success' : 'failed'
    })
  }

  /**
   * Log de segurança
   */
  public logSecurity(action: string, details?: any, severity: 'warning' | 'error' | 'critical' = 'warning'): void {
    if (!this.isEnabled) return

    logService.createLog({
      action,
      resource: 'security',
      details: {
        ...details,
        userAgent: navigator.userAgent,
        ip: 'client-ip', // Seria obtido do servidor em produção
        timestamp: new Date().toISOString()
      },
      category: 'security',
      severity,
      status: 'success'
    })
  }

  /**
   * Limpa requisições pendentes
   */
  public cleanup(): void {
    this.pendingRequests.clear()
  }
}

// Instância singleton
export const logInterceptor = new LogInterceptor()

// Hook para usar no Vue
export function useLogInterceptor() {
  return {
    logUserAction: logInterceptor.logUserAction.bind(logInterceptor),
    logError: logInterceptor.logError.bind(logInterceptor),
    logAuth: logInterceptor.logAuth.bind(logInterceptor),
    logSecurity: logInterceptor.logSecurity.bind(logInterceptor),
    setEnabled: logInterceptor.setEnabled.bind(logInterceptor)
  }
}

// Extensão global do window para tempo de sessão
declare global {
  interface Window {
    sessionStartTime?: number
    axios?: any
  }
}

if (typeof window !== 'undefined') {
  window.sessionStartTime = Date.now()
}