import ServicePage from "@/components/ServicePage";

export default function ShopifyOptimization() {
  return (
    <ServicePage
      slug="shopify-optimization"
      keyword="Shopify Optimization"
      title="Shopify Speed & Conversion Optimization — The Heroes Agency"
      description="Shopify optimization for speed, Core Web Vitals, and conversion rate. Fix slow themes, lift CVR, and earn more revenue per visitor. Book a free audit."
      h1="Shopify Optimization — Speed + Conversion"
      intro="Most Shopify stores are leaving 20–40% of revenue on the table to slow pages, bloated apps, and unfocused UX. We find the leaks and ship the fixes."
      whatYouGet={[
        "Full speed and Core Web Vitals audit (mobile + desktop)",
        "App bloat removal and Liquid cleanup",
        "Image, font, and third-party script optimization",
        "CRO audit of PDP, cart, and checkout",
        "A/B test backlog prioritized by expected revenue lift",
        "Monthly reporting tied to revenue, not vanity metrics",
      ]}
      sections={[
        {
          heading: "Why Shopify optimization matters",
          body: "Google ranks fast sites higher and shoppers buy from fast sites more often. A 1-second delay on mobile can cost up to 20% of conversions. Optimization is the highest-ROI work most stores never invest in.",
        },
        {
          heading: "Our optimization process",
          body: "Audit first, ship second. We document every issue with impact and effort, then attack the top revenue-moving items: render-blocking scripts, oversized images, broken lazy-loading, redundant apps, and PDP friction. You see the before/after in Lighthouse and in your analytics.",
        },
        {
          heading: "Conversion-rate optimization (CRO)",
          body: "Beyond speed, we attack the checkout funnel: PDP layout, social proof placement, shipping messaging, upsell timing, cart drawer behavior, and post-purchase flow. Every test runs with proper sample sizes — no guesswork.",
        },
      ]}
      caseStudy={{
        title: "Supplements brand — speed + CRO sprint",
        body: "Mobile LCP dropped from 4.8s to 1.9s after removing 6 unused apps, deferring third-party scripts, and rebuilding the PDP. Conversion rate moved from 1.8% to 2.9% over 60 days.",
        metric: "−61% mobile LCP",
      }}
      faqs={[
        { q: "How long until I see results?", a: "Speed wins ship in week 1–2 and show in Lighthouse immediately. CRO wins compound over 4–8 weeks as tests reach significance." },
        { q: "Will you break my store?", a: "All work happens on a theme copy, staged and QA'd before going live. Rollback is one click." },
        { q: "Do you optimize Shopify Plus?", a: "Yes — including checkout extensibility, scripts, and Shop Pay tuning." },
        { q: "Can you fix a slow Shopify theme without rebuilding?", a: "Usually yes — most slowness comes from apps and scripts, not the theme itself." },
      ]}
      relatedLinks={[
        { label: "Shopify Expert", href: "/shopify-expert" },
        { label: "Shopify Website Fix", href: "/shopify-website-fix" },
        { label: "Shopify Store Design", href: "/shopify-store-design" },
      ]}
    />
  );
}
