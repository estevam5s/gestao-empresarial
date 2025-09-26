/**
 * Utilitário para debug do sistema de avatar
 * Usar no console do navegador para diagnosticar problemas
 */

import { supabase, DB_TABLES } from '@/config/supabase'
import { authService } from '@/services/authService'

export class AvatarDebug {

  /**
   * Verifica se a coluna avatar_url existe na tabela admin_users
   */
  static async checkAvatarColumn() {
    try {
      console.log('🔍 Verificando estrutura da tabela admin_users...')

      const user = authService.getCurrentUser()
      if (!user) {
        console.error('❌ Usuário não autenticado')
        return false
      }

      // Tentar buscar os dados do usuário incluindo avatar_url
      const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select('id, name, email, avatar_url, updated_at')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar dados do usuário:', error)

        if (error.message.includes('avatar_url')) {
          console.log('⚠️ PROBLEMA ENCONTRADO: Coluna avatar_url não existe!')
          console.log('💡 SOLUÇÃO: Execute o SQL abaixo no Supabase SQL Editor:')
          console.log(`
ALTER TABLE ${DB_TABLES.USERS}
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Verificar se foi adicionada
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = '${DB_TABLES.USERS}'
  AND column_name = 'avatar_url';
          `)
          return false
        }
        return false
      }

      console.log('✅ Estrutura da tabela OK')
      console.log('👤 Dados atuais do usuário:', data)

      return true
    } catch (error) {
      console.error('❌ Erro na verificação:', error)
      return false
    }
  }

  /**
   * Verifica se o bucket user-avatars existe
   */
  static async checkAvatarBucket() {
    try {
      console.log('🪣 Verificando bucket de avatars...')

      const { data: buckets, error } = await supabase.storage.listBuckets()

      if (error) {
        console.error('❌ Erro ao listar buckets:', error)
        return false
      }

      const avatarBucket = buckets?.find(bucket => bucket.id === 'user-avatars')

      if (!avatarBucket) {
        console.log('⚠️ PROBLEMA ENCONTRADO: Bucket user-avatars não existe!')
        console.log('💡 SOLUÇÃO: Execute o SQL abaixo no Supabase SQL Editor:')
        console.log(`
-- Criar bucket para avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  5242880,
  '["image/jpeg", "image/png", "image/webp"]'
)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de acesso
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'user-avatars');

CREATE POLICY "Allow users to update own avatars" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Allow users to delete own avatars" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'user-avatars');
        `)
        return false
      }

      console.log('✅ Bucket user-avatars existe:', avatarBucket)
      return true
    } catch (error) {
      console.error('❌ Erro na verificação do bucket:', error)
      return false
    }
  }

  /**
   * Testa o upload de um avatar de exemplo
   */
  static async testAvatarUpload() {
    try {
      console.log('🧪 Iniciando teste de upload...')

      const user = authService.getCurrentUser()
      if (!user) {
        console.error('❌ Usuário não autenticado')
        return false
      }

      // Criar um arquivo de teste (imagem 1x1 pixel em base64)
      const testImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

      // Converter base64 para File
      const byteString = atob(testImageBase64.split(',')[1])
      const mimeString = testImageBase64.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const testFile = new File([ab], 'test-avatar.jpg', { type: mimeString })

      console.log('📤 Fazendo upload do arquivo de teste...')

      const fileName = `test_${user.id}_${Date.now()}.jpg`
      const filePath = `test/${fileName}`

      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, testFile)

      if (error) {
        console.error('❌ Erro no upload de teste:', error)
        return false
      }

      console.log('✅ Upload de teste bem-sucedido:', data)

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath)

      console.log('🔗 URL pública gerada:', publicUrl)

      // Limpar arquivo de teste
      await supabase.storage
        .from('user-avatars')
        .remove([filePath])

      console.log('🗑️ Arquivo de teste removido')
      return true

    } catch (error) {
      console.error('❌ Erro no teste de upload:', error)
      return false
    }
  }

  /**
   * Executa todos os testes de diagnóstico
   */
  static async runFullDiagnostic() {
    console.log('🔬 === DIAGNÓSTICO COMPLETO DO SISTEMA DE AVATAR ===')
    console.log('')

    const results = {
      columnCheck: await this.checkAvatarColumn(),
      bucketCheck: await this.checkAvatarBucket(),
      uploadTest: false
    }

    if (results.columnCheck && results.bucketCheck) {
      results.uploadTest = await this.testAvatarUpload()
    }

    console.log('')
    console.log('📊 === RESULTADO DO DIAGNÓSTICO ===')
    console.log('Coluna avatar_url:', results.columnCheck ? '✅ OK' : '❌ FALHA')
    console.log('Bucket user-avatars:', results.bucketCheck ? '✅ OK' : '❌ FALHA')
    console.log('Teste de upload:', results.uploadTest ? '✅ OK' : '❌ FALHA')

    const allOk = Object.values(results).every(Boolean)

    console.log('')
    if (allOk) {
      console.log('🎉 DIAGNÓSTICO: Tudo funcionando corretamente!')
      console.log('💡 Se ainda há problemas, verifique as permissões RLS do Supabase')
    } else {
      console.log('⚠️ DIAGNÓSTICO: Problemas encontrados!')
      console.log('💡 Execute as correções indicadas acima')
    }

    return results
  }

  /**
   * Força sincronização do avatar atual
   */
  static async syncCurrentAvatar() {
    try {
      console.log('🔄 Sincronizando avatar atual...')

      const user = authService.getCurrentUser()
      if (!user) {
        console.error('❌ Usuário não autenticado')
        return false
      }

      const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('❌ Erro ao buscar avatar:', error)
        return false
      }

      console.log('📸 Avatar atual no banco:', data.avatar_url || 'Nenhum')

      // Atualizar store local se necessário
      const { useAuthStore } = await import('@/stores/auth')
      const authStore = useAuthStore()

      if (authStore.user && data.avatar_url !== authStore.user.avatar_url) {
        authStore.updateUser({ avatar_url: data.avatar_url })
        console.log('✅ Store local atualizado')
      }

      return true
    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
      return false
    }
  }
}

// Tornar disponível globalmente para debug
declare global {
  interface Window {
    AvatarDebug: typeof AvatarDebug
  }
}

if (typeof window !== 'undefined') {
  window.AvatarDebug = AvatarDebug
}

export default AvatarDebug