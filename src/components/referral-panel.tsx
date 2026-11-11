import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Mail, Linkedin, MessageCircle, Facebook, Search, ArrowUpDown, Film, Users, Clock, Gift, Hourglass, ArrowRight, CircleCheck, Lock, Link as LinkIcon } from "lucide-react";
import desk from "@/assets/banner-writers-desk.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoyaltyBadge } from "@/components/loyalty-badge";
import { TeaserDesk } from "@/components/teaser-desk";
import { LEVELS, nextLevel, referralLink, statusText, tierFrom, type TierState } from "@/lib/loyalty";
import type { Database } from "@/integrations/supabase/types";

type Referral = Database["public"]["Tables"]["referrals"]["Row"];
type Stats = { code: string | null; visits: number; signups: number; projects: number };

export function useReferralStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { supabase.rpc("my_referral_stats").then(({ data }) => setStats((data as Stats | null) ?? { code: null, visits: 0, signups: 0, projects: 0 })); }, []);
  return stats;
}

export function useMyTier() {
  const [data, setData] = useState<{ tier: TierState; referrals: Referral[] } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { (async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const [r, o] = await Promise.all([
      supabase.from("referrals").select("*").eq("referrer_id", u.user.id).order("created_at", { ascending: false }),
      supabase.from("tier_overrides").select("tier_level").eq("user_id", u.user.id).maybeSingle(),
    ]);
    if (r.error) return setError(r.error.message);
    const rows = r.data ?? [];
    setData({ referrals: rows, tier: tierFrom(rows.filter(x => x.status === "converted" && x.converted_at).flatMap(x => x.converted_at ? [x.converted_at] : []), new Date(), o.data?.tier_level) });
  })(); }, []);
  return { data, error };
}

export function RankChip({ level }: { level: number }) {
  const l = LEVELS[level - 1] ?? LEVELS[0];
  if (!l) return null;
  return <span className="inline-flex items-center gap-3 rounded-full border border-pitch-foreground/20 bg-pitch-foreground/5 py-1 pl-1 pr-4">
    <LoyaltyBadge level={l} size="sm" />
    <span className="text-sm"><span className="block text-xs uppercase tracking-[0.18em] text-brass">Level {l.level}</span>{l.title}</span>
  </span>;
}

const STATUS_STYLE: Record<string, [string, string]> = {
  pending: ["bg-medal-brass/25 text-foreground", "bg-medal-brass"], contacted: ["bg-secondary text-foreground", "bg-muted-foreground/50"],
  booked: ["bg-medal-sapphire/15 text-foreground", "bg-medal-sapphire"], converted: ["bg-primary/15 text-foreground", "bg-primary"],
  rejected: ["bg-destructive/10 text-destructive", "bg-destructive"],
  requested: ["bg-medal-brass/25 text-foreground", "bg-medal-brass"], in_production: ["bg-medal-sapphire/15 text-foreground", "bg-medal-sapphire"], delivered: ["bg-primary/15 text-foreground", "bg-primary"],
};
export const StatusPill = ({ s }: { s: string }) => { const [pill, dot] = STATUS_STYLE[s] ?? ["bg-secondary", "bg-muted-foreground"];
  return <span className="inline-flex items-center gap-2 whitespace-nowrap"><span aria-hidden className={`h-2.5 w-2.5 rounded-full ${dot}`} /><span className={`rounded-full px-2.5 py-0.5 text-sm ${pill}`}>{statusText(s)}</span></span>; };
export const DepositDot = ({ paid }: { paid: boolean }) => <span className="inline-flex items-center gap-2 whitespace-nowrap"><span aria-hidden className={`h-2.5 w-2.5 rounded-full ${paid ? "bg-primary" : "bg-medal-brass"}`} />{paid ? "Paid" : "Pending"}</span>;
export const money = (v: number | null) => v == null ? "—" : `$${Number(v).toLocaleString("en-US")}`;

const card = "min-w-0 rounded-sm border bg-card shadow-sm";

export function ReferralPanel({ stats, mine }: { stats: Stats | null; mine: ReturnType<typeof useMyTier> }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const [q, setQ] = useState("");
  const [asc, setAsc] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);
  const rows = useMemo(() => (mine.data?.referrals ?? [])
    .filter(r => `${r.referred_name} ${r.referred_email} ${r.status}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (asc ? 1 : -1) * a.created_at.localeCompare(b.created_at)), [mine.data, q, asc]);
  if (mine.error) return <p role="alert" className="text-destructive">We couldn't load your referrals: {mine.error}</p>;
  if (!stats || !mine.data) return <p className="text-muted-foreground">Loading your referral circle…</p>;
  const { tier } = mine.data;
  const current = tier.level, next = nextLevel(tier.converted);
  const n = tier.converted;
  const pending = mine.data.referrals.filter(r => !["converted", "rejected"].includes(r.status)).length;
  const link = stats.code && origin ? referralLink(origin, stats.code) : "";
  const prevMin = next ? (LEVELS[next.level - 2]?.min ?? 0) : 0;
  const pct = next ? Math.min(100, Math.round(((n - prevMin) / (next.min - prevMin)) * 100)) : 100;
  const daysLeft = tier.expiresAt ? Math.max(0, Math.ceil((tier.expiresAt.getTime() - Date.now()) / 86400000)) : null;
  const msg = `I've been working with TheHeroes Agency on my author platform. If you're a nonfiction author, they're worth a look: ${link}`;
  const enc = encodeURIComponent;
  async function copy() { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  const shares = [
    [MessageCircle, "WhatsApp", `https://wa.me/?text=${enc(msg)}`], [Linkedin, "LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`],
    [null, "Share on X", `https://x.com/intent/tweet?text=${enc(msg)}`], [Facebook, "Facebook", `https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`],
    [Mail, "Email", `mailto:?subject=${enc("An author studio I recommend")}&body=${enc(msg)}`],
  ] as const;
  const rewards = [
    [current.discount ? `$${current.discount} off eligible projects` : "$100 off eligible projects (Level 2+)", current.discount > 0],
    ["Book teaser (Level 4+)", current.teaser],
    ["Priority queue (Level 5+)", current.priority !== "none"],
    ["Annual strategy session (Level 7)", current.strategy],
  ] as const;
  const stat = [
    [Users, String(n), "Converted Referrals"], [Clock, String(pending), "Pending Referrals"],
    [Gift, `$${current.discount}`, "Available Rewards"], [Hourglass, daysLeft === null ? "—" : `${daysLeft} days`, "Reward Expiry"],
  ] as const;

  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
    <div className="relative grid min-w-0 gap-6 overflow-hidden rounded-sm bg-[var(--portal-forest)] p-6 text-pitch-foreground sm:grid-cols-[auto_1fr] sm:items-center sm:p-8 lg:grid-cols-[auto_1fr_220px]">
      <LoyaltyBadge level={current} size="lg" />
      <div className="min-w-0">
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-medal-gold">Your loyalty membership{tier.overridden ? " · set by the studio" : ""}</p>
        <h2 className="mt-2 font-serif text-3xl sm:text-[2.2rem]">Level {current.level} · {current.title}</h2>
        <p className="mt-2">{current.discount ? `$${current.discount} off eligible projects` : "Your referral link and live tracker"}</p>
      </div>
      <div className="min-w-0 border-pitch-foreground/25 sm:col-span-2 lg:col-span-1 lg:border-l lg:pl-8">
        <p>{next ? `Progress to Level ${next.level}` : "Highest tier reached"}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-pitch-foreground/20" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next tier">
          <div className="h-full rounded-full bg-pitch-accent" style={{ width: `${pct}%` }} /></div>
        <p className="mt-3 text-sm">{pct}% complete</p>
      </div>
    </div>

    <section aria-labelledby="ref-link" className={`${card} p-6`}>
      <h2 id="ref-link" className="font-serif text-[1.7rem]">Your Referral Link</h2>
      <p className="text-sm text-muted-foreground">Share with friends and fellow authors.</p>
      <div className="mt-4 flex gap-2">
        <p className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border bg-background px-3 py-2.5 text-sm"><LinkIcon aria-hidden className="h-4 w-4 shrink-0" /><span className="truncate underline underline-offset-2">{link || "Preparing your link…"}</span></p>
        <Button type="button" variant="studio" size="icon" className="h-11 w-11 shrink-0 rounded-sm" disabled={!link} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
      </div>
      <p role="status" className="mt-1 h-4 text-xs text-primary">{copied ? "Link copied" : ""}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-sm">{shares.map(([I, l, href]) =>
        <a key={l} className="inline-flex items-center gap-2 rounded-sm border bg-background px-3 py-2 hover:border-primary" href={href} target={l === "Email" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={l.startsWith("Share") ? l : `Share on ${l}`}>
          {I ? <I aria-hidden className="h-4 w-4 text-primary" /> : <span aria-hidden className="font-bold">𝕏</span>}{l}</a>)}</div>
    </section>

    <div className={`${card} grid grid-cols-2 sm:grid-cols-4`}>{stat.map(([I, v, l], i) =>
      <div key={l} className={`flex flex-col items-center px-3 py-5 text-center ${i % 2 ? "border-l" : ""} ${i === 2 ? "border-t sm:border-l sm:border-t-0" : ""} ${i === 3 ? "border-t sm:border-t-0" : ""}`}>
        <I aria-hidden className="h-7 w-7" /><p className="mt-2 font-serif text-3xl sm:text-4xl">{v}</p><p className="text-sm">{l}</p></div>)}</div>

    <div className="relative min-w-0 overflow-hidden rounded-sm bg-pitch p-6 text-pitch-foreground xl:row-span-2">
      <img src={desk.url} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="relative">
        <h2 className="font-serif text-3xl">The Loyalty Ladder</h2>
        <p className="mt-2 max-w-[26ch]">Unlock greater rewards as you refer more authors.</p>
        <a href="#tiers" className="mt-6 inline-flex items-center gap-2 rounded-sm border border-medal-gold px-4 py-2.5 text-medal-gold">View All Tiers<ArrowRight aria-hidden className="h-4 w-4" /></a>
      </div>
    </div>

    <section aria-labelledby="ref-prog" className={`${card} p-6`}>
      <h2 id="ref-prog" className="font-serif text-[1.7rem]">Your Referral Progress</h2>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-2"><p className="text-sm text-muted-foreground">Refer more authors and earn bigger rewards.</p>
        <p className="text-sm">{next ? `${n} of ${next.min} referrals converted` : `${n} referrals converted`}</p></div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
      {tier.expiresAt && <p className="mt-2 text-xs text-muted-foreground">Tier active until {tier.expiresAt.toLocaleDateString()}.</p>}
    </section>

    <section aria-labelledby="ref-recent" className={`${card} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h2 id="ref-recent" className="font-serif text-[1.7rem]">Recent Referrals</h2><p className="text-sm text-muted-foreground">Track your referral activity and status.</p></div>
        <label className="relative"><span className="sr-only">Search referrals</span><Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search referrals…" className="h-10 w-56 rounded-sm border bg-background pl-9 pr-3 text-sm" /></label>
      </div>
      {mine.data.referrals.length === 0 ? <div className="mt-5 rounded-sm border border-dashed p-6"><p className="font-medium">No referrals yet.</p><p className="mt-1 text-sm text-muted-foreground">Share your link above. Authors who sign up with it appear here, and you can watch their status move to converted.</p></div>
      : <div className="portal-table mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-[15px]">
        <thead className="bg-secondary text-sm font-medium"><tr>
          <th className="px-4 py-3 font-medium">Referred Author</th>
          <th className="px-4 py-3 font-medium"><button type="button" onClick={() => setAsc(!asc)} className="inline-flex items-center gap-1">Date <ArrowUpDown aria-hidden className="h-3 w-3" /></button></th>
          <th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Deposit Status</th><th className="px-4 py-3 font-medium">Project Value</th></tr></thead>
        <tbody className="divide-y [&_td]:border-l [&_td:first-child]:border-l-0">{rows.map(r => <tr key={r.id}>
          <td className="px-4 py-3">{r.referred_name || r.referred_email}</td>
          <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
          <td className="px-4 py-3"><StatusPill s={r.status} /></td><td className="px-4 py-3"><DepositDot paid={r.deposit_paid} /></td>
          <td className="px-4 py-3">{money(r.project_value)}</td></tr>)}</tbody>
      </table></div>}
    </section>

    <section aria-labelledby="ref-avail" className={`${card} p-6`}>
      <h2 id="ref-avail" className="flex items-center gap-3 font-serif text-[1.7rem]"><Gift aria-hidden className="h-6 w-6" />Available Rewards</h2>
      <p className="mt-1 text-sm">Share the journey and enjoy exclusive benefits.</p>
      <ul className="mt-5 grid gap-3">{rewards.map(([t, on]) => <li key={t} className={`flex items-center gap-3 ${on ? "" : "text-muted-foreground"}`}>
        {on ? <CircleCheck aria-hidden className="h-5 w-5 shrink-0 text-primary" /> : <Lock aria-hidden className="h-5 w-5 shrink-0" />}{t}<span className="sr-only">{on ? "unlocked" : "locked"}</span></li>)}</ul>
      <Button asChild variant="studio" className="mt-6 rounded-sm"><Link to="/referrals">Learn more about rewards<ArrowRight aria-hidden className="ml-2 h-4 w-4" /></Link></Button>
    </section>

    <div className="min-w-0">{current.teaser ? <TeaserDesk /> : <div className={`${card} p-6`}><Film aria-hidden className="h-5 w-5 text-muted-foreground" /><p className="mt-3 font-serif text-2xl">Book Teaser Desk</p><p className="mt-1 text-sm text-muted-foreground">Free 30-second book teasers unlock at Level 4 (Studio Ambassador), one for every newly released book.</p></div>}
      <p className="mt-4 text-xs text-muted-foreground">Discounts apply while your tier is active and exclude taxes, payment fees, hosting, domains, third-party licenses, plugins, rush fees and other third-party costs. One referral discount per project; not combined with major promotions.</p></div>

    <section id="tiers" aria-labelledby="ref-tiers" className={`${card} scroll-mt-28 p-6`}>
      <h2 id="ref-tiers" className="font-serif text-[1.7rem]">Loyalty Tiers</h2>
      <p className="text-sm text-muted-foreground">Reach higher levels for greater rewards.</p>
      <ol className="relative mt-4 grid gap-1 before:absolute before:bottom-6 before:left-[26px] before:top-6 before:w-px before:bg-border">{LEVELS.map(l => {
        const earned = current.level >= l.level, now = current.level === l.level;
        return <li key={l.level} className={`relative flex items-start gap-3 rounded-sm px-3 py-2.5 ${now ? "bg-primary/10" : ""}`}>
          <span className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${earned ? "bg-primary text-primary-foreground" : "border bg-card"}`}>{earned ? <Check aria-hidden className="h-4 w-4" /> : <Lock aria-hidden className="h-3.5 w-3.5" />}</span>
          <span className="min-w-0"><span className="block font-medium">Level {l.level} · {l.title}</span>
            <span className="block text-sm text-muted-foreground">{l.min === 0 ? "Starting tier" : `${l.min} converted ${l.min === 1 ? "referral" : "referrals"}`}{l.discount ? ` · $${l.discount} off` : ""}{l.teaser ? " + free teaser" : ""}{l.priority === "vip" ? " & VIP" : l.priority === "priority" ? " & priority" : ""}</span></span>
        </li>; })}</ol>
    </section>
  </div>;
}
