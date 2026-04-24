-- Allow admins to delete chat conversations and messages so they can clear chats.
CREATE POLICY "Admins can delete conversations"
ON public.chat_conversations
FOR DELETE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (is_admin());