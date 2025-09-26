import { supabase } from '@/config/supabase'

export interface SupportConversation {
  id: string
  subject: string
  created_at: string
  status: 'open' | 'closed'
}

export interface SupportMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_role: 'admin' | 'support'
  content: string
  created_at: string
}

export const supportChatService = {
  async createConversation(subject: string, adminId: string, supportId: string) {
    const { data, error } = await supabase.from('support_conversations').insert({ subject, status: 'open' }).select('id').single()
    if (error) throw error
    const convId = data.id
    await supabase.from('support_participants').insert([
      { conversation_id: convId, user_id: adminId, role: 'admin' },
      { conversation_id: convId, user_id: supportId, role: 'support' }
    ])
    return convId as string
  },

  async listConversations(userId: string) {
    const { data, error } = await supabase
      .from('support_conversations')
      .select('id, subject, status, created_at, support_participants!inner(user_id)')
      .order('created_at', { ascending: false })
    if (error) throw error
    // Filter by participant
    return (data || []).filter((row: any) => row.support_participants.some((p: any) => p.user_id === userId))
      .map((r: any) => ({ id: r.id, subject: r.subject, status: r.status, created_at: r.created_at }))
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return (data || []) as SupportMessage[]
  },

  async sendMessage(conversationId: string, senderId: string, senderRole: 'admin' | 'support', content: string) {
    const { data, error } = await supabase.from('support_messages').insert({ conversation_id: conversationId, sender_id: senderId, sender_role: senderRole, content }).select('*').single()
    if (error) throw error
    return data as SupportMessage
  },

  async deleteConversation(conversationId: string) {
    const { error } = await supabase
      .from('support_conversations')
      .delete()
      .eq('id', conversationId)
    if (error) throw error
    return true
  },

  onMessages(conversationId: string, cb: (msg: SupportMessage) => void) {
    const channel = supabase.channel(`support_messages_${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        cb(payload.new as SupportMessage)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }
}
