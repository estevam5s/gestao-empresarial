<template>
  <div class="suppliers-container">
    <!-- Header -->
    <header class="suppliers-header">
      <div class="header-content">
        <div class="header-left">
          <h1>
            <Users :size="28" />
            Fornecedores
          </h1>
          <p>Gerencie seus fornecedores e parcerias comerciais</p>
        </div>
        <div class="header-actions">
          <div class="search-container">
            <Search :size="20" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar fornecedores..."
              class="search-input"
            />
          </div>
          <button @click="showAddModal = true" class="add-btn">
            <Plus :size="20" />
            Novo Fornecedor
          </button>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <Users :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ stats.total }}</h3>
            <p>Total de Fornecedores</p>
          </div>
        </div>

        <div class="stat-card active">
          <div class="stat-icon">
            <CheckCircle :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ stats.active }}</h3>
            <p>Fornecedores Ativos</p>
          </div>
        </div>

        <div class="stat-card inactive">
          <div class="stat-icon">
            <XCircle :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ stats.inactive }}</h3>
            <p>Fornecedores Inativos</p>
          </div>
        </div>

        <div class="stat-card categories">
          <div class="stat-icon">
            <Tag :size="24" />
          </div>
          <div class="stat-content">
            <h3>{{ Object.keys(stats.categories).length }}</h3>
            <p>Categorias</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="suppliers-main">
      <!-- Filtros -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Status:</label>
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Categoria:</label>
          <select v-model="categoryFilter" class="filter-select">
            <option value="">Todas</option>
            <option v-for="category in Object.keys(stats.categories)" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
          >
            <Grid3x3 :size="18" />
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
          >
            <List :size="18" />
          </button>
        </div>
      </div>

      <!-- Lista/Grid de Fornecedores -->
      <div class="suppliers-content">
        <div v-if="loading" class="loading-state">
          <Loader2 :size="32" class="animate-spin" />
          <p>Carregando fornecedores...</p>
        </div>

        <div v-else-if="filteredSuppliers.length === 0" class="empty-state">
          <Users :size="64" />
          <h3>Nenhum fornecedor encontrado</h3>
          <p>Adicione seu primeiro fornecedor para começar</p>
          <button @click="showAddModal = true" class="add-btn">
            <Plus :size="20" />
            Novo Fornecedor
          </button>
        </div>

        <div v-else>
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="suppliers-grid">
            <div
              v-for="supplier in filteredSuppliers"
              :key="supplier.id"
              class="supplier-card"
              :class="{ inactive: supplier.status === 'inactive' }"
            >
              <div class="card-header">
                <div class="supplier-info">
                  <h3>{{ supplier.name }}</h3>
                  <p v-if="supplier.contact">{{ supplier.contact }}</p>
                  <span class="category-tag" v-if="supplier.category">
                    {{ supplier.category }}
                  </span>
                </div>
                <div class="card-actions">
                  <button @click="editSupplier(supplier)" class="action-btn">
                    <Edit2 :size="16" />
                  </button>
                  <button @click="deleteSupplier(supplier.id)" class="action-btn delete">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>

              <div class="card-content">
                <div class="contact-info">
                  <div v-if="supplier.phone" class="contact-item">
                    <Phone :size="14" />
                    <span>{{ supplier.phone }}</span>
                  </div>
                  <div v-if="supplier.email" class="contact-item">
                    <Mail :size="14" />
                    <span>{{ supplier.email }}</span>
                  </div>
                  <div v-if="supplier.address" class="contact-item">
                    <MapPin :size="14" />
                    <span>{{ supplier.address }}</span>
                  </div>
                </div>

                <div class="card-footer">
                  <div class="status-badge" :class="supplier.status">
                    <div class="status-dot"></div>
                    {{ supplier.status === 'active' ? 'Ativo' : 'Inativo' }}
                  </div>
                  <div class="products-count">
                    <Package :size="14" />
                    {{ supplier.products_count }} produtos
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-else class="suppliers-table">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Produtos</th>
                  <th>Último Pedido</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="supplier in filteredSuppliers"
                  :key="supplier.id"
                  :class="{ inactive: supplier.status === 'inactive' }"
                >
                  <td>
                    <div class="supplier-info">
                      <strong>{{ supplier.name }}</strong>
                      <small v-if="supplier.contact">{{ supplier.contact }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="contact-info">
                      <div v-if="supplier.phone">{{ supplier.phone }}</div>
                      <div v-if="supplier.email">{{ supplier.email }}</div>
                    </div>
                  </td>
                  <td>
                    <span v-if="supplier.category" class="category-tag">
                      {{ supplier.category }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>
                    <div class="status-badge" :class="supplier.status">
                      <div class="status-dot"></div>
                      {{ supplier.status === 'active' ? 'Ativo' : 'Inativo' }}
                    </div>
                  </td>
                  <td>{{ supplier.products_count }}</td>
                  <td>
                    <span v-if="supplier.last_order">
                      {{ formatTimeAgo(new Date(supplier.last_order)) }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button @click="editSupplier(supplier)" class="action-btn">
                        <Edit2 :size="16" />
                      </button>
                      <button @click="deleteSupplier(supplier.id)" class="action-btn delete">
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal para Adicionar/Editar Fornecedor -->
    <Teleport to="body">
      <div v-if="showAddModal || editingSupplier" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2>
              {{ editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor' }}
            </h2>
            <button @click="closeModal" class="close-btn">
              <X :size="24" />
            </button>
          </div>

          <form @submit.prevent="saveSupplier" class="modal-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="name">Nome *</label>
                <input
                  id="name"
                  v-model="supplierForm.name"
                  type="text"
                  required
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div class="form-group">
                <label for="contact">Pessoa de Contato</label>
                <input
                  id="contact"
                  v-model="supplierForm.contact"
                  type="text"
                  placeholder="Nome do contato"
                />
              </div>

              <div class="form-group">
                <label for="phone">Telefone</label>
                <input
                  id="phone"
                  v-model="supplierForm.phone"
                  type="tel"
                  placeholder="(11) 9999-8888"
                />
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="supplierForm.email"
                  type="email"
                  placeholder="email@fornecedor.com"
                />
              </div>

              <div class="form-group full-width">
                <label for="address">Endereço</label>
                <input
                  id="address"
                  v-model="supplierForm.address"
                  type="text"
                  placeholder="Endereço completo"
                />
              </div>

              <div class="form-group">
                <label for="category">Categoria</label>
                <input
                  id="category"
                  v-model="supplierForm.category"
                  type="text"
                  placeholder="Ex: Alimentos, Bebidas, Limpeza"
                />
              </div>

              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" v-model="supplierForm.status">
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="submitting" class="btn-primary">
                <Loader2 v-if="submitting" :size="16" class="animate-spin" />
                {{ editingSupplier ? 'Atualizar' : 'Criar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { suppliersService, type Supplier, type CreateSupplierData } from '@/services/suppliersService'
import {
  Users, Plus, Search, CheckCircle, XCircle, Tag, Grid3x3, List,
  Edit2, Trash2, Phone, Mail, MapPin, Package, Loader2, X
} from 'lucide-vue-next'

// Estado reativo
const loading = ref(true)
const suppliers = ref<Supplier[]>([])
const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
  categories: {} as Record<string, number>
})

// Filtros e busca
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Modal e formulário
const showAddModal = ref(false)
const editingSupplier = ref<Supplier | null>(null)
const submitting = ref(false)
const supplierForm = ref<CreateSupplierData & { id?: string }>({
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  category: '',
  status: 'active'
})

// Computed
const filteredSuppliers = computed(() => {
  let filtered = suppliers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(supplier =>
      supplier.name.toLowerCase().includes(query) ||
      supplier.contact?.toLowerCase().includes(query) ||
      supplier.email?.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(supplier => supplier.status === statusFilter.value)
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(supplier => supplier.category === categoryFilter.value)
  }

  return filtered
})

// Métodos
async function loadData() {
  try {
    loading.value = true
    const [suppliersData, statsData] = await Promise.all([
      suppliersService.getSuppliers(),
      suppliersService.getSuppliersStats()
    ])

    suppliers.value = suppliersData
    stats.value = statsData
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

function formatTimeAgo(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
}

function editSupplier(supplier: Supplier) {
  editingSupplier.value = supplier
  supplierForm.value = {
    id: supplier.id,
    name: supplier.name,
    contact: supplier.contact || '',
    phone: supplier.phone || '',
    email: supplier.email || '',
    address: supplier.address || '',
    category: supplier.category || '',
    status: supplier.status
  }
}

async function saveSupplier() {
  try {
    submitting.value = true

    if (editingSupplier.value) {
      await suppliersService.updateSupplier(supplierForm.value as any)
    } else {
      await suppliersService.createSupplier(supplierForm.value)
    }

    await loadData()
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar fornecedor:', error)
    alert('Erro ao salvar fornecedor. Tente novamente.')
  } finally {
    submitting.value = false
  }
}

async function deleteSupplier(id: string) {
  if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return

  try {
    await suppliersService.deleteSupplier(id)
    await loadData()
  } catch (error) {
    console.error('Erro ao excluir fornecedor:', error)
    alert('Erro ao excluir fornecedor. Tente novamente.')
  }
}

function closeModal() {
  showAddModal.value = false
  editingSupplier.value = null
  supplierForm.value = {
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    category: '',
    status: 'active'
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.suppliers-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

/* Header */
.suppliers-header {
  background: white;
  padding: 32px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-left h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.header-left p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.3s ease;
}

.search-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input {
  background: none;
  border: none;
  outline: none;
  padding: 12px 8px;
  font-size: 14px;
  width: 300px;
  color: #1a202c;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
}

/* Estatísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-card.active .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-card.inactive .stat-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.stat-card.categories .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-content h3 {
  font-size: 28px;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.stat-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Main Content */
.suppliers-main {
  padding: 32px;
}

.filters-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.filter-select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.view-btn {
  background: transparent;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: white;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
}

.loading-state p,
.empty-state h3,
.empty-state p {
  margin: 16px 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Grid View */
.suppliers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.supplier-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.supplier-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.supplier-card.inactive {
  opacity: 0.7;
  border-color: #ef4444;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.supplier-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.supplier-info p {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.category-tag {
  display: inline-block;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e2e8f0;
}

.action-btn.delete:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.contact-info {
  margin-bottom: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  margin: 8px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #dc2626;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.products-count {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  font-size: 12px;
}

/* Table View */
.suppliers-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.suppliers-table table {
  width: 100%;
  border-collapse: collapse;
}

.suppliers-table th,
.suppliers-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.suppliers-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.suppliers-table tr:hover {
  background: #fafbfc;
}

.suppliers-table tr.inactive {
  opacity: 0.7;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.text-muted {
  color: #9ca3af;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
}

.modal-form {
  padding: 0 24px 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input,
.form-group select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.btn-secondary,
.btn-primary {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .suppliers-container {
    padding: 0;
  }

  .suppliers-header,
  .suppliers-main {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .filters-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .suppliers-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }
}
</style>