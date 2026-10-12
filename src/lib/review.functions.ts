import { createServerFn } from "@tanstack/react-start";
import { reviewSchema } from "./review-schema";

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data) => reviewSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("review_requests").insert({
      name: data.name,
      email: data.email,
      book: data.book,
      website: data.website || null,
      service: data.service,
      message: data.message,
      request_type: data.request_type,
    });
    if (error) {
      console.error("review insert failed", error.message);
      return { ok: false as const };
    }
    return { ok: true as const };
  });
