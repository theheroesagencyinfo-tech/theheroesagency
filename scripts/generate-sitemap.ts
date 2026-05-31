// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Writes public/sitemap.xml with all static routes + every published blog post slug.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.theheroesagency.org";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://gvyzlvevzosexdoekrtz.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eXpsdmV2em9zZXhkb2VrcnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzcyODUsImV4cCI6MjA4NTIxMzI4NX0.W8zslQHGXKDIbaXMiNflAQj4EyDBieCsc0aAQ1wafE0";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const today = new Date().toISOString().slice(0, 10);

const staticEntries: SitemapEntry[] = [
  { path: "/", lastmod: today, changefreq: "weekly", priority: "1.0" },
  { path: "/shopify-expert", lastmod: today, changefreq: "monthly", priority: "0.95" },
  { path: "/shopify-store-design", lastmod: today, changefreq: "monthly", priority: "0.95" },
  { path: "/shopify-optimization", lastmod: today, changefreq: "monthly", priority: "0.95" },
  { path: "/shopify-website-fix", lastmod: today, changefreq: "monthly", priority: "0.95" },
  { path: "/shopify-marketing-agency", lastmod: today, changefreq: "monthly", priority: "0.95" },
  { path: "/about", lastmod: today, changefreq: "monthly", priority: "0.8" },
  { path: "/portfolio", lastmod: today, changefreq: "weekly", priority: "0.9" },
  { path: "/blog", lastmod: today, changefreq: "weekly", priority: "0.8" },
  { path: "/privacy", lastmod: today, changefreq: "yearly", priority: "0.3" },
  { path: "/terms", lastmod: today, changefreq: "yearly", priority: "0.3" },
];

async function fetchBlogEntries(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,published_at,updated_at&status=eq.published&order=published_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      },
    );
    if (!res.ok) {
      console.warn(`[sitemap] blog fetch failed: ${res.status}`);
      return [];
    }
    const rows = (await res.json()) as Array<{ slug: string; published_at: string | null; updated_at: string | null }>;
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        lastmod: (r.updated_at || r.published_at || today).slice(0, 10),
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
  } catch (e) {
    console.warn("[sitemap] blog fetch error:", e);
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const blogEntries = await fetchBlogEntries();
const all = [...staticEntries, ...blogEntries];
writeFileSync(resolve("public/sitemap.xml"), generateSitemap(all));
console.log(`sitemap.xml written (${all.length} entries, ${blogEntries.length} blog posts)`);
