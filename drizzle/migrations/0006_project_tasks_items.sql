CREATE OR REPLACE FUNCTION public.owns_order(_order_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.package_orders WHERE id = _order_id AND lower(email) = lower(auth.jwt() ->> 'email'))
$$;

ALTER TABLE public.package_orders ADD COLUMN invoice_number serial;

CREATE TABLE public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.package_orders(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_tasks TO authenticated;
GRANT ALL ON public.project_tasks TO service_role;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tasks" ON public.project_tasks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own tasks" ON public.project_tasks FOR SELECT TO authenticated USING (public.owns_order(order_id));

CREATE TABLE public.project_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.package_orders(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('page','wireframe','update')),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  url text,
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_items TO authenticated;
GRANT ALL ON public.project_items TO service_role;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage items" ON public.project_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own items" ON public.project_items FOR SELECT TO authenticated USING (public.owns_order(order_id));

CREATE POLICY "Admins upload project files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete project files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-files' AND public.has_role(auth.uid(), 'admin'));