import { PortalMark } from "@/components/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packages, progressOf } from "@/lib/packages";
import { invoiceReady, loadProject } from "@/lib/client-projects";
import { ProgressBar } from "@/components/progress-bar";
import { CoverUpload, ProjectMessages, ProjectWorkspace } from "@/components/project-workspace";

export const Route = createFileRoute("/_authenticated/my-projects/$id")({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: "Project dashboard · TheHeroes Agency" },
    { name: "description", content: "Live pages, wireframes, and updates for your author platform project." },
    { property: "og:title", content: "Project dashboard · TheHeroes Agency" },
    { property: "og:description", content: "Client project dashboard for TheHeroes Agency." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Dashboard,
});

function Dashboard() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Awaited<ReturnType<typeof loadProject>> | null>(null);
  const reload = () => loadProject(id).then(setP);
  useEffect(() => { reload(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!p) return <p className="mx-auto max-w-[1500px] px-5 py-20 text-muted-foreground">Loading…</p>;
  if (!p.order) return <section className="mx-auto max-w-[1500px] px-5 py-20"><h1 className="text-4xl">Project not found</h1><Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/account">Back to my projects</Link></Button></section>;
  const { order, tasks, items } = p;
  const nextTask = tasks.find(t => !t.done);
  const pages = items.filter(i => i.kind === "page"), wires = items.filter(i => i.kind === "wireframe"), updates = items.filter(i => i.kind === "update");

  return <div className="portal">
    <section className="mx-auto grid max-w-[1500px] gap-8 px-5 pb-10 pt-10 md:grid-cols-[220px_1fr] md:items-start">
      <div className="order-2 md:order-1"><CoverUpload order={order} onChange={reload} /></div>
      <div className="order-1 min-w-0 md:order-2">
      <div className="flex flex-wrap items-center justify-between gap-4"><Link to="/" aria-label="TheHeroes Agency home"><PortalMark dark={false} /></Link><Link to="/account" className="text-sm underline underline-offset-4">← Back to my projects</Link></div>
      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">{packages.find(x => x.slug === order.package)?.name}</p>
      <h1 className="mt-3 max-w-[18ch] break-words text-4xl leading-[1.02] sm:text-6xl">{order.book}</h1>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground"><span>Status <strong className="font-medium capitalize text-foreground">{order.status}</strong></span><span>{tasks.filter(t => t.done).length} of {tasks.length} tasks done</span>{nextTask && <span>Up next <strong className="font-medium text-foreground">{nextTask.title}</strong></span>}</div>
      <div className="mt-8 max-w-xl"><ProgressBar value={progressOf(tasks)} /></div>
      {invoiceReady(order) && <Button asChild variant="studioOutline" size="studio" className="mt-6"><Link to="/invoice/$id" params={{ id: order.id }}>View and download invoice</Link></Button>}
      </div>
    </section>

    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-12 xl:grid-cols-[1.5fr_1fr]">
      <ProjectWorkspace orderId={order.id} />
      <ProjectMessages orderId={order.id} />
    </div></section>

    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-14 md:grid-cols-[1fr_1.4fr]">
      <div><h2 className="text-3xl">Progress tracker</h2><p className="mt-2 text-muted-foreground">Milestones Mou ticks off as your project moves forward.</p><div className="mt-5"><ProgressBar value={progressOf(tasks)} /></div></div>
      {tasks.length === 0 ? <p className="text-muted-foreground">Your task list will appear here once work is scheduled.</p>
      : <ul className="divide-y border-y">{tasks.map(t => <li key={t.id} className="flex items-center gap-3 py-3">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${t.done ? "border-primary bg-primary text-primary-foreground" : ""}`}>{t.done && <Check aria-hidden className="h-3 w-3" />}</span>
          <span className={t.done ? "" : "text-muted-foreground"}>{t.title}</span><span className="sr-only">{t.done ? "done" : "to do"}</span></li>)}</ul>}
    </div></section>

    {pages.length > 0 &&     <section className="border-t bg-secondary"><div className="mx-auto max-w-[1500px] px-5 py-14">
      <h2 className="text-3xl">Live pages</h2>
      {pages.length === 0 ? <p className="mt-4 text-muted-foreground">Links to your pages will appear here as they go live.</p>
      : <ul className="mt-6 divide-y border-y">{pages.map(i => <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><span className="min-w-0"><span className="block font-serif text-xl">{i.title}</span>{i.url && <span className="block break-all text-sm text-muted-foreground">{i.url}</span>}</span>{i.url && <a href={i.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Visit page ↗</a>}</li>)}</ul>}
    </div></section>}

    {wires.length > 0 &&     <section className="border-t"><div className="mx-auto max-w-[1500px] px-5 py-14">
      <h2 className="text-3xl">Design previews</h2>
      {wires.length === 0 ? <p className="mt-4 text-muted-foreground">Wireframes will appear here for your review.</p>
      : <div className="mt-6 grid gap-8 md:grid-cols-2">{wires.map(i => <figure key={i.id}>
          {i.src && <a href={i.src} target="_blank" rel="noopener noreferrer"><img src={i.src} alt={i.title} className="w-full border" loading="lazy" /></a>}
          <figcaption className="mt-3"><span className="font-semibold">{i.title}</span>{i.body && <span className="mt-1 block text-sm text-muted-foreground">{i.body}</span>}</figcaption></figure>)}</div>}
    </div></section>}

    {updates.length > 0 &&     <section className="border-t bg-secondary"><div className="mx-auto max-w-[1500px] px-5 py-14">
      <h2 className="text-3xl">Studio updates</h2>
      {updates.length === 0 ? <p className="mt-4 text-muted-foreground">Project updates will be posted here.</p>
      : <ol className="mt-6 border-l pl-6">{updates.map(i => <li key={i.id} className="relative py-5 before:absolute before:-left-[29px] before:top-7 before:h-2 before:w-2 before:rounded-full before:bg-primary"><p className="text-sm text-muted-foreground">{new Date(i.created_at).toLocaleDateString()}</p><h3 className="mt-1 text-xl">{i.title}</h3>{i.body && <p className="mt-2 max-w-[70ch] whitespace-pre-wrap">{i.body}</p>}</li>)}</ol>}
    </div></section>}
  </div>;
}
