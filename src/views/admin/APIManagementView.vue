<template>
  <div class="api-view">
    <HamburgerMenu :show="true" />

    <div class="api-container">
      <div class="api-header">
        <div class="header-content">
          <h1 class="page-title">
            <Globe :size="28" />
            Gerenciamento de API
          </h1>
          <p class="page-subtitle">Gerencie chaves de API e integrações externas</p>
        </div>
        <div class="header-actions">
          <button @click="generateNewKey" class="btn-primary">
            <Plus :size="20" />
            Nova Chave API
          </button>
        </div>
      </div>

      <!-- Estatísticas da API -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <Key :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ apiStats.totalKeys }}</div>
            <div class="stat-label">Chaves Ativas</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <Activity :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ apiStats.requests }}</div>
            <div class="stat-label">Requests/Hora</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <CheckCircle :size="24" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ apiStats.uptime }}%</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>

      <!-- Lista de Chaves API -->
      <div class="api-keys-section">
        <h2>Chaves de API</h2>
        <div class="api-keys-list">
          <div v-for="key in apiKeys" :key="key.id" class="api-key-item">
            <div class="api-key-info">
              <div class="api-key-name">{{ key.name }}</div>
              <div class="api-key-id">{{ key.key }}</div>
              <div class="api-key-meta">
                <span>Criada em {{ formatDate(key.created_at) }}</span>
                <span>{{ key.requests }} requests</span>
                <span class="status" :class="key.status">{{ key.status === 'active' ? 'Ativa' : 'Inativa' }}</span>
              </div>
            </div>
            <div class="api-key-actions">
              <button @click="copyKey(key)" class="btn-icon copy" title="Copiar">
                <Copy :size="16" />
              </button>
              <button @click="toggleKey(key)" class="btn-icon toggle" :title="key.status === 'active' ? 'Desativar' : 'Ativar'">
                <Power :size="16" />
              </button>
              <button @click="deleteKey(key)" class="btn-icon delete" title="Excluir">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs de API -->
      <div class="api-logs-section">
        <h2>Logs de Requisições</h2>
        <div class="logs-list">
          <div v-for="log in apiLogs" :key="log.id" class="log-item">
            <div class="log-method" :class="log.method">{{ log.method }}</div>
            <div class="log-endpoint">{{ log.endpoint }}</div>
            <div class="log-status" :class="getStatusClass(log.status)">{{ log.status }}</div>
            <div class="log-time">{{ formatDate(log.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import { Globe, Plus, Key, Activity, CheckCircle, Copy, Power, Trash2 } from 'lucide-vue-next'

const apiStats = ref({
  totalKeys: 5,
  requests: 1247,
  uptime: 99.8
})

const apiKeys = ref([
  {
    id: 1,
    name: 'Integração Principal',
    key: 'sk_live_abcd1234567890efghijklmnop',
    created_at: new Date('2024-01-15'),
    requests: 15420,
    status: 'active'
  },
  {
    id: 2,
    name: 'App Mobile',
    key: 'sk_live_zyxw9876543210fedcba098765',
    created_at: new Date('2024-01-10'),
    requests: 8765,
    status: 'active'
  },
  {
    id: 3,
    name: 'Webhook Pagamentos',
    key: 'sk_live_qwer1234asdf5678zxcv9012mn',
    created_at: new Date('2024-01-05'),
    requests: 2341,
    status: 'inactive'
  }
])

const apiLogs = ref([
  {
    id: 1,
    method: 'GET',
    endpoint: '/api/v1/products',
    status: 200,
    timestamp: new Date('2024-01-20T10:30:00')
  },
  {
    id: 2,
    method: 'POST',
    endpoint: '/api/v1/orders',
    status: 201,
    timestamp: new Date('2024-01-20T10:29:45')
  },
  {
    id: 3,
    method: 'PUT',
    endpoint: '/api/v1/inventory/123',
    status: 200,
    timestamp: new Date('2024-01-20T10:29:30')
  },
  {
    id: 4,
    method: 'DELETE',
    endpoint: '/api/v1/products/456',
    status: 404,
    timestamp: new Date('2024-01-20T10:29:15')
  }
])

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

function generateNewKey() {
  const newKey = {
    id: Math.max(...apiKeys.value.map(k => k.id)) + 1,
    name: `Chave API ${new Date().getTime()}`,
    key: `sk_live_${Math.random().toString(36).substring(2, 30)}`,
    created_at: new Date(),
    requests: 0,
    status: 'active'
  }
  apiKeys.value.push(newKey)
  alert('Nova chave API gerada!')
}

function copyKey(key: any) {
  navigator.clipboard.writeText(key.key)
  alert('Chave copiada para a área de transferência!')
}

function toggleKey(key: any) {
  key.status = key.status === 'active' ? 'inactive' : 'active'
}

function deleteKey(key: any) {
  if (confirm(`Excluir chave API ${key.name}?`)) {
    const index = apiKeys.value.findIndex(k => k.id === key.id)
    if (index !== -1) {
      apiKeys.value.splice(index, 1)
    }
  }
}

function getStatusClass(status: number): string {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 400 && status < 500) return 'warning'
  if (status >= 500) return 'error'
  return 'info'
}
</script>

<style scoped>
.api-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.api-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.api-header {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--theme-surface);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--theme-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--theme-text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--theme-text-secondary);
}

.api-keys-section, .api-logs-section {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.api-keys-section h2, .api-logs-section h2 {
  margin: 0 0 1rem 0;
  color: var(--theme-text-primary);
  font-size: 1.25rem;
}

.api-keys-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.api-key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--theme-background);
  border-radius: 12px;
  border: 1px solid var(--theme-border);
}

.api-key-info {
  flex: 1;
}

.api-key-name {
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 0.25rem;
}

.api-key-id {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--theme-text-secondary);
  margin-bottom: 0.5rem;
}

.api-key-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.api-key-meta .status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.status.active { background: #dcfce7; color: #16a34a; }
.status.inactive { background: #f3f4f6; color: #6b7280; }

.api-key-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon.copy { background: #dbeafe; color: #2563eb; }
.btn-icon.copy:hover { background: #2563eb; color: white; }

.btn-icon.toggle { background: #dcfce7; color: #16a34a; }
.btn-icon.toggle:hover { background: #16a34a; color: white; }

.btn-icon.delete { background: #fecaca; color: #dc2626; }
.btn-icon.delete:hover { background: #dc2626; color: white; }

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-item {
  display: grid;
  grid-template-columns: 80px 1fr 80px 150px;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--theme-background);
  border-radius: 8px;
  border: 1px solid var(--theme-border);
  align-items: center;
}

.log-method {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: center;
}

.log-method.GET { background: #dcfce7; color: #16a34a; }
.log-method.POST { background: #dbeafe; color: #2563eb; }
.log-method.PUT { background: #fef3c7; color: #d97706; }
.log-method.DELETE { background: #fecaca; color: #dc2626; }

.log-endpoint {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--theme-text-primary);
}

.log-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
  text-align: center;
}

.log-status.success { background: #dcfce7; color: #16a34a; }
.log-status.warning { background: #fef3c7; color: #d97706; }
.log-status.error { background: #fecaca; color: #dc2626; }

.log-time {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
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
  .api-view {
    padding-left: 0;
  }

  .api-container {
    padding: 1rem;
  }

  .api-header {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .api-key-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .api-key-actions {
    justify-content: center;
  }

  .log-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>