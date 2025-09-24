import { supabase } from '@/config/supabase'

export interface Supplier {
  id: string
  name: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  category?: string
  status: 'active' | 'inactive'
  last_order?: string
  products_count: number
  created_at: string
  updated_at: string
}

export interface CreateSupplierData {
  name: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  category?: string
  status?: 'active' | 'inactive'
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  id: string
}

class SuppliersService {
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar fornecedores:', error)
        return this.getMockSuppliers()
      }

      return data || []
    } catch (error) {
      console.error('Erro no serviço de fornecedores:', error)
      return this.getMockSuppliers()
    }
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar fornecedor:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error)
      return null
    }
  }

  async createSupplier(supplierData: CreateSupplierData): Promise<Supplier | null> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          ...supplierData,
          status: supplierData.status || 'active',
          products_count: 0
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar fornecedor:', error)
        throw new Error('Não foi possível criar o fornecedor')
      }

      return data
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error)
      throw error
    }
  }

  async updateSupplier(supplierData: UpdateSupplierData): Promise<Supplier | null> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update({
          ...supplierData,
          updated_at: new Date().toISOString()
        })
        .eq('id', supplierData.id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar fornecedor:', error)
        throw new Error('Não foi possível atualizar o fornecedor')
      }

      return data
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error)
      throw error
    }
  }

  async deleteSupplier(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao excluir fornecedor:', error)
        throw new Error('Não foi possível excluir o fornecedor')
      }

      return true
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error)
      throw error
    }
  }

  async getSuppliersStats() {
    try {
      const suppliers = await this.getSuppliers()

      const total = suppliers.length
      const active = suppliers.filter(s => s.status === 'active').length
      const inactive = suppliers.filter(s => s.status === 'inactive').length

      const categories = suppliers.reduce((acc, supplier) => {
        const category = supplier.category || 'Outros'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        total,
        active,
        inactive,
        categories
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      return {
        total: 0,
        active: 0,
        inactive: 0,
        categories: {}
      }
    }
  }

  private getMockSuppliers(): Supplier[] {
    return [
      {
        id: '1',
        name: 'Distribuidora Alpha',
        contact: 'João Silva',
        phone: '(11) 9999-8888',
        email: 'joao@alpha.com',
        address: 'Rua das Flores, 123, São Paulo',
        category: 'Alimentos',
        status: 'active',
        last_order: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        products_count: 15,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Fornecedor Beta',
        contact: 'Maria Santos',
        phone: '(11) 8888-7777',
        email: 'maria@beta.com',
        address: 'Av. Paulista, 456, São Paulo',
        category: 'Bebidas',
        status: 'active',
        last_order: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        products_count: 8,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Suprimentos Gama',
        contact: 'Pedro Oliveira',
        phone: '(11) 7777-6666',
        email: 'pedro@gama.com',
        address: 'Rua do Comércio, 789, São Paulo',
        category: 'Limpeza',
        status: 'inactive',
        products_count: 3,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
}

export const suppliersService = new SuppliersService()