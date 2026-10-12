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
        element.style.opacity = "1";
        element.style.visibility = "visible";
        return;
      }
      const section = element.closest("section");
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const stickyPanel = section.firstElementChild;
      if (!(stickyPanel instanceof HTMLElement)) return;
      const stickyTop = Number.parseFloat(getComputedStyle(stickyPanel).top) || 0;
      const travel = Math.max(1, bounds.height - stickyPanel.offsetHeight);
      const progress = Math.max(0, Math.min(1, (stickyTop - bounds.top) / travel));
      const start = index === 1 ? 0.08 : 0.5;
      const reveal = index === 0 ? 1 : Math.max(0, Math.min(1, (progress - start) / 0.32));
      element.style.opacity = String(reveal);
      element.style.visibility = reveal === 0 ? "hidden" : "visible";
      element.style.transform = `translate3d(0, ${(1 - reveal) * 56}px, 0)`;
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

  return <li ref={ref} className="motion-safe:will-change-[transform,opacity]">{children}</li>;
}