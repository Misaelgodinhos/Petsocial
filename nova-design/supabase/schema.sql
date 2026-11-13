-- Execute no SQL Editor do Supabase. Não altera tabelas existentes.
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
drop policy if exists "design_projects_select_own" on public.design_projects;
create policy "design_projects_select_own" on public.design_projects for select to authenticated using (auth.uid() = user_id);
drop policy if exists "design_projects_insert_own" on public.design_projects;
create policy "design_projects_insert_own" on public.design_projects for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "design_projects_update_own" on public.design_projects;
create policy "design_projects_update_own" on public.design_projects for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "design_projects_delete_own" on public.design_projects;
create policy "design_projects_delete_own" on public.design_projects for delete to authenticated using (auth.uid() = user_id);
