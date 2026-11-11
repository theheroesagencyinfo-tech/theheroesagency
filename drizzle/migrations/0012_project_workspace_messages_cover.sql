ALTER TABLE public.package_orders ADD COLUMN IF NOT EXISTS cover_path text;

CREATE OR REPLACE FUNCTION public.set_order_cover(_order_id uuid, _path text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.owns_order(_order_id) OR public.has_role(auth.uid(), 'admin')) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  IF _path IS NOT NULL AND split_part(_path, '/', 1) <> _order_id::text THEN RAISE EXCEPTION 'Invalid path'; END IF;
  UPDATE public.package_orders SET cover_path = _path WHERE id = _order_id;
END $$;
REVOKE ALL ON FUNCTION public.set_order_cover(uuid, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_order_cover(uuid, text) TO authenticated;

CREATE POLICY "Clients upload project covers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-files' AND (storage.foldername(name))[2] = 'cover' AND public.owns_order(((storage.foldername(name))[1])::uuid));

CREATE TABLE public.project_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.package_orders(id) ON DELETE CASCADE,
  section text NOT NULL CHECK (section IN ('strategy','copy','design')),
  body text NOT NULL DEFAULT '' CHECK (char_length(body) <= 20000),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved')),
  updated_by uuid DEFAULT auth.uid(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, section)
);
GRANT SELECT, INSERT, UPDATE ON public.project_notes TO authenticated;
GRANT ALL ON public.project_notes TO service_role;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read project notes" ON public.project_notes FOR SELECT TO authenticated USING (public.owns_order(order_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Write project notes" ON public.project_notes FOR INSERT TO authenticated WITH CHECK (public.owns_order(order_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Update project notes" ON public.project_notes FOR UPDATE TO authenticated USING (public.owns_order(order_id) OR public.has_role(auth.uid(),'admin')) WITH CHECK (public.owns_order(order_id) OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.project_notes_stamp() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at := now(); NEW.updated_by := auth.uid();
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status <> 'approved') AND NOT public.has_role(auth.uid(),'admin') AND NOT public.owns_order(NEW.order_id) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER project_notes_stamp BEFORE INSERT OR UPDATE ON public.project_notes FOR EACH ROW EXECUTE FUNCTION public.project_notes_stamp();

CREATE TABLE public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.package_orders(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  from_studio boolean NOT NULL DEFAULT false,
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.project_messages TO authenticated;
GRANT ALL ON public.project_messages TO service_role;
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read project messages" ON public.project_messages FOR SELECT TO authenticated USING (public.owns_order(order_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Send project messages" ON public.project_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND (public.owns_order(order_id) OR public.has_role(auth.uid(),'admin')));

CREATE OR REPLACE FUNCTION public.project_messages_stamp() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.from_studio := public.has_role(auth.uid(),'admin'); NEW.created_at := now(); RETURN NEW; END $$;
CREATE TRIGGER project_messages_stamp BEFORE INSERT ON public.project_messages FOR EACH ROW EXECUTE FUNCTION public.project_messages_stamp();