<template>
  <div class="security-view">
    <HamburgerMenu :show="true" />

    <div class="security-container">
      <div class="security-header">
        <div class="header-content">
          <h1 class="page-title">
            <Lock :size="28" />
            Segurança do Sistema
          </h1>
          <p class="page-subtitle">Configurações de segurança e monitoramento de ameaças</p>
        </div>
      </div>

      <!-- Alertas de Segurança -->
      <div class="security-alerts">
        <div class="alert-item warning">
          <AlertTriangle :size="20" />
          <div>
            <h3>Tentativas de Login Suspeitas</h3>
            <p>5 tentativas de login falhadas detectadas nas últimas 24h</p>
          </div>
        </div>
      </div>

      <!-- Configurações de Segurança -->
      <div class="settings-grid">
        <div class="setting-card">
          <h3>Política de Senhas</h3>
          <div class="setting-items">
            <div class="setting-item">
              <label>Comprimento mínimo</label>
              <input v-model="passwordPolicy.minLength" type="number" min="6" max="32" />
            </div>
            <div class="setting-item">
              <label>Exigir caracteres especiais</label>
              <input v-model="passwordPolicy.requireSpecial" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Exigir números</label>
              <input v-model="passwordPolicy.requireNumbers" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Exigir maiúsculas</label>
              <input v-model="passwordPolicy.requireUppercase" type="checkbox" />
            </div>
          </div>
        </div>

        <div class="setting-card">
          <h3>Configurações de Sessão</h3>
          <div class="setting-items">
            <div class="setting-item">
              <label>Tempo limite de sessão (minutos)</label>
              <input v-model="sessionSettings.timeout" type="number" min="5" max="480" />
            </div>
            <div class="setting-item">
              <label>Máximo de sessões simultâneas</label>
              <input v-model="sessionSettings.maxConcurrent" type="number" min="1" max="10" />
            </div>
          </div>
        </div>

        <div class="setting-card">
          <h3>Autenticação Dois Fatores</h3>
          <div class="setting-items">
            <div class="setting-item">
              <label>Forçar 2FA para administradores</label>
              <input v-model="twoFactorSettings.forceForAdmins" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Permitir 2FA via SMS</label>
              <input v-model="twoFactorSettings.allowSMS" type="checkbox" />
            </div>
            <div class="setting-item">
              <label>Permitir 2FA via aplicativo</label>
              <input v-model="twoFactorSettings.allowApp" type="checkbox" />
            </div>
          </div>
        </div>

        <div class="setting-card">
          <h3>Controle de Acesso</h3>
          <div class="setting-items">
            <div class="setting-item">
              <label>Bloqueio por tentativas (quantidade)</label>
              <input v-model="accessControl.maxFailedAttempts" type="number" min="3" max="10" />
            </div>
            <div class="setting-item">
              <label>Duração do bloqueio (minutos)</label>
              <input v-model="accessControl.lockoutDuration" type="number" min="5" max="1440" />
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Salvar -->
      <div class="actions">
        <button @click="saveSecuritySettings" class="btn-primary">
          <Save :size="20" />
          Salvar Configurações
        </button>
      </div>

      <!-- Log de Segurança -->
      <div class="security-log">
        <h2>Log de Eventos de Segurança</h2>
        <div class="log-list">
          <div v-for="log in securityLogs" :key="log.id" class="log-item" :class="log.type">
            <div class="log-icon">
              <AlertCircle v-if="log.type === 'threat'" :size="16" />
              <Shield v-else-if="log.type === 'blocked'" :size="16" />
              <Key v-else :size="16" />
            </div>
            <div class="log-content">
              <div class="log-message">{{ log.message }}</div>
              <div class="log-time">{{ formatDate(log.timestamp) }}</div>
            </div>
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
import { Lock, AlertTriangle, Save, AlertCircle, Shield, Key } from 'lucide-vue-next'

const passwordPolicy = ref({
  minLength: 8,
  requireSpecial: true,
  requireNumbers: true,
  requireUppercase: true
})

const sessionSettings = ref({
  timeout: 30,
  maxConcurrent: 3
})

const twoFactorSettings = ref({
  forceForAdmins: true,
  allowSMS: true,
  allowApp: true
})

const accessControl = ref({
  maxFailedAttempts: 5,
  lockoutDuration: 15
})

const securityLogs = ref([
  {
    id: 1,
    message: 'Tentativa de login com credenciais inválidas bloqueada',
    timestamp: new Date('2024-01-20T10:30:00'),
    type: 'blocked'
  },
  {
    id: 2,
    message: 'Login bem-sucedido de novo dispositivo detectado',
    timestamp: new Date('2024-01-20T10:25:00'),
    type: 'info'
  },
  {
    id: 3,
    message: 'Possível ataque de força bruta detectado',
    timestamp: new Date('2024-01-20T10:20:00'),
    type: 'threat'
  }
])

function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

function saveSecuritySettings() {
  alert('Configurações de segurança salvas com sucesso!')
}
</script>

<style scoped>
.security-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.security-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.security-header {
  margin-bottom: 2rem;
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

.security-alerts {
  margin-bottom: 2rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.alert-item.warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
}

.alert-item h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.alert-item p {
  margin: 0;
  font-size: 0.9rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

.setting-item input[type="number"],
.setting-item input[type="text"] {
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

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
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

.security-log {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.security-log h2 {
  margin: 0 0 1rem 0;
  color: var(--theme-text-primary);
  font-size: 1.25rem;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.log-item.threat {
  background: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

.log-item.blocked {
  background: rgba(245, 158, 11, 0.1);
  border-left-color: #f59e0b;
}

.log-item.info {
  background: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
}

.log-icon {
  color: var(--theme-text-secondary);
}

.log-content {
  flex: 1;
}

.log-message {
  color: var(--theme-text-primary);
  font-weight: 500;
}

.log-time {
  color: var(--theme-text-secondary);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .security-view {
    padding-left: 0;
  }

  .security-container {
    padding: 1rem;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>