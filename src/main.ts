import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import logInterceptorPlugin from '@/plugins/logInterceptor'
import { initializeLogsSystem } from '@/setup/initializeLogsSystem'
// Import apenas para efeitos colaterais (expor em window)
import '@/utils/debugAvatar'
import LogSystemInitializer from '@/utils/initializeLogs'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(logInterceptorPlugin)

app.mount('#app')

// Initialize logs system after mounting
initializeLogsSystem({
  enableInterceptors: true,
  enableAutoCleanup: true,
  cleanupIntervalDays: 90,
  enablePerformanceMonitoring: true,
  enableSecurityAlerts: true,
  testSystem: false,
  createSampleData: false
})

// Inicializar sistema de logs avançado
LogSystemInitializer.autoInitialize()
LogSystemInitializer.setupAutoLogging()

// Debug tools disponíveis
console.log('🔧 Ferramentas de Debug disponíveis:')
console.log('   window.AvatarDebug.runFullDiagnostic() - Diagnóstico completo do sistema de avatar')
console.log('   window.AvatarDebug.syncCurrentAvatar() - Sincronizar avatar atual')
console.log('   window.AvatarDebug.checkAvatarColumn() - Verificar coluna avatar_url')
console.log('   window.AvatarDebug.checkAvatarBucket() - Verificar bucket no Supabase Storage')
console.log('   window.LogSystemInitializer.runFullDiagnostic() - Diagnóstico completo do sistema de logs')
console.log('   window.LogSystemInitializer.createSampleLogs() - Criar logs de exemplo')

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration.scope)

        // Verificar por atualizações periodicamente
        setInterval(() => {
          registration.update()
        }, 1000 * 60 * 60) // Verificar a cada hora

        // Notificar quando houver uma atualização disponível
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Nova versão disponível! Recarregue a página para atualizar.')
                // Você pode mostrar uma notificação ao usuário aqui
              }
            })
          }
        })
      })
      .catch((error) => {
        console.error('❌ Erro ao registrar Service Worker:', error)
      })
  })
}

// Detectar quando o app está sendo instalado
let deferredPrompt: any
window.addEventListener('beforeinstallprompt', (e) => {
  // Previne o prompt automático
  e.preventDefault()
  // Salva o evento para mostrar depois
  deferredPrompt = e
  console.log('📱 App pode ser instalado! Use o prompt para instalar.')

  // Opcional: Você pode criar um botão customizado para mostrar o prompt
  // deferredPrompt.prompt()
})

// Detectar quando o app foi instalado
window.addEventListener('appinstalled', () => {
  console.log('✅ App instalado com sucesso!')
  deferredPrompt = null
})
