-- ================================================
-- CRIAÇÃO DA TABELA DE LOGS DO SISTEMA
-- Sistema GestãoZe - Monitoramento Profissional
-- ================================================

-- Criar tabela de logs se não existir
CREATE TABLE IF NOT EXISTS public.logs (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'system',
    username TEXT NOT NULL DEFAULT 'system',
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical', 'debug')),
    category TEXT NOT NULL DEFAULT 'system' CHECK (category IN ('auth', 'crud', 'system', 'security', 'performance', 'user', 'api', 'database', 'command')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id TEXT,
    execution_time INTEGER, -- em millisegundos
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para otimização de consultas
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON public.logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON public.logs(severity);
CREATE INDEX IF NOT EXISTS idx_logs_category ON public.logs(category);
CREATE INDEX IF NOT EXISTS idx_logs_action ON public.logs(action);
CREATE INDEX IF NOT EXISTS idx_logs_resource ON public.logs(resource);
CREATE INDEX IF NOT EXISTS idx_logs_status ON public.logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_session ON public.logs(session_id);

-- Índices compostos para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_logs_severity_timestamp ON public.logs(severity, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_category_timestamp ON public.logs(category, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_timestamp ON public.logs(user_id, timestamp DESC);

-- Índice para busca de texto em detalhes
CREATE INDEX IF NOT EXISTS idx_logs_details_gin ON public.logs USING GIN (details);
CREATE INDEX IF NOT EXISTS idx_logs_metadata_gin ON public.logs USING GIN (metadata);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_logs_updated_at ON public.logs;
CREATE TRIGGER update_logs_updated_at
    BEFORE UPDATE ON public.logs
    FOR EACH ROW
    EXECUTE FUNCTION update_logs_updated_at();

-- ================================================
-- POLÍTICAS RLS (Row Level Security)
-- ================================================

-- Habilitar RLS
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Política para SELECT - administradores podem ver todos os logs
CREATE POLICY "Admins can view all logs" ON public.logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id::text = auth.uid()::text
            AND admin_users.role IN ('admin', 'manager')
            AND admin_users.is_active = true
        )
    );

-- Política para INSERT - sistema pode inserir logs
CREATE POLICY "System can insert logs" ON public.logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true); -- Permitir inserção para usuários autenticados

-- Política para UPDATE - apenas administradores podem atualizar logs
CREATE POLICY "Admins can update logs" ON public.logs
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id::text = auth.uid()::text
            AND admin_users.role = 'admin'
            AND admin_users.is_active = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id::text = auth.uid()::text
            AND admin_users.role = 'admin'
            AND admin_users.is_active = true
        )
    );

-- Política para DELETE - apenas administradores podem deletar logs antigos
CREATE POLICY "Admins can delete old logs" ON public.logs
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE admin_users.id::text = auth.uid()::text
            AND admin_users.role = 'admin'
            AND admin_users.is_active = true
        )
        AND timestamp < NOW() - INTERVAL '90 days' -- Só permite deletar logs com mais de 90 dias
    );

-- ================================================
-- FUNÇÕES AUXILIARES PARA LOGS
-- ================================================

-- Função para limpeza automática de logs antigos
CREATE OR REPLACE FUNCTION cleanup_old_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.logs
    WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL
    AND EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE admin_users.id::text = auth.uid()::text
        AND admin_users.role = 'admin'
    );

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- Log da operação de limpeza
    INSERT INTO public.logs (
        user_id,
        username,
        action,
        resource,
        details,
        category,
        severity
    ) VALUES (
        COALESCE(auth.uid()::text, 'system'),
        COALESCE((SELECT username FROM public.admin_users WHERE id::text = auth.uid()::text), 'system'),
        'cleanup_old_logs',
        'system_maintenance',
        json_build_object('days_to_keep', days_to_keep, 'deleted_count', deleted_count)::jsonb,
        'system',
        'info'
    );

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para estatísticas de logs
CREATE OR REPLACE FUNCTION get_log_statistics(days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_logs', COUNT(*),
        'error_rate', ROUND((COUNT(*) FILTER (WHERE severity IN ('error', 'critical'))::DECIMAL / COUNT(*)) * 100, 2),
        'warning_rate', ROUND((COUNT(*) FILTER (WHERE severity = 'warning')::DECIMAL / COUNT(*)) * 100, 2),
        'critical_issues', COUNT(*) FILTER (WHERE severity = 'critical'),
        'avg_execution_time', ROUND(AVG(execution_time), 2),
        'top_users', (
            SELECT json_agg(json_build_object('username', username, 'count', cnt))
            FROM (
                SELECT username, COUNT(*) as cnt
                FROM public.logs
                WHERE timestamp >= NOW() - (days || ' days')::INTERVAL
                GROUP BY username
                ORDER BY COUNT(*) DESC
                LIMIT 5
            ) top_users_subquery
        ),
        'severity_distribution', (
            SELECT json_object_agg(severity, cnt)
            FROM (
                SELECT severity, COUNT(*) as cnt
                FROM public.logs
                WHERE timestamp >= NOW() - (days || ' days')::INTERVAL
                GROUP BY severity
            ) severity_subquery
        ),
        'category_distribution', (
            SELECT json_object_agg(category, cnt)
            FROM (
                SELECT category, COUNT(*) as cnt
                FROM public.logs
                WHERE timestamp >= NOW() - (days || ' days')::INTERVAL
                GROUP BY category
            ) category_subquery
        )
    ) INTO result
    FROM public.logs
    WHERE timestamp >= NOW() - (days || ' days')::INTERVAL
    AND EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE admin_users.id::text = auth.uid()::text
        AND admin_users.role IN ('admin', 'manager')
    );

    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- DADOS INICIAIS DE EXEMPLO (OPCIONAL)
-- ================================================

-- Inserir alguns logs iniciais para demonstração
INSERT INTO public.logs (
    user_id,
    username,
    action,
    resource,
    details,
    category,
    severity,
    status
) VALUES
    ('system', 'system', 'table_created', 'database', '{"table": "logs", "columns": 16}', 'system', 'info', 'success'),
    ('system', 'system', 'indexes_created', 'database', '{"indexes": 8, "performance": "optimized"}', 'system', 'info', 'success'),
    ('system', 'system', 'rls_enabled', 'security', '{"policies": 4, "security_level": "high"}', 'security', 'info', 'success'),
    ('system', 'system', 'functions_created', 'database', '{"functions": 3, "type": "utility"}', 'system', 'info', 'success')
ON CONFLICT DO NOTHING;

-- ================================================
-- COMENTÁRIOS SOBRE A ESTRUTURA
-- ================================================

COMMENT ON TABLE public.logs IS 'Tabela de logs do sistema para auditoria e monitoramento profissional';
COMMENT ON COLUMN public.logs.id IS 'Identificador único do log';
COMMENT ON COLUMN public.logs.user_id IS 'ID do usuário que executou a ação';
COMMENT ON COLUMN public.logs.username IS 'Nome de usuário para facilitar consultas';
COMMENT ON COLUMN public.logs.action IS 'Ação executada (ex: login, create_product, delete_user)';
COMMENT ON COLUMN public.logs.resource IS 'Recurso afetado (ex: users, products, database)';
COMMENT ON COLUMN public.logs.resource_id IS 'ID do recurso específico afetado';
COMMENT ON COLUMN public.logs.details IS 'Detalhes da ação em formato JSON';
COMMENT ON COLUMN public.logs.severity IS 'Nível de severidade: info, warning, error, critical, debug';
COMMENT ON COLUMN public.logs.category IS 'Categoria da ação: auth, crud, system, security, etc';
COMMENT ON COLUMN public.logs.execution_time IS 'Tempo de execução da operação em milissegundos';
COMMENT ON COLUMN public.logs.status IS 'Status da operação: success, failed, pending';
COMMENT ON COLUMN public.logs.error_message IS 'Mensagem de erro se status = failed';
COMMENT ON COLUMN public.logs.metadata IS 'Metadados adicionais em formato JSON';

-- ================================================
-- VERIFICAÇÕES FINAIS
-- ================================================

-- Verificar se a tabela foi criada
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'logs' AND table_schema = 'public') THEN
        RAISE NOTICE '✅ Tabela logs criada com sucesso!';
        RAISE NOTICE '📊 Total de índices: %', (SELECT count(*) FROM pg_indexes WHERE tablename = 'logs');
        RAISE NOTICE '🔒 RLS habilitado: %', (SELECT relrowsecurity FROM pg_class WHERE relname = 'logs');
        RAISE NOTICE '📝 Total de registros iniciais: %', (SELECT count(*) FROM public.logs);
    ELSE
        RAISE EXCEPTION '❌ Erro: Tabela logs não foi criada!';
    END IF;
END $$;

-- Mensagens de conclusão do script
DO $$
BEGIN
    RAISE NOTICE '🎉 Setup da tabela de logs concluído com sucesso!';
    RAISE NOTICE '💡 Use as funções get_log_statistics() e cleanup_old_logs() para manutenção.';
END $$;