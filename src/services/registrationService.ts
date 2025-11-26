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

}

export const registrationService = new RegistrationService()
