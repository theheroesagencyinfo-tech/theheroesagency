import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const reviewProjects = ["daniel-carter", "eleanor-whitmore", "jonathan-reed"] as const;

export const projectReviewSchema = z.object({
  project: z.enum(reviewProjects),
  name: z.string().trim().min(1, "Please add your name").max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1, "Please share your thoughts").max(1000),
});

export const submitProjectReview = createServerFn({ method: "POST" })
  .inputValidator((data) => projectReviewSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("project_reviews").insert(data);
    if (error) { console.error("project review insert failed", error.message); return { ok: false as const }; }
    return { ok: true as const };
  });

export const listProjectReviews = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ project: z.enum(reviewProjects) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin.from("project_reviews")
      .select("id,name,rating,comment").eq("project", data.project).eq("approved", true)
      .order("created_at", { ascending: false }).limit(20);
    return rows ?? [];
  });
