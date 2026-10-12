import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, ReviewCta } from "@/components/page";
import { StudioImage } from "@/components/studio-image";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [
    { title: "Selected work — TheHeroes Author Studio" },
    { name: "description", content: "Explore The Quiet Advantage, a sample author website for a fictional author, and space for future author projects." },
    { property: "og:title", content: "Selected work — TheHeroes Author Studio" },
    { property: "og:description", content: "Websites and launch assets for authors, starting with a clearly labelled fictional sample project." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Work,
});
function Work() {
  return <>
    <PageIntro label="Work" title="Selected work.">Websites and launch assets I've built for authors.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-x-8 gap-y-14 px-5 py-16 md:grid-cols-2">
      <article><Link to="/projects/the-quiet-advantage" aria-label="View The Quiet Advantage sample project"><StudioImage image="website" eager /></Link>
        <p className="mt-6 text-sm text-muted-foreground">Sample project built for a fictional author.</p>
        <p className="mt-2 text-sm text-muted-foreground">Illustrative website concept.</p>
        <h2 className="mt-3 text-3xl">The Quiet Advantage: sample author website</h2>
        <p className="mt-3 text-muted-foreground">A sample platform connecting a nonfiction book with readers and speaking enquiries.</p>
        <ul aria-label="Project tags" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><li>Author website</li><li>Lead capture</li><li>Book page</li></ul>
        <Link to="/projects/the-quiet-advantage" className="mt-6 inline-block font-semibold underline underline-offset-4">View project <span aria-hidden="true">↗</span></Link>
      </article>
      {[1, 2].map(n => <article key={n}><Link to="/contact" hash="review" aria-label={`Request a free review for future project ${n}`}><StudioImage image={n === 1 ? "email" : "launch"} /></Link><p className="mt-6 text-sm text-muted-foreground">Future author project · illustrative image</p><h2 className="mt-3 text-3xl">Your project could be here</h2><p className="mt-3 text-muted-foreground">A space for the next author website or book launch.</p><Link to="/contact" hash="review" className="mt-6 inline-block font-semibold underline underline-offset-4">Get my free author site review <span aria-hidden="true">↗</span></Link></article>)}
    </div></section>
    <ReviewCta />
  </>;
}
