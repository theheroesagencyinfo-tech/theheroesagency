CREATE TABLE public.package_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  book text NOT NULL,
  message text NOT NULL DEFAULT '',
  package text NOT NULL CHECK (package IN ('book-presence','reader-to-client','book-launch')),
  addons text[] NOT NULL DEFAULT '{}',
  rush boolean NOT NULL DEFAULT false,
  wants_call boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','invoice sent','in progress','in review','launched')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.package_orders TO authenticated;
GRANT ALL ON public.package_orders TO service_role;
ALTER TABLE public.package_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read orders" ON public.package_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients read own orders" ON public.package_orders FOR SELECT TO authenticated USING (lower(email) = lower(auth.jwt() ->> 'email'));
CREATE POLICY "Admins update orders" ON public.package_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.package_orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));