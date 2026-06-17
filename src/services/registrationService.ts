import { supabase, DB_TABLES } from '@/config/supabase'
import { authService } from './authService'

export interface RegistrationData {
  // Empresa
  companyName: string
  email: string
  phone?: string
  cnpj?: string

  // Usuário owner
  ownerName: string
  password: string

  // Plano
  planSlug?: string
}

export interface RegistrationResult {
  success: boolean
  tenantId?: string
  userId?: string
  error?: string
}

export class RegistrationService {
  /**
   * ⭐ SIMPLIFICADO: Registra um novo usuário (sem tenant!)
   */
  async registerTenant(data: RegistrationData & { heardAbout?: string }): Promise<RegistrationResult & { hasSession?: boolean }> {
    try {
      // username derivado do e-mail (único garantido por trigger no banco)
      const username = (data.email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()

      const res = await authService.signUp({
        email: data.email,
        password: data.password,
        name: data.ownerName,
        username,
        heard_about: data.heardAbout,
      })

      if (!res.success) {
        return { success: false, error: res.error || 'Erro ao criar conta.' }
      }

      // Completa o perfil com dados da empresa
      if (res.user?.id) {
        await supabase
          .from('profiles')
          .update({ company_name: data.companyName || null, phone: data.phone || null })
          .eq('id', res.user.id)
      }

      return { success: true, userId: res.user?.id, hasSession: res.hasSession }
    } catch (error) {
      console.error('Erro no registro:', error)
      return {
        success: false,
        error: 'Erro inesperado ao criar conta. Por favor, tente novamente.'
      }
    }
  }

    /**
     * Recebe uma mensagem de contato e persiste em `contact_messages`.
     * Retorna { success: boolean, error?: string }
     */
    async submitContactMessage(msg: { name: string; email: string; phone?: string; company?: string; subject?: string; message: string }): Promise<{ success: boolean; error?: string }> {
      try {
        const { error } = await supabase
          .from(DB_TABLES.CONTACT_MESSAGES)
          .insert([{
            name: msg.name,
            email: msg.email,
            phone: msg.phone || null,
            company: msg.company || null,
            subject: msg.subject || null,
            message: msg.message,
            created_at: new Date().toISOString()
          }])

        if (error) {
          console.error('Erro ao salvar mensagem de contato:', error)
          return { success: false, error: String(error.message || error) }
        }

        return { success: true }
      } catch (err) {
        console.error('Erro em submitContactMessage:', err)
        return { success: false, error: 'Erro inesperado ao enviar mensagem' }
      }
    }

}

export const registrationService = new RegistrationService()
