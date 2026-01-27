import { motion } from "framer-motion";
import { Lightbulb, Search, PenTool, Code2, BarChart3, Rocket } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    icon: Lightbulb,
    number: "01",
    title: "Strategy",
    description: "Deep dive into your brand, goals, and target audience to create a winning roadmap.",
  },
  {
    icon: Search,
    number: "02",
    title: "UX Research",
    description: "Analyze user behavior, competitors, and market trends to inform design decisions.",
  },
  {
    icon: PenTool,
    number: "03",
    title: "Design",
    description: "Create stunning, conversion-optimized designs that embody your brand identity.",
  },
  {
    icon: Code2,
    number: "04",
    title: "Development",
    description: "Build your store with clean code, fast performance, and seamless functionality.",
  },
  {
    icon: BarChart3,
    number: "05",
    title: "Optimization",
    description: "Fine-tune every element for maximum conversions and customer experience.",
  },
  {
    icon: Rocket,
    number: "06",
    title: "Launch",
    description: "Go live with confidence, plus ongoing support and growth strategies.",
  },
];

function ProcessStep({ 
  icon: Icon, 
  number, 
  title, 
  description, 
  isVisible,
  index,
  isLast
}: { 
  icon: typeof Lightbulb; 
  number: string; 
  title: string; 
  description: string;
  isVisible: boolean;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Connector line (desktop) */}
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-primary/40 to-transparent" />
      )}
      
      {/* Icon container */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center gold-glow-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-primary text-primary text-xs font-bold flex items-center justify-center">
          {number.slice(-1)}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-gradient transition-all duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
        {description}
      </p>
    </motion.div>
  );
}

export function ProcessSection() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-glow opacity-30" />
      
      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-4 block">
            Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            How We <span className="text-gradient">Work Together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A proven 6-step process refined over 150+ successful projects 
            to deliver exceptional results every time.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <ProcessStep 
              key={step.number} 
              {...step} 
              isVisible={isVisible}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
