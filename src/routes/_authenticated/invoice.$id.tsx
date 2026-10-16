import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL } from "@/components/site";
import { invoiceLines, packageSlugs, type PackageSlug } from "@/lib/packages";
import { invoiceNo, invoiceReady, money, type Order } from "@/lib/client-projects";

export const Route = createFileRoute("/_authenticated/invoice/$id")({
  head: () => ({ meta: [
    { title: "Invoice · TheHeroes Agency" },
    { name: "description", content: "Your project invoice from TheHeroes Agency." },
    { property: "og:title", content: "Invoice · TheHeroes Agency" },
    { property: "og:description", content: "Project invoice for TheHeroes Agency clients." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Invoice,
});

function Invoice() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => { supabase.from("package_orders").select("*").eq("id", id).maybeSingle().then(r => setOrder(r.data)); }, [id]);

  if (order === undefined) return <p className="mx-auto max-w-3xl px-5 py-20 text-muted-foreground">Loading…</p>;
  if (!order || !packageSlugs.includes(order.package as PackageSlug)) return <p className="mx-auto max-w-3xl px-5 py-20">Invoice not found.</p>;
  if (!invoiceReady(order)) return <section className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-4xl">Invoice not ready yet</h1><p className="mt-4 text-muted-foreground">Your invoice will appear here once your package is confirmed.</p><Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/account">Back to my projects</Link></Button></section>;

  const inv = invoiceLines(order.package as PackageSlug, order.addons, order.rush);
  const issued = new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return <section className="mx-auto max-w-3xl px-5 py-12 print:max-w-none print:p-0">
    <div className="mb-8 flex flex-wrap justify-between gap-3 print:hidden">
      <Link to="/account" className="text-sm underline underline-offset-4">← Back to my projects</Link>
      <Button onClick={() => window.print()} variant="studio" size="studio">Download invoice (PDF)</Button>
    </div>
    <article className="border bg-background p-8 sm:p-12 print:border-0 print:p-0">
      <header className="flex flex-wrap justify-between gap-6 border-b pb-8">
        <div><p className="font-serif text-3xl">TheHeroes Agency</p><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Author Studio</p><p className="mt-3 text-sm">{CONTACT_EMAIL}</p></div>
        <div className="text-right"><p className="text-3xl">Invoice</p><p className="mt-2 text-sm">{invoiceNo(order)}</p><p className="text-sm text-muted-foreground">Issued {issued}</p></div>
      </header>
      <div className="grid gap-6 border-b py-8 sm:grid-cols-2">
        <div><p className="text-sm text-muted-foreground">Billed to</p><p className="mt-2 font-semibold">{order.name}</p><p>{order.email}</p></div>
        <div><p className="text-sm text-muted-foreground">Project</p><p className="mt-2">{order.book}</p></div>
      </div>
      <table className="w-full text-left">
        <thead><tr className="border-b text-sm text-muted-foreground"><th className="py-3 font-normal">Item</th><th className="py-3 text-right font-normal">Amount</th></tr></thead>
        <tbody>{inv.lines.map(l => <tr key={l.label} className="border-b"><td className="py-3">{l.label}{l.monthly && <span className="text-sm text-muted-foreground"> · monthly</span>}</td><td className="py-3 text-right">{money(l.amount)}{l.monthly ? "/month" : ""}</td></tr>)}</tbody>
        <tfoot>
          <tr><td className="pt-5 font-semibold">Project total</td><td className="pt-5 text-right font-serif text-3xl">{money(inv.oneOff)}</td></tr>
          {inv.monthly > 0 && <tr><td className="pt-2 text-sm">Monthly services, billed separately from launch</td><td className="pt-2 text-right">{money(inv.monthly)}/month</td></tr>}
        </tfoot>
      </table>
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl">Payment schedule</h2>
        <ul className="mt-4 divide-y border-y">{inv.schedule.map(s => <li key={s.label} className="flex justify-between gap-4 py-3"><span>{s.label}</span><span className="font-semibold">{money(s.amount)}</span></li>)}</ul>
        {order.package === "book-launch" && <p className="mt-3 text-sm text-muted-foreground">Prefer three payments? The package is also available as 3 payments of $1,900. Just reply to let me know.</p>}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Pay by invoice, card, or bank transfer. Payment details are sent with your confirmation email. Prices are starting prices; the final scope is agreed in writing before work begins. Questions? Email {CONTACT_EMAIL} and quote {invoiceNo(order)}.</p>
    </article>
  </section>;
}
