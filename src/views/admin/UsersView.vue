<template>
  <div class="users-view">
    <HamburgerMenu :show="true" />

    <div class="users-container">
      <div class="users-header">
        <div class="header-content">
          <h1 class="page-title">
            <Users :size="28" />
            Gerenciamento de Usuários
          </h1>
          <p class="page-subtitle">Gerencie usuários, permissões e configurações de acesso</p>
        </div>
        <div class="header-actions">
          <button @click="showCreateUser = true" class="btn-primary">
            <UserPlus :size="20" />
            Novo Usuário
          </button>
          <button @click="exportUsers" class="btn-secondary">
            <Download :size="20" />
            Exportar
          </button>
        </div>
      </div>

      <!-- Filtros e Busca -->
      <div class="filters-section">
        <div class="search-box">
          <Search :size="20" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar usuários..."
            @input="filterUsers"
          />
        </div>
        <div class="filters">
          <select v-model="roleFilter" @change="filterUsers" class="filter-select">
            <option value="">Todos os Cargos</option>
            <option value="admin">Administrador</option>
            <option value="manager">Gerente</option>
            <option value="stock_controller">Controlador de Estoque</option>
            <option value="user">Usuário</option>
          </select>
          <select v-model="statusFilter" @change="filterUsers" class="filter-select">
            <option value="">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
          </select>
        </div>
      </div>

      <!-- Tabela de Usuários -->
      <div class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th @click="sortBy('name')" class="sortable">
                Nome
                <ChevronUp v-if="sortField === 'name' && sortOrder === 'asc'" :size="16" />
                <ChevronDown v-if="sortField === 'name' && sortOrder === 'desc'" :size="16" />
              </th>
              <th @click="sortBy('email')" class="sortable">
                Email
                <ChevronUp v-if="sortField === 'email' && sortOrder === 'asc'" :size="16" />
                <ChevronDown v-if="sortField === 'email' && sortOrder === 'desc'" :size="16" />
              </th>
              <th @click="sortBy('role')" class="sortable">
                Cargo
                <ChevronUp v-if="sortField === 'role' && sortOrder === 'asc'" :size="16" />
                <ChevronDown v-if="sortField === 'role' && sortOrder === 'desc'" :size="16" />
              </th>
              <th @click="sortBy('status')" class="sortable">
                Status
                <ChevronUp v-if="sortField === 'status' && sortOrder === 'asc'" :size="16" />
                <ChevronDown v-if="sortField === 'status' && sortOrder === 'desc'" :size="16" />
              </th>
              <th @click="sortBy('last_login')" class="sortable">
                Último Acesso
                <ChevronUp v-if="sortField === 'last_login' && sortOrder === 'asc'" :size="16" />
                <ChevronDown v-if="sortField === 'last_login' && sortOrder === 'desc'" :size="16" />
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="user-row">
              <td class="user-info">
                <div class="user-avatar">
                  <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.name" />
                  <User v-else :size="20" />
                </div>
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-id">#{{ user.id }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" :class="user.role">
                  {{ getRoleName(user.role) }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="user.status">
                  {{ getStatusName(user.status) }}
                </span>
              </td>
              <td>{{ formatDate(user.last_login) }}</td>
              <td class="actions">
                <button @click="editUser(user)" class="btn-icon edit" title="Editar">
                  <Edit :size="16" />
                </button>
                <button @click="toggleUserStatus(user)" class="btn-icon toggle" :title="user.status === 'active' ? 'Desativar' : 'Ativar'">
                  <UserCheck v-if="user.status === 'active'" :size="16" />
                  <UserX v-else :size="16" />
                </button>
                <button @click="resetPassword(user)" class="btn-icon reset" title="Resetar Senha">
                  <Key :size="16" />
                </button>
                <button @click="deleteUser(user)" class="btn-icon delete" title="Excluir">
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="currentPage = 1" :disabled="currentPage === 1" class="page-btn">
          <ChevronsLeft :size="16" />
        </button>
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
          <ChevronLeft :size="16" />
        </button>
        <span class="page-info">{{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
          <ChevronRight :size="16" />
        </button>
        <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="page-btn">
          <ChevronsRight :size="16" />
        </button>
      </div>

      <!-- Modal Criar/Editar Usuário -->
      <Teleport to="body">
        <div v-if="showCreateUser || showEditUser" class="modal-overlay" @click="closeModals">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2>{{ showCreateUser ? 'Criar Novo Usuário' : 'Editar Usuário' }}</h2>
              <button @click="closeModals" class="close-btn">
                <X :size="20" />
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveUser" class="user-form">
                <div class="form-group">
                  <label>Nome Completo</label>
                  <input v-model="userForm.name" type="text" required />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="userForm.email" type="email" required />
                </div>
                <div class="form-group" v-if="showCreateUser">
                  <label>Senha</label>
                  <input v-model="userForm.password" type="password" required />
                </div>
                <div class="form-group">
                  <label>Cargo</label>
                  <select v-model="userForm.role" required>
                    <option value="">Selecione um cargo</option>
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente</option>
                    <option value="stock_controller">Controlador de Estoque</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status</label>
                  <select v-model="userForm.status" required>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="suspended">Suspenso</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button type="button" @click="closeModals" class="btn-secondary">Cancelar</button>
                  <button type="submit" class="btn-primary">{{ showCreateUser ? 'Criar' : 'Salvar' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import HamburgerMenu from '@/components/HamburgerMenu.vue'
import {
  Users, UserPlus, Search, Download, Edit, Trash2, Key,
  UserCheck, UserX, User, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X
} from 'lucide-vue-next'

// Estados reativos
const searchTerm = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const sortField = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 10

const showCreateUser = ref(false)
const showEditUser = ref(false)
const editingUser = ref<any>(null)

const userForm = ref({
  id: null,
  name: '',
  email: '',
  password: '',
  role: '',
  status: 'active'
})

// Dados simulados de usuários
const allUsers = ref([
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    role: 'admin',
    status: 'active',
    avatar_url: null,
    last_login: new Date('2024-01-20T10:30:00'),
    created_at: new Date('2023-05-15')
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    role: 'manager',
    status: 'active',
    avatar_url: null,
    last_login: new Date('2024-01-19T14:20:00'),
    created_at: new Date('2023-06-20')
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro.costa@empresa.com',
    role: 'stock_controller',
    status: 'inactive',
    avatar_url: null,
    last_login: new Date('2024-01-15T09:45:00'),
    created_at: new Date('2023-07-10')
  },
  {
    id: 4,
    name: 'Ana Oliveira',
    email: 'ana.oliveira@empresa.com',
    role: 'user',
    status: 'suspended',
    avatar_url: null,
    last_login: new Date('2024-01-10T16:15:00'),
    created_at: new Date('2023-08-05')
  }
])

const filteredUsers = ref([...allUsers.value])

// Computed properties
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

// Métodos
function getRoleName(role: string): string {
  const roles: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    stock_controller: 'Controlador de Estoque',
    user: 'Usuário'
  }
  return roles[role] || role
}

function getStatusName(status: string): string {
  const statuses: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    suspended: 'Suspenso'
  }
  return statuses[status] || status
}

function formatDate(date: Date): string {
  if (!date) return '-'
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

function filterUsers() {
  let filtered = [...allUsers.value]

  // Filtro por texto
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    )
  }

  // Filtro por cargo
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Filtro por status
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  filteredUsers.value = filtered
  currentPage.value = 1
  sortUsers()
}

function sortBy(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  sortUsers()
}

function sortUsers() {
  filteredUsers.value.sort((a: any, b: any) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

function editUser(user: any) {
  editingUser.value = user
  userForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    status: user.status
  }
  showEditUser.value = true
}

function closeModals() {
  showCreateUser.value = false
  showEditUser.value = false
  editingUser.value = null
  userForm.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role: '',
    status: 'active'
  }
}

function saveUser() {
  if (showCreateUser.value) {
    // Criar novo usuário
    const newUser = {
      id: Math.max(...allUsers.value.map(u => u.id)) + 1,
      ...userForm.value,
      avatar_url: null,
      last_login: null,
      created_at: new Date()
    }
    allUsers.value.push(newUser)
  } else {
    // Editar usuário existente
    const index = allUsers.value.findIndex(u => u.id === userForm.value.id)
    if (index !== -1) {
      Object.assign(allUsers.value[index], userForm.value)
    }
  }

  filterUsers()
  closeModals()
}

function toggleUserStatus(user: any) {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

function resetPassword(user: any) {
  if (confirm(`Resetar senha de ${user.name}?`)) {
    alert('Email de reset de senha enviado!')
  }
}

function deleteUser(user: any) {
  if (confirm(`Excluir usuário ${user.name}?`)) {
    const index = allUsers.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      allUsers.value.splice(index, 1)
      filterUsers()
    }
  }
}

function exportUsers() {
  // Implementar exportação
  alert('Exportando usuários...')
}

onMounted(() => {
  filterUsers()
})
</script>

<style scoped>
.users-view {
  min-height: 100vh;
  background: var(--theme-background);
  padding-left: 80px;
}

.users-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.users-header {
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

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--theme-surface);
  border: 2px solid var(--theme-border);
  border-radius: 12px;
  padding: 0 1rem;
  flex: 1;
  min-width: 250px;
}

.search-box input {
  background: none;
  border: none;
  outline: none;
  padding: 0.75rem 0.5rem;
  font-size: 1rem;
  color: var(--theme-text-primary);
  flex: 1;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--theme-border);
  border-radius: 12px;
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  font-size: 0.9rem;
  min-width: 150px;
}

.users-table-container {
  background: var(--theme-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--theme-shadow);
  border: 1px solid var(--theme-border);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: var(--theme-background);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--theme-text-secondary);
  border-bottom: 2px solid var(--theme-border);
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.users-table th.sortable:hover {
  color: var(--theme-text-primary);
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--theme-border);
  vertical-align: middle;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--theme-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--theme-text-primary);
}

.user-id {
  font-size: 0.8rem;
  color: var(--theme-text-secondary);
}

.role-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.role-badge.admin { background: #fef3c7; color: #d97706; }
.role-badge.manager { background: #dbeafe; color: #2563eb; }
.role-badge.stock_controller { background: #dcfce7; color: #16a34a; }
.role-badge.user { background: #f3f4f6; color: #6b7280; }

.status-badge.active { background: #dcfce7; color: #16a34a; }
.status-badge.inactive { background: #f3f4f6; color: #6b7280; }
.status-badge.suspended { background: #fecaca; color: #dc2626; }

.actions {
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

.btn-icon.edit { background: #dbeafe; color: #2563eb; }
.btn-icon.edit:hover { background: #2563eb; color: white; }

.btn-icon.toggle { background: #dcfce7; color: #16a34a; }
.btn-icon.toggle:hover { background: #16a34a; color: white; }

.btn-icon.reset { background: #fef3c7; color: #d97706; }
.btn-icon.reset:hover { background: #d97706; color: white; }

.btn-icon.delete { background: #fecaca; color: #dc2626; }
.btn-icon.delete:hover { background: #dc2626; color: white; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--theme-primary);
  color: var(--theme-primary);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--theme-text-secondary);
  font-weight: 500;
}

.btn-primary, .btn-secondary {
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

.btn-primary:hover {
  background: var(--theme-primary-hover);
  border-color: var(--theme-primary-hover);
}

.btn-secondary {
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  border-color: var(--theme-border);
}

.btn-secondary:hover {
  background: var(--theme-border);
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
  max-height: 80vh;
  overflow: hidden;
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
  font-size: 1.25rem;
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

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--theme-text-primary);
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 2px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-background);
  color: var(--theme-text-primary);
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--theme-primary);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .users-view {
    padding-left: 0;
  }

  .users-container {
    padding: 1rem;
  }

  .users-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions > * {
    flex: 1;
  }

  .filters-section {
    flex-direction: column;
  }

  .search-box {
    min-width: unset;
  }

  .users-table-container {
    overflow-x: auto;
  }

  .users-table {
    min-width: 800px;
  }
}
</style>