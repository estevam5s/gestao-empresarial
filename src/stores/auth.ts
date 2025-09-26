import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User, LoginCredentials } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const result = await authService.login(credentials.username, credentials.password)
      if (result.success && result.user) {
        user.value = result.user
      }
      return result
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await authService.logout()
    user.value = null
  }

  // ✅ NOVA FUNÇÃO: Atualizar dados do usuário
  function updateUser(updatedData: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedData }
    }
  }

  // ✅ NOVA FUNÇÃO: Recarregar dados do usuário
  async function refreshUser() {
    if (user.value?.id) {
      try {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          user.value = currentUser
        }
      } catch (error) {
        console.error('Erro ao recarregar dados do usuário:', error)
      }
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser
  }
})