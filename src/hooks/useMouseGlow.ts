import { useEffect, useRef } from "react";

/**
 * Adds a subtle gold glow that follows the cursor across a section.
 * Returns a ref to attach to the container element.
 *
 * Performance: caches the element rect (refreshed on scroll/resize) and
 * coalesces style writes via requestAnimationFrame to avoid forced reflows
 * on every mousemove event.
 */
export function useMouseGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rect = el.getBoundingClientRect();
    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    const refreshRect = () => {
      rect = el.getBoundingClientRect();
    };

    const handleMove = (e: MouseEvent) => {
      pendingX = ((e.clientX - rect.left) / rect.width) * 100;
      pendingY = ((e.clientY - rect.top) / rect.height) * 100;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--mouse-x", `${pendingX}%`);
        el.style.setProperty("--mouse-y", `${pendingY}%`);
      });
    };

    el.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("scroll", refreshRect, { passive: true });
    window.addEventListener("resize", refreshRect);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", refreshRect);
      window.removeEventListener("resize", refreshRect);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
