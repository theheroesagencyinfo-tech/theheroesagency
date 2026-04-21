import { motion } from "framer-motion";
import { Check, Award, Target, Users, Zap } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useMouseGlow } from "@/hooks/useMouseGlow";

const differentiators = [
  {
    icon: Target,
    title: "Results-Driven Approach",
    description: "Every design decision is backed by data and focused on conversions.",
  },
  {
    icon: Award,
    title: "Certified Shopify Expert",
    description: "Official Shopify Partner with advanced certifications and training.",
  },
  {
    icon: Users,
    title: "Dedicated Partnership",
    description: "Direct communication with me—no account managers or middlemen.",
  },
  {
    icon: Zap,
    title: "Premium Experience",
    description: "Luxury-level service with attention to every detail of your project.",
  },
];

const checkpoints = [
  "8+ years of specialized Shopify expertise",
  "150+ successful store launches",
  "Average 180% conversion rate improvement",
  "Ongoing support and optimization included",
  "Full transparency throughout the process",
  "Proven ROI for every client",
];

function DiffCard({ item, index, isVisible }: { item: typeof differentiators[number]; index: number; isVisible: boolean }) {
  const cardRef = useMouseGlow<HTMLDivElement>();
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="card-spotlight glass rounded-2xl p-6 group hover:border-primary/30 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <item.icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </motion.div>
  );
}

export function WhyMeSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const sectionRef = useMouseGlow<HTMLElement>();

  return (
    <section id="why-me" ref={sectionRef} className="py-24 relative overflow-hidden cursor-glow">
      <div className="absolute inset-0 bg-glow opacity-30" />

      <div className="container px-4 md:px-6 relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
            animate={isVisible ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
              Why Work With Me
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Not Just Another
              <br />
              <span className="text-gradient">Shopify Developer</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              I'm a strategic partner invested in your success. With a track record of
              transforming stores into revenue machines, I bring both technical expertise
              and business acumen to every project.
            </p>

            {/* Checkpoints */}
            <ul className="space-y-4">
              {checkpoints.map((point, index) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full gradient-gold flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </span>
                  <span className="text-foreground/90">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Side - Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {differentiators.map((item, index) => (
              <DiffCard key={item.title} item={item} index={index} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
