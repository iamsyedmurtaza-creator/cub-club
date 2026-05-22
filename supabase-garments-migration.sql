-- Cub Club garments-only cleanup
-- Run this in Supabase SQL Editor after the original database setup.

-- Hide old non-garment categories if they exist.
update public.categories
set is_active = false
where slug in ('baby-cots', 'baby-accessories');

-- Add garment-focused categories.
insert into public.categories (name, slug, description, sort_order, is_active)
values
('Toddler Garments', 'toddler-garments', 'Soft export-quality outfits for tiny adventures.', 1, true),
('Girls', 'girls', 'Pretty everyday wear for little girls.', 2, true),
('Boys', 'boys', 'Clean casual outfits for little boys.', 3, true),
('Infants', 'infants', 'Gentle baby clothing for little cubs.', 4, true),
('New Arrivals', 'new-arrivals', 'Fresh export-quality pieces from Cub Club.', 5, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = true;

-- Hide old demo products that are not garments.
update public.products p
set is_active = false
from public.categories c
where p.category_id = c.id
and c.slug in ('baby-cots', 'baby-accessories');

-- Update old sample garment product copy.
update public.products
set
  short_description = 'A cozy export-quality outfit for everyday play.',
  description = 'Soft, breathable and easy to wear. Designed for everyday comfort, clean stitching and a polished kidswear look.',
  material = coalesce(material, 'Cotton blend')
where slug = 'soft-cotton-toddler-set';
