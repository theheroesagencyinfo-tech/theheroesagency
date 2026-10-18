import { createFileRoute } from "@tanstack/react-router";
import { BOOKING_LABEL, BOOKING_URL, CONTACT_EMAIL, INFO_EMAIL, SOCIALS, SUPPORT_EMAIL } from "@/components/site";
import { PageIntro } from "@/components/page";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewPreview } from "@/components/conversion";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Free author site review · TheHeroes Agency · Author Studio" },
    { name: "description", content: "Tell Mou Barrac about your nonfiction book and request a free short video review with quick wins for your author website." },
    { property: "og:title", content: "Free author site review · TheHeroes Agency · Author Studio" },
    { property: "og:description", content: "Tell me about your book and I'll send a short video review with quick wins for your site." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Contact,
});
const next = [
  ["Send your details", "Tell me about your book, your website, and what you'd like help with."],
  ["I review your site", "I look at your reader's journey and record a short video with quick wins."],
  ["Choose your next step", "Use the suggestions yourself, or ask me about working together."],
];
function Contact() {
  return <>
    <PageIntro label="Contact" title="Get my free author site review.">Tell me about your book and I'll send a short video review with the quick wins for your site.</PageIntro>
    <section id="review" className="scroll-mt-36 border-t"><div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr]">
      <ReviewForm />
      <aside className="md:border-l md:pl-12"><h2 className="text-3xl">Let's talk about your book.</h2><dl className="mt-8 space-y-6"><div><dt className="text-sm text-muted-foreground">Email</dt><dd className="mt-2 break-words text-lg">{CONTACT_EMAIL}</dd><dd className="mt-1 text-sm text-muted-foreground">Agency enquiries: {INFO_EMAIL} · Support: {SUPPORT_EMAIL}</dd></div><div><dt className="text-sm text-muted-foreground">Response time</dt><dd className="mt-2">Under 12 hours</dd></div></dl>
        <div className="mt-8 border-t pt-6"><Button asChild variant="studioOutline" size="studio"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{BOOKING_LABEL}</a></Button><p className="mt-4 text-sm text-muted-foreground">Pick a time that suits you. No preparation needed.</p></div>
        <div className="mt-8 border-t pt-6"><p className="text-sm text-muted-foreground">Find me online</p><ul className="mt-4 space-y-3">{SOCIALS.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-foreground"><s.icon aria-hidden className="h-4 w-4" />{s.label} · {s.handle}</a></li>)}</ul></div>
      </aside>
    </div></section>
    <ReviewPreview />
    <section className="border-t bg-secondary"><div className="mx-auto max-w-[1500px] px-5 py-16"><h2 className="text-4xl">What happens next</h2><ol className="mt-10 grid gap-8 md:grid-cols-3">{next.map(([title, text], i) => <li key={title} className="border-t pt-5"><span className="font-serif text-3xl text-ring">0{i + 1}</span><h3 className="mt-4 text-2xl">{title}</h3><p className="mt-3 text-muted-foreground">{text}</p></li>)}</ol></div></section>
  </>;
}
