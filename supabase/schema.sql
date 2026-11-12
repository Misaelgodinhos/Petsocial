-- PETGO 1.0: proposta de estrutura isolada. NÃO executado em nenhum banco.
-- Execute apenas em projeto Supabase escolhido e após revisão das políticas.
create table if not exists public.petgo_stores (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check(length(name) between 2 and 120),
 city text not null,
 description text not null default '',
 services text not null default '',
 delivery_fee numeric(10,2) not null default 0 check(delivery_fee >= 0),
 approved boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.petgo_products (
 id uuid primary key default gen_random_uuid(),
 store_id uuid not null references public.petgo_stores(id) on delete cascade,
 name text not null check(length(name) between 2 and 120),
 category text not null,
 price numeric(10,2) not null check(price > 0),
 stock integer not null default 0 check(stock >= 0),
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.petgo_orders (
 id uuid primary key default gen_random_uuid(),
 store_id uuid not null references public.petgo_stores(id),
 customer_id uuid not null references auth.users(id),
 delivery_address text not null,
 status text not null default 'Novo' check(status in ('Novo','Aceito','Preparando','Saiu para entrega','Entregue','Cancelado')),
 total numeric(10,2) not null check(total >= 0),
 created_at timestamptz not null default now()
);
create table if not exists public.petgo_order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.petgo_orders(id) on delete cascade,
 product_id uuid not null references public.petgo_products(id),
 quantity integer not null check(quantity > 0),
 unit_price numeric(10,2) not null check(unit_price > 0)
);
alter table public.petgo_stores enable row level security;
alter table public.petgo_products enable row level security;
alter table public.petgo_orders enable row level security;
alter table public.petgo_order_items enable row level security;
create policy "petgo public approved stores" on public.petgo_stores for select to anon,authenticated using (approved = true);
create policy "petgo owner stores select" on public.petgo_stores for select to authenticated using (owner_id = (select auth.uid()));
create policy "petgo owner stores insert" on public.petgo_stores for insert to authenticated with check (owner_id = (select auth.uid()) and approved = false);
-- Approved must not be mutable by merchant: enforce with column grants or privileged RPC before enabling UPDATE.
create policy "petgo public active products" on public.petgo_products for select to anon,authenticated using (active and exists(select 1 from public.petgo_stores s where s.id=store_id and s.approved));
create policy "petgo merchant products select" on public.petgo_products for select to authenticated using (exists(select 1 from public.petgo_stores s where s.id=store_id and s.owner_id=(select auth.uid())));
create policy "petgo merchant products insert" on public.petgo_products for insert to authenticated with check (exists(select 1 from public.petgo_stores s where s.id=store_id and s.owner_id=(select auth.uid())));
create policy "petgo merchant products update" on public.petgo_products for update to authenticated using (exists(select 1 from public.petgo_stores s where s.id=store_id and s.owner_id=(select auth.uid()))) with check (exists(select 1 from public.petgo_stores s where s.id=store_id and s.owner_id=(select auth.uid())));
create policy "petgo merchant products delete" on public.petgo_products for delete to authenticated using (exists(select 1 from public.petgo_stores s where s.id=store_id and s.owner_id=(select auth.uid())));
create policy "petgo order parties read" on public.petgo_orders for select to authenticated using (customer_id=(select auth.uid()) or exists(select 1 from public.petgo_stores s where s.id=store_id and s.owner_id=(select auth.uid())));
create policy "petgo order items parties read" on public.petgo_order_items for select to authenticated using (exists(select 1 from public.petgo_orders o where o.id=order_id and (o.customer_id=(select auth.uid()) or exists(select 1 from public.petgo_stores s where s.id=o.store_id and s.owner_id=(select auth.uid())))));
-- Intencionalmente SEM policies de INSERT/UPDATE de pedidos: criar RPC/Edge Function segura
-- que recalcule preços e estoque no servidor e valide itens de uma única loja.
-- Nunca permitir que o cliente defina livremente total, preço unitário ou status.
