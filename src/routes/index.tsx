import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn } from "@/components/site";
import { ReviewForm } from "@/components/ReviewForm";
import { ImagePlaceholder } from "@/components/page";
import { ReaderJourney, ReviewPreview } from "@/components/conversion";
import { ParallaxBuildItem } from "@/components/parallax-numeral";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TheHeroes Author Studio — Websites and funnels for nonfiction authors" },
      {
        name: "description",
        content:
          "Author websites, email funnels, and launch kits that turn readers into leads, subscribers, and speaking invitations. Get a free author site review.",
      },
      { property: "og:title", content: "TheHeroes Author Studio" },
      { property: "og:description", content: "Your book should bring you clients, not just sales." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const toc = [
  { n: "I", title: "Author website", tag: "Credibility", line: "A site that makes you look like the expert your book says you are." },
  { n: "II", title: "Email funnel", tag: "Leads", line: "A reader magnet and welcome sequence that turns buyers into a list you own." },
  { n: "III", title: "Launch kit", tag: "Momentum", line: "Pages, emails, and ads that give your launch a real first week." },
];

const why = [
  { h: "Most readers never contact you", p: "They finish the book and move on. Without a next step, the relationship ends at the last page." },
  { h: "Royalties are the small prize", p: "The real value is the client, the workshop, the keynote. Your book is the opening move." },
  { h: "Your site has to close the loop", p: "A clear path from reader to subscriber to conversation is what turns attention into income." },
];

const steps = [
  { h: "Send your details", p: "Your name, your book, and your website if you have one. Takes a minute." },
  { h: "I review your site", p: "I look at it the way a reader would and note what's costing you leads." },
  { h: "You decide what's next", p: "You get my notes by email. Use them yourself, or ask me to help." },
];

function SectionLabel({ children }: { children: string }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{children}</p>;
}

function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:pt-28">
        <div className="rise max-w-3xl">
          <SectionLabel>For coaches, consultants, speakers, and experts</SectionLabel>
          <h1 className="mt-6 text-5xl leading-[1.05] sm:text-7xl">
            Your book should bring you clients, <em className="text-ring">not just sales.</em>
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg text-muted-foreground sm:text-xl">
            I build websites and launch funnels for nonfiction authors, so readers turn into leads, subscribers, and speaking invitations.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#review"><Btn>Get my free author site review</Btn></a>
            <a href="#work"><Btn variant="ghost">See my work</Btn></a>
          </div>
        </div>
      </section>

      <section aria-labelledby="build" className="relative border-t">
        <div className="mx-auto grid max-w-6xl gap-6 bg-background px-5 py-8 motion-safe:sticky motion-safe:top-20 md:grid-cols-[1fr_2fr] md:gap-10 md:py-12 md:motion-safe:top-24">
          <div>
            <SectionLabel>Contents</SectionLabel>
            <h2 id="build" className="mt-4 text-4xl">What I build</h2>
          </div>
          <ol className="grid gap-4 md:gap-6">
            {toc.map((t, index) => (
              <ParallaxBuildItem key={t.n} index={index}>
                <div className="flex items-baseline font-serif text-2xl sm:text-3xl">
                  <span className="mr-4 inline-block w-8 shrink-0 text-xl text-foreground">{t.n}</span>
                  <span>{t.title}</span>
                  <span className="leader" aria-hidden />
                  <span className="text-base italic text-muted-foreground sm:text-lg">{t.tag}</span>
                </div>
                <p className="ml-12 mt-2 max-w-[60ch] text-muted-foreground">{t.line}</p>
              </ParallaxBuildItem>
            ))}
          </ol>
        </div>
        <div aria-hidden="true" className="motion-safe:h-[140px]" />
      </section>

      <section aria-labelledby="why" className="border-t bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionLabel>Why authors need this</SectionLabel>
          <h2 id="why" className="mt-4 max-w-[22ch] text-4xl">Your book is the start of the funnel, not the end.</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {why.map((w, i) => (
              <div key={w.h} className="border-t border-foreground/20 pt-6">
                <span className="font-serif text-sm italic text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-2 text-2xl">{w.h}</h3>
                <p className="mt-3 text-muted-foreground">{w.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="work" aria-labelledby="work-h" className="scroll-mt-24 border-t">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionLabel>Selected work</SectionLabel>
          <h2 id="work-h" className="mt-4 text-4xl">Recent pages</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-lg border bg-card p-8">
              <ImagePlaceholder label="Sample website screenshot" className="mb-8" />
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Sample project · fictional author</p>
              <h3 className="mt-2 text-2xl">A sample author website</h3>
              <p className="mt-2 max-w-[55ch] text-muted-foreground">
                A portfolio piece built for a fictional nonfiction author: homepage, book page, reader magnet, and speaking enquiries.
              </p>
               <Link to="/projects/the-quiet-advantage" className="mt-6 self-start"><Btn variant="ghost">View sample project</Btn></Link>
            </article>
            <article className="flex flex-col justify-center rounded-lg border-2 border-dashed p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Open slot</p>
              <h3 className="mt-2 text-2xl">Your book could be here</h3>
              <p className="mt-2 max-w-[50ch] text-muted-foreground">Reserved for the next author I work with.</p>
              <Link to="/work" className="mt-6 self-start text-sm underline underline-offset-4">All work</Link>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="border-t">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionLabel>How it works</SectionLabel>
          <h2 id="how" className="mt-4 text-4xl">Three steps, no pressure</h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.h}>
                <span className="font-serif text-5xl text-ring">{i + 1}</span>
                <h3 className="mt-3 text-2xl">{s.h}</h3>
                <p className="mt-2 text-muted-foreground">{s.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReaderJourney secondary />
      <ReviewPreview />

      <section id="review" aria-labelledby="review-h" className="scroll-mt-24 border-t bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <SectionLabel>Free author site review</SectionLabel>
            <h2 id="review-h" className="mt-4 max-w-[18ch] text-4xl sm:text-5xl">Find out what your site is costing you.</h2>
            <p className="mt-6 max-w-[55ch] text-muted-foreground">
              Tell me about your book. I'll review your author site and send you clear, practical notes on how to turn more readers into leads.
            </p>
          </div>
          <ReviewForm />
        </div>
      </section>
    </>
  );
}
