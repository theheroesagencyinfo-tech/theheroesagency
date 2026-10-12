import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn } from "@/components/site";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — TheHeroes Author Studio" },
      { name: "description", content: "Author websites and funnels built by TheHeroes Author Studio, including a sample site for a fictional nonfiction author." },
      { property: "og:title", content: "Work — TheHeroes Author Studio" },
      { property: "og:description", content: "Author websites and funnels for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: Work,
});

function Mock() {
  return (
    <div aria-hidden className="mb-6 aspect-[16/10] rounded-md border bg-background p-6">
      <div className="h-2 w-16 rounded bg-accent" />
      <div className="mt-6 h-5 w-3/4 rounded bg-foreground/80" />
      <div className="mt-3 h-5 w-1/2 rounded bg-foreground/80" />
      <div className="mt-6 h-2 w-2/3 rounded bg-muted-foreground/40" />
      <div className="mt-2 h-2 w-1/2 rounded bg-muted-foreground/40" />
      <div className="mt-6 h-8 w-32 rounded bg-primary" />
    </div>
  );
}

function Work() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Work</p>
        <h1 className="mt-6 max-w-[20ch] text-5xl leading-[1.05] sm:text-6xl">Sites built for authors.</h1>
        <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
          The studio is new, so this page starts honest: one sample project, with room for the authors who come next.
        </p>
      </section>
      <section className="border-t">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-2 lg:grid-cols-3">
          <article className="flex flex-col rounded-lg border bg-card p-6">
            <Mock />
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sample project · fictional author</p>
            <h2 className="mt-2 text-2xl">A sample author website</h2>
            <p className="mt-2 text-muted-foreground">Homepage, book page, reader magnet, and speaking enquiries for a fictional nonfiction author.</p>
            <a href="#" className="mt-6 self-start"><Btn variant="ghost">View sample site</Btn></a>
          </article>
          {[1, 2].map((i) => (
            <article key={i} className="flex flex-col justify-center rounded-lg border-2 border-dashed p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Open slot</p>
              <h2 className="mt-2 text-2xl">Your book could be here</h2>
              <p className="mt-2 text-muted-foreground">Reserved for future client work.</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="max-w-[24ch] text-3xl">Want to see what I'd change on your site?</h2>
          <Link to="/contact" className="mt-6 inline-block"><Btn>Get my free author site review</Btn></Link>
        </div>
      </section>
    </>
  );
}
