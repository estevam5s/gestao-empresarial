<template>
  <div class="support-widget" :class="{ open }">
    <button class="launcher" @click="toggle" title="Falar com o suporte">
      <span class="glow"></span>
      <img :src="logoSrc" alt="logo" />
      <span class="label">Suporte</span>
    </button>

    <div v-if="open" class="panel">
      <header class="panel-header">
        <div class="title">
          <img :src="logoSrc" alt="logo" />
          <div class="text">
            <h3>Chat de Suporte</h3>
            <small v-if="!supportUserId" class="warn">Configure VITE_SUPPORT_USER_ID</small>
          </div>
        </div>
        <div class="actions">
          <button v-if="activeId" class="btn danger" @click="confirmDelete">Apagar</button>
          <button class="btn ghost" @click="toggle">Minimizar</button>
        </div>
      </header>

      <main class="panel-body">
        <div v-if="!activeId && !loading" class="welcome">
          <div class="hero">
            <img :src="logoSrc" alt="logo" />
            <h4>Bem-vindo ao Suporte</h4>
            <p>Converse com nosso time para tirar dúvidas, reportar problemas e acompanhar o histórico.</p>
          </div>
          <ul class="steps">
            <li><strong>1.</strong> Clique em <em>Iniciar conversa</em></li>
            <li><strong>2.</strong> Escreva sua mensagem e envie</li>
            <li><strong>3.</strong> Acompanhe respostas em tempo real</li>
          </ul>
          <button class="btn primary" :disabled="!supportUserId" @click="startConversation">Iniciar conversa</button>
        </div>

        <div v-else class="thread" ref="threadRef">
          <div v-for="m in messages" :key="m.id" class="message" :class="m.sender_role">
            <div class="bubble">
              <div class="content">{{ m.content }}</div>
              <div class="time">{{ formatTime(m.created_at) }}</div>
            </div>
          </div>
        </div>
      </main>

      <footer class="composer" v-if="activeId">
        <input v-model="draft" type="text" placeholder="Digite sua mensagem..." @keydown.enter.prevent="send" />
        <button class="btn primary" :disabled="!draft.trim()" @click="send">Enviar</button>
      </footer>

      <div class="support-panel-entry">
        <span>Precisa de recursos avançados?</span>
        <button class="link" @click="openSupportPanel">Entrar no painel do suporte</button>
      </div>
    </div>
    <Teleport to="body">
      <SupportAuthModal :open="supportAuthOpen" @close="supportAuthOpen=false" @success="goSupport" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSupportAuthStore } from '@/stores/supportAuth'
import { supportChatService, type SupportMessage } from '@/services/supportChatService'
import SupportAuthModal from '@/components/support/SupportAuthModal.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ logo?: string }>()

const open = ref(false)
const loading = ref(false)
const threadRef = ref<HTMLElement | null>(null)
const conversations = ref<any[]>([])
const messages = ref<SupportMessage[]>([])
const activeId = ref('')
const draft = ref('')
const supportAuthOpen = ref(false)
const router = useRouter()
let unsubscribe: (() => void) | null = null

const auth = useAuthStore()
const supportAuth = useSupportAuthStore()
supportAuth.restore()

const supportUserId = (import.meta as any).env?.VITE_SUPPORT_USER_ID || ''
const logoSrc = props.logo || '/restaurante.jpeg'

function toggle() { open.value = !open.value }

function scrollToBottom() {
  requestAnimationFrame(() => {
    const el = threadRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

async function loadConversations() {
  loading.value = true
  const uid = auth.user?.id
  if (!uid) { loading.value = false; return }
  conversations.value = await supportChatService.listConversations(uid)
  loading.value = false
}

async function startConversation() {
  if (!supportUserId) return
  const adminId = auth.user?.id
  if (!adminId) return
  const id = await supportChatService.createConversation('Suporte', adminId, supportUserId)
  await loadConversations()
  await openConversation(id)
}

async function openConversation(id: string) {
  activeId.value = id
  messages.value = await supportChatService.getMessages(id)
  if (unsubscribe) unsubscribe()
  unsubscribe = supportChatService.onMessages(id, (msg) => { messages.value.push(msg); scrollToBottom() })
  scrollToBottom()
}

async function send() {
  const content = draft.value.trim()
  if (!content || !activeId.value) return
  const senderId = auth.user?.id!
  await supportChatService.sendMessage(activeId.value, senderId, 'admin', content)
  draft.value = ''
}

function formatTime(s: string) {
  const d = new Date(s); return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  await loadConversations()
  if (conversations.value[0]) openConversation(conversations.value[0].id)
})

onBeforeUnmount(() => { if (unsubscribe) unsubscribe() })

watch(open, (v) => { if (v) scrollToBottom() })

function confirmDelete() {
  if (!activeId.value) return
  if (confirm('Deseja apagar esta conversa?')) {
    deleteConversation()
  }
}

async function deleteConversation() {
  if (!activeId.value) return
  await supportChatService.deleteConversation(activeId.value)
  activeId.value = ''
  messages.value = []
  await loadConversations()
}

function openSupportPanel() {
  supportAuthOpen.value = true
}

function goSupport() {
  supportAuthOpen.value = false
  router.push('/support')
}
</script>

<style scoped>
.support-widget { position: fixed; right: 24px; bottom: 24px; z-index: 1200; }
.launcher { position: relative; display:flex; align-items:center; gap:10px; padding: 12px 16px; border-radius: 999px; border:none; cursor:pointer; background: linear-gradient(135deg, #fff, #f8fafc); box-shadow: 0 12px 36px rgba(17,24,39,.15); }
.launcher .glow { position:absolute; inset:-6px; border-radius:999px; background: radial-gradient(circle at 20% 50%, rgba(102,126,234,.35), transparent 40%); filter: blur(8px); z-index:-1 }
.launcher img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border:2px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,.15) }
.launcher .label { font-weight: 900; color: #111827; letter-spacing: .2px }
.support-widget.open .launcher { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(0,0,0,.2) }

.panel { width: 380px; height: 560px; background: var(--theme-surface); border:1px solid var(--theme-border); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,.25); margin-top: 12px; backdrop-filter: blur(6px) }
.panel-header { display:flex; align-items:center; justify-content:space-between; padding: 10px 12px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff }
.panel-header .title { display:flex; align-items:center; gap: 10px; }
.panel-header img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border:2px solid rgba(255,255,255,.8) }
.panel-header h3 { margin:0; font-size: 14px; letter-spacing:.2px }
.panel-header .warn { color: #fde68a }
.panel-header .btn { padding: 6px 10px; border-radius: 8px; background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.35); color:#fff; cursor:pointer }
.panel-body { height: 430px; background: radial-gradient(ellipse at 20% 10%, rgba(102,126,234,.06), transparent 60%), var(--theme-background); }
.welcome { padding: 18px; display:flex; flex-direction:column; gap:14px; height:100%; align-items:center; justify-content:center; text-align:center }
.welcome .hero img { width: 54px; height: 54px; border-radius:50%; border:2px solid rgba(0,0,0,.06) }
.welcome .hero h4 { margin: 8px 0 4px 0 }
.welcome .steps { list-style:none; padding:0; margin: 10px 0 4px 0; color: var(--theme-text-secondary) }
.welcome .steps li { margin: 4px 0 }
.empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; height:100%; color: var(--theme-text-secondary) }
.btn.primary { padding: 10px 12px; border-radius:10px; background: linear-gradient(135deg, #667eea, #764ba2); color:#fff; border:none; cursor:pointer }
.thread { height:100%; padding: 12px; overflow:auto; display:flex; flex-direction:column; gap:8px }
.message { display:flex }
.message.admin { justify-content:flex-end }
.bubble { max-width: 75%; background: var(--theme-surface); border:1px solid var(--theme-border); border-radius: 12px; padding: 8px 10px; box-shadow: 0 8px 20px rgba(0,0,0,.06) }
.admin .bubble { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border:none }
.time { font-size: 10px; opacity:.8; margin-top:4px; text-align:right }
.composer { display:flex; gap:8px; padding: 10px; border-top:1px solid var(--theme-border); background: var(--theme-surface) }
.composer input { flex:1; padding: 10px 12px; border-radius: 10px; border:1px solid var(--theme-border); background: var(--theme-background) }
.support-panel-entry { display:flex; align-items:center; justify-content:center; gap:6px; padding: 8px; font-size: 12px; color: var(--theme-text-secondary) }
.support-panel-entry .link { background: none; border: none; color: #6366f1; font-weight: 800; cursor: pointer; }
</style>
