import { createFileRoute, Link } from "@tanstack/react-router";
import { Share2, CalendarCheck, Wallet, Award, BadgePercent, Film, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoyaltyBadge } from "@/components/loyalty-badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LEVELS } from "@/lib/loyalty";

const URL = "https://theheroesagency.lovable.app/referrals";
export const Route = createFileRoute("/referrals")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Referral rewards program · TheHeroes Agency" },
      { name: "description", content: "Refer nonfiction authors to TheHeroes Agency and unlock ongoing project discounts, priority support and free book teasers across seven tiers." },
      { property: "og:title", content: "Refer authors. Unlock legendary rewards." },
      { property: "og:description", content: "Seven reward tiers with ongoing discounts, priority support and free book-launch teasers." },
      { property: "og:type", content: "website" }, { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Referrals,
});

const STEPS = [
  [Share2, "Share your personal referral link."], [CalendarCheck, "Your referral books an eligible project."],
  [Wallet, "They become a paying client."], [Award, "You move up a tier and unlock rewards."],
] as const;

const FAQ = [
  ["When does a referral count?", "Once the author you referred books an eligible project and pays their deposit or first invoice. The studio confirms each referral before it counts."],
  ["Who qualifies as a referral?", "A new client with no previous working relationship with TheHeroes Agency. Self-referrals are not allowed."],
  ["How long does my tier last?", "Your tier stays active for 12 months from the date you earn it. After that, you keep it while you hold the required number of successful referrals within the past 12 months."],
  ["What does the discount apply to?", "Every eligible project booked while your tier is active. It does not apply to taxes, payment fees, hosting, domains, third-party licenses, plugins, rush fees or other third-party costs."],
  ["Can I combine discounts?", "No. One project receives one referral-tier discount, and it can't be stacked with another referral discount or a major promotion."],
  ["Which books qualify for a free teaser?", "First-edition titles published for the first time while you're at Level 4 or above, requested within 6 months of release. Revised editions, re-releases, box sets, audiobooks, translations and previously published books don't qualify."],
  ["What's included in the teaser?", "One standard 30-second teaser per qualifying book. Custom filming, actors, professional voiceover, original music, extra formats and extra revisions are not included."],
];

function Referrals() {
  return <>
    <section className="bg-pitch text-pitch-foreground"><div className="mx-auto max-w-[1500px] px-5 py-20 sm:py-28">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pitch-accent">Referral program</p>
      <h1 className="mt-6 max-w-[18ch] text-5xl leading-[1.05] sm:text-7xl">Refer authors. Unlock legendary rewards.</h1>
      <p className="mt-6 max-w-[58ch] text-lg text-pitch-muted">Every successful referral moves you up a tier and unlocks ongoing rewards, priority service and exclusive book-launch benefits.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild variant="studio" size="studio"><Link to="/account">Get my referral link</Link></Button>
        <Button asChild variant="ghostDark" size="studio"><a href="#tiers">See reward tiers</a></Button>
      </div>
    </div></section>

    <section className="mx-auto max-w-[1500px] px-5 py-20">
      <h2 className="text-3xl sm:text-4xl">How it works</h2>
      <ol className="mt-10 grid gap-10 border-t pt-10 sm:grid-cols-2 lg:grid-cols-4">{STEPS.map(([I, t], i) =>
        <li key={t}><I aria-hidden className="h-6 w-6 text-primary" /><p className="mt-4 text-sm font-semibold text-muted-foreground">Step {i + 1}</p><p className="mt-2 text-xl">{t}</p></li>)}</ol>
    </section>

    <section id="tiers" className="scroll-mt-24 border-t bg-secondary"><div className="mx-auto max-w-[1500px] px-5 py-20">
      <h2 className="text-3xl sm:text-4xl">Seven tiers, each with its own badge.</h2>
      <p className="mt-4 max-w-[60ch] text-muted-foreground">Tiers are based on converted referrals: authors who became paying clients.</p>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">{LEVELS.map(l =>
        <li key={l.level} className={`flex flex-col bg-card p-7 ${l.level === 7 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
          <LoyaltyBadge level={l} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level {l.level} · {l.min} {l.min === 1 ? "referral" : "referrals"}</p>
          <h3 className="mt-2 text-2xl">{l.title}</h3><p className="text-sm text-muted-foreground">{l.badge}</p>
          <p className="mt-5 text-3xl text-primary">{l.discount ? `$${l.discount} off` : "Link and tracker"}</p>
          <p className="mt-3 text-sm text-muted-foreground">{l.perk}</p>
        </li>)}</ol>
    </div></section>

    <section className="mx-auto max-w-[1500px] px-5 py-20">
      <h2 className="text-3xl sm:text-4xl">What you unlock</h2>
      <div className="mt-10 grid gap-10 border-t pt-10 md:grid-cols-3">
        {([[BadgePercent, "Ongoing discounts", "From $100 to $750 off every eligible project you book while your tier is active. Not a one-time coupon."],
          [Headphones, "Priority support", "From Level 5, your projects and questions move to the front of the queue. Level 7 receives VIP support and an annual strategy session."],
          [Film, "Free book teasers", "From Level 4, a complimentary standard 30-second teaser for every newly released first-edition book."]] as const).map(([I, t, d]) =>
          <div key={t}><I aria-hidden className="h-6 w-6 text-primary" /><h3 className="mt-4 text-2xl">{t}</h3><p className="mt-3 text-muted-foreground">{d}</p></div>)}
      </div>
    </section>

    <section className="border-t"><div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-20 lg:grid-cols-[1fr_1.4fr]">
      <h2 className="text-3xl sm:text-4xl">Questions about the program</h2>
      <Accordion type="single" collapsible>{FAQ.map(([q, a]) =>
        <AccordionItem key={q} value={q}><AccordionTrigger className="text-left text-lg">{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>)}</Accordion>
    </div></section>

    <section className="border-t bg-secondary"><div className="mx-auto max-w-[1500px] px-5 py-16">
      <h2 className="max-w-[25ch] text-3xl sm:text-4xl">Know an author who deserves a better platform?</h2>
      <Button asChild variant="studio" size="studio" className="mt-6"><Link to="/account">Get my referral link</Link></Button>
    </div></section>
  </>;
}
