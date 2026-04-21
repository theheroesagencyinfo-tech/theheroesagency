
-- ============================================================
-- 1. REVIEWS: Restrict email column from public reads
-- ============================================================

-- Drop existing public SELECT policy
DROP POLICY IF EXISTS "Public reads approved, admins read all" ON public.reviews;

-- Only admins can read the full reviews table (including email).
CREATE POLICY "Admins read all reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Recreate / ensure the safe public view (no email column)
DROP VIEW IF EXISTS public.approved_reviews;
CREATE VIEW public.approved_reviews
WITH (security_invoker = true)
AS
SELECT id, name, company, star_rating, message, is_featured, created_at
FROM public.reviews
WHERE status = 'approved';

GRANT SELECT ON public.approved_reviews TO anon, authenticated;

-- Keep INSERT open (public submissions). Re-add explicit policy to be safe.
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================
-- 2. CHAT: Switch from spoofable header to auth.uid()
-- ============================================================

-- Add a visitor_user_id linked to auth.users (set on conversation creation)
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS visitor_user_id uuid;

CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor_user_id
  ON public.chat_conversations(visitor_user_id);

-- Replace existing visitor-id-header based policies on chat_conversations
DROP POLICY IF EXISTS "Visitors can read own conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update own conversation" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;

CREATE POLICY "Visitors read their own conversation"
ON public.chat_conversations
FOR SELECT
TO authenticated
USING (visitor_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Authenticated visitors create conversations"
ON public.chat_conversations
FOR INSERT
TO authenticated
WITH CHECK (visitor_user_id = auth.uid());

CREATE POLICY "Visitors update their own conversation"
ON public.chat_conversations
FOR UPDATE
TO authenticated
USING (visitor_user_id = auth.uid() OR public.is_admin())
WITH CHECK (visitor_user_id = auth.uid() OR public.is_admin());

-- Replace chat_messages policies
DROP POLICY IF EXISTS "Can read messages in accessible conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.chat_messages;

CREATE POLICY "Read messages for owned/admin conversations"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (c.visitor_user_id = auth.uid() OR public.is_admin())
  )
);

CREATE POLICY "Insert messages into owned/admin conversations"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (
        (c.visitor_user_id = auth.uid() AND chat_messages.sender_type = 'visitor')
        OR (public.is_admin() AND chat_messages.sender_type = 'admin')
      )
  )
);

CREATE POLICY "Admins update messages"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ============================================================
-- 3. REALTIME: Channel authorization for chat tables
-- ============================================================
-- Enable RLS on realtime.messages so subscriptions are authorized.

ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

-- Drop any prior policies we manage to avoid duplicates
DROP POLICY IF EXISTS "Authenticated users can listen to own chat channels" ON realtime.messages;

-- Allow authenticated users to subscribe only to the chat-{conversation_id}
-- topic for a conversation they own (or if they're admin).
CREATE POLICY "Authenticated users can listen to own chat channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Allow non-chat topics through (other realtime use-cases) AND
  -- restrict chat-* topics to owners / admins.
  CASE
    WHEN realtime.topic() LIKE 'chat-%' THEN
      EXISTS (
        SELECT 1
        FROM public.chat_conversations c
        WHERE ('chat-' || c.id::text) = realtime.topic()
          AND (c.visitor_user_id = auth.uid() OR public.is_admin())
      )
    ELSE true
  END
);

-- ============================================================
-- 4. is_admin(): restrict execution to authenticated/admin paths
-- ============================================================
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
