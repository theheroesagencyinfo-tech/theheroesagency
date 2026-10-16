import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BOOKING_URL } from "@/components/site";
import { packages, addons, RUSH } from "@/lib/packages";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [
    { title: "Pricing · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Author website, email system, and book launch packages for nonfiction authors, from $1,500. Delivered in 2–4 weeks." },
    { property: "og:title", content: "Pricing · TheHeroes Agency · Author Studio" },
    { property: "og:description", content: "Three packages that turn your nonfiction book into a platform for subscribers, clients, and speaking opportunities." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Pricing,
});

function CallButton({ children = "Book a discovery call", variant = "studio" as const, className = "" }: { children?: string; variant?: "studio" | "studioOutline"; className?: string }) {
  return <Button asChild variant={variant} size="studio" className={className}><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{children}</a></Button>;
}

const audience = [
  "Have a published or upcoming book",
  "Want readers to take a clear next step",
  "Want to build an email list",
  "Want inquiries for coaching, consulting, courses, or speaking",
  "Want your website, emails, and launch creative to work together",
  "Want a strategic partner, not a freelancer who builds one piece",
];


const journeys = [
  ["Book presence", "A reader discovers the book and joins your list."],
  ["Reader-to-client system", "A reader downloads a resource, joins your list, and moves toward working with you."],
  ["Book launch platform", "A reader preorders, buys during launch week, joins your list, or asks about working with you."],
];


const steps = [
  ["Discovery call", "We clarify your book, audience, goals, and the best next step for readers."],
  ["Strategy and scope", "We agree on the platform, deliverables, timeline, and success measures."],
  ["Build and review", "I design and build the website, email automation, and launch creative."],
  ["Launch and handover", "You receive training, documentation, and a clear plan for what happens next."],
];

const faqs = [
  ["Do I need to have my book finished before working with you?", "No. You can start before publication. If your book is still in progress, we can build your platform around a preorder page, waitlist, reader magnet, or early email list so you already have interested readers before launch day."],
  ["Can you work with my existing website?", "Yes. If your current website is in good shape, I can improve specific pages, add email capture, create a reader-magnet funnel, or prepare launch pages. If it needs a major rebuild, I'll recommend the best package after our discovery call."],
  ["What email platforms do you work with?", "Popular platforms such as Mailchimp, Kit (formerly ConvertKit), MailerLite, and similar tools. If you're not sure which to use, I'll recommend the simplest option for your goals and budget."],
  ["Do you write the emails and website copy?", "Yes. Each package includes strategic copy for its pages and emails, built on your book, expertise, voice, and goals. If you already have copy, I can refine and structure it."],
  ["What is a reader magnet?", "A useful free resource that encourages someone to join your email list, such as a checklist, workbook, template, short guide, chapter excerpt, quiz, or mini email course connected to your book's main idea."],
  ["Do you handle paid ads?", "I create AI-powered video ads, static graphics, and ad-ready copy, and can set up and manage campaigns as an add-on. Ad spend is paid directly by you and isn't included in package pricing."],
  ["How long does each package take?", "Book presence takes about 2 weeks, reader-to-client system about 3 weeks, and book launch platform about 4 weeks. Timelines depend on timely feedback, content, and approvals from you."],
  ["Can you deliver faster if I have a launch deadline?", "Yes. Rush delivery is available for an additional $150, subject to availability. We'll confirm the exact delivery date before you pay the deposit."],
  ["What happens after the project ends?", "You receive the completed website, email sequences, creative assets, documentation, and a handover walkthrough. You own your website, email list, and accounts. I can also support you after launch with email management, maintenance, or new campaigns."],
  ["Do I own everything you create?", "Yes. Once final payment is received, you own the deliverables created for your project, subject to the terms of any third-party tools or licensed assets used."],
  ["What do you need from me to start?", "Usually your book details, author bio, professional photo, book cover, retailer or preorder links, any brand assets, access to your domain and email platform, and existing testimonials. I'll send a simple checklist after booking."],
];

function Pricing() {
  return <>
    <section className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:pt-20">
      <p className="text-sm font-semibold text-muted-foreground">Pricing</p>
      <h1 className="mt-6 max-w-[22ch] text-4xl leading-[1.08] sm:text-6xl">Turn your book into a platform that creates opportunities.</h1>
      <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">I build author websites, email systems, and launch creative that turn readers into subscribers, clients, and speaking opportunities.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <CallButton />
        <Button asChild variant="studioOutline" size="studio"><a href="#packages">See what's included</a></Button>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">One point of contact. Clear timeline. No jargon.</p>
    </section>

    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
      <h2 className="text-4xl">Who this is for</h2>
      <div><p className="text-lg text-muted-foreground">Nonfiction authors who:</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">{audience.map(a => <li key={a} className="flex gap-3 border-t pt-4"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-primary" />{a}</li>)}</ul></div>
    </div></section>

    <section id="packages" className="scroll-mt-28 border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-4xl">Three packages, one goal.</h2>
      <p className="mt-4 max-w-[60ch] text-muted-foreground">Every package is completed within 2–4 weeks, with a written scope agreed before building begins.</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {packages.map(p => <article key={p.name} className={`flex flex-col rounded-md border bg-background p-7 ${p.popular ? "border-primary ring-1 ring-primary lg:-my-3" : ""}`}>
          {p.popular && <p className="mb-4 self-start rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Most popular</p>}
          <h3 className="text-2xl">{p.name}</h3>
          <p className="mt-4"><span className="text-sm text-muted-foreground">From </span><span className="font-serif text-4xl">{p.price}</span></p>
          <p className="mt-1 text-sm text-muted-foreground">Timeline: {p.time}</p>
          <p className="mt-5 text-sm"><span className="font-semibold">Best for: </span>{p.best}</p>
          <p className="mt-3 text-sm"><span className="font-semibold">Outcome: </span>{p.outcome}</p>
          <ul className="mt-6 space-y-3 border-t pt-6 text-sm">{p.items.map(i => <li key={i} className="flex gap-3"><Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}</li>)}</ul>
          <div className="mt-auto pt-8"><Button asChild variant={p.popular ? "studio" : "studioOutline"} size="studio" className="w-full"><Link to="/get-started" search={{ package: p.slug }}>{p.cta}</Link></Button></div>
        </article>)}
      </div>
      <p className="mt-10 border-l-2 border-primary pl-4 text-sm">Need it faster? Rush delivery is available for an additional $150, subject to availability.</p>
    </div></section>

    <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-4xl">Why these packages work</h2>
      <p className="mt-4 max-w-[60ch] text-muted-foreground">Each package is designed around a clear reader journey.</p>
      <ol className="mt-10 grid gap-8 md:grid-cols-3">{journeys.map(([t, d], i) => <li key={t} className="border-t pt-5"><span className="font-serif text-3xl text-ring">0{i + 1}</span><h3 className="mt-4 text-2xl">{t}</h3><p className="mt-3 text-muted-foreground">{d}</p></li>)}</ol>
      <p className="mt-12 max-w-[30ch] font-serif text-3xl italic">Your book should not be the end of the conversation. It should be the beginning.</p>
    </div></section>

    <section className="border-t bg-secondary"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
      <h2 className="text-4xl">Need something specific?</h2>
      <dl className="divide-y border-y">{[...addons.map(a => [a.name, a.price]), [RUSH.name, RUSH.price]].map(([n, p]) => <div key={n} className="flex justify-between gap-6 py-4"><dt>{n}</dt><dd className="shrink-0 font-semibold">{p}</dd></div>)}</dl>
    </div></section>

    <section className="border-t"><div className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-4xl">How we work</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-4">{steps.map(([t, d], i) => <li key={t} className="border-t pt-5"><span className="font-serif text-3xl text-ring">0{i + 1}</span><h3 className="mt-4 text-xl">{t}</h3><p className="mt-3 text-muted-foreground">{d}</p></li>)}</ol>
    </div></section>

    <section className="border-t bg-secondary"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
      <div><h2 className="text-4xl">Payment</h2><p className="mt-4 text-muted-foreground">Simple milestones, agreed in writing before we begin.</p></div>
      <div className="grid gap-8">
        <div><h3 className="text-xl">All packages</h3><ul className="mt-4 divide-y border-y">{[["40%", "deposit to reserve your project"], ["30%", "at design and content approval"], ["30%", "before launch or handover"]].map(([a, b]) => <li key={b} className="flex gap-4 py-3"><span className="w-12 font-semibold">{a}</span>{b}</li>)}</ul></div>
        <div><h3 className="text-xl">Book launch platform</h3><ul className="mt-4 divide-y border-y"><li className="py-3">3 payments of $1,900, or</li><li className="py-3">50% deposit and 50% before launch</li></ul></div>
      </div>
    </div></section>

    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
      <h2 className="text-4xl">Questions authors ask</h2>
      <Accordion type="single" collapsible className="border-t">{faqs.map(([q, a], i) => <AccordionItem key={q} value={String(i)}><AccordionTrigger className="py-5 text-left text-base">{q}</AccordionTrigger><AccordionContent className="text-base text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion>
    </div></section>

    <section className="border-t bg-secondary pb-24 md:pb-0"><div className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="max-w-[22ch] text-4xl sm:text-5xl">Let's give your readers a clear next step.</h2>
      <p className="mt-4 max-w-[60ch] text-lg text-muted-foreground">Book a discovery call and we'll map the simplest path from your book to more subscribers, clients, and opportunities.</p>
      <CallButton className="mt-8" />
    </div></section>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur md:hidden">
      <CallButton className="w-full" />
    </div>
  </>;
}
