import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, ReviewCta } from "@/components/page";
import { ImagePlaceholder } from "@/components/page";
import danielHome from "@/assets/daniel-carter/home.png.asset.json";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [
    { title: "Selected work — TheHeroes Agency · Author Studio" },
    { name: "description", content: "Explore The Quiet Advantage, a sample author website for a fictional author, and space for future author projects." },
    { property: "og:title", content: "Selected work — TheHeroes Agency · Author Studio" },
    { property: "og:description", content: "Websites and launch assets for authors, starting with a clearly labelled fictional sample project." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Work,
});
function Work() {
  return <>
    <PageIntro label="Work" title="Selected work.">Websites and launch assets I've built for authors.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-x-8 gap-y-14 px-5 py-16 md:grid-cols-2">
      <article><Link to="/projects/daniel-carter" aria-label="View the Daniel Carter author website"><div className="aspect-[4/3] overflow-hidden border bg-muted"><img src={danielHome.url} alt="Daniel Carter author website homepage" className="h-full w-full object-cover object-top" /></div></Link>
        <p className="mt-6 text-sm text-muted-foreground">Author website · 8 pages</p>
        <h2 className="mt-3 text-3xl">Daniel Carter: author website</h2>
        <p className="mt-3 text-muted-foreground">A full website for a nonfiction author, from homepage and books to speaking and newsletter.</p>
        <ul aria-label="Project tags" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><li>Author website</li><li>Book page</li><li>Newsletter</li></ul>
        <Link to="/projects/daniel-carter" className="mt-6 inline-block font-semibold underline underline-offset-4">View project <span aria-hidden="true">↗</span></Link>
      </article>
      <article><Link to="/projects/the-quiet-advantage" aria-label="View The Quiet Advantage sample project"><ImagePlaceholder label="Sample website screenshot" /></Link>
        <p className="mt-6 text-sm text-muted-foreground">Sample project built for a fictional author.</p>
        <h2 className="mt-3 text-3xl">The Quiet Advantage: sample author website</h2>
        <p className="mt-3 text-muted-foreground">A sample platform connecting a nonfiction book with readers and speaking enquiries.</p>
        <ul aria-label="Project tags" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><li>Author website</li><li>Lead capture</li><li>Book page</li></ul>
        <Link to="/projects/the-quiet-advantage" className="mt-6 inline-block font-semibold underline underline-offset-4">View project <span aria-hidden="true">↗</span></Link>
      </article>
      {[1, 2].map(n => <article key={n}><Link to="/contact" hash="review" aria-label={`Request a free review for future project ${n}`}><ImagePlaceholder label="Your project screenshot" /></Link><p className="mt-6 text-sm text-muted-foreground">Future author project</p><h2 className="mt-3 text-3xl">Your project could be here</h2><p className="mt-3 text-muted-foreground">A space for the next author website or book launch.</p><Link to="/contact" hash="review" className="mt-6 inline-block font-semibold underline underline-offset-4">Get my free author site review <span aria-hidden="true">↗</span></Link></article>)}
    </div></section>
    <ReviewCta />
  </>;
}
