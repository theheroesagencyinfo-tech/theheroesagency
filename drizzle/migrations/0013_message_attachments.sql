ALTER TABLE public.project_messages ADD COLUMN IF NOT EXISTS attachment_path text, ADD COLUMN IF NOT EXISTS attachment_name text, ADD COLUMN IF NOT EXISTS attachment_type text;
ALTER TABLE public.project_messages DROP CONSTRAINT IF EXISTS project_messages_body_check;
ALTER TABLE public.project_messages ADD CONSTRAINT project_messages_content_check CHECK (char_length(body) <= 4000 AND (char_length(btrim(body)) > 0 OR attachment_path IS NOT NULL));
ALTER TABLE public.project_messages ADD CONSTRAINT project_messages_attachment_path_check CHECK (attachment_path IS NULL OR split_part(attachment_path, '/', 1) = order_id::text);
CREATE POLICY "Clients upload message files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-files' AND (storage.foldername(name))[2] = 'messages' AND public.owns_order(((storage.foldername(name))[1])::uuid));