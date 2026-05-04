create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'customer');
create type public.inventory_movement_type as enum ('entrada', 'salida', 'ajuste', 'venta');
create type public.order_status as enum ('pendiente', 'preparando', 'enviado', 'entregado', 'cancelado');
create type public.payment_status as enum ('pendiente', 'pagado', 'fallido', 'reembolsado');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  min_quantity integer not null default 0 check (min_quantity >= 0),
  updated_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  type public.inventory_movement_type not null,
  quantity integer not null check (quantity > 0),
  note text,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  status public.order_status not null default 'pendiente',
  payment_status public.payment_status not null default 'pendiente',
  payment_provider text,
  payment_id text,
  total numeric(12, 2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products(category_id);
create index products_active_idx on public.products(active);
create index inventory_quantity_idx on public.inventory(quantity);
create index inventory_movements_product_id_idx on public.inventory_movements(product_id);
create index order_items_order_id_idx on public.order_items(order_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.apply_inventory_movement(
  target_product_id uuid,
  movement_type public.inventory_movement_type,
  movement_quantity integer,
  movement_note text default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_quantity integer;
begin
  if movement_quantity <= 0 then
    raise exception 'La cantidad debe ser mayor a cero';
  end if;

  if not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  insert into public.inventory (product_id, quantity, min_quantity)
  values (target_product_id, 0, 0)
  on conflict (product_id) do nothing;

  if movement_type = 'ajuste' then
    next_quantity := movement_quantity;
  elsif movement_type in ('salida', 'venta') then
    select quantity - movement_quantity
    into next_quantity
    from public.inventory
    where product_id = target_product_id
    for update;
  else
    select quantity + movement_quantity
    into next_quantity
    from public.inventory
    where product_id = target_product_id
    for update;
  end if;

  if next_quantity < 0 then
    raise exception 'Inventario insuficiente';
  end if;

  update public.inventory
  set quantity = next_quantity,
      updated_at = now()
  where product_id = target_product_id;

  insert into public.inventory_movements (product_id, type, quantity, note)
  values (target_product_id, movement_type, movement_quantity, movement_note);

  return next_quantity;
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Todos pueden leer categorias"
on public.categories for select
using (true);

create policy "Todos pueden leer productos activos"
on public.products for select
using (active = true or public.is_admin());

create policy "Admins administran categorias"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins administran productos"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins administran inventario"
on public.inventory for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins administran movimientos"
on public.inventory_movements for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins leen todos los perfiles"
on public.profiles for select
using (public.is_admin() or id = auth.uid());

create policy "Usuarios leen sus pedidos por correo autenticado"
on public.orders for select
using (public.is_admin() or customer_email = auth.email());

create policy "Admins administran pedidos"
on public.orders for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins administran partidas"
on public.order_items for all
using (public.is_admin())
with check (public.is_admin());

insert into public.categories (name, slug) values
  ('Herramientas', 'herramientas'),
  ('Pintura', 'pintura'),
  ('Plomeria', 'plomeria'),
  ('Electricidad', 'electricidad'),
  ('Tornilleria', 'tornilleria'),
  ('Jardineria', 'jardineria')
on conflict (slug) do nothing;
