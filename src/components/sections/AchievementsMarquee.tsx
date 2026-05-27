import { Sparkles, Trophy, TrendingUp, Star, Globe2, Rocket, Award, Zap } from "lucide-react";

const items = [
  { icon: Trophy, text: "150+ Shopify Stores Launched Worldwide" },
  { icon: TrendingUp, text: "$25M+ in Revenue Generated for Clients" },
  { icon: Star, text: "340% Average Conversion Rate Lift" },
  { icon: Award, text: "8+ Years as a Certified Shopify Expert" },
  { icon: Rocket, text: "Trusted by DTC Brands in 20+ Countries" },
  { icon: Zap, text: "AI Commercials & Automation that Scale Revenue" },
  { icon: Globe2, text: "Featured Partner for Klaviyo, Make & n8n Stacks" },
  { icon: Sparkles, text: "Premium Design. Real Results. Zero Fluff." },
];

export function AchievementsMarquee() {
  const loop = [...items, ...items];
  return (
    <section
      aria-label="Agency achievements"
      className="relative w-full overflow-hidden border-y border-primary/20 bg-[hsl(var(--sky)/0.12)] dark:bg-[hsl(var(--sky)/0.1)] py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap will-change-transform">
        {loop.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3 text-sm md:text-base font-medium text-foreground/90">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <span>{item.text}</span>
              <span className="text-primary/60">•</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
