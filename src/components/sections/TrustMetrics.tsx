import { motion } from "framer-motion";
import { Store, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { useMouseGlow } from "@/hooks/useMouseGlow";

const metrics = [
  {
    icon: Store,
    value: 150,
    suffix: "+",
    label: "Shopify Stores Built",
    description: "From startups to enterprise brands",
  },
  {
    icon: Clock,
    value: 8,
    suffix: "+",
    label: "Years Experience",
    description: "Shopify Expert since 2016",
  },
  {
    icon: DollarSign,
    value: 25,
    suffix: "M+",
    label: "Revenue Generated",
    description: "For clients worldwide",
  },
  {
    icon: TrendingUp,
    value: 340,
    suffix: "%",
    label: "Avg. Conversion Lift",
    description: "Across optimized stores",
  },
];

function MetricCard({ 
  icon: Icon, 
  value, 
  suffix, 
  label, 
  description, 
  isVisible,
  index 
}: { 
  icon: typeof Store; 
  value: number; 
  suffix: string; 
  label: string; 
  description: string;
  isVisible: boolean;
  index: number;
}) {
  const count = useCountUp(value, 2000, isVisible);
  const cardRef = useMouseGlow<HTMLDivElement>();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="card-spotlight glass glass-hover rounded-2xl p-5 sm:p-6 lg:p-8 text-center gold-glow-sm group"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl gradient-gold mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
      </div>

      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-2">
        {count}{suffix}
      </div>

      <div className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1 leading-tight">
        {label}
      </div>

      <div className="text-xs sm:text-sm text-muted-foreground">
        {description}
      </div>
    </motion.div>
  );
}

export function TrustMetrics() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-glow opacity-50" />
      
      <div ref={ref} className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-[1600px] mx-auto">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={metric.label} 
              {...metric} 
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
