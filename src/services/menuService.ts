import { supabase } from '@/config/supabase'

export interface MenuItem {
  id: string
  nome: string
  descricao?: string
  categoria_id?: string
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
  categoria?: {
    nome: string
    icone: string
  }
}

export interface MenuDiario {
  id: string
  planejamento_semanal_id: string
  menu_item_id: string
  data_planejada: string
  periodo_refeicao: 'cafe_manha' | 'almoco' | 'jantar'
  quantidade_estimada: number
  receita_estimada: number
  status: 'planejado' | 'preparando' | 'pronto' | 'cancelado'
  observacoes?: string
  created_at: string
  menu_item?: MenuItem
}

export interface PlanejamentoSemanal {
  id: string
  data_inicio: string
  data_fim: string
  status: 'rascunho' | 'planejado' | 'ativo' | 'concluido'
  observacoes?: string
  receita_estimada: number
  created_at: string
  updated_at: string
}

export interface CreateMenuItemData {
  nome: string
  descricao?: string
  categoria_id?: string
  preco_venda: number
  custo_ingredientes?: number
  tempo_preparo?: number
  dificuldade?: 'easy' | 'medium' | 'hard'
  porcoes?: number
  disponivel?: boolean
  destaque?: boolean
  calorias?: number
  proteina_g?: number
  carboidratos_g?: number
  gordura_g?: number
  tags?: string[]
}

class MenuService {
  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          categoria:categorias(nome, icone)
        `)
        .eq('ativo', true)
        .order('nome')

      if (error) {
        console.error('Erro ao buscar itens do menu:', error)
        return this.getMockMenuItems()
      }

      return data || []
    } catch (error) {
      console.error('Erro no serviço de menu:', error)
      return this.getMockMenuItems()
    }
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          *,
          categoria:categorias(nome, icone)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar item do menu:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar item do menu:', error)
      return null
    }
  }

  async createMenuItem(itemData: CreateMenuItemData): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          ...itemData,
          custo_ingredientes: itemData.custo_ingredientes || 0,
          tempo_preparo: itemData.tempo_preparo || 0,
          dificuldade: itemData.dificuldade || 'medium',
          porcoes: itemData.porcoes || 1,
          score_popularidade: 0,
          disponivel: itemData.disponivel ?? true,
          destaque: itemData.destaque || false,
          ativo: true
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar item do menu:', error)
        throw new Error('Não foi possível criar o item do menu')
      }

      return data
    } catch (error) {
      console.error('Erro ao criar item do menu:', error)
      throw error
    }
  }

  async updateMenuItem(id: string, itemData: Partial<CreateMenuItemData>): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          ...itemData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar item do menu:', error)
        throw new Error('Não foi possível atualizar o item do menu')
      }

      return data
    } catch (error) {
      console.error('Erro ao atualizar item do menu:', error)
      throw error
    }
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ ativo: false })
        .eq('id', id)

      if (error) {
        console.error('Erro ao excluir item do menu:', error)
        throw new Error('Não foi possível excluir o item do menu')
      }

      return true
    } catch (error) {
      console.error('Erro ao excluir item do menu:', error)
      throw error
    }
  }

  // Menu Diário
  async getMenuDiario(startDate: string, endDate: string): Promise<MenuDiario[]> {
    try {
      const { data, error } = await supabase
        .from('menu_diario')
        .select(`
          *,
          menu_item:menu_items(
            nome,
            preco_venda,
            custo_ingredientes,
            tempo_preparo,
            dificuldade
          )
        `)
        .gte('data_planejada', startDate)
        .lte('data_planejada', endDate)
        .order('data_planejada')
        .order('periodo_refeicao')

      if (error) {
        console.error('Erro ao buscar menu diário:', error)
        return this.getMockMenuDiario()
      }

      return data || []
    } catch (error) {
      console.error('Erro no serviço de menu diário:', error)
      return this.getMockMenuDiario()
    }
  }

  async createPlanejamentoSemanal(startDate: string, endDate: string): Promise<PlanejamentoSemanal | null> {
    try {
      const { data, error } = await supabase
        .from('planejamento_semanal')
        .insert([{
          data_inicio: startDate,
          data_fim: endDate,
          status: 'rascunho',
          receita_estimada: 0
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar planejamento semanal:', error)
        throw new Error('Não foi possível criar o planejamento semanal')
      }

      return data
    } catch (error) {
      console.error('Erro ao criar planejamento semanal:', error)
      throw error
    }
  }

  // Estatísticas
  async getMenuStats() {
    try {
      const items = await this.getMenuItems()

      const total = items.length
      const disponíveis = items.filter(item => item.disponivel).length
      const destaque = items.filter(item => item.destaque).length

      const porDificuldade = items.reduce((acc, item) => {
        acc[item.dificuldade] = (acc[item.dificuldade] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const precoMedio = items.length > 0
        ? items.reduce((acc, item) => acc + item.preco_venda, 0) / items.length
        : 0

      const custoMedio = items.length > 0
        ? items.reduce((acc, item) => acc + item.custo_ingredientes, 0) / items.length
        : 0

      return {
        total,
        disponíveis,
        destaque,
        porDificuldade,
        precoMedio: Math.round(precoMedio * 100) / 100,
        custoMedio: Math.round(custoMedio * 100) / 100,
        margemMedia: precoMedio > 0 ? Math.round(((precoMedio - custoMedio) / precoMedio) * 100) : 0
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas do menu:', error)
      return {
        total: 0,
        disponíveis: 0,
        destaque: 0,
        porDificuldade: {},
        precoMedio: 0,
        custoMedio: 0,
        margemMedia: 0
      }
    }
  }

  // Mock data
  private getMockMenuItems(): MenuItem[] {
    return [
      {
        id: '1',
        nome: 'Hambúrguer Artesanal',
        descricao: 'Hambúrguer com carne 150g, queijo, alface, tomate e molho especial',
        preco_venda: 25.90,
        custo_ingredientes: 12.50,
        tempo_preparo: 15,
        dificuldade: 'medium',
        porcoes: 1,
        score_popularidade: 85,
        disponivel: true,
        destaque: true,
        calorias: 650,
        proteina_g: 35,
        carboidratos_g: 45,
        gordura_g: 38,
        tags: ['hambúrguer', 'carne', 'artesanal'],
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categoria: {
          nome: 'Lanches',
          icone: '🍔'
        }
      },
      {
        id: '2',
        nome: 'Pizza Margherita',
        descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
        preco_venda: 32.90,
        custo_ingredientes: 15.80,
        tempo_preparo: 25,
        dificuldade: 'medium',
        porcoes: 4,
        score_popularidade: 92,
        disponivel: true,
        destaque: true,
        calorias: 280,
        proteina_g: 12,
        carboidratos_g: 36,
        gordura_g: 10,
        tags: ['pizza', 'italiana', 'vegetariana'],
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categoria: {
          nome: 'Pizzas',
          icone: '🍕'
        }
      },
      {
        id: '3',
        nome: 'Salada Caesar',
        descricao: 'Alface romana, croutons, parmesão e molho caesar',
        preco_venda: 18.90,
        custo_ingredientes: 8.50,
        tempo_preparo: 10,
        dificuldade: 'easy',
        porcoes: 1,
        score_popularidade: 70,
        disponivel: true,
        destaque: false,
        calorias: 320,
        proteina_g: 8,
        carboidratos_g: 15,
        gordura_g: 25,
        tags: ['salada', 'saudável', 'vegetariana'],
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categoria: {
          nome: 'Saladas',
          icone: '🥗'
        }
      }
    ]
  }

  private getMockMenuDiario(): MenuDiario[] {
    const today = new Date()
    const items: MenuDiario[] = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)

      items.push({
        id: `${i}-almoco`,
        planejamento_semanal_id: '1',
        menu_item_id: '1',
        data_planejada: date.toISOString().split('T')[0],
        periodo_refeicao: 'almoco',
        quantidade_estimada: 50,
        receita_estimada: 1295.00,
        status: i === 0 ? 'pronto' : i === 1 ? 'preparando' : 'planejado',
        created_at: new Date().toISOString(),
        menu_item: {
          id: '1',
          nome: 'Hambúrguer Artesanal',
          preco_venda: 25.90,
          custo_ingredientes: 12.50,
          tempo_preparo: 15,
          dificuldade: 'medium',
          porcoes: 1,
          score_popularidade: 85,
          disponivel: true,
          destaque: true,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })
    }

    return items
  }
}

export const menuService = new MenuService()