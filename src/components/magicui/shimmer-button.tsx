import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerDuration?: string;
  background?: string;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      className,
      children,
      shimmerColor = "hsl(var(--sky-glow))",
      shimmerDuration = "2.5s",
      background = "linear-gradient(110deg, hsl(var(--sky-deep)), hsl(var(--sky)), hsl(var(--sky-glow)))",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      style={
        {
          "--shimmer-color": shimmerColor,
          "--shimmer-duration": shimmerDuration,
          background,
        } as React.CSSProperties
      }
      className={cn(
        "group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-xl border border-white/10 px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_24px_hsl(var(--sky)/0.35)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
      {...props}
    >
      {/* shimmer streak */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
      >
        <span
          className="absolute inset-[-100%] animate-shimmer-slide"
          style={{
            background: `conic-gradient(from calc(270deg - 30deg) at 50% 50%, transparent 0deg, var(--shimmer-color) 30deg, transparent 60deg)`,
            animationDuration: "var(--shimmer-duration)",
          }}
        />
      </span>
      {/* inner highlight */}
      <span className="absolute inset-0 -z-10 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0))]" />
      {children}
    </button>
  ),
);
ShimmerButton.displayName = "ShimmerButton";
