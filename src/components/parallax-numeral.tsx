import { useEffect, useRef, type ReactNode } from "react";

export function ParallaxBuildItem({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (motionPreference.matches) {
        element.style.transform = "none";
        return;
      }
      const section = element.closest("section");
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2)));
      element.style.transform = `translate3d(0, ${progress * (32 + index * 16)}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motionPreference.addEventListener("change", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motionPreference.removeEventListener("change", schedule);
    };
  }, [index]);

  return <li ref={ref} className="motion-safe:will-change-transform">{children}</li>;
}