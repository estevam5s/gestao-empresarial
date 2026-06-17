-- ====================================================================
-- GestãoZe — Admin avançado: ofertas, visitantes, API admin externa
-- ====================================================================

-- ---- OFERTAS / PROMOÇÕES (aparecem como anúncio no site) ----
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  coupon_code text,
  discount_label text,                 -- ex: "30% OFF"
  bg_color text default '#16a34a',
  active boolean default true,
  starts_at timestamptz default now(),
  ends_at timestamptz,                 -- contador regressivo
  created_at timestamptz default now()
);
alter table public.offers enable row level security;
drop policy if exists offers_public_read on public.offers;
create policy offers_public_read on public.offers for select
  using ((active and (ends_at is null or ends_at > now())) or public.is_admin());
drop policy if exists offers_admin on public.offers;
create policy offers_admin on public.offers for all using (public.is_admin()) with check (public.is_admin());

-- ---- VISITANTES (analytics global) ----
create table if not exists public.visitors (
  id bigserial primary key,
  country text, country_code text, city text, region text,
  path text, referrer text, device text, ip text, user_agent text,
  created_at timestamptz default now()
);
create index if not exists idx_visitors_created on public.visitors(created_at desc);
create index if not exists idx_visitors_country on public.visitors(country_code);
alter table public.visitors enable row level security;
drop policy if exists visitors_admin_read on public.visitors;
create policy visitors_admin_read on public.visitors for select using (public.is_admin());
-- inserts feitos só pelo backend (service_role bypassa RLS); sem policy de insert pública

-- ---- CHAVES DE API DO ADMIN (acesso externo às métricas) ----
create table if not exists public.admin_api_keys (
  id uuid primary key default gen_random_uuid(),
  label text,
  token text unique not null,          -- gat_xxx
  active boolean default true,
  last_used_at timestamptz,
  created_at timestamptz default now()
);
alter table public.admin_api_keys enable row level security;
drop policy if exists aak_admin on public.admin_api_keys;
create policy aak_admin on public.admin_api_keys for all using (public.is_admin()) with check (public.is_admin());

-- ---- SEGURANÇA: tentativas de login / bruteforce ----
create table if not exists public.security_events (
  id bigserial primary key,
  kind text not null,                  -- 'failed_login' | 'bruteforce' | 'js_error' | 'suspicious'
  email text, ip text, user_agent text, detail text,
  created_at timestamptz default now()
);
create index if not exists idx_secevt_created on public.security_events(created_at desc);
alter table public.security_events enable row level security;
drop policy if exists secevt_admin on public.security_events;
create policy secevt_admin on public.security_events for select using (public.is_admin());
drop policy if exists secevt_insert on public.security_events;
create policy secevt_insert on public.security_events for insert with check (true);

grant select on public.offers to anon, authenticated;
grant insert on public.security_events to anon, authenticated;
grant all on all tables in schema public to authenticated, service_role;
grant all on all sequences in schema public to authenticated, service_role;

-- Oferta inicial de exemplo (Black Friday-style, configurável no painel)
insert into public.offers (title, description, coupon_code, discount_label, bg_color, ends_at)
select 'Oferta de lançamento', 'Use o cupom no checkout e ganhe desconto no primeiro mês.', 'BEMVINDO10', '10% OFF', '#0d9488', now() + interval '30 days'
where not exists (select 1 from public.offers);
