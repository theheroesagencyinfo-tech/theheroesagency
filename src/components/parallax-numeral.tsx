import { useEffect, useRef, type ReactNode } from "react";

export function ParallaxBuildItem({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const section = element.closest("section");
    const stickyPanel = section?.firstElementChild;
    if (!section || !(stickyPanel instanceof HTMLElement)) return;
    let frame = 0;
    let sectionTop = 0;
    let stickyTop = 0;
    let travel = 1;
    let previousVisible: boolean | undefined;

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY;
      stickyTop = Number.parseFloat(getComputedStyle(stickyPanel).top) || 0;
      travel = Math.max(1, section.offsetHeight - stickyPanel.offsetHeight);
    };

    const update = () => {
      frame = 0;
      const progress = (window.scrollY + stickyTop - sectionTop) / travel;
      const visible = motionPreference.matches || index === 0 || progress >= (index === 1 ? 0.2 : 0.55);
      if (visible === previousVisible) return;
      previousVisible = visible;
      element.style.visibility = visible ? "visible" : "hidden";
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resize = () => {
      measure();
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(stickyPanel);
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize);
    motionPreference.addEventListener("change", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      motionPreference.removeEventListener("change", resize);
    };
  }, [index]);

  return <li ref={ref}>{children}</li>;
}