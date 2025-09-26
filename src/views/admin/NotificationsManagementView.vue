<template>
  <div class="notifications-view">
    <HamburgerMenu :show="true" />

    <div class="notifications-container">
      <div class="notifications-header">
        <div class="header-content">
          <h1 class="page-title">
            <Bell :size="28" />
            Gerenciamento de Notificações
          </h1>
          <p class="page-subtitle">Configure notificações automáticas do sistema</p>
        </div>
        <div class="header-actions">
          <button @click="sendTestNotification" class="btn-primary">
            <Send :size="20" />
            Enviar Teste
          </button>
        </div>
      </div>

      <!-- Configurações de Notificação -->
      <div class="settings-grid">
        <div class="setting-card">
          <h3>Email</h3>
          <div class="setting-items">
            <div class="setting-item">
              <label>Servidor SMTP</label>
              <input v-model="emailSettings.server" type="text" placeholder="smtp.empresa.com" />
            </div>
            <div class="setting-item">
              <label>Porta</label>
              <input v-model="emailSettings.port" type="number" placeholder="587" />
            </div>
            <div class="setting-item">
              <label>Email do remetente</label>
              <input v-model="emailSettings.from" type="email" placeholder="sistema@empresa.com" />
            </div>
            <div class="setting-item">
              <label>Usar SSL/TLS</label>
              <input v-model="emailSettings.useSSL" type="checkbox" />
            </div>
          </div>
        </div>

        <div class="setting-card">
          <h3>Notificações Automáticas</h3>
          <div class="setting-items">
            <div class="setting-item">
              <label>Estoque baixo</label>
              <input v-model="autoNotifications.lowStock" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Backup concluído</label>
              <input v-model="autoNotifications.backupCompleted" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Erro do sistema</label>
              <input v-model="autoNotifications.systemError" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Login suspeito</label>
              <input v-model="autoNotifications.suspiciousLogin" type="checkbox" />
            </div>
          </div>
        </div>
      </div>

      <!-- Histórico de Notificações -->
      <div class="notifications-history">
        <h2>Histórico de Notificações</h2>
        <div class="notifications-list">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item">
            <div class="notification-icon" :class="notification.type">
              <component :is="getNotificationIcon(notification.type)" :size="20" />
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-meta">
                <span>{{ formatDate(notification.sent_at) }}</span>
                <span>{{ notification.recipient }}</span>
                <span class="status" :class="notification.status">{{ getStatusText(notification.status) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Salvar -->
      <div class="actions">
        <button @click="saveNotificationSettings" class="btn-primary">
          <Save :size="20" />
          Salvar Configurações
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import { Bell, Send, Save, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-vue-next'

const emailSettings = ref({
  server: 'smtp.empresa.com',
  port: 587,
  from: 'sistema@empresa.com',
  useSSL: true
})

const autoNotifications = ref({
  lowStock: true,
  backupCompleted: true,
  systemError: true,
  suspiciousLogin: true
})

const notifications = ref([
  {
    id: 1,
    title: 'Backup Concluído',
    message: 'Backup automático realizado com sucesso em 20/01/2024',
    type: 'success',
    recipient: 'admin@empresa.com',
    sent_at: new Date('2024-01-20T02:15:00'),
    status: 'delivered'
  },
  {
    id: 2,
    title: 'Estoque Baixo',
    message: '5 produtos com estoque abaixo do mínimo',
    type: 'warning',
    recipient: 'estoque@empresa.com',
    sent_at: new Date('2024-01-19T15:30:00'),
    status: 'delivered'
  },
  {
    id: 3,
    title: 'Erro do Sistema',
    message: 'Falha na conexão com o banco de dados',
    type: 'error',
    recipient: 'admin@empresa.com',
    sent_at: new Date('2024-01-19T10:45:00'),
    status: 'failed'
  }
])

function getNotificationIcon(type: string) {
  const icons: Record<string, any> = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info
  }
  return icons[type] || Info
}

function getStatusText(status: string): string {
  const statuses: Record<string, string> = {
    delivered: 'Entregue',
    failed: 'Falhou',
    pending: 'Pendente'
  }
  return statuses[status] || status
}

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

function sendTestNotification() {
  alert('Notificação de teste enviada!')
}

function saveNotificationSettings() {
  alert('Configurações de notificação salvas com sucesso!')
}
</script>

<style scoped>
.notifications-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.notifications-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--theme-text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-content p {
  color: var(--theme-text-secondary);
  margin: 0;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.setting-card {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.setting-card h3 {
  margin: 0 0 1rem 0;
  color: var(--theme-text-primary);
  font-size: 1.1rem;
}

.setting-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-weight: 500;
  color: var(--theme-text-primary);
  font-size: 0.9rem;
}

.setting-item input[type="text"],
.setting-item input[type="email"],
.setting-item input[type="number"] {
  padding: 0.75rem;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-background);
  color: var(--theme-text-primary);
}

.setting-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.notifications-history {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.notifications-history h2 {
  margin: 0 0 1rem 0;
  color: var(--theme-text-primary);
  font-size: 1.25rem;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--theme-background);
  border-radius: 12px;
  border: 1px solid var(--theme-border);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.notification-icon.success { background: #16a34a; }
.notification-icon.warning { background: #f59e0b; }
.notification-icon.error { background: #ef4444; }
.notification-icon.info { background: #3b82f6; }

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 0.25rem;
}

.notification-message {
  color: var(--theme-text-secondary);
  margin-bottom: 0.5rem;
}

.notification-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.notification-meta .status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.status.delivered { background: #dcfce7; color: #16a34a; }
.status.failed { background: #fecaca; color: #dc2626; }
.status.pending { background: #fef3c7; color: #d97706; }

.actions {
  display: flex;
  justify-content: center;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid;
  background: var(--theme-primary);
  color: white;
  border-color: var(--theme-primary);
}

.btn-primary:hover {
  background: var(--theme-primary-hover);
  border-color: var(--theme-primary-hover);
}

@media (max-width: 768px) {
  .notifications-view {
    padding-left: 0;
  }

  .notifications-container {
    padding: 1rem;
  }

  .notifications-header {
    flex-direction: column;
    align-items: stretch;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .notification-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>