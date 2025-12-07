-- ==============================================================================
-- GhostWire MX - Database Schema (PostgreSQL via Supabase)
-- ==============================================================================

-- 1. ENUMS (Tipos de datos estrictos para estados)
-- ------------------------------------------------------------------------------
create type public.listing_condition as enum ('NEW', 'USED', 'REFURBISHED', 'DAMAGED');
create type public.listing_status as enum ('DRAFT', 'ACTIVE', 'SOLD', 'SUSPENDED');
create type public.order_status as enum ('PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'DISPUTED');
create type public.escrow_status as enum ('FUNDS_LOCKED', 'ITEM_SHIPPED', 'ITEM_RECEIVED', 'FUNDS_RELEASED', 'DISPUTE_OPEN', 'REFUNDED');
create type public.dispute_status as enum ('OPEN', 'UNDER_REVIEW', 'RESOLVED_BUYER', 'RESOLVED_SELLER', 'REJECTED');

-- 2. TABLES
-- ------------------------------------------------------------------------------

-- USERS (Extiende auth.users)
-- Maneja datos públicos del perfil. La seguridad es crítica aquí.
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  reputation_score integer default 0,
  is_verified_seller boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3)
);

-- LISTINGS (Publicaciones de Hardware)
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  price decimal(12,2) not null check (price >= 0),
  condition public.listing_condition not null,
  specs jsonb default '{}'::jsonb, -- Flexible para GPU vs CPU specs
  images text[] default array[]::text[],
  status public.listing_status default 'DRAFT',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS (Transacciones)
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id) not null,
  seller_id uuid references public.profiles(id) not null, -- Desnormalizado para facilitar RLS
  listing_id uuid references public.listings(id) not null,
  status public.order_status default 'PENDING',
  shipping_address jsonb, -- Snapshot de la dirección al momento de la compra
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ESCROW TRANSACTIONS (Manejo de Fondos)
create table public.escrow_transactions (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  amount decimal(12,2) not null,
  status public.escrow_status default 'FUNDS_LOCKED',
  platform_fee decimal(12,2) default 0,
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DISPUTES (Reclamos)
create table public.disputes (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) not null,
  complainant_id uuid references public.profiles(id) not null,
  reason text not null, -- Ej: "Item not as described", "Not received"
  description text,
  evidence_urls text[], -- Fotos de la gráfica minada, etc.
  status public.dispute_status default 'OPEN',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ROW LEVEL SECURITY (RLS) - "OWASP Broken Access Control Prevention"
-- ------------------------------------------------------------------------------

-- Habilitar RLS en todas las tablas
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.escrow_transactions enable row level security;
alter table public.disputes enable row level security;

-- POLICIES: PROFILES
-- Todo el mundo puede ver perfiles.
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Solo el usuario puede editar su propio perfil.
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- POLICIES: LISTINGS
-- Cualquiera puede ver listings ACTIVOS o SOLD.
create policy "Public active listings are viewable"
  on public.listings for select
  using ( status in ('ACTIVE', 'SOLD') or auth.uid() = seller_id );

-- Solo vendedores verificados pueden crear (Opcional, por ahora todos autenticados).
create policy "Authenticated users can create listings"
  on public.listings for insert
  with check ( auth.uid() = seller_id );

-- Solo el dueño puede editar su listing.
create policy "Users can update own listings"
  on public.listings for update
  using ( auth.uid() = seller_id );

create policy "Users can delete own listings"
  on public.listings for delete
  using ( auth.uid() = seller_id );

-- POLICIES: ORDERS
-- Los usuarios solo ven sus órdenes (compra o venta).
create policy "Users see their own orders"
  on public.orders for select
  using ( auth.uid() = buyer_id or auth.uid() = seller_id );

-- Solo un usuario autenticado puede crear una orden (como comprador).
create policy "Users can create orders"
  on public.orders for insert
  with check ( auth.uid() = buyer_id );

-- Las actualizaciones de estado deberían ser manejadas por funciones seguras o triggers,
-- pero para MVP permitimos a los involucrados con restricciones (se refinará).

-- POLICIES: ESCROW
-- Información sensible. Solo visible por las partes involucradas.
create policy "Escrow visible to parties"
  on public.escrow_transactions for select
  using ( 
    exists (
      select 1 from public.orders 
      where orders.id = escrow_transactions.order_id 
      and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
    )
  );

-- POLICIES: DISPUTES
create policy "Disputes visible to parties"
  on public.disputes for select
  using ( 
    exists (
      select 1 from public.orders 
      where orders.id = disputes.order_id 
      and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
    )
  );

create policy "Parties can create disputes"
  on public.disputes for insert
  with check ( auth.uid() = complainant_id );

-- 4. FUNCIONES AUTOMÁTICAS (Triggers)
-- ------------------------------------------------------------------------------

-- Auto-actualizar created_at / updated_at no incluidos por brevedad, usar extensiones de supabase moddatetime si es necesario.
-- Trigger para crear perfil al registrarse (Opcional, se suele hacer desde el cliente o trigger en auth.users).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Descomentar para activar
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();
