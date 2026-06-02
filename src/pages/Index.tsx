import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { AchievementsMarquee } from "@/components/sections/AchievementsMarquee";
import { TrustMetrics } from "@/components/sections/TrustMetrics";
import { SEO } from "@/components/SEO";


// Lazy-load below-the-fold sections so they don't block the main thread on
// first paint. Each chunk loads as the user scrolls / when the browser is idle,
// dramatically reducing the longest-task duration (Max Potential FID).
const ServicesSection = lazy(() =>
  import("@/components/sections/ServicesSection").then((m) => ({ default: m.ServicesSection })),
);
const PerfectForSection = lazy(() =>
  import("@/components/sections/PerfectForSection").then((m) => ({ default: m.PerfectForSection })),
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

const DeferredBelowFold = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [observerReady, setObserverReady] = useState(false);

  // Wait until the browser is idle after first paint before even attaching
  // the IntersectionObserver. This keeps below-the-fold network requests
  // (Supabase queries from lazy sections) out of the critical request chain.
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setObserverReady(true), { timeout: 1000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = globalThis.setTimeout(() => setObserverReady(true), 300);
    return () => globalThis.clearTimeout(id);
  }, []);

  useEffect(() => {
    const current = ref.current;
    if (!current || shouldLoad || !observerReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [shouldLoad, observerReady]);

  return <div ref={ref}>{shouldLoad ? children : <SectionFallback />}</div>;
};

const Index = () => {
  const [chatReady, setChatReady] = useState(false);

  // Defer LiveChat mount until the browser is idle so it never competes
  // with hero hydration / first interaction for main-thread time.
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setChatReady(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = globalThis.setTimeout(() => setChatReady(true), 1200);
    return () => globalThis.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Shopify Expert: Store Design & Optimization | TheHeroes"
        description="Senior Shopify expert for store design, website fixes, speed and conversion optimization, and DTC marketing. Book a free strategy call with The Heroes Agency."
        canonical="https://www.theheroesagency.org/"
        image="https://www.theheroesagency.org/og-home.jpg"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "The Heroes Agency",
            url: "https://www.theheroesagency.org/",
            email: "theheroesagency.info@gmail.com",
            description:
              "Shopify expert agency for store design, website fixes, speed and conversion optimization, and DTC marketing.",
            areaServed: "Worldwide",
            knowsAbout: [
              "Shopify",
              "Shopify Plus",
              "Shopify store design",
              "Shopify optimization",
              "Shopify website fix",
              "Conversion rate optimization",
              "DTC marketing",
            ],
            sameAs: [
              "https://www.linkedin.com/in/theheroes-agency",
              "https://www.instagram.com/theheroes_agency",
              "https://www.tiktok.com/@theheroesagency",
              "https://www.facebook.com/share/18Hjqf3KRJ/",
              "https://x.com/moubarrac",
              "https://www.youtube.com/@TheHeroesAgencyorg",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "The Heroes Agency",
            url: "https://www.theheroesagency.org/",
          },
        ]}
      />
      <Navigation />
      <main>
        <HeroSection />
        <AchievementsMarquee />
        <TrustMetrics />
        <DeferredBelowFold>
          <Suspense fallback={<SectionFallback />}>
            <ServicesSection />
            <PerfectForSection />
            <ProcessSection />
            <PortfolioSection />
            <WhyMeSection />
            <TestimonialsSection />
            <BlogSection />
            <ContactSection />
            <CTASection />
          </Suspense>
        </DeferredBelowFold>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      {chatReady && (
        <Suspense fallback={null}>
          <LiveChat />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
