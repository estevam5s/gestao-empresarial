<template>
  <div class="backup-view">
    <HamburgerMenu :show="true" />

    <div class="backup-container">
      <div class="backup-header">
        <div class="header-content">
          <h1 class="page-title">
            <HardDrive :size="28" />
            Backup e Restauração
          </h1>
          <p class="page-subtitle">Gerencie backups automáticos e manuais do sistema</p>
        </div>
        <div class="header-actions">
          <button @click="createBackup" class="btn-primary" :disabled="isCreatingBackup">
            <Save :size="20" />
            {{ isCreatingBackup ? 'Criando...' : 'Criar Backup' }}
          </button>
          <button @click="refreshBackups" class="btn-secondary">
            <RefreshCw :size="20" />
            Atualizar
          </button>
        </div>
      </div>

      <!-- Status do Sistema -->
      <div class="status-section">
        <div class="status-card healthy">
          <div class="status-icon">
            <CheckCircle :size="24" />
          </div>
          <div class="status-content">
            <h3>Sistema Saudável</h3>
            <p>Último backup: {{ formatDate(lastBackup) }}</p>
          </div>
        </div>
        <div class="status-metrics">
          <div class="metric">
            <div class="metric-value">{{ systemStats.totalSize }}</div>
            <div class="metric-label">Tamanho do BD</div>
          </div>
          <div class="metric">
            <div class="metric-value">{{ systemStats.tables }}</div>
            <div class="metric-label">Tabelas</div>
          </div>
          <div class="metric">
            <div class="metric-value">{{ systemStats.records }}</div>
            <div class="metric-label">Registros</div>
          </div>
        </div>
      </div>

      <!-- Configurações de Backup Automático -->
      <div class="settings-section">
        <h2>Configurações de Backup Automático</h2>
        <div class="settings-grid">
          <div class="setting-item">
            <label>Frequência</label>
            <select v-model="backupSettings.frequency">
              <option value="daily">Diário</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Horário</label>
            <input v-model="backupSettings.time" type="time" />
          </div>
          <div class="setting-item">
            <label>Retenção (dias)</label>
            <input v-model="backupSettings.retention" type="number" min="1" max="365" />
          </div>
          <div class="setting-item">
            <label>Compressão</label>
            <select v-model="backupSettings.compression">
              <option value="none">Sem compressão</option>
              <option value="gzip">GZIP</option>
              <option value="bzip2">BZIP2</option>
            </select>
          </div>
        </div>
        <div class="setting-actions">
          <button @click="saveSettings" class="btn-primary">
            <Settings :size="16" />
            Salvar Configurações
          </button>
        </div>
      </div>

      <!-- Lista de Backups -->
      <div class="backups-section">
        <h2>Backups Existentes</h2>
        <div class="backups-list">
          <div v-for="backup in backups" :key="backup.id" class="backup-item">
            <div class="backup-info">
              <div class="backup-icon" :class="backup.type">
                <Database v-if="backup.type === 'full'" :size="20" />
                <Package v-else :size="20" />
              </div>
              <div class="backup-details">
                <div class="backup-name">{{ backup.name }}</div>
                <div class="backup-metadata">
                  <span>{{ formatDate(backup.created_at) }}</span>
                  <span>{{ backup.size }}</span>
                  <span>{{ backup.type === 'full' ? 'Backup Completo' : 'Backup Incremental' }}</span>
                </div>
              </div>
            </div>
            <div class="backup-actions">
              <button @click="downloadBackup(backup)" class="btn-icon download" title="Download">
                <Download :size="16" />
              </button>
              <button @click="restoreBackup(backup)" class="btn-icon restore" title="Restaurar">
                <RotateCcw :size="16" />
              </button>
              <button @click="deleteBackup(backup)" class="btn-icon delete" title="Excluir">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação de Restauração -->
      <Teleport to="body">
        <div v-if="showRestoreModal" class="modal-overlay" @click="closeRestoreModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>Confirmar Restauração</h2>
              <button @click="closeRestoreModal" class="close-btn">
                <X :size="20" />
              </button>
            </div>
            <div class="modal-body">
              <div class="warning-box">
                <AlertTriangle :size="24" />
                <div>
                  <h3>Atenção!</h3>
                  <p>Esta ação irá substituir todos os dados atuais pelos dados do backup selecionado. Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              <div class="restore-info">
                <p><strong>Backup:</strong> {{ restoreTarget?.name }}</p>
                <p><strong>Data:</strong> {{ formatDate(restoreTarget?.created_at) }}</p>
                <p><strong>Tamanho:</strong> {{ restoreTarget?.size }}</p>
              </div>
              <div class="confirmation-input">
                <label>Digite "CONFIRMAR" para prosseguir:</label>
                <input v-model="confirmationText" type="text" placeholder="CONFIRMAR" />
              </div>
            </div>
            <div class="modal-actions">
              <button @click="closeRestoreModal" class="btn-secondary">Cancelar</button>
              <button
                @click="confirmRestore"
                :disabled="confirmationText !== 'CONFIRMAR'"
                class="btn-danger"
              >
                Restaurar Backup
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import {
  HardDrive, Save, RefreshCw, CheckCircle, Settings, Database, Package,
  Download, RotateCcw, Trash2, X, AlertTriangle
} from 'lucide-vue-next'

// Estados reativos
const isCreatingBackup = ref(false)
const showRestoreModal = ref(false)
const restoreTarget = ref<any>(null)
const confirmationText = ref('')

const lastBackup = ref(new Date('2024-01-20T02:00:00'))

const systemStats = ref({
  totalSize: '256 MB',
  tables: 15,
  records: '12.5K'
})

const backupSettings = ref({
  frequency: 'daily',
  time: '02:00',
  retention: 30,
  compression: 'gzip'
})

const backups = ref([
  {
    id: 1,
    name: 'backup_2024_01_20_020000.sql.gz',
    created_at: new Date('2024-01-20T02:00:00'),
    size: '45.2 MB',
    type: 'full',
    status: 'completed'
  },
  {
    id: 2,
    name: 'backup_2024_01_19_020000.sql.gz',
    created_at: new Date('2024-01-19T02:00:00'),
    size: '44.8 MB',
    type: 'full',
    status: 'completed'
  },
  {
    id: 3,
    name: 'backup_2024_01_18_020000.sql.gz',
    created_at: new Date('2024-01-18T02:00:00'),
    size: '44.1 MB',
    type: 'full',
    status: 'completed'
  },
  {
    id: 4,
    name: 'backup_incremental_2024_01_20_140000.sql.gz',
    created_at: new Date('2024-01-20T14:00:00'),
    size: '2.3 MB',
    type: 'incremental',
    status: 'completed'
  }
])

// Métodos
function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

async function createBackup() {
  isCreatingBackup.value = true

  // Simular criação de backup
  setTimeout(() => {
    const newBackup = {
      id: Math.max(...backups.value.map(b => b.id)) + 1,
      name: `backup_manual_${format(new Date(), 'yyyy_MM_dd_HHmmss')}.sql.gz`,
      created_at: new Date(),
      size: `${(Math.random() * 50 + 40).toFixed(1)} MB`,
      type: 'full',
      status: 'completed'
    }
    backups.value.unshift(newBackup)
    lastBackup.value = new Date()
    isCreatingBackup.value = false
    alert('Backup criado com sucesso!')
  }, 3000)
}

function refreshBackups() {
  // Implementar atualização da lista
  alert('Lista de backups atualizada!')
}

function saveSettings() {
  // Implementar salvamento das configurações
  alert('Configurações salvas com sucesso!')
}

function downloadBackup(backup: any) {
  // Implementar download do backup
  alert(`Downloading backup: ${backup.name}`)
}

function restoreBackup(backup: any) {
  restoreTarget.value = backup
  showRestoreModal.value = true
}

function closeRestoreModal() {
  showRestoreModal.value = false
  restoreTarget.value = null
  confirmationText.value = ''
}

function confirmRestore() {
  if (confirmationText.value === 'CONFIRMAR') {
    // Implementar restauração
    alert(`Restaurando backup: ${restoreTarget.value.name}`)
    closeRestoreModal()
  }
}

function deleteBackup(backup: any) {
  if (confirm(`Excluir backup ${backup.name}?`)) {
    const index = backups.value.findIndex(b => b.id === backup.id)
    if (index !== -1) {
      backups.value.splice(index, 1)
      alert('Backup excluído com sucesso!')
    }
  }
}

onMounted(() => {
  // Inicializar componente
})
</script>

<style scoped>
.backup-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.backup-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.backup-header {
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
  flex-wrap: wrap;
}

.status-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  margin-bottom: 2rem;
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.status-card.healthy .status-icon {
  background: #16a34a;
}

.status-content h3 {
  margin: 0 0 0.25rem 0;
  color: var(--theme-text-primary);
  font-size: 1.1rem;
}

.status-content p {
  margin: 0;
  color: var(--theme-text-secondary);
  font-size: 0.9rem;
}

.status-metrics {
  display: flex;
  gap: 2rem;
}

.metric {
  text-align: center;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--theme-text-primary);
}

.metric-label {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
  margin-top: 0.25rem;
}

.settings-section, .backups-section {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.settings-section h2, .backups-section h2 {
  margin: 0 0 1.5rem 0;
  color: var(--theme-text-primary);
  font-size: 1.25rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-item label {
  font-weight: 600;
  color: var(--theme-text-primary);
  font-size: 0.9rem;
}

.setting-item input,
.setting-item select {
  padding: 0.75rem;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-background);
  color: var(--theme-text-primary);
  font-size: 0.9rem;
}

.setting-item input:focus,
.setting-item select:focus {
  outline: none;
  border-color: var(--theme-primary);
}

.setting-actions {
  display: flex;
  justify-content: flex-end;
}

.backups-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--theme-background);
  border-radius: 12px;
  border: 1px solid var(--theme-border);
}

.backup-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.backup-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.backup-icon.full {
  background: #3b82f6;
}

.backup-icon.incremental {
  background: #10b981;
}

.backup-details {
  flex: 1;
}

.backup-name {
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 0.25rem;
}

.backup-metadata {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
  flex-wrap: wrap;
}

.backup-actions {
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

.btn-icon.download { background: #dbeafe; color: #2563eb; }
.btn-icon.download:hover { background: #2563eb; color: white; }

.btn-icon.restore { background: #dcfce7; color: #16a34a; }
.btn-icon.restore:hover { background: #16a34a; color: white; }

.btn-icon.delete { background: #fecaca; color: #dc2626; }
.btn-icon.delete:hover { background: #dc2626; color: white; }

.btn-primary, .btn-secondary, .btn-danger {
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
}

.btn-primary {
  background: var(--theme-primary);
  color: white;
  border-color: var(--theme-primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--theme-primary-hover);
  border-color: var(--theme-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  border-color: var(--theme-border);
}

.btn-secondary:hover {
  background: var(--theme-border);
}

.btn-danger {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
  border-color: #b91c1c;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: var(--theme-surface);
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--theme-border);
}

.modal-header h2 {
  margin: 0;
  color: var(--theme-text-primary);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--theme-text-secondary);
  padding: 0.5rem;
  border-radius: 8px;
}

.close-btn:hover {
  background: var(--theme-border);
}

.modal-body {
  padding: 1.5rem;
}

.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.warning-box h3 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.warning-box p {
  margin: 0;
  color: #92400e;
}

.restore-info {
  background: var(--theme-background);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.restore-info p {
  margin: 0.25rem 0;
  color: var(--theme-text-primary);
}

.confirmation-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.confirmation-input label {
  font-weight: 600;
  color: var(--theme-text-primary);
}

.confirmation-input input {
  padding: 0.75rem;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-background);
  color: var(--theme-text-primary);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid var(--theme-border);
}

@media (max-width: 768px) {
  .backup-view {
    padding-left: 0;
  }

  .backup-container {
    padding: 1rem;
  }

  .backup-header {
    flex-direction: column;
    align-items: stretch;
  }

  .status-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .status-metrics {
    justify-content: space-around;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .backup-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .backup-actions {
    justify-content: center;
  }
}
</style>