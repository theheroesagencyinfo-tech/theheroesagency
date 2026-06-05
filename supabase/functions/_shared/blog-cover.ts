// Shared helper: generate a blog cover image via Lovable AI Gateway and
// upload it to the "blog-covers" public bucket. Returns the public URL.

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

export async function generateBlogCover(opts: {
  title: string;
  excerpt?: string;
  supabase: ReturnType<typeof createClient>;
}): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const prompt = `Cinematic, premium editorial hero image for a blog post titled "${opts.title}". ${opts.excerpt ? `Context: ${opts.excerpt}.` : ""}
Visual style: dark luxury, modern eCommerce/Shopify aesthetic, sky-blue accent glow (HSL 199 89% 48%), subtle glassmorphism, soft volumetric lighting, sharp focus, 16:9 composition. Conceptual / abstract — no text, no logos, no watermarks, no UI mockups. Photoreal quality.`;

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
  const path = `${slugify(opts.title) || "post"}-${Date.now()}.png`;

  const { error: upErr } = await opts.supabase.storage
    .from("blog-covers")
    .upload(path, bytes, { contentType: "image/png", upsert: false });
  if (upErr) throw upErr;

  const { data: pub } = opts.supabase.storage.from("blog-covers").getPublicUrl(path);
  return pub.publicUrl;
}
