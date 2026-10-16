import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { packages, progressOf } from "@/lib/packages";
import { loadProject } from "@/lib/client-projects";
import { ProgressBar } from "@/components/progress-bar";

export const Route = createFileRoute("/_authenticated/admin_/orders/$id")({
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
  const reload = () => loadProject(id).then(setP);
  useEffect(() => { reload(); }, [id]);

  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = e.currentTarget; const title = String(new FormData(f).get("title")).trim();
    if (!title) return;
    const { error } = await supabase.from("project_tasks").insert({ order_id: id, title });
    if (error) return setErr(error.message); f.reset(); reload();
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
  return <section className="mx-auto max-w-5xl px-5 py-14">
    <Link to="/admin" className="text-sm underline underline-offset-4">← Admin</Link>
    <h1 className="mt-6 text-4xl">{order.name} · {order.book}</h1>
    <p className="mt-2 text-muted-foreground">{packages.find(x => x.slug === order.package)?.name} · {order.email}</p>
    <div className="mt-6 max-w-xl"><ProgressBar value={progressOf(tasks)} /></div>
    {err && <p role="alert" className="mt-4 text-sm text-destructive">{err}</p>}

    <div className="mt-12 border-t pt-8"><h2 className="text-2xl">Tasks</h2><p className="mt-1 text-sm text-muted-foreground">Tick a task when it's done. The client's progress bar updates straight away.</p>
      <ul className="mt-4 divide-y border-y">{tasks.map(t => <li key={t.id} className="flex items-center gap-3 py-3">
        <input type="checkbox" checked={t.done} aria-label={`Mark "${t.title}" done`} onChange={async () => { await supabase.from("project_tasks").update({ done: !t.done }).eq("id", t.id); reload(); }} className="h-4 w-4 accent-primary" />
        <span className="flex-1">{t.title}</span>
        <button type="button" onClick={async () => { await supabase.from("project_tasks").delete().eq("id", t.id); reload(); }} className="text-sm text-muted-foreground underline">Remove</button></li>)}</ul>
      <form onSubmit={addTask} className="mt-4 flex gap-3"><input name="title" maxLength={200} placeholder="e.g. Design homepage" aria-label="New task" className={inputClass} /><Button type="submit" variant="studio" size="sm">Add task</Button></form>
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
        <span className="w-24 text-sm text-muted-foreground">{i.kind}</span><span className="flex-1">{i.title}</span>
        <button type="button" onClick={async () => { if (i.kind === "wireframe" && i.url) await supabase.storage.from("project-files").remove([i.url]); await supabase.from("project_items").delete().eq("id", i.id); reload(); }} className="text-sm text-muted-foreground underline">Remove</button></li>)}</ul>
    </div>
  </section>;
}
