import ServicePage from "@/components/ServicePage";

export default function ShopifyWebsiteFix() {
  return (
    <ServicePage
      slug="shopify-website-fix"
      keyword="Shopify Website Fix"
      title="Shopify Website Fix & Audit — The Heroes Agency"
      description="Shopify fix service for broken themes, slow stores, checkout errors, and busted layouts. Senior Shopify expert, fast turnaround. Book a free triage call."
      h1="Shopify Website Fix — Fast, Senior, Done Right"
      intro="Something broken on your Shopify store? Theme glitching, checkout failing, mobile layout collapsing, app conflicts? We diagnose and fix Shopify issues quickly — usually within a few days."
      whatYouGet={[
        "Diagnosis call to pinpoint the real issue",
        "Liquid, CSS, JavaScript, and app conflict fixes",
        "Checkout, cart, and discount code repairs",
        "Mobile responsiveness and cross-browser bug fixes",
        "Performance regressions and broken animation fixes",
        "Documented work so it stays fixed",
      ]}
      sections={[
        {
          heading: "Common Shopify fixes we ship",
          body: "Broken product variants, collection filters not loading, sticky add-to-cart misbehaving, slow PDPs after an app install, cart drawer not opening on mobile, checkout extensions throwing errors, third-party script blocking render, redirects looping, GA4/Meta pixel events misfiring, and the classic 'it worked yesterday' regressions.",
        },
        {
          heading: "How we work",
          body: "Send a quick description of the issue (Loom video is ideal). We respond same-day with a triage estimate. Most fixes complete inside 48–72 hours, all on a theme copy, QA'd, then pushed live. You only pay for the actual fix — no monthly retainer required.",
        },
        {
          heading: "When a fix isn't enough",
          body: "If we find the underlying theme is fundamentally fragile, we'll tell you honestly and quote a small rebuild or refactor instead of patching duct tape onto duct tape.",
        },
      ]}
      caseStudy={{
        title: "Fashion brand — checkout breakage during sale",
        body: "Mid-Black-Friday, discount codes stopped applying on mobile Safari. We diagnosed an app conflict, patched the Liquid, and shipped a fix in 4 hours. The brand recovered an estimated $42k in sales over the weekend.",
        metric: "Fixed in 4 hours",
      }}
      faqs={[
        { q: "How fast can you start a Shopify fix?", a: "Same day for triage, usually within 24–48 hours to ship the fix." },
        { q: "Do you fix issues I caused with a 'No-Code' theme editor?", a: "Yes — those are some of the most common fixes. No judgment." },
        { q: "Can you fix issues caused by a removed app?", a: "Yes. Apps often leave orphaned Liquid snippets and CSS — we clean those up properly." },
        { q: "Is there a minimum charge?", a: "Yes, a small minimum to cover triage. Most fixes are quoted flat-rate before we start." },
        { q: "Do you offer a maintenance retainer?", a: "Yes — for brands who want priority response and ongoing small fixes each month." },
      ]}
      relatedLinks={[
        { label: "Shopify Optimization", href: "/shopify-optimization" },
        { label: "Shopify Expert", href: "/shopify-expert" },
        { label: "Shopify Store Design", href: "/shopify-store-design" },
      ]}
    />
  );
}
