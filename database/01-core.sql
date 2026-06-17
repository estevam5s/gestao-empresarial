-- ====================================================================
-- GestãoZe System — Núcleo SaaS sobre Supabase Auth (seguro)
-- Identidade = auth.users; tenant_id = auth.uid(); RLS por auth.uid().
-- Fecha o furo de segurança do schema antigo (OR tenant IS NULL).
-- ====================================================================

create extension if not exists "pgcrypto";

-- ====================================================================
-- PERFIS (1:1 com auth.users)
-- ====================================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique,
  email        text,
  name         text,
  role         text not null default 'user',          -- 'user' | 'admin'
  avatar_url   text,
  company_name text,
  phone        text,
  plan_slug    text not null default 'inicial',
  heard_about  text,
  is_active    boolean not null default true,
  last_login   timestamptz,
  login_count  int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_role on public.profiles(role);

-- Helper: usuário atual é admin? (security definer evita recursão de RLS)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Compat: funções de tenant antigas (mantidas como no-op seguro p/ não quebrar o router)
create or replace function public.current_user_tenant_id()
returns uuid language sql stable as $$ select auth.uid(); $$;
create or replace function public.set_current_tenant(tenant_uuid uuid)
returns void language plpgsql as $$ begin perform set_config('app.current_tenant_id', coalesce(tenant_uuid::text,''), false); end; $$;
grant execute on function public.current_user_tenant_id() to anon, authenticated, service_role;
grant execute on function public.set_current_tenant(uuid) to anon, authenticated, service_role;

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

-- ====================================================================
-- TABELAS DO SISTEMA (mesmas colunas do app; tenant_id default auth.uid())
-- ====================================================================
create table if not exists public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome varchar(100) not null,
  icone varchar(50),
  ativo boolean default true,
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_categorias_tenant on public.categorias(tenant_id);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  contact varchar(255), phone varchar(50), email varchar(255),
  address text, category varchar(100),
  status varchar(20) default 'active',
  last_order timestamptz, products_count int default 0,
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_suppliers_tenant on public.suppliers(tenant_id);

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  nome varchar(255) not null, descricao text,
  categoria_id uuid references public.categorias(id) on delete set null,
  codigo_barras varchar(100), unidade varchar(20),
  preco_custo decimal(10,2), preco_venda decimal(10,2), margem_lucro decimal(5,2),
  current_stock int default 0, min_stock int default 0, max_stock int,
  ativo boolean default true,
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_produtos_tenant on public.produtos(tenant_id);
create index if not exists idx_produtos_ativo on public.produtos(ativo);

create table if not exists public.movements (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid references public.produtos(id) on delete cascade,
  tipo varchar(20) not null, quantidade int not null, motivo text,
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now()
);
create index if not exists idx_movements_tenant on public.movements(tenant_id);

create table if not exists public.employees (
  id bigserial primary key,
  name varchar(255) not null, email varchar(255), phone varchar(50),
  photo_url text, position varchar(100), hire_date date,
  status varchar(20) default 'ativo',
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_employees_tenant on public.employees(tenant_id);

create table if not exists public.financial_data (
  id bigserial primary key,
  full_day varchar(20) not null, amount decimal(10,2) not null, total decimal(10,2) not null,
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_financial_tenant on public.financial_data(tenant_id);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  nome varchar(255) not null, descricao text,
  categoria_id uuid references public.categorias(id) on delete set null,
  preco_venda decimal(10,2) not null, custo_ingredientes decimal(10,2) default 0,
  tempo_preparo int default 0, dificuldade varchar(20) default 'medium', porcoes int default 1,
  score_popularidade int default 0, disponivel boolean default true, destaque boolean default false,
  calorias int, proteina_g decimal(5,2), carboidratos_g decimal(5,2), gordura_g decimal(5,2),
  tags text[], ativo boolean default true,
  tenant_id uuid not null default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists idx_menu_items_tenant on public.menu_items(tenant_id);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, action varchar not null, entity_type varchar, entity_id uuid, description text,
  ip_address inet, user_agent text, metadata jsonb,
  username text not null default 'system', resource text not null default 'system', resource_id text,
  details jsonb default '{}'::jsonb, severity text not null default 'info', category text not null default 'system',
  session_id text, execution_time int, status text default 'success', error_message text,
  tenant_id uuid default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz not null default now()
);
create index if not exists idx_logs_tenant on public.logs(tenant_id);
create index if not exists idx_logs_created on public.logs(created_at desc);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  section varchar not null, settings jsonb not null,
  tenant_id uuid default auth.uid(),
  created_at timestamptz default now(), updated_at timestamptz default now(),
  constraint app_settings_user_section_unique unique (user_id, section)
);
create index if not exists idx_app_settings_user on public.app_settings(user_id);

-- updated_at triggers
do $$ declare t text; begin
  foreach t in array array['categorias','suppliers','produtos','employees','financial_data','menu_items','app_settings','logs','profiles']
  loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$s', t);
    execute format('create trigger trg_touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ====================================================================
-- RLS — isolamento por auth.uid() (admin enxerga tudo via is_admin())
-- ====================================================================
do $$ declare t text; begin
  foreach t in array array['categorias','suppliers','produtos','movements','employees','financial_data','menu_items','logs','app_settings']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %1$s_owner on public.%1$s', t);
    execute format($p$create policy %1$s_owner on public.%1$s for all
      using (tenant_id = auth.uid() or public.is_admin())
      with check (tenant_id = auth.uid())$p$, t);
  end loop;
end $$;

-- profiles RLS
alter table public.profiles enable row level security;
drop policy if exists profiles_self_select on public.profiles;
drop policy if exists profiles_self_update on public.profiles;
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_self_select on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_self_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ====================================================================
-- AUTH TRIGGER — cria profile + categorias padrão ao registrar
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  uname text;
begin
  uname := coalesce(nullif(new.raw_user_meta_data->>'username',''), split_part(new.email,'@',1));
  -- garante unicidade do username
  if exists (select 1 from public.profiles where username = uname) then
    uname := uname || '_' || substr(new.id::text,1,6);
  end if;

  insert into public.profiles (id, username, email, name, heard_about)
  values (new.id, uname, new.email,
          coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', uname),
          new.raw_user_meta_data->>'heard_about')
  on conflict (id) do nothing;

  insert into public.categorias (nome, icone, tenant_id, ativo) values
    ('Bebidas','🥤',new.id,true),('Comidas','🍔',new.id,true),
    ('Sobremesas','🍰',new.id,true),('Lanches','🥪',new.id,true),
    ('Pratos Principais','🍽️',new.id,true),('Entradas','🥗',new.id,true);

  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Grants (RLS continua sendo a barreira real)
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
