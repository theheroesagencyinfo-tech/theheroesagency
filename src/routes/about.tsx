import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, ImagePlaceholder, ReviewCta } from "@/components/page";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Hero — TheHeroes Author Studio" },
    { name: "description", content: "Meet Hero: author websites, email marketing automation, and AI-powered launch creative, with one point of contact and a clear process." },
    { property: "og:title", content: "About Hero — TheHeroes Author Studio" },
    { property: "og:description", content: "I build the platform behind your book. Learn about my approach to working with nonfiction authors." },
    { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: About,
});
const skills = [
  ["Web design", "Author websites with a clear path from discovering your book to taking the next step."],
  ["Book launch pages", "A focused place for your book, retailer links, and launch message."],
  ["Email marketing automation", "Reader signup flows and welcome sequences in your email tool."],
  ["AI-powered video ads", "Book trailers and short ad clips to support your launch."],
];
const principles = [
  ["One point of contact", "You work directly with me, from the first conversation to launch."],
  ["Clear timelines", "We agree on the scope, review points, and timeline before work begins."],
  ["No jargon", "I explain decisions in plain language, so you know what we're building and why."],
];
function About() {
  return <>
    <PageIntro label="About Hero" title="I build the platform behind your book.">Your book can be the beginning of a relationship, not the end of a sale.</PageIntro>
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr] md:items-start">
      <div className="max-w-[60ch] space-y-6 text-lg text-muted-foreground"><h2 className="text-3xl text-foreground">I'm Hero.</h2><p>I started working with authors because [my reason].</p><p>My background is in web design, email marketing automation, and AI-powered video ads. [Add the experience and projects you'd like readers to know about.]</p><p>I believe a book should start a client relationship, not just make a sale. The platform behind it should make that next conversation easier.</p><p>I work with one point of contact, clear timelines, and no jargon. We agree on what your book needs before we start building.</p></div>
      <div className="w-full max-w-sm md:justify-self-end"><ImagePlaceholder label="Hero's headshot — placeholder" portrait /></div>
    </div></section>
    <section className="border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-4xl">What I bring</h2><div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">{skills.map(([title, text]) => <div key={title} className="border-t pt-5"><h3 className="text-2xl">{title}</h3><p className="mt-3 max-w-[50ch] text-muted-foreground">{text}</p></div>)}</div></div></section>
    <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-4xl">How I work with authors</h2><ol className="mt-10 grid gap-8 md:grid-cols-3">{principles.map(([title, text], i) => <li key={title} className="border-t pt-5"><span className="font-serif text-3xl text-ring">0{i + 1}</span><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-muted-foreground">{text}</p></li>)}</ol></div></section>
    <ReviewCta />
  </>;
}
