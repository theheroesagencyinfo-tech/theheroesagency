import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ArrowUpRight, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuoteRequestDialog } from "@/components/QuoteRequestDialog";
import { useMouseGlow } from "@/hooks/useMouseGlow";

import retrospecImg from "@/assets/portfolio/retrospec-com.jpg";
import darntoughImg from "@/assets/portfolio/darntough-com.jpg";
import trndaImg from "@/assets/portfolio/trnda-com.jpg";
import weightliftingImg from "@/assets/portfolio/ukstore-weightliftinghouse-com.jpg";
import goondiwindiImg from "@/assets/portfolio/goondiwindicotton-com-au.jpg";
import nevuuImg from "@/assets/portfolio/www-nevuu-com.jpg";
import hhgImg from "@/assets/portfolio/hhgproducts-com.jpg";
import hatkayImg from "@/assets/portfolio/hatkay-com.jpg";
import haustierkostImg from "@/assets/portfolio/haustierkost-de.jpg";

import mDtcSkincare from "@/assets/portfolio/marketing/dtc-skincare-dashboard.jpg";
import mApparel from "@/assets/portfolio/marketing/apparel-relaunch-dashboard.jpg";
import mOutdoor from "@/assets/portfolio/marketing/outdoor-seo-ads.jpg";
import mPet from "@/assets/portfolio/marketing/pet-subscription-growth.jpg";
import aKlaviyo from "@/assets/portfolio/automation/klaviyo-flows.jpg";
import aOrderOps from "@/assets/portfolio/automation/order-ops-pipeline.jpg";
import aLeadRouting from "@/assets/portfolio/automation/lead-routing.jpg";
import aReviewUgc from "@/assets/portfolio/automation/review-ugc-engine.jpg";

type Project = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  meta?: string;
};

type Segment = {
  id: string;
  title: string;
  blurb: string;
  projects: Project[];
};

const segments: Segment[] = [
  {
    id: "shopify",
    title: "Shopify Website Design / Redesign",
    blurb:
      "Premium Shopify storefronts engineered for conversion — strategic UX, custom theme work and on-brand visuals.",
    projects: [
      { title: "Retrospec", description: "Outdoor & e-bike brand with quiz-driven product discovery.", image: retrospecImg, url: "https://retrospec.com" },
      { title: "Darn Tough", description: "Heritage merino socks — advanced filtering and subscriptions.", image: darntoughImg, url: "https://darntough.com" },
      { title: "TRNDA", description: "Luxury Egyptian-inspired watches with elegant showcases.", image: trndaImg, url: "https://trnda.com" },
      { title: "Weightlifting House", description: "Champion-endorsed athletic store with bundle system.", image: weightliftingImg, url: "https://ukstore.weightliftinghouse.com" },
      { title: "Goondiwindi Cotton", description: "Australian farm-to-fashion seasonal collections.", image: goondiwindiImg, url: "https://goondiwindicotton.com.au" },
      { title: "Nevuu", description: "Skincare brand with sleek photography and fast checkout.", image: nevuuImg, url: "https://www.nevuu.com" },
      { title: "HHG Products", description: "Hair business and mentorship platform with rich catalog.", image: hhgImg, url: "https://hhgproducts.com" },
      { title: "Hatkay", description: "Hair & lifestyle brand with on-brand storefront.", image: hatkayImg, url: "https://www.hatkay.com" },
      { title: "Haustierkost", description: "German pet food store with localized UX.", image: haustierkostImg, url: "https://www.haustierkost.de" },
    ],
  },
  {
    id: "marketing",
    title: "Marketing & Revenue Generated",
    blurb:
      "Performance campaigns, email/SMS flows and CRO experiments that turn traffic into reliable revenue.",
    projects: [
      { title: "DTC Skincare Scale-Up", description: "Paid social + lifecycle email program driving record-breaking returns on ad spend.", meta: "+312% ROAS in 90 days", image: mDtcSkincare },
      { title: "Apparel Brand Relaunch", description: "Full-funnel rebuild, creative testing and retention strategy across paid and owned channels.", meta: "$1.8M added in Y1", image: mApparel },
      { title: "Outdoor Equipment Brand", description: "SEO programme combined with Google & Meta ads and Klaviyo lifecycle flows.", meta: "4.2× LTV uplift", image: mOutdoor },
      { title: "Pet Nutrition Subscription", description: "Subscription acquisition + retention strategy with cohort-based optimisation.", meta: "+61% subscriber growth", image: mPet },
    ],
  },
  {
    id: "automation",
    title: "Automation Set-Up",
    blurb:
      "End-to-end automations for marketing, ops and customer experience — Klaviyo, Zapier, n8n and custom workflows.",
    projects: [
      { title: "Klaviyo Lifecycle Suite", description: "Welcome, browse abandon, post-purchase & win-back flows generating recurring revenue on autopilot.", image: aKlaviyo },
      { title: "Order Ops Automation", description: "Shopify ↔ 3PL ↔ accounting automated reconciliation cutting manual ops by 80%.", image: aOrderOps },
      { title: "Lead Routing Pipeline", description: "Forms → CRM → Slack → calendar booking, fully automated lead capture.", image: aLeadRouting },
      { title: "Review & UGC Engine", description: "Automated review collection + UGC asset routing into ad creative pipelines.", image: aReviewUgc },
    ],
  },
  {
    id: "ai-videos",
    title: "AI Commercial Videos",
    blurb:
      "AI-generated product commercials and brand films — fast-turnaround creative for ads and social.",
    projects: [
      { title: "Product Hero Spots", description: "15s & 30s AI-generated hero ads for Meta and TikTok." },
      { title: "Brand Story Films", description: "60–90s narrative films blending AI footage with brand assets." },
      { title: "Performance Creative Packs", description: "Batches of testable variants per campaign." },
      { title: "Founder/UGC Style AI", description: "AI avatars and scripts for high-volume UGC-style ads." },
    ],
  },
];

function ProjectTile({
  project,
  onImageClick,
}: {
  project: Project;
  onImageClick: (p: Project) => void;
}) {
  const ref = useMouseGlow<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="card-spotlight group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 block"
    >
      {project.image ? (
        <button
          type="button"
          onClick={() => onImageClick(project)}
          className="relative h-48 w-full overflow-hidden bg-muted block cursor-zoom-in"
          aria-label={`Open larger preview of ${project.title}`}
        >
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            width={1280}
            height={896}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
        </button>
      ) : (
        <div className="h-32 gradient-gold opacity-20" />
      )}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {project.description}
        </p>
        {project.meta && (
          <p className="text-sm font-semibold text-primary mt-3">{project.meta}</p>
        )}
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
          >
            Visit site <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}

const Portfolio = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState<string | undefined>();
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const openQuote = (segmentTitle: string) => {
    setActiveSegment(segmentTitle);
    setQuoteOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-12 relative">
          <div className="container px-4 md:px-6 text-center max-w-3xl mx-auto">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
              Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Work that <span className="text-gradient">moves the numbers</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse projects by service area. Found something close to what you need?
              Request a custom quote in any section.
            </p>
          </div>
        </section>

        {/* Segments */}
        <div className="container px-4 md:px-6 pb-24 space-y-24">
          {segments.map((segment, idx) => (
            <motion.section
              key={segment.id}
              id={segment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    {segment.title}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">{segment.blurb}</p>
                </div>
                <Button
                  onClick={() => openQuote(segment.title)}
                  className="gradient-gold text-primary-foreground font-semibold whitespace-nowrap hover:scale-105 transition-transform"
                >
                  Request a Quote for My Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segment.projects.map((p) => (
                  <ProjectTile key={p.title} project={p} onImageClick={setLightboxProject} />
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </main>
      <Footer />
      <QuoteRequestDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        segment={activeSegment}
      />

      {/* Lightbox */}
      <Dialog open={!!lightboxProject} onOpenChange={(o) => !o && setLightboxProject(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-background border-primary/20">
          {lightboxProject && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLightboxProject(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
              {lightboxProject.image && (
                <img
                  src={lightboxProject.image}
                  alt={`${lightboxProject.title} full preview`}
                  className="w-full h-auto max-h-[75vh] object-contain bg-black/40"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{lightboxProject.title}</h3>
                <p className="text-muted-foreground">{lightboxProject.description}</p>
                {lightboxProject.meta && (
                  <p className="text-primary font-semibold mt-3">{lightboxProject.meta}</p>
                )}
                {lightboxProject.url && (
                  <a
                    href={lightboxProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-primary hover:underline"
                  >
                    Visit site <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;
