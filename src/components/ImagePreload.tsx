import { useEffect } from "react";

/**
 * Injects <link rel="preload" as="image"> tags for above-the-fold images
 * so the browser fetches them at highest priority before React mounts the <img>.
 * Eliminates flicker on fast scroll/initial paint.
 */
export function ImagePreload({ srcs, fetchPriority = "high" }: { srcs: string[]; fetchPriority?: "high" | "low" | "auto" }) {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    srcs.forEach((src) => {
      if (!src) return;
      // Avoid duplicates
      if (document.head.querySelector(`link[rel="preload"][href="${src}"]`)) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      // @ts-expect-error — fetchpriority is valid HTML, not yet typed everywhere
      link.fetchPriority = fetchPriority;
      document.head.appendChild(link);
      links.push(link);
    });
    return () => {
      links.forEach((l) => l.parentNode?.removeChild(l));
    };
  }, [srcs.join("|"), fetchPriority]);

  return null;
}
