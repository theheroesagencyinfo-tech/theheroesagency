import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  color?: string; // hex
}

/**
 * Particles — lightweight canvas drift with optional cursor parallax.
 * Pauses when out of view and respects prefers-reduced-motion.
 */
export function Particles({
  className,
  quantity = 60,
  staticity = 50,
  ease = 50,
  size = 0.5,
  color = "#7dd3fc", // sky-300
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  type P = { x: number; y: number; tx: number; ty: number; mag: number; r: number; alpha: number; targetAlpha: number; dx: number; dy: number };
  const particles = useRef<P[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const create = () => {
      const { width, height } = container.getBoundingClientRect();
      particles.current = Array.from({ length: quantity }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        tx: Math.random() * width,
        ty: Math.random() * height,
        mag: 0.1 + Math.random() * 1,
        r: (Math.random() * 2 + size).toFixed(2) as unknown as number,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
      }));
    };

    const draw = () => {
      const { width, height } = container.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      particles.current.forEach((p) => {
        p.x += p.dx + mouse.current.x / (staticity / p.mag);
        p.y += p.dy + mouse.current.y / (staticity / p.mag);
        if (p.alpha < p.targetAlpha) p.alpha += 0.02;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r as number, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(p.alpha * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouse.current.x += (x - mouse.current.x) / ease;
      mouse.current.y += (y - mouse.current.y) / ease;
    };

    resize();
    create();
    if (!reduce) {
      rafRef.current = requestAnimationFrame(draw);
      window.addEventListener("mousemove", onMouse);
    } else {
      // Draw once, no animation
      draw();
      cancelAnimationFrame(rafRef.current);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [quantity, staticity, ease, size, color, dpr]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
