import ServicePage from "@/components/ServicePage";

export default function ShopifyMarketingAgency() {
  return (
    <ServicePage
      slug="shopify-marketing-agency"
      keyword="Shopify Marketing Agency"
      title="Shopify Marketing Agency — Growth for DTC Brands"
      description="Shopify marketing agency for DTC brands. Email, SMS, paid social, creative, and CRO — all tied to Shopify revenue. Book a free strategy call."
      h1="A Shopify Marketing Agency Built for Revenue"
      intro="We grow Shopify stores end-to-end: paid acquisition, email and SMS retention, creative production, and on-site CRO — all measured against real Shopify revenue, not platform vanity metrics."
      whatYouGet={[
        "Paid social strategy and ad creative (Meta, TikTok)",
        "Email + SMS retention flows (Klaviyo, Attentive, Postscript)",
        "AI-generated commercials and UGC-style creative",
        "On-site CRO tied to ad campaigns",
        "Weekly reporting on revenue, ROAS, and LTV",
        "One senior partner, no junior account-manager handoff",
      ]}
      sections={[
        {
          heading: "Marketing that respects the storefront",
          body: "Most agencies optimize ads in isolation and ignore the landing experience. We don't. The same team running your paid social also shapes the PDP, the cart, and the post-purchase email — so every dollar in pulls more dollars out.",
        },
        {
          heading: "Channels we run",
          body: "Meta Ads, TikTok Ads, Google (Performance Max + Search), Klaviyo, Attentive/Postscript, organic short-form content, and influencer/UGC sourcing. We pick the stack that fits the brand, not a one-size template.",
        },
        {
          heading: "Who this is for",
          body: "Brands doing $30k–$2M/month on Shopify who want a senior partner, not a deck full of charts. If you've cycled through 2–3 agencies and want one team that owns the full revenue motion, this is for you.",
        },
      ]}
      caseStudy={{
        title: "Home brand — 90-day full-funnel sprint",
        body: "Rebuilt the PDP, launched a Klaviyo welcome + abandoned cart flow, and refreshed Meta creative. Blended ROAS rose from 1.7 to 3.2, and email/SMS contribution went from 8% to 27% of revenue.",
        metric: "+88% ROAS",
      }}
      faqs={[
        { q: "What's your minimum engagement?", a: "Most retainers run 3 months minimum so creative and flows have time to compound." },
        { q: "Do you handle creative or just media buying?", a: "Both. Creative is where most accounts win or lose — we don't outsource it." },
        { q: "Do you work with Shopify Plus?", a: "Yes, and we use Plus features (Functions, Scripts, B2B) when they unlock real lift." },
        { q: "Will I get a dedicated point of contact?", a: "Yes — one senior partner runs your account end-to-end." },
      ]}
      relatedLinks={[
        { label: "Shopify Expert", href: "/shopify-expert" },
        { label: "Shopify Optimization", href: "/shopify-optimization" },
        { label: "Shopify Store Design", href: "/shopify-store-design" },
      ]}
    />
  );
}
