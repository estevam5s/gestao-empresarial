<template>
  <AuthLayout title="Crie sua conta" :subtitle="plan ? `Plano ${plan} · 7 dias grátis` : 'Comece grátis em menos de 1 minuto.'">
    <form @submit.prevent="handleRegister" class="af">
      <div class="field">
        <label>Nome da empresa</label>
        <input v-model="form.companyName" type="text" placeholder="Restaurante do Zé" :disabled="loading" required />
      </div>
      <div class="field">
        <label>Seu nome completo</label>
        <input v-model="form.ownerName" type="text" placeholder="João Silva" :disabled="loading" required />
      </div>
      <div class="field">
        <label>E-mail corporativo</label>
        <input v-model="form.email" type="email" autocomplete="email" placeholder="voce@empresa.com" :disabled="loading" required />
      </div>
      <div class="grid2">
        <div class="field">
          <label>Senha</label>
          <div class="pw">
            <input v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="Mín. 8" minlength="8" :disabled="loading" required />
            <button type="button" class="pw-toggle" @click="showPw = !showPw">{{ showPw ? '🙈' : '👁️' }}</button>
          </div>
        </div>
        <div class="field">
          <label>Confirmar</label>
          <input v-model="form.confirmPassword" :type="showPw ? 'text' : 'password'" placeholder="Repetir" :disabled="loading" required />
        </div>
      </div>
      <div class="field">
        <label>Onde nos encontrou?</label>
        <select v-model="form.heardAbout" :disabled="loading">
          <option value="">Prefiro não dizer</option>
          <option v-for="o in sources" :key="o" :value="o">{{ o }}</option>
        </select>
      </div>

      <label class="terms">
        <input type="checkbox" v-model="form.acceptedTerms" :disabled="loading" />
        <span>Li e aceito os <router-link to="/legal/terms" target="_blank">Termos</router-link>, o
          <router-link to="/legal/privacy" target="_blank">Aviso de Privacidade</router-link> e a
          <router-link to="/legal/cookies" target="_blank">Política de Cookies</router-link>.</span>
      </label>

      <transition name="fade"><div v-if="error" class="err">⚠️ {{ error }}</div></transition>

      <button type="submit" class="submit" :disabled="loading || !valid">
        <span v-if="!loading">Criar conta grátis</span>
        <span v-else class="spin"></span>
      </button>

      <p class="alt">Já tem conta? <router-link to="/login">Fazer login</router-link></p>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthLayout from '@/components/auth/AuthLayout.vue'

const router = useRouter()
const route = useRoute()
const plan = route.query.plan as string | undefined

const sources = ['Google / busca', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Indicação de amigo', 'TikTok', 'Anúncio', 'Outro']
const form = ref({ companyName: '', ownerName: '', email: '', password: '', confirmPassword: '', heardAbout: '', acceptedTerms: false })
const error = ref('')
const loading = ref(false)
const showPw = ref(false)

const valid = computed(() => !!(form.value.companyName && form.value.ownerName && form.value.email && form.value.password && form.value.confirmPassword && form.value.acceptedTerms))

async function handleRegister() {
  error.value = ''
  if (form.value.password !== form.value.confirmPassword) { error.value = 'As senhas não coincidem.'; return }
  if (form.value.password.length < 8) { error.value = 'A senha deve ter no mínimo 8 caracteres.'; return }
  loading.value = true
  try {
    const { registrationService } = await import('@/services/registrationService')
    const result = await registrationService.registerTenant({
      companyName: form.value.companyName,
      ownerName: form.value.ownerName,
      email: form.value.email,
      password: form.value.password,
      heardAbout: form.value.heardAbout || undefined,
      planSlug: plan,
    })
    if (!result.success) { error.value = result.error || 'Erro ao criar conta.'; loading.value = false; return }
    if (result.hasSession) {
      const q: Record<string, string> = {}
      if (route.query.plan) q.plan = route.query.plan as string
      if (route.query.cycle) q.cycle = route.query.cycle as string
      router.push({ path: '/onboarding/plano', query: q })
    } else {
      router.push({ path: '/login', query: { registered: 'true', email: form.value.email } })
    }
  } catch {
    error.value = 'Erro ao criar conta. Tente novamente.'
    loading.value = false
  }
}
</script>

<style scoped>
.af { display: flex; flex-direction: column; gap: 15px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 600; color: #334155; }
.field input, .field select { height: 48px; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0 14px; font-size: 15px; background: #fff; color: #0f172a; transition: .15s; outline: none; width: 100%; font-family: inherit; }
.field input:focus, .field select:focus { border-color: #16a34a; box-shadow: 0 0 0 4px rgba(22,163,74,.12); }
.pw { position: relative; }
.pw input { padding-right: 46px; }
.pw-toggle { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: 0; font-size: 17px; cursor: pointer; }
.terms { display: flex; align-items: flex-start; gap: 9px; font-size: 12.5px; color: #475569; line-height: 1.45; }
.terms input { margin-top: 2px; width: 16px; height: 16px; accent-color: #16a34a; flex-shrink: 0; }
.terms a { color: #16a34a; font-weight: 600; text-decoration: none; }
.err { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.submit { height: 52px; border: 0; border-radius: 12px; background: linear-gradient(135deg, #16a34a, #0d9488); color: #fff; font-size: 15.5px; font-weight: 700; cursor: pointer; display: grid; place-items: center; transition: .15s; box-shadow: 0 6px 18px rgba(22,163,74,.28); }
.submit:hover:not(:disabled) { filter: brightness(1.05); transform: translateY(-1px); }
.submit:disabled { opacity: .6; cursor: default; }
.spin { width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: r .7s linear infinite; }
@keyframes r { to { transform: rotate(360deg) } }
.alt { text-align: center; font-size: 14px; color: #64748b; }
.alt a { color: #16a34a; font-weight: 700; text-decoration: none; }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
