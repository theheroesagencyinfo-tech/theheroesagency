import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn } from "@/components/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — TheHeroes Author Studio" },
      { name: "description", content: "Author websites, email funnels, and launch kits for nonfiction authors. See what's included in each and request a quote." },
      { property: "og:title", content: "Services — TheHeroes Author Studio" },
      { property: "og:description", content: "Author websites, email funnels, and launch kits for nonfiction authors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const offers = [
  {
    n: "I", title: "Author website", tag: "Credibility",
    intro: "A site that presents you as the expert behind the book, and gives every visitor a clear next step.",
    items: ["Homepage, about, book, and contact pages", "Speaking and work-with-me page", "Copy guidance so your message is clear", "Mobile-first design, fast loading, basic SEO", "Email sign-up built in from day one", "Training so you can edit it yourself"],
  },
  {
    n: "II", title: "Email funnel", tag: "Leads",
    intro: "A way to turn readers into subscribers you own, and subscribers into clients.",
    items: ["Reader magnet (bonus chapter, workbook, or checklist)", "Landing page and sign-up forms", "Welcome sequence of 5 to 7 emails", "Setup in your email platform", "Tagging so you know who's ready to buy", "Simple reporting on sign-ups"],
  },
  {
    n: "III", title: "Launch kit", tag: "Momentum",
    intro: "Everything your launch needs to make noise in the first weeks, not just on day one.",
    items: ["Book launch landing page", "Pre-order and launch email series", "Launch team or early-reader sign-up", "Short AI video ads for social", "Launch week checklist and timeline", "Post-launch follow-up plan"],
  },
];

function Services() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Services</p>
        <h1 className="mt-6 max-w-[20ch] text-5xl leading-[1.05] sm:text-6xl">Three ways to make your book work harder.</h1>
        <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
          Take one, or combine them. Every project is quoted after a short conversation about your book and your goals.
        </p>
      </section>
      {offers.map((o) => (
        <section key={o.n} aria-labelledby={`o-${o.n}`} className="border-t">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
            <div>
              <span className="font-serif text-lg italic text-muted-foreground">{o.n} · {o.tag}</span>
              <h2 id={`o-${o.n}`} className="mt-2 text-4xl">{o.title}</h2>
              <p className="mt-4 max-w-[50ch] text-muted-foreground">{o.intro}</p>
              <Link to="/contact" className="mt-8 inline-block"><Btn>Request a quote</Btn></Link>
            </div>
            <div>
              <h3 className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-muted-foreground">What's included</h3>
              <ul className="mt-4 divide-y border-y">
                {o.items.map((i) => (
                  <li key={i} className="flex gap-4 py-3">
                    <span aria-hidden className="text-ring">—</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="max-w-[24ch] text-3xl">Not sure which you need? Start with a free author site review.</h2>
          <Link to="/contact" className="mt-6 inline-block"><Btn>Get my free author site review</Btn></Link>
        </div>
      </section>
    </>
  );
}
