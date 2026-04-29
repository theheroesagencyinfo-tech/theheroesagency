import { Suspense, lazy } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustMetrics } from "@/components/sections/TrustMetrics";
import { SEO } from "@/components/SEO";

// Lazy-load below-the-fold sections so they don't block the main thread on
// first paint. Each chunk loads as the user scrolls / when the browser is idle,
// dramatically reducing the longest-task duration (Max Potential FID).
const ServicesSection = lazy(() =>
  import("@/components/sections/ServicesSection").then((m) => ({ default: m.ServicesSection })),
);
const ProcessSection = lazy(() =>
  import("@/components/sections/ProcessSection").then((m) => ({ default: m.ProcessSection })),
);
const PortfolioSection = lazy(() =>
  import("@/components/sections/PortfolioSection").then((m) => ({ default: m.PortfolioSection })),
);
const WhyMeSection = lazy(() =>
  import("@/components/sections/WhyMeSection").then((m) => ({ default: m.WhyMeSection })),
);
const TestimonialsSection = lazy(() =>
  import("@/components/sections/TestimonialsSection").then((m) => ({
    default: m.TestimonialsSection,
  })),
);
const BlogSection = lazy(() =>
  import("@/components/sections/BlogSection").then((m) => ({ default: m.BlogSection })),
);
const ContactSection = lazy(() =>
  import("@/components/sections/ContactSection").then((m) => ({ default: m.ContactSection })),
);
const CTASection = lazy(() =>
  import("@/components/sections/CTASection").then((m) => ({ default: m.CTASection })),
);
const Footer = lazy(() =>
  import("@/components/sections/Footer").then((m) => ({ default: m.Footer })),
);
const LiveChat = lazy(() =>
  import("@/components/LiveChat").then((m) => ({ default: m.LiveChat })),
);

// Reserve vertical space so deferred sections don't cause layout shift.
const SectionFallback = () => <div aria-hidden className="min-h-[400px]" />;

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="TheHeroes Agency — Shopify Design, Marketing Automation & AI Commercials"
        description="The Heroes Agency builds high-converting Shopify stores, automated marketing systems, and AI commercial videos that grow revenue. Book your free strategy call."
        canonical="https://theheroesagency.lovable.app/"
        image="https://theheroesagency.lovable.app/og-home.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Heroes Agency",
          url: "https://theheroesagency.lovable.app/",
          email: "info@theheroesagency.org",
          description:
            "Shopify design, marketing automation, and AI commercial production agency.",
          sameAs: [
            "https://www.linkedin.com/in/theheroes-agency",
            "https://www.instagram.com/theheroes_agency",
            "https://www.tiktok.com/@theheroesagency",
            "https://www.facebook.com/share/18Hjqf3KRJ/",
            "https://x.com/moubarrac",
            "https://www.youtube.com/@TheHeroesAgencyorg",
          ],
        }}
      />
      <Navigation />
      <main>
        <HeroSection />
        <TrustMetrics />
        <Suspense fallback={<SectionFallback />}>
          <ServicesSection />
          <ProcessSection />
          <PortfolioSection />
          <WhyMeSection />
          <TestimonialsSection />
          <BlogSection />
          <ContactSection />
          <CTASection />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <LiveChat />
      </Suspense>
    </div>
  );
};

export default Index;
