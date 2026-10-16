import { createServerFn } from "@tanstack/react-start";
import { orderSchema } from "./packages";

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("package_orders").insert(data);
    if (error) { console.error("order insert failed", error.message); return { ok: false as const }; }
    return { ok: true as const };
  });
