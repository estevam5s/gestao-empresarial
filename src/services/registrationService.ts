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
  async registerTenant(data: RegistrationData): Promise<RegistrationResult> {
    try {
      // 1. Verificar se o email já está cadastrado
      const { data: existingUser } = await supabase
        .from(DB_TABLES.USERS)
        .select('id')
        .eq('email', data.email)
        .single()

      if (existingUser) {
        return {
          success: false,
          error: 'Este email já está cadastrado no sistema.'
        }
      }

      // 2. Criar usuário
      const hashedPassword = await authService.hashPassword(data.password)

      const { data: user, error: userError } = await supabase
        .from(DB_TABLES.USERS)
        .insert({
          email: data.email,
          username: data.email, // Usa email como username
          password_hash: hashedPassword,
          name: data.ownerName,
          role: 'user',
          is_active: true
        })
        .select()
        .single()

      if (userError || !user) {
        console.error('Erro ao criar usuário:', userError)
        return {
          success: false,
          error: 'Erro ao criar usuário. Tente novamente.'
        }
      }

      console.log('✓ Usuário criado com sucesso:', user.id)

      return {
        success: true,
        userId: user.id
      }
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
