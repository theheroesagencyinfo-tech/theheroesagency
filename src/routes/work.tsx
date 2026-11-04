import { assetSrc } from "@/components/site";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProjectRating } from "@/components/project-rating";
import { PageIntro, ReviewCta } from "@/components/page";
import { ImagePlaceholder } from "@/components/page";
import danielHome from "@/assets/daniel-carter/home.png.asset.json";
import eleanorHome from "@/assets/eleanor-whitmore/home.png.asset.json";
import jonathanHome from "@/assets/jonathan-reed/home.png.asset.json";

export const Route = createFileRoute("/work")({
  staticData: { sitemap: true },
  head: () => ({ meta: [
    { title: "Case studies · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Author website case studies for Daniel Carter, Eleanor Whitmore, and Jonathan Reed: the goal, the approach, and the services delivered." },
    { property: "og:title", content: "Case studies · TheHeroes Agency · Author Studio" },
    { property: "og:description", content: "Author website case studies for Daniel Carter, Eleanor Whitmore, and Jonathan Reed." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Work,
});

type CaseStudyCard = {
  slug: "daniel-carter" | "eleanor-whitmore" | "jonathan-reed";
  to: "/projects/daniel-carter" | "/projects/eleanor-whitmore" | "/projects/jonathan-reed";
  image: string;
  imageAlt: string;
  kind: string;
  title: string;
  overview: string;
  objectives: string[];
  services: string[];
};

const caseStudies: CaseStudyCard[] = [
  {
    slug: "daniel-carter",
    to: "/projects/daniel-carter",
    image: assetSrc(danielHome),
    imageAlt: "Daniel Carter author website homepage",
    kind: "Author website · 8 pages",
    title: "Daniel Carter: author website",
    overview: "A full website for a nonfiction author, from homepage and books to speaking and newsletter.",
    objectives: [
      "Introduce the author and his ideas clearly from the first screen",
      "Give each book, including The Better Choice, room to be explored",
      "Offer readers, event organisers, and media a direct next step",
    ],
    services: ["Author website design", "Book pages", "Journal", "Speaking and media page", "Newsletter signup"],
  },
  {
    slug: "eleanor-whitmore",
    to: "/projects/eleanor-whitmore",
    image: assetSrc(eleanorHome),
    imageAlt: "Eleanor Whitmore author website homepage",
    kind: "Author website · 7 pages",
    title: "Eleanor Whitmore: author website",
    overview: "An author website bringing together The Kindness Effect, journal, events, and reader resources.",
    objectives: [
      "Create a gentle, welcoming home for The Kindness Effect",
      "Give readers clear ways to attend events and read the journal",
      "Keep readers in touch through resources and signup",
    ],
    services: ["Author website design", "Book page", "Events page", "Journal", "Reader resources"],
  },
  {
    slug: "jonathan-reed",
    to: "/projects/jonathan-reed",
    image: assetSrc(jonathanHome),
    imageAlt: "Jonathan Reed literary author website homepage",
    kind: "Literary author website · 6 pages",
    title: "Jonathan Reed: author website",
    overview: "A literary author website bringing together books, journal essays, speaking events, and resources for readers.",
    objectives: [
      "Present a growing list of books in one organised place",
      "Share essays and journal writing alongside the books",
      "Make events, speaking, and contact easy to find",
    ],
    services: ["Author website design", "Books page", "Journal", "Events and speaking page", "Reader resources"],
  },
];

function Work() {
  return <>
    <PageIntro label="Work" title="Case studies.">Author websites I've designed and built, with the goal, the approach, and what was delivered for each.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-x-8 gap-y-14 px-5 py-16 md:grid-cols-2">
      {caseStudies.map(study => <article key={study.slug}>
        <Link to={study.to} aria-label={`View the ${study.title} case study`}><div className="aspect-[4/3] overflow-hidden border bg-muted"><img loading="lazy" decoding="async" src={study.image} alt={study.imageAlt} className="h-full w-full object-cover object-top" /></div></Link>
        <p className="mt-6 text-sm text-muted-foreground">{study.kind}</p>
        <h2 className="mt-3 text-3xl">{study.title}</h2>
        <ProjectRating project={study.slug} />
        <p className="mt-3 text-muted-foreground">{study.overview}</p>
        <div className="mt-6 grid gap-6 border-t pt-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Objectives</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{study.objectives.map(objective => <li key={objective} className="flex gap-2"><span aria-hidden className="text-primary">·</span>{objective}</li>)}</ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Services delivered</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">{study.services.map(service => <li key={service} className="flex gap-2"><span aria-hidden className="text-primary">·</span>{service}</li>)}</ul>
          </div>
        </div>
        <Link to={study.to} className="mt-6 inline-block font-semibold underline underline-offset-4">View case study <span aria-hidden="true">↗</span></Link>
      </article>)}
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
