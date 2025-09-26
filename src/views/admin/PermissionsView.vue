<template>
  <div class="permissions-view">
    <HamburgerMenu :show="true" />

    <div class="permissions-container">
      <div class="permissions-header">
        <div class="header-content">
          <h1 class="page-title">
            <Shield :size="28" />
            Controle de Permissões
          </h1>
          <p class="page-subtitle">Gerencie permissões e níveis de acesso por cargo</p>
        </div>
      </div>

      <!-- Matriz de Permissões -->
      <div class="permissions-matrix">
        <div class="matrix-header">
          <div class="role-column"></div>
          <div v-for="permission in permissions" :key="permission.id" class="permission-header">
            <div class="permission-name">{{ permission.name }}</div>
            <div class="permission-description">{{ permission.description }}</div>
          </div>
        </div>

        <div v-for="role in roles" :key="role.id" class="matrix-row">
          <div class="role-info">
            <div class="role-name">{{ role.name }}</div>
            <div class="role-description">{{ role.description }}</div>
          </div>
          <div
            v-for="permission in permissions"
            :key="`${role.id}-${permission.id}`"
            class="permission-cell"
          >
            <input
              :id="`${role.id}-${permission.id}`"
              v-model="rolePermissions[role.id][permission.id]"
              type="checkbox"
              class="permission-checkbox"
              @change="updatePermission(role.id, permission.id)"
            />
            <label :for="`${role.id}-${permission.id}`" class="checkbox-label">
              <Check v-if="rolePermissions[role.id][permission.id]" :size="16" />
            </label>
          </div>
        </div>
      </div>

      <!-- Resumo por Cargo -->
      <div class="roles-summary">
        <h2>Resumo de Permissões por Cargo</h2>
        <div class="summary-grid">
          <div v-for="role in roles" :key="role.id" class="role-summary-card">
            <h3>{{ role.name }}</h3>
            <div class="permissions-list">
              <div
                v-for="permission in getActivePermissions(role.id)"
                :key="permission.id"
                class="permission-badge"
              >
                {{ permission.name }}
              </div>
            </div>
            <div class="summary-stats">
              <span>{{ getActivePermissions(role.id).length }} de {{ permissions.length }} permissões</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão Salvar -->
      <div class="actions">
        <button @click="savePermissions" class="btn-primary">
          <Save :size="20" />
          Salvar Permissões
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import { Shield, Save, Check } from 'lucide-vue-next'

const roles = ref([
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso total ao sistema'
  },
  {
    id: 'manager',
    name: 'Gerente',
    description: 'Acesso a relatórios e gestão'
  },
  {
    id: 'stock_controller',
    name: 'Controlador de Estoque',
    description: 'Gestão de produtos e estoque'
  },
  {
    id: 'user',
    name: 'Usuário',
    description: 'Acesso básico ao sistema'
  }
])

const permissions = ref([
  {
    id: 'users_view',
    name: 'Ver Usuários',
    description: 'Visualizar lista de usuários'
  },
  {
    id: 'users_create',
    name: 'Criar Usuários',
    description: 'Criar novos usuários'
  },
  {
    id: 'users_edit',
    name: 'Editar Usuários',
    description: 'Modificar dados dos usuários'
  },
  {
    id: 'users_delete',
    name: 'Excluir Usuários',
    description: 'Remover usuários do sistema'
  },
  {
    id: 'inventory_view',
    name: 'Ver Estoque',
    description: 'Visualizar produtos e estoque'
  },
  {
    id: 'inventory_create',
    name: 'Criar Produtos',
    description: 'Adicionar novos produtos'
  },
  {
    id: 'inventory_edit',
    name: 'Editar Produtos',
    description: 'Modificar dados dos produtos'
  },
  {
    id: 'inventory_delete',
    name: 'Excluir Produtos',
    description: 'Remover produtos do sistema'
  },
  {
    id: 'reports_view',
    name: 'Ver Relatórios',
    description: 'Acessar relatórios e análises'
  },
  {
    id: 'financial_view',
    name: 'Ver Financeiro',
    description: 'Acessar dados financeiros'
  },
  {
    id: 'settings_manage',
    name: 'Gerenciar Config.',
    description: 'Alterar configurações do sistema'
  },
  {
    id: 'backup_manage',
    name: 'Gerenciar Backup',
    description: 'Criar e restaurar backups'
  }
])

// Matriz de permissões inicial
const rolePermissions = reactive({
  admin: {
    users_view: true,
    users_create: true,
    users_edit: true,
    users_delete: true,
    inventory_view: true,
    inventory_create: true,
    inventory_edit: true,
    inventory_delete: true,
    reports_view: true,
    financial_view: true,
    settings_manage: true,
    backup_manage: true
  },
  manager: {
    users_view: true,
    users_create: false,
    users_edit: false,
    users_delete: false,
    inventory_view: true,
    inventory_create: true,
    inventory_edit: true,
    inventory_delete: false,
    reports_view: true,
    financial_view: true,
    settings_manage: false,
    backup_manage: false
  },
  stock_controller: {
    users_view: false,
    users_create: false,
    users_edit: false,
    users_delete: false,
    inventory_view: true,
    inventory_create: true,
    inventory_edit: true,
    inventory_delete: false,
    reports_view: false,
    financial_view: false,
    settings_manage: false,
    backup_manage: false
  },
  user: {
    users_view: false,
    users_create: false,
    users_edit: false,
    users_delete: false,
    inventory_view: true,
    inventory_create: false,
    inventory_edit: false,
    inventory_delete: false,
    reports_view: false,
    financial_view: false,
    settings_manage: false,
    backup_manage: false
  }
})

function updatePermission(roleId: string, permissionId: string) {
  // A alteração já foi feita pelo v-model
  console.log(`Updated ${roleId} - ${permissionId}:`, rolePermissions[roleId][permissionId])
}

function getActivePermissions(roleId: string) {
  return permissions.value.filter(permission =>
    rolePermissions[roleId][permission.id]
  )
}

function savePermissions() {
  // Implementar salvamento das permissões
  console.log('Saving permissions:', rolePermissions)
  alert('Permissões salvas com sucesso!')
}
</script>

<style scoped>
.permissions-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.permissions-container {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.permissions-header {
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

.permissions-matrix {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
  overflow-x: auto;
}

.matrix-header {
  display: grid;
  grid-template-columns: 200px repeat(12, 120px);
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--theme-border);
}

.role-column {
  /* Espaço vazio para alinhamento */
}

.permission-header {
  text-align: center;
  padding: 0.5rem;
}

.permission-name {
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--theme-text-primary);
  margin-bottom: 0.25rem;
}

.permission-description {
  font-size: 0.7rem;
  color: var(--theme-text-secondary);
  line-height: 1.2;
}

.matrix-row {
  display: grid;
  grid-template-columns: 200px repeat(12, 120px);
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--theme-border);
}

.matrix-row:last-child {
  border-bottom: none;
}

.role-info {
  padding: 0.5rem;
}

.role-name {
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 0.25rem;
}

.role-description {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.permission-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.permission-checkbox {
  display: none;
}

.checkbox-label {
  width: 24px;
  height: 24px;
  border: 2px solid var(--theme-border);
  border-radius: 6px;
  background: var(--theme-background);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-checkbox:checked + .checkbox-label {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
  color: white;
}

.checkbox-label:hover {
  border-color: var(--theme-primary);
}

.roles-summary {
  background: var(--theme-surface);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.roles-summary h2 {
  margin: 0 0 1.5rem 0;
  color: var(--theme-text-primary);
  font-size: 1.25rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.role-summary-card {
  background: var(--theme-background);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--theme-border);
}

.role-summary-card h3 {
  margin: 0 0 0.75rem 0;
  color: var(--theme-text-primary);
  font-size: 1rem;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.permission-badge {
  background: var(--theme-primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
}

.summary-stats {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
  font-style: italic;
}

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

@media (max-width: 1200px) {
  .permissions-matrix {
    overflow-x: scroll;
  }

  .matrix-header,
  .matrix-row {
    min-width: 1400px;
  }
}

@media (max-width: 768px) {
  .permissions-view {
    padding-left: 0;
  }

  .permissions-container {
    padding: 1rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>