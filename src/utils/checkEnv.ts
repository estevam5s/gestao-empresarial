/**
 * Verificação de Variáveis de Ambiente
 *
 * Este arquivo valida se todas as variáveis de ambiente necessárias
 * estão configuradas corretamente.
 */

interface EnvCheck {
  name: string
  value: string | undefined
  required: boolean
  status: 'ok' | 'missing' | 'invalid'
  message: string
}

export function checkEnvironmentVariables(): EnvCheck[] {
  const checks: EnvCheck[] = []

  // Verificar VITE_SUPABASE_URL
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  checks.push({
    name: 'VITE_SUPABASE_URL',
    value: supabaseUrl,
    required: true,
    status: !supabaseUrl
      ? 'missing'
      : supabaseUrl.includes('kbczpgoajnegfrkfhegf.supabase.co')
        ? 'ok'
        : 'invalid',
    message: !supabaseUrl
      ? '❌ Variável não configurada!'
      : supabaseUrl.includes('kbczpgoajnegfrkfhegf.supabase.co')
        ? `✅ Configurada corretamente: ${supabaseUrl}`
        : `⚠️ URL incorreta! Esperado: https://kbczpgoajnegfrkfhegf.supabase.co, Recebido: ${supabaseUrl}`
  })

  // Verificar VITE_SUPABASE_ANON_KEY
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const expectedKeyPrefix = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY3pwZ29ham5lZ2Zya2ZoZWdmIiwicm9sZSI6ImFub24i'

  checks.push({
    name: 'VITE_SUPABASE_ANON_KEY',
    value: anonKey ? anonKey.substring(0, 50) + '...' : undefined,
    required: true,
    status: !anonKey
      ? 'missing'
      : anonKey.startsWith(expectedKeyPrefix)
        ? 'ok'
        : 'invalid',
    message: !anonKey
      ? '❌ Variável não configurada!'
      : anonKey.startsWith(expectedKeyPrefix)
        ? '✅ Key configurada corretamente'
        : '⚠️ Key incorreta! Não corresponde ao projeto kbczpgoajnegfrkfhegf'
  })

  // Verificar VITE_GEMINI_API_KEY
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY
  checks.push({
    name: 'VITE_GEMINI_API_KEY',
    value: geminiKey ? geminiKey.substring(0, 20) + '...' : undefined,
    required: false,
    status: !geminiKey ? 'missing' : 'ok',
    message: !geminiKey
      ? '⚠️ Variável não configurada (opcional)'
      : '✅ Configurada'
  })

  return checks
}

export function logEnvironmentCheck() {
  console.log('='.repeat(80))
  console.log('🔍 VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE')
  console.log('='.repeat(80))

  const checks = checkEnvironmentVariables()

  checks.forEach(check => {
    console.log(`\n📋 ${check.name}`)
    console.log(`   Status: ${check.status.toUpperCase()}`)
    console.log(`   ${check.message}`)
    if (check.value && check.status === 'ok') {
      console.log(`   Valor: ${check.value}`)
    }
  })

  const hasErrors = checks.some(c => c.required && c.status !== 'ok')
  const hasWarnings = checks.some(c => c.status === 'invalid')

  console.log('\n' + '='.repeat(80))
  if (hasErrors) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não configuradas!')
    console.error('Configure as variáveis no Vercel e faça redeploy.')
  } else if (hasWarnings) {
    console.warn('⚠️ AVISO: Algumas variáveis estão com valores incorretos!')
  } else {
    console.log('✅ Todas as variáveis de ambiente estão configuradas corretamente!')
  }
  console.log('='.repeat(80))

  return { hasErrors, hasWarnings, checks }
}

// Validar no carregamento (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  logEnvironmentCheck()
}
