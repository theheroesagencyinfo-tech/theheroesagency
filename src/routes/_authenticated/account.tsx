import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Mail, CalendarDays, FileText, LayoutDashboard, FolderKanban, Settings } from "lucide-react";
import { AccountSettings } from "@/components/account-settings";
import banner from "@/assets/banner-writers-desk.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { BOOKING_URL, CONTACT_EMAIL } from "@/components/site";
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

const STAGES = ["Strategy", "Structure and copy", "Design", "Build and launch"];
const stageOf = (pct: number) => Math.min(STAGES.length - 1, Math.floor(pct / (100 / STAGES.length)));
const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Roadmap({ pct }: { pct: number }) {
  const current = pct >= 100 ? STAGES.length : stageOf(pct);
  return <ol className="grid gap-3 sm:grid-cols-4">{STAGES.map((s, i) => {
    const done = i < current, now = i === current;
    return <li key={s} className={`rounded-lg border p-3 text-sm ${now ? "border-primary bg-secondary" : ""}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${done ? "border-primary bg-primary text-primary-foreground" : now ? "border-primary text-primary" : "text-muted-foreground"}`}>
        {done ? <Check aria-hidden className="h-3.5 w-3.5" /> : i + 1}</span>
      <span className={`mt-2 block ${done || now ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
      <span className="sr-only">{done ? "done" : now ? "current stage" : "upcoming"}</span>
    </li>; })}</ol>;
}

function Account() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tab, setTab] = useState<"projects" | "settings">("projects");
  useEffect(() => { (async () => {
    const { data: u } = await supabase.auth.getUser();
    setName(u.user?.user_metadata?.full_name ?? "");
    setEmail(u.user?.email ?? "");
    if (u.user) { const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" }); setIsAdmin(!!data); }
    const { data } = await supabase.from("package_orders").select("*").ilike("email", u.user?.email ?? "").order("created_at", { ascending: false });
    const ids = (data ?? []).map(o => o.id);
    if (ids.length) { const t = await supabase.from("project_tasks").select("*").in("order_id", ids); setTasks(t.data ?? []); }
    setOrders(data ?? []);
  })(); }, []);
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  const firstName = String(name).split(" ")[0];
  return <section className="mx-auto max-w-[1500px] px-5 py-10 sm:py-14">
    <div className="relative overflow-hidden rounded-2xl bg-pitch p-8 text-pitch-foreground sm:p-12">
      <img src={banner.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/80 to-transparent" />
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pitch-accent">Private client space</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Welcome back{firstName ? `, ${firstName}` : ""}.</h1>
          {email && <p className="mt-3 text-sm text-pitch-muted">Signed in as {email}</p>}
        </div>
        <div className="flex gap-3">{isAdmin && <Button asChild variant="studio" size="studio"><Link to="/admin">Open admin</Link></Button>}<Button onClick={signOut} variant="ghostDark" size="studio">Sign out</Button></div>
      </div>
    </div>

    <div role="tablist" aria-label="Account sections" className="mt-8 flex gap-2 border-b">
      {([["projects", "My projects", FolderKanban], ["settings", "Account settings", Settings]] as const).map(([k, l, I]) =>
        <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
          className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === k ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <I aria-hidden className="h-4 w-4" />{l}</button>)}
    </div>

    {tab === "settings" ? <div className="mt-10"><AccountSettings email={email} /></div> :
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
      <div>
        {orders === null ? <p className="text-muted-foreground">Loading your projects…</p>
        : orders.length === 0 ? <div className="rounded-2xl border bg-card p-8 sm:p-10">
            <h2 className="text-3xl">Your author platform starts here.</h2>
            <p className="mt-3 max-w-[60ch] text-muted-foreground">There are no projects linked to this email yet. Pick a starting point below.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link to="/pricing" hash="packages" className="rounded-xl border p-5 transition-colors hover:border-primary"><span className="font-medium">See packages</span><span className="mt-1 block text-sm text-muted-foreground">Compare the three ways I help.</span></Link>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border p-5 transition-colors hover:border-primary"><span className="font-medium">Book a call</span><span className="mt-1 block text-sm text-muted-foreground">Talk through your book and goals.</span></a>
              <Link to="/contact" className="rounded-xl border p-5 transition-colors hover:border-primary"><span className="font-medium">Get a free review</span><span className="mt-1 block text-sm text-muted-foreground">Feedback on your current site.</span></Link>
            </div>
          </div>
        : <ul className="grid gap-8">{orders.map(o => {
          const mine = tasks.filter(t => t.order_id === o.id);
          const pct = progressOf(mine);
          const next = mine.find(t => !t.done);
          return <li key={o.id} className="rounded-2xl border bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-primary">{statusLabel(o.status)}</span>
              <span className="text-muted-foreground">Requested {new Date(o.created_at).toLocaleDateString()}</span>
            </div>
            <h2 className="mt-4 text-3xl">{o.book}</h2>
            <p className="mt-1 text-muted-foreground">{packages.find(p => p.slug === o.package)?.name}</p>
            {(o.addons.length > 0 || o.rush) && <p className="mt-2 text-sm text-muted-foreground">Add-ons: {[...o.addons.map(id => addons.find(a => a.id === id)?.name ?? id), ...(o.rush ? ["Rush delivery"] : [])].join(", ")}</p>}
            <div className="mt-8"><Roadmap pct={pct} /></div>
            <div className="mt-6"><ProgressBar value={pct} /></div>
            <p className="mt-2 text-sm text-muted-foreground">{mine.length ? `${mine.filter(t => t.done).length} of ${mine.length} tasks done` : "Your task list will appear once work is scheduled."}</p>
            {next && <div className="mt-6 rounded-lg border-l-2 border-primary bg-secondary px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Up next</p><p className="mt-1">{next.title}</p></div>}
            <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
              <Button asChild variant="studio" size="studio"><Link to="/my-projects/$id" params={{ id: o.id }}><LayoutDashboard aria-hidden className="mr-2 h-4 w-4" />Open project dashboard</Link></Button>
              {invoiceReady(o) ? <Button asChild variant="studioOutline" size="studio"><Link to="/invoice/$id" params={{ id: o.id }}><FileText aria-hidden className="mr-2 h-4 w-4" />View and download invoice</Link></Button>
                : <p className="self-center text-sm text-muted-foreground">Your invoice will be ready once your package is confirmed.</p>}
            </div>
          </li>; })}</ul>}
      </div>

      <aside className="h-fit rounded-2xl border bg-secondary p-6 lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your studio contact</p>
        <p className="mt-3 text-2xl">Mou Barrac</p>
        <p className="mt-1 text-sm text-muted-foreground">Questions, feedback, or files? Reach me directly.</p>
        <div className="mt-6 grid gap-3 text-sm">
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 break-all underline underline-offset-4"><Mail aria-hidden className="h-4 w-4 shrink-0 text-primary" />{CONTACT_EMAIL}</a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-4"><CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-primary" />Book a check-in call</a>
        </div>
      </aside>
    </div>}
  </section>;
}
