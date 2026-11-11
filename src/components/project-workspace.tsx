import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, ImagePlus, Send, Loader2, Compass, PenLine, Palette } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { coverUrls, type Order } from "@/lib/client-projects";
import type { Database } from "@/integrations/supabase/types";

type Note = Database["public"]["Tables"]["project_notes"]["Row"];
type Msg = Database["public"]["Tables"]["project_messages"]["Row"];
export const SECTIONS = [
  { key: "strategy", label: "Strategy", icon: Compass, hint: "Readers you want to reach, goals for the site, what success looks like." },
  { key: "copy", label: "Copy", icon: PenLine, hint: "Your bio, book description, headlines and any wording you want used." },
  { key: "design", label: "Design", icon: Palette, hint: "Colours, sites you admire, mood, photos you want included." },
] as const;
const STATUS = { draft: "Draft", in_review: "Ready for review", approved: "Approved" } as const;
const card = "min-w-0 rounded-sm border bg-card shadow-sm";

export function CoverUpload({ order, onChange }: { order: Order; onChange: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { coverUrls([order]).then(m => setUrl(m[order.id] ?? null)); }, [order]);
  async function pick(f: File | undefined) {
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { toast.error("Use a JPG, PNG or WebP image."); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("Covers must be under 5 MB."); return; }
    setBusy(true);
    const path = `${order.id}/cover/${crypto.randomUUID()}.${f.type.split("/")[1]}`;
    const up = await supabase.storage.from("project-files").upload(path, f, { contentType: f.type });
    const res = up.error ? up : await supabase.rpc("set_order_cover", { _order_id: order.id, _path: path });
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Cover uploaded"); onChange();
  }
  return <div className="w-full max-w-[220px]">
    <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-pitch text-pitch-foreground shadow-md">
      {url ? <img src={url} alt={`Cover of ${order.book}`} className="h-full w-full object-cover" />
        : <div className="flex h-full flex-col items-center justify-center p-4 text-center"><span className="font-serif text-xl uppercase leading-tight">{order.book}</span><span className="mt-3 h-px w-10 bg-medal-brass" /></div>}
      {busy && <div className="absolute inset-0 flex items-center justify-center bg-pitch/60"><Loader2 aria-label="Uploading" className="h-6 w-6 animate-spin" /></div>}
    </div>
    <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Upload book cover" onChange={e => { pick(e.target.files?.[0]); e.target.value = ""; }} />
    <Button type="button" variant="studioOutline" size="sm" className="mt-3 w-full rounded-sm" disabled={busy} onClick={() => ref.current?.click()}><ImagePlus aria-hidden className="mr-2 h-4 w-4" />{url ? "Replace cover" : "Upload book cover"}</Button>
    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP, up to 5 MB.</p>
  </div>;
}

export function ProjectWorkspace({ orderId }: { orderId: string }) {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<(typeof SECTIONS)[number]["key"]>("strategy");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  async function load() {
    const { data, error } = await supabase.from("project_notes").select("*").eq("order_id", orderId);
    if (error) { toast.error(error.message); return; }
    const m = Object.fromEntries((data ?? []).map(n => [n.section, n]));
    setNotes(m); setDraft(Object.fromEntries((data ?? []).map(n => [n.section, n.body]))); setLoaded(true);
  }
  useEffect(() => { load(); }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps
  async function save(status?: Note["status"]) {
    setSaving(true);
    const { error } = await supabase.from("project_notes").upsert({ order_id: orderId, section: tab, body: (draft[tab] ?? "").slice(0, 20000), status: status ?? notes[tab]?.status ?? "draft" }, { onConflict: "order_id,section" });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "in_review" ? "Sent to Mou for review" : status === "approved" ? "Marked approved" : "Notes saved"); load();
  }
  const done = SECTIONS.filter(s => notes[s.key]?.status === "approved").length;
  const started = SECTIONS.filter(s => (notes[s.key]?.body ?? "").trim()).length;
  const pct = Math.round(((started + done) / (SECTIONS.length * 2)) * 100);
  const cur = SECTIONS.find(s => s.key === tab)!;
  const n = notes[tab]; const dirty = (draft[tab] ?? "") !== (n?.body ?? "");

  return <section aria-labelledby="ws" className={`${card} p-5 sm:p-7`}>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Project workspace</p><h2 id="ws" className="mt-1 font-serif text-[2rem]">Strategy, copy and design notes</h2>
        <p className="text-sm text-muted-foreground">Write here; Mou sees every note and can reply in messages below.</p></div>
      <div className="w-full max-w-xs"><div className="flex justify-between text-sm"><span>Workspace progress</span><span className="font-medium">{pct}%</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Workspace progress"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
        <p className="mt-1 text-xs text-muted-foreground">{started} of 3 started · {done} of 3 approved</p></div>
    </div>
    <ol className="mt-6 grid grid-cols-3 gap-2" role="tablist" aria-label="Workspace sections">{SECTIONS.map(s => { const st = notes[s.key]?.status; const on = tab === s.key;
      return <li key={s.key}><button type="button" role="tab" aria-selected={on} onClick={() => setTab(s.key)} className={`flex h-full w-full min-w-0 flex-col items-start gap-1 rounded-sm border p-2 text-left sm:p-3 transition-colors ${on ? "border-primary bg-primary/10" : "hover:border-foreground/40"}`}>
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium sm:gap-2 sm:text-base"><s.icon aria-hidden className="hidden h-4 w-4 shrink-0 sm:block" />{s.label}{st === "approved" && <Check aria-label="approved" className="h-4 w-4 text-primary" />}</span>
        <span className="text-xs text-muted-foreground">{st ? STATUS[st as keyof typeof STATUS] : "Not started"}</span></button></li>; })}</ol>
    {!loaded ? <p className="mt-6 text-muted-foreground">Loading notes…</p> : <div className="mt-5">
      <label htmlFor="ws-body" className="text-sm font-medium">{cur.label} notes</label>
      <p className="text-sm text-muted-foreground">{cur.hint}</p>
      <textarea id="ws-body" value={draft[tab] ?? ""} maxLength={20000} rows={10} onChange={e => setDraft({ ...draft, [tab]: e.target.value })}
        className="mt-2 w-full rounded-sm border bg-background p-4 text-base leading-relaxed focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30" placeholder={`Write your ${cur.label.toLowerCase()} notes…`} />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="studio" className="rounded-sm" disabled={saving || !dirty} onClick={() => save()}>{saving ? "Saving…" : "Save notes"}</Button>
        <Button type="button" variant="studioOutline" className="rounded-sm" disabled={saving || !(draft[tab] ?? "").trim() || n?.status === "in_review"} onClick={() => save("in_review")}>Send for review</Button>
        {n?.status === "in_review" && <Button type="button" variant="ghost" className="rounded-sm" disabled={saving} onClick={() => save("approved")}>Mark approved</Button>}
        <span className="text-xs text-muted-foreground">{n ? `Last saved ${new Date(n.updated_at).toLocaleString()}` : "Not saved yet"}{dirty ? " · unsaved changes" : ""}</span>
      </div>
    </div>}
  </section>;
}

export function ProjectMessages({ orderId, studio = false }: { orderId: string; studio?: boolean }) {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [body, setBody] = useState(""); const [busy, setBusy] = useState(false);
  const box = useRef<HTMLOListElement>(null);
  const load = () => supabase.from("project_messages").select("*").eq("order_id", orderId).order("created_at").then(({ data, error }) => { if (error) toast.error(error.message); setMsgs(data ?? []); });
  useEffect(() => { load(); const t = setInterval(load, 20000); return () => clearInterval(t); }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const b = box.current; if (b) b.scrollTop = b.scrollHeight; }, [msgs?.length]);
  async function send(e: FormEvent) {
    e.preventDefault(); const t = body.trim(); if (!t) return;
    setBusy(true); const { error } = await supabase.from("project_messages").insert({ order_id: orderId, body: t.slice(0, 4000) }); setBusy(false);
    if (error) { toast.error(error.message); return; }
    setBody(""); load();
  }
  return <section aria-labelledby="pm" className={`${card} flex flex-col p-5 sm:p-7`}>
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">Direct line</p>
    <h2 id="pm" className="mt-1 font-serif text-[2rem]">{studio ? "Messages with the client" : "Talk to Mou about this project"}</h2>
    <p className="text-sm text-muted-foreground">{studio ? "Replies appear on the client's project page." : "Ask for changes or share thoughts. Mou usually replies within one business day."}</p>
    <ol ref={box} className="mt-5 grid max-h-[420px] gap-3 overflow-y-auto pr-1" aria-live="polite">
      {msgs === null ? <li className="text-muted-foreground">Loading messages…</li> : msgs.length === 0 ? <li className="rounded-sm border border-dashed p-5 text-sm text-muted-foreground">No messages yet. Start the conversation below.</li>
      : msgs.map(m => { const mine = m.from_studio === studio;
        return <li key={m.id} className={`max-w-[85%] rounded-sm px-4 py-3 ${mine ? "justify-self-end bg-primary text-primary-foreground" : "justify-self-start bg-secondary"}`}>
          <p className="text-xs opacity-80">{m.from_studio ? "Mou · TheHeroes Agency" : studio ? "Client" : "You"} · {new Date(m.created_at).toLocaleString()}</p>
          <p className="mt-1 whitespace-pre-wrap break-words">{m.body}</p></li>; })}
          </ol>
    <form onSubmit={send} className="mt-4 flex items-end gap-2">
      <label className="min-w-0 flex-1"><span className="sr-only">Your message</span>
        <textarea value={body} onChange={e => setBody(e.target.value)} maxLength={4000} rows={2} placeholder={studio ? "Reply to the client…" : "Describe the change you'd like…"} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(e); }}
          className="w-full rounded-sm border bg-background p-3 text-base focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30" /></label>
      <Button type="submit" variant="studio" className="h-12 rounded-sm" disabled={busy || !body.trim()}><Send aria-hidden className="mr-2 h-4 w-4" />Send</Button>
    </form>
  </section>;
}
