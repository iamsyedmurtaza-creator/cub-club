-- Cub Club — Phase 1 security & inventory hardening
-- Run this in the Supabase SQL Editor AFTER the original database setup.
-- Safe to run more than once (policies are dropped and recreated).
--
-- What this does:
--   1. Row Level Security on orders + order_items so customers only ever
--      see their own orders, while admins can see and manage everything.
--   2. A place_order() function that creates an order atomically:
--      it validates stock, prices items from the database (so the client
--      cannot tamper with prices), decrements stock, and inserts the order
--      and its items in a single transaction. This prevents overselling.
--
-- Note: this relies on the helper public.is_admin() that already exists in
-- your project (used by the storage policies). It returns true when the
-- current user's profile role is 'admin'.

-- ---------------------------------------------------------------------------
-- 1. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Customers read their own orders; admins read all.
drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

-- Only admins can change order status (or other fields) directly.
drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Order items are visible whenever the parent order is visible to the user.
drop policy if exists "Read order items for visible orders" on public.order_items;
create policy "Read order items for visible orders"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and (o.user_id = auth.uid() or public.is_admin())
  )
);

-- Note: we intentionally do NOT add INSERT policies for orders/order_items.
-- All order creation goes through place_order() below, which runs as
-- SECURITY DEFINER and therefore bypasses RLS in a controlled way.

-- ---------------------------------------------------------------------------
-- 2. Atomic order creation with stock validation
-- ---------------------------------------------------------------------------

create or replace function public.place_order(
  p_user_id uuid,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_delivery_address text,
  p_city text,
  p_notes text,
  p_delivery_fee numeric,
  p_items jsonb               -- [{ "product_id": uuid, "quantity": int }, ...]
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item     jsonb;
  v_product  public.products%rowtype;
  v_qty      int;
  v_subtotal numeric := 0;
  v_order    public.orders%rowtype;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty.';
  end if;

  -- If the caller claims to be a logged-in user, it must be the real user.
  if p_user_id is not null and p_user_id <> auth.uid() then
    raise exception 'User mismatch.';
  end if;

  -- Pass 1: lock each product row, validate stock, compute the subtotal
  -- from authoritative database prices.
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;
    if v_qty is null or v_qty < 1 then
      raise exception 'Invalid quantity in cart.';
    end if;

    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    if not found or not v_product.is_active then
      raise exception 'A product in your cart is no longer available.';
    end if;
    if v_product.stock_quantity < v_qty then
      raise exception 'Not enough stock for %.', v_product.name;
    end if;

    v_subtotal := v_subtotal + v_product.price * v_qty;
  end loop;

  -- Create the order header.
  insert into public.orders (
    user_id, customer_name, customer_phone, customer_email,
    delivery_address, city, notes, payment_method, status,
    subtotal, delivery_fee, total
  )
  values (
    p_user_id, p_customer_name, p_customer_phone, nullif(p_customer_email, ''),
    p_delivery_address, p_city, nullif(p_notes, ''), 'cash_on_delivery', 'pending',
    v_subtotal, coalesce(p_delivery_fee, 0), v_subtotal + coalesce(p_delivery_fee, 0)
  )
  returning * into v_order;

  -- Pass 2: decrement stock and write order items.
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::int;

    select * into v_product
    from public.products
    where id = (v_item->>'product_id')::uuid
    for update;

    update public.products
    set stock_quantity = stock_quantity - v_qty
    where id = v_product.id;

    insert into public.order_items (
      order_id, product_id, product_name, product_sku,
      size, color, quantity, unit_price, line_total
    )
    values (
      v_order.id, v_product.id, v_product.name, v_product.sku,
      v_product.size, v_product.color, v_qty, v_product.price, v_product.price * v_qty
    );
  end loop;

  return v_order;
end;
$$;

-- Guests (anon) and logged-in users may both place COD orders.
grant execute on function public.place_order(
  uuid, text, text, text, text, text, text, numeric, jsonb
) to anon, authenticated;
