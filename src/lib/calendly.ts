import { CALENDLY_URL } from "./links";

const CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";
const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

let loadingPromise: Promise<void> | null = null;

function ensureCalendlyLoaded(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("calendly load failed")));
      if (window.Calendly) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("calendly load failed"));
    document.body.appendChild(script);
  });

  return loadingPromise;
}

/**
 * Opens Calendly as an in-page popup overlay (no new tab/page).
 * Falls back to opening the URL in a new tab if the widget fails to load.
 */
export async function openCalendlyPopup(url: string = CALENDLY_URL): Promise<void> {
  try {
    await ensureCalendlyLoaded();
    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url });
      return;
    }
    throw new Error("Calendly widget not available");
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
