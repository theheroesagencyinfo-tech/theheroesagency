import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminReferrals } from "@/components/admin-referrals";
import { packages, addons, orderStatuses } from "@/lib/packages";
import type { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["project_reviews"]["Row"];
type Request = Database["public"]["Tables"]["review_requests"]["Row"];
type Order = Database["public"]["Tables"]["package_orders"]["Row"];

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Admin · TheHeroes Agency" },
    { name: "description", content: "Approve project reviews and read contact messages." },
    { property: "og:title", content: "Admin · TheHeroes Agency" },
    { property: "og:description", content: "Admin area for TheHeroes Agency · Author Studio." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Admin,
});

const fmt = (d: string) => new Date(d).toLocaleString();

function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"orders" | "reviews" | "messages" | "referrals">("orders");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const [r, m, o] = await Promise.all([
      supabase.from("project_reviews").select("*").order("approved").order("created_at", { ascending: false }),
      supabase.from("review_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("package_orders").select("*").order("created_at", { ascending: false }),
    ]);
    setOrders(o.data ?? []);
    setReviews(r.data ?? []); setRequests(m.data ?? []);
  }
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      setIsAdmin(!!data);
      if (data) load();
    })();
  }, []);

  async function setApproved(id: string, approved: boolean) {
    await supabase.from("project_reviews").update({ approved }).eq("id", id); load();
  }
  async function removeReview(id: string) {
    if (!confirm("Delete this review?")) return;
    await supabase.from("project_reviews").delete().eq("id", id); load();
  }
  async function removeRequest(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("review_requests").delete().eq("id", id); load();
  }
  async function setStatus(id: string, status: string) {
    await supabase.from("package_orders").update({ status }).eq("id", id); load();
  }
  async function removeOrder(id: string) {
    if (!confirm("Delete this order?")) return;
    await supabase.from("package_orders").delete().eq("id", id); load();
  }
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  if (isAdmin === null) return <p className="mx-auto max-w-[1500px] px-5 py-20 text-muted-foreground">Loading…</p>;
  if (!isAdmin) return <section className="mx-auto max-w-[1500px] px-5 py-20"><h1 className="text-4xl">No admin access</h1><p className="mt-4 text-muted-foreground">This account isn't an admin.</p><Button onClick={signOut} variant="studioOutline" size="studio" className="mt-6">Sign out</Button></section>;

  const pending = reviews.filter(r => !r.approved).length;
  return <section className="mx-auto max-w-[1500px] px-5 py-16">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h1 className="text-4xl sm:text-5xl">Admin</h1>
      <Button onClick={signOut} variant="studioOutline" size="studio">Sign out</Button>
    </div>
    <div role="tablist" className="mt-10 flex gap-6 border-b">
      {([["orders", `Orders (${orders.filter(o => o.status === "new").length} new)`], ["reviews", `Reviews (${pending} pending)`], ["messages", `Messages (${requests.length})`], ["referrals", "Referrals"]] as const).map(([k, l]) =>
        <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${tab === k ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>{l}</button>)}
    </div>
    {tab === "referrals" ? <AdminReferrals /> : tab === "orders" ? <ul className="divide-y">
      {orders.length === 0 && <li className="py-8 text-muted-foreground">No orders yet.</li>}
      {orders.map(o => <li key={o.id} className="grid gap-3 py-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm text-muted-foreground">{fmt(o.created_at)} · {o.wants_call ? <span className="font-semibold text-primary">Wants a call first</span> : "Ready for invoice"}</p>
          <p className="mt-2 text-xl">{packages.find(p => p.slug === o.package)?.name}</p>
          <p className="mt-1 font-semibold">{o.name} · <a href={`mailto:${o.email}`} className="underline underline-offset-4">{o.email}</a></p>
          <p className="mt-1">Book: {o.book}</p>
          {(o.addons.length > 0 || o.rush) && <p className="mt-1 text-sm">Add-ons: {[...o.addons.map(id => addons.find(a => a.id === id)?.name ?? id), ...(o.rush ? ["Rush delivery"] : [])].join(", ")}</p>}
          {o.message && <p className="mt-3 max-w-[70ch] whitespace-pre-wrap">{o.message}</p>}
        </div>
        <div className="flex flex-wrap gap-3 md:flex-col">
          <label className="text-sm">Status <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="ml-2 rounded-md border border-input bg-background px-2 py-1">{orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
          <Button asChild variant="studio" size="sm"><Link to="/admin/orders/$id" params={{ id: o.id }}>Manage project</Link></Button>
          <Button asChild variant="studioOutline" size="sm"><a href={`mailto:${o.email}?subject=${encodeURIComponent(`Your ${packages.find(p => p.slug === o.package)?.name} project`)}`}>Email client</a></Button>
          <Button onClick={() => removeOrder(o.id)} variant="ghost" size="sm">Delete</Button>
        </div>
      </li>)}
    </ul> : tab === "reviews" ? <ul className="divide-y">
      {reviews.length === 0 && <li className="py-8 text-muted-foreground">No reviews yet.</li>}
      {reviews.map(r => <li key={r.id} className="grid gap-3 py-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm text-muted-foreground">{r.project.replace("-", " ")} · {fmt(r.created_at)} · {r.approved ? "Approved" : "Pending"}</p>
          <p className="mt-2 font-semibold">{r.name} <span className="text-primary" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></p>
          <p className="mt-2 max-w-[70ch]">{r.comment}</p>
        </div>
        <div className="flex gap-3 md:flex-col">
          {r.approved
            ? <Button onClick={() => setApproved(r.id, false)} variant="studioOutline" size="sm">Hide review</Button>
            : <Button onClick={() => setApproved(r.id, true)} variant="studio" size="sm">Approve review</Button>}
          <Button onClick={() => removeReview(r.id)} variant="ghost" size="sm">Delete</Button>
        </div>
      </li>)}
    </ul> : <ul className="divide-y">
      {requests.length === 0 && <li className="py-8 text-muted-foreground">No messages yet.</li>}
      {requests.map(m => <li key={m.id} className="grid gap-3 py-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm text-muted-foreground">{m.request_type === "quote" ? "Quote request" : "Free review request"} · {m.service} · {fmt(m.created_at)}</p>
          <p className="mt-2 font-semibold">{m.name} · <a href={`mailto:${m.email}`} className="underline underline-offset-4">{m.email}</a></p>
          <p className="mt-1">Book: {m.book}</p>
          {m.website && <p className="mt-1">Website: {m.website}</p>}
          {m.message && <p className="mt-3 max-w-[70ch] whitespace-pre-wrap">{m.message}</p>}
        </div>
        <div className="flex gap-3 md:flex-col">
          <Button asChild variant="studio" size="sm"><a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.book}`)}`}>Reply by email</a></Button>
          <Button onClick={() => removeRequest(m.id)} variant="ghost" size="sm">Delete</Button>
        </div>
      </li>)}
    </ul>}
  </section>;
}
