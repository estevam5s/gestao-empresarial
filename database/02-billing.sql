-- ====================================================================
-- GestãoZe — Billing + SaaS (planos, assinaturas, feedback, suporte, API)
-- ====================================================================

-- ====================================================================
-- PLANOS
-- ====================================================================
create table if not exists public.plans (
  slug            text primary key,
  name            text not null,
  description     text,
  billing_type    text not null default 'recurring',  -- free | recurring | lifetime
  monthly_price   numeric(10,2) default 0,
  yearly_price    numeric(10,2) default 0,
  lifetime_price  numeric(10,2) default 0,
  included_users  int default 1,
  highlight       boolean default false,
  sort_order      int default 0,
  cta             text default 'Assinar',
  stripe_price_monthly  text,
  stripe_price_yearly   text,
  stripe_price_lifetime text,
  limits          jsonb not null default '{}'::jsonb,
  features        jsonb not null default '[]'::jsonb,
  created_at      timestamptz default now()
);

insert into public.plans
  (slug,name,description,billing_type,monthly_price,yearly_price,lifetime_price,included_users,highlight,sort_order,cta,
   stripe_price_monthly,stripe_price_yearly,stripe_price_lifetime,limits,features)
values
('inicial','Inicial','Para testar o controle de estoque sem custo.','free',0,0,0,1,false,1,'Começar grátis',
  null,null,null,
  '{"empresas":1,"usuarios":1,"produtos":50,"categorias":5,"fornecedores":5,"movimentacoes":100,"ia":0,"exportacoes":1}',
  '["1 empresa e 1 usuário","Até 50 produtos ativos","Dashboard básico de estoque","Estoque mínimo + alertas","Cadastro básico de fornecedores","Exportação CSV (1/mês)","Tema claro/escuro","Central de ajuda e FAQ"]'),
('starter','Starter','Para sair da planilha e controlar estoque com segurança.','recurring',69.90,699.00,0,3,false,2,'Assinar Starter',
  'price_1Tj9Z0CB6Dz1wPeiT0IPVDFl','price_1Tj9Z1CB6Dz1wPeimxAPRFmv',null,
  '{"empresas":1,"usuarios":3,"produtos":500,"categorias":20,"fornecedores":30,"movimentacoes":1000,"ia":0,"exportacoes":20}',
  '["Tudo do Inicial","Até 3 usuários e 500 produtos","Controle de validade + código de barras","Dashboard completo de estoque","Financeiro básico (receitas/despesas)","Até 30 fornecedores","Exportação CSV e Excel","Suporte por e-mail"]'),
('pro','Pro','Estoque, financeiro, equipe, cardápio, relatórios e IA num só lugar.','recurring',169.90,1699.00,0,10,true,3,'Começar teste Pro',
  'price_1Tj9Z2CB6Dz1wPeizJuvcFCa','price_1Tj9Z2CB6Dz1wPeiNmABaxyQ',null,
  '{"empresas":1,"usuarios":10,"produtos":2500,"categorias":100,"fornecedores":150,"movimentacoes":10000,"ia":300,"exportacoes":100}',
  '["Tudo do Starter","Até 10 usuários e 2.500 produtos","Financeiro avançado + indicadores","Gestão de funcionários","Cardápio digital com custo por prato","IA operacional (300 análises/mês)","Relatórios PDF/Excel/CSV/JSON","App Android + suporte prioritário"]'),
('enterprise','Enterprise','Governança, API, auditoria e suporte para operações multiunidade.','recurring',499.90,4999.00,0,50,false,4,'Falar com especialista',
  'price_1Tj9Z4CB6Dz1wPeimbwJEMqt','price_1Tj9Z4CB6Dz1wPeiX9XcwT0j',null,
  '{"empresas":5,"usuarios":50,"produtos":15000,"categorias":500,"fornecedores":1000,"movimentacoes":100000,"ia":2000,"exportacoes":500}',
  '["Tudo do Pro","Até 5 unidades e 50 usuários","Visão multiempresa consolidada","Auditoria avançada","API com chaves e documentação","IA preditiva (2.000 análises/mês)","Onboarding assistido + treinamento","Suporte prioritário com SLA"]'),
('vitalicio','Vitalício','Pagamento único para uso por prazo indeterminado, conforme contrato.','lifetime',0,0,12997.00,100,false,5,'Solicitar contrato vitalício',
  null,null,'price_1Tj9Z5CB6Dz1wPei3Zgjtiw4',
  '{"empresas":10,"usuarios":100,"produtos":30000,"categorias":1000,"fornecedores":2000,"movimentacoes":300000,"ia":5000,"exportacoes":1000}',
  '["Tudo do Enterprise","Até 10 unidades e 100 usuários","Pagamento único, sem mensalidade","IA (5.000 análises/mês)","Onboarding + 2 treinamentos inclusos","2 relatórios customizados inclusos","Prioridade no roadmap","Suporte premium com SLA"]')
on conflict (slug) do update set
  name=excluded.name, description=excluded.description, billing_type=excluded.billing_type,
  monthly_price=excluded.monthly_price, yearly_price=excluded.yearly_price, lifetime_price=excluded.lifetime_price,
  included_users=excluded.included_users, highlight=excluded.highlight, sort_order=excluded.sort_order, cta=excluded.cta,
  stripe_price_monthly=excluded.stripe_price_monthly, stripe_price_yearly=excluded.stripe_price_yearly,
  stripe_price_lifetime=excluded.stripe_price_lifetime, limits=excluded.limits, features=excluded.features;

alter table public.plans enable row level security;
drop policy if exists plans_public_read on public.plans;
create policy plans_public_read on public.plans for select using (true);
drop policy if exists plans_admin_write on public.plans;
create policy plans_admin_write on public.plans for all using (public.is_admin()) with check (public.is_admin());

-- ====================================================================
-- ASSINATURAS
-- ====================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_slug text not null default 'inicial' references public.plans(slug),
  status text not null default 'active',          -- active|trialing|past_due|canceled|incomplete
  billing_cycle text not null default 'free',     -- monthly|yearly|lifetime|free
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_end timestamptz,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  pending_plan_slug text,
  pending_cycle text,
  pending_effective_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_subs_customer on public.subscriptions(stripe_customer_id);
create index if not exists idx_subs_stripe on public.subscriptions(stripe_subscription_id);

alter table public.subscriptions enable row level security;
drop policy if exists subs_self on public.subscriptions;
create policy subs_self on public.subscriptions for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists subs_admin on public.subscriptions;
create policy subs_admin on public.subscriptions for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists trg_touch_subs on public.subscriptions;
create trigger trg_touch_subs before update on public.subscriptions for each row execute function public.touch_updated_at();

-- Sincroniza profiles.plan_slug quando a assinatura muda
create or replace function public.sync_profile_plan()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  update public.profiles set plan_slug = new.plan_slug, updated_at = now() where id = new.user_id;
  return new;
end; $$;
drop trigger if exists trg_sync_profile_plan on public.subscriptions;
create trigger trg_sync_profile_plan after insert or update of plan_slug on public.subscriptions
  for each row execute function public.sync_profile_plan();

-- Cria assinatura free automaticamente para novos usuários
create or replace function public.handle_new_user_subscription()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.subscriptions (user_id, plan_slug, status, billing_cycle)
  values (new.id, 'inicial', 'active', 'free')
  on conflict (user_id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created_sub on auth.users;
create trigger on_auth_user_created_sub after insert on auth.users
  for each row execute function public.handle_new_user_subscription();

-- ====================================================================
-- EVENTOS STRIPE (idempotência do webhook)
-- ====================================================================
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  type text,
  payload jsonb,
  created_at timestamptz default now()
);
alter table public.payment_events enable row level security;
drop policy if exists payevt_admin on public.payment_events;
create policy payevt_admin on public.payment_events for select using (public.is_admin());

-- ====================================================================
-- FEEDBACK DE CANCELAMENTO + ORIGEM DO CADASTRO
-- ====================================================================
create table if not exists public.cancellation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  plan_slug text, reason text, comment text,
  created_at timestamptz default now()
);
alter table public.cancellation_feedback enable row level security;
drop policy if exists cf_insert on public.cancellation_feedback;
create policy cf_insert on public.cancellation_feedback for insert with check (user_id = auth.uid());
drop policy if exists cf_admin on public.cancellation_feedback;
create policy cf_admin on public.cancellation_feedback for select using (public.is_admin());

create table if not exists public.signup_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  source text, created_at timestamptz default now()
);
alter table public.signup_sources enable row level security;
drop policy if exists ss_insert on public.signup_sources;
create policy ss_insert on public.signup_sources for insert with check (user_id = auth.uid());
drop policy if exists ss_admin on public.signup_sources;
create policy ss_admin on public.signup_sources for select using (public.is_admin());

-- ====================================================================
-- LEADS, CONTATO, SUPORTE, FAQ
-- ====================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text, email text, phone text, company text,
  plan_interest text, message text, source text default 'site',
  created_at timestamptz default now()
);
alter table public.leads enable row level security;
drop policy if exists leads_insert on public.leads;
create policy leads_insert on public.leads for insert with check (true);
drop policy if exists leads_admin on public.leads;
create policy leads_admin on public.leads for select using (public.is_admin());

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text, email text, subject text, message text,
  status text default 'novo', created_at timestamptz default now()
);
alter table public.contact_messages enable row level security;
drop policy if exists cm_insert on public.contact_messages;
create policy cm_insert on public.contact_messages for insert with check (true);
drop policy if exists cm_admin on public.contact_messages;
create policy cm_admin on public.contact_messages for all using (public.is_admin()) with check (public.is_admin());

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subject text not null, status text default 'aberto', priority text default 'normal',
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  user_id uuid, sender text not null default 'user', body text not null,
  created_at timestamptz default now()
);
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
drop policy if exists st_self on public.support_tickets;
create policy st_self on public.support_tickets for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
drop policy if exists sm_self on public.support_messages;
create policy sm_self on public.support_messages for all
  using (public.is_admin() or exists(select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid()))
  with check (public.is_admin() or exists(select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid()));

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null, category text default 'geral',
  sort int default 0, active boolean default true
);
alter table public.faq_items enable row level security;
drop policy if exists faq_public on public.faq_items;
create policy faq_public on public.faq_items for select using (active or public.is_admin());
drop policy if exists faq_admin on public.faq_items;
create policy faq_admin on public.faq_items for all using (public.is_admin()) with check (public.is_admin());

-- ====================================================================
-- API KEYS + REQUESTS (rate limiting / analytics)
-- ====================================================================
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text, key_hash text, key_prefix text, scopes text[] default array['read'],
  rate_limit_per_min int default 60, active boolean default true,
  last_used_at timestamptz, created_at timestamptz default now()
);
create table if not exists public.api_requests (
  id bigserial primary key,
  api_key_id uuid, user_id uuid, endpoint text, method text, status_code int, ip inet,
  created_at timestamptz default now()
);
create index if not exists idx_api_req_key_time on public.api_requests(api_key_id, created_at desc);
alter table public.api_keys enable row level security;
alter table public.api_requests enable row level security;
drop policy if exists ak_self on public.api_keys;
create policy ak_self on public.api_keys for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid());
drop policy if exists areq_self on public.api_requests;
create policy areq_self on public.api_requests for select using (user_id = auth.uid() or public.is_admin());

-- ====================================================================
-- ENFORCE LIMITES DE PLANO
-- ====================================================================
create or replace function public.enforce_plan_limit()
returns trigger language plpgsql security definer set search_path=public as $$
declare v_plan text; v_limit int; v_count int; v_key text; v_uid uuid;
begin
  v_uid := coalesce(new.tenant_id, auth.uid());
  if v_uid is null then return new; end if;
  select coalesce(s.plan_slug, p.plan_slug, 'inicial') into v_plan
    from public.profiles p left join public.subscriptions s on s.user_id = p.id
    where p.id = v_uid;
  if v_plan is null then v_plan := 'inicial'; end if;
  v_key := tg_argv[0];
  select (limits->>v_key)::int into v_limit from public.plans where slug = v_plan;
  if v_limit is null then return new; end if;
  if tg_table_name = 'movements' then
    select count(*) into v_count from public.movements where tenant_id = v_uid and created_at >= date_trunc('month', now());
  else
    execute format('select count(*) from public.%I where tenant_id = $1', tg_table_name) into v_count using v_uid;
  end if;
  if v_count >= v_limit then
    raise exception 'PLAN_LIMIT_EXCEEDED: limite de % do plano % atingido (%/%). Faça upgrade para continuar.', v_key, v_plan, v_count, v_limit using errcode='P0001';
  end if;
  return new;
end; $$;

drop trigger if exists trg_limit_produtos on public.produtos;
create trigger trg_limit_produtos before insert on public.produtos for each row execute function public.enforce_plan_limit('produtos');
drop trigger if exists trg_limit_suppliers on public.suppliers;
create trigger trg_limit_suppliers before insert on public.suppliers for each row execute function public.enforce_plan_limit('fornecedores');
-- categorias NÃO é limitado: 6 categorias padrão são semeadas no signup (evita bloquear cadastro)
drop trigger if exists trg_limit_movements on public.movements;
create trigger trg_limit_movements before insert on public.movements for each row execute function public.enforce_plan_limit('movimentacoes');

grant select on public.plans to anon, authenticated;
grant all on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;
