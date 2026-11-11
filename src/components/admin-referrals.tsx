import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Search, ArrowRight, Check, Clock, CircleCheck, Filter, Film, Gift, Lock, Share2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoyaltyBadge } from "@/components/loyalty-badge";
import { DepositDot, StatusPill, money } from "@/components/referral-panel";
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
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search referrals…" className="h-10 rounded-sm border bg-background pl-9 pr-3 text-sm" /></label>;
  const sortBtn = (label: string) => <Button variant="ghost" size="sm" type="button" onClick={() => setAsc(!asc)} className="inline-flex items-center gap-1 uppercase">{label}<ArrowUpDown aria-hidden className="h-3 w-3" /></Button>;
  return { out, search, sortBtn };
}

export function AdminReferrals() {
  const [refs, setRefs] = useState<Referral[] | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [teasers, setTeasers] = useState<Teaser[]>([]);
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [err, setErr] = useState("");
  const [origin, setOrigin] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
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
    return { ...p, tier: tierFrom(mine.flatMap(r => r.converted_at ? [r.converted_at] : []), new Date(), overrides.find(o => o.user_id === p.user_id)?.tier_level) };
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

  const sel = refs.find(r => r.id === open) ?? null;
  const shown = R.out.filter(r => filter === "all" || r.status === filter);
  const requested = teasers.filter(t => t.status === "requested").length;
  const box = "min-w-0 rounded-sm border bg-card shadow-sm";

  return <div className="grid min-w-0 gap-10 py-2">
    <div className={`${box} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`}>
      {([[Users, "Total clients", profiles.length], [Share2, "Total referrals", refs.length], [Clock, "Pending referrals", refs.filter(r => r.status === "pending").length], [CircleCheck, "Converted referrals", converted], [Gift, "Rewards unlocked", unlocked]] as const).map(([I, l, v]) =>
        <div key={l} className="flex flex-col items-center border-b border-l px-3 py-5 text-center"><I aria-hidden className="h-6 w-6" /><p className="mt-2 font-serif text-4xl">{v}</p><p className="text-sm">{l}</p></div>)}
    </div>

    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section aria-labelledby="adm-refs" className={`${box} p-5 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 id="adm-refs" className="font-serif text-[1.7rem]">Referrals</h2><p className="text-sm text-muted-foreground">Every author referred through a client link.</p></div>
          <div className="flex flex-wrap gap-2">{R.search}
            <label className="relative"><span className="sr-only">Filter by status</span><Filter aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <select value={filter} onChange={e => setFilter(e.target.value)} className="h-10 rounded-sm border bg-background pl-9 pr-3 text-sm"><option value="all">All statuses</option>{REFERRAL_STATUSES.map(x => <option key={x} value={x}>{statusText(x)}</option>)}</select></label>
          </div>
        </div>
        <div className="portal-table mt-5 overflow-x-auto"><table className="w-full min-w-[820px] text-left text-[15px]">
          <thead className="bg-secondary text-sm"><tr><th className="px-4 py-3 font-medium">Referred Author</th><th className="px-4 py-3 font-medium">Referrer</th><th className="px-4 py-3 font-medium">{R.sortBtn("Date")}</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Deposit Status</th><th className="px-4 py-3 font-medium">Project Value</th><th className="px-4 py-3 font-medium">Action</th></tr></thead>
          <tbody className="divide-y">{shown.length === 0 ? <tr><td colSpan={7} className="p-6 text-muted-foreground">{refs.length ? "No referrals match this search." : "No referrals yet. They appear when someone signs up with a referral link."}</td></tr> : shown.map(r => <tr key={r.id}>
            <td className="px-4 py-3"><p className="font-medium">{r.referred_name || "—"}</p><p className="text-sm text-muted-foreground">{r.referred_email}</p></td>
            <td className="px-4 py-3">{byId[r.referrer_id]?.full_name || byId[r.referrer_id]?.email || "—"}</td>
            <td className="px-4 py-3 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
            <td className="px-4 py-3"><StatusPill s={r.status} />{r.approved && r.status !== "converted" && <p className="mt-1 text-xs text-primary">Approved</p>}</td>
            <td className="px-4 py-3"><DepositDot paid={r.deposit_paid} /></td>
            <td className="px-4 py-3">{money(r.project_value)}</td>
            <td className="px-4 py-3"><Button size="sm" variant="studioOutline" className="rounded-sm" onClick={() => setOpen(r.id)} aria-label={`View referral for ${r.referred_name || r.referred_email}`}>View<ArrowRight aria-hidden className="ml-1 h-4 w-4" /></Button></td></tr>)}</tbody></table></div>
      </section>

      <div className="grid min-w-0 content-start gap-5">
        <section aria-labelledby="adm-tiers" className={`${box} p-6`}>
          <h2 id="adm-tiers" className="font-serif text-[1.7rem]">Loyalty Tiers</h2>
          <p className="text-sm text-muted-foreground">Clients at each level.</p>
          <ol className="mt-4 grid gap-1">{LEVELS.map(l => { const count = clients.filter(c => c.tier.level.level === l.level).length;
            return <li key={l.level} className="flex items-center gap-3 rounded-sm px-2 py-2">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${count ? "bg-primary text-primary-foreground" : "border"}`}>{count ? <Check aria-hidden className="h-4 w-4" /> : <Lock aria-hidden className="h-3.5 w-3.5" />}</span>
              <span className="min-w-0 flex-1"><span className="block font-medium">Level {l.level} · {l.title}</span><span className="block text-sm text-muted-foreground">{l.discount ? `$${l.discount} off` : "Referral link"}{l.teaser ? " + teaser" : ""}</span></span>
              <span className="font-serif text-xl" aria-label={`${count} clients`}>{count}</span></li>; })}</ol>
        </section>
        <section className="rounded-sm bg-pitch p-6 text-pitch-foreground">
          <p className="flex items-center gap-2 text-sm uppercase tracking-[0.08em] text-medal-gold"><Film aria-hidden className="h-4 w-4" />Level 4+ required</p>
          <h2 className="mt-2 font-serif text-[1.7rem]">Book Teaser Desk</h2>
          <p className="mt-1 text-sm text-pitch-foreground/85">{requested} new {requested === 1 ? "request" : "requests"} · {teasers.length} total</p>
          <a href="#teasers" className="mt-5 inline-flex items-center gap-2 rounded-sm border border-medal-gold px-4 py-2.5 text-medal-gold">Review teaser requests<ArrowRight aria-hidden className="h-4 w-4" /></a>
        </section>
      </div>
    </div>

    <Dialog open={!!sel} onOpenChange={o => !o && setOpen(null)}>
      <DialogContent className="portal max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {sel && <>
          <DialogHeader><DialogTitle className="break-all font-serif text-2xl">{sel.referred_name || sel.referred_email}</DialogTitle>
            <DialogDescription>{sel.referred_email} · referred by {byId[sel.referrer_id]?.full_name || byId[sel.referrer_id]?.email || "—"} on {new Date(sel.created_at).toLocaleDateString()}</DialogDescription></DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm font-medium">Status<select value={sel.status} className={`${input} h-10`} onChange={e => update(sel.id, { status: e.target.value })}>{REFERRAL_STATUSES.map(x => <option key={x} value={x}>{statusText(x)}</option>)}</select></label>
            <label className="grid gap-1 text-sm font-medium">Project value ($)<input key={`v${sel.id}${sel.project_value}`} type="number" min={0} defaultValue={sel.project_value ?? ""} className={`${input} h-10`} onBlur={e => { const v = e.target.value === "" ? null : Number(e.target.value); if (v !== sel.project_value) update(sel.id, { project_value: v }); }} /></label>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={sel.deposit_paid} onChange={e => update(sel.id, { deposit_paid: e.target.checked })} />Deposit paid</label>
            <label className="grid gap-1 text-sm font-medium">Notes<textarea key={`n${sel.id}`} defaultValue={sel.admin_notes} rows={3} className="rounded-sm border bg-background p-2 text-sm font-normal" onBlur={e => e.target.value !== sel.admin_notes && update(sel.id, { admin_notes: e.target.value })} /></label>
            <div className="flex flex-wrap gap-2 border-t pt-4">
              {!sel.approved && sel.status !== "rejected" && <Button size="sm" variant="studioOutline" onClick={() => update(sel.id, { approved: true, status: sel.status === "pending" ? "contacted" : sel.status })}>Approve</Button>}
              {sel.status !== "converted" && <Button size="sm" variant="studio" disabled={!sel.approved || !sel.deposit_paid} onClick={() => update(sel.id, { status: "converted" })}>Mark as converted</Button>}
              {sel.status !== "rejected" && <Button size="sm" variant="ghost" onClick={() => update(sel.id, { status: "rejected" })}>Reject</Button>}
            </div>
            {sel.status !== "converted" && (!sel.approved || !sel.deposit_paid) && <p className="text-xs text-muted-foreground">{!sel.approved ? "Approve the referral first" : "Mark the deposit paid first"} to mark it as converted.</p>}
          </div>
        </>}
      </DialogContent>
    </Dialog>

    <section>
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="font-serif text-[1.7rem]">Clients</h2>{C.search}</div>
      <div className="mt-4 portal-table overflow-x-auto rounded-lg border"><table className="w-full min-w-[960px] text-left text-sm">
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

    <section id="teasers" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4"><h2 className="font-serif text-[1.7rem]">Book teaser requests</h2>{B.search}</div>
      <div className="mt-4 portal-table overflow-x-auto rounded-lg border"><table className="w-full min-w-[960px] text-left text-sm">
        <thead className={head}><tr><th className={th}>Client</th><th className={th}>Book</th><th className={th}>Release date</th><th className={th}>{B.sortBtn("Requested")}</th><th className={th}>Details</th><th className={th}>Status</th></tr></thead>
        <tbody className="divide-y">{B.out.length === 0 ? <tr><td colSpan={6} className="p-6 text-muted-foreground">No teaser requests yet.</td></tr> : B.out.map(t => <tr key={t.id} className="align-top">
          <td className={th}>{byId[t.user_id]?.full_name || byId[t.user_id]?.email || "—"}</td>
          <td className={th}><p className="font-medium">{t.book_title}</p><a href={t.book_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline underline-offset-4">Sales page</a>{t.book_cover_url && <button type="button" className="ml-3 underline underline-offset-4" onClick={() => { if (t.book_cover_url) cover(t.book_cover_url); }}>Cover</button>}</td>
          <td className={th}>{new Date(t.release_date).toLocaleDateString()}</td><td className={th}>{new Date(t.created_at).toLocaleDateString()}</td>
          <td className={`${th} max-w-xs`}><p>{t.book_description}</p><p className="mt-1 text-muted-foreground">CTA: {t.call_to_action} · {t.preferred_format}</p></td>
          <td className={th}><select aria-label="Teaser status" value={t.status} className={input} onChange={e => setTeaser(t.id, e.target.value)}>{TEASER_STATUSES.map(s => <option key={s} value={s}>{statusText(s)}</option>)}</select></td></tr>)}</tbody></table></div>
    </section>
  </div>;
}
