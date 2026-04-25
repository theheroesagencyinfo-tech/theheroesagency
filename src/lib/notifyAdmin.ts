import { supabase } from "@/integrations/supabase/client";

export type NotifyType =
  | "contact"
  | "quote_request"
  | "system_audit"
  | "review"
  | "chat_message";

export interface NotifyAdminPayload {
  type: NotifyType;
  subject?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

/**
 * Fire-and-forget notification to the admin mailbox.
 * Never throws — form flow must never be blocked by email delivery.
 */
export async function notifyAdmin(payload: NotifyAdminPayload): Promise<void> {
  try {
    await supabase.functions.invoke("notify-admin", { body: payload });
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("notifyAdmin failed (non-blocking):", err);
    }
  }
}
