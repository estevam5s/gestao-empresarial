<template>
  <div class="settings-container">
    <header class="page-header">
      <div class="header-content">
        <h1>
          <Settings :size="28" />
          Configurações do App
        </h1>
        <button @click="saveAllSettings" :disabled="saving" class="btn-primary">
          <Save :size="18" />
          {{ saving ? 'Salvando...' : 'Salvar Tudo' }}
        </button>
      </div>
    </header>

    <div class="settings-content">
      <!-- Menu de Navegação -->
      <div class="settings-nav">
        <button
          v-for="section in settingSections"
          :key="section.id"
          @click="activeSection = section.id"
          :class="{ active: activeSection === section.id }"
          class="nav-item"
        >
          <component :is="section.icon" :size="18" />
          {{ section.title }}
        </button>
      </div>

      <!-- Conteúdo das Configurações -->
      <div class="settings-panel">

        <!-- Configurações Gerais -->
        <div v-if="activeSection === 'general'" class="section">
          <div class="section-header">
            <h2>
              <Globe :size="24" />
              Configurações Gerais
            </h2>
            <p>Configure as informações básicas do seu sistema</p>
          </div>

          <div class="setting-groups">
            <div class="setting-group">
              <h3>Informações da Empresa</h3>

              <div class="form-group">
                <label>Nome da Empresa:</label>
                <input
                  v-model="settings.general.companyName"
                  type="text"
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>CNPJ:</label>
                  <input
                    v-model="settings.general.cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div class="form-group">
                  <label>Telefone:</label>
                  <input
                    v-model="settings.general.phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Endereço:</label>
                <textarea
                  v-model="settings.general.address"
                  rows="3"
                  placeholder="Endereço completo da empresa"
                ></textarea>
              </div>
            </div>

            <div class="setting-group">
              <h3>Configurações de Sistema</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Moeda Padrão:</label>
                  <select v-model="settings.general.currency">
                    <option value="BRL">Real (R$)</option>
                    <option value="USD">Dólar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Fuso Horário:</label>
                  <select v-model="settings.general.timezone">
                    <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                    <option value="America/New_York">Nova York (GMT-4)</option>
                    <option value="Europe/London">Londres (GMT+0)</option>
                  </select>
                </div>
              </div>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.general.autoBackup"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Backup automático diário
                </label>
                <label>
                  <input
                    v-model="settings.general.notifications"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Receber notificações por email
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações de Estoque -->
        <div v-if="activeSection === 'inventory'" class="section">
          <div class="section-header">
            <h2>
              <Package :size="24" />
              Gestão de Estoque
            </h2>
            <p>Configure alertas e comportamentos do estoque</p>
          </div>

          <div class="setting-groups">
            <div class="setting-group">
              <h3>Alertas de Estoque</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Alerta de Estoque Baixo (%):</label>
                  <input
                    v-model.number="settings.inventory.lowStockThreshold"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="20"
                  />
                  <small>Percentual em relação ao estoque mínimo</small>
                </div>
                <div class="form-group">
                  <label>Dias para Expiração:</label>
                  <input
                    v-model.number="settings.inventory.expirationDays"
                    type="number"
                    min="1"
                    placeholder="30"
                  />
                  <small>Alertar produtos próximos ao vencimento</small>
                </div>
              </div>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.inventory.autoReorder"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Sugerir reposição automática
                </label>
                <label>
                  <input
                    v-model="settings.inventory.trackBatches"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Controlar lotes e validades
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3>Movimentações</h3>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.inventory.requireNotes"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Exigir observações nas movimentações
                </label>
                <label>
                  <input
                    v-model="settings.inventory.autoCalculateCost"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Calcular custo médio automaticamente
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações de Notificações -->
        <div v-if="activeSection === 'notifications'" class="section">
          <div class="section-header">
            <h2>
              <Bell :size="24" />
              Notificações
            </h2>
            <p>Configure quando e como receber alertas</p>
          </div>

          <div class="setting-groups">
            <div class="setting-group">
              <h3>Notificações por Email</h3>

              <div class="form-group">
                <label>Email para Notificações:</label>
                <input
                  v-model="settings.notifications.email"
                  type="email"
                  placeholder="admin@empresa.com"
                />
              </div>

              <div class="notification-settings">
                <h4>Receber notificações sobre:</h4>
                <div class="checkbox-group">
                  <label>
                    <input
                      v-model="settings.notifications.lowStock"
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    Produtos com estoque baixo
                  </label>
                  <label>
                    <input
                      v-model="settings.notifications.outOfStock"
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    Produtos em falta
                  </label>
                  <label>
                    <input
                      v-model="settings.notifications.expiringProducts"
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    Produtos próximos ao vencimento
                  </label>
                  <label>
                    <input
                      v-model="settings.notifications.systemUpdates"
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    Atualizações do sistema
                  </label>
                </div>
              </div>
            </div>

            <div class="setting-group">
              <h3>Frequência de Notificações</h3>

              <div class="form-group">
                <label>Resumo Diário:</label>
                <select v-model="settings.notifications.dailyReportTime">
                  <option value="08:00">08:00</option>
                  <option value="12:00">12:00</option>
                  <option value="18:00">18:00</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>

              <div class="form-group">
                <label>Relatório Semanal:</label>
                <select v-model="settings.notifications.weeklyReportDay">
                  <option value="monday">Segunda-feira</option>
                  <option value="friday">Sexta-feira</option>
                  <option value="disabled">Desabilitado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações de Segurança -->
        <div v-if="activeSection === 'security'" class="section">
          <div class="section-header">
            <h2>
              <Shield :size="24" />
              Segurança
            </h2>
            <p>Configure políticas de segurança e acesso</p>
          </div>

          <div class="setting-groups">
            <div class="setting-group">
              <h3>Sessões de Usuário</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Tempo Limite da Sessão (minutos):</label>
                  <input
                    v-model.number="settings.security.sessionTimeout"
                    type="number"
                    min="5"
                    max="1440"
                    placeholder="60"
                  />
                </div>
                <div class="form-group">
                  <label>Máximo de Tentativas de Login:</label>
                  <input
                    v-model.number="settings.security.maxLoginAttempts"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="3"
                  />
                </div>
              </div>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.security.requireStrongPassword"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Exigir senhas fortes
                </label>
                <label>
                  <input
                    v-model="settings.security.logUserActivity"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Registrar atividades dos usuários
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3>Backup e Recuperação</h3>

              <div class="form-group">
                <label>Frequência de Backup:</label>
                <select v-model="settings.security.backupFrequency">
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>

              <div class="form-group">
                <label>Retenção de Backups (dias):</label>
                <input
                  v-model.number="settings.security.backupRetention"
                  type="number"
                  min="7"
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações de Interface -->
        <div v-if="activeSection === 'interface'" class="section">
          <div class="section-header">
            <h2>
              <Palette :size="24" />
              Interface
            </h2>
            <p>Personalize a aparência do sistema</p>
          </div>

          <div class="setting-groups">
            <div class="setting-group">
              <h3>Aparência</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Tema:</label>
                  <select v-model="settings.interface.theme">
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Cor Principal:</label>
                  <select v-model="settings.interface.primaryColor">
                    <option value="blue">Azul</option>
                    <option value="green">Verde</option>
                    <option value="purple">Roxo</option>
                    <option value="red">Vermelho</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Densidade da Interface:</label>
                <div class="radio-group">
                  <label>
                    <input
                      v-model="settings.interface.density"
                      type="radio"
                      value="compact"
                    />
                    Compacta
                  </label>
                  <label>
                    <input
                      v-model="settings.interface.density"
                      type="radio"
                      value="normal"
                    />
                    Normal
                  </label>
                  <label>
                    <input
                      v-model="settings.interface.density"
                      type="radio"
                      value="comfortable"
                    />
                    Confortável
                  </label>
                </div>
              </div>
            </div>

            <div class="setting-group">
              <h3>Dashboard</h3>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.interface.showWelcome"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Exibir mensagem de boas-vindas
                </label>
                <label>
                  <input
                    v-model="settings.interface.showMetrics"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Mostrar métricas do sistema
                </label>
                <label>
                  <input
                    v-model="settings.interface.showRecentActivity"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Exibir atividades recentes
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Configurações Avançadas -->
        <div v-if="activeSection === 'advanced'" class="section">
          <div class="section-header">
            <h2>
              <Code :size="24" />
              Configurações Avançadas
            </h2>
            <p>Opções para usuários experientes</p>
          </div>

          <div class="setting-groups">
            <div class="setting-group">
              <h3>API e Integrações</h3>

              <div class="form-group">
                <label>Chave da API:</label>
                <div class="api-key-container">
                  <input
                    v-model="settings.advanced.apiKey"
                    :type="showApiKey ? 'text' : 'password'"
                    readonly
                    placeholder="••••••••••••••••••••"
                  />
                  <button @click="showApiKey = !showApiKey" type="button" class="btn-icon">
                    <Eye v-if="!showApiKey" :size="16" />
                    <EyeOff v-else :size="16" />
                  </button>
                  <button @click="generateApiKey" type="button" class="btn-secondary">
                    <RefreshCw :size="16" />
                    Gerar Nova
                  </button>
                </div>
              </div>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.advanced.enableApi"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Habilitar acesso via API
                </label>
                <label>
                  <input
                    v-model="settings.advanced.enableWebhooks"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Permitir webhooks
                </label>
              </div>
            </div>

            <div class="setting-group">
              <h3>Performance</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Cache TTL (segundos):</label>
                  <input
                    v-model.number="settings.advanced.cacheTtl"
                    type="number"
                    min="60"
                    placeholder="3600"
                  />
                </div>
                <div class="form-group">
                  <label>Limite de Consulta:</label>
                  <input
                    v-model.number="settings.advanced.queryLimit"
                    type="number"
                    min="10"
                    max="1000"
                    placeholder="100"
                  />
                </div>
              </div>

              <div class="checkbox-group">
                <label>
                  <input
                    v-model="settings.advanced.enableDebugMode"
                    type="checkbox"
                  />
                  <span class="checkmark"></span>
                  Modo debug (apenas desenvolvimento)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status de Salvamento -->
    <div v-if="saveStatus" :class="`save-status ${saveStatus.type}`">
      <CheckCircle v-if="saveStatus.type === 'success'" :size="16" />
      <AlertCircle v-else :size="16" />
      {{ saveStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// Icons
import {
  Settings, Save, Globe, Package, Bell, Shield, Palette, Code,
  Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle
} from 'lucide-vue-next'

// Types
interface SaveStatus {
  type: 'success' | 'error'
  message: string
}

// State
const saving = ref(false)
const activeSection = ref('general')
const showApiKey = ref(false)
const saveStatus = ref<SaveStatus | null>(null)

const settingSections = [
  { id: 'general', title: 'Geral', icon: Globe },
  { id: 'inventory', title: 'Estoque', icon: Package },
  { id: 'notifications', title: 'Notificações', icon: Bell },
  { id: 'security', title: 'Segurança', icon: Shield },
  { id: 'interface', title: 'Interface', icon: Palette },
  { id: 'advanced', title: 'Avançado', icon: Code }
]

const settings = reactive({
  general: {
    companyName: 'Pedacinho do Céu',
    cnpj: '',
    phone: '',
    address: '',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    autoBackup: true,
    notifications: true
  },
  inventory: {
    lowStockThreshold: 20,
    expirationDays: 30,
    autoReorder: false,
    trackBatches: false,
    requireNotes: false,
    autoCalculateCost: true
  },
  notifications: {
    email: '',
    lowStock: true,
    outOfStock: true,
    expiringProducts: true,
    systemUpdates: false,
    dailyReportTime: '08:00',
    weeklyReportDay: 'monday'
  },
  security: {
    sessionTimeout: 60,
    maxLoginAttempts: 3,
    requireStrongPassword: true,
    logUserActivity: true,
    backupFrequency: 'daily',
    backupRetention: 30
  },
  interface: {
    theme: 'light',
    primaryColor: 'blue',
    density: 'normal',
    showWelcome: true,
    showMetrics: true,
    showRecentActivity: true
  },
  advanced: {
    apiKey: 'sk_live_12345678901234567890',
    enableApi: false,
    enableWebhooks: false,
    cacheTtl: 3600,
    queryLimit: 100,
    enableDebugMode: false
  }
})

// Methods
async function saveAllSettings() {
  saving.value = true
  try {
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Salvar no localStorage (temporário)
    localStorage.setItem('appSettings', JSON.stringify(settings))

    showSaveStatus('success', 'Configurações salvas com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    showSaveStatus('error', 'Erro ao salvar configurações')
  } finally {
    saving.value = false
  }
}

function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'sk_live_'
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  settings.advanced.apiKey = result
  showSaveStatus('success', 'Nova chave API gerada!')
}

function showSaveStatus(type: 'success' | 'error', message: string) {
  saveStatus.value = { type, message }
  setTimeout(() => {
    saveStatus.value = null
  }, 3000)
}

function loadSettings() {
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    try {
      const parsedSettings = JSON.parse(saved)
      Object.assign(settings, parsedSettings)
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a202c;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.btn-primary, .btn-secondary, .btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f7fafc;
  color: #2d3748;
  border: 2px solid #e2e8f0;
  padding: 8px 12px;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-icon {
  background: transparent;
  border: 2px solid #e2e8f0;
  padding: 8px;
  color: #64748b;
}

.btn-icon:hover {
  background: #f8fafc;
  border-color: #cbd5e0;
}

.settings-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 32px;
}

.settings-nav {
  background: white;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 24px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
  text-align: left;
  margin-bottom: 4px;
}

.nav-item:hover {
  background: #f8fafc;
  color: #1a202c;
}

.nav-item.active {
  background: #667eea;
  color: white;
}

.settings-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.section {
  padding: 32px;
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a202c;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.section-header p {
  color: #64748b;
  margin: 0;
  font-size: 16px;
}

.setting-groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.setting-group {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.setting-group h3 {
  color: #1a202c;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.setting-group h4 {
  color: #4a5568;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 16px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group small {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #2d3748;
  font-weight: 500;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
}

.checkmark {
  position: relative;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #2d3748;
  font-weight: 500;
}

.radio-group input[type="radio"] {
  width: 16px;
  height: 16px;
  margin: 0;
}

.notification-settings {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.api-key-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.api-key-container input {
  flex: 1;
}

.save-status {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  z-index: 1000;
}

.save-status.success {
  background: #c6f6d5;
  color: #2f855a;
  border: 2px solid #9ae6b4;
}

.save-status.error {
  background: #fed7d7;
  color: #c53030;
  border: 2px solid #feb2b2;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 1024px) {
  .settings-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .settings-nav {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .section {
    padding: 24px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .radio-group {
    flex-direction: column;
    gap: 12px;
  }

  .api-key-container {
    flex-direction: column;
    align-items: stretch;
  }

  .settings-nav {
    grid-template-columns: 1fr;
  }
}
</style>