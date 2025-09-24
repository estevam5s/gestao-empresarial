import { supabase } from '@/config/supabase'

export async function setupSettingsTable(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔧 Verificando e configurando tabela de configurações...')

    // Testar conexão básica
    const { data: healthCheck, error: healthError } = await supabase
      .from('admin_users')
      .select('count(*)')
      .limit(1)

    if (healthError) {
      return {
        success: false,
        message: `Erro de conexão com Supabase: ${healthError.message}`
      }
    }

    // Verificar se a tabela app_settings existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('app_settings')
      .select('count(*)')
      .limit(1)

    if (tableError) {
      if (tableError.code === 'PGRST116' || tableError.message.includes('does not exist')) {
        return {
          success: false,
          message: `Tabela app_settings não existe. Execute o SQL em: src/database/create-settings-table.sql no Supabase SQL Editor`
        }
      }
      return {
        success: false,
        message: `Erro ao verificar tabela: ${tableError.message}`
      }
    }

    // Verificar se o usuário atual pode acessar a tabela
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        message: 'Usuário não autenticado. Faça login para acessar as configurações.'
      }
    }

    // Testar inserção/leitura de configuração de teste
    const testSettings = {
      user_id: user.id,
      section: 'test',
      settings: { test: true, timestamp: new Date().toISOString() }
    }

    const { error: insertError } = await supabase
      .from('app_settings')
      .upsert(testSettings, { onConflict: 'user_id,section' })

    if (insertError) {
      return {
        success: false,
        message: `Erro ao testar inserção: ${insertError.message}`
      }
    }

    // Limpar o teste
    const { error: deleteError } = await supabase
      .from('app_settings')
      .delete()
      .eq('user_id', user.id)
      .eq('section', 'test')

    if (deleteError) {
      console.warn('Aviso: não foi possível limpar dados de teste:', deleteError.message)
    }

    return {
      success: true,
      message: 'Tabela app_settings configurada e funcionando corretamente!'
    }

  } catch (error: any) {
    console.error('Erro inesperado ao configurar banco:', error)
    return {
      success: false,
      message: `Erro inesperado: ${error.message}`
    }
  }
}

export async function getDatabaseInfo(): Promise<{
  user: any
  tables: string[]
  settingsCount: number
}> {
  try {
    // Informações do usuário
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      throw new Error(`Erro ao buscar usuário: ${userError.message}`)
    }

    // Contar configurações do usuário atual
    let settingsCount = 0
    if (user) {
      const { data: settings, error: countError } = await supabase
        .from('app_settings')
        .select('section')
        .eq('user_id', user.id)

      if (!countError && settings) {
        settingsCount = settings.length
      }
    }

    return {
      user: user ? { id: user.id, email: user.email } : null,
      tables: ['app_settings', 'admin_users', 'produtos', 'categorias'],
      settingsCount
    }
  } catch (error: any) {
    console.error('Erro ao buscar informações do banco:', error)
    throw error
  }
}

export const databaseSetup = {
  setupSettingsTable,
  getDatabaseInfo
}