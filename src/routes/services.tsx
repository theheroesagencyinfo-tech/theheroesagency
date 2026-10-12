import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/page";
import { ReviewForm } from "@/components/ReviewForm";
import { StudioImage } from "@/components/studio-image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Services — TheHeroes Author Studio" },
    { name: "description", content: "Author websites, five-email welcome funnels, and book launch kits for nonfiction authors. Explore the scope and request a quote." },
    { property: "og:title", content: "Services — TheHeroes Author Studio" },
    { property: "og:description", content: "Three ways I help nonfiction authors: websites, email funnels, and launch kits." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Services,
});
const offers = [
  { title: "Author website", outcome: "A clear home for your book, your expertise, and your reader's next step.", who: "Nonfiction authors who need a first website or a clearer platform for their book.", included: ["Home and about pages", "Book page with retailer links", "Media and speaker page", "Lead capture form", "Mobile-ready design", "Basic SEO"], needs: ["Your book cover, description, and retailer links", "Your bio, headshot, and media or speaking information", "Your website copy and account access"] },
  { title: "Email funnel", outcome: "Turn a free chapter or workbook into the beginning of a reader relationship.", who: "Authors ready to grow an email list and welcome new readers beyond the book.", included: ["Free chapter or workbook landing page", "Email signup form", "A 5-email welcome sequence", "Setup in your email tool"], needs: ["Your free chapter or workbook", "Access to your email tool", "Your reader audience and the next step you want them to take"] },
  { title: "Launch kit", outcome: "Bring your launch page, emails, and creative assets together in one place.", who: "Authors preparing a book launch who need a coordinated set of launch assets.", included: ["Launch landing page", "Pre-launch and launch-week email sequence", "AI-made book trailer", "Short ad clips", "Social launch graphics"], needs: ["Your book cover, description, and launch date", "Your retailer links and email tool access", "Your launch message and any brand assets"] },
];
const steps = [
  { title: "Free review", text: "We start with your book and your current author site." },
  { title: "Scoping call", text: "We agree on the right service, deliverables, and timeline." },
  { title: "Build", text: "I build the pages and assets, with agreed review points along the way." },
  { title: "Launch", text: "We check the finished work and get it ready to go live." },
];
const faqs = [
  ["How long will it take?", "[Add typical timelines for each service and what can affect the schedule.]"],
  ["What do you need from me?", "[Confirm the copy, images, book files, account access, and approvals needed before we start.]"],
  ["How do revisions work?", "[Add the number of revision rounds and how feedback will be collected.]"],
  ["Which tools do you build on?", "[Add your website, email, design, and video tools.]"],
  ["How does payment work?", "[Add your deposit, payment schedule, and accepted payment methods.]"],
];
function Services() {
  const [selected, setSelected] = useState<string>();
  return <>
    <PageIntro label="Services" title="Three ways I help nonfiction authors.">Start with a website, add a funnel, or launch a book with everything in place.</PageIntro>
    {offers.map((offer, index) => <section key={offer.title} className="border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]">
        <div><p className="font-serif text-lg text-muted-foreground">0{index + 1}</p><h2 className="mt-3 text-4xl">{offer.title}</h2><p className="mt-4 max-w-[45ch] text-lg text-muted-foreground">{offer.outcome}</p>
          <h3 className="mt-8 font-sans text-sm font-semibold">Who it's for</h3><p className="mt-2 max-w-[45ch] text-muted-foreground">{offer.who}</p>
          <Button asChild variant="studio" size="studio" className="mt-8"><a href="#quote" onClick={() => setSelected(offer.title.toLowerCase())}>Request a quote</a></Button>
          <StudioImage image={index === 0 ? "website" : index === 1 ? "email" : "launch"} className="mt-8" />
        </div>
        <div><h3 className="font-sans text-sm font-semibold">What's included</h3><ul className="mt-4 divide-y border-y">{offer.included.map(item => <li key={item} className="flex gap-4 py-3"><span aria-hidden="true" className="text-ring">—</span>{item}</li>)}</ul>
          <h3 className="mt-8 font-sans text-sm font-semibold">What you'll need to give me</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{offer.needs.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>)}
    <section className="border-t bg-secondary"><div className="mx-auto max-w-6xl px-5 py-16"><h2 className="text-4xl">How we work</h2><ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, i) => <li key={step.title} className="border-t pt-5"><span className="font-serif text-3xl text-ring">0{i + 1}</span><h3 className="mt-4 text-2xl">{step.title}</h3><p className="mt-2 text-muted-foreground">{step.text}</p></li>)}</ol></div></section>
    <section className="border-t"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]"><h2 className="text-4xl">Before we start</h2><Accordion type="single" collapsible className="border-t">{faqs.map(([q, a], i) => <AccordionItem key={q} value={String(i)}><AccordionTrigger className="py-5 text-base">{q}</AccordionTrigger><AccordionContent className="text-base text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion></div></section>
    <section id="quote" className="scroll-mt-36 border-t bg-secondary"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr]"><div><p className="text-sm text-muted-foreground">Your next chapter</p><h2 className="mt-4 text-4xl">Request a quote.</h2><p className="mt-4 max-w-[40ch] text-muted-foreground">Tell me about your book and what you'd like to build.</p></div><ReviewForm mode="quote" selectedService={selected} /></div></section>
  </>;
}
