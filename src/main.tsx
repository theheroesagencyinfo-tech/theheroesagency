import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Storytelling scroll reveal — observes <section> elements and toggles
// `.in-view` when they enter the viewport. Runs once after idle to avoid
// competing with hydration. Re-observes on route changes via MutationObserver.
if (typeof window !== "undefined" && "IntersectionObserver" in window) {
  const start = () => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const observeAll = () => {
      document.querySelectorAll("main section, main [data-story]").forEach((el) => {
        if (!el.classList.contains("in-view")) io.observe(el);
      });
    };

    observeAll();

    // Re-scan when new sections mount (lazy-loaded chunks, route changes).
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });
  };

  if ("requestIdleCallback" in window) {
    (window as Window).requestIdleCallback(start, { timeout: 1500 });
  } else {
    setTimeout(start, 400);
  }
}
