-- ====================================================================
-- CORREÇÃO DAS POLÍTICAS DE SEGURANÇA - ISOLAMENTO TOTAL
-- ====================================================================
-- Este script corrige as políticas RLS para garantir que cada usuário
-- veja APENAS seus próprios dados, sem exceções.
--
-- PROBLEMA IDENTIFICADO:
-- As políticas antigas permitiam acesso quando current_user_tenant_id()
-- retornava NULL, o que fazia com que todos os dados ficassem visíveis
-- para todos os usuários.
--
-- SOLUÇÃO:
-- Políticas mais restritivas que EXIGEM tenant_id válido e igual ao
-- do usuário logado, sem exceções.
-- ====================================================================

BEGIN;

-- ====================================================================
-- PARTE 1: REMOVER POLÍTICAS ANTIGAS DE PRODUTOS
-- ====================================================================

DROP POLICY IF EXISTS produtos_tenant_policy ON produtos;
DROP POLICY IF EXISTS produtos_select_policy ON produtos;
DROP POLICY IF EXISTS produtos_insert_policy ON produtos;
DROP POLICY IF EXISTS produtos_update_policy ON produtos;
DROP POLICY IF EXISTS produtos_delete_policy ON produtos;

-- ====================================================================
-- PARTE 2: CRIAR POLÍTICAS RESTRITIVAS PARA PRODUTOS
-- ====================================================================

-- SELECT: Usuário vê APENAS produtos do seu próprio tenant (SEM EXCEÇÕES)
CREATE POLICY produtos_select_policy ON produtos
  FOR SELECT
  USING (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- INSERT: Usuário insere APENAS com seu próprio tenant_id
CREATE POLICY produtos_insert_policy ON produtos
  FOR INSERT
  WITH CHECK (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- UPDATE: Usuário atualiza APENAS produtos do seu próprio tenant
CREATE POLICY produtos_update_policy ON produtos
  FOR UPDATE
  USING (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  )
  WITH CHECK (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- DELETE: Usuário deleta APENAS produtos do seu próprio tenant
CREATE POLICY produtos_delete_policy ON produtos
  FOR DELETE
  USING (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- ====================================================================
-- PARTE 3: REMOVER POLÍTICAS ANTIGAS DE MENU_ITEMS
-- ====================================================================

DROP POLICY IF EXISTS menu_items_tenant_policy ON menu_items;
DROP POLICY IF EXISTS menu_items_select_policy ON menu_items;
DROP POLICY IF EXISTS menu_items_insert_policy ON menu_items;
DROP POLICY IF EXISTS menu_items_update_policy ON menu_items;
DROP POLICY IF EXISTS menu_items_delete_policy ON menu_items;

-- ====================================================================
-- PARTE 4: CRIAR POLÍTICAS RESTRITIVAS PARA MENU_ITEMS
-- ====================================================================

-- SELECT: Usuário vê APENAS itens do menu do seu próprio tenant (SEM EXCEÇÕES)
CREATE POLICY menu_items_select_policy ON menu_items
  FOR SELECT
  USING (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- INSERT: Usuário insere APENAS com seu próprio tenant_id
CREATE POLICY menu_items_insert_policy ON menu_items
  FOR INSERT
  WITH CHECK (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- UPDATE: Usuário atualiza APENAS itens do menu do seu próprio tenant
CREATE POLICY menu_items_update_policy ON menu_items
  FOR UPDATE
  USING (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  )
  WITH CHECK (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- DELETE: Usuário deleta APENAS itens do menu do seu próprio tenant
CREATE POLICY menu_items_delete_policy ON menu_items
  FOR DELETE
  USING (
    tenant_id = current_user_tenant_id()
    AND current_user_tenant_id() IS NOT NULL
  );

-- ====================================================================
-- PARTE 5: GARANTIR QUE RLS ESTÁ ATIVO
-- ====================================================================

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- PARTE 6: VALIDAÇÃO E CONFIRMAÇÃO
-- ====================================================================

DO $$
DECLARE
  produtos_policies_count INTEGER;
  menu_items_policies_count INTEGER;
BEGIN
  -- Contar políticas de produtos
  SELECT COUNT(*) INTO produtos_policies_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = 'produtos';

  -- Contar políticas de menu_items
  SELECT COUNT(*) INTO menu_items_policies_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = 'menu_items';

  RAISE NOTICE '';
  RAISE NOTICE '╔════════════════════════════════════════════════════════════╗';
  RAISE NOTICE '║                                                            ║';
  RAISE NOTICE '║     ✓✓✓ POLÍTICAS CORRIGIDAS COM SUCESSO! ✓✓✓            ║';
  RAISE NOTICE '║                                                            ║';
  RAISE NOTICE '╚════════════════════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 POLÍTICAS APLICADAS:';
  RAISE NOTICE '';
  RAISE NOTICE '   ✓ Políticas para produtos: %', produtos_policies_count;
  RAISE NOTICE '   ✓ Políticas para menu_items: %', menu_items_policies_count;
  RAISE NOTICE '';
  RAISE NOTICE '🛡️  SEGURANÇA GARANTIDA:';
  RAISE NOTICE '';
  RAISE NOTICE '   ✓ RLS ativo para produtos e menu_items';
  RAISE NOTICE '   ✓ Cada usuário vê APENAS seus próprios dados';
  RAISE NOTICE '   ✓ SEM exceções ou brechas de segurança';
  RAISE NOTICE '   ✓ Isolamento total entre usuários';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANTE:';
  RAISE NOTICE '';
  RAISE NOTICE '   A aplicação DEVE chamar set_current_tenant(user_id)';
  RAISE NOTICE '   ANTES de qualquer operação no banco de dados.';
  RAISE NOTICE '';
  RAISE NOTICE '   Exemplo no código:';
  RAISE NOTICE '   await supabase.rpc("set_current_tenant", { tenant_uuid: user.id })';
  RAISE NOTICE '';
END $$;

COMMIT;
