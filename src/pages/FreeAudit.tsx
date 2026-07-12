import { motion } from "framer-motion";
import { CheckCircle2, Zap, Search, TrendingUp, Timer } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { ContactForm } from "@/components/ContactForm";

const auditIncludes = [
  {
    icon: Search,
    title: "Homepage & PDP teardown",
    body: "Line-by-line review of your highest-traffic pages against 40+ conversion checkpoints.",
  },
  {
    icon: Zap,
    title: "Speed & Core Web Vitals",
    body: "Real Lighthouse scores for mobile and desktop, plus the exact bottlenecks costing you sales.",
  },
  {
    icon: TrendingUp,
    title: "Revenue leaks",
    body: "The 3–5 highest-impact fixes ranked by projected revenue lift — no fluff, no 40-page PDF.",
  },
  {
    icon: Timer,
    title: "24–48 hour turnaround",
    body: "Delivered as a short Loom walkthrough you can act on the same week.",
  },
];

const idealFor = [
  "You do $20K–$1M/month on Shopify",
  "Your conversion rate is under 3%",
  "You've launched paid ads but ROAS is soft",
  "Your site is slow on mobile",
  "You're thinking about a redesign or replatform",
];

export default function FreeAudit() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Free Shopify Store Audit — Find Your Revenue Leaks | TheHeroes"
        description="Free 15-minute Shopify audit from a senior CRO expert. Get 3–5 prioritized fixes ranked by revenue impact, delivered in 24–48 hours. No pitch, no obligation."
        canonical="https://www.theheroesagency.org/free-audit"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Free Shopify Store Audit",
          provider: {
            "@type": "Organization",
            name: "The Heroes Agency",
            url: "https://www.theheroesagency.org/",
          },
          areaServed: "Worldwide",
          description:
            "Free conversion, speed and UX audit for Shopify stores. Delivered as a Loom walkthrough with a ranked fix list within 48 hours.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <Navigation />

      <main className="relative">
        {/* Hero */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-glow-top pointer-events-none" />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Free — no pitch, no obligation
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Find the{" "}
                <span className="text-gradient">3 fixes</span> costing your
                Shopify store the most revenue.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A senior CRO expert reviews your store and sends you a short
                Loom with the highest-impact fixes ranked by revenue lift.
                Delivered in 24–48 hours.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {auditIncludes.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="glass rounded-2xl p-6 flex gap-4"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form + qualification */}
        <section className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">This is for you if</h2>
                  <ul className="space-y-3">
                    {idealFor.map((line) => (
                      <li key={line} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-2">What happens next</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>You send us your store URL below.</li>
                    <li>We review it in the next 24–48 hours.</li>
                    <li>You get a Loom + fix list in your inbox.</li>
                    <li>Book a call only if the fixes look worth it.</li>
                  </ol>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="glass rounded-2xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-2">Request your audit</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drop your store URL and a line about what you're trying to
                    improve. We reply within 12 hours.
                  </p>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
