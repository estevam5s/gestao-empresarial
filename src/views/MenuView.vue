<template>
  <div class="menu-container">
    <header class="page-header">
      <div class="header-content">
        <h1>
          <ChefHat :size="28" />
          Cardápio e Planejamento
        </h1>
        <div class="header-actions">
          <button @click="showAddItemModal = true" class="btn-primary">
            <Plus :size="18" />
            Novo Item
          </button>
          <button @click="showPlanningModal = true" class="btn-secondary">
            <Calendar :size="18" />
            Planejar Semana
          </button>
        </div>
      </div>
    </header>

    <!-- Filtros e Busca -->
    <div class="filters-section">
      <div class="search-box">
        <Search :size="18" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar itens do cardápio..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="categoryFilter" class="filter-select">
          <option value="">Todas as categorias</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.nome }}
          </option>
        </select>
        <select v-model="difficultyFilter" class="filter-select">
          <option value="">Todas as dificuldades</option>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Difícil</option>
        </select>
        <select v-model="availabilityFilter" class="filter-select">
          <option value="">Todos os itens</option>
          <option value="available">Disponíveis</option>
          <option value="unavailable">Indisponíveis</option>
        </select>
      </div>
    </div>

    <!-- Estatísticas Rápidas -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-icon menu">
          <ChefHat :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ menuItems.length }}</div>
          <div class="stat-label">Itens no Cardápio</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon available">
          <CheckCircle :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ availableItems }}</div>
          <div class="stat-label">Disponíveis</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon featured">
          <Star :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ featuredItems }}</div>
          <div class="stat-label">Em Destaque</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon cost">
          <DollarSign :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">R$ {{ averageCost.toFixed(2) }}</div>
          <div class="stat-label">Custo Médio</div>
        </div>
      </div>
    </div>

    <!-- Lista de Itens do Cardápio -->
    <div class="menu-grid">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando cardápio...</p>
      </div>

      <div v-else-if="filteredMenuItems.length === 0" class="empty-state">
        <ChefHat :size="48" />
        <h3>Nenhum item encontrado</h3>
        <p>Comece adicionando itens ao seu cardápio</p>
        <button @click="showAddItemModal = true" class="btn-primary">
          <Plus :size="18" />
          Novo Item
        </button>
      </div>

      <div v-else class="menu-list">
        <div
          v-for="item in filteredMenuItems"
          :key="item.id"
          class="menu-card"
          :class="{
            unavailable: !item.disponivel,
            featured: item.destaque,
            'high-popularity': item.score_popularidade > 70
          }"
        >
          <div class="menu-header">
            <div class="menu-info">
              <h3>{{ item.nome }}</h3>
              <div class="menu-category" v-if="item.categoria">
                <Tag :size="14" />
                {{ item.categoria.nome }}
              </div>
            </div>
            <div class="menu-badges">
              <span v-if="item.destaque" class="badge featured">
                <Star :size="12" />
                Destaque
              </span>
              <span :class="`badge difficulty ${item.dificuldade}`">
                {{ getDifficultyLabel(item.dificuldade) }}
              </span>
            </div>
          </div>

          <div class="menu-description" v-if="item.descricao">
            <p>{{ item.descricao }}</p>
          </div>

          <div class="menu-details">
            <div class="detail-row">
              <span class="label">Preço de Venda:</span>
              <span class="value price">R$ {{ formatCurrency(item.preco_venda) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Custo dos Ingredientes:</span>
              <span class="value">R$ {{ formatCurrency(item.custo_ingredientes) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Margem:</span>
              <span class="value profit">
                {{ getMarginPercentage(item.preco_venda, item.custo_ingredientes) }}%
              </span>
            </div>
          </div>

          <div class="menu-stats">
            <div class="stat">
              <Clock :size="16" />
              <span>{{ item.tempo_preparo || 0 }}min</span>
            </div>
            <div class="stat">
              <Users :size="16" />
              <span>{{ item.porcoes || 1 }} porção{{ item.porcoes > 1 ? 'ões' : '' }}</span>
            </div>
            <div class="stat">
              <TrendingUp :size="16" />
              <span>{{ item.score_popularidade || 0 }}% popular</span>
            </div>
          </div>

          <div class="menu-nutrition" v-if="item.calorias">
            <div class="nutrition-item">
              <span class="nutrition-label">Calorias:</span>
              <span class="nutrition-value">{{ item.calorias }}kcal</span>
            </div>
            <div class="nutrition-grid">
              <div v-if="item.proteina_g" class="nutrition-item">
                <span class="nutrition-label">Proteínas:</span>
                <span class="nutrition-value">{{ item.proteina_g }}g</span>
              </div>
              <div v-if="item.carboidratos_g" class="nutrition-item">
                <span class="nutrition-label">Carboidratos:</span>
                <span class="nutrition-value">{{ item.carboidratos_g }}g</span>
              </div>
              <div v-if="item.gordura_g" class="nutrition-item">
                <span class="nutrition-label">Gorduras:</span>
                <span class="nutrition-value">{{ item.gordura_g }}g</span>
              </div>
            </div>
          </div>

          <div class="menu-tags" v-if="item.tags && item.tags.length > 0">
            <span v-for="tag in item.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>

          <div class="menu-actions">
            <button @click="viewIngredients(item)" class="btn-ingredients">
              <Package :size="14" />
              Ingredientes
            </button>
            <button @click="editMenuItem(item)" class="btn-edit">
              <Edit :size="14" />
              Editar
            </button>
            <button
              @click="toggleAvailability(item)"
              :class="`btn-toggle ${item.disponivel ? 'deactivate' : 'activate'}`"
            >
              {{ item.disponivel ? 'Indisponibilizar' : 'Disponibilizar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar/Editar Item do Cardápio -->
    <div v-if="showAddItemModal" class="modal-overlay" @click="showAddItemModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2>{{ editingItem ? 'Editar Item' : 'Novo Item do Cardápio' }}</h2>
          <button @click="closeItemModal" class="modal-close">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="saveMenuItem" class="menu-form">
          <div class="form-sections">
            <!-- Informações Básicas -->
            <div class="form-section">
              <h3>Informações Básicas</h3>

              <div class="form-group">
                <label>Nome do Item:</label>
                <input
                  v-model="itemForm.nome"
                  type="text"
                  required
                  placeholder="Ex: Feijoada Completa"
                />
              </div>

              <div class="form-group">
                <label>Descrição:</label>
                <textarea
                  v-model="itemForm.descricao"
                  rows="3"
                  placeholder="Descrição detalhada do prato"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Categoria:</label>
                  <select v-model="itemForm.categoria_id">
                    <option value="">Selecione uma categoria</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.nome }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Dificuldade:</label>
                  <select v-model="itemForm.dificuldade" required>
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Preços e Custos -->
            <div class="form-section">
              <h3>Preços e Custos</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Preço de Venda (R$):</label>
                  <input
                    v-model.number="itemForm.preco_venda"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0,00"
                  />
                </div>
                <div class="form-group">
                  <label>Custo dos Ingredientes (R$):</label>
                  <input
                    v-model.number="itemForm.custo_ingredientes"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div class="margin-display" v-if="itemForm.preco_venda && itemForm.custo_ingredientes">
                <div class="margin-info">
                  <span class="margin-label">Margem de Lucro:</span>
                  <span class="margin-value">
                    {{ getMarginPercentage(itemForm.preco_venda, itemForm.custo_ingredientes) }}%
                  </span>
                </div>
                <div class="margin-amount">
                  <span>Lucro por porção: R$ {{ formatCurrency(itemForm.preco_venda - itemForm.custo_ingredientes) }}</span>
                </div>
              </div>
            </div>

            <!-- Detalhes do Preparo -->
            <div class="form-section">
              <h3>Detalhes do Preparo</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Tempo de Preparo (minutos):</label>
                  <input
                    v-model.number="itemForm.tempo_preparo"
                    type="number"
                    min="0"
                    placeholder="30"
                  />
                </div>
                <div class="form-group">
                  <label>Número de Porções:</label>
                  <input
                    v-model.number="itemForm.porcoes"
                    type="number"
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Score de Popularidade (0-100):</label>
                  <input
                    v-model.number="itemForm.score_popularidade"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                </div>
                <div class="form-group checkbox-group">
                  <label>
                    <input
                      v-model="itemForm.destaque"
                      type="checkbox"
                    />
                    Item em destaque
                  </label>
                  <label>
                    <input
                      v-model="itemForm.disponivel"
                      type="checkbox"
                    />
                    Disponível no cardápio
                  </label>
                </div>
              </div>
            </div>

            <!-- Informações Nutricionais -->
            <div class="form-section">
              <h3>Informações Nutricionais (Opcional)</h3>

              <div class="form-row">
                <div class="form-group">
                  <label>Calorias:</label>
                  <input
                    v-model.number="itemForm.calorias"
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>
                <div class="form-group">
                  <label>Proteínas (g):</label>
                  <input
                    v-model.number="itemForm.proteina_g"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Carboidratos (g):</label>
                  <input
                    v-model.number="itemForm.carboidratos_g"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                  />
                </div>
                <div class="form-group">
                  <label>Gorduras (g):</label>
                  <input
                    v-model.number="itemForm.gordura_g"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div class="form-section">
              <h3>Tags</h3>
              <div class="form-group">
                <label>Tags (separadas por vírgula):</label>
                <input
                  v-model="tagsInput"
                  type="text"
                  placeholder="Ex: vegetariano, sem glúten, picante"
                />
                <small>Digite as tags separadas por vírgula</small>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeItemModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Salvando...' : (editingItem ? 'Atualizar' : 'Adicionar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Planejamento Semanal -->
    <div v-if="showPlanningModal" class="modal-overlay" @click="showPlanningModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h2>Planejamento Semanal</h2>
          <button @click="showPlanningModal = false" class="modal-close">
            <X :size="20" />
          </button>
        </div>

        <div class="planning-content">
          <p>Funcionalidade de planejamento semanal será implementada em breve!</p>
          <p>Aqui você poderá:</p>
          <ul>
            <li>Planejar o cardápio da semana</li>
            <li>Definir itens para cada dia</li>
            <li>Calcular ingredientes necessários</li>
            <li>Gerar lista de compras</li>
          </ul>
        </div>

        <div class="modal-actions">
          <button @click="showPlanningModal = false" class="btn-primary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase, DB_TABLES } from '@/config/supabase'
import { useAuthStore } from '@/stores/auth'

// Icons
import {
  ChefHat, Plus, Calendar, Search, Tag, CheckCircle, Star, DollarSign,
  Clock, Users, TrendingUp, Package, Edit, X
} from 'lucide-vue-next'

const authStore = useAuthStore()

// Types
interface MenuItem {
  id: string
  nome: string
  descricao?: string
  categoria_id?: string
  categoria?: { nome: string }
  preco_venda: number
  custo_ingredientes: number
  tempo_preparo: number
  dificuldade: 'easy' | 'medium' | 'hard'
  porcoes: number
  score_popularidade: number
  disponivel: boolean
  destaque: boolean
  calorias?: number
  proteina_g?: number
  carboidratos_g?: number
  gordura_g?: number
  tags?: string[]
  ativo: boolean
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  nome: string
  icone: string
  ativo: boolean
}

// State
const menuItems = ref<MenuItem[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const difficultyFilter = ref('')
const availabilityFilter = ref('')
const showAddItemModal = ref(false)
const showPlanningModal = ref(false)
const editingItem = ref<MenuItem | null>(null)
const tagsInput = ref('')

const itemForm = ref({
  nome: '',
  descricao: '',
  categoria_id: '',
  preco_venda: 0,
  custo_ingredientes: 0,
  tempo_preparo: 30,
  dificuldade: 'medium' as 'easy' | 'medium' | 'hard',
  porcoes: 1,
  score_popularidade: 0,
  disponivel: true,
  destaque: false,
  calorias: null as number | null,
  proteina_g: null as number | null,
  carboidratos_g: null as number | null,
  gordura_g: null as number | null
})

// Computed
const filteredMenuItems = computed(() => {
  let filtered = menuItems.value

  // Filtro por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.nome.toLowerCase().includes(query) ||
      item.descricao?.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filtro por categoria
  if (categoryFilter.value) {
    filtered = filtered.filter(item => item.categoria_id === categoryFilter.value)
  }

  // Filtro por dificuldade
  if (difficultyFilter.value) {
    filtered = filtered.filter(item => item.dificuldade === difficultyFilter.value)
  }

  // Filtro por disponibilidade
  if (availabilityFilter.value === 'available') {
    filtered = filtered.filter(item => item.disponivel)
  } else if (availabilityFilter.value === 'unavailable') {
    filtered = filtered.filter(item => !item.disponivel)
  }

  return filtered
})

const availableItems = computed(() =>
  menuItems.value.filter(item => item.disponivel).length
)

const featuredItems = computed(() =>
  menuItems.value.filter(item => item.destaque).length
)

const averageCost = computed(() => {
  if (menuItems.value.length === 0) return 0
  const total = menuItems.value.reduce((acc, item) => acc + item.custo_ingredientes, 0)
  return total / menuItems.value.length
})

// Methods
async function loadMenuItems() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.MENU_ITEMS)
      .select(`
        *,
        categorias (nome)
      `)
      .eq('ativo', true)
      .order('nome')

    if (error) throw error
    menuItems.value = data || []
  } catch (error) {
    console.error('Erro ao carregar itens do cardápio:', error)
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const { data, error } = await supabase
      .from(DB_TABLES.CATEGORIES)
      .select('*')
      .eq('ativo', true)
      .order('nome')

    if (error) throw error
    categories.value = data || []
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
}

async function saveMenuItem() {
  saving.value = true
  try {
    const tags = tagsInput.value
      ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
      : []

    const itemData = {
      ...itemForm.value,
      tags,
      ativo: true,
      criado_por: authStore.user?.id,
      updated_at: new Date().toISOString()
    }

    if (editingItem.value) {
      const { error } = await supabase
        .from(DB_TABLES.MENU_ITEMS)
        .update(itemData)
        .eq('id', editingItem.value.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from(DB_TABLES.MENU_ITEMS)
        .insert([{
          ...itemData,
          created_at: new Date().toISOString()
        }])

      if (error) throw error
    }

    await loadMenuItems()
    closeItemModal()
  } catch (error) {
    console.error('Erro ao salvar item:', error)
    alert('Erro ao salvar item do cardápio')
  } finally {
    saving.value = false
  }
}

function editMenuItem(item: MenuItem) {
  editingItem.value = item
  itemForm.value = {
    nome: item.nome,
    descricao: item.descricao || '',
    categoria_id: item.categoria_id || '',
    preco_venda: item.preco_venda,
    custo_ingredientes: item.custo_ingredientes,
    tempo_preparo: item.tempo_preparo,
    dificuldade: item.dificuldade,
    porcoes: item.porcoes,
    score_popularidade: item.score_popularidade,
    disponivel: item.disponivel,
    destaque: item.destaque,
    calorias: item.calorias || null,
    proteina_g: item.proteina_g || null,
    carboidratos_g: item.carboidratos_g || null,
    gordura_g: item.gordura_g || null
  }
  tagsInput.value = item.tags ? item.tags.join(', ') : ''
  showAddItemModal.value = true
}

async function toggleAvailability(item: MenuItem) {
  try {
    const { error } = await supabase
      .from(DB_TABLES.MENU_ITEMS)
      .update({
        disponivel: !item.disponivel,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id)

    if (error) throw error

    await loadMenuItems()
  } catch (error) {
    console.error('Erro ao alterar disponibilidade:', error)
    alert('Erro ao alterar disponibilidade do item')
  }
}

function viewIngredients(item: MenuItem) {
  alert(`Funcionalidade de ingredientes será implementada em breve!\n\nItem: ${item.nome}`)
}

function closeItemModal() {
  showAddItemModal.value = false
  editingItem.value = null
  itemForm.value = {
    nome: '',
    descricao: '',
    categoria_id: '',
    preco_venda: 0,
    custo_ingredientes: 0,
    tempo_preparo: 30,
    dificuldade: 'medium',
    porcoes: 1,
    score_popularidade: 0,
    disponivel: true,
    destaque: false,
    calorias: null,
    proteina_g: null,
    carboidratos_g: null,
    gordura_g: null
  }
  tagsInput.value = ''
}

function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  }
  return labels[difficulty] || 'Médio'
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

function getMarginPercentage(price: number, cost: number): string {
  if (price <= 0 || cost <= 0) return '0'
  const margin = ((price - cost) / price) * 100
  return margin.toFixed(1)
}

// Lifecycle
onMounted(() => {
  loadMenuItems()
  loadCategories()
})
</script>

<style scoped>
.menu-container {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary, .btn-edit, .btn-toggle, .btn-ingredients {
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

.btn-secondary {
  background: #f7fafc;
  color: #2d3748;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-edit, .btn-ingredients {
  background: #edf2f7;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  padding: 6px 10px;
}

.btn-edit:hover, .btn-ingredients:hover {
  background: #667eea;
  color: white;
}

.btn-toggle {
  font-size: 12px;
  padding: 6px 10px;
}

.btn-toggle.activate {
  background: #f0fff4;
  color: #38a169;
  border: 1px solid #c6f6d5;
}

.btn-toggle.deactivate {
  background: #fed7d7;
  color: #e53e3e;
  border: 1px solid #feb2b2;
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 12px;
  color: #64748b;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.menu { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-icon.available { background: linear-gradient(135deg, #48bb78, #38a169); }
.stat-icon.featured { background: linear-gradient(135deg, #f6e05e, #ecc94b); }
.stat-icon.cost { background: linear-gradient(135deg, #4facfe, #00f2fe); }

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.menu-grid {
  min-height: 400px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #64748b;
  gap: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
  color: #1a202c;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.menu-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.menu-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.menu-card.unavailable {
  opacity: 0.7;
  background: #f8fafc;
}

.menu-card.featured::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
  border-radius: 18px;
  z-index: -1;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.menu-info h3 {
  color: #1a202c;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.menu-category {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
}

.menu-badges {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.featured {
  background: linear-gradient(135deg, #f6e05e, #ecc94b);
  color: #744210;
}

.badge.difficulty.easy {
  background: #c6f6d5;
  color: #2f855a;
}

.badge.difficulty.medium {
  background: #fef3c7;
  color: #d69e2e;
}

.badge.difficulty.hard {
  background: #fed7d7;
  color: #c53030;
}

.menu-description {
  margin-bottom: 16px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.menu-details {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #64748b;
  font-size: 13px;
}

.value {
  color: #1a202c;
  font-weight: 600;
  font-size: 13px;
}

.value.price {
  color: #38a169;
  font-size: 14px;
}

.value.profit {
  color: #667eea;
}

.menu-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  font-size: 12px;
}

.stat svg {
  color: #667eea;
}

.menu-nutrition {
  margin-bottom: 16px;
  padding: 12px;
  background: #f0fff4;
  border-radius: 8px;
  border-left: 4px solid #38a169;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.nutrition-label {
  font-size: 12px;
  color: #2f855a;
  font-weight: 500;
}

.nutrition-value {
  font-size: 12px;
  color: #1a202c;
  font-weight: 600;
}

.menu-tags {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.menu-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 {
  margin: 0;
  color: #1a202c;
  font-size: 20px;
  font-weight: 600;
}

.modal-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 8px;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1a202c;
}

.menu-form {
  padding: 24px;
}

.form-sections {
  max-height: 60vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: #1a202c;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.margin-display {
  background: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}

.margin-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.margin-label {
  font-weight: 500;
  color: #2f855a;
}

.margin-value {
  font-weight: 700;
  color: #38a169;
  font-size: 16px;
}

.margin-amount {
  font-size: 12px;
  color: #2f855a;
}

.form-actions, .modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.planning-content {
  padding: 24px;
}

.planning-content ul {
  margin-left: 20px;
  color: #64748b;
}

/* Responsividade */
@media (max-width: 1024px) {
  .menu-list {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .menu-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .header-actions {
    justify-content: center;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-controls {
    flex-direction: column;
  }

  .menu-list {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .menu-stats {
    flex-direction: column;
    gap: 8px;
  }

  .nutrition-grid {
    grid-template-columns: 1fr;
  }
}
</style>