import { assetSrc } from "@/components/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageIntro, ReviewCta } from "@/components/page";
import { CaseStudy, ProjectReviews } from "@/components/project-story";
import home from "@/assets/daniel-carter/home.png.asset.json";
import about from "@/assets/daniel-carter/about.png.asset.json";
import books from "@/assets/daniel-carter/books.png.asset.json";
import betterChoice from "@/assets/daniel-carter/better-choice.png.asset.json";
import journal from "@/assets/daniel-carter/journal.png.asset.json";
import speaking from "@/assets/daniel-carter/speaking.png.asset.json";
import resources from "@/assets/daniel-carter/resources.png.asset.json";
import contact from "@/assets/daniel-carter/contact.png.asset.json";


const pages = [
  { label: "Homepage", src: assetSrc(home) },
  { label: "About the Author", src: assetSrc(about) },
  { label: "Books", src: assetSrc(books) },
  { label: "The Better Choice", src: assetSrc(betterChoice) },
  { label: "Journal / Blog", src: assetSrc(journal) },
  { label: "Speaking / Media", src: assetSrc(speaking) },
  { label: "Resources / Newsletter", src: assetSrc(resources) },
  { label: "Contact", src: assetSrc(contact) },
];

export const Route = createFileRoute("/projects/daniel-carter")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Daniel Carter author website · TheHeroes Agency · Author Studio" },
    { name: "description", content: "An eight-page author website design for nonfiction author Daniel Carter: home, about, books, book page, journal, speaking, resources, and contact." },
    { property: "og:title", content: "Daniel Carter author website · TheHeroes Agency" },
    { property: "og:description", content: "Scroll through all eight pages of the Daniel Carter author website design." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Project,
});

function Project() {
  const [active, setActive] = useState(0);
  const viewer = useRef<HTMLDivElement>(null);
  useEffect(() => { viewer.current?.scrollTo({ top: 0 }); }, [active]);
  const page = pages[active] ?? pages[0]!;
  return <>
    <div className="mx-auto max-w-[1500px] px-5 pt-10"><Link to="/work" className="text-sm underline underline-offset-4">← Back to selected work</Link></div>
    <PageIntro label="Author website · 8 pages" title="Daniel Carter.">An eight-page author website design. Pick a page, then scroll up and down to see all of it.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-12 md:grid-cols-[220px_1fr]">
      <div role="tablist" aria-label="Website pages" className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
        {pages.map((p, i) => <button key={p.label} role="tab" aria-selected={i === active} aria-controls="dc-viewer" onClick={() => setActive(i)}
          className={`shrink-0 border-l-2 px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${i === active ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          <span className="mr-2 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>{p.label}</button>)}
      </div>
      <div>
        <div className="border-b pb-3">
          <h2 className="text-2xl">{page.label}</h2>
        </div>
        <div id="dc-viewer" ref={viewer} role="tabpanel" tabIndex={0} aria-label={`${page.label} screenshot, scrollable`}
          className="mt-4 h-[70vh] overflow-y-auto overscroll-contain border bg-muted focus-visible:outline-2 focus-visible:outline-ring">
          <img key={page.src} decoding="async" src={page.src} alt={`Daniel Carter website: ${page.label} page`} width={1024} height={1536} className="block h-auto w-full" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Page {active + 1} of {pages.length}. Scroll inside the frame to move through the page.</p>
      </div>
    </div></section>
    <CaseStudy sections={[{"heading": "Overview", "body": "An eight-page author website for Daniel Carter, built to bring his books, ideas, speaking work, and reader resources together in one place."}, {"heading": "The author's goal", "body": "Daniel needed a site that introduced him clearly, gave each book room to be explored, and offered readers, event organisers, and media a direct next step."}, {"heading": "What I built", "body": "A homepage leading with his work, an About the Author page, a Books collection, a dedicated page for The Better Choice, a Journal for his writing, a Speaking / Media page for bookings, a Resources page with newsletter signup, and a Contact page."}]} />
    <ProjectReviews project="daniel-carter" author="Daniel Carter" quote="They did a great job with my author website, and I’m really happy with the result. I’d happily recommend their services to other authors and would definitely work with them again." />
    <ReviewCta />
  </>;
}
