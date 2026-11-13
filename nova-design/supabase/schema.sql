-- NOVA Design 1.7 — migration applied to Supabase project dthqzavxqoejqszsijqd
-- Existing PETGO and other application tables are untouched.
create table if not exists public.design_projects (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null default 'Sem título',
 document jsonb not null default '{}'::jsonb,
 preview text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists design_projects_user_idx on public.design_projects(user_id, updated_at desc);
alter table public.design_projects enable row level security;
-- Policies already applied in Supabase migration nova_design_projects_isolated.
