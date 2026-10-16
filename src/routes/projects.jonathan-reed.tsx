import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageIntro, ReviewCta } from "@/components/page";
import { CaseStudy, ProjectReviews } from "@/components/project-story";
import { Button } from "@/components/ui/button";
import home from "@/assets/jonathan-reed/home.png.asset.json";
import books from "@/assets/jonathan-reed/books.png.asset.json";
import journal from "@/assets/jonathan-reed/journal.png.asset.json";
import events from "@/assets/jonathan-reed/events.png.asset.json";
import resources from "@/assets/jonathan-reed/resources.png.asset.json";
import contact from "@/assets/jonathan-reed/contact.png.asset.json";

const pages = [
  { label: "Homepage", src: home.url, width: 1024, height: 1536 },
  { label: "Books", src: books.url, width: 1024, height: 1536 },
  { label: "Journal / Essays", src: journal.url, width: 1024, height: 1536 },
  { label: "Events / Speaking", src: events.url, width: 1024, height: 1536 },
  { label: "Resources", src: resources.url, width: 793, height: 1983 },
  { label: "Contact", src: contact.url, width: 1024, height: 1536 },
];

export const Route = createFileRoute("/projects/jonathan-reed")({
  head: () => ({ meta: [
    { title: "Jonathan Reed author website · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Explore six pages of Jonathan Reed’s literary author website design, including books, journal essays, events, reader resources, and contact." },
    { property: "og:title", content: "Jonathan Reed author website · TheHeroes Agency" },
    { property: "og:description", content: "A six-page literary author website showcase featuring Jonathan Reed’s books, essays, events, and reader resources." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Project,
});

function Project() {
  const [active, setActive] = useState(0);
  const viewer = useRef<HTMLDivElement>(null);
  const page = pages[active];
  if (!page) return null;

  function selectPage(index: number) {
    setActive(index);
    viewer.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  return <>
    <div className="mx-auto max-w-6xl px-5 pt-10"><Link to="/work" className="text-sm underline underline-offset-4">← Back to selected work</Link></div>
    <PageIntro label="Author website · 6 pages" title="Jonathan Reed.">A literary author website design bringing together Jonathan’s books, journal essays, speaking events, and resources for readers.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[220px_minmax(0,1fr)]">
      <div role="tablist" aria-label="Website pages" className="flex min-w-0 gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
        {pages.map((p, index) => <Button
          key={p.label}
          id={`jr-tab-${index}`}
          role="tab"
          variant="ghost"
          aria-selected={index === active}
          aria-controls="jr-viewer"
          tabIndex={index === active ? 0 : -1}
          onClick={() => selectPage(index)}
          onKeyDown={event => {
            const directions: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
            let next: number;
            if (event.key === "Home") next = 0;
            else if (event.key === "End") next = pages.length - 1;
            else {
              const direction = directions[event.key];
              if (direction === undefined) return;
              next = (index + direction + pages.length) % pages.length;
            }
            event.preventDefault();
            selectPage(next);
            document.getElementById(`jr-tab-${next}`)?.focus();
          }}
          className={`h-auto shrink-0 justify-start rounded-none border-l-2 px-3 py-2 text-left text-sm md:whitespace-normal ${index === active ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        ><span className="text-xs tabular-nums">{String(index + 1).padStart(2, "0")}</span>{p.label}</Button>)}
      </div>
      <div className="min-w-0">
        <div className="border-b pb-3"><h2 className="text-2xl">{page.label}</h2></div>
        <div id="jr-viewer" ref={viewer} role="tabpanel" tabIndex={0} aria-labelledby={`jr-tab-${active}`}
          className="mt-4 h-[55vh] overflow-y-auto overscroll-contain border bg-muted focus-visible:outline-2 focus-visible:outline-ring md:h-[70vh]">
          <img key={page.src} src={page.src} alt={`Jonathan Reed website: ${page.label} page`} width={page.width} height={page.height} className="block h-auto w-full" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Page {active + 1} of {pages.length}</p>
      </div>
    </div></section>
    <CaseStudy sections={[{"heading": "Overview", "body": "A six-page literary author website for Jonathan Reed, designed in rich burgundy and cream to suit the reflective character of his books."}, {"heading": "The author's goal", "body": "Jonathan needed a professional site that presented his growing list of books, shared his essays, and made it easy to find his events and get in touch."}, {"heading": "What I built", "body": "A homepage, a Books page presenting his titles, a Journal for essays, an Events / Speaking page, a Resources page for readers, and a Contact page."}]} />
    <ProjectReviews project="jonathan-reed" author="Jonathan Reed" quote="I’m really pleased with how my website turned out. It feels professional, fits my work as an author, and presents my books exactly how I wanted." />
    <ReviewCta />
  </>;
}