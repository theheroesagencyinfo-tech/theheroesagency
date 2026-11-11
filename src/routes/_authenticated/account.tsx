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
  return <ol className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 sm:before:absolute sm:before:left-6 sm:before:right-6 sm:before:top-6 sm:before:h-px sm:before:bg-border">{STAGES.map((s, i) => {
    const done = i < current, now = i === current;
    return <li key={s} className={`relative rounded-md border bg-card p-3 text-sm sm:bg-transparent ${now ? "border-primary/50" : "border-transparent"}`}>
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
    projects: ["Private client space", `Welcome back${firstName ? `, ${firstName}` : ""}.`, "Your creative journey, thoughtfully managed."],
    refer: ["Loyalty program", "Refer & rewards", "Share your link and unlock savings as authors you refer start with us."],
    settings: ["Your profile", "Account settings", "Update your details, photo and password."],
  };
  const [, heading, intro] = sections[tab];
  const TABS = [
    { key: "projects" as const, label: "Projects", icon: FolderKanban, badge: orders?.length || undefined },
    { key: "refer" as const, label: "Rewards", icon: Gift, badge: undefined },
    { key: "settings" as const, label: "Settings", icon: Settings, badge: undefined },
  ];
  const featured = orders ? [...orders].sort((a,b) => Number(a.status === "launched") - Number(b.status === "launched")) : [];
  const sideItem = (key: typeof tab, label: string, I: typeof Gift, badge?: number) => {
    const on = tab === key;
    return <Button key={key} variant="ghost" type="button" aria-current={on ? "page" : undefined} onClick={() => setTab(key)}
      className={`h-auto w-full justify-start gap-3 rounded-full px-4 py-3 text-sm font-medium hover:bg-pitch-foreground/10 hover:text-pitch-foreground ${on ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-pitch-muted"}`}>
      <I aria-hidden className="h-4 w-4" /><span className="flex-1 text-left">{label}</span>
      {badge ? <span className="rounded-full bg-medal-brass px-1.5 text-[11px] text-pitch">{badge}</span> : null}
    </Button>;
  };
  return <div className="portal mx-auto max-w-[1500px] px-3 pb-16 pt-6 sm:px-5">
   <div className="grid overflow-hidden rounded-lg border bg-background lg:grid-cols-[240px_1fr]">
    <aside className="hidden flex-col bg-pitch p-6 text-pitch-foreground lg:flex">
      <p className="font-serif text-3xl leading-none">TheHeroes<br />Agency</p>
      <nav aria-label="Account sections (sidebar)" className="mt-12 grid gap-1">
        {sideItem("projects", "Projects", FolderKanban, orders?.length || undefined)}
        {sideItem("refer", "Refer & rewards", Gift)}
        {sideItem("settings", "Settings", Settings)}
      </nav>
      <div className="mt-8 grid gap-1 border-t border-pitch-foreground/15 pt-6 text-sm">
        {isAdmin && <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-pitch-muted hover:text-pitch-foreground"><Shield aria-hidden className="h-4 w-4" />Open admin</Link>}
        <Button variant="ghost" type="button" onClick={signOut} className="h-auto justify-start gap-3 px-4 py-2 text-pitch-muted hover:bg-transparent hover:text-pitch-foreground"><LogOut aria-hidden className="h-4 w-4" />Sign out</Button>
      </div>
      <div className="mt-auto pt-16"><span aria-hidden className="block h-px w-24 bg-medal-brass" /><p className="mt-5 font-serif text-xl italic text-medal-brass">Great books.<br />Greater impact.</p></div>
    </aside>
    <div className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">
    <header>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 items-center gap-5 sm:gap-7">
          <Avatar url={avatar} name={name || email} className="h-20 w-20 text-2xl ring-1 ring-border sm:h-28 sm:w-28" />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">Private client dossier</p>
            <h1 className="mt-1 text-4xl sm:text-5xl">{heading}</h1>
            <p className="mt-2 font-serif text-lg text-muted-foreground sm:text-xl">{intro}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {level !== undefined && <Button variant="ghost" size="studio" className="h-auto p-0" type="button" onClick={() => setTab("refer")} aria-label="Open your loyalty rank"><RankChip level={level} /></Button>}
          {isAdmin && <Button asChild variant="studio" size="sm"><Link to="/admin"><Shield aria-hidden className="mr-2 h-4 w-4" />Open admin</Link></Button>}
          <Button type="button" variant="studioOutline" size="sm" onClick={signOut}><LogOut aria-hidden className="mr-2 h-4 w-4" />Sign out</Button>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-4">
      <nav aria-label="Account sections" className="inline-flex w-full gap-1 rounded-full border bg-secondary p-1 sm:w-auto">
        {TABS.map(({ key, label, icon: I, badge }) => {
          const on = tab === key;
          return <Button variant="ghost" key={key} type="button" aria-current={on ? "page" : undefined} onClick={() => setTab(key)}
            className={`flex h-auto flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium sm:flex-none sm:px-5 ${on ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <I aria-hidden className="h-4 w-4" />{label}
            {badge ? <span className={`rounded-full px-1.5 text-[11px] ${on ? "bg-medal-brass text-pitch" : "bg-primary text-primary-foreground"}`}>{badge}</span> : null}
          </Button>; })}
      </nav><span aria-hidden className="hidden h-px flex-1 bg-border sm:block" />
      </div>
    </header>
    <div className="pt-8">
    {tab === "settings" ? <AccountSettings email={email} /> : tab === "refer" ? <ReferralPanel stats={stats} mine={mine} /> :
    <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
      <div className="min-w-0">
        {orders && orders.length > 0 && <div className="mb-6 grid grid-cols-3 divide-x [&>*]:rounded-none [&>*]:border-0 [&>*]:bg-transparent [&>*]:p-3 sm:[&>*]:p-5">
          <StatCard label="Projects" value={orders.length} hint="With the studio" icon={FolderKanban} />
          <StatCard label="Overall progress" value={`${overall}%`} hint={tasks.length ? `${doneTasks} of ${tasks.length} tasks done` : "Tasks appear once scheduled"} icon={TrendingUp} />
          <StatCard label="Loyalty level" value={level !== undefined ? `Level ${level}` : "–"} hint={mine.data?.tier.level.title} icon={Gift} />
        </div>}
        {orders === null ? <p className="text-muted-foreground">Loading your projects…</p>
        : orders.length === 0 ? <div className="rounded-lg border bg-card p-8 sm:p-10">
            <h2 className="text-3xl">Your author platform starts here.</h2>
            <p className="mt-3 max-w-[60ch] text-muted-foreground">Every great author platform begins with a clear direction. Let's build yours.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Link to="/pricing" hash="packages" className="rounded-lg border p-5 transition-colors hover:border-primary"><span className="font-medium">Explore packages</span><span className="mt-1 block text-sm text-muted-foreground">Compare the three ways I help.</span></Link>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border p-5 transition-colors hover:border-primary"><span className="font-medium">Book a 15-minute call</span><span className="mt-1 block text-sm text-muted-foreground">Talk through your book and goals.</span></a>
              <Link to="/contact" className="rounded-lg border p-5 transition-colors hover:border-primary"><span className="font-medium">Request a free review</span><span className="mt-1 block text-sm text-muted-foreground">Feedback on your current site.</span></Link>
            </div>
          </div>
        : <ul className="grid gap-6">{featured.map((o) => {
          const mine = tasks.filter(t => t.order_id === o.id);
          const pct = progressOf(mine);
          const next = mine.find(t => !t.done);
          return <li key={o.id} className="grid gap-6 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-[160px_1fr] sm:p-5 2xl:grid-cols-[200px_1fr]">
            <div aria-hidden className="flex aspect-[2/3] w-full max-w-[200px] self-start flex-col items-center justify-center rounded-sm bg-pitch p-4 text-center text-pitch-foreground">
              <span className="font-serif text-2xl uppercase leading-tight tracking-wide">{o.book}</span>
              <span className="mt-3 h-px w-10 bg-medal-brass" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-primary px-3 py-0.5 font-medium text-primary-foreground">{statusLabel(o.status)}</span>
                <span className="text-muted-foreground">Requested {new Date(o.created_at).toLocaleDateString()}</span>
              </div>
              <h2 className="mt-3 break-words font-serif text-3xl sm:text-4xl">{o.book}</h2>
              <p className="mt-1 inline-block border-b border-brass font-serif text-lg">{packages.find(p => p.slug === o.package)?.name}</p>
              {(o.addons.length > 0 || o.rush) && <p className="mt-2 text-sm text-muted-foreground">Add-ons: {[...o.addons.map(id => addons.find(a => a.id === id)?.name ?? id), ...(o.rush ? ["Rush delivery"] : [])].join(", ")}</p>}
              <div className="mt-5 flex items-baseline justify-between gap-3"><span className="font-serif text-lg">{pct}% complete</span><span className="text-sm text-muted-foreground">{mine.length ? `${mine.filter(t => t.done).length} of ${mine.length} tasks` : "Tasks not yet scheduled"}</span></div>
              <div className="mt-2"><ProgressBar value={pct} /></div>
              {next && <p className="mt-4 rounded-md bg-secondary px-4 py-2.5 text-sm">Next: {next.title}</p>}
              <div className="mt-6"><Roadmap pct={pct} /></div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t pt-5 sm:col-span-2">
              <Button asChild variant="studio" size="studio"><Link to="/my-projects/$id" params={{ id: o.id }}><LayoutDashboard aria-hidden className="mr-2 h-4 w-4" />Open project</Link></Button>
              {invoiceReady(o) ? <Button asChild variant="studioOutline" size="studio"><Link to="/invoice/$id" params={{ id: o.id }}><FileText aria-hidden className="mr-2 h-4 w-4" />View invoice</Link></Button>
                : <p className="max-w-[24ch] text-sm text-muted-foreground">Your invoice will be ready once your package is confirmed.</p>}
            </div>
          </li>; })}</ul>}
      </div>

      <aside className="grid h-fit gap-6 xl:sticky xl:top-24">
       <div className="rounded-lg border border-t-4 border-t-brass bg-card p-6 shadow-sm">
        <h2 className="font-serif text-2xl">Your studio contact</h2>
        <div className="mt-5 flex items-center gap-4"><img src={mouPhoto.url} alt="Mou Barrac" loading="lazy" className="h-20 w-20 rounded-full object-cover object-top" />
        <div><p className="font-serif text-2xl">Mou Barrac</p><p className="text-sm text-muted-foreground">Founder · TheHeroes Agency</p></div></div>
        <p className="mt-5 border-t pt-5 text-sm text-muted-foreground">Questions, feedback, or files? Your studio contact is always within reach.</p>
        <div className="mt-5 grid gap-3 text-sm">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 break-all rounded-md border px-4 py-3 hover:border-primary"><Mail aria-hidden className="h-4 w-4 shrink-0 text-primary" />{SUPPORT_EMAIL}</a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md border px-4 py-3 hover:border-primary"><CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-primary" />Book a 15-minute call</a>
        </div>
       </div>
       <div className="rounded-lg bg-pitch p-7 text-pitch-foreground">
        <p className="font-serif text-3xl leading-tight">Your next book deserves a platform too.</p>
        <p className="mt-3 text-sm text-pitch-muted">Every great author platform begins with a clear direction.</p>
        <Link to="/pricing" hash="packages" className="mt-6 inline-flex items-center rounded-sm bg-medal-brass px-4 py-2 text-sm font-medium text-pitch">Explore packages →</Link>
       </div>
      </aside>
    </div>}
    </div>
    </div>
   </div>
  </div>;
}
