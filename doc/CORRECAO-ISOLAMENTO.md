# 🔒 CORREÇÃO DO ISOLAMENTO DE DADOS

## 📋 Problema Identificado

Mesmo com as políticas RLS criadas, os dados ainda estão sendo compartilhados entre diferentes usuários porque:

1. **Políticas antigas permitiam acesso quando `tenant_id` era NULL**
   - As políticas tinham a condição: `OR (current_user_tenant_id() IS NULL)`
   - Isso criava uma brecha de segurança fatal

2. **`tenant_id` só era configurado no login**
   - A função `set_current_tenant()` era chamada apenas no `authService.login()`
   - Ao recarregar a página ou navegar, o `tenant_id` não era reconfigurado
   - Resultado: `current_user_tenant_id()` retornava NULL → todos os dados visíveis

## ✅ Solução Completa

### Passo 1: Aplicar as Políticas Corrigidas

Execute o arquivo `politica-melhoria.sql` no Supabase SQL Editor:

```bash
# O arquivo politica-melhoria.sql contém:
- Políticas restritivas (SEM exceção para NULL)
- RLS ativado para produtos e menu_items
- Cada operação (SELECT, INSERT, UPDATE, DELETE) tem sua própria política
```

### Passo 2: Corrigir o Router (CRÍTICO!)

Edite o arquivo `src/router/index.ts` e adicione a configuração do tenant_id no router guard:

**Localização:** Linha 265-288

**Código ANTIGO:**
```typescript
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Check stored session
  const stored = localStorage.getItem('userSession')
  if (stored && !authStore.user) {
    authStore.user = JSON.parse(stored)
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role === 'admin'

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return '/dashboard'
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return '/dashboard'
  }
})
```

**Código NOVO (COPIE E COLE):**
```typescript
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Check stored session
  const stored = localStorage.getItem('userSession')
  if (stored && !authStore.user) {
    authStore.user = JSON.parse(stored)
  }

  // ⭐ CRÍTICO: Configurar tenant_id na sessão PostgreSQL
  // Isso garante isolamento de dados em TODAS as requisições
  if (authStore.user?.id) {
    try {
      const { supabase } = await import('@/config/supabase')
      await supabase.rpc('set_current_tenant', { tenant_uuid: authStore.user.id })
      console.log('✓ Tenant configurado:', authStore.user.id)
    } catch (error) {
      console.error('⚠️ Erro ao configurar tenant:', error)
    }
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role === 'admin'

  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return '/dashboard'
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return '/dashboard'
  }
})
```

### Passo 3: Verificar Configuração do Supabase

Certifique-se de que as funções RPC estão criadas corretamente:

```sql
-- Verificar se as funções existem
SELECT proname FROM pg_proc WHERE proname IN ('set_current_tenant', 'current_user_tenant_id');

-- Devem aparecer ambas as funções
```

## 🧪 Como Testar

1. **Execute o SQL de correção:**
   ```sql
   -- No Supabase SQL Editor
   -- Cole e execute todo o conteúdo de: politica-melhoria.sql
   ```

2. **Atualize o código do router:**
   - Edite `src/router/index.ts`
   - Adicione a configuração do tenant_id conforme mostrado acima

3. **Limpe o cache e teste:**
   ```bash
   # Limpar localStorage do navegador
   # Pressione F12 → Application → Storage → Clear site data

   # Ou via console do navegador:
   localStorage.clear()

   # Reinicie o servidor
   npm run dev
   ```

4. **Teste com dois usuários:**
   ```
   Conta 1: rebeca@gmail.com
   - Fazer login
   - Adicionar produto no /inventory
   - Fazer logout

   Conta 2: joao@gmail.com
   - Fazer login
   - Acessar /inventory
   - ✅ NÃO deve ver os produtos da Rebeca
   - Adicionar seu próprio produto
   - Fazer logout

   Conta 1: rebeca@gmail.com
   - Fazer login novamente
   - Acessar /inventory
   - ✅ Deve ver APENAS seus produtos (não os do João)
   ```

## 🔍 Debug

Se ainda houver problemas, abra o console do navegador e verifique:

```javascript
// Verificar se tenant está sendo configurado
// Você deve ver logs: "✓ Tenant configurado: [UUID]"

// Testar manualmente (cole no console):
const { supabase } = await import('/src/config/supabase.ts')
const user = JSON.parse(localStorage.getItem('userSession'))
await supabase.rpc('set_current_tenant', { tenant_uuid: user.id })
console.log('Tenant configurado:', user.id)

// Testar consulta
const { data, error } = await supabase.from('produtos').select('*')
console.log('Produtos:', data)
console.log('Erro:', error)
```

## ⚠️ Problemas Comuns

### Problema: "Ainda vejo dados de outros usuários"
**Solução:**
1. Confirme que executou `politica-melhoria.sql` no Supabase
2. Verifique se o código do router foi atualizado corretamente
3. Limpe o localStorage: `localStorage.clear()`
4. Reinicie o servidor: `npm run dev`

### Problema: "Erro: function set_current_tenant does not exist"
**Solução:**
1. Execute o arquivo `sql/scheme1.sql` completo no Supabase
2. As funções `set_current_tenant` e `current_user_tenant_id` devem ser criadas

### Problema: "Não consigo inserir dados"
**Solução:**
1. Verifique se o tenant_id está sendo configurado (veja logs no console)
2. Certifique-se de que o trigger `auto_set_tenant_id` existe nas tabelas

## 📊 Verificação Final

Execute no Supabase SQL Editor para confirmar que tudo está correto:

```sql
-- Verificar políticas de produtos
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'produtos'
ORDER BY policyname;

-- Verificar políticas de menu_items
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'menu_items'
ORDER BY policyname;

-- Verificar RLS ativo
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('produtos', 'menu_items');

-- Resultado esperado: rowsecurity = true para ambas
```

## ✅ Checklist de Implementação

- [ ] Executar `politica-melhoria.sql` no Supabase
- [ ] Atualizar `src/router/index.ts` com o código corrigido
- [ ] Limpar localStorage do navegador
- [ ] Reiniciar servidor de desenvolvimento
- [ ] Testar com dois usuários diferentes
- [ ] Verificar que cada usuário vê apenas seus próprios dados
- [ ] Confirmar que não é possível editar/deletar dados de outros usuários

## 🎉 Resultado Esperado

Após aplicar todas as correções:

- ✅ Cada usuário vê APENAS seus próprios dados
- ✅ Impossível acessar dados de outros usuários
- ✅ Impossível editar/deletar dados de outros usuários
- ✅ Isolamento total entre contas (multi-tenant)
- ✅ Segurança garantida por Row Level Security (RLS)
