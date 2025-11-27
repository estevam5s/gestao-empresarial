-- ============================================
-- CREATE MISSING TABLES FOR SETTINGS & LOGS
-- ============================================
-- Execute this in Supabase SQL Editor
-- Date: 2025-11-26

-- 1. CREATE LOGS TABLE
-- Stores system activity logs
CREATE TABLE IF NOT EXISTS public.logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying NOT NULL,
  entity_type character varying,
  entity_id uuid,
  description text,
  ip_address inet,
  user_agent text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  username text NOT NULL DEFAULT 'system'::text,
  resource text NOT NULL DEFAULT 'system'::text,
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  severity text NOT NULL DEFAULT 'info'::text,
  category text NOT NULL DEFAULT 'system'::text,
  session_id text,
  execution_time integer,
  status text DEFAULT 'success'::text,
  error_message text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  tenant_id uuid,
  CONSTRAINT logs_pkey PRIMARY KEY (id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_tenant_id ON public.logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_category ON public.logs(category);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON public.logs(severity);

-- 2. CREATE APP_SETTINGS TABLE
-- Stores user-specific application settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  section character varying NOT NULL,
  settings jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  tenant_id uuid,
  CONSTRAINT app_settings_pkey PRIMARY KEY (id),
  -- Unique constraint: one settings record per user per section
  CONSTRAINT app_settings_user_section_unique UNIQUE (user_id, section)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_app_settings_user_id ON public.app_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_app_settings_tenant_id ON public.app_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_app_settings_section ON public.app_settings(section);

-- 3. ENABLE ROW LEVEL SECURITY (optional, currently disabled)
-- ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES (optional, for when RLS is enabled)
/*
-- Logs: users can only see their own logs
CREATE POLICY logs_tenant_isolation ON public.logs
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- App Settings: users can only access their own settings
CREATE POLICY app_settings_user_isolation ON public.app_settings
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);
*/

-- 5. GRANT PERMISSIONS
-- Ensure authenticated users can access these tables
GRANT ALL ON public.logs TO authenticated;
GRANT ALL ON public.app_settings TO authenticated;

-- 6. TRIGGER FOR UPDATED_AT (auto-update timestamp)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to app_settings
DROP TRIGGER IF EXISTS set_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER set_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to logs
DROP TRIGGER IF EXISTS set_logs_updated_at ON public.logs;
CREATE TRIGGER set_logs_updated_at
  BEFORE UPDATE ON public.logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created
SELECT
  tablename,
  schemaname
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('logs', 'app_settings')
ORDER BY tablename;

-- Check table structures (view in Table Editor instead)
-- Tables: logs, app_settings

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Tables created successfully!';
  RAISE NOTICE '   - public.logs';
  RAISE NOTICE '   - public.app_settings';
  RAISE NOTICE '';
  RAISE NOTICE '📌 Next steps:';
  RAISE NOTICE '   1. Verify tables in Supabase dashboard';
  RAISE NOTICE '   2. Test /settings route in your app';
  RAISE NOTICE '   3. Check if logs are being saved';
END $$;
