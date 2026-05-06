import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuoteRequestDialog } from "@/components/QuoteRequestDialog";
import { useMouseGlow } from "@/hooks/useMouseGlow";
import { LazyImage } from "@/components/LazyImage";

import retrospecImg from "@/assets/portfolio/retrospec-com.webp";
import darntoughImg from "@/assets/portfolio/darntough-com.webp";
import trndaImg from "@/assets/portfolio/trnda-com.webp";
import weightliftingImg from "@/assets/portfolio/ukstore-weightliftinghouse-com.webp";
import goondiwindiImg from "@/assets/portfolio/goondiwindicotton-com-au.webp";
import hhgImg from "@/assets/portfolio/hhgproducts-com.webp";
import hatkayImg from "@/assets/portfolio/hatkay-com.webp";
import haustierkostImg from "@/assets/portfolio/haustierkost-de.webp";

// New featured projects (top of portfolio)
import takeletlooseImg from "@/assets/portfolio/takeletloose-com.webp";
import valevaImg from "@/assets/portfolio/valeva-shop.webp";
import velaxenImg from "@/assets/portfolio/velaxen-shop.webp";
import milolabImg from "@/assets/portfolio/milolabco-com.webp";
import azureImg from "@/assets/portfolio/azureboutique-co.webp";
import gisouImg from "@/assets/portfolio/gisou-com.webp";
import getrenuImg from "@/assets/portfolio/getrenu-com.webp";
import trimtasteImg from "@/assets/portfolio/trimtaste-com.webp";
import nurricoImg from "@/assets/portfolio/nurrico-com.webp";
import primaledgeImg from "@/assets/portfolio/buy-primaledge-com.webp";
import luxurypillowsImg from "@/assets/portfolio/luxurypillows-co.webp";

// Generic marketing visuals (legacy) — replaced with real brand case studies below

// Real brand marketing case studies
import mLetLoose from "@/assets/portfolio/marketing/brands/letloose.webp";
import mValeva from "@/assets/portfolio/marketing/brands/valeva.webp";
import mMiloLab from "@/assets/portfolio/marketing/brands/milolab.webp";
import mAzure from "@/assets/portfolio/marketing/brands/azure.webp";
import mVelaxen from "@/assets/portfolio/marketing/brands/velaxen.webp";
import mRenu from "@/assets/portfolio/marketing/brands/renu.webp";
import mTrimTaste from "@/assets/portfolio/marketing/brands/trimtaste.webp";
import mNurri from "@/assets/portfolio/marketing/brands/nurri.webp";
import mPrimalEdge from "@/assets/portfolio/marketing/brands/primaledge.webp";
import mLuxuryPillows from "@/assets/portfolio/marketing/brands/luxurypillows.webp";
import mGisou from "@/assets/portfolio/marketing/brands/gisou.webp";
import mHealora from "@/assets/portfolio/marketing/brands/healora.webp";
import aKlaviyoFlow1 from "@/assets/portfolio/automation/klaviyo-flow-1.webp";
import aKlaviyoFlow2 from "@/assets/portfolio/automation/klaviyo-flow-2.webp";
import aSocialPublisher from "@/assets/portfolio/automation/social-publisher.webp";
import aRecruitingMail from "@/assets/portfolio/automation/recruiting-mail.webp";
import aSocialFactory from "@/assets/portfolio/automation/social-factory.webp";

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
  images?: string[];
  url?: string;
  meta?: string;
  fit?: "cover" | "contain";
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
      { title: "Take Let Loose — Gut Health Supplement", description: "Subscription-led DTC funnel for an oxygenated-magnesium daily capsule. Paid social + Klaviyo lifecycle flows scaled subscriber base while driving 189+ verified reviews.", meta: "$62K–$112K /mo revenue · 55.8K monthly visits · 456 active Meta ads", image: mLetLoose, fit: "contain" },
      { title: "Valeva — Golden Hair Growth Oil", description: "Premium hair & scalp brand with cinematic PDP, refill subscription and Meta-ads creative testing engine generating consistent month-over-month growth.", meta: "$13K–$23K /mo revenue · 25K monthly visits · +695% 6-month growth", image: mValeva, fit: "contain" },
      { title: "Milo Lab Co. — Pet Dental Spray", description: "Single-product dental health funnel for dogs & cats. Vet-led storytelling, urgency-driven offer stack and free-gift bundles paired with Meta ads.", meta: "$15K–$27K /mo revenue · 9,963 verified reviews · 4.8★ rating", image: mMiloLab, fit: "contain" },
      { title: "Azure Boutique — Batana Hair Conditioner", description: "Quiz-led discovery + bundle PDP with dermatologist-credibility positioning. Paid social and influencer creative drove explosive scale through Q1.", meta: "$340K–$617K /mo revenue · 253K monthly visits · +213% 6-month growth", image: mAzure, fit: "contain" },
      { title: "Velaxen — Cognitive Boost Supplement", description: "Flash-sale, urgency-driven single-product funnel with bundle offers and free-gift stack. Built for high-volume Meta-ads scaling.", meta: "119,293 customers · 4.9★ rating · 1M+ bottles sold worldwide", image: mVelaxen, fit: "contain" },
      { title: "ReNu FreshFur — Waterless Pet Grooming", description: "Bundle-based PDP with 'Most Popular' & 'Best Value' framing, mist-refill subscription and lifecycle email program built for retention.", meta: "$83K–$151K /mo revenue · 86K monthly visits · 45,578 verified reviews", image: mRenu, fit: "contain" },
      { title: "Trim Taste — Cutting Drink Mix", description: "Berberine + Yerba Mate weight-management brand. Buy-more-save-more bundles, subscription option and benefit-led ad creatives.", meta: "$50K–$91K /mo revenue · 49.6K monthly visits · 8,258 reviews", image: mTrimTaste, fit: "contain" },
      { title: "Nurri — Men's Pheromone Gummies", description: "Buy-1-Get-1 stacked-offer funnel with auto-refill subscription. Bold packaging-first creative scaled across Meta and TikTok.", meta: "$267K–$485K /mo revenue · 180K monthly visits · 5,066 reviews", image: mNurri, fit: "contain" },
      { title: "Primal Edge — Bison Testosterone Booster", description: "Long-form editorial PDP with clinical positioning and bundle ladder (Buy 2 Get 1 / Buy 3 Get 2). 50,000+ customers acquired through Meta + Google.", meta: "$27K–$49K /mo revenue · +2,728% 1-month growth · 4.8★ rating", image: mPrimalEdge, fit: "contain" },

      // Featured large-scale brand case studies
      { title: "Gisou — Honey-Infused Haircare", description: "Global haircare flagship scaled with Meta + Google + TikTok creative testing engine, lifecycle email and influencer-led storytelling. Editorial PDPs and bundle-led AOV strategy across EU & US.", meta: "$799K–$1.5M /mo revenue · 320,500 monthly visits · 286 active ads", image: mGisou, fit: "contain" },
      { title: "Healora — Wellness DTC Brand", description: "Rapid-growth health & wellness store scaled from launch to 90K monthly visits in 6 months. Aggressive Meta-ads testing, lifecycle flows and conversion-optimized PDPs.", meta: "$151K–$274K /mo revenue · 90,428 monthly visits · +17.5% 7-day growth", image: mHealora, fit: "contain" },
      { title: "Luxury Pillows — Premium Sleep Brand", description: "Goose-down luxury pillow brand with sale-driven hero, urgency timer and streamlined single-SKU funnel. Meta-ads creative testing across EU & UK markets.", meta: "$45K–$81K /mo revenue · 18,222 monthly visits · 48 active Meta ads", image: mLuxuryPillows, fit: "contain" },

    ],
  },
  {
    id: "automation",
    title: "Automation Set-Up",
    blurb:
      "End-to-end automations for marketing, ops and customer experience — Klaviyo, Make, n8n and custom workflows.",
    platforms: [
      { name: "Klaviyo", svg: klaviyoSvg },
      { name: "Make", logo: makeLogo },
      { name: "n8n", logo: n8nLogo },
    ],
    projects: [
      {
        title: "Klaviyo Post-Purchase Lifecycle Engine",
        description: "Built and launched a fully-automated post-purchase Klaviyo flow segmenting new, repeat and loyal customers — triggering thank-you, 2nd-purchase incentives, cross-sell + discount and review-request emails on the perfect cadence. Result: $337K in attributed email revenue (47% of total store revenue) in a single 30-day window with zero manual sends.",
        meta: "$337,952 attributed revenue (47.13% of total) · +25% vs prior period · 100% email-driven",
        images: [aKlaviyoFlow1, aKlaviyoFlow2],
        fit: "contain",
      },
      {
        title: "Multi-Platform Social Posting Scheduler",
        description: "n8n workflow that pulls a WordPress post, generates platform-tailored captions + AI images via OpenRouter, and auto-publishes to X, LinkedIn, Facebook and Instagram on a set schedule — with logging back into Google Sheets. Replaces a full social-media manager and ships consistent, on-brand content daily.",
        meta: "4 platforms automated · Daily posts on autopilot · 90% time saved",
        image: aSocialPublisher,
        fit: "contain",
      },
      {
        title: "Recruiting Agency — Email Outreach Automation",
        description: "End-to-end recruiting pipeline: webhook captures candidate data → image hosted via imgbb → record created in Airtable → personalised Gmail follow-ups + Telegram alerts to recruiters. Daily scheduled job re-engages stale candidates automatically.",
        meta: "Built for a recruiting agency · 100% hands-off candidate follow-up · Airtable + Gmail + Telegram",
        image: aRecruitingMail,
        fit: "contain",
      },
      {
        title: "AI Social Media Content Factory",
        description: "Enterprise-grade n8n agent: a Social Media Router Agent generates posts across X, Instagram, Facebook, LinkedIn, Threads & YouTube Shorts. Includes AI caption generation, dynamic image creation, human-in-the-loop email approval, Google Drive archiving and full analytics reporting back to Gmail. Drives consistent high-engagement posting at zero ongoing labour cost.",
        meta: "6 platforms · AI captions + visuals · Approval gating · High-engagement output",
        image: aSocialFactory,
        fit: "contain",
      },
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
      { title: "AI Commercial — Spot 01", description: "High-impact AI-generated product commercial built for paid social. Shot-by-shot direction, motion and grading delivered in days, not weeks.", url: "https://youtube.com/shorts/AeEZySYJrz4" },
      { title: "AI Commercial — Spot 02", description: "Cinematic AI brand spot engineered to stop the scroll on Reels, TikTok and Shorts.", url: "https://youtube.com/shorts/_ljd9oG7XA0" },
      { title: "AI Commercial — Spot 03", description: "Bold, conversion-tuned AI commercial — punchy hook, product-first storytelling, ready-to-launch creative.", url: "https://youtube.com/shorts/k7gwXiEoNBo" },
      { title: "AI Commercial — Spot 04", description: "Premium AI brand film with photoreal product visuals and editorial pacing.", url: "https://youtu.be/vFYi5BDqbog" },
      { title: "AI Commercial — Spot 05", description: "AI-generated launch creative built for performance — engineered around hook, demo and CTA.", url: "https://youtu.be/4cEzhOXqEX8" },
      { title: "AI Commercial — Spot 06", description: "Photoreal AI commercial with cinematic lighting and brand-grade motion design.", url: "https://youtu.be/8HI8OSllL4U" },
      { title: "AI Commercial — Spot 07", description: "Story-led AI commercial blending lifestyle visuals with high-end product shots.", url: "https://youtu.be/CDZLI5RkQk4" },
      { title: "AI Commercial — Spot 08", description: "Scroll-stopping AI ad creative built to drive clicks, sign-ups and sales across Meta, TikTok and YouTube.", url: "https://youtu.be/Wp_Men64gdY" },
    ],
  },
];

// Helper: extract YouTube video id from any youtube/shorts/youtu.be URL
const ytId = (url?: string): string | null => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|shorts\/|v=)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

function ProjectTile({
  project,
  onImageClick,
}: {
  project: Project;
  onImageClick: (p: Project) => void;
}) {
  const ref = useMouseGlow<HTMLDivElement>();
  const gallery = project.images && project.images.length > 0 ? project.images : project.image ? [project.image] : [];
  const [slide, setSlide] = useState(0);
  const hasSlider = gallery.length > 1;
  const isContain = project.fit === "contain";
  const fitClass = isContain ? "object-contain" : "object-cover object-top";
  // Contain (marketing/automation screenshots) → natural image ratio so the full
  // thumbnail is visible at every breakpoint without any crop or hover zoom.
  const mediaClass = isContain
    ? "relative w-full overflow-hidden bg-muted block cursor-zoom-in"
    : "relative h-56 w-full overflow-hidden bg-muted block cursor-zoom-in";
  const imageClass = isContain
    ? "w-full h-auto object-contain bg-background"
    : `w-full h-full ${fitClass} transition-transform duration-700 group-hover:scale-105 bg-background`;
  // Reserve layout space using the image's intrinsic aspect ratio for "contain"
  // tiles so lazy-loaded screenshots don't cause CLS.
  const NATURAL_W = 1280;
  const NATURAL_H = 800; // good average for marketing/automation captures
  const containerStyle = isContain
    ? { aspectRatio: `${NATURAL_W} / ${NATURAL_H}` }
    : undefined;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlide((s) => (s + 1) % gallery.length);
  };
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlide((s) => (s - 1 + gallery.length) % gallery.length);
  };

  const videoId = ytId(project.url);
  const isVideo = !!videoId && !project.image && !project.images;

  return (
    <div
      ref={ref}
      className="card-spotlight group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 block"
    >
      {isVideo ? (
        <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "9 / 16" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
            title={project.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : gallery.length > 0 ? (
        <button
          type="button"
          onClick={() => onImageClick({ ...project, image: gallery[slide] })}
          className={mediaClass}
          style={containerStyle}
          aria-label={`Open larger preview of ${project.title}`}
        >
          <img
            src={gallery[slide]}
            alt={`${project.title} preview ${slide + 1}`}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            width={NATURAL_W}
            height={isContain ? NATURAL_H : 896}
            className={imageClass}
          />
          {project.fit !== "contain" && (
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent pointer-events-none" />
          )}
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ExternalLink className="w-4 h-4 text-primary" />
          </div>
          {hasSlider && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-primary" : "w-1.5 bg-foreground/40"}`}
                  />
                ))}
              </div>
            </>
          )}
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
        {project.url && !isVideo && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
          >
            Visit site <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
        {isVideo && project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:underline"
          >
            Watch on YouTube <ArrowUpRight className="w-4 h-4" />
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
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const lbGallery = lightboxProject
    ? lightboxProject.images && lightboxProject.images.length > 0
      ? lightboxProject.images
      : lightboxProject.image
        ? [lightboxProject.image]
        : []
    : [];
  const openLightbox = (p: Project) => {
    setLightboxProject(p);
    // If a specific image was passed (from tile slider), start at that index
    const all = p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : [];
    const idx = p.image ? Math.max(0, all.indexOf(p.image)) : 0;
    setLightboxIndex(idx);
  };

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
                  <ProjectTile key={p.title} project={p} onImageClick={openLightbox} />
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
              {lbGallery.length > 0 && (
                <div className="relative bg-black/40">
                  <img
                    src={lbGallery[lightboxIndex]}
                    alt={`${lightboxProject.title} full preview ${lightboxIndex + 1}`}
                    className="w-full h-auto max-h-[75vh] object-contain"
                  />
                  {lbGallery.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex((i) => (i - 1 + lbGallery.length) % lbGallery.length)}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex((i) => (i + 1) % lbGallery.length)}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full glass border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-foreground" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {lbGallery.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setLightboxIndex(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={`h-2 rounded-full transition-all ${i === lightboxIndex ? "w-6 bg-primary" : "w-2 bg-foreground/40"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
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
