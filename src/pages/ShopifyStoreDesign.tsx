import ServicePage from "@/components/ServicePage";

export default function ShopifyStoreDesign() {
  return (
    <ServicePage
      slug="shopify-store-design"
      keyword="Shopify Store Design"
      title="Shopify Store Design & Development — The Heroes Agency"
      description="Custom Shopify store design that converts. Premium UX, fast mobile, clean Shopify 2.0 architecture. Built by a senior Shopify expert. Book a free call."
      h1="Shopify Store Design That Sells"
      intro="A beautiful store is only half the job. We design Shopify stores that load fast, guide the buyer, and earn the click on every section — from hero to cart drawer."
      whatYouGet={[
        "Custom Shopify 2.0 theme tailored to your brand",
        "Conversion-driven PDP, collection, and homepage design",
        "Mobile-first layouts with real Core Web Vitals targets",
        "Reusable sections so your team can edit without a dev",
        "Brand-true typography, motion, and micro-interactions",
        "Launch QA, analytics, and post-launch tuning",
      ]}
      sections={[
        {
          heading: "Design that pays for itself",
          body: "Every layout decision is anchored to conversion. We use heatmaps, session recordings, and competitor teardowns to design sections that actually move add-to-cart and checkout rates — not just look good on Dribbble.",
        },
        {
          heading: "Built clean, built to last",
          body: "We build on Shopify 2.0 with proper section schemas and metafields, so your store stays editable, fast, and upgrade-friendly. No mystery code, no app bloat, no theme you're scared to touch.",
        },
        {
          heading: "What we design",
          body: "Full storefronts (home, collection, PDP, cart, checkout extensions, blog), landing pages for paid campaigns, B2B portals, and headless Hydrogen builds for brands ready for the next tier.",
        },
      ]}
      caseStudy={{
        title: "Beauty brand — homepage + PDP redesign",
        body: "Replaced a generic theme with a custom mobile-first design and modular PDP. Average order value rose 38% and bounce on mobile dropped from 62% to 41%.",
        metric: "+38% AOV",
      }}
      faqs={[
        { q: "Do you use a theme or design from scratch?", a: "Both, depending on budget. We can extend Dawn/Sense for speed or design fully custom when brand expression matters." },
        { q: "How long does a Shopify redesign take?", a: "Most projects run 4–8 weeks: discovery, design, build, QA, launch." },
        { q: "Will my team be able to edit it?", a: "Yes. Every section is configurable in the theme editor with sensible defaults and locked layout rules." },
        { q: "Do you handle migration from another platform?", a: "Yes — WooCommerce, Magento, Wix, Squarespace, BigCommerce, and custom platforms." },
        { q: "Will the new design be fast?", a: "We target a Lighthouse mobile performance score of 70+ and Core Web Vitals 'Good' on launch." },
      ]}
      relatedLinks={[
        { label: "Shopify Expert", href: "/shopify-expert" },
        { label: "Shopify Optimization", href: "/shopify-optimization" },
        { label: "Shopify Website Fix", href: "/shopify-website-fix" },
      ]}
    />
  );
}
