import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCountUp } from "@/hooks/useCountUp";
import { CALENDLY_URL } from "@/lib/links";
import heroBanner from "@/assets/hero-banner.jpg";

const stats = [
  { value: 150, suffix: "+", label: "Stores Built" },
  { value: 25, prefix: "$", suffix: "M+", label: "Revenue Generated" },
  { value: 340, suffix: "%", label: "Avg. Conversion Lift" },
];

function StatItem({
  value,
  prefix = "",
  suffix,
  label,
  isVisible,
}: {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  isVisible: boolean;
}) {
  const count = useCountUp(value, 2500, isVisible);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-2">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export function HeroSection() {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Cursor-reveal: track mouse position on the section so the banner
  // image becomes clearer in a circle around the cursor.
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="hero-reveal relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ ["--mx" as never]: "50%", ["--my" as never]: "50%" }}
    >
      {/* Banner — base (slightly dimmed) */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="Elite IT agency team building high-converting Shopify stores"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background" />
      </div>

      {/* Banner — sharp layer revealed in a circle around the cursor */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500"
        style={{
          WebkitMaskImage:
            "radial-gradient(280px circle at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.6) 45%, transparent 75%)",
          maskImage:
            "radial-gradient(280px circle at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.6) 45%, transparent 75%)",
        }}
      >
        <img
          src={heroBanner}
          alt=""
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Soft sky-blue glow following the cursor */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), hsl(var(--sky) / 0.18), transparent 60%)",
        }}
      />

      <div className="absolute inset-0 bg-glow-top z-[2]" />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Available for new projects
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            I Build <span className="text-gradient">High-Converting</span>
            <br />
            Shopify Stores
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Elite eCommerce consultant specializing in premium Shopify design,
            conversion optimization, and growth strategies that drive
            <span className="text-foreground font-medium"> real results</span>.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="gradient-gold text-primary-foreground font-semibold px-8 py-6 text-lg gold-glow-sm hover:scale-105 transition-transform duration-300"
            >
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                Book a Strategy Call
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass glass-hover border-primary/30 px-8 py-6 text-lg group"
              onClick={() => scrollToSection("portfolio")}
            >
              <Play className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
              View My Work
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-3xl mx-auto"
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} isVisible={isVisible} />
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
}
