import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
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

const projects = [
  // New featured projects pushed to the top
  {
    title: "Take Let Loose",
    category: "Gut Health DTC",
    description: "Bold supplement brand with subscription-first design, playful typography and Recharge-powered repeat orders.",
    results: "DTC Supplement Brand",
    image: takeletlooseImg,
    url: "https://takeletloose.com",
  },
  {
    title: "Valeva",
    category: "Hair & Scalp Wellness",
    description: "Cinematic, founder-led haircare flagship with high-trust review carousel and conversion-tuned PDPs.",
    results: "Premium Haircare Brand",
    image: valevaImg,
    url: "https://valeva.shop",
  },
  {
    title: "Velaxen",
    category: "Cognitive Support",
    description: "Single-product nootropic store with flash-sale urgency, benefit grid and a high-converting funnel.",
    results: "Nootropic Brand",
    image: velaxenImg,
    url: "https://velaxen.shop",
  },
  {
    title: "Milo Lab Co.",
    category: "Premium Pet Care",
    description: "Editorial pet-care brand with cinematic hero, single-CTA layout and a polished checkout experience.",
    results: "12,000+ Sold",
    image: milolabImg,
    url: "https://milolabco.com",
  },
  {
    title: "Azure Boutique",
    category: "Hair Growth (Batana)",
    description: "Quiz-led batana-oil brand with bundles, subscriptions and lifecycle flows powering rapid DTC scale.",
    results: "Fast-Scaling DTC",
    image: azureImg,
    url: "https://azureboutique.co",
  },
  {
    title: "Gisou",
    category: "Honey-Infused Beauty",
    description: "Iconic honey-infused haircare and lip oil flagship with editorial storytelling and immersive PDPs.",
    results: "Global Beauty Brand",
    image: gisouImg,
    url: "https://gisou.com",
  },
  {
    title: "ReNu",
    category: "Pet Grooming",
    description: "Vet-recommended FreshFur brush + cleansing mist store with bundle upsells and subscription management.",
    results: "45K+ Reviews",
    image: getrenuImg,
    url: "https://getrenu.com",
  },
  {
    title: "Trim Taste",
    category: "Weight & Metabolism",
    description: "Berberine + Yerba Mate cutting-mix brand with editorial PDP, social proof and benefit-led funnel.",
    results: "8,200+ Reviews",
    image: trimtasteImg,
    url: "https://trimtaste.com",
  },
  {
    title: "Nurri",
    category: "Pheromone Gummies",
    description: "Playful single-product wellness brand with subscription management and a confident visual identity.",
    results: "Single-Product DTC",
    image: nurricoImg,
    url: "https://www.nurrico.com",
  },
  {
    title: "Primal Edge",
    category: "Ancestral Supplements",
    description: "Bison organ supplement with editorial long-form PDP, ancestral storytelling and premium typography.",
    results: "12,800+ Verified Reviews",
    image: primaledgeImg,
    url: "https://buy-primaledge.com",
  },
  {
    title: "Luxury Pillows",
    category: "Premium Sleep",
    description: "Goose-down pillow brand with sale-driven hero, social proof and a streamlined single-SKU funnel.",
    results: "47,000+ Sleepers",
    image: luxurypillowsImg,
    url: "https://luxurypillows.co",
  },

  // Original featured projects
  {
    title: "Retrospec",
    category: "Bikes & Outdoor",
    description: "E-bikes, paddle boards, and outdoor gear with intuitive product quizzes and seamless shopping experience.",
    results: "Adventure Lifestyle Brand",
    image: retrospecImg,
    url: "https://retrospec.com",
  },
  {
    title: "Darn Tough",
    category: "Premium Socks",
    description: "Vermont-made merino wool socks with lifetime guarantee. Advanced filtering and subscription options.",
    results: "Lifetime Warranty Leader",
    image: darntoughImg,
    url: "https://darntough.com",
  },
  {
    title: "TRNDA",
    category: "Luxury Watches",
    description: "Egyptian-inspired timepiece collections with elegant product showcases and global shipping integration.",
    results: "Premium Watch Brand",
    image: trndaImg,
    url: "https://trnda.com",
  },
  {
    title: "Weightlifting House",
    category: "Athletic Apparel",
    description: "Official IWF streaming partner's store featuring champion-endorsed gear with 3-for-2 bundle system.",
    results: "70K+ Orders Shipped",
    image: weightliftingImg,
    url: "https://ukstore.weightliftinghouse.com",
  },
  {
    title: "Goondiwindi Cotton",
    category: "Australian Fashion",
    description: "Farm-to-fashion Australian cotton brand with seasonal collections and immersive brand storytelling.",
    results: "Heritage Cotton Brand",
    image: goondiwindiImg,
    url: "https://goondiwindicotton.com.au",
  },
  {
    title: "HHG Products",
    category: "Hair",
    description: "Quality hair and lifestyle products with user-friendly navigation and comprehensive product catalogs.",
    results: "Hair Business & Mentorship",
    image: hhgImg,
    url: "https://hhgproducts.com",
  },
  {
    title: "Hatkay",
    category: "Hair & Beauty",
    description: "Premium hair and lifestyle brand with high-converting product pages and a polished, on-brand storefront.",
    results: "Hair & Lifestyle Brand",
    image: hatkayImg,
    url: "https://www.hatkay.com",
  },
  {
    title: "Haustierkost",
    category: "Pet Food (DE)",
    description: "German pet food and supplies store with localized UX, fast checkout and curated product collections.",
    results: "DACH Pet Brand",
    image: haustierkostImg,
    url: "https://www.haustierkost.de",
  },
];

function ProjectCard({
  title,
  category,
  description,
  results,
  image,
  url,
  isVisible,
  index,
}: {
  title: string;
  category: string;
  description: string;
  results: string;
  image: string;
  url: string;
  isVisible: boolean;
  index: number;
}) {
  const cardRef = useMouseGlow<HTMLAnchorElement>();
  return (
    <motion.a
      ref={cardRef}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-spotlight group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-500 cursor-pointer block"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-muted">
        <LazyImage
          src={image}
          alt={`${title} website screenshot`}
          eager={index < 3}
          width={1280}
          height={896}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          wrapperClassName="absolute inset-0"
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

        {/* Results badge */}
        <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full gradient-gold">
          <span className="text-sm font-bold text-primary-foreground">{results}</span>
        </div>

        {/* Arrow icon */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <ExternalLink className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-primary text-xs font-semibold uppercase tracking-wider">
          {category}
        </span>
        <h3 className="text-xl font-bold text-foreground mt-2 mb-3 group-hover:text-gradient transition-all duration-300 flex items-center gap-2">
          {title}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.a>
  );
}

export function PortfolioSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();

  return (
    <section id="portfolio" ref={sectionRef} className="py-24 relative cursor-glow">
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of high-performing Shopify stores that showcase
            the power of strategic design and optimization.
          </p>
        </motion.div>

        {/* Project Grid — show only top 6 on homepage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {projects.slice(0, 6).map((project, index) => (
            <ProjectCard
              key={project.title}
              {...project}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>

        {/* See More */}
        <div className="text-center mt-14">
          <Button
            asChild
            size="lg"
            className="gradient-gold text-primary-foreground font-semibold px-8 py-6 text-base gold-glow-sm hover:scale-105 transition-transform duration-300"
          >
            <Link to="/portfolio">
              See More Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
