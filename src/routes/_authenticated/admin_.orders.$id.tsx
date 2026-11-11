import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { packages, progressOf } from "@/lib/packages";
import { loadProject } from "@/lib/client-projects";
import { ProgressBar } from "@/components/progress-bar";
import { CoverUpload, ProjectMessages, ProjectWorkspace } from "@/components/project-workspace";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin_/orders/$id")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Manage project · TheHeroes Agency admin" },
    { name: "description", content: "Manage tasks, pages, wireframes, and updates for a client project." },
    { property: "og:title", content: "Manage project · TheHeroes Agency" },
    { property: "og:description", content: "Admin project tools." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Manage,
});

const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:border-ring";

function Manage() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Awaited<ReturnType<typeof loadProject>> | null>(null);
  const [err, setErr] = useState("");
  const [editing, setEditing] = useState<{ kind: "task" | "page"; id: string; title: string; url: string } | null>(null);
  const reload = () => loadProject(id).then(setP);
  useEffect(() => { reload(); }, [id]);

  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = e.currentTarget; const title = String(new FormData(f).get("title")).trim();
    if (!title) return;
    const { error } = await supabase.from("project_tasks").insert({ order_id: id, title });
    if (error) return setErr(error.message); f.reset(); reload();
  }
  async function saveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    if (editing.kind === "page" && !/^https?:\/\//.test(editing.url)) return setErr("Add a full link starting with https://");
    const result = editing.kind === "task"
      ? await supabase.from("project_tasks").update({ title: editing.title.trim() }).eq("id", editing.id)
      : await supabase.from("project_items").update({ title: editing.title.trim(), url: editing.url }).eq("id", editing.id);
    if (result.error) return setErr(result.error.message);
    setEditing(null); setErr(""); reload();
  }
  async function addItem(e: FormEvent<HTMLFormElement>, kind: "page" | "wireframe" | "update") {
    e.preventDefault(); setErr(""); const f = e.currentTarget; const d = new FormData(f);
    const title = String(d.get("title") ?? "").trim(); if (!title) return setErr("Add a title.");
    let url: string | null = String(d.get("url") ?? "").trim() || null;
    if (kind === "wireframe") {
      const file = d.get("file") as File | null;
      if (!file || !file.size) return setErr("Choose an image to upload.");
      const path = `${id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("project-files").upload(path, file, { contentType: file.type });
      if (up.error) return setErr(up.error.message); url = path;
    }
    if (kind === "page" && (!url || !/^https?:\/\//.test(url))) return setErr("Add a full link starting with https://");
    const { error } = await supabase.from("project_items").insert({ order_id: id, kind, title, url, body: String(d.get("body") ?? "").trim() });
    if (error) return setErr(error.message); f.reset(); reload();
  }

  if (!p) return <p className="mx-auto max-w-5xl px-5 py-20 text-muted-foreground">Loading…</p>;
  if (!p.order) return <p className="mx-auto max-w-5xl px-5 py-20">Order not found.</p>;
  const { order, tasks, items } = p;
  return <section className="portal mx-auto max-w-[1500px] px-5 py-14 sm:px-10">
    <Link to="/admin" className="text-sm underline underline-offset-4">← Back to studio room</Link>
    <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">Project workspace · {packages.find(x => x.slug === order.package)?.name}</p>
    <h1 className="mt-3 text-5xl leading-tight">{order.book}</h1>
    <p className="mt-3 text-muted-foreground">{order.name} · <a href={`mailto:${order.email}`} className="underline underline-offset-4">{order.email}</a> · <span className="capitalize">{order.status}</span></p>
    <div className="mt-6 max-w-xl"><ProgressBar value={progressOf(tasks)} /></div>
    {err && <p role="alert" className="mt-4 text-sm text-destructive">{err}</p>}

    <div className="mt-12 border-t pt-8"><h2 className="text-2xl">Task manager</h2>
      <ul className="mt-4 divide-y border-y">{tasks.map(t => <li key={t.id} className="flex items-center gap-3 py-3">
        <input type="checkbox" checked={t.done} aria-label={`Mark "${t.title}" done`} onChange={async () => { await supabase.from("project_tasks").update({ done: !t.done }).eq("id", t.id); reload(); }} className="h-4 w-4 accent-primary" />
        <span className="min-w-0 flex-1 break-words">{t.title}</span>
        <Button variant="ghost" size="icon" title="Edit task" aria-label={`Edit ${t.title}`} onClick={() => setEditing({kind:"task",id:t.id,title:t.title,url:""})}><Pencil /></Button>
        <Button variant="ghost" size="icon" title="Remove task" aria-label={`Remove ${t.title}`} onClick={async () => { await supabase.from("project_tasks").delete().eq("id", t.id); reload(); }}><Trash2 /></Button></li>)}</ul>
      <form onSubmit={addTask} className="mt-4 flex flex-wrap gap-3"><input name="title" maxLength={200} placeholder="e.g. Design homepage" aria-label="New task" className={`${inputClass} min-w-0 flex-1`} /><Button type="submit" variant="studio" size="studio">Add task</Button></form>
    </div>

    <div className="mt-12 grid gap-10 border-t pt-8 md:grid-cols-3">
      <form onSubmit={e => addItem(e, "page")} className="grid content-start gap-3"><h2 className="text-2xl">Add live page</h2>
        <input name="title" placeholder="Page name" aria-label="Page name" maxLength={200} className={inputClass} /><input name="url" placeholder="https://…" aria-label="Page link" className={inputClass} />
        <Button type="submit" variant="studio" size="sm" className="justify-self-start">Add page</Button></form>
      <form onSubmit={e => addItem(e, "wireframe")} className="grid content-start gap-3"><h2 className="text-2xl">Add wireframe</h2>
        <input name="title" placeholder="Wireframe name" aria-label="Wireframe name" maxLength={200} className={inputClass} /><input name="file" type="file" accept="image/*" aria-label="Wireframe image" className="text-sm" /><input name="body" placeholder="Note (optional)" aria-label="Wireframe note" className={inputClass} />
        <Button type="submit" variant="studio" size="sm" className="justify-self-start">Upload wireframe</Button></form>
      <form onSubmit={e => addItem(e, "update")} className="grid content-start gap-3"><h2 className="text-2xl">Post update</h2>
        <input name="title" placeholder="Update title" aria-label="Update title" maxLength={200} className={inputClass} /><textarea name="body" rows={3} placeholder="What's new" aria-label="Update details" maxLength={3000} className={inputClass} />
        <Button type="submit" variant="studio" size="sm" className="justify-self-start">Post update</Button></form>
    </div>

    <div className="mt-12 border-t pt-8"><h2 className="text-2xl">Shared with client</h2>
      <ul className="mt-4 divide-y border-y">{items.length === 0 && <li className="py-4 text-muted-foreground">Nothing yet.</li>}{items.map(i => <li key={i.id} className="flex flex-wrap items-center gap-3 py-3">
        <span className="w-24 text-sm text-muted-foreground">{i.kind}</span><span className="min-w-0 flex-1 break-words">{i.title}{i.kind === "wireframe" && i.src && <a href={i.src} target="_blank" rel="noopener noreferrer"><img src={i.src} alt={i.title} loading="lazy" className="mt-3 max-h-48 max-w-full rounded-md border object-contain" /></a>}</span>
        {i.kind === "page" && <><Button asChild variant="ghost" size="icon"><a href={i.url ?? undefined} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${i.title}`} title="Visit page"><ExternalLink /></a></Button><Button variant="ghost" size="icon" aria-label={`Edit ${i.title}`} title="Edit page" onClick={() => setEditing({kind:"page",id:i.id,title:i.title,url:i.url ?? ""})}><Pencil /></Button></>}
        <Button variant="ghost" size="icon" title="Remove item" aria-label={`Remove ${i.title}`} onClick={async () => { if (i.kind === "wireframe" && i.url) await supabase.storage.from("project-files").remove([i.url]); await supabase.from("project_items").delete().eq("id", i.id); reload(); }}><Trash2 /></Button></li>)}</ul>
    </div>
    {p?.order && <div className="mt-12 grid gap-6 border-t pt-8 xl:grid-cols-[220px_1.4fr_1fr]">
      <CoverUpload order={p.order} onChange={reload} />
      <ProjectWorkspace orderId={p.order.id} />
      <ProjectMessages orderId={p.order.id} studio />
    </div>}
    <Dialog open={editing !== null} onOpenChange={open => { if (!open) setEditing(null); }}><DialogContent className="portal"><DialogTitle>Edit {editing?.kind === "task" ? "task" : "page"}</DialogTitle><DialogDescription>Update the details shared with this client.</DialogDescription>{editing && <form onSubmit={saveEdit} className="grid gap-4"><label className="grid gap-2 text-sm">Title<input required maxLength={200} className={inputClass} value={editing.title} onChange={e => setEditing({...editing,title:e.target.value})} /></label>{editing.kind === "page" && <label className="grid gap-2 text-sm">URL<input required type="url" className={inputClass} value={editing.url} onChange={e => setEditing({...editing,url:e.target.value})} /></label>}<Button variant="studio" type="submit">Save changes</Button></form>}</DialogContent></Dialog>
  </section>;
}
