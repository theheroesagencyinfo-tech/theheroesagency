import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoyaltyBadge } from "@/components/loyalty-badge";
import { Avatar, signedAvatar } from "@/components/avatar-upload";
import { LEVELS, levelFor } from "@/lib/loyalty";

type Row = { user_id: string; email: string; full_name: string; avatar_url: string | null; referral_code: string; referred_by: string | null; created_at: string; visits: number; signups: number; projects: number };

export function AdminReferrals() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  useEffect(() => { supabase.rpc("referral_leaderboard").then(async ({ data, error }) => {
    if (error) return setErr(error.message);
    const r = (data ?? []) as Row[]; setRows(r);
    const entries = await Promise.all(r.filter(x => x.avatar_url).map(async x => [x.user_id, await signedAvatar(x.avatar_url)] as const));
    setAvatars(Object.fromEntries(entries));
  }); }, []);
  if (err) return <p role="alert" className="py-8 text-destructive">{err}</p>;
  if (!rows) return <p className="py-8 text-muted-foreground">Loading referrals…</p>;
  const sum = (k: "visits" | "signups" | "projects") => rows.reduce((a, r) => a + Number(r[k]), 0);
  const byCode = Object.fromEntries(rows.map(r => [r.referral_code, r]));
  const referred = rows.filter(r => r.referred_by).sort((a, b) => b.created_at.localeCompare(a.created_at));

  return <div className="grid gap-10 py-8">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {([["Client accounts", rows.length], ["Referral link visits", sum("visits")], ["Authors referred", sum("signups")], ["Projects from referrals", sum("projects")]] as const).map(([l, v]) =>
        <div key={l} className="rounded-2xl border bg-card p-6"><p className="text-4xl">{v}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>)}
    </div>
    <div className="rounded-2xl border bg-card p-6">
      <h2 className="text-2xl">Clients by level</h2>
      <ul className="mt-5 flex flex-wrap gap-4">{LEVELS.map(l => <li key={l.level} className="flex items-center gap-3 rounded-full border py-1 pl-1 pr-4">
        <LoyaltyBadge level={l} size="sm" /><span className="text-sm">{l.title} <span className="font-semibold">{rows.filter(r => levelFor(Number(r.signups)).level === l.level).length}</span></span></li>)}</ul>
    </div>
    <div>
      <h2 className="text-2xl">Leaderboard</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground"><tr>
            <th className="p-4">#</th><th className="p-4">Client</th><th className="p-4">Code</th><th className="p-4">Level</th><th className="p-4">Visits</th><th className="p-4">Referred</th><th className="p-4">Projects</th><th className="p-4">Came via</th></tr></thead>
          <tbody className="divide-y">{rows.map((r, i) => { const l = levelFor(Number(r.signups)); return <tr key={r.user_id}>
            <td className="p-4 text-muted-foreground">{i + 1}</td>
            <td className="p-4"><div className="flex items-center gap-3"><Avatar url={avatars[r.user_id] ?? ""} name={r.full_name || r.email} className="h-9 w-9 text-sm" /><div><p className="font-medium">{r.full_name || "—"}</p><a href={`mailto:${r.email}`} className="text-muted-foreground underline underline-offset-4">{r.email}</a></div></div></td>
            <td className="p-4 font-mono">{r.referral_code}</td>
            <td className="p-4"><div className="flex items-center gap-2"><LoyaltyBadge level={l} size="sm" /><span>{l.level} · {l.title}</span></div></td>
            <td className="p-4">{Number(r.visits)}</td><td className="p-4 font-semibold">{Number(r.signups)}</td><td className="p-4">{Number(r.projects)}</td>
            <td className="p-4 text-muted-foreground">{r.referred_by ? (byCode[r.referred_by]?.full_name || byCode[r.referred_by]?.email || r.referred_by) : "Direct"}</td>
          </tr>; })}</tbody>
        </table>
      </div>
    </div>
    <div>
      <h2 className="text-2xl">Referral activity</h2>
      <ul className="mt-4 divide-y rounded-2xl border">{referred.length === 0 ? <li className="p-6 text-muted-foreground">No referred sign-ups yet.</li> :
        referred.map(r => <li key={r.user_id} className="flex flex-wrap justify-between gap-2 p-4 text-sm">
          <span><span className="font-medium">{r.full_name || r.email}</span> joined via <span className="font-medium">{byCode[r.referred_by!]?.full_name || byCode[r.referred_by!]?.email || r.referred_by}</span></span>
          <span className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span></li>)}</ul>
    </div>
  </div>;
}
