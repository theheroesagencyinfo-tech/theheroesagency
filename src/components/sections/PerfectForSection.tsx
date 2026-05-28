import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Briefcase, Download, Shirt, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseGlow } from "@/hooks/useMouseGlow";

const items = [
  {
    icon: ShoppingBag,
    title: "Dropshipping Store",
    description: "Winning-product storefronts engineered for fast scale and high ROAS.",
  },
  {
    icon: Sparkles,
    title: "Brands",
    description: "Premium DTC experiences that build loyalty and lifetime value.",
  },
  {
    icon: Briefcase,
    title: "Service Website",
    description: "Conversion-focused service sites that turn visitors into booked calls.",
  },
  {
    icon: Download,
    title: "Digital Product Store",
    description: "Frictionless checkout for ebooks, courses, templates, and downloads.",
  },
  {
    icon: Shirt,
    title: "Print on Demand Store",
    description: "Beautiful POD storefronts wired for catalog growth and retention.",
  },
  {
    icon: Building2,
    title: "B2B Website",
    description: "Enterprise-grade B2B portals with quoting, gated catalogs, and bulk ordering.",
  },
];

function scrollToContact() {
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Card({
  icon: Icon,
  title,
  description,
  index,
  isVisible,
}: {
  icon: typeof ShoppingBag;
  title: string;
  description: string;
  index: number;
  isVisible: boolean;
}) {
  const ref = useMouseGlow<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="card-spotlight glass rounded-2xl p-6 md:p-7 group hover:border-primary/30 transition-all duration-500 gold-glow-sm hover-lift h-full"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function PerfectForSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();

  return (
    <section id="perfect-for" ref={sectionRef} className="py-24 relative cursor-glow">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Who It's For
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Perfect for <span className="text-gradient">New & Existing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're launching from scratch or scaling an established brand —
            we build the system that fits your stage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-7xl mx-auto">
          {items.map((item, index) => (
            <Card key={item.title} {...item} index={index} isVisible={isVisible} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            onClick={scrollToContact}
            size="lg"
            className="gradient-gold text-primary-foreground hover:opacity-90 transition-opacity gold-glow-sm"
          >
            Make an Enquiry
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
