import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { openCalendlyPopup } from "@/lib/calendly";

const Footer = lazy(() =>
  import("@/components/sections/Footer").then((m) => ({ default: m.Footer })),
);

export type FAQItem = { q: string; a: string };

export type ServicePageProps = {
  slug: string; // e.g. "shopify-expert"
  keyword: string; // primary keyword, e.g. "Shopify Expert"
  title: string; // SEO <title>
  description: string; // meta description
  h1: string;
  intro: string; // 2–3 sentence hero paragraph
  whatYouGet: string[]; // bullet outcomes
  sections: { heading: string; body: string }[]; // 2–4 prose sections
  faqs: FAQItem[];
  caseStudy?: { title: string; body: string; metric?: string };
  relatedLinks?: { label: string; href: string }[];
};

const SITE = "https://theheroesagency.lovable.app";

export function ServicePage(props: ServicePageProps) {
  const url = `${SITE}/${props.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: props.keyword,
      serviceType: props.keyword,
      url,
      provider: {
        "@type": "ProfessionalService",
        name: "The Heroes Agency",
        url: SITE,
      },
      areaServed: "Worldwide",
      description: props.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: props.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
        { "@type": "ListItem", position: 2, name: props.keyword, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title={props.title}
        description={props.description}
        canonical={url}
        jsonLd={jsonLd}
      />
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="container px-4 md:px-6 max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{props.keyword}</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-6"
          >
            {props.h1}
          </motion.h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            {props.intro}
          </p>

          <div className="flex flex-wrap gap-3 mb-16">
            <Button
              onClick={() => openCalendlyPopup()}
              size="lg"
              className="gradient-gold text-primary-foreground font-semibold"
            >
              Book a free strategy call <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Link to="/portfolio">
              <Button size="lg" variant="outline">See recent work</Button>
            </Link>
          </div>

          {/* What you get */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">What you get</h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {props.whatYouGet.map((item) => (
                <li key={item} className="flex gap-3 items-start glass rounded-lg p-4">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Prose sections */}
          {props.sections.map((s) => (
            <section key={s.heading} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">{s.heading}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {s.body}
              </p>
            </section>
          ))}

          {/* Case study */}
          {props.caseStudy && (
            <section className="mb-16 glass rounded-2xl p-8 border border-primary/20">
              <div className="text-sm uppercase tracking-wider text-primary mb-2">
                Case study
              </div>
              <h3 className="text-2xl font-semibold mb-3">{props.caseStudy.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {props.caseStudy.body}
              </p>
              {props.caseStudy.metric && (
                <div className="text-3xl font-bold text-gradient">
                  {props.caseStudy.metric}
                </div>
              )}
            </section>
          )}

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {props.faqs.map((f) => (
                <details
                  key={f.q}
                  className="glass rounded-lg p-5 group"
                >
                  <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center">
                    {f.q}
                    <span className="text-primary group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related */}
          {props.relatedLinks && props.relatedLinks.length > 0 && (
            <section className="mb-16">
              <h2 className="text-xl font-semibold mb-4">Related services</h2>
              <div className="flex flex-wrap gap-3">
                {props.relatedLinks.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    className="glass rounded-full px-4 py-2 text-sm hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Final CTA */}
          <section className="text-center glass rounded-2xl p-10 border border-primary/20">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Ready to grow your Shopify store?
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a free 30-minute strategy call with a senior Shopify expert.
            </p>
            <Button
              onClick={() => openCalendlyPopup()}
              size="lg"
              className="gradient-gold text-primary-foreground font-semibold"
            >
              Book your free call <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </section>
        </div>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default ServicePage;
