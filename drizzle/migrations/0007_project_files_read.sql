CREATE POLICY "Read project files" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'project-files' AND (public.has_role(auth.uid(), 'admin') OR public.owns_order(((storage.foldername(name))[1])::uuid))
);