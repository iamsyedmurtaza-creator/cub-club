# Cub Club Kids Garments Ecommerce

A mobile-first React + TypeScript + Supabase ecommerce website for Cub Club, focused on export-quality kids garments in Pakistan.

## Includes

- Boutique-style ecommerce homepage
- Shorter, cleaner hero image section
- Photo-led clothing collections
- Smooth scroll animations with Framer Motion
- Product grid, product details, cart and checkout
- Cash on Delivery checkout
- Supabase Auth login/signup
- Admin dashboard for products, stock, images, categories and orders
- Mobile bottom navigation
- Supabase Storage image uploader
- SEO meta tags for export-quality kids garments in Pakistan
- Cub Club logo added from `/public/cubclub-logo.png`

## Run locally

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Supabase env

The project reads these variables from `.env.local`:

```env
VITE_SUPABASE_URL=https://vzubjrywfhtnipnwsbsh.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The anon key is safe for frontend use. Never place the Supabase `service_role` key in this project.

## Admin

Create a user in Supabase Auth, then run:

```sql
update public.profiles
set role = 'admin'
where id = 'PASTE_USER_ID_HERE';
```

Admin pages:

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/orders`
- `/admin/categories`

## Updating product images later

The easiest way is through the admin panel:

1. Login with the admin account.
2. Go to `/admin/products`.
3. Edit a product or add a new product.
4. Upload the product image.
5. Save the product.

The image uploads to the Supabase Storage bucket named `product-images`, and the public image URL is saved in the product's `main_image_url` field.

## Updating homepage images later

Homepage lifestyle images are controlled in:

```txt
src/lib/designAssets.ts
```

Replace the Unsplash URLs with your own image URLs. You can upload images to Supabase Storage and paste the public URLs there.

## Garments-only Supabase cleanup

Run the included SQL file if you want to hide the old cots/accessories demo data and add garment-focused categories:

```txt
supabase-garments-migration.sql
```
