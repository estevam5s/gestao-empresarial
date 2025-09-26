<template>
  <div v-if="open" class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <h3><MessageSquare :size="18" /> Acesso de Suporte</h3>
        <button class="close" @click="$emit('close')">×</button>
      </header>
      <form @submit.prevent="submit">
        <label>Email</label>
        <input v-model="email" type="email" required placeholder="suporte@empresa.com" />
        <label>Senha</label>
        <input v-model="password" type="password" required placeholder="••••••" />
        <div class="actions">
          <button type="button" class="btn" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn primary" :disabled="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSupportAuthStore } from '@/stores/supportAuth'
import { MessageSquare } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void, (e: 'success'): void }>()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const store = useSupportAuthStore()

watch(() => props.open, (val) => { if (val) { email.value = ''; password.value=''; error.value='' } })

async function submit() {
  loading.value = true
  error.value = ''
  const ok = await store.signIn(email.value, password.value)
  loading.value = false
  if (ok) {
    emit('success')
    emit('close')
  } else {
    error.value = store.error || 'Falha ao autenticar'
  }
}
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(2px); display:flex; align-items:center; justify-content:center; z-index: 2000; }
.modal { width: 100%; max-width: 420px; background: var(--theme-surface); border:1px solid var(--theme-border); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,.2); }
header { display:flex; align-items:center; justify-content:space-between; padding: 12px 16px; border-bottom:1px solid var(--theme-border); }
h3 { display:flex; gap:8px; align-items:center; margin:0; font-size: 16px; }
.close { background:none; border:none; font-size: 20px; cursor:pointer; color: var(--theme-text-secondary); }
form { padding: 16px; display:flex; flex-direction:column; gap:10px; }
label { font-size:12px; font-weight:700; color: var(--theme-text-secondary) }
input { padding: 10px 12px; border-radius: 8px; border:1px solid var(--theme-border); background: var(--theme-surface); }
.actions { display:flex; gap:8px; justify-content:flex-end; margin-top: 6px; }
.btn { padding: 10px 12px; border-radius:8px; background: var(--theme-surface); border:1px solid var(--theme-border); cursor:pointer; }
.btn.primary { background: var(--theme-primary); color: #fff; border-color: transparent; }
.error { color: #b91c1c; font-size: 12px; margin-top: 6px; }
</style>

