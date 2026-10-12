import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn } from "@/components/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Hero — TheHeroes Author Studio" },
      { name: "description", content: "Hero runs TheHeroes Author Studio, building websites, email funnels, and launch campaigns for nonfiction authors." },
      { property: "og:title", content: "About Hero — TheHeroes Author Studio" },
      { property: "og:description", content: "Who Hero is and why he works with nonfiction authors." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const skills = [
  { h: "Web design", p: "Clean, fast sites built around one goal: getting the right visitor to take the next step." },
  { h: "Shopify", p: "Stores for selling books, workbooks, courses, and merch directly to readers." },
  { h: "Email automation", p: "Sign-up flows and sequences that keep working after you've moved on to the next thing." },
  { h: "AI video ads", p: "Short video ads for launches, made quickly and without a film crew." },
];

function About() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-20 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">About</p>
          <h1 className="mt-6 max-w-[18ch] text-5xl leading-[1.05] sm:text-6xl">Hi, I'm Hero.</h1>
          <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
            I run TheHeroes Author Studio on my own. When you work with me, you talk to the person who builds your site, writes your emails, and answers your questions.
          </p>
        </div>
        <div role="img" aria-label="Headshot of Hero (placeholder)" className="flex aspect-[4/5] w-full max-w-xs items-center justify-center rounded-lg border-2 border-dashed bg-secondary text-sm text-muted-foreground">
          Headshot coming soon
        </div>
      </section>
      <section className="border-t">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_2fr]">
          <h2 className="text-4xl">Why authors</h2>
          <div className="max-w-[62ch] space-y-5 text-muted-foreground">
            <p>Nonfiction authors have already done the hardest part: they've turned what they know into a book. But most author sites stop at "buy the book", and the reader who wanted more has nowhere to go.</p>
            <p>I like fixing that. A good author site and a simple email funnel can turn one book into a steady stream of clients, subscribers, and speaking invitations.</p>
          </div>
        </div>
      </section>
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-4xl">What I bring</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {skills.map((s) => (
              <div key={s.h} className="border-t border-foreground/20 pt-5">
                <h3 className="text-2xl">{s.h}</h3>
                <p className="mt-2 max-w-[50ch] text-muted-foreground">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="max-w-[24ch] text-3xl">Let's start with a look at your current site.</h2>
          <Link to="/contact" className="mt-6 inline-block"><Btn>Get my free author site review</Btn></Link>
        </div>
      </section>
    </>
  );
}
