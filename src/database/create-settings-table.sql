-- Criar tabela de configurações do app
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section VARCHAR(50) NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section)
);

-- Comentários para documentação
COMMENT ON TABLE app_settings IS 'Configurações do aplicativo por usuário';
COMMENT ON COLUMN app_settings.user_id IS 'ID do usuário dono das configurações';
COMMENT ON COLUMN app_settings.section IS 'Seção das configurações (general, inventory, etc)';
COMMENT ON COLUMN app_settings.settings IS 'Dados JSON das configurações da seção';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON app_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_app_settings_section ON app_settings(section);
CREATE INDEX IF NOT EXISTS idx_app_settings_user_section ON app_settings(user_id, section);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) para segurança
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Política de segurança: usuários só podem acessar suas próprias configurações
DROP POLICY IF EXISTS "Users can only access their own settings" ON app_settings;
CREATE POLICY "Users can only access their own settings" ON app_settings
  FOR ALL USING (auth.uid() = user_id);

-- Política adicional para inserção
DROP POLICY IF EXISTS "Users can insert their own settings" ON app_settings;
CREATE POLICY "Users can insert their own settings" ON app_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política adicional para atualização
DROP POLICY IF EXISTS "Users can update their own settings" ON app_settings;
CREATE POLICY "Users can update their own settings" ON app_settings
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Política adicional para exclusão
DROP POLICY IF EXISTS "Users can delete their own settings" ON app_settings;
CREATE POLICY "Users can delete their own settings" ON app_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Inserir configurações padrão (opcional)
-- Esta parte será executada pelo código JavaScript quando o usuário fizer login

SELECT 'Tabela app_settings criada com sucesso!' as resultado;