import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import logInterceptorPlugin from '@/plugins/logInterceptor'
import { initializeLogsSystem } from '@/setup/initializeLogsSystem'

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

