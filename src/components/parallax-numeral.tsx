import { useEffect, useRef } from "react";

export function ParallaxNumeral({ numeral, index }: { numeral: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);

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
      const row = element.closest("li");
      if (!row) return;
      const bounds = row.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - bounds.top - bounds.height / 2) / (window.innerHeight / 2)));
      element.style.transform = `translate3d(0, ${progress * (12 + index * 5)}px, 0)`;
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

  return <span ref={ref} className="mr-4 inline-block w-8 shrink-0 text-base text-muted-foreground">{numeral}</span>;
}