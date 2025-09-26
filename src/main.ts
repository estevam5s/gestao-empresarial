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
