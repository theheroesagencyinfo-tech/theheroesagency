import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Mail, CalendarDays, FileText, LayoutDashboard, FolderKanban, Settings, Gift, Shield, TrendingUp, LogOut } from "lucide-react";
import { StatCard } from "@/components/dashboard-shell";
import { ReferralPanel, RankChip, useReferralStats, useMyTier } from "@/components/referral-panel";
import { Avatar, useMyAvatar } from "@/components/avatar-upload";
import mouPhoto from "@/assets/mou/burgundy.png.asset.json";
import { AccountSettings } from "@/components/account-settings";
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
  const [, heading, intro] = sections[tab];
  const TABS = [
    { key: "projects" as const, label: "Projects", icon: FolderKanban, badge: orders?.length || undefined },
    { key: "refer" as const, label: "Rewards", icon: Gift, badge: undefined },
    { key: "settings" as const, label: "Settings", icon: Settings, badge: undefined },
  ];
  return <div className="mx-auto max-w-[1500px] px-4 pb-20 pt-8 sm:px-8 sm:pt-12">
    <header className="border-b pb-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <Avatar url={avatar} name={name || email} className="h-14 w-14 text-lg ring-1 ring-border ring-offset-4 ring-offset-background sm:h-16 sm:w-16" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Private client dossier</p>
            <p className="mt-1 truncate font-serif text-2xl sm:text-3xl">{firstName || "Author"}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {level !== undefined && <button type="button" onClick={() => setTab("refer")} aria-label="Open your loyalty rank"><RankChip level={level} /></button>}
          {isAdmin && <Button asChild variant="studioOutline" size="sm"><Link to="/admin"><Shield aria-hidden className="mr-2 h-4 w-4" />Open admin</Link></Button>}
          <Button type="button" variant="ghost" size="sm" onClick={signOut}><LogOut aria-hidden className="mr-2 h-4 w-4" />Sign out</Button>
        </div>
      </div>
      <div className="mt-10 max-w-[60ch]">
        <h1 className="text-4xl sm:text-5xl">{heading}</h1>
        <p className="mt-3 text-muted-foreground">{intro}</p>
      </div>
      <nav aria-label="Account sections" className="mt-8 inline-flex w-full gap-1 rounded-full border bg-secondary p-1 sm:w-auto">
        {TABS.map(({ key, label, icon: I, badge }) => {
          const on = tab === key;
          return <button key={key} type="button" aria-current={on ? "page" : undefined} onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex-none sm:px-5 ${on ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <I aria-hidden className={`h-4 w-4 ${on ? "text-primary" : ""}`} />{label}
            {badge ? <span className="rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">{badge}</span> : null}
          </button>; })}
      </nav>
    </header>
    <div className="pt-10">
    {tab === "settings" ? <AccountSettings email={email} /> : tab === "refer" ? <ReferralPanel stats={stats} mine={mine} /> :
    <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
      <div>
        {orders && orders.length > 0 && <div className="mb-8 grid grid-cols-3 divide-x rounded-2xl border bg-card [&>*]:rounded-none [&>*]:border-0 [&>*]:bg-transparent [&>*]:p-4 sm:[&>*]:p-6">
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
          return <li key={o.id} className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-10"><span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-primary">{statusLabel(o.status)}</span>
              <span className="text-muted-foreground">Requested {new Date(o.created_at).toLocaleDateString()}</span>
            </div>
            <h2 className="mt-5 font-serif text-3xl sm:text-4xl">{o.book}</h2>
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

      <aside className="h-fit rounded-2xl border bg-card p-7 shadow-sm xl:sticky xl:top-24">
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
    </div>
  </div>;
}
