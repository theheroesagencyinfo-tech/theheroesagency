import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://theheroesagency.org";

// Derive URLs from each route file's explicit staticData.sitemap decision.
const sources = import.meta.glob("./*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

function sitemapPaths(): string[] {
  const paths: string[] = [];
  for (const src of Object.values(sources)) {
    if (!/sitemap:\s*true/.test(src)) continue;
    const m = src.match(/createFileRoute\(\s*["'`]([^"'`]+)["'`]/);
    if (!m || m[1].includes("$")) continue;
    paths.push(m[1] === "/" ? "/" : m[1].replace(/\/$/, ""));
  }
  return [...new Set(paths)].sort();
}

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths()
          .map((p) => `  <url><loc>${BASE}${p === "/" ? "/" : p}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" } });
      },
    },
  },
});
