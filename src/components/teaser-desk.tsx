import { useEffect, useState, type FormEvent } from "react";
import { Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/referral-panel";
import type { Database } from "@/integrations/supabase/types";

type Teaser = Database["public"]["Tables"]["book_teaser_requests"]["Row"];
const field = "mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm";

export function TeaserDesk() {
  const [list, setList] = useState<Teaser[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const load = () => supabase.from("book_teaser_requests").select("*").order("created_at", { ascending: false }).then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const form = e.currentTarget, f = new FormData(form);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in again.");
      let cover: string | null = null;
      const file = f.get("cover") as File | null;
      if (file && file.size) {
        if (file.size > 5 * 1024 * 1024) throw new Error("Cover images must be under 5 MB.");
        const path = `${u.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const up = await supabase.storage.from("book-covers").upload(path, file);
        if (up.error) throw up.error;
        cover = path;
      }
      const { error } = await supabase.from("book_teaser_requests").insert({
        user_id: u.user.id, book_title: String(f.get("title")).trim(), release_date: String(f.get("release")),
        book_description: String(f.get("description")).trim(), call_to_action: String(f.get("cta")).trim(),
        preferred_format: String(f.get("format")), book_link: String(f.get("link")).trim(), first_edition: f.get("first") === "on", book_cover_url: cover,
      });
      if (error) throw new Error(error.message.includes("teaser_one_per_book") ? "You've already requested a teaser for this book." : error.message);
      form.reset(); setMsg({ ok: true, text: "Request received. You'll see its status update here." }); load();
    } catch (err) { setMsg({ ok: false, text: err instanceof Error ? err.message : "Something went wrong." }); }
    setBusy(false);
  }

  return <div className="grid gap-8 rounded-2xl border bg-card p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
    <form onSubmit={submit} className="grid gap-4">
      <div><Film aria-hidden className="h-5 w-5 text-primary" /><h3 className="mt-2 text-2xl">Request your free book teaser</h3>
        <p className="mt-1 text-sm text-muted-foreground">One standard 30-second teaser per first-edition title, requested within 6 months of release.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Book title<input name="title" required maxLength={200} className={field} /></label>
        <label className="text-sm font-medium">Release date<input name="release" type="date" required className={field} /></label>
      </div>
      <label className="text-sm font-medium">Short book description<textarea name="description" required maxLength={1000} rows={3} className={field} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">Preferred call to action<input name="cta" required maxLength={120} placeholder="e.g. Order your copy" className={field} /></label>
        <label className="text-sm font-medium">Format<select name="format" className={field}><option value="vertical">Vertical (9:16)</option><option value="horizontal">Horizontal (16:9)</option></select></label>
      </div>
      <label className="text-sm font-medium">Author website or sales page<input name="link" type="url" required placeholder="https://" className={field} /></label>
      <label className="text-sm font-medium">Book cover<input name="cover" type="file" accept="image/*" className={field} /></label>
      <label className="flex items-start gap-2 text-sm"><input name="first" type="checkbox" required className="mt-1" />This is a first-edition title published for the first time (not a revised edition, re-release, box set, audiobook or translation).</label>
      <p className="text-xs text-muted-foreground">Custom filming, actors, professional voiceover, original music, extra formats and extra revisions are not included.</p>
      {msg && <p role={msg.ok ? "status" : "alert"} className={`text-sm ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
      <Button type="submit" variant="studio" size="studio" disabled={busy} className="w-fit">{busy ? "Sending request…" : "Request my teaser"}</Button>
    </form>
    <div>
      <h4 className="text-lg">Your teaser requests</h4>
      {list === null ? <p className="mt-3 text-sm text-muted-foreground">Loading…</p> : list.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No requests yet.</p>
        : <ul className="mt-3 divide-y rounded-xl border">{list.map(t => <li key={t.id} className="flex items-center justify-between gap-3 p-4 text-sm">
          <span><span className="block font-medium">{t.book_title}</span><span className="text-muted-foreground">Released {new Date(t.release_date).toLocaleDateString()}</span></span>
          <StatusPill s={t.status === "requested" ? "pending" : t.status === "in_production" ? "booked" : t.status === "delivered" ? "converted" : "rejected"} /></li>)}</ul>}
      {list && list.length > 0 && <p className="mt-2 text-xs text-muted-foreground">Status: {list.map(t => `${t.book_title} · ${t.status.replace("_", " ")}`).join("; ")}</p>}
    </div>
  </div>;
}
