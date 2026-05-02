import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Strength of the 3D tilt (deg). Default 8. */
  tilt?: number;
  /** Parallax distance (px). Default 60. */
  parallax?: number;
}

/**
 * Wraps a section to apply scroll-driven 3D tilt + parallax + scale, giving
 * the page a cinematic depth feel. Respects prefers-reduced-motion.
 */
export function ScrollReveal3D({ children, className, tilt = 8, parallax = 60 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [tilt, 0, -tilt]);
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.6]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 1400, transformStyle: "preserve-3d" }}
    >
      <motion.div
        style={{ rotateX, y, scale, opacity, transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
