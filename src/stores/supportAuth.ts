import { defineStore } from 'pinia'
import { supabase } from '@/config/supabase'

interface SupportUser {
  id: string
  email: string
  role?: string
}

export const useSupportAuthStore = defineStore('supportAuth', {
  state: () => ({
    user: null as SupportUser | null,
    loading: false,
    error: '' as string | ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    async signIn(email: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        const u = data.user
        this.user = u ? { id: u.id, email: u.email || '' } : null
        localStorage.setItem('supportSession', JSON.stringify(this.user))
        return true
      } catch (e: any) {
        this.error = e.message
        return false
      } finally {
        this.loading = false
      }
    },
    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      localStorage.removeItem('supportSession')
    },
    restore() {
      const stored = localStorage.getItem('supportSession')
      if (stored) this.user = JSON.parse(stored)
    }
  }
})

