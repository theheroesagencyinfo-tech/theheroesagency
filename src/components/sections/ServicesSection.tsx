import { motion } from "framer-motion";
import { Palette, TrendingUp, Zap, Clapperboard } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseGlow } from "@/hooks/useMouseGlow";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";

const services = [
  {
    icon: Palette,
    title: "Shopify Design",
    description: "Custom, conversion-focused store designs that elevate your brand and drive sales. From stunning product pages to seamless checkout experiences.",
    features: ["Custom Theme Development", "Brand Identity Integration", "Mobile-First Design", "UX Optimization"],
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    description: "Data-driven strategies to turn more visitors into customers. A/B testing, analytics, and user experience improvements that boost your bottom line.",
    features: ["A/B Testing", "Heat Map Analysis", "Checkout Optimization", "Analytics Setup"],
  },
  {
    icon: Zap,
    title: "Automation & Growth",
    description: "Scale your store with smart automation, email flows, and growth strategies. From app integrations to marketing automation.",
    features: ["Email Flow Setup", "App Integration", "Inventory Automation", "Marketing Strategy"],
  },
  {
    icon: Clapperboard,
    title: "AI Commercial Production",
    description: "High-impact AI-generated visuals and cinematic ad content crafted to position your brand, engage your audience, and increase conversions.",
    features: ["AI Product Photography", "AI Video Ads", "AI Commercial Videos", "Product & Service Visuals"],
  },
];

function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
  isVisible,
  index,
}: {
  icon: typeof Palette;
  title: string;
  description: string;
  features: string[];
  isVisible: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group hover-lift"
    >
      <LiquidGlassCard glowIntensity={0.45} className="p-8 h-full">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-7 h-7 text-primary" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Hover beam */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <BorderBeam size={160} duration={5} delay={index * 0.6} />
        </div>
      </LiquidGlassCard>
    </motion.div>
  );
}

export function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();

  return (
    <section id="services" ref={sectionRef} className="py-24 relative cursor-glow">
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
            Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Premium <span className="text-gradient">Shopify Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive eCommerce services designed to transform your Shopify store
            into a high-converting revenue machine.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              {...service}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
