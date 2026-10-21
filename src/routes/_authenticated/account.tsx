import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { packages, addons, progressOf } from "@/lib/packages";
import { invoiceReady, type Order, type Task } from "@/lib/client-projects";

export const Route = createFileRoute("/_authenticated/account")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "My projects · TheHeroes Agency" },
    { name: "description", content: "Follow the progress of your author platform project." },
    { property: "og:title", content: "My projects · TheHeroes Agency" },
    { property: "og:description", content: "Client area for TheHeroes Agency · Author Studio." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => { (async () => {
    const { data: u } = await supabase.auth.getUser();
    setEmail(u.user?.email ?? "");
    if (u.user) { const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" }); setIsAdmin(!!data); }
    const { data } = await supabase.from("package_orders").select("*").ilike("email", u.user?.email ?? "").order("created_at", { ascending: false });
    const ids = (data ?? []).map(o => o.id);
    if (ids.length) { const t = await supabase.from("project_tasks").select("*").in("order_id", ids); setTasks(t.data ?? []); }
    setOrders(data ?? []);
  })(); }, []);
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  return <section className="mx-auto max-w-4xl px-5 py-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-4xl sm:text-5xl">My projects</h1>{email && <p className="mt-3 text-sm text-muted-foreground">Signed in as {email}</p>}</div>
      <div className="flex gap-3">{isAdmin && <Button asChild variant="studio" size="studio"><Link to="/admin">Open admin</Link></Button>}<Button onClick={signOut} variant="studioOutline" size="studio">Sign out</Button></div>
    </div>
    {orders === null ? <p className="mt-10 text-muted-foreground">Loading…</p>
    : orders.length === 0 ? <div className="mt-10 border-t pt-8"><p className="text-muted-foreground">No projects yet for this email.</p><Button asChild variant="studio" size="studio" className="mt-6"><Link to="/pricing" hash="packages">See packages</Link></Button></div>
    : <ul className="mt-10 divide-y border-y">{orders.map(o => {
      const mine = tasks.filter(t => t.order_id === o.id);
      return <li key={o.id} className="py-8">
        <p className="text-sm text-muted-foreground">Requested {new Date(o.created_at).toLocaleDateString()} · {o.status.charAt(0).toUpperCase() + o.status.slice(1)}</p>
        <h2 className="mt-2 text-2xl">{packages.find(p => p.slug === o.package)?.name} · {o.book}</h2>
        {(o.addons.length > 0 || o.rush) && <p className="mt-2 text-sm text-muted-foreground">Add-ons: {[...o.addons.map(id => addons.find(a => a.id === id)?.name ?? id), ...(o.rush ? ["Rush delivery"] : [])].join(", ")}</p>}
        <div className="mt-6"><ProgressBar value={progressOf(mine)} /></div>
        <p className="mt-2 text-sm text-muted-foreground">{mine.length ? `${mine.filter(t => t.done).length} of ${mine.length} tasks done` : "Your task list will appear once work is scheduled."}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="studio" size="studio"><Link to="/my-projects/$id" params={{ id: o.id }}>Open project dashboard</Link></Button>
          {invoiceReady(o) ? <Button asChild variant="studioOutline" size="studio"><Link to="/invoice/$id" params={{ id: o.id }}>View and download invoice</Link></Button>
            : <p className="self-center text-sm text-muted-foreground">Your invoice will be ready once your package is confirmed.</p>}
        </div>
      </li>; })}</ul>}
  </section>;
}
