import ServicePage from "@/components/ServicePage";

export default function ShopifyExpert() {
  return (
    <ServicePage
      slug="shopify-expert"
      keyword="Shopify Expert"
      title="Shopify Expert & Consultant — The Heroes Agency"
      description="Work with a senior Shopify expert. Store design, speed & conversion optimization, theme fixes, and growth strategy that ships revenue. Book a free call."
      h1="Shopify Expert You Can Actually Trust"
      intro="I'm a senior Shopify expert helping brands fix what's broken, design stores that convert, and unlock the next stage of growth. No fluff, no junior handoff — just clean execution from someone who has shipped real revenue on the platform."
      whatYouGet={[
        "Direct work with a senior Shopify expert (no agency layers)",
        "Conversion-focused store design and theme customization",
        "Speed audits, Core Web Vitals fixes, mobile UX polish",
        "Liquid, app, and checkout customizations done right",
        "Email/SMS flows and retention setup that compound",
        "Honest advice — even when the answer is 'don't build that'",
      ]}
      sections={[
        {
          heading: "Why hire a dedicated Shopify expert?",
          body: "Most Shopify problems aren't really Shopify problems — they're strategy, design, or technical-debt problems that look like Shopify problems. A real expert spots the difference in 20 minutes instead of 20 hours of trial-and-error.\n\nI work hands-on with founders and merchandising teams to ship measurable improvements: faster pages, cleaner PDPs, sharper checkout, smarter automations. Everything is tracked, attributed, and revisited.",
        },
        {
          heading: "Who I work best with",
          body: "Brands doing $20k–$2M/month on Shopify who know their next jump won't come from another app subscription. DTC, fashion, beauty, home, supplements, accessories. If you've outgrown templates and want a partner who treats your store like their own, we'll get on well.",
        },
        {
          heading: "How engagements work",
          body: "Most clients start with a one-off audit or a focused 2–4 week sprint (redesign, speed pass, checkout overhaul). From there, many continue on a monthly retainer for ongoing CRO, design, and growth work. No long lock-ins.",
        },
      ]}
      caseStudy={{
        title: "Apparel brand — full re-platform & CRO sprint",
        body: "A premium apparel brand was leaking conversions on a bloated theme. We rebuilt the storefront on a clean Shopify 2.0 architecture, rewrote the PDP, tightened checkout, and shipped a retention flow. Conversion rate moved from 1.4% to 3.1% in 90 days.",
        metric: "+121% conversion rate",
      }}
      faqs={[
        { q: "Are you an official Shopify Expert?", a: "Yes — I've spent years building on Shopify and Shopify Plus, with hands-on experience across Liquid, Hydrogen, checkout extensibility, and the major apps in the DTC stack." },
        { q: "Do you work with Shopify Plus?", a: "Yes. Plus stores are a sweet spot — checkout customization, scripts/functions, B2B, and multi-storefront work included." },
        { q: "How quickly can we start?", a: "Audits usually start within a week. Sprint work within 1–2 weeks depending on scope." },
        { q: "Do you fix existing stores or only build new ones?", a: "Both. A lot of my work is unblocking and optimizing what brands already have." },
        { q: "How much does it cost?", a: "Audits start at a flat fee; sprints and retainers are scoped after the first call. You'll always get a clear price before any work starts." },
      ]}
      relatedLinks={[
        { label: "Shopify Store Design", href: "/shopify-store-design" },
        { label: "Shopify Optimization", href: "/shopify-optimization" },
        { label: "Shopify Website Fix", href: "/shopify-website-fix" },
        { label: "Shopify Marketing Agency", href: "/shopify-marketing-agency" },
      ]}
    />
  );
}
