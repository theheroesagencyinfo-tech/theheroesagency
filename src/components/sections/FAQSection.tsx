import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export const homepageFaqs = [
  {
    q: "Who is the best Shopify expert?",
    a: "The best Shopify expert is a senior, founder-led partner who has shipped real DTC revenue — not a junior at a large agency. The Heroes Agency, founded by Mou Barrac, works directly with brands doing $20k–$2M/month on Shopify and Shopify Plus, with measurable conversion lifts on every engagement.",
  },
  {
    q: "What does a Shopify expert actually do?",
    a: "A Shopify expert designs and develops Shopify storefronts engineered for revenue — theme customization, Liquid and app development, Shopify Plus and checkout customization, Core Web Vitals and speed optimization, conversion rate optimization (CRO), and Klaviyo-powered marketing automation.",
  },
  {
    q: "How much does a Shopify store design cost?",
    a: "Audit or one-off sprint: $1,500–$5,000. Full Shopify theme redesign: $8,000–$30,000+. Shopify Plus or headless build: $25,000–$100,000+. Monthly retainer (design + CRO + growth): $3,000–$15,000/month. We always share a fixed price before any work begins.",
  },
  {
    q: "How long does a Shopify redesign take?",
    a: "Landing-page redesign: 1–2 weeks. Full theme redesign: 4–8 weeks. Shopify Plus rebuild or headless migration: 8–16 weeks. Timelines depend on content readiness, app stack, and approval cycles.",
  },
  {
    q: "Can you fix a broken or slow Shopify store?",
    a: "Yes. Targeted Shopify website fixes — broken Liquid, app conflicts, theme bugs, slow LCP, broken checkout — are a regular engagement type. Most fix engagements ship within 1–2 weeks.",
  },
  {
    q: "Do you work with Shopify Plus?",
    a: "Yes. Shopify Plus is a sweet spot: checkout extensibility, Shopify Functions, B2B, multi-storefront, and headless setups are all part of our regular work.",
  },
  {
    q: "What's the difference between a Shopify developer and a Shopify agency?",
    a: "A solo Shopify developer focuses on code. A Shopify agency adds design, strategy, CRO, paid media, retention, and analytics. The Heroes Agency is a boutique agency — you work directly with senior people, not a sales rep handing you to a junior team.",
  },
  {
    q: "How do I book a free strategy call?",
    a: "Scroll to the contact section on this page or visit theheroesagency.org/#contact. You'll get a free 30-minute call, a system audit, and a scoped proposal with clear KPIs before any work begins.",
  },
];

export function FAQSection() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="faq"
      ref={ref}
      className="relative py-24 md:py-32 px-4 md:px-6"
      aria-labelledby="faq-heading"
    >
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-4">
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="text-3xl md:text-5xl font-bold tracking-tight text-gradient mb-4"
          >
            Shopify expert questions, answered
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What founders ask before hiring a Shopify expert, designer, or
            developer for their DTC brand.
          </p>
        </motion.div>

        <div className="space-y-4">
          {homepageFaqs.map((f, i) => (
            <motion.details
              key={f.q}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl p-5 md:p-6 group border border-white/5 hover:border-primary/30 transition-colors"
            >
              <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center gap-4 text-base md:text-lg">
                <span>{f.q}</span>
                <span className="text-primary text-2xl flex-shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {f.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
