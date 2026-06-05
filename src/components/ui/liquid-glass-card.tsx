import { forwardRef, useRef, useCallback, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * LiquidGlassCard
 * Inspired by 21st.dev "Liquid Glass" UI — a high-end glassmorphism surface
 * with cursor-tracked specular highlight, refraction edge, and inner glow.
 *
 * Uses semantic design tokens (--primary) so it matches the sky-blue brand.
 */
export interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Intensity of the cursor specular highlight (0-1). Default 0.35 */
  glowIntensity?: number;
  /** Show animated gradient border. Default true */
  bordered?: boolean;
}

export const LiquidGlassCard = forwardRef<HTMLDivElement, LiquidGlassCardProps>(
  ({ className, children, glowIntensity = 0.35, bordered = true, onMouseMove, ...props }, ref) => {
    const innerRef = useRef<HTMLDivElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const handleMove = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        const el = innerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          el.style.setProperty("--lg-x", `${x}%`);
          el.style.setProperty("--lg-y", `${y}%`);
        }
        onMouseMove?.(e);
      },
      [onMouseMove]
    );

    return (
      <div
        ref={setRefs}
        onMouseMove={handleMove}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
          "transition-[transform,box-shadow] duration-500",
          "before:absolute before:inset-0 before:pointer-events-none before:rounded-2xl",
          "before:bg-[radial-gradient(600px_circle_at_var(--lg-x,50%)_var(--lg-y,0%),hsl(var(--primary)/var(--lg-glow,0.35)),transparent_40%)]",
          "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
          "after:absolute after:inset-px after:rounded-[calc(theme(borderRadius.2xl)-1px)] after:pointer-events-none",
          "after:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_40%,transparent_60%,rgba(255,255,255,0.04))]",
          bordered &&
            "border border-white/10 hover:border-[hsl(var(--primary)/0.35)]",
          className
        )}
        style={{ ["--lg-glow" as never]: glowIntensity } as React.CSSProperties}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";
