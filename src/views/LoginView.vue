<template>
  <AuthLayout title="Bem-vindo de volta!" subtitle="Entre para gerenciar sua operação.">
    <form @submit.prevent="handleLogin" class="af">
      <div class="field">
        <label>E-mail ou usuário</label>
        <input v-model="credentials.username" type="text" autocomplete="username" placeholder="voce@empresa.com" :disabled="loading" required />
      </div>

      <div class="field">
        <label>Senha</label>
        <div class="pw">
          <input v-model="credentials.password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="••••••••" :disabled="loading" required />
          <button type="button" class="pw-toggle" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</button>
        </div>
      </div>

      <div class="row">
        <label class="remember"><input type="checkbox" v-model="rememberMe" /> Lembrar de mim</label>
        <router-link to="/contact" class="forgot">Esqueceu a senha?</router-link>
      </div>

      <transition name="fade">
        <div v-if="error" class="err">⚠️ {{ error }}</div>
      </transition>

      <button type="submit" class="submit" :disabled="loading">
        <span v-if="!loading">Entrar</span>
        <span v-else class="spin"></span>
      </button>

      <p class="alt">Ainda não tem conta? <router-link to="/register">Criar conta grátis</router-link></p>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials } from '@/types/auth'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const credentials = ref<LoginCredentials>({ username: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const result = await authStore.login(credentials.value)
    if (result.success) router.push('/dashboard')
    else { error.value = result.error || 'Credenciais inválidas'; loading.value = false }
  } catch {
    error.value = 'Erro de conexão. Tente novamente.'
    loading.value = false
  }
}
</script>

<style scoped>
.af { display: flex; flex-direction: column; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 7px; }
.field label { font-size: 13.5px; font-weight: 600; color: #334155; }
.field input { height: 50px; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0 16px; font-size: 15px; background: #fff; color: #0f172a; transition: .15s; outline: none; width: 100%; }
.field input:focus { border-color: #16a34a; box-shadow: 0 0 0 4px rgba(22,163,74,.12); }
.pw { position: relative; }
.pw input { padding-right: 48px; }
.pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: 0; font-size: 18px; cursor: pointer; }
.row { display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; }
.remember { display: flex; align-items: center; gap: 7px; color: #475569; cursor: pointer; }
.remember input { accent-color: #16a34a; width: 15px; height: 15px; }
.forgot { color: #16a34a; text-decoration: none; font-weight: 600; }
.err { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 11px 14px; border-radius: 10px; font-size: 13.5px; font-weight: 500; }
.submit { height: 52px; border: 0; border-radius: 12px; background: linear-gradient(135deg, #16a34a, #0d9488); color: #fff; font-size: 15.5px; font-weight: 700; cursor: pointer; display: grid; place-items: center; transition: .15s; box-shadow: 0 6px 18px rgba(22,163,74,.28); }
.submit:hover:not(:disabled) { filter: brightness(1.05); transform: translateY(-1px); }
.submit:disabled { opacity: .7; }
.spin { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: r .7s linear infinite; }
@keyframes r { to { transform: rotate(360deg) } }
.alt { text-align: center; font-size: 14px; color: #64748b; margin-top: 4px; }
.alt a { color: #16a34a; font-weight: 700; text-decoration: none; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
