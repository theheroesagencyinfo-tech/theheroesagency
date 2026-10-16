import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packages, progressOf } from "@/lib/packages";
import { invoiceReady, loadProject } from "@/lib/client-projects";
import { ProgressBar } from "@/components/progress-bar";

export const Route = createFileRoute("/_authenticated/my-projects/$id")({
  head: () => ({ meta: [
    { title: "Project dashboard — TheHeroes Agency" },
    { name: "description", content: "Live pages, wireframes, and updates for your author platform project." },
    { property: "og:title", content: "Project dashboard — TheHeroes Agency" },
    { property: "og:description", content: "Client project dashboard for TheHeroes Agency." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Awaited<ReturnType<typeof loadProject>> | null>(null);
  useEffect(() => { loadProject(id).then(setP); }, [id]);
  if (!p) return <p className="mx-auto max-w-6xl px-5 py-20 text-muted-foreground">Loading…</p>;
  if (!p.order) return <section className="mx-auto max-w-6xl px-5 py-20"><h1 className="text-4xl">Project not found</h1><Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/account">Back to my projects</Link></Button></section>;
  const { order, tasks, items } = p;
  const pages = items.filter(i => i.kind === "page"), wires = items.filter(i => i.kind === "wireframe"), updates = items.filter(i => i.kind === "update");

  return <>
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-16">
      <Link to="/account" className="text-sm underline underline-offset-4">← My projects</Link>
      <p className="mt-6 text-sm font-semibold text-muted-foreground">{packages.find(x => x.slug === order.package)?.name}</p>
      <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">{order.book}</h1>
      <div className="mt-8 max-w-xl"><ProgressBar value={progressOf(tasks)} /></div>
      {invoiceReady(order) && <Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/invoice/$id" params={{ id: order.id }}>View and download invoice</Link></Button>}
    </section>

    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.4fr]">
      <h2 className="text-3xl">Tasks</h2>
      {tasks.length === 0 ? <p className="text-muted-foreground">Your task list will appear here once work is scheduled.</p>
      : <ul className="divide-y border-y">{tasks.map(t => <li key={t.id} className="flex items-center gap-3 py-3">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${t.done ? "border-primary bg-primary text-primary-foreground" : ""}`}>{t.done && <Check aria-hidden className="h-3 w-3" />}</span>
          <span className={t.done ? "" : "text-muted-foreground"}>{t.title}</span><span className="sr-only">{t.done ? "done" : "to do"}</span></li>)}</ul>}
    </div></section>

    <section className="border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-14">
      <h2 className="text-3xl">Live pages</h2>
      {pages.length === 0 ? <p className="mt-4 text-muted-foreground">Links to your pages will appear here as they go live.</p>
      : <ul className="mt-6 divide-y border-y">{pages.map(i => <li key={i.id} className="flex flex-wrap justify-between gap-3 py-4"><span>{i.title}</span>{i.url && <a href={i.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open page ↗</a>}</li>)}</ul>}
    </div></section>

    <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-14">
      <h2 className="text-3xl">Wireframes</h2>
      {wires.length === 0 ? <p className="mt-4 text-muted-foreground">Wireframes will appear here for your review.</p>
      : <div className="mt-6 grid gap-8 md:grid-cols-2">{wires.map(i => <figure key={i.id}>
          {i.src && <a href={i.src} target="_blank" rel="noopener noreferrer"><img src={i.src} alt={i.title} className="w-full border" loading="lazy" /></a>}
          <figcaption className="mt-3"><span className="font-semibold">{i.title}</span>{i.body && <span className="mt-1 block text-sm text-muted-foreground">{i.body}</span>}</figcaption></figure>)}</div>}
    </div></section>

    <section className="border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-14">
      <h2 className="text-3xl">Updates</h2>
      {updates.length === 0 ? <p className="mt-4 text-muted-foreground">Project updates will be posted here.</p>
      : <ol className="mt-6 divide-y border-y">{updates.map(i => <li key={i.id} className="py-5"><p className="text-sm text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</p><h3 className="mt-1 text-xl">{i.title}</h3>{i.body && <p className="mt-2 max-w-[70ch] whitespace-pre-wrap">{i.body}</p>}</li>)}</ol>}
    </div></section>
  </>;
}
