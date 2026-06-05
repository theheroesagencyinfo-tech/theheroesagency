// Generates a cinematic cover image for a blog post via Lovable AI Gateway
// (gemini-3.1-flash-image-preview), uploads to the "blog-covers" public bucket,
// and returns its public URL. Admin-only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

async function generateImageBase64(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Image gateway error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image returned");
  return b64;
}

export async function generateAndUploadCover(opts: {
  title: string;
  excerpt?: string;
  supabase: ReturnType<typeof createClient>;
}): Promise<string> {
  const { title, excerpt, supabase } = opts;
  const prompt = `Cinematic, premium editorial hero image for a blog post titled "${title}". ${excerpt ? `Context: ${excerpt}.` : ""}
Visual style: dark luxury, modern eCommerce/Shopify aesthetic, sky-blue accent glow (HSL 199 89% 48%), subtle glassmorphism, soft volumetric lighting, sharp focus, 16:9 composition. Conceptual / abstract — no text, no logos, no watermarks, no UI mockups. Photoreal quality.`;

  const b64 = await generateImageBase64(prompt);
  const bytes = b64ToBytes(b64);
  const path = `${slugify(title) || "post"}-${Date.now()}.png`;

  const { error: upErr } = await supabase.storage
    .from("blog-covers")
    .upload(path, bytes, { contentType: "image/png", upsert: false });
  if (upErr) throw upErr;

  const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
  return data.publicUrl;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Auth check: caller must be an admin user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { title, excerpt } = await req.json();
    if (!title || typeof title !== "string") {
      return new Response(JSON.stringify({ error: "title required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = await generateAndUploadCover({ title, excerpt, supabase: admin });
    return new Response(JSON.stringify({ url }), {
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
