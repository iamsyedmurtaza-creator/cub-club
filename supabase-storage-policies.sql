-- Run this after creating the public storage bucket named product-images.
-- It allows only admin users to upload/update/delete product images.

create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin()
);

create policy "Anyone can view product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');
