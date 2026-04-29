
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  path text NOT NULL,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text,
  device_type text,
  screen_width integer,
  language text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views(path);
CREATE INDEX idx_page_views_session ON public.page_views(session_id);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record page views"
  ON public.page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read page views"
  ON public.page_views FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can delete page views"
  ON public.page_views FOR DELETE
  USING (is_admin());

CREATE TABLE public.page_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_name text NOT NULL,
  path text,
  label text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_events_created_at ON public.page_events(created_at DESC);
CREATE INDEX idx_page_events_event ON public.page_events(event_name);

ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record events"
  ON public.page_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read events"
  ON public.page_events FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can delete events"
  ON public.page_events FOR DELETE
  USING (is_admin());
