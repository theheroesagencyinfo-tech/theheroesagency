import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Mail, Linkedin, MessageCircle, Facebook, Search, ArrowUpDown, Film, Headphones, CalendarCheck, BadgePercent } from "lucide-react";
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
    setData({ referrals: rows, tier: tierFrom(rows.filter(x => x.status === "converted" && x.converted_at).map(x => x.converted_at!), new Date(), o.data?.tier_level) });
  })(); }, []);
  return { data, error };
}

export function RankChip({ level }: { level: number }) {
  const l = LEVELS[level - 1] ?? LEVELS[0]!;
  return <span className="inline-flex items-center gap-3 rounded-full border border-pitch-foreground/20 bg-pitch-foreground/5 py-1 pl-1 pr-4">
    <LoyaltyBadge level={l} size="sm" />
    <span className="text-sm"><span className="block text-xs uppercase tracking-[0.18em] text-pitch-accent">Level {l.level}</span>{l.title}</span>
  </span>;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-secondary text-muted-foreground", contacted: "bg-secondary text-foreground", booked: "bg-accent text-accent-foreground",
  converted: "bg-primary text-primary-foreground", rejected: "bg-destructive/10 text-destructive",
};
export const StatusPill = ({ s }: { s: string }) => <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[s] ?? "bg-secondary"}`}>{statusText(s)}</span>;

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
  const link = stats.code && origin ? referralLink(origin, stats.code) : "";
  const pct = next ? Math.min(100, Math.round(((n - (LEVELS[next.level - 2]?.min ?? 0)) / (next.min - (LEVELS[next.level - 2]?.min ?? 0))) * 100)) : 100;
  const msg = `I've been working with TheHeroes Agency on my author platform. If you're a nonfiction author, they're worth a look: ${link}`;
  const enc = encodeURIComponent;
  async function copy() { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  const shares = [
    [MessageCircle, "WhatsApp", `https://wa.me/?text=${enc(msg)}`], [Mail, "Email", `mailto:?subject=${enc("An author studio I recommend")}&body=${enc(msg)}`],
    [null, "X", `https://x.com/intent/tweet?text=${enc(msg)}`], [Facebook, "Facebook", `https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`],
    [Linkedin, "LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`],
  ] as const;
  const rewards = [
    [BadgePercent, "Ongoing project discount", current.discount ? `$${current.discount} off every eligible project` : "Unlocks at Level 2", current.discount > 0],
    [Film, "Free book teaser", current.teaser ? "One 30-second teaser per new book" : "Unlocks at Level 4", current.teaser],
    [Headphones, "Priority support", current.priority === "vip" ? "VIP priority support" : current.priority === "priority" ? "Priority support" : "Unlocks at Level 5", current.priority !== "none"],
    [CalendarCheck, "Annual strategy session", current.strategy ? "Included every year" : "Unlocks at Level 7", current.strategy],
  ] as const;

  return <div className="grid gap-10">
    <div className="grid gap-8 overflow-hidden rounded-2xl bg-pitch p-8 text-pitch-foreground sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
      <LoyaltyBadge level={current} size="lg" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pitch-accent">Your tier · Level {current.level} of 7{tier.overridden ? " · set by the studio" : ""}</p>
        <h2 className="mt-2 text-4xl">{current.title}</h2>
        <p className="mt-1 text-pitch-muted">{current.badge} · {n} successful {n === 1 ? "referral" : "referrals"}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-pitch-foreground/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next tier">
          <div className="h-full rounded-full bg-pitch-accent transition-all" style={{ width: `${pct}%` }} /></div>
        <p className="mt-3 text-sm text-pitch-muted">{next ? `${next.min - n} more successful ${next.min - n === 1 ? "referral" : "referrals"} to reach ${next.title}.` : "You hold the highest tier in the studio. Thank you."}
          {tier.expiresAt && ` Active until ${tier.expiresAt.toLocaleDateString()}.`}</p>
      </div>
    </div>

    <div className="rounded-2xl border bg-card p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Your referral link</p>
      <h3 className="mt-2 text-2xl">Introduce an author you believe in.</h3>
      <p className="mt-2 text-sm text-muted-foreground">When they become a paying client through your link, you move up a tier. <Link to="/referrals" className="underline underline-offset-4">How the program works</Link></p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 truncate rounded-md border bg-secondary px-4 py-3 text-sm">{link || "Preparing your link…"}</p>
        <Button type="button" variant="studio" size="studio" disabled={!link} onClick={copy}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Link copied" : "Copy link"}</Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Your code: <code className="font-mono">{stats.code}</code></p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">{shares.map(([I, l, href]) =>
        <a key={l} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:border-primary" href={href} target={l === "Email" ? undefined : "_blank"} rel="noopener noreferrer">
          {I ? <I aria-hidden className="h-4 w-4 text-primary" /> : <span aria-hidden className="font-semibold text-primary">X</span>}Share on {l}</a>)}</div>
    </div>

    <div>
      <h3 className="text-2xl">Your rewards</h3>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{rewards.map(([I, t, d, on]) =>
        <li key={t} className={`rounded-2xl border p-6 ${on ? "border-primary bg-card" : "bg-secondary/50"}`}>
          <I aria-hidden className={`h-5 w-5 ${on ? "text-primary" : "text-muted-foreground"}`} />
          <p className="mt-3 font-medium">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></li>)}</ul>
      <p className="mt-3 text-xs text-muted-foreground">Discounts apply while your tier is active and exclude taxes, payment fees, hosting, domains, third-party licenses, plugins, rush fees and other third-party costs. One referral discount per project; not combined with major promotions.</p>
    </div>

    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="text-2xl">Referral tracker</h3>
        <label className="relative"><span className="sr-only">Search referrals</span><Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, status" className="h-10 rounded-md border bg-background pl-9 pr-3 text-sm" /></label>
      </div>
      {mine.data.referrals.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed p-8"><p className="font-medium">No referrals yet.</p><p className="mt-1 text-sm text-muted-foreground">Share your link above. Authors who sign up with it appear here, and you can watch their status move to converted.</p></div>
      : <div className="mt-4 overflow-x-auto rounded-2xl border"><table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground"><tr>
          <th className="p-4">Name</th><th className="p-4">Email</th>
          <th className="p-4"><button type="button" onClick={() => setAsc(!asc)} className="inline-flex items-center gap-1 uppercase">Submitted <ArrowUpDown aria-hidden className="h-3 w-3" /></button></th>
          <th className="p-4">Status</th><th className="p-4">Reward</th></tr></thead>
        <tbody className="divide-y">{rows.map(r => <tr key={r.id}>
          <td className="p-4">{r.referred_name || "—"}</td><td className="p-4">{r.referred_email}</td>
          <td className="p-4">{new Date(r.created_at).toLocaleDateString()}</td><td className="p-4"><StatusPill s={r.status} /></td>
          <td className="p-4">{r.status === "converted" ? <span className="font-medium text-primary">Counts toward your tier</span> : <span className="text-muted-foreground">—</span>}</td></tr>)}</tbody>
      </table></div>}
    </div>

    {current.teaser ? <TeaserDesk /> : <div className="rounded-2xl border border-dashed p-8"><Film aria-hidden className="h-5 w-5 text-muted-foreground" /><p className="mt-3 font-medium">Free book teasers unlock at Level 4.</p><p className="mt-1 text-sm text-muted-foreground">Reach Studio Ambassador to request a complimentary 30-second teaser for every newly released book.</p></div>}

    <div>
      <h3 className="text-2xl">Tier progress</h3>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{LEVELS.map(l => {
        const earned = current.level >= l.level, isNext = next?.level === l.level;
        return <li key={l.level} className={`flex flex-col items-center rounded-2xl border p-5 text-center ${isNext ? "border-primary ring-2 ring-primary/20" : ""} ${earned ? "bg-card" : "bg-secondary/50"}`}>
          <LoyaltyBadge level={l} earned={earned} />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level {l.level}</p>
          <p className="mt-1 font-medium">{l.title}</p><p className="mt-1 text-xs text-muted-foreground">{l.badge}</p>
          <p className="mt-3 text-xs">{earned ? <span className="font-medium text-primary">Earned</span> : `${l.min} successful referrals`}</p>
          <p className="mt-2 text-xs text-muted-foreground">{l.perk}</p>
        </li>; })}</ol>
    </div>
  </div>;
}
