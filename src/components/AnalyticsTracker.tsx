import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname + location.search;
    let cancelled = false;

    const track = () => {
      void import("@/lib/analytics").then(({ trackPageView }) => {
        if (!cancelled) void trackPageView(path);
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(track, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const id = globalThis.setTimeout(track, 1200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(id);
    };
  }, [location.pathname, location.search]);
  return null;
}
