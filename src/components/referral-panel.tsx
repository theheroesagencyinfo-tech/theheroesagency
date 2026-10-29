import { useEffect, useState } from "react";
import { Check, Copy, Mail, Linkedin, MessageCircle, Eye, UserPlus, BookCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoyaltyBadge } from "@/components/loyalty-badge";
import { LEVELS, levelFor, nextLevel, referralLink } from "@/lib/loyalty";

type Stats = { code: string | null; visits: number; signups: number; projects: number };

export function useReferralStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { supabase.rpc("my_referral_stats").then(({ data }) => setStats((data as Stats | null) ?? { code: null, visits: 0, signups: 0, projects: 0 })); }, []);
  return stats;
}

export function RankChip({ referrals }: { referrals: number }) {
  const l = levelFor(referrals);
  return <span className="inline-flex items-center gap-3 rounded-full border border-pitch-foreground/20 bg-pitch-foreground/5 py-1 pl-1 pr-4">
    <LoyaltyBadge level={l} size="sm" />
    <span className="text-sm"><span className="block text-xs uppercase tracking-[0.18em] text-pitch-accent">Level {l.level}</span>{l.title}</span>
  </span>;
}

export function ReferralPanel({ stats }: { stats: Stats | null }) {
  const [copied, setCopied] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  if (!stats) return <p className="text-muted-foreground">Loading your referral circle…</p>;
  const n = Number(stats.signups);
  const current = levelFor(n), next = nextLevel(n);
  const link = stats.code && origin ? referralLink(origin, stats.code) : "";
  const pct = next ? Math.round(((n - current.min) / (next.min - current.min)) * 100) : 100;
  const msg = `I've been working with TheHeroes Agency on my author website. If you're a nonfiction author, they're worth a look: ${link}`;
  async function copy(v: string, k: string) { await navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(""), 2000); }

  return <div className="grid gap-8">
    <div className="grid gap-8 overflow-hidden rounded-2xl bg-pitch p-8 text-pitch-foreground sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
      <LoyaltyBadge level={current} size="lg" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pitch-accent">Your loyalty rank · Level {current.level} of 7</p>
        <h2 className="mt-2 text-4xl">{current.title}</h2>
        <p className="mt-1 text-pitch-muted">{current.badge} · {current.perk}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-pitch-foreground/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next level">
          <div className="h-full rounded-full bg-pitch-accent transition-all" style={{ width: `${pct}%` }} /></div>
        <p className="mt-3 text-sm text-pitch-muted">{next ? `${next.min - n} more ${next.min - n === 1 ? "author" : "authors"} to reach ${next.title}.` : "You have reached the highest honour in the studio. Thank you."}</p>
      </div>
    </div>

    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-2xl border bg-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Refer an author</p>
        <h3 className="mt-2 text-2xl">Tell a colleague, friend or family member about us.</h3>
        <p className="mt-2 text-sm text-muted-foreground">Share your link. When they create an account with it, they count toward your next level.</p>
        <div className="mt-6 grid gap-2"><span className="text-xs font-semibold uppercase tracking-wider">Your referral code</span>
          <div className="flex items-center gap-3"><code className="rounded-md border bg-secondary px-4 py-3 font-mono text-lg tracking-wider">{stats.code ?? "…"}</code>
            <Button type="button" variant="studioOutline" size="studio" onClick={() => stats.code && copy(stats.code, "code")}>{copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied === "code" ? "Copied" : "Copy code"}</Button></div></div>
        <div className="mt-5 grid gap-2"><span className="text-xs font-semibold uppercase tracking-wider">Your share link</span>
          <div className="flex flex-wrap items-center gap-3"><p className="min-w-0 flex-1 truncate rounded-md border bg-secondary px-4 py-3 text-sm">{link}</p>
            <Button type="button" variant="studio" size="studio" onClick={() => link && copy(link, "link")}>{copied === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied === "link" ? "Link copied" : "Copy link"}</Button></div></div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:border-primary" href={`mailto:?subject=${encodeURIComponent("An author studio I recommend")}&body=${encodeURIComponent(msg)}`}><Mail className="h-4 w-4 text-primary" />Email</a>
          <a className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:border-primary" target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`}><Linkedin className="h-4 w-4 text-primary" />LinkedIn</a>
          <a className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:border-primary" target="_blank" rel="noopener noreferrer" href={`https://x.com/intent/tweet?text=${encodeURIComponent(msg)}`}><span className="font-semibold text-primary">X</span>Post on X</a>
          <a className="inline-flex items-center gap-2 rounded-full border px-4 py-2 hover:border-primary" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(msg)}`}><MessageCircle className="h-4 w-4 text-primary" />WhatsApp</a>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {([[Eye, "Link visits", stats.visits], [UserPlus, "Authors referred", stats.signups], [BookCheck, "Projects started", stats.projects]] as const).map(([I, l, v]) =>
          <div key={l} className="flex items-center gap-4 rounded-2xl border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary"><I aria-hidden className="h-5 w-5" /></span>
            <div><p className="text-3xl leading-none">{Number(v)}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div></div>)}
      </div>
    </div>

    <div>
      <h3 className="text-2xl">Your badge collection</h3>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{LEVELS.map(l => {
        const earned = n >= l.min, isNext = next?.level === l.level;
        return <li key={l.level} className={`flex flex-col items-center rounded-2xl border p-5 text-center ${isNext ? "border-primary ring-2 ring-primary/20" : ""} ${earned ? "bg-card" : "bg-secondary/50"}`}>
          <LoyaltyBadge level={l} earned={earned} />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level {l.level}</p>
          <p className="mt-1 font-medium">{l.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{l.badge}</p>
          <p className="mt-3 text-xs">{earned ? <span className="font-medium text-primary">Earned</span> : `${l.min} referrals`}</p>
          <p className="mt-2 text-xs text-muted-foreground">{l.perk}</p>
        </li>; })}</ol>
    </div>
  </div>;
}
