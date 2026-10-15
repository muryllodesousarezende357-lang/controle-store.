-- Esquema inicial: execute no SQL Editor do seu projeto Supabase.
-- Aplique migrations e revise as regras de acesso antes de usar dados reais.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('owner', 'manager', 'staff')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null default '',
  price numeric(12,2) not null default 0 check (price >= 0),
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  total numeric(12,2) not null default 0 check (total >= 0),
  status text not null default 'paid' check (status in ('paid', 'pending', 'cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.sales enable row level security;

-- Base segura: usuários autenticados podem ler dados; escrita exige autenticação.
-- Em produção, restrinja por loja/tenant e por papel antes de habilitar multiusuário.
create policy "profiles_read_authenticated" on public.profiles
  for select to authenticated using (true);
create policy "profiles_update_self" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "products_read_authenticated" on public.products
  for select to authenticated using (true);
create policy "products_insert_authenticated" on public.products
  for insert to authenticated with check (auth.uid() is not null);
create policy "products_update_authenticated" on public.products
  for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "products_delete_authenticated" on public.products
  for delete to authenticated using (auth.uid() is not null);

create policy "customers_read_authenticated" on public.customers
  for select to authenticated using (true);
create policy "customers_insert_authenticated" on public.customers
  for insert to authenticated with check (auth.uid() is not null);
create policy "customers_update_authenticated" on public.customers
  for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "customers_delete_authenticated" on public.customers
  for delete to authenticated using (auth.uid() is not null);

create policy "sales_read_authenticated" on public.sales
  for select to authenticated using (true);
create policy "sales_insert_authenticated" on public.sales
  for insert to authenticated with check (auth.uid() is not null);
create policy "sales_update_authenticated" on public.sales
  for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
