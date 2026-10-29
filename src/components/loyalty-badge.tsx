import { PenTool, BookOpen, Award, Stamp, Shield, Crown, Star, Lock } from "lucide-react";
import type { LoyaltyLevel } from "@/lib/loyalty";

const STYLE = [
  { icon: PenTool, ring: "from-medal-bronze/90 to-medal-bronze/50", face: "bg-medal-bronze" },
  { icon: BookOpen, ring: "from-medal-forest/90 to-medal-forest/50", face: "bg-medal-forest" },
  { icon: Award, ring: "from-medal-brass to-medal-brass/50", face: "bg-medal-brass" },
  { icon: Stamp, ring: "from-medal-wax to-medal-wax/50", face: "bg-medal-wax" },
  { icon: Shield, ring: "from-medal-sapphire to-medal-sapphire/50", face: "bg-medal-sapphire" },
  { icon: Crown, ring: "from-medal-platinum to-medal-forest/60", face: "bg-medal-platinum" },
  { icon: Star, ring: "from-medal-gold to-pitch", face: "bg-pitch" },
];

export function LoyaltyBadge({ level, earned = true, size = "md" }: { level: LoyaltyLevel; earned?: boolean; size?: "sm" | "md" | "lg" }) {
  const s = STYLE[level.level - 1]!;
  const Icon = s.icon;
  const dim = size === "lg" ? "h-28 w-28" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const ic = size === "lg" ? "h-11 w-11" : size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return <span role="img" aria-label={`${level.badge} badge${earned ? "" : ", locked"}`}
    className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br p-[3px] shadow-md ${dim} ${earned ? s.ring : "from-border to-border"}`}>
    <span className={`flex h-full w-full items-center justify-center rounded-full border-2 border-background/40 ${earned ? s.face : "bg-secondary"}`}>
      {earned ? <Icon aria-hidden className={`${ic} ${level.level === 7 ? "text-medal-gold" : "text-pitch-foreground"}`} strokeWidth={1.6} />
        : <Lock aria-hidden className={`${size === "lg" ? "h-8 w-8" : "h-4 w-4"} text-muted-foreground`} />}
    </span>
  </span>;
}
