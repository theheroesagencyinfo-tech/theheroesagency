import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Mail, CalendarDays, FileText, LayoutDashboard, FolderKanban, Settings, Gift, Shield, TrendingUp } from "lucide-react";
import { DashboardShell, SectionHeader, StatCard } from "@/components/dashboard-shell";
import { ReferralPanel, RankChip, useReferralStats, useMyTier } from "@/components/referral-panel";
import { Avatar, useMyAvatar } from "@/components/avatar-upload";
import mouPhoto from "@/assets/mou/burgundy.png.asset.json";
import { AccountSettings } from "@/components/account-settings";
import banner from "@/assets/jonathan-reed/books.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { BOOKING_URL, SUPPORT_EMAIL } from "@/components/site";
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
  const [tab, setTab] = useState<"projects" | "refer" | "settings">("projects");
  const stats = useReferralStats();
  const mine = useMyTier();
  const avatar = useMyAvatar();
  useEffect(() => { (async () => {
    const { data: u } = await supabase.auth.getUser();
    const meta = u.user?.user_metadata ?? {};
    let display: string = meta["full_name"] || meta["name"] || meta["given_name"] || "";
    setEmail(u.user?.email ?? "");
    if (u.user) { const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" }); setIsAdmin(!!data); }
    if (!display && u.user) {
      const { data: p } = await supabase.from("profiles").select("full_name").eq("user_id", u.user.id).maybeSingle();
      display = p?.full_name ?? "";
    }
    const { data } = await supabase.from("package_orders").select("*").ilike("email", u.user?.email ?? "").order("created_at", { ascending: false });
    if (!display && data?.[0]) display = (data[0] as { name?: string }).name ?? "";
    setName(display);
    const ids = (data ?? []).map(o => o.id);
    if (ids.length) { const t = await supabase.from("project_tasks").select("*").in("order_id", ids); setTasks(t.data ?? []); }
    setOrders(data ?? []);
  })(); }, []);
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  const rawFirst = String(name).trim().split(/\s+/)[0] ?? "";
  const firstName = rawFirst ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1) : "";
  const level = mine.data?.tier.level.level;
  const doneTasks = tasks.filter(t => t.done).length;
  const overall = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0;
  const sections: Record<typeof tab, [string, string, string]> = {
    projects: ["Private client space", `Welcome back${firstName ? `, ${firstName}` : ""}.`, "Everything about your author platform, in one place."],
    refer: ["Loyalty program", "Refer & rewards", "Share your link and unlock savings as authors you refer start with us."],
    settings: ["Your profile", "Account settings", "Update your details, photo and password."],
  };
  const [eyebrow, heading, intro] = sections[tab];
  return <DashboardShell eyebrow="Client portal" title="My studio" active={tab} onSelect={setTab} onSignOut={signOut}
    items={[{ key: "projects", label: "My projects", icon: FolderKanban, badge: orders?.length || undefined }, { key: "refer", label: "Refer & rewards", icon: Gift }, { key: "settings", label: "Account settings", icon: Settings }]}
    identity={<div className="flex items-center gap-3"><Avatar url={avatar} name={name || email} className="h-11 w-11 text-base" />
      <div className="min-w-0"><p className="truncate font-medium">{firstName || "Author"}</p><p className="truncate text-xs text-pitch-muted">{email}</p></div></div>}
    footer={<>{level !== undefined && <button type="button" onClick={() => setTab("refer")} className="text-left" aria-label="Open your loyalty rank"><RankChip level={level} /></button>}
      {isAdmin && <Link to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-pitch-muted hover:bg-pitch-foreground/5 hover:text-pitch-foreground"><Shield aria-hidden className="h-4 w-4" />Open admin</Link>}</>}>
    {tab === "projects" ? <div className="relative mb-8 overflow-hidden rounded-2xl bg-pitch p-8 text-pitch-foreground sm:p-10">
      <img src={banner.url} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-top opacity-20" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-pitch via-pitch/80 to-transparent" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pitch-accent">{eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{heading}</h1>
        <p className="mt-3 max-w-[55ch] text-pitch-muted">{intro}</p>
      </div>
    </div> : <SectionHeader eyebrow={eyebrow} title={heading} text={intro} />}

    {tab === "settings" ? <AccountSettings email={email} /> : tab === "refer" ? <ReferralPanel stats={stats} mine={mine} /> :
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <div>
        {orders && orders.length > 0 && <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Active projects" value={orders.length} icon={FolderKanban} />
          <StatCard label="Overall progress" value={`${overall}%`} hint={tasks.length ? `${doneTasks} of ${tasks.length} tasks done` : "Tasks appear once scheduled"} icon={TrendingUp} />
          <StatCard label="Loyalty level" value={level ?? "–"} hint={mine.data?.tier.level.title} icon={Gift} />
        </div>}
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

      <aside className="h-fit rounded-2xl border bg-secondary p-6 xl:sticky xl:top-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your studio contact</p>
        <div className="mt-4 flex items-center gap-4"><img src={mouPhoto.url} alt="Mou Barrac" loading="lazy" className="h-16 w-16 rounded-full object-cover object-top" />
        <p className="text-2xl">Mou Barrac</p></div>
        <p className="mt-1 text-sm text-muted-foreground">Questions, feedback, or files? Reach me directly.</p>
        <div className="mt-6 grid gap-3 text-sm">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 break-all underline underline-offset-4"><Mail aria-hidden className="h-4 w-4 shrink-0 text-primary" />{SUPPORT_EMAIL}</a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline underline-offset-4"><CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-primary" />Book a check-in call</a>
        </div>
      </aside>
    </div>}
  </DashboardShell>;
}
