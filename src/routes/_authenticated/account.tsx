import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Mail, CalendarDays, FileText, FolderKanban, Settings, Gift, Shield, LogOut, Trophy, User, ChevronRight, ArrowRight, Download } from "lucide-react";
import { ReferralPanel, RankChip, useReferralStats, useMyTier } from "@/components/referral-panel";
import { Avatar, useMyAvatar } from "@/components/avatar-upload";
import mouPhoto from "@/assets/mou/burgundy.png.asset.json";
import booksImg from "@/assets/banner-writers-desk.png.asset.json";
import { AccountSettings } from "@/components/account-settings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

const STAGES = ["Strategy", "Structure & Copy", "Design", "Build & Launch"];
const stageOf = (pct: number) => Math.min(STAGES.length - 1, Math.floor(pct / (100 / STAGES.length)));
const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Roadmap({ pct }: { pct: number }) {
  const current = pct >= 100 ? STAGES.length : stageOf(pct);
  return <ol className="relative grid grid-cols-4 before:absolute before:left-[12.5%] before:right-[12.5%] before:top-[11px] before:h-px before:bg-border">{STAGES.map((s, i) => {
    const done = i < current, now = i === current;
    return <li key={s} className="relative flex flex-col items-center text-center text-sm">
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : now ? "border-2 border-primary bg-card ring-2 ring-primary/30 ring-offset-2 ring-offset-card" : "border-2 border-muted-foreground/40 bg-card"}`}>
        {done ? <Check aria-hidden className="h-3.5 w-3.5" /> : now ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}</span>
      <span className={`mt-2 block max-w-[10ch] leading-tight ${now ? "font-semibold" : ""}`}>{s}</span>
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
    { key: "refer" as const, label: "Refer & Rewards", icon: Trophy, badge: undefined },
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
  const ago = (d: string) => {
    const days = Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000));
    if (days === 0) return "Today"; if (days === 1) return "1 day ago"; if (days < 7) return `${days} days ago`;
    const w = Math.floor(days / 7); if (days < 30) return w === 1 ? "1 week ago" : `${w} weeks ago`;
    const m = Math.floor(days / 30); return m <= 1 ? "1 month ago" : `${m} months ago`;
  };
  const top = featured[0];
  const activity = top ? [
    ...tasks.filter(t => t.order_id === top.id).map(t => ({ at: t.created_at, title: t.done ? `Completed: ${t.title}` : `Scheduled: ${t.title}`, body: t.done ? "This step is complete." : "Added to your project plan.", done: t.done })),
    { at: top.created_at, title: "Project created", body: "Your project has been successfully set up.", done: false },
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 3) : [];
  const lastUpdate = activity[0]?.at;
  const navy = "bg-[var(--portal-navy)]";
  return <div className="portal mx-auto max-w-[1500px] px-3 pb-16 pt-6 sm:px-5">
   <div className="grid min-h-[1000px] overflow-hidden rounded-lg border bg-background lg:grid-cols-[230px_1fr]">
    <aside className={`hidden flex-col ${navy} px-4 py-8 text-pitch-foreground lg:flex`}>
      <p className="px-3 font-serif text-[2rem] leading-[0.95]">TheHeroes<br />Agency</p>
      <nav aria-label="Account sections (sidebar)" className="mt-20 grid gap-1">
        {sideItem("projects", "Projects", FolderKanban, orders?.length || undefined)}
        {sideItem("refer", "Refer & Rewards", Trophy)}
        {sideItem("settings", "Settings", Settings)}
      </nav>
      <div className="mx-4 mt-8 grid gap-1 border-t border-pitch-foreground/15 pt-6 text-sm">
        <Button variant="ghost" type="button" onClick={() => setTab("settings")} className="h-auto justify-start gap-3 px-0 py-2 text-pitch-muted hover:bg-transparent hover:text-pitch-foreground"><User aria-hidden className="h-4 w-4" />My Account</Button>
        <Button variant="ghost" type="button" onClick={signOut} className="h-auto justify-start gap-3 px-0 py-2 text-pitch-muted hover:bg-transparent hover:text-pitch-foreground"><LogOut aria-hidden className="h-4 w-4" />Sign Out</Button>
      </div>
      <div className="mt-auto px-3 pt-16"><span aria-hidden className="block h-px w-28 bg-medal-brass" /><p className="mt-8 font-serif text-xl italic leading-snug text-pitch-muted">Great books.<br />Greater impact.</p></div>
    </aside>
    <div className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">
    <header>
      <div className="flex flex-wrap items-start justify-between gap-6 xl:flex-nowrap">
        <div className="flex min-w-0 items-center gap-5 sm:gap-10">
          <Avatar url={avatar} name={name || email} className="h-20 w-20 text-2xl ring-1 ring-border sm:h-[120px] sm:w-[120px]" />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Private client dossier</p>
            <h1 className="mt-1 text-4xl sm:text-[3rem] sm:leading-tight 2xl:whitespace-nowrap">{heading}</h1>
            <p className="mt-1 font-serif text-lg sm:text-xl">{intro}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 xl:shrink-0 xl:flex-nowrap">
          {level !== undefined && <Button variant="ghost" type="button" onClick={() => setTab("refer")} aria-label="Open your loyalty rank"
            className="h-auto gap-3 rounded-full bg-medal-brass/35 py-2 pl-2 pr-4 text-sm font-medium hover:bg-medal-brass/50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pitch text-medal-brass"><Trophy aria-hidden className="h-4 w-4" /></span>
            Level {level} · {mine.data?.tier.level.title}<ChevronRight aria-hidden className="h-4 w-4" /></Button>}
          <span aria-hidden className="hidden h-12 w-px bg-border sm:block" />
          {isAdmin && <Button asChild size="sm" className={`${navy} h-11 rounded-md px-4 text-pitch-foreground hover:opacity-90`}><Link to="/admin"><Shield aria-hidden className="mr-2 h-4 w-4" />Open admin</Link></Button>}
          <Button type="button" variant="outline" size="sm" className="h-11 rounded-md border-foreground/60 bg-transparent px-5" onClick={signOut}>Sign out</Button>
        </div>
      </div>
      <div className="mt-8 flex items-center">
      <nav aria-label="Account sections" className="inline-flex w-full gap-1 rounded-full border border-foreground/20 p-0 sm:w-auto">
        {TABS.map(({ key, label, icon: I, badge }) => {
          const on = tab === key;
          return <Button variant="ghost" key={key} type="button" aria-current={on ? "page" : undefined} onClick={() => setTab(key)}
            className={`flex h-auto flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-[15px] sm:flex-none sm:px-7 ${on ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-foreground hover:bg-transparent"}`}>
            <I aria-hidden className="h-5 w-5" />{label}
            {badge ? <span className="rounded-full bg-medal-brass/80 px-1.5 text-[11px] text-pitch">{badge}</span> : null}
          </Button>; })}
      </nav><span aria-hidden className="hidden h-px flex-1 bg-border sm:block" />
      </div>
    </header>
    <div className="pt-8">
    {tab === "settings" ? <AccountSettings email={email} /> : tab === "refer" ? <ReferralPanel stats={stats} mine={mine} /> :
    <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
      <div className="min-w-0">
        {orders && orders.length > 0 && <div className="mb-6 grid grid-cols-3">
          {[[String(orders.filter(o => o.status !== "launched").length || orders.length), orders.filter(o => o.status !== "launched").length === 1 || orders.length === 1 ? "Active Project" : "Active Projects", "Your current project"],
            [`${overall}%`, "Overall Progress", tasks.length ? `${doneTasks} of ${tasks.length} tasks done` : "Tasks appear once scheduled"],
            [level !== undefined ? `Level ${level}` : "–", mine.data?.tier.level.title ?? "Loyalty level", "Your loyalty level"]].map(([v, l, h], i) =>
            <div key={l} className={`px-2 sm:px-0 ${i ? "border-l pl-4 sm:pl-12" : ""}`}>
              <p className="font-serif text-4xl leading-none sm:text-5xl">{v}</p>
              <p className="mt-2 font-serif text-lg sm:text-[1.4rem]">{l}</p>
              <p className="text-sm text-muted-foreground">{h}</p>
            </div>)}
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
          return <li key={o.id} className="grid gap-6 rounded-md border bg-card p-2.5 shadow-sm sm:grid-cols-[200px_1fr] md:grid-cols-[200px_1fr_auto]">
            <div aria-hidden className="flex aspect-[2/3] w-full max-w-[200px] flex-col items-center justify-center bg-pitch p-4 text-center text-pitch-foreground">
              <span className="font-serif text-3xl uppercase leading-tight tracking-wide">{o.book}</span>
              <span className="mt-3 h-px w-10 bg-medal-brass" />
            </div>
            <div className="min-w-0 py-4 pr-2">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-primary px-3 py-0.5 font-medium text-primary-foreground">{statusLabel(o.status)}</span>
                <span>· Updated {ago(o.id === top?.id && lastUpdate ? lastUpdate : o.created_at).toLowerCase()}</span>
              </div>
              <h2 className="mt-2 break-words font-serif text-4xl sm:text-[2.6rem]">{o.book}</h2>
              <p className="mt-1 inline-block border-b border-brass font-serif text-xl">{packages.find(p => p.slug === o.package)?.name} Package</p>
              {(o.addons.length > 0 || o.rush) && <p className="mt-2 text-sm text-muted-foreground">Add-ons: {[...o.addons.map(id => addons.find(a => a.id === id)?.name ?? id), ...(o.rush ? ["Rush delivery"] : [])].join(", ")}</p>}
              <div className="mt-4 flex items-baseline justify-between gap-3"><span className="font-serif text-lg">{pct}% Complete</span><span className="text-sm">{mine.length ? `${mine.filter(t => t.done).length} of ${mine.length} tasks` : "Tasks not yet scheduled"}</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
              {next && <p className="mt-4 flex items-center gap-3 rounded-sm bg-secondary px-3 py-2 text-sm"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-medal-brass/40"><ArrowRight aria-hidden className="h-3 w-3" /></span>Next: {next.title}</p>}
              <div className="mt-4"><Roadmap pct={pct} /></div>
            </div>
            <div className="flex flex-row flex-wrap gap-3 px-2 pb-4 sm:col-span-2 md:col-span-1 md:flex-col md:justify-center md:px-6 md:pb-0">
              <Button asChild variant="studio" className="h-11 min-w-[150px] justify-between rounded-sm"><Link to="/my-projects/$id" params={{ id: o.id }}>Open project<ArrowRight aria-hidden className="ml-2 h-4 w-4" /></Link></Button>
              {invoiceReady(o) ? <Button asChild variant="outline" className="h-11 min-w-[150px] rounded-sm border-foreground/40 bg-transparent"><Link to="/invoice/$id" params={{ id: o.id }}><Download aria-hidden className="mr-2 h-4 w-4" />View invoice</Link></Button>
                : <p className="max-w-[20ch] text-sm text-muted-foreground">Your invoice will be ready once your package is confirmed.</p>}
            </div>
          </li>; })}</ul>}
      </div>

      <aside className="h-fit">
       <div className="mt-0 rounded-sm border border-t-4 border-t-brass bg-card p-5 shadow-sm">
        <h2 className="font-serif text-[1.7rem]">Your Studio Contact</h2>
        <div className="mt-6 flex items-center gap-5"><img src={mouPhoto.url} alt="Mou Barrac" loading="lazy" className="h-28 w-28 rounded-full object-cover object-top" />
        <div><p className="font-serif text-2xl">Mou Barrac</p><p className="text-muted-foreground">Creative Director</p></div></div>
        <p className="mt-5 border-t pt-5 text-sm">Questions, feedback, or files? Your studio contact is always within reach.</p>
        <div className="mt-4 grid gap-2 text-sm">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-4 break-all rounded-sm border px-5 py-3 hover:border-primary"><Mail aria-hidden className="h-5 w-5 shrink-0" />{SUPPORT_EMAIL}</a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-sm border px-5 py-3 hover:border-primary"><CalendarDays aria-hidden className="h-5 w-5 shrink-0" />Book a check-in call</a>
        </div>
       </div>
      </aside>
      {top && <section aria-labelledby="activity" className="min-w-0 rounded-sm border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4"><h2 id="activity" className="font-serif text-[1.7rem]">Your Activity</h2>
          <Link to="/my-projects/$id" params={{ id: top.id }} className="inline-flex items-center gap-2 border-b border-brass pb-0.5 text-sm">View all activity<ArrowRight aria-hidden className="h-4 w-4" /></Link></div>
        <ol className="mt-5">{activity.map((a, i) => <li key={i} className="relative grid grid-cols-[28px_120px_1fr] gap-2 pb-6 last:pb-0 sm:grid-cols-[36px_150px_1fr]">
          {i < activity.length - 1 && <span aria-hidden className="absolute left-[9px] top-5 h-full w-px bg-border" />}
          <span aria-hidden className={`relative mt-1 flex h-[18px] w-[18px] items-center justify-center rounded-full ${a.done ? "bg-primary text-primary-foreground" : i === 0 ? "bg-primary" : "border bg-card"}`}>{a.done && <Check className="h-3 w-3" />}</span>
          <span className="text-sm text-muted-foreground">{ago(a.at)}</span>
          <span><span className="block font-serif text-lg">{a.title}</span><span className="text-sm text-muted-foreground">{a.body}</span></span>
        </li>)}</ol>
      </section>}
      <div className={`relative overflow-hidden rounded-sm ${top ? "" : "xl:col-start-2"} bg-pitch p-8 text-pitch-foreground`}>
        <img src={booksImg.url} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="relative">
          <p className="max-w-[14ch] font-serif text-4xl leading-tight">Your author platform starts here.</p>
          <p className="mt-3 max-w-[30ch] text-pitch-foreground/85">Every great author platform begins with a clear direction.</p>
          <Link to="/pricing" hash="packages" className="mt-6 inline-flex items-center gap-2 rounded-sm bg-medal-brass/80 px-5 py-2.5 text-sm font-medium text-pitch">Explore Packages<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>}
    </div>
    </div>
   </div>
  </div>;
}
