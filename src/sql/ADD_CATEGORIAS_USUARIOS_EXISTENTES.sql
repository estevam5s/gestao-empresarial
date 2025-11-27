-- ====================================================================
-- ADICIONAR CATEGORIAS PADRÃO PARA USUÁRIOS EXISTENTES
-- ====================================================================
-- Execute este script DEPOIS de executar SETUP_COMPLETO_ISOLAMENTO.sql
-- e DEPOIS de criar seus usuários
-- ====================================================================

DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Para cada usuário existente
  FOR user_record IN (SELECT id, username FROM admin_users) LOOP
    -- Verificar se o usuário já tem categorias
    IF NOT EXISTS (SELECT 1 FROM categorias WHERE tenant_id = user_record.id) THEN
      -- Criar categorias padrão
      INSERT INTO categorias (nome, icone, tenant_id, ativo) VALUES
        ('Bebidas', '🥤', user_record.id, true),
        ('Comidas', '🍔', user_record.id, true),
        ('Sobremesas', '🍰', user_record.id, true),
        ('Lanches', '🥪', user_record.id, true),
        ('Pratos Principais', '🍽️', user_record.id, true),
        ('Entradas', '🥗', user_record.id, true),
        ('Cafeteria', '☕', user_record.id, true),
        ('Drinks', '🍹', user_record.id, true);

      RAISE NOTICE 'Categorias criadas para usuário: %', user_record.username;
    ELSE
      RAISE NOTICE 'Usuário % já possui categorias', user_record.username;
    END IF;
  END LOOP;

  RAISE NOTICE '';
  RAISE NOTICE '✓✓✓ CATEGORIAS CRIADAS COM SUCESSO! ✓✓✓';
  RAISE NOTICE '';
END $$;
