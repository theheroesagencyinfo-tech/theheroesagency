import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, Star, Inbox, Gift, User, Phone } from "lucide-react";
import { DashboardShell, SectionHeader, StatCard } from "@/components/dashboard-shell";
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
  const [tab, setTab] = useState<"overview" | "orders" | "reviews" | "messages" | "referrals">("overview");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [newest, setNewest] = useState(true);

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
  const fresh = orders.filter(o => o.status === "new").length;
  const calls = orders.filter(o => o.wants_call).length;
  const titles: Record<typeof tab, [string, string, string]> = {
    overview: ["Studio cockpit", "Studio overview", "A clear view of the studio's activity, projects and client relationships."],
    orders: ["Pipeline", "Orders", "Search, filter and manage every confirmed package."], reviews: ["Moderation", "Reviews", "Approve what appears on your public case studies."],
    messages: ["Inbox", "Messages", "Quote and free review requests from your website."], referrals: ["Loyalty", "Referrals", "Pipeline, client tiers and teaser production."],
  };
  const needle = q.trim().toLowerCase();
  const sort = <T extends { created_at: string }>(a: T, b: T) => (newest ? -1 : 1) * a.created_at.localeCompare(b.created_at);
  const shownOrders = orders.filter(o => (filter === "all" || o.status === filter) && `${o.name} ${o.email} ${o.book} ${o.package}`.toLowerCase().includes(needle)).sort(sort);
  const shownRequests = requests.filter(m => (filter === "all" || m.request_type === filter) && `${m.name} ${m.email} ${m.book} ${m.message}`.toLowerCase().includes(needle)).sort(sort);
  const statusTone = (s: string) => s === "invoice-sent" || s === "invoice sent" ? "border-brass/50 text-brass" : s === "launched" ? "border-primary bg-primary text-primary-foreground" : s === "new" ? "border-border text-muted-foreground" : "border-primary/40 text-primary";
  const Status = ({ s }: { s: string }) => <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusTone(s)}`}>{s.replace(/[-_]/g, " ")}</span>;
  const select = (t: typeof tab) => { setTab(t); setQ(""); setFilter("all"); };
  const toolbar = (options: [string, string][]) => <div className="mb-6 flex flex-wrap gap-3">
    <input value={q} onChange={e => setQ(e.target.value)} aria-label="Search" placeholder="Search name, email or book" className="h-10 min-w-0 flex-1 rounded-md border bg-card px-3 text-sm sm:max-w-sm" />
    <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter" className="h-10 rounded-md border bg-card px-3 text-sm">{options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
    <Button variant="studioOutline" type="button" onClick={() => setNewest(!newest)} className="h-10 rounded-md border bg-card px-3 text-sm">{newest ? "Newest first" : "Oldest first"}</Button>
  </div>;
  return <DashboardShell eyebrow="TheHeroes Agency" title="Admin" active={tab} onSelect={select} onSignOut={signOut}
    items={[{ key: "overview", label: "Overview", icon: LayoutDashboard }, { key: "orders", label: "Orders", icon: ShoppingBag, badge: fresh },
      { key: "reviews", label: "Reviews", icon: Star, badge: pending }, { key: "messages", label: "Messages", icon: Inbox, badge: requests.length },
      { key: "referrals", label: "Referrals", icon: Gift }]}
    footer={<Link to="/account" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-pitch-muted hover:bg-pitch-foreground/5 hover:text-pitch-foreground"><User aria-hidden className="h-4 w-4" />My account</Link>}>
    <SectionHeader eyebrow={titles[tab][0]} title={titles[tab][1]} text={titles[tab][2]} />
    {tab === "overview" ? <div className="grid gap-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="New orders" value={fresh} hint={`${orders.length} total`} icon={ShoppingBag} onClick={() => { select("orders"); setFilter("new"); }} />
        <StatCard label="Want a call" value={calls} hint="Asked to talk first" icon={Phone} onClick={() => select("orders")} />
        <StatCard label="Reviews to approve" value={pending} hint={`${reviews.length} total`} icon={Star} onClick={() => select("reviews")} />
        <StatCard label="Messages" value={requests.length} hint="From the contact form" icon={Inbox} onClick={() => select("messages")} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-t py-6"><div className="flex items-center justify-between"><h2 className="text-2xl">Latest orders</h2><Button variant="link" type="button" onClick={() => select("orders")} className="text-sm text-primary underline-offset-4 hover:underline">See all orders</Button></div>
          <ul className="mt-4 divide-y">{orders.slice(0, 5).map(o => <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="min-w-0"><span className="font-medium">{o.name}</span><span className="block truncate font-serif text-base">{o.book}</span><span className="block text-muted-foreground">{packages.find(p => p.slug === o.package)?.name} · {new Date(o.created_at).toLocaleDateString()}</span></span><Status s={o.status} /></li>)}
          {orders.length === 0 && <li className="py-3 text-sm text-muted-foreground">No orders yet.</li>}</ul></div>
        <div className="border-t py-6"><div className="flex items-center justify-between"><h2 className="text-2xl">Latest messages</h2><Button variant="link" type="button" onClick={() => select("messages")} className="text-sm text-primary underline-offset-4 hover:underline">Open inbox</Button></div>
          <ul className="mt-4 divide-y">{requests.slice(0, 5).map(m => <li key={m.id} className="py-3 text-sm"><span className="font-medium">{m.name}</span><span className="block text-muted-foreground">{m.request_type === "quote" ? "Quote request" : "Free review"} · {new Date(m.created_at).toLocaleDateString()}</span>{m.message && <span className="mt-1 block truncate text-muted-foreground">{m.message}</span>}</li>)}
          {requests.length === 0 && <li className="py-3 text-sm text-muted-foreground">No messages yet.</li>}</ul></div>
      </div>
    </div> : tab === "referrals"
 ? <AdminReferrals /> : tab === "orders" ? <>{toolbar([["all", "All statuses"], ...orderStatuses.map(s => [s, s.replace(/[-_]/g, " ")] as [string, string])])}<ul className="divide-y rounded-lg border bg-card px-6">
      {shownOrders.length === 0 && <li className="py-8 text-muted-foreground">No matching orders.</li>}
      {shownOrders.map(o => <li key={o.id} className="grid min-w-0 gap-3 py-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-sm text-muted-foreground">{fmt(o.created_at)} · {o.wants_call ? <span className="font-semibold text-primary">Wants a call first</span> : "Ready for invoice"}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3"><p className="font-serif text-2xl">{o.book}</p><Status s={o.status} /></div>
          <p className="mt-1 text-sm text-muted-foreground">{packages.find(p => p.slug === o.package)?.name}</p>
          <p className="mt-1 break-words font-semibold">{o.name} · <a href={`mailto:${o.email}`} className="underline underline-offset-4">{o.email}</a></p>
          <p className="mt-1">Book: {o.book}</p>
          {(o.addons.length > 0 || o.rush) && <p className="mt-1 text-sm">Add-ons: {[...o.addons.map(id => addons.find(a => a.id === id)?.name ?? id), ...(o.rush ? ["Rush delivery"] : [])].join(", ")}</p>}
          {o.message && <p className="mt-3 max-w-[70ch] whitespace-pre-wrap break-words">{o.message}</p>}
        </div>
        <div className="flex flex-wrap gap-3 md:flex-col">
          <label className="text-sm">Status <select value={o.status} onChange={e => setStatus(o.id, e.target.value)} className="ml-2 rounded-md border border-input bg-background px-2 py-1">{orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
          <Button asChild variant="studio" size="sm"><Link to="/admin/orders/$id" params={{ id: o.id }}>Manage project</Link></Button>
          <Button asChild variant="studioOutline" size="sm"><a href={`mailto:${o.email}?subject=${encodeURIComponent(`Your ${packages.find(p => p.slug === o.package)?.name} project`)}`}>Email client</a></Button>
          <Button onClick={() => removeOrder(o.id)} variant="ghost" size="sm">Delete</Button>
        </div>
      </li>)}
    </ul></> : tab === "reviews" ? <ul className="divide-y rounded-lg border bg-card px-6">
      {reviews.length === 0 && <li className="py-8 text-muted-foreground">No reviews yet.</li>}
      {reviews.map(r => <li key={r.id} className="grid min-w-0 gap-3 py-6 md:grid-cols-[minmax(0,1fr)_auto]">
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
    </ul> : <>{toolbar([["all", "All messages"], ["quote", "Quote requests"], ["review", "Free review requests"]])}<ul className="divide-y rounded-lg border bg-card px-6">
      {shownRequests.length === 0 && <li className="py-8 text-muted-foreground">No matching messages.</li>}
      {shownRequests.map(m => <li key={m.id} className="grid min-w-0 gap-3 py-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-sm text-muted-foreground"><span className={`mr-2 rounded-full border px-2.5 py-0.5 text-xs font-medium ${m.request_type === "quote" ? "border-brass/50 text-brass" : "border-primary/40 text-primary"}`}>{m.request_type === "quote" ? "Quote request" : "Free review request"}</span>{m.service} · {fmt(m.created_at)}</p>
          <p className="mt-2 font-semibold">{m.name} · <a href={`mailto:${m.email}`} className="underline underline-offset-4">{m.email}</a></p>
          <p className="mt-1">Book: {m.book}</p>
          {m.website && <p className="mt-1">Website: {m.website}</p>}
          {m.message && <p className="mt-3 max-w-[70ch] whitespace-pre-wrap break-words">{m.message}</p>}
        </div>
        <div className="flex gap-3 md:flex-col">
          <Button asChild variant="studio" size="sm"><a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.book}`)}`}>Reply by email</a></Button>
          <Button onClick={() => removeRequest(m.id)} variant="ghost" size="sm">Delete</Button>
        </div>
      </li>)}
    </ul></>}
  </DashboardShell>;
}
