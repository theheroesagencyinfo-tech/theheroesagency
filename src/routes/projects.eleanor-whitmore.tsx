import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PageIntro, ReviewCta } from "@/components/page";
import { CaseStudy, ProjectReviews } from "@/components/project-story";
import { Button } from "@/components/ui/button";
import home from "@/assets/eleanor-whitmore/home.png.asset.json";
import about from "@/assets/eleanor-whitmore/about.png.asset.json";
import kindnessEffect from "@/assets/eleanor-whitmore/kindness-effect.png.asset.json";
import events from "@/assets/eleanor-whitmore/events.png.asset.json";
import journal from "@/assets/eleanor-whitmore/journal.png.asset.json";
import resources from "@/assets/eleanor-whitmore/resources.png.asset.json";
import contact from "@/assets/eleanor-whitmore/contact.png.asset.json";

const pages = [
  { label: "Homepage", src: home.url, width: 830, height: 1895 },
  { label: "About the author", src: about.url, width: 1024, height: 1536 },
  { label: "The Kindness Effect", src: kindnessEffect.url, width: 1024, height: 1536 },
  { label: "Events", src: events.url, width: 1024, height: 1536 },
  { label: "Journal", src: journal.url, width: 1024, height: 1536 },
  { label: "Resources", src: resources.url, width: 1024, height: 1536 },
  { label: "Contact", src: contact.url, width: 1024, height: 1536 },
];

export const Route = createFileRoute("/projects/eleanor-whitmore")({
  head: () => ({ meta: [
    { title: "Eleanor Whitmore author website — TheHeroes Agency · Author Studio" },
    { name: "description", content: "Explore seven pages of Eleanor Whitmore’s author website design, including The Kindness Effect, events, journal, resources, and contact." },
    { property: "og:title", content: "Eleanor Whitmore author website — TheHeroes Agency" },
    { property: "og:description", content: "A seven-page author website showcase featuring Eleanor Whitmore’s books, writing, events, and reader resources." },
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
    <PageIntro label="Author website · 7 pages" title="Eleanor Whitmore.">An author website design bringing together The Kindness Effect, Eleanor’s writing, events, and resources for readers.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[220px_minmax(0,1fr)]">
      <div role="tablist" aria-label="Website pages" className="flex min-w-0 gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
        {pages.map((p, index) => <Button
          key={p.label}
          id={`ew-tab-${index}`}
          role="tab"
          variant="ghost"
          aria-selected={index === active}
          aria-controls="ew-viewer"
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
            document.getElementById(`ew-tab-${next}`)?.focus();
          }}
          className={`h-auto shrink-0 justify-start rounded-none border-l-2 px-3 py-2 text-left text-sm md:whitespace-normal ${index === active ? "border-primary font-semibold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        ><span className="text-xs tabular-nums">{String(index + 1).padStart(2, "0")}</span>{p.label}</Button>)}
      </div>
      <div className="min-w-0">
        <div className="border-b pb-3"><h2 className="text-2xl">{page.label}</h2></div>
        <div id="ew-viewer" ref={viewer} role="tabpanel" tabIndex={0} aria-labelledby={`ew-tab-${active}`}
          className="mt-4 h-[70vh] overflow-y-auto overscroll-contain border bg-muted focus-visible:outline-2 focus-visible:outline-ring">
          <img key={page.src} src={page.src} alt={`Eleanor Whitmore website: ${page.label} page`} width={page.width} height={page.height} className="block h-auto w-full" />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Page {active + 1} of {pages.length}</p>
      </div>
    </div></section>
    <CaseStudy sections={[{"heading": "Overview", "body": "A seven-page author website for Eleanor Whitmore with a warm cream palette, olive accents, and botanical line art that reflects the calm tone of her writing."}, {"heading": "The author's goal", "body": "Eleanor wanted a gentle, welcoming home for her book The Kindness Effect, with clear ways for readers to attend events, read her journal, and stay in touch."}, {"heading": "What I built", "body": "A homepage, an author bio, a book page for The Kindness Effect, an Events page, a Journal, a Resources page for readers, and a Contact page."}]} />
    <ProjectReviews project="eleanor-whitmore" author="Eleanor Whitmore" quote="The whole process was straightforward, and communication was great throughout. Everything was delivered on time, and I’m very happy with how the website turned out." />
    <ReviewCta />
  </>;
}