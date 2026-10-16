import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { packages, addons, orderStatuses } from "@/lib/packages";
import type { Database } from "@/integrations/supabase/types";

type Order = Database["public"]["Tables"]["package_orders"]["Row"];

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [
    { title: "My projects — TheHeroes Agency" },
    { name: "description", content: "Follow the progress of your author platform project." },
    { property: "og:title", content: "My projects — TheHeroes Agency" },
    { property: "og:description", content: "Client area for TheHeroes Agency · Author Studio." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { (async () => {
    const { data: u } = await supabase.auth.getUser();
    if (u.user) { const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" }); setIsAdmin(!!data); }
    const { data } = await supabase.from("package_orders").select("*").eq("email", u.user?.email ?? "").order("created_at", { ascending: false });
    setOrders(data ?? []);
  })(); }, []);
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  return <section className="mx-auto max-w-4xl px-5 py-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-4xl sm:text-5xl">My projects</h1>
      <div className="flex gap-3">{isAdmin && <Button asChild variant="studio" size="studio"><Link to="/admin">Open admin</Link></Button>}<Button onClick={signOut} variant="studioOutline" size="studio">Sign out</Button></div>
    </div>
    {orders === null ? <p className="mt-10 text-muted-foreground">Loading…</p>
    : orders.length === 0 ? <div className="mt-10 border-t pt-8"><p className="text-muted-foreground">No projects yet for this email.</p><Button asChild variant="studio" size="studio" className="mt-6"><Link to="/pricing" hash="packages">See packages</Link></Button></div>
    : <ul className="mt-10 divide-y border-y">{orders.map(o => {
      const at = orderStatuses.indexOf(o.status as typeof orderStatuses[number]);
      return <li key={o.id} className="py-8">
        <p className="text-sm text-muted-foreground">Requested {new Date(o.created_at).toLocaleDateString()}</p>
        <h2 className="mt-2 text-2xl">{packages.find(p => p.slug === o.package)?.name} · {o.book}</h2>
        {o.addons.length > 0 && <p className="mt-2 text-sm text-muted-foreground">Add-ons: {o.addons.map(id => addons.find(a => a.id === id)?.name ?? id).join(", ")}{o.rush ? ", rush delivery" : ""}</p>}
        <ol className="mt-6 grid grid-cols-5 gap-2 text-xs sm:text-sm">{orderStatuses.map((s, i) => <li key={s} className={`border-t-2 pt-2 ${i <= at ? "border-primary text-foreground font-semibold" : "text-muted-foreground"}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</li>)}</ol>
      </li>; })}</ul>}
  </section>;
}
