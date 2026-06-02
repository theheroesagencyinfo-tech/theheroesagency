import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Palette,
  Gauge,
  TrendingUp,
  Wrench,
  Megaphone,
  Layers,
} from "lucide-react";

type Topic = {
  title: string;
  keyword: string;
  description: string;
  icon: typeof Palette;
  href: string;
  related: { label: string; href: string }[];
};

const topics: Topic[] = [
  {
    title: "Shopify Store Design",
    keyword: "shopify store design",
    description:
      "Brand-led Shopify themes, custom sections and Liquid components engineered for conversion.",
    icon: Palette,
    href: "/shopify-store-design",
    related: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Process", href: "/#process" },
    ],
  },
  {
    title: "Shopify Speed & Core Web Vitals",
    keyword: "shopify speed optimization",
    description:
      "LCP, INP and CLS fixes, theme refactors, image/CDN strategy and app audits for fast Shopify storefronts.",
    icon: Gauge,
    href: "/shopify-optimization",
    related: [
      { label: "Website Fix", href: "/shopify-website-fix" },
      { label: "Case studies", href: "/portfolio" },
    ],
  },
  {
    title: "Shopify CRO & A/B Testing",
    keyword: "shopify conversion rate optimization",
    description:
      "PDP, cart and checkout experiments backed by analytics — measurable lifts on AOV and CVR.",
    icon: TrendingUp,
    href: "/shopify-optimization",
    related: [
      { label: "Shopify Expert", href: "/shopify-expert" },
      { label: "Results", href: "/portfolio" },
    ],
  },
  {
    title: "Shopify Website Fix",
    keyword: "fix shopify store",
    description:
      "Broken Liquid, app conflicts, theme bugs and checkout issues — patched within 1–2 weeks.",
    icon: Wrench,
    href: "/shopify-website-fix",
    related: [
      { label: "Speed Optimization", href: "/shopify-optimization" },
      { label: "Hire an expert", href: "/shopify-expert" },
    ],
  },
  {
    title: "Shopify Marketing & Klaviyo",
    keyword: "shopify marketing agency",
    description:
      "Email & SMS flows, paid media and retention automation that compound store revenue.",
    icon: Megaphone,
    href: "/shopify-marketing-agency",
    related: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Shopify Plus & Headless",
    keyword: "shopify plus expert",
    description:
      "Checkout extensibility, Shopify Functions, B2B and headless storefronts for scaling brands.",
    icon: Layers,
    href: "/shopify-expert",
    related: [
      { label: "Store Design", href: "/shopify-store-design" },
      { label: "Optimization", href: "/shopify-optimization" },
    ],
  },
];

export function ShopifyTopicsHub() {
  return (
    <section
      aria-labelledby="topics-heading"
      className="mb-16 max-w-[1500px] mx-auto"
    >
      <div className="text-center mb-10">
        <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-3 block">
          Content Hub
        </span>
        <h2
          id="topics-heading"
          className="text-2xl md:text-3xl font-bold mb-3"
        >
          Browse by <span className="text-gradient">Shopify topic</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Keyword-focused guides on Shopify design, speed, CRO, fixes, marketing
          and Shopify Plus — with direct links to our services and case studies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.article
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="glass rounded-2xl p-6 hover-lift card-spotlight border border-white/5 hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">{t.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {t.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {t.related.map((r) => (
                  <Link
                    key={r.href + r.label}
                    to={r.href}
                    className="text-xs px-3 py-1 rounded-full border border-border hover:border-primary/40 hover:text-primary transition-colors text-muted-foreground"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
              <Link
                to={t.href}
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore {t.keyword} →
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default ShopifyTopicsHub;
