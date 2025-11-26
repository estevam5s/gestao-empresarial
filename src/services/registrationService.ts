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
   * Registra uma nova empresa (tenant) e seu usuário owner
   */
  async registerTenant(data: RegistrationData): Promise<RegistrationResult> {
    try {
      // 1. Criar slug único para o tenant
      const slug = this.generateSlug(data.companyName)

      // 2. Verificar se o slug já existe
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existingTenant) {
        return {
          success: false,
          error: 'Uma empresa com este nome já está cadastrada. Por favor, escolha outro nome.'
        }
      }

      // 3. Verificar se o email já está cadastrado
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

      // 4. Buscar o plano selecionado (ou usar o padrão)
      const planSlug = data.planSlug || 'profissional'
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('slug', planSlug)
        .eq('is_active', true)
        .single()

      if (!plan) {
        return {
          success: false,
          error: 'Plano de assinatura não encontrado.'
        }
      }

      // 5. Calcular data de término do trial
      const trialEndsAt = new Date()
      trialEndsAt.setDate(trialEndsAt.getDate() + (plan.trial_days || 14))

      // 6. Criar o tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: data.companyName,
          slug: slug,
          email: data.email,
          phone: data.phone,
          cnpj: data.cnpj,
          status: 'trial',
          subscription_plan_id: plan.id,
          subscription_status: 'trialing',
          trial_ends_at: trialEndsAt.toISOString(),
          max_users: plan.max_users,
          current_users: 1,
          max_storage_mb: plan.max_storage_mb,
          current_storage_mb: 0,
          settings: {
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            currency: 'BRL'
          }
        })
        .select()
        .single()

      if (tenantError || !tenant) {
        console.error('Erro ao criar tenant:', tenantError)
        return {
          success: false,
          error: 'Erro ao criar a empresa. Tente novamente.'
        }
      }

      // 7. Criar usuário admin/owner
      const hashedPassword = await authService.hashPassword(data.password)

      const { data: user, error: userError } = await supabase
        .from(DB_TABLES.USERS)
        .insert({
          email: data.email,
          username: data.email,
          password_hash: hashedPassword,
          name: data.ownerName,
          role: 'owner', // Role especial para o dono da empresa
          is_active: true,
          tenant_id: tenant.id // Associar o tenant ao usuário
        })
        .select()
        .single()

      if (userError || !user) {
        // Rollback: deletar o tenant criado
        await supabase
          .from('tenants')
          .delete()
          .eq('id', tenant.id)

        console.error('Erro ao criar usuário:', userError)
        return {
          success: false,
          error: 'Erro ao criar usuário. Tente novamente.'
        }
      }

      // 8. Criar relacionamento tenant-user
      const { error: tenantUserError } = await supabase
        .from('tenant_users')
        .insert({
          tenant_id: tenant.id,
          admin_user_id: user.id,
          email: data.email,
          name: data.ownerName,
          role: 'owner',
          is_active: true,
          is_owner: true,
          joined_at: new Date().toISOString()
        })

      if (tenantUserError) {
        console.error('Erro ao criar tenant_user:', tenantUserError)
        // Não fazemos rollback aqui pois o usuário e tenant já existem
        // O relacionamento pode ser criado posteriormente
      }

      // 9. Registrar no histórico de assinaturas
      await supabase
        .from('subscription_history')
        .insert({
          tenant_id: tenant.id,
          plan_id: plan.id,
          billing_cycle: 'monthly',
          amount: plan.price_monthly,
          currency: 'BRL',
          starts_at: new Date().toISOString(),
          status: 'active',
          payment_status: 'pending'
        })

      // 10. Criar log de registro
      await supabase
        .from(DB_TABLES.LOGS)
        .insert({
          user_id: user.id,
          action: 'tenant_registration',
          entity_type: 'tenant',
          entity_id: tenant.id,
          description: `Nova empresa registrada: ${tenant.name}`,
          metadata: {
            plan: planSlug,
            trial_ends_at: trialEndsAt.toISOString()
          },
          severity: 'info',
          category: 'system',
          status: 'success'
        })

      return {
        success: true,
        tenantId: tenant.id,
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
   * Gera um slug único a partir do nome da empresa
   */
  private generateSlug(companyName: string): string {
    return companyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por -
      .replace(/^-+|-+$/g, '') // Remove - do início e fim
      .substring(0, 50) // Limita tamanho
  }

  /**
   * Busca informações de um tenant pelo slug
   */
  async getTenantBySlug(slug: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*, subscription_plans(*)')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Erro ao buscar tenant:', error)
      return null
    }

    return data
  }

  /**
   * Busca todos os planos de assinatura ativos
   */
  async getSubscriptionPlans() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Erro ao buscar planos:', error)
      return []
    }

    return data || []
  }

  /**
   * Submete uma mensagem de contato
   */
  async submitContactMessage(data: {
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
  }) {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        subject: data.subject,
        message: data.message,
        status: 'new',
        priority: 'normal'
      })

    if (error) {
      console.error('Erro ao enviar mensagem:', error)
      return {
        success: false,
        error: 'Erro ao enviar mensagem. Tente novamente.'
      }
    }

    return {
      success: true
    }
  }

  /**
   * Cria um lead/interessado
   */
  async createLead(data: {
    name: string
    email: string
    phone?: string
    company?: string
    interestedIn: string
    message?: string
    source?: string
  }) {
    const { error } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        interested_in: data.interestedIn,
        message: data.message,
        source: data.source || 'website',
        status: 'new'
      })

    if (error) {
      console.error('Erro ao criar lead:', error)
      return {
        success: false,
        error: 'Erro ao registrar interesse. Tente novamente.'
      }
    }

    return {
      success: true
    }
  }
}

export const registrationService = new RegistrationService()
