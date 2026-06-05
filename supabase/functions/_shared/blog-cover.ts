// Shared helper: generate a blog cover image via Lovable AI Gateway and
// upload it to the "blog-covers" bucket. Returns a long-lived signed URL.
//
// Visual variety: a deterministic hash of the post title picks one of several
// style "directions" so the blog grid doesn't end up looking like 30 copies of
// the same image. Each direction is still on-brand (dark, premium, sky-blue
// accent) and SEO-friendly (descriptive prompt, 16:9 aspect, slugified filename
// containing the post title's keywords).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Simple deterministic hash so the same title always renders in the same style
// across regenerations (stable look for SEO/social caching), while different
// titles spread across the catalog.
function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const STYLE_DIRECTIONS: string[] = [
  // 1 — editorial photography
  "Editorial photograph: a high-end Shopify merchant's workspace at golden hour. Brushed-metal MacBook, premium product samples, soft volumetric light, cinematic depth of field. Sky-blue rim light (HSL 199 89% 48%). Magazine-quality realism.",
  // 2 — abstract data-viz
  "Abstract 3D render: flowing translucent sky-blue ribbons of data over a deep charcoal background, glowing nodes, soft bokeh. Suggests revenue curves and conversion lift. Octane render, glassmorphism, no text.",
  // 3 — minimalist product hero
  "Minimalist product hero: a single iconic eCommerce object (shopping bag, package, credit card) floating on a matte black studio backdrop with a single sky-blue spotlight, hard shadow, museum-quality composition.",
  // 4 — futuristic dashboard concept
  "Conceptual UI-feel scene (no real interfaces): glowing geometric panels and growth arrows arranged in a dark futuristic space, soft sky-blue holographic glow, particles, ultra-clean, premium SaaS energy.",
  // 5 — luxury macro
  "Luxury macro shot: shimmering liquid gold-blue gradient on dark glass, cinematic micro-reflections, ultra-sharp, evokes premium and trustworthy. Studio lighting.",
  // 6 — strategy / chess metaphor
  "Cinematic still life suggesting strategy and craftsmanship — premium tools, leather notebook, marble surface, a single sky-blue neon accent. Dark moody lighting, shallow depth of field.",
  // 7 — geometric abstract
  "Bold geometric abstract: layered translucent panes of dark glass with a sky-blue gradient core, sharp edges, dramatic side lighting, Bauhaus-meets-Apple aesthetic.",
  // 8 — atmospheric landscape metaphor
  "Atmospheric metaphor scene: a lone sky-blue beam of light cutting through dark fog over a stylized horizon, dramatic, cinematic widescreen composition, evokes clarity and direction.",
];

export function pickStyle(title: string): string {
  const idx = hashString(title) % STYLE_DIRECTIONS.length;
  return STYLE_DIRECTIONS[idx];
}

export function buildCoverPrompt(title: string, excerpt?: string): string {
  const style = pickStyle(title);
  return `Premium hero image for an eCommerce / Shopify consulting blog post titled "${title}". ${excerpt ? `Article context: ${excerpt}.` : ""}
Style direction: ${style}
Hard constraints: 16:9 widescreen, dark luxury palette, on-brand sky-blue accent (HSL 199 89% 48%), no text of any kind, no logos, no watermarks, no UI mockups, no human faces, no stock-photo cliches. Output must be photoreal/render-quality and catchy as a social share thumbnail.`;
}

export async function generateBlogCover(opts: {
  title: string;
  excerpt?: string;
  supabase: ReturnType<typeof createClient>;
}): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const prompt = buildCoverPrompt(opts.title, opts.excerpt);

  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!res.ok) throw new Error(`Image gateway error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");

  const bytes = b64ToBytes(b64);
  // SEO: filename includes the slugified post title so the asset URL carries
  // keywords that crawlers and image search can index.
  const path = `${slugify(opts.title) || "post"}-${Date.now()}.png`;

  const { error: upErr } = await opts.supabase.storage
    .from("blog-covers")
    .upload(path, bytes, { contentType: "image/png", upsert: false });
  if (upErr) throw upErr;

  const tenYears = 60 * 60 * 24 * 365 * 10;
  const { data: signed, error: signErr } = await opts.supabase.storage
    .from("blog-covers")
    .createSignedUrl(path, tenYears);
  if (signErr || !signed) throw signErr ?? new Error("Failed to sign URL");
  return signed.signedUrl;
}
