// Generates 3 fresh SEO blog posts every week using Lovable AI Gateway
// and inserts them as published blog_posts. Triggered by pg_cron Thursdays 08:00 UTC.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateBlogCover } from "../_shared/blog-cover.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOPICS = [
  {
    focus: "Shopify marketing agency",
    angle: "what to look for when hiring a Shopify marketing agency in 2026 — red flags, must-haves, pricing benchmarks, ROI signals.",
  },
  {
    focus: "Shopify consultant",
    angle: "how a senior Shopify consultant uncovers the 3-5 leaks costing DTC stores 20-40% of revenue.",
  },
  {
    focus: "Shopify conversion optimization",
    angle: "a tested Shopify CRO checklist with PDP, cart, and checkout tweaks that lifted conversion rate by double digits.",
  },
  {
    focus: "Shopify SEO for DTC brands",
    angle: "technical and content SEO actions that move organic traffic on Shopify without big-site budgets.",
  },
  {
    focus: "Klaviyo email automation",
    angle: "the 5 must-have Klaviyo flows generating 25-40% of revenue for healthy DTC stores.",
  },
  {
    focus: "AI commercials for ecommerce",
    angle: "how AI video commercials (Sora, Kling, Veo) outperform static creative on Meta and TikTok.",
  },
  {
    focus: "Shopify CRO audit",
    angle: "a 10-minute self-audit that surfaces the highest-impact CRO fixes on any Shopify store.",
  },
  {
    focus: "Marketing automation for Shopify",
    angle: "Make.com and n8n workflows that replace 10 hours of weekly manual work.",
  },
  {
    focus: "Shopify Plus growth playbook",
    angle: "scaling from $1M to $10M on Shopify Plus — tech stack, ops, and offer architecture.",
  },
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const BRAND = "The Heroes Agency";
function truncate(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const i = cut.lastIndexOf(" ");
  return `${(i > max * 0.6 ? cut.slice(0, i) : cut).replace(/[.,;:!?-]+$/, "")}…`;
}
function buildMetaTitle(title: string) {
  const withBrand = `${title} | ${BRAND}`;
  return withBrand.length <= 60 ? withBrand : truncate(title, 60);
}
function buildMetaDescription(excerpt: string, focusKeyword: string) {
  const src = excerpt.trim();
  const hasKw = focusKeyword && src.toLowerCase().includes(focusKeyword.toLowerCase());
  return truncate(`${hasKw || !focusKeyword ? "" : `${focusKeyword}: `}${src}`, 155);
}
function deriveKeywords(title: string, focusKeyword: string) {
  const stop = new Set(["the","and","for","with","from","that","this","your","into","over","about","what","when","why","how"]);
  const fromTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 3 && !stop.has(w));
  const set = new Set<string>();
  if (focusKeyword) set.add(focusKeyword.toLowerCase());
  for (const w of fromTitle) set.add(w);
  return Array.from(set).slice(0, 10);
}

async function generatePost(topic: { focus: string; angle: string }) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const prompt = `Write a high-quality SEO blog post for The Heroes Agency, a Shopify design, marketing automation, and AI commercial production agency.

Primary keyword: "${topic.focus}"
Angle: ${topic.angle}

WRITING STANDARDS (non-negotiable):
- Sound like a senior human consultant, not an AI assistant.
- Plain, confident prose. Short sentences. Real specifics (numbers, tool names, store types).
- Proper punctuation throughout: commas, periods, semicolons where appropriate. Use real apostrophes and quotes.
- No em-dash overuse (max 2 in the whole article). No "—" as a sentence connector tic.
- Banned phrases / openers (do NOT use): "In today's fast-paced world", "In the world of", "In conclusion", "Let's dive in", "Buckle up", "Imagine this", "leverage", "unlock", "supercharge", "game-changer", "revolutionize", "harness the power", "delve", "tapestry", "in this article we will", "as an AI", "stay tuned", "in summary", "navigate the landscape".
- No hype adjectives stacking (e.g. "powerful, transformative, cutting-edge").
- Vary sentence length. Use paragraph breaks every 2-4 sentences for readability.

STRUCTURE:
- Title: under 60 chars, includes the primary keyword naturally, action-oriented, no clickbait.
- Excerpt: 1-2 sentences, under 155 chars, concrete hook (no vague promises).
- Content: 700-1000 words of clean HTML. Allowed tags: h2, h3, p, ul, ol, li, strong, em, a, blockquote. No <h1>, <html>, <body>, <div>, <span>, or inline styles.
- Structure: 1 short intro paragraph, then 3-5 h2 sections each with 2-3 short paragraphs and at least one bullet list or numbered list across the article.
- Weave the primary keyword in 4-6 times naturally (title, first paragraph, one h2, twice in body).
- Close with a 2-3 sentence CTA inviting the reader to book a strategy call with The Heroes Agency. No hard sell.

Return ONLY a JSON object with this exact shape, no markdown fences:
{"title": "...", "excerpt": "...", "content": "<h2>...</h2>..."}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a senior human B2B content writer for an elite Shopify consulting agency. You write tight, specific, well-punctuated prose that never sounds AI-generated. Always return strict JSON only, no markdown fences, no commentary." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`AI gateway error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/^```json\s*|\s*```$/g, "").trim();
  const json = JSON.parse(cleaned);
  return json as { title: string; excerpt: string; content: string };
}

function parseJwtClaims(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    return JSON.parse(atob(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Require a service-role JWT — this function should only be invoked by pg_cron
  // (or an admin) using the service role key, never by anonymous callers.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const token = authHeader.slice("Bearer ".length).trim();
  const claims = parseJwtClaims(token);
  if (claims?.role !== "service_role") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );


    // Pick 3 random topics
    const picks = [...TOPICS].sort(() => Math.random() - 0.5).slice(0, 3);

    const now = new Date();
    const inserted: string[] = [];

    for (const topic of picks) {
      const post = await generatePost(topic);
      const baseSlug = slugify(post.title);
      const slug = `${baseSlug}-${now.toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 6)}`;

      let coverUrl: string | null = null;
      try {
        coverUrl = await generateBlogCover({
          title: post.title,
          excerpt: post.excerpt,
          supabase,
        });
      } catch (imgErr) {
        console.error("Cover generation failed", imgErr);
      }

      const { error } = await supabase.from("blog_posts").insert({
        title: post.title.slice(0, 120),
        slug,
        excerpt: post.excerpt.slice(0, 200),
        content: post.content,
        cover_image_url: coverUrl,
        author_name: "The Heroes Agency",
        status: "published",
        published_at: now.toISOString(),
      });

      if (error) {
        console.error("Insert failed", error);
      } else {
        inserted.push(slug);
      }
    }

    return new Response(JSON.stringify({ inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
