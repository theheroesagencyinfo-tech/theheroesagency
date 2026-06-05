import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  number?: number;
  className?: string;
}

/**
 * Meteors — sky-blue diagonal streaks falling across the hero.
 * Pure CSS, no canvas, respects prefers-reduced-motion via tailwind keyframe.
 */
export function Meteors({ number = 20, className }: MeteorsProps) {
  const [styles, setStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setStyles(
      Array.from({ length: number }).map(() => ({
        top: `${Math.floor(Math.random() * 40) - 20}%`,
        left: `${Math.floor(Math.random() * 100)}%`,
        animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
        animationDuration: `${(Math.random() * 4 + 4).toFixed(2)}s`,
      })),
    );
  }, [number]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {styles.map((style, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-sky shadow-[0_0_0_1px_hsl(var(--sky)/0.1)]"
          style={style}
        >
          <span className="pointer-events-none absolute top-1/2 -z-10 h-px w-[60px] -translate-y-1/2 bg-gradient-to-r from-sky to-transparent" />
        </span>
      ))}
    </div>
  );
}
