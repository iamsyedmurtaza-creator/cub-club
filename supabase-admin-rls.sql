-- Cub Club — admin lockdown & public-read policies
-- Run this in the Supabase SQL Editor. Safe to run more than once.
--
-- This is what ACTUALLY restricts the admin area. The website's route guard
-- only hides the admin UI; these policies stop anyone (even with the public
-- API key and a script) from writing to your data unless their profile role
-- is 'admin'. The public can still READ active products/categories.

-- ---------------------------------------------------------------------------
-- Helper: is the current user an admin? (self-contained, safe to redefine)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Products: anyone reads active products, only admins write.
-- ---------------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "Public read active products" on public.products;
create policy "Public read active products"
on public.products for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Categories: anyone reads active categories, only admins write.
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories"
on public.categories for select to anon, authenticated
using (is_active = true or public.is_admin());

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
on public.categories for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Product images: anyone reads, only admins write.
-- ---------------------------------------------------------------------------
alter table public.product_images enable row level security;

drop policy if exists "Public read product images" on public.product_images;
create policy "Public read product images"
on public.product_images for select to anon, authenticated
using (true);

drop policy if exists "Admins manage product images" on public.product_images;
create policy "Admins manage product images"
on public.product_images for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Profiles: users see/edit only their own; nobody can self-promote to admin.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
on public.profiles for insert to authenticated
with check (id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- Block role escalation: only an existing admin may set/keep role = 'admin'.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.role = 'admin' and not public.is_admin() then
      new.role := 'customer';
    end if;
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role and not public.is_admin() then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guard_profile_role on public.profiles;
create trigger trg_guard_profile_role
before insert or update on public.profiles
for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------------------
-- IMPORTANT: if your project was created with Supabase's starter policies,
-- check Authentication -> Policies and DELETE any older policy on products,
-- categories, product_images or profiles that allows INSERT/UPDATE/DELETE to
-- "public"/anon. RLS policies are combined with OR, so one leftover permissive
-- write policy would defeat the admin lock above.
-- ---------------------------------------------------------------------------
