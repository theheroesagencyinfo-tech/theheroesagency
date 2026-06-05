
create policy "Admins manage blog covers"
on storage.objects for all
to authenticated
using (bucket_id = 'blog-covers' and public.is_admin())
with check (bucket_id = 'blog-covers' and public.is_admin());
