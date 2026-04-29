import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

/**
 * Wraps content with a smooth cursor-tracking 3D tilt effect.
 * Uses spring physics for buttery motion and an optional gold glare highlight
 * that follows the cursor.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-intensity, intensity]);

  // Glare position follows the cursor
  const glareX = useTransform(xSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(ySpring, [-0.5, 0.5], ["0%", "100%"]);

  // Cache the rect so we don't trigger a forced reflow on every mousemove.
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const refresh = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    refresh();
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  const handleMouseEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={cn("relative will-change-transform", className)}
    >
      <div style={{ transform: "translateZ(0)" }} className="relative h-full w-full">
        {children}
        {glare && (
          <motion.div
            aria-hidden
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, hsl(var(--primary) / 0.18), transparent 60%)`,
              backgroundPositionX: glareX,
              backgroundPositionY: glareY,
            }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 [.group:hover_&]:opacity-100"
          />
        )}
      </div>
    </motion.div>
  );
}
