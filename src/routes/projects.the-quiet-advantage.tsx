import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, ReviewCta, ImagePlaceholder } from "@/components/page";
export const Route = createFileRoute("/projects/the-quiet-advantage")({
  head: () => ({ meta: [
    { title: "The Quiet Advantage — Sample project | TheHeroes Author Studio" },
    { name: "description", content: "A fictional author website sample: project overview, reader journey, planned pages and features, and illustrative creative concepts." },
    { property: "og:title", content: "The Quiet Advantage — TheHeroes Author Studio" },
    { property: "og:description", content: "A sample author website for a fictional author, with no invented client results." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Project,
});
// Add verified results here when available. No result section is rendered without them.
const result: { value: string; context: string } | undefined = undefined;
const sections = [
  { heading: "Overview", body: "The Quiet Advantage is a sample project built for a fictional nonfiction author. It explores how a book, an author biography, and a reader signup can sit together on one clear website." },
  { heading: "The author's problem", body: "The sample brief: give a reader somewhere to discover the book, understand the author's expertise, and take a next step beyond a retailer link. This is a fictional scenario, not a client claim." },
  { heading: "What I built", body: "A home page that leads with the book's promise, a book page with retailer links, a free chapter signup, and a speaker page. Calm typography and one accent color keep the focus on the author's ideas." },
];
function Project() {
  return <><div className="mx-auto max-w-6xl px-5 pt-10"><Link to="/work" className="text-sm underline underline-offset-4">← Back to selected work</Link></div>
    <PageIntro label="Sample project · fictional author" title="The Quiet Advantage.">A sample author website. Not a client project.</PageIntro>
    <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-16"><ImagePlaceholder label="Sample website screenshot" /></div></section>
    {sections.map(s => <section key={s.heading} className="border-t"><div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-[1fr_1.4fr]"><h2 className="text-3xl sm:text-4xl">{s.heading}</h2><p className="max-w-[60ch] text-lg text-muted-foreground">{s.body}</p></div></section>)}
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-[1fr_1.4fr]"><h2 className="text-3xl sm:text-4xl">Pages and features</h2><div><p className="text-sm text-muted-foreground">Sample project scope</p><ul className="mt-4 divide-y border-y">{["Home and author about pages", "Book page with retailer links", "Media and speaking enquiries", "Free chapter signup and lead capture", "Mobile-ready layouts and basic SEO"].map(item => <li key={item} className="py-3">{item}</li>)}</ul></div></div></section>
    <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-4xl">Screenshot gallery</h2><div className="mt-10 grid gap-8 md:grid-cols-2"><figure><ImagePlaceholder label="Sample screenshot" /><figcaption className="mt-3 text-sm text-muted-foreground">Sample project page</figcaption></figure><figure><ImagePlaceholder label="Sample screenshot" /><figcaption className="mt-3 text-sm text-muted-foreground">Sample project page</figcaption></figure></div></div></section>
    {result && <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-4xl">Result</h2><p>{result.value}</p><p>{result.context}</p></div></section>}
    <ReviewCta />
  </>;
}
