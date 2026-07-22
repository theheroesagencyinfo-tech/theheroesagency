import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ImagePreload } from "@/components/ImagePreload";
import { FeaturedCase } from "@/components/portfolio/FeaturedCase";
import { ProjectCard, type PortfolioProject } from "@/components/portfolio/ProjectCard";

import takeletlooseImg from "@/assets/portfolio/takeletloose-com.webp";
import valevaImg from "@/assets/portfolio/valeva-shop.webp";
import velaxenImg from "@/assets/portfolio/velaxen-shop.webp";
import azureImg from "@/assets/portfolio/azureboutique-co.webp";
import gisouImg from "@/assets/portfolio/gisou-com.webp";

const projects: PortfolioProject[] = [
  {
    title: "Take Let Loose",
    category: "Gut Health · DTC",
    description:
      "Subscription-first supplement store with Recharge-powered repeat orders and a Klaviyo lifecycle engine driving 47% of monthly revenue.",
    metric: "$62–112K",
    metricLabel: "Monthly revenue",
    image: takeletlooseImg,
    url: "https://takeletloose.com",
  },
  {
    title: "Valeva",
    category: "Hair & Scalp Wellness",
    description:
      "Cinematic founder-led haircare flagship — high-trust review carousel and conversion-tuned PDPs.",
    metric: "+695%",
    metricLabel: "6-month growth",
    image: valevaImg,
    url: "https://valeva.shop",
  },
  {
    title: "Velaxen",
    category: "Cognitive Support",
    description:
      "Single-product nootropic store with a flash-sale funnel, benefit grid and 1M+ bottles shipped worldwide.",
    metric: "119K+",
    metricLabel: "Customers",
    image: velaxenImg,
    url: "https://velaxen.shop",
  },
  {
    title: "Azure Boutique",
    category: "Hair Growth (Batana)",
    description:
      "Quiz-led batana-oil brand with bundles, subscriptions and lifecycle flows powering rapid DTC scale.",
    metric: "253K",
    metricLabel: "Monthly visits",
    image: azureImg,
    url: "https://azureboutique.co",
  },
  {
    title: "Gisou",
    category: "Honey-Infused Beauty",
    description:
      "Iconic honey-infused haircare and lip oil flagship with editorial storytelling across EU and US.",
    metric: "$1.5M",
    metricLabel: "Peak monthly",
    image: gisouImg,
    url: "https://gisou.com",
  },
];

export function PortfolioSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const featured = projects[0];
  const secondary = projects.slice(1, 5);

  return (
    <section id="portfolio" className="py-24 md:py-32 relative">
      <ImagePreload srcs={projects.slice(0, 2).map((p) => p.image)} />
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header — magazine masthead */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mb-14 md:mb-20"
        >
          <div className="flex items-center gap-4 font-sans-ui text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="text-primary">Selected work</span>
            <span className="h-px w-10 bg-border" />
            <span>Vol. 001 — 2026</span>
          </div>
          <h2 className="mt-5 font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-foreground">
            Stores built to <em className="text-gradient not-italic">convert</em>,
            <br className="hidden md:block" /> not just look good.
          </h2>
          <p className="mt-6 font-sans-ui text-lg text-muted-foreground max-w-2xl leading-relaxed">
            A quiet catalogue of Shopify builds for DTC brands doing $20K–$1M / month.
            Every store below is live, indexed, and shipping orders today.
          </p>
        </motion.div>

        {/* Featured case */}
        <FeaturedCase
          project={featured}
          isVisible={isVisible}
          issueNumber="Case №01"
          metrics={[
            { value: featured.metric, label: featured.metricLabel },
            { value: "189+", label: "Verified reviews" },
            { value: "55.8K", label: "Monthly visits" },
          ]}
        />

        {/* Secondary grid — 2x2 */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {secondary.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              isVisible={isVisible}
              eager={i < 2}
            />
          ))}
        </div>

        {/* See More */}
        <div className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-border/50">
          <p className="font-sans-ui text-sm text-muted-foreground text-center sm:text-left">
            19 stores in the full catalogue —{" "}
            <span className="text-foreground">Shopify design, marketing systems &amp; automation</span>.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border/60 hover:border-primary/60 font-sans-ui font-medium px-8 py-6 text-base group"
          >
            <Link to="/portfolio">
              See the full portfolio
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
