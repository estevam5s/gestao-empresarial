<template>
  <div class="support-chat">
    <header class="chat-header">
      <div class="left">
        <MessageSquare :size="22" />
        <h1>Suporte • Chat</h1>
      </div>
      <div class="right">
        <button class="btn ghost" @click="goBack">Voltar</button>
        <button class="btn" @click="startNewConversation">Nova conversa</button>
        <button class="btn danger" @click="logoutSupport">Sair</button>
      </div>
    </header>

    <div class="chat-body">
      <aside class="sidebar">
        <div class="sidebar-header">Conversas</div>
        <div class="conv-list">
          <button v-for="c in conversations" :key="c.id" class="conv-item" :class="{ active: c.id === activeId }" @click="openConversation(c.id)">
            <div class="subject">{{ c.subject }}</div>
            <div class="meta">{{ formatDate(c.created_at) }}</div>
          </button>
        </div>
      </aside>
      <main class="messages">
        <div v-if="!activeId" class="empty">
          <MessageSquare :size="40" />
          <p>Selecione uma conversa ou crie uma nova</p>
        </div>
        <div v-else class="thread">
          <div class="message" v-for="m in messages" :key="m.id" :class="m.sender_role">
            <div class="bubble">
              <div class="content">{{ m.content }}</div>
              <div class="time">{{ formatTime(m.created_at) }}</div>
            </div>
          </div>
        </div>

        <form v-if="activeId" class="composer" @submit.prevent="send">
          <input v-model="draft" type="text" placeholder="Digite sua mensagem..." />
          <button type="submit" class="send-btn" :disabled="!draft.trim()">Enviar</button>
        </form>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSupportAuthStore } from '@/stores/supportAuth'
import { supportChatService, type SupportConversation, type SupportMessage } from '@/services/supportChatService'
import { MessageSquare } from 'lucide-vue-next'

const auth = useAuthStore()
const supportAuth = useSupportAuthStore()
supportAuth.restore()

const conversations = ref<SupportConversation[]>([])
const messages = ref<SupportMessage[]>([])
const activeId = ref<string>('')
const draft = ref('')
let unsubscribe: (() => void) | null = null

async function loadConversations() {
  const uid = supportAuth.user?.id || auth.user?.id
  if (!uid) return
  conversations.value = await supportChatService.listConversations(uid)
}

async function openConversation(id: string) {
  activeId.value = id
  messages.value = await supportChatService.getMessages(id)
  if (unsubscribe) unsubscribe()
  unsubscribe = supportChatService.onMessages(id, (msg) => {
    messages.value.push(msg)
  })
}

async function startNewConversation() {
  const subject = prompt('Assunto da conversa') || 'Suporte'
  const adminId = auth.user?.id
  const supportId = supportAuth.user?.id || auth.user?.id
  if (!adminId || !supportId) return
  const id = await supportChatService.createConversation(subject, adminId, supportId)
  await loadConversations()
  await openConversation(id)
}

async function send() {
  const content = draft.value.trim()
  if (!content || !activeId.value) return
  const senderId = supportAuth.user?.id || auth.user?.id!
  const senderRole: 'admin' | 'support' = supportAuth.user ? 'support' : 'admin'
  await supportChatService.sendMessage(activeId.value, senderId, senderRole, content)
  draft.value = ''
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('pt-BR')
}
function formatTime(s: string) {
  const d = new Date(s); return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadConversations()
})

onBeforeUnmount(() => { if (unsubscribe) unsubscribe() })

function logoutSupport() {
  if (supportAuth.user) {
    supportAuth.signOut()
  }
  // Volta para o dashboard
  window.location.href = '/dashboard'
}

function goBack() { window.history.back() }
</script>

<style scoped>
.support-chat { height: 100vh; display: flex; flex-direction: column; background: var(--theme-background); }
.chat-header { background: linear-gradient(135deg, #667eea, #764ba2); color:#fff; border-bottom: 1px solid var(--theme-border); display:flex; justify-content:space-between; align-items:center; padding: 14px 18px; box-shadow: 0 6px 24px rgba(0,0,0,.15) }
.chat-header .left { display:flex; align-items:center; gap:10px; }
.chat-header h1 { font-size: 18px; margin: 0; font-weight: 800; letter-spacing: .2px }
.chat-header .btn { padding: 8px 12px; border-radius: 8px; border:1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.12); color:#fff; cursor:pointer; backdrop-filter: blur(6px); transition: all .2s ease }
.chat-header .btn:hover { background: rgba(255,255,255,.22) }
.chat-header .btn.ghost { background: transparent; border-color: rgba(255,255,255,.25) }
.chat-header .btn.danger { background: rgba(239,68,68,.2); border-color: rgba(239,68,68,.5) }
.chat-body { flex:1; display:grid; grid-template-columns: 320px 1fr; }
.sidebar { border-right: 1px solid var(--theme-border); background: var(--theme-surface); display:flex; flex-direction:column; }
.sidebar-header { padding: 14px; font-weight: 800; border-bottom:1px solid var(--theme-border) }
.conv-list { padding: 8px; overflow:auto; }
.conv-item { width:100%; text-align:left; background: none; border:1px solid var(--theme-border); border-radius:12px; padding:12px; margin-bottom:10px; cursor:pointer; transition: all .2s ease }
.conv-item.active { border-color: var(--theme-primary); background: rgba(102,126,234,.06); }
.conv-item .subject { font-weight:700; }
.conv-item .meta { font-size: 12px; color: var(--theme-text-secondary); }
.messages { position:relative; display:flex; flex-direction:column; background: radial-gradient(ellipse at 20% 10%, rgba(102,126,234,.08), transparent 60%), var(--theme-background); }
.empty { margin:auto; text-align:center; color: var(--theme-text-secondary); display:flex; flex-direction:column; gap:10px; align-items:center; }
.thread { flex:1; padding: 18px 20px; overflow:auto; display:flex; flex-direction:column; gap:10px; }
.message { display:flex; }
.message.support { justify-content: flex-start; }
.message.admin { justify-content: flex-end; }
.bubble { max-width: 70%; background: var(--theme-surface); border:1px solid var(--theme-border); border-radius: 14px; padding: 10px 12px; box-shadow: 0 6px 16px rgba(0,0,0,.06) }
.admin .bubble { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border: none; }
.content { white-space: pre-wrap; }
.time { font-size: 10px; opacity: .8; margin-top: 6px; text-align:right; }
.composer { border-top: 1px solid var(--theme-border); padding: 12px; display:flex; gap:10px; background: var(--theme-surface) }
.composer input { flex:1; padding: 12px 14px; border-radius: 12px; border:1px solid var(--theme-border); background: var(--theme-background); }
.composer .send-btn { padding: 12px 16px; border-radius: 12px; background: linear-gradient(135deg, #667eea, #764ba2); color:#fff; border: none; cursor:pointer; box-shadow: 0 8px 24px rgba(102,126,234,.3) }
</style>
