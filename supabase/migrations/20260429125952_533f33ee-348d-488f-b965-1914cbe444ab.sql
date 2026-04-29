-- Tighten RLS on analytics tables: replace `with check (true)` with sanity checks
-- so we don't allow blank/garbage rows from anonymous traffic, while still
-- permitting un-authenticated visitor tracking.

-- page_views
DROP POLICY IF EXISTS "Anyone can record page views" ON public.page_views;
CREATE POLICY "Anyone can record page views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND length(session_id) BETWEEN 4 AND 128
  AND path IS NOT NULL
  AND length(path) BETWEEN 1 AND 1024
);

-- page_events
DROP POLICY IF EXISTS "Anyone can record events" ON public.page_events;
CREATE POLICY "Anyone can record events"
ON public.page_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND length(session_id) BETWEEN 4 AND 128
  AND event_name IS NOT NULL
  AND length(event_name) BETWEEN 1 AND 100
);

-- Helpful indexes for analytics queries (range filter + grouping)
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_events_created_at ON public.page_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_events_event_name ON public.page_events (event_name);
CREATE INDEX IF NOT EXISTS idx_page_events_session_id ON public.page_events (session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views (session_id);