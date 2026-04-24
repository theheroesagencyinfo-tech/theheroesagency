-- Tighten the realtime.messages SELECT policy:
-- previously the ELSE branch returned true, allowing any authenticated user
-- to subscribe to any non-"chat-%" Realtime topic. Default-deny instead.

DROP POLICY IF EXISTS "Authenticated users can listen to own chat channels" ON realtime.messages;

CREATE POLICY "Authenticated users can listen to own chat channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE 'chat-%'
  AND EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE ('chat-' || c.id::text) = realtime.topic()
      AND (c.visitor_user_id = auth.uid() OR public.is_admin())
  )
);