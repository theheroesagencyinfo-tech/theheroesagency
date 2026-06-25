
DROP POLICY IF EXISTS "Anyone can record events" ON public.page_events;
CREATE POLICY "Anyone can record events" ON public.page_events
FOR INSERT WITH CHECK (
  session_id IS NOT NULL AND length(session_id) BETWEEN 4 AND 128
  AND event_name IS NOT NULL AND length(event_name) BETWEEN 1 AND 100
  AND (label IS NULL OR length(label) <= 200)
  AND (path IS NULL OR length(path) <= 1024)
  AND (metadata IS NULL OR pg_column_size(metadata) <= 2048)
);

DROP POLICY IF EXISTS "Anyone can record page views" ON public.page_views;
CREATE POLICY "Anyone can record page views" ON public.page_views
FOR INSERT WITH CHECK (
  session_id IS NOT NULL AND length(session_id) BETWEEN 4 AND 128
  AND path IS NOT NULL AND length(path) BETWEEN 1 AND 1024
  AND (referrer IS NULL OR length(referrer) <= 1024)
  AND (user_agent IS NULL OR length(user_agent) <= 512)
  AND (utm_source IS NULL OR length(utm_source) <= 200)
  AND (utm_medium IS NULL OR length(utm_medium) <= 200)
  AND (utm_campaign IS NULL OR length(utm_campaign) <= 200)
  AND (language IS NULL OR length(language) <= 35)
  AND (device_type IS NULL OR length(device_type) <= 32)
);

DROP POLICY IF EXISTS "Insert messages into owned/admin conversations" ON public.chat_messages;
CREATE POLICY "Insert messages into owned/admin conversations" ON public.chat_messages
FOR INSERT WITH CHECK (
  length(message) BETWEEN 1 AND 4000
  AND EXISTS (
    SELECT 1 FROM chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (
        (c.visitor_user_id = auth.uid() AND chat_messages.sender_type = 'visitor')
        OR (is_admin() AND chat_messages.sender_type = 'admin')
      )
  )
);
