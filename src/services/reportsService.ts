import { supabase, DB_TABLES } from '@/config/supabase'

export class ReportsService {
  // Relatório de vendas por período
  async getSalesAnalytics(period: '7d' | '30d' | '90d' = '30d') {
    try {
      const { data: movements, error } = await supabase
        .from(DB_TABLES.MOVEMENTS)
        .select(`
          *,
          produtos!product_id (
            nome,
            preco,
            categoria_id,
            categorias (nome)
          )
        `)
        .eq('type', 'out')
        .gte('created_at', this.getDateByPeriod(period))
        .order('created_at', { ascending: false })

      if (error) throw error

      return this.processSalesData(movements || [])
    } catch (error) {
      console.error('Erro ao buscar analytics de vendas:', error)
      throw error
    }
  }

  // Relatório de estoque
  async getStockAnalytics() {
    try {
      const { data: products, error } = await supabase
        .from(DB_TABLES.PRODUCTS)
        .select(`
          *,
          categorias (nome)
        `)
        .eq('ativo', true)

      if (error) throw error

      const lowStock = products?.filter(p => p.current_stock <= p.min_stock) || []
      const outOfStock = products?.filter(p => p.current_stock === 0) || []
      const totalValue = products?.reduce((acc, p) => acc + (p.preco * p.current_stock), 0) || 0

      return {
        totalProducts: products?.length || 0,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        totalValue,
        lowStockProducts: lowStock,
        outOfStockProducts: outOfStock,
        categoryBreakdown: this.getCategoryBreakdown(products || [])
      }
    } catch (error) {
      console.error('Erro ao buscar analytics de estoque:', error)
      throw error
    }
  }

  // Relatório de movimentações
  async getMovementsAnalytics(period: '7d' | '30d' | '90d' = '30d') {
    try {
      const { data: movements, error } = await supabase
        .from(DB_TABLES.MOVEMENTS)
        .select(`
          *,
          produtos!product_id (nome),
          admin_users!created_by (name)
        `)
        .gte('created_at', this.getDateByPeriod(period))
        .order('created_at', { ascending: false })

      if (error) throw error

      return this.processMovementsData(movements || [])
    } catch (error) {
      console.error('Erro ao buscar analytics de movimentações:', error)
      throw error
    }
  }

  // Relatório de fornecedores
  async getSuppliersAnalytics() {
    try {
      const { data: suppliers, error } = await supabase
        .from(DB_TABLES.SUPPLIERS)
        .select('*')
        .eq('status', 'active')

      if (error) throw error

      return {
        totalSuppliers: suppliers?.length || 0,
        activeSuppliers: suppliers?.filter(s => s.status === 'active').length || 0,
        recentOrders: suppliers?.filter(s => s.last_order &&
          new Date(s.last_order) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length || 0
      }
    } catch (error) {
      console.error('Erro ao buscar analytics de fornecedores:', error)
      throw error
    }
  }

  // Dados para gráficos
  async getChartData(type: 'sales' | 'stock' | 'movements', period: '7d' | '30d' | '90d' = '30d') {
    switch (type) {
      case 'sales':
        return await this.getSalesChartData(period)
      case 'stock':
        return await this.getStockChartData()
      case 'movements':
        return await this.getMovementsChartData(period)
      default:
        throw new Error('Tipo de gráfico não suportado')
    }
  }

  private async getSalesChartData(period: '7d' | '30d' | '90d') {
    const analytics = await this.getSalesAnalytics(period)
    return {
      labels: analytics.dailySales.map((item: any) => item.date),
      datasets: [{
        label: 'Vendas (R$)',
        data: analytics.dailySales.map((item: any) => item.total),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true
      }]
    }
  }

  private async getStockChartData() {
    const analytics = await this.getStockAnalytics()
    return {
      labels: analytics.categoryBreakdown.map((item: any) => item.category),
      datasets: [{
        data: analytics.categoryBreakdown.map((item: any) => item.count),
        backgroundColor: [
          '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'
        ]
      }]
    }
  }

  private async getMovementsChartData(period: '7d' | '30d' | '90d') {
    const analytics = await this.getMovementsAnalytics(period)
    return {
      labels: analytics.dailyMovements.map((item: any) => item.date),
      datasets: [
        {
          label: 'Entradas',
          data: analytics.dailyMovements.map((item: any) => item.in),
          backgroundColor: '#48bb78'
        },
        {
          label: 'Saídas',
          data: analytics.dailyMovements.map((item: any) => item.out),
          backgroundColor: '#f56565'
        }
      ]
    }
  }

  private getDateByPeriod(period: '7d' | '30d' | '90d'): string {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  private processSalesData(movements: any[]) {
    const dailySales: { [key: string]: number } = {}
    const categorySales: { [key: string]: number } = {}
    let totalSales = 0

    movements.forEach(movement => {
      const date = new Date(movement.created_at).toISOString().split('T')[0]
      const category = movement.produtos?.categorias?.nome || 'Sem categoria'
      const value = movement.total_cost || 0

      dailySales[date] = (dailySales[date] || 0) + value
      categorySales[category] = (categorySales[category] || 0) + value
      totalSales += value
    })

    return {
      totalSales,
      dailySales: Object.entries(dailySales).map(([date, total]) => ({ date, total })),
      categorySales: Object.entries(categorySales).map(([category, total]) => ({ category, total })),
      movementsCount: movements.length
    }
  }

  private processMovementsData(movements: any[]) {
    const dailyMovements: { [key: string]: { in: number, out: number } } = {}
    const typeCount = { in: 0, out: 0 }

    movements.forEach(movement => {
      const date = new Date(movement.created_at).toISOString().split('T')[0]

      if (!dailyMovements[date]) {
        dailyMovements[date] = { in: 0, out: 0 }
      }

      if (movement.type === 'in') {
        dailyMovements[date].in += movement.quantity
        typeCount.in++
      } else {
        dailyMovements[date].out += movement.quantity
        typeCount.out++
      }
    })

    return {
      dailyMovements: Object.entries(dailyMovements).map(([date, data]) => ({ date, ...data })),
      typeCount,
      totalMovements: movements.length,
      recentMovements: movements.slice(0, 10)
    }
  }

  private getCategoryBreakdown(products: any[]) {
    const categoryCount: { [key: string]: number } = {}

    products.forEach(product => {
      const category = product.categorias?.nome || 'Sem categoria'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })

    return Object.entries(categoryCount).map(([category, count]) => ({ category, count }))
  }
}

export const reportsService = new ReportsService()