import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { openCalendlyPopup } from "@/lib/calendly";
import { trackEvent } from "@/lib/analytics";

/**
 * Sticky bottom CTA visible on mobile only. Appears once the user has
 * scrolled past the hero so it doesn't compete with the primary CTA on
 * first paint. Reduces the tap distance to booking from anywhere on the page.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after ~1 viewport of scroll (past the hero) and hide near footer.
      const scrolled = window.scrollY;
      const nearBottom =
        window.innerHeight + scrolled >=
        document.documentElement.scrollHeight - 400;
      setVisible(scrolled > window.innerHeight * 0.8 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[env(safe-area-inset-bottom)] pt-3 pointer-events-none transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          void trackEvent("sticky_mobile_cta_click", { label: "Free audit" });
          void openCalendlyPopup();
        }}
        className="pointer-events-auto w-full flex items-center justify-center gap-2 rounded-full gradient-gold text-primary-foreground font-bold py-4 gold-glow-sm shadow-2xl active:scale-[0.98] transition-transform"
      >
        Get My Free Store Audit
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}
