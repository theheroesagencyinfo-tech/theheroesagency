import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { newsletterSchema } from "./newsletter-schema";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data) => newsletterSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: data.email });
    if (error) {
      // 23505 = unique violation: already subscribed, still a success for the visitor.
      if (error.code === "23505") return { ok: true as const, alreadySubscribed: true };
      console.error("newsletter insert failed", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
