import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Order = Database["public"]["Tables"]["package_orders"]["Row"];
export type Task = Database["public"]["Tables"]["project_tasks"]["Row"];
export type Item = Database["public"]["Tables"]["project_items"]["Row"];

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
export const invoiceNo = (o: Pick<Order, "invoice_number">) => `THA-${String(o.invoice_number).padStart(4, "0")}`;
export const invoiceReady = (o: Pick<Order, "status">) => o.status !== "new";

export async function loadProject(id: string) {
  const [o, t, i] = await Promise.all([
    supabase.from("package_orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_tasks").select("*").eq("order_id", id).order("created_at"),
    supabase.from("project_items").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);
  const items = i.data ?? [];
  const paths = items.filter(x => x.kind === "wireframe" && x.url && !/^https?:/.test(x.url)).map(x => x.url!);
  const signed: Record<string, string> = {};
  if (paths.length) {
    const { data } = await supabase.storage.from("project-files").createSignedUrls(paths, 3600);
    for (const s of data ?? []) if (s.path && s.signedUrl) signed[s.path] = s.signedUrl;
  }
  return { order: o.data, tasks: t.data ?? [], items: items.map(x => ({ ...x, src: x.url ? signed[x.url] ?? x.url : null })) };
}
