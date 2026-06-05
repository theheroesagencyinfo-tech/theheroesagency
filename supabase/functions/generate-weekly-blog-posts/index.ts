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

async function generatePost(topic: { focus: string; angle: string }) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const prompt = `Write a high-quality SEO blog post for The Heroes Agency, a Shopify design, marketing automation, and AI commercial production agency.

Primary keyword: "${topic.focus}"
Angle: ${topic.angle}

Requirements:
- Title: under 60 chars, includes the primary keyword naturally, action-oriented.
- Excerpt: 1-2 sentences, under 155 chars, hooks the reader.
- Content: 700-1000 words of valuable HTML (h2/h3, p, ul/ol, strong). No <h1>, no <html>, no <body>. Open with a punchy hook, deliver concrete tips and frameworks, weave in the primary keyword 4-6 times naturally, close with a CTA inviting the reader to book a strategy call with The Heroes Agency.
- Tone: senior consultant, confident, specific, no fluff, no AI-sounding filler.

Return ONLY a JSON object with this exact shape:
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
        { role: "system", content: "You write expert SEO content for an elite ecommerce agency. Always return strict JSON only." },
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
