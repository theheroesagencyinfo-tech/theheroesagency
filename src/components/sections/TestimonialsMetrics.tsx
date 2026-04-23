import { motion } from "framer-motion";
import { Star, Users, Briefcase, ThumbsUp } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const metrics = [
  { icon: Users, value: "120+", label: "Happy Clients" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Briefcase, value: "15+", label: "Industries Served" },
  { icon: ThumbsUp, value: "98%", label: "Would Recommend" },
];

export function TestimonialsMetrics() {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <div ref={ref} className="max-w-5xl mx-auto px-4 md:px-6 mb-12">
      <div className="glass rounded-2xl p-6 md:p-8 gold-glow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                  {metric.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
