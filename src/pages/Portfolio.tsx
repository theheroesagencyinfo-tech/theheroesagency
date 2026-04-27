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
import hhgImg from "@/assets/portfolio/hhgproducts-com.jpg";
import hatkayImg from "@/assets/portfolio/hatkay-com.jpg";
import haustierkostImg from "@/assets/portfolio/haustierkost-de.jpg";

// New featured projects (top of portfolio)
import takeletlooseImg from "@/assets/portfolio/takeletloose-com.png";
import valevaImg from "@/assets/portfolio/valeva-shop.png";
import velaxenImg from "@/assets/portfolio/velaxen-shop.png";
import milolabImg from "@/assets/portfolio/milolabco-com.png";
import azureImg from "@/assets/portfolio/azureboutique-co.png";
import gisouImg from "@/assets/portfolio/gisou-com.png";
import getrenuImg from "@/assets/portfolio/getrenu-com.png";
import trimtasteImg from "@/assets/portfolio/trimtaste-com.png";
import nurricoImg from "@/assets/portfolio/nurrico-com.png";
import primaledgeImg from "@/assets/portfolio/buy-primaledge-com.png";
import luxurypillowsImg from "@/assets/portfolio/luxurypillows-co.png";

// Generic marketing visuals (legacy) — replaced with real brand case studies below

// Real brand marketing case studies
import mLetLoose from "@/assets/portfolio/marketing/brands/letloose.jpg";
import mValeva from "@/assets/portfolio/marketing/brands/valeva.jpg";
import mMiloLab from "@/assets/portfolio/marketing/brands/milolab.jpg";
import mAzure from "@/assets/portfolio/marketing/brands/azure.jpg";
import mVelaxen from "@/assets/portfolio/marketing/brands/velaxen.jpg";
import mRenu from "@/assets/portfolio/marketing/brands/renu.jpg";
import mTrimTaste from "@/assets/portfolio/marketing/brands/trimtaste.jpg";
import mNurri from "@/assets/portfolio/marketing/brands/nurri.jpg";
import mPrimalEdge from "@/assets/portfolio/marketing/brands/primaledge.jpg";
import mLuxuryPillows from "@/assets/portfolio/marketing/brands/luxurypillows.jpg";
import mGisou from "@/assets/portfolio/marketing/brands/gisou.jpg";
import mHealora from "@/assets/portfolio/marketing/brands/healora.jpg";
import aKlaviyo from "@/assets/portfolio/automation/klaviyo-flows.jpg";
import aOrderOps from "@/assets/portfolio/automation/order-ops-pipeline.jpg";
import aLeadRouting from "@/assets/portfolio/automation/lead-routing.jpg";
import aReviewUgc from "@/assets/portfolio/automation/review-ugc-engine.jpg";

// Platform logos — colored brand SVGs as <img>
import shopifyLogo from "@/assets/logos/shopify.svg";
import facebookLogo from "@/assets/logos/facebook.svg";
import instagramLogo from "@/assets/logos/instagram.svg";
import xLogo from "@/assets/logos/x.svg";
import googleAdsLogo from "@/assets/logos/googleads.svg";
import pinterestLogo from "@/assets/logos/pinterest.svg";
import makeLogo from "@/assets/logos/make.svg";
import n8nLogo from "@/assets/logos/n8n.svg";


// Wordmark logos rendered inline so they inherit currentColor (works in light + dark theme)
import klaviyoSvg from "@/assets/logos/klaviyo.svg?raw";
import soraSvg from "@/assets/logos/sora.svg?raw";
import grokSvg from "@/assets/logos/grok.svg?raw";
import geminiSvg from "@/assets/logos/gemini.svg?raw";
import klingSvg from "@/assets/logos/kling.svg?raw";
import higgsfieldSvg from "@/assets/logos/higgsfield.svg?raw";

type Project = {
  title: string;
  description: string;
  image?: string;
  url?: string;
  meta?: string;
};

type Platform = { name: string; logo?: string; svg?: string };

type Segment = {
  id: string;
  title: string;
  blurb: string;
  platforms?: Platform[];
  projects: Project[];
};

const segments: Segment[] = [
  {
    id: "shopify",
    title: "Shopify Website Design / Redesign",
    blurb:
      "Premium Shopify storefronts engineered for conversion — strategic UX, custom theme work and on-brand visuals.",
    platforms: [{ name: "Shopify", logo: shopifyLogo }],
    projects: [
      // New featured projects pushed to the top
      { title: "Take Let Loose", description: "DTC gut-health supplement brand. Bold typography, subscription quiz and Recharge integration drive repeat orders.", image: takeletlooseImg, url: "https://takeletloose.com" },
      { title: "Valeva", description: "Premium hair & scalp wellness brand. Cinematic hero, founder story and high-trust review carousel built for conversion.", image: valevaImg, url: "https://valeva.shop" },
      { title: "Velaxen", description: "Cognitive support supplement store with flash-sale urgency, benefit grid and a high-converting single-product funnel.", image: velaxenImg, url: "https://velaxen.shop" },
      { title: "Milo Lab Co.", description: "Premium pet care brand with editorial cinematography, single-hero CTA and a polished checkout experience.", image: milolabImg, url: "https://milolabco.com" },
      { title: "Azure Boutique", description: "Batana-oil hair-growth brand. Quiz-led discovery, bundles and lifecycle flows powering a fast-scaling DTC store.", image: azureImg, url: "https://azureboutique.co" },
      { title: "Gisou", description: "Honey-infused haircare flagship. Editorial storytelling, lip & hair collections and conversion-tuned PDPs.", image: gisouImg, url: "https://gisou.com" },
      { title: "ReNu (getrenu)", description: "Vet-recommended pet grooming brand — FreshFur brush + cleansing mist with bundle upsells and subscription management.", image: getrenuImg, url: "https://getrenu.com" },
      { title: "Trim Taste", description: "Berberine + Yerba Mate cutting-mix supplement. Editorial PDP, social proof and benefit-led funnel built for paid traffic.", image: trimtasteImg, url: "https://trimtaste.com" },
      { title: "Nurri", description: "Pheromone gummy brand with playful identity, single-product funnel and subscription management built in.", image: nurricoImg, url: "https://www.nurrico.com" },
      { title: "Primal Edge", description: "Bison organ supplement with editorial long-form PDP, ancestral storytelling and premium typography system.", image: primaledgeImg, url: "https://buy-primaledge.com" },
      { title: "Luxury Pillows", description: "Premium goose-down pillow brand. Sale-driven hero, social proof and a streamlined single-SKU funnel.", image: luxurypillowsImg, url: "https://luxurypillows.co" },

      // Original featured projects
      { title: "Retrospec", description: "Outdoor & e-bike brand with quiz-driven product discovery.", image: retrospecImg, url: "https://retrospec.com" },
      { title: "Darn Tough", description: "Heritage merino socks — advanced filtering and subscriptions.", image: darntoughImg, url: "https://darntough.com" },
      { title: "TRNDA", description: "Luxury Egyptian-inspired watches with elegant showcases.", image: trndaImg, url: "https://trnda.com" },
      { title: "Weightlifting House", description: "Champion-endorsed athletic store with bundle system.", image: weightliftingImg, url: "https://ukstore.weightliftinghouse.com" },
      { title: "Goondiwindi Cotton", description: "Australian farm-to-fashion seasonal collections.", image: goondiwindiImg, url: "https://goondiwindicotton.com.au" },
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
    platforms: [
      { name: "Facebook", logo: facebookLogo },
      { name: "Instagram", logo: instagramLogo },
      { name: "X", logo: xLogo },
      { name: "Google Ads", logo: googleAdsLogo },
      { name: "Pinterest", logo: pinterestLogo },
    ],
    projects: [
      // Real brand campaigns (featured)
      { title: "Take Let Loose — Gut Health Supplement", description: "Subscription-led DTC funnel for an oxygenated-magnesium daily capsule. Paid social + Klaviyo lifecycle flows scaled subscriber base while driving 189+ verified reviews.", meta: "$62K–$112K /mo revenue · 55.8K monthly visits · 456 active Meta ads", image: mLetLoose },
      { title: "Valeva — Golden Hair Growth Oil", description: "Premium hair & scalp brand with cinematic PDP, refill subscription and Meta-ads creative testing engine generating consistent month-over-month growth.", meta: "$13K–$23K /mo revenue · 25K monthly visits · +695% 6-month growth", image: mValeva },
      { title: "Milo Lab Co. — Pet Dental Spray", description: "Single-product dental health funnel for dogs & cats. Vet-led storytelling, urgency-driven offer stack and free-gift bundles paired with Meta ads.", meta: "$15K–$27K /mo revenue · 9,963 verified reviews · 4.8★ rating", image: mMiloLab },
      { title: "Azure Boutique — Batana Hair Conditioner", description: "Quiz-led discovery + bundle PDP with dermatologist-credibility positioning. Paid social and influencer creative drove explosive scale through Q1.", meta: "$340K–$617K /mo revenue · 253K monthly visits · +213% 6-month growth", image: mAzure },
      { title: "Velaxen — Cognitive Boost Supplement", description: "Flash-sale, urgency-driven single-product funnel with bundle offers and free-gift stack. Built for high-volume Meta-ads scaling.", meta: "119,293 customers · 4.9★ rating · 1M+ bottles sold worldwide", image: mVelaxen },
      { title: "ReNu FreshFur — Waterless Pet Grooming", description: "Bundle-based PDP with 'Most Popular' & 'Best Value' framing, mist-refill subscription and lifecycle email program built for retention.", meta: "$83K–$151K /mo revenue · 86K monthly visits · 45,578 verified reviews", image: mRenu },
      { title: "Trim Taste — Cutting Drink Mix", description: "Berberine + Yerba Mate weight-management brand. Buy-more-save-more bundles, subscription option and benefit-led ad creatives.", meta: "$50K–$91K /mo revenue · 49.6K monthly visits · 8,258 reviews", image: mTrimTaste },
      { title: "Nurri — Men's Pheromone Gummies", description: "Buy-1-Get-1 stacked-offer funnel with auto-refill subscription. Bold packaging-first creative scaled across Meta and TikTok.", meta: "$267K–$485K /mo revenue · 180K monthly visits · 5,066 reviews", image: mNurri },
      { title: "Primal Edge — Bison Testosterone Booster", description: "Long-form editorial PDP with clinical positioning and bundle ladder (Buy 2 Get 1 / Buy 3 Get 2). 50,000+ customers acquired through Meta + Google.", meta: "$27K–$49K /mo revenue · +2,728% 1-month growth · 4.8★ rating", image: mPrimalEdge },

      // Featured large-scale brand case studies
      { title: "Gisou — Honey-Infused Haircare", description: "Global haircare flagship scaled with Meta + Google + TikTok creative testing engine, lifecycle email and influencer-led storytelling. Editorial PDPs and bundle-led AOV strategy across EU & US.", meta: "$799K–$1.5M /mo revenue · 320,500 monthly visits · 286 active ads", image: mGisou },
      { title: "Healora — Wellness DTC Brand", description: "Rapid-growth health & wellness store scaled from launch to 90K monthly visits in 6 months. Aggressive Meta-ads testing, lifecycle flows and conversion-optimized PDPs.", meta: "$151K–$274K /mo revenue · 90,428 monthly visits · +17.5% 7-day growth", image: mHealora },
      { title: "Luxury Pillows — Premium Sleep Brand", description: "Goose-down luxury pillow brand with sale-driven hero, urgency timer and streamlined single-SKU funnel. Meta-ads creative testing across EU & UK markets.", meta: "$45K–$81K /mo revenue · 18,222 monthly visits · 48 active Meta ads", image: mLuxuryPillows },

    ],
  },
  {
    id: "automation",
    title: "Automation Set-Up",
    blurb:
      "End-to-end automations for marketing, ops and customer experience — Klaviyo, Zapier, n8n and custom workflows.",
    platforms: [
      { name: "Klaviyo", svg: klaviyoSvg },
      { name: "Make", logo: makeLogo },
      { name: "n8n", logo: n8nLogo },
    ],
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
    platforms: [
      { name: "Sora", svg: soraSvg },
      { name: "Grok", svg: grokSvg },
      { name: "Gemini", svg: geminiSvg },
      { name: "Higgsfield", svg: higgsfieldSvg },
      { name: "Kling", svg: klingSvg },
    ],
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
                  {segment.platforms && segment.platforms.length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mr-1">
                        Supported {segment.platforms.length === 1 ? "Platform" : "Platforms"}:
                      </span>
                      {segment.platforms.map((p) => (
                        <span
                          key={p.name}
                          title={p.name}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/10 hover:border-primary/30 transition-colors"
                        >
                          {p.svg ? (
                            <span
                              aria-label={`${p.name} logo`}
                              className="inline-flex items-center text-foreground h-4 sm:h-5 [&>svg]:h-full [&>svg]:w-auto"
                              dangerouslySetInnerHTML={{ __html: p.svg }}
                            />
                          ) : (
                            <img
                              src={p.logo}
                              alt={`${p.name} logo`}
                              loading="lazy"
                              className="h-4 w-auto sm:h-5 object-contain"
                            />
                          )}
                          <span className="text-xs sm:text-sm font-medium text-foreground/90">
                            {p.name}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
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
