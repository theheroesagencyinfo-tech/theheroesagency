import { assetSrc } from "@/components/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectRating } from "@/components/project-rating";
import { PageIntro, ReviewCta } from "@/components/page";
import { ImagePlaceholder } from "@/components/page";
import danielHome from "@/assets/daniel-carter/home.png.asset.json";
import eleanorHome from "@/assets/eleanor-whitmore/home.png.asset.json";
import jonathanHome from "@/assets/jonathan-reed/home.png.asset.json";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [
    { title: "Selected work · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Explore author website designs for Daniel Carter, Eleanor Whitmore, and Jonathan Reed." },
    { property: "og:title", content: "Selected work · TheHeroes Agency · Author Studio" },
    { property: "og:description", content: "Author website showcases for Daniel Carter, Eleanor Whitmore, and Jonathan Reed." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Work,
});
function Work() {
  return <>
    <PageIntro label="Work" title="Selected work.">Websites and launch assets I've built for authors.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-x-8 gap-y-14 px-5 py-16 md:grid-cols-2">
      <article><Link to="/projects/daniel-carter" aria-label="View the Daniel Carter author website"><div className="aspect-[4/3] overflow-hidden border bg-muted"><img src={assetSrc(danielHome)} alt="Daniel Carter author website homepage" className="h-full w-full object-cover object-top" /></div></Link>
        <p className="mt-6 text-sm text-muted-foreground">Author website · 8 pages</p>
        <h2 className="mt-3 text-3xl">Daniel Carter: author website</h2>
        <ProjectRating project="daniel-carter" />
        <p className="mt-3 text-muted-foreground">A full website for a nonfiction author, from homepage and books to speaking and newsletter.</p>
        <ul aria-label="Project tags" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><li>Author website</li><li>Book page</li><li>Newsletter</li></ul>
        <Link to="/projects/daniel-carter" className="mt-6 inline-block font-semibold underline underline-offset-4">View project <span aria-hidden="true">↗</span></Link>
      </article>
      <article><Link to="/projects/eleanor-whitmore" aria-label="View the Eleanor Whitmore author website"><div className="aspect-[4/3] overflow-hidden border bg-muted"><img src={assetSrc(eleanorHome)} alt="Eleanor Whitmore author website homepage" width={830} height={1895} className="h-full w-full object-cover object-top" /></div></Link>
        <p className="mt-6 text-sm text-muted-foreground">Author website · 7 pages</p>
        <h2 className="mt-3 text-3xl">Eleanor Whitmore: author website</h2>
        <ProjectRating project="eleanor-whitmore" />
        <p className="mt-3 text-muted-foreground">An author website bringing together The Kindness Effect, journal, events, and reader resources.</p>
        <ul aria-label="Project tags" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><li>Author website</li><li>Book page</li><li>Reader resources</li></ul>
        <Link to="/projects/eleanor-whitmore" className="mt-6 inline-block font-semibold underline underline-offset-4">View project <span aria-hidden="true">↗</span></Link>
      </article>
      <article><Link to="/projects/jonathan-reed" aria-label="View the Jonathan Reed author website"><div className="aspect-[4/3] overflow-hidden border bg-muted"><img src={assetSrc(jonathanHome)} alt="Jonathan Reed literary author website homepage" width={1024} height={1536} className="h-full w-full object-cover object-top" /></div></Link>
        <p className="mt-6 text-sm text-muted-foreground">Literary author website · 6 pages</p>
        <h2 className="mt-3 text-3xl">Jonathan Reed: author website</h2>
        <ProjectRating project="jonathan-reed" />
        <p className="mt-3 text-muted-foreground">A literary author website bringing together books, journal essays, speaking events, and resources for readers.</p>
        <ul aria-label="Project tags" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><li>Author website</li><li>Books</li><li>Reader resources</li></ul>
        <Link to="/projects/jonathan-reed" className="mt-6 inline-block font-semibold underline underline-offset-4">View project <span aria-hidden="true">↗</span></Link>
      </article>
      <article>
        <Link to="/contact" hash="review" aria-label="Request a free review for your author website"><ImagePlaceholder label="Your project screenshot" /></Link>
        <p className="mt-6 text-sm text-muted-foreground">Future author project</p>
        <h2 className="mt-3 text-3xl">Your project could be here</h2>
        <p className="mt-3 text-muted-foreground">A space for the next author website or book launch.</p>
        <Link to="/contact" hash="review" className="mt-6 inline-block font-semibold underline underline-offset-4">Get my free author site review <span aria-hidden="true">↗</span></Link>
      </article>
    </div></section>
    <ReviewCta />
  </>;
}
