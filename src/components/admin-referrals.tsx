import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoyaltyBadge } from "@/components/loyalty-badge";
import { StatusPill } from "@/components/referral-panel";
import { LEVELS, REFERRAL_STATUSES, TEASER_STATUSES, referralLink, statusText, tierFrom } from "@/lib/loyalty";
import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
type Referral = T["referrals"]["Row"]; type Profile = T["profiles"]["Row"]; type Teaser = T["book_teaser_requests"]["Row"]; type Override = T["tier_overrides"]["Row"];
const input = "h-9 rounded-md border bg-background px-2 text-sm";

function useSorted<R>(rows: R[], text: (r: R) => string, key: (r: R) => string | number) {
  const [q, setQ] = useState(""); const [asc, setAsc] = useState(false);
  const out = useMemo(() => rows.filter(r => text(r).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => { const x = key(a), y = key(b); return (asc ? 1 : -1) * (x < y ? -1 : x > y ? 1 : 0); }), [rows, q, asc]); // eslint-disable-line react-hooks/exhaustive-deps
  const search = <label className="relative"><span className="sr-only">Search</span><Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="h-10 rounded-md border bg-background pl-9 pr-3 text-sm" /></label>;
  const sortBtn = (label: string) => <button type="button" onClick={() => setAsc(!asc)} className="inline-flex items-center gap-1 uppercase">{label}<ArrowUpDown aria-hidden className="h-3 w-3" /></button>;
  return { out, search, sortBtn };
}

export function AdminReferrals() {
  const [refs, setRefs] = useState<Referral[] | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [teasers, setTeasers] = useState<Teaser[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [err, setErr] = useState("");
  const [origin, setOrigin] = useState("");
  async function load() {
    const [r, p, t, o] = await Promise.all([
      supabase.from("referrals").select("*").order("created_at", { ascending: false }), supabase.from("profiles").select("*"),
      supabase.from("book_teaser_requests").select("*").order("created_at", { ascending: false }), supabase.from("tier_overrides").select("*"),
    ]);
    const e = r.error ?? p.error ?? t.error ?? o.error; if (e) return setErr(e.message);
    setRefs(r.data ?? []); setProfiles(p.data ?? []); setTeasers(t.data ?? []); setOverrides(o.data ?? []);
  }
  useEffect(() => { setOrigin(window.location.origin); load(); }, []);

  const byId = Object.fromEntries(profiles.map(p => [p.user_id, p]));
  const clients = profiles.map(p => {
    const mine = (refs ?? []).filter(r => r.referrer_id === p.user_id && r.status === "converted" && r.converted_at);
    return { ...p, tier: tierFrom(mine.map(r => r.converted_at!), new Date(), overrides.find(o => o.user_id === p.user_id)?.tier_level) };
  });
  const C = useSorted(clients, c => `${c.full_name} ${c.email} ${c.referral_code}`, c => c.tier.converted);
  const R = useSorted(refs ?? [], r => `${r.referred_name} ${r.referred_email} ${r.status} ${byId[r.referrer_id]?.email ?? ""}`, r => r.created_at);
  const B = useSorted(teasers, t => `${t.book_title} ${t.status} ${byId[t.user_id]?.email ?? ""}`, t => t.created_at);

  if (err) return <p role="alert" className="py-8 text-destructive">{err}</p>;
  if (!refs) return <p className="py-8 text-muted-foreground">Loading referrals…</p>;

  async function update(id: string, patch: T["referrals"]["Update"]) {
    const { error } = await supabase.from("referrals").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Referral updated"); load(); }
  }
  async function setTeaser(id: string, status: string) {
    const { error } = await supabase.from("book_teaser_requests").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Teaser updated"); load(); }
  }
  async function override(userId: string) {
    const lvl = window.prompt("Set tier level (1–7). Leave empty to remove the override.");
    if (lvl === null) return;
    if (lvl.trim() === "") { await supabase.from("tier_overrides").delete().eq("user_id", userId); toast.success("Override removed"); return load(); }
    const n = Number(lvl); if (!(n >= 1 && n <= 7)) return toast.error("Enter a level from 1 to 7.");
    const reason = window.prompt("Reason for this override?")?.trim(); if (!reason) return toast.error("A reason is required.");
    const { error } = await supabase.from("tier_overrides").upsert({ user_id: userId, tier_level: n, reason });
    if (error) toast.error(error.message); else { toast.success("Tier overridden"); load(); }
  }
  async function cover(path: string) {
    const { data } = await supabase.storage.from("book-covers").createSignedUrl(path, 300);
    if (data) window.open(data.signedUrl, "_blank", "noopener");
  }

  const converted = refs.filter(r => r.status === "converted").length;
  const unlocked = clients.filter(c => c.tier.level.level > 1).length;
  const th = "p-4"; const head = "bg-secondary text-xs uppercase tracking-wider text-muted-foreground";

  return <div className="grid gap-12 py-8">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {([["Total clients", profiles.length], ["Total referrals", refs.length], ["Pending referrals", refs.filter(r => r.status === "pending").length], ["Converted referrals", converted], ["Clients with rewards unlocked", unlocked]] as const).map(([l, v]) =>
        <div key={l} className="rounded-2xl border bg-card p-6"><p className="text-4xl">{v}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>)}
    </div>

    <section>
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-2xl">Referrals</h2>{R.search}</div>
      <div className="mt-4 overflow-x-auto rounded-2xl border"><table className="w-full min-w-[1100px] text-left text-sm">
        <thead className={head}><tr><th className={th}>Referrer</th><th className={th}>Referred client</th><th className={th}>{R.sortBtn("Submitted")}</th><th className={th}>Status</th><th className={th}>Project value</th><th className={th}>Deposit paid</th><th className={th}>Notes</th><th className={th}>Actions</th></tr></thead>
        <tbody className="divide-y">{R.out.length === 0 ? <tr><td colSpan={8} className="p-6 text-muted-foreground">No referrals yet. They appear when someone signs up with a referral link.</td></tr> : R.out.map(r => <tr key={r.id} className="align-top">
          <td className={th}>{byId[r.referrer_id]?.full_name || byId[r.referrer_id]?.email || "—"}</td>
          <td className={th}><p className="font-medium">{r.referred_name || "—"}</p><p className="text-muted-foreground">{r.referred_email}</p></td>
          <td className={th}>{new Date(r.created_at).toLocaleDateString()}</td>
          <td className={th}><StatusPill s={r.status} />{r.approved && r.status !== "converted" && <p className="mt-1 text-xs text-primary">Approved</p>}</td>
          <td className={th}><input type="number" min={0} defaultValue={r.project_value ?? ""} aria-label="Project value" className={`${input} w-28`} onBlur={e => { const v = e.target.value === "" ? null : Number(e.target.value); if (v !== r.project_value) update(r.id, { project_value: v }); }} /></td>
          <td className={th}><input type="checkbox" checked={r.deposit_paid} aria-label="Deposit paid" onChange={e => update(r.id, { deposit_paid: e.target.checked })} /></td>
          <td className={th}><textarea defaultValue={r.admin_notes} aria-label="Admin notes" rows={2} className="w-44 rounded-md border bg-background p-2 text-sm" onBlur={e => e.target.value !== r.admin_notes && update(r.id, { admin_notes: e.target.value })} /></td>
          <td className={th}><div className="flex flex-col gap-2">
            {!r.approved && r.status !== "rejected" && <Button size="sm" variant="studioOutline" onClick={() => update(r.id, { approved: true, status: r.status === "pending" ? "contacted" : r.status })}>Approve</Button>}
            <select aria-label="Status" value={r.status} className={input} onChange={e => update(r.id, { status: e.target.value })}>{REFERRAL_STATUSES.map(s => <option key={s} value={s}>{statusText(s)}</option>)}</select>
            {r.status !== "converted" && <Button size="sm" variant="studio" disabled={!r.approved || !r.deposit_paid} title={!r.approved ? "Approve first" : !r.deposit_paid ? "Mark the deposit paid first" : ""} onClick={() => update(r.id, { status: "converted" })}>Mark as converted</Button>}
            {r.status !== "rejected" && <Button size="sm" variant="ghost" onClick={() => update(r.id, { status: "rejected" })}>Reject</Button>}
          </div></td></tr>)}</tbody></table></div>
    </section>

    <section>
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-2xl">Clients</h2>{C.search}</div>
      <div className="mt-4 overflow-x-auto rounded-2xl border"><table className="w-full min-w-[960px] text-left text-sm">
        <thead className={head}><tr><th className={th}>Client</th><th className={th}>Tier</th><th className={th}>{C.sortBtn("Successful")}</th><th className={th}>Referral link</th><th className={th}>Ongoing discount</th><th className={th}>Actions</th></tr></thead>
        <tbody className="divide-y">{C.out.map(c => <tr key={c.user_id}>
          <td className={th}><p className="font-medium">{c.full_name || "—"}</p><a href={`mailto:${c.email}`} className="text-muted-foreground underline underline-offset-4">{c.email}</a></td>
          <td className={th}><div className="flex items-center gap-2"><LoyaltyBadge level={c.tier.level} size="sm" /><span>{c.tier.level.level} · {c.tier.level.title}{c.tier.overridden && <span className="block text-xs text-muted-foreground">Override: {overrides.find(o => o.user_id === c.user_id)?.reason}</span>}</span></div></td>
          <td className={`${th} font-semibold`}>{c.tier.converted}</td>
          <td className={`${th} font-mono text-xs`}>{origin && referralLink(origin, c.referral_code)}</td>
          <td className={th}>{c.tier.level.discount ? `$${c.tier.level.discount}` : "—"}</td>
          <td className={th}><Button size="sm" variant="studioOutline" onClick={() => override(c.user_id)}>Override tier</Button></td></tr>)}</tbody></table></div>
      <ul className="mt-4 flex flex-wrap gap-3">{LEVELS.map(l => <li key={l.level} className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-sm"><LoyaltyBadge level={l} size="sm" />{l.title} <span className="font-semibold">{clients.filter(c => c.tier.level.level === l.level).length}</span></li>)}</ul>
    </section>

    <section>
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-2xl">Book teaser requests</h2>{B.search}</div>
      <div className="mt-4 overflow-x-auto rounded-2xl border"><table className="w-full min-w-[960px] text-left text-sm">
        <thead className={head}><tr><th className={th}>Client</th><th className={th}>Book</th><th className={th}>Release date</th><th className={th}>{B.sortBtn("Requested")}</th><th className={th}>Details</th><th className={th}>Status</th></tr></thead>
        <tbody className="divide-y">{B.out.length === 0 ? <tr><td colSpan={6} className="p-6 text-muted-foreground">No teaser requests yet.</td></tr> : B.out.map(t => <tr key={t.id} className="align-top">
          <td className={th}>{byId[t.user_id]?.full_name || byId[t.user_id]?.email || "—"}</td>
          <td className={th}><p className="font-medium">{t.book_title}</p><a href={t.book_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline underline-offset-4">Sales page</a>{t.book_cover_url && <button type="button" className="ml-3 underline underline-offset-4" onClick={() => cover(t.book_cover_url!)}>Cover</button>}</td>
          <td className={th}>{new Date(t.release_date).toLocaleDateString()}</td><td className={th}>{new Date(t.created_at).toLocaleDateString()}</td>
          <td className={`${th} max-w-xs`}><p>{t.book_description}</p><p className="mt-1 text-muted-foreground">CTA: {t.call_to_action} · {t.preferred_format}</p></td>
          <td className={th}><select aria-label="Teaser status" value={t.status} className={input} onChange={e => setTeaser(t.id, e.target.value)}>{TEASER_STATUSES.map(s => <option key={s} value={s}>{statusText(s)}</option>)}</select></td></tr>)}</tbody></table></div>
    </section>
  </div>;
}
