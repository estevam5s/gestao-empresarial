import { supabase } from '@/config/supabase'
import type { User } from '@/types/auth'

// Autenticação real via Supabase Auth (JWT + refresh token rotacionado).
// Mantém o mesmo formato de `userSession` no localStorage para compatibilidade
// com os serviços existentes (que usam userSession.id como tenant_id).
export class AuthService {
  private currentUser: User | null = null

  constructor() {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage() {
    try {
      const s = localStorage.getItem('userSession')
      if (s) this.currentUser = JSON.parse(s)
    } catch {
      localStorage.removeItem('userSession')
    }
  }

  private async buildSession(authUser: any): Promise<User> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    const user: User = {
      id: authUser.id,
      username: profile?.username || authUser.email?.split('@')[0] || '',
      email: profile?.email || authUser.email || '',
      name: profile?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
      role: profile?.role || 'user',
      avatar_url: profile?.avatar_url,
      tenant_id: authUser.id,
    }
    localStorage.setItem('userSession', JSON.stringify(user))
    localStorage.setItem('currentTenantId', authUser.id)
    this.currentUser = user
    return user
  }

  // Aceita login por e-mail OU username
  async login(login: string, password: string) {
    try {
      let email = login.trim()
      if (!email.includes('@')) {
        const { data } = await supabase.rpc('resolve_login_email', { login: email })
        if (data) email = data as string
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.user) {
        // registra tentativa falha (visível no painel admin → Segurança)
        supabase.from('security_events').insert({ kind: 'failed_login', email, detail: error?.message || 'invalid' }).then(() => {})
        throw new Error(error?.message || 'Credenciais inválidas')
      }

      const user = await this.buildSession(data.user)
      supabase.from('profiles').update({ last_login: new Date().toISOString() }).eq('id', user.id).then(() => {})
      return { success: true, user }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido'
      const friendly = /invalid login credentials/i.test(msg)
        ? 'E-mail/usuário ou senha incorretos.'
        : msg
      return { success: false, error: friendly }
    }
  }

  async signUp(params: { email: string; password: string; name: string; username?: string; heard_about?: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.name,
            full_name: params.name,
            username: params.username,
            heard_about: params.heard_about,
          },
        },
      })
      if (error) throw error

      if (data.session && data.user) {
        const user = await this.buildSession(data.user)
        if (params.heard_about) {
          supabase.from('signup_sources').insert({ user_id: data.user.id, source: params.heard_about }).then(() => {})
        }
        return { success: true, user, hasSession: true }
      }
      return { success: true, hasSession: false }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar conta'
      const friendly = /already registered|already been registered/i.test(msg)
        ? 'Este e-mail já está cadastrado. Faça login.'
        : msg
      return { success: false, error: friendly }
    }
  }

  async logout() {
    try {
      // scope 'global' invalida o refresh token no servidor (todas as sessões)
      await supabase.auth.signOut({ scope: 'global' })
    } catch { /* noop */ }
    localStorage.removeItem('userSession')
    localStorage.removeItem('currentTenantId')
    this.currentUser = null
    return { success: true }
  }

  // Re-sincroniza com a sessão real do Supabase (chamado no boot do app)
  async syncFromSupabase(): Promise<User | null> {
    const { data } = await supabase.auth.getSession()
    if (!data.session?.user) {
      localStorage.removeItem('userSession')
      localStorage.removeItem('currentTenantId')
      this.currentUser = null
      return null
    }
    return this.buildSession(data.session.user)
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) this.loadUserFromStorage()
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}

export const authService = new AuthService()
