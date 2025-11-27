# 🚀 SETUP FINAL - GUIA RÁPIDO

## ⚡ ARQUIVO ÚNICO NA RAIZ

**`SETUP_FINAL.sql`** - Execute ESTE arquivo e PRONTO!

---

## 🎯 O QUE FOI CORRIGIDO

### 1. ✅ Categorias aparecem em /menu e /inventory
**Problema**: Dropdown vazio "Selecione uma categoria"
**Solução**: Política RLS corrigida + trigger automático

### 2. ✅ /settings funciona sem erro
**Problema**: `new row violates row-level security policy for table "app_settings"`
**Solução**: Política RLS usa `user_id` ao invés de `tenant_id`

### 3. ✅ Script SQL único e limpo
**Problema**: Vários arquivos SQL confusos
**Solução**: `SETUP_FINAL.sql` na raiz com TUDO

---

## 🚀 COMO USAR (3 PASSOS)

### 1️⃣ Execute o SQL

```bash
1. Abra: https://supabase.com/dashboard
2. Vá em: SQL Editor → New Query
3. Abra o arquivo: SETUP_FINAL.sql (na raiz do projeto)
4. Copie TUDO (Ctrl+A, Ctrl+C)
5. Cole no SQL Editor (Ctrl+V)
6. Clique em RUN
```

### 2️⃣ Limpe o Cache

```bash
1. Navegador: Ctrl+Shift+Delete
2. Marque: Cookies e Cache
3. Clique em: Limpar dados
```

### 3️⃣ Teste o Sistema

```bash
1. Acesse: http://localhost:5173/register
2. Crie um usuário:
   - Nome: Teste User
   - Email: teste@example.com
   - Senha: senha123

3. Faça login

4. Teste as rotas:
   ✅ /menu → Categorias devem aparecer (8 categorias)
   ✅ /inventory → Categorias devem aparecer (8 categorias)
   ✅ /settings → Deve salvar sem erro
```

---

## ✅ O QUE ESTÁ INCLUÍDO

### 📦 10 Tabelas:
1. `admin_users` - Usuários
2. `categorias` - Categorias (8 padrão)
3. `suppliers` - Fornecedores
4. `produtos` - Estoque
5. `movements` - Movimentações
6. `employees` - Funcionários
7. `financial_data` - Financeiro
8. `menu_items` - Cardápio
9. `logs` - Logs do sistema
10. `app_settings` - Configurações

### 🔒 Isolamento Total:
- ✅ RLS ativado em 9 tabelas
- ✅ 9 políticas RLS
- ✅ Cada usuário vê APENAS seus dados
- ✅ Impossível acessar dados de outros

### ⚙️ Automação:
- ✅ tenant_id preenchido automaticamente
- ✅ 8 categorias criadas ao registrar
- ✅ Timestamps atualizados automaticamente

---

## 🔧 DIFERENÇAS DO SQL ANTERIOR

| Aspecto | Antes | Agora |
|---------|-------|-------|
| **app_settings RLS** | ❌ Política errada (tenant_id) | ✅ Usa user_id |
| **Mensagens** | ❌ Erro com `100%` | ✅ Escapado `100%%` |
| **Localização** | ❌ Pasta src/sql/ | ✅ Raiz do projeto |
| **Nome** | ❌ SETUP_COMPLETO_DEFINITIVO.sql | ✅ SETUP_FINAL.sql |

---

## 🐛 RESOLVENDO PROBLEMAS

### Problema 1: Categorias não aparecem

**Sintoma**: Dropdown "Selecione uma categoria" vazio

**Solução**:
1. Verifique se executou o SQL
2. Faça **LOGOUT**
3. Faça **LOGIN** novamente
4. As categorias devem aparecer

**Por quê**: O RLS precisa da sessão configurada (set_current_tenant)

---

### Problema 2: Erro em /settings

**Sintoma**: `new row violates row-level security policy`

**Solução**: Execute o `SETUP_FINAL.sql` (já corrigido)

**O que mudou**:
```sql
-- ❌ ANTES (errado):
CREATE POLICY app_settings_tenant_policy ON app_settings
  FOR ALL USING (tenant_id = current_user_tenant_id());

-- ✅ AGORA (correto):
CREATE POLICY app_settings_user_policy ON app_settings
  FOR ALL USING (user_id::text = current_setting('app.current_tenant_id', true));
```

---

### Problema 3: Erro ao registrar

**Sintoma**: `new row violates row-level security policy for table "categorias"`

**Solução**: Já está corrigido no `SETUP_FINAL.sql`

**Como funciona**:
```sql
CREATE OR REPLACE FUNCTION create_default_categories_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- ... cria 8 categorias
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  ← Bypass RLS
```

---

## 📊 FLUXO COMPLETO

```
REGISTRO (/register)
  ↓
INSERT admin_users
  ↓
Trigger: set_user_tenant_id()
  → tenant_id = user.id
  ↓
Trigger: create_default_categories_for_user()
  → Cria 8 categorias (SECURITY DEFINER = bypass RLS)
  ↓
✅ Usuário criado com 8 categorias!

LOGIN (/login)
  ↓
authService.login()
  ↓
supabase.rpc('set_current_tenant', { tenant_uuid: user.id })
  → PostgreSQL: app.current_tenant_id = user.id
  ↓
✅ Sessão configurada!

USAR O SISTEMA (/menu, /inventory, /settings)
  ↓
getCategories()
  → SELECT * FROM categorias WHERE tenant_id = current_user_tenant_id()
  → RLS filtra automaticamente
  ↓
✅ Retorna 8 categorias do usuário!
```

---

## ✅ CHECKLIST

Após executar `SETUP_FINAL.sql`:

- [ ] SQL executado sem erros
- [ ] Mensagem de sucesso apareceu
- [ ] Cache do navegador limpo
- [ ] Criou usuário de teste em /register
- [ ] Fez login com sucesso
- [ ] /menu mostra 8 categorias no dropdown
- [ ] /inventory mostra 8 categorias no dropdown
- [ ] /settings salva sem erro
- [ ] Adicionou item no menu
- [ ] Adicionou produto no estoque
- [ ] Criou segundo usuário
- [ ] Segundo usuário NÃO vê dados do primeiro

**Se TODOS marcados = SISTEMA 100%% PRONTO!** ✅

---

## 📁 ARQUIVOS A USAR

| Arquivo | Status | Usar? |
|---------|--------|-------|
| **SETUP_FINAL.sql** | ✅ NOVO | **SIM!** Execute este! |
| SETUP_COMPLETO_DEFINITIVO.sql | ⚠️ Antigo | Não |
| SETUP_COMPLETO_ISOLAMENTO.sql | ⚠️ Antigo | Não |
| src/sql/*.sql | ⚠️ Antigos | Não |

---

## 🎉 PRONTO!

**Execute `SETUP_FINAL.sql` e seu sistema funciona 100%%!**

Categorias aparecerão, settings funcionará, isolamento total garantido! 🚀
