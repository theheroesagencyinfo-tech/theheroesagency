import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustMetrics } from "@/components/sections/TrustMetrics";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { WhyMeSection } from "@/components/sections/WhyMeSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";
import { LiveChat } from "@/components/LiveChat";
import { SEO } from "@/components/SEO";

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
        <ServicesSection />
        <ProcessSection />
        <PortfolioSection />
        <WhyMeSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
      <LiveChat />
    </div>
  );
};

export default Index;
