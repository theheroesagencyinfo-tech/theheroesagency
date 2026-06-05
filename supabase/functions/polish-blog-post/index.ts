// Polishes punctuation, spacing, and readability of an existing blog post
// without changing meaning. Admin-only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function polish(field: "title" | "excerpt" | "content", value: string) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

  const rules = `You are a senior human copy editor. Polish the following blog ${field} for punctuation, grammar, spacing, and readability.

STRICT RULES:
- Do NOT change meaning, facts, structure, headings, links, or HTML tags.
- Fix missing commas, periods, semicolons, apostrophes, quotes, capitalization.
- Replace stray "—" overuse with proper commas/periods. Max 2 em dashes total.
- Remove generic AI tics: "unlock", "leverage", "supercharge", "game-changer", "delve", "tapestry", "navigate the landscape", "in today's fast-paced world", "in conclusion", "let's dive in", "harness the power", "revolutionize".
- Keep paragraphs short (2-4 sentences). Add paragraph breaks only where readability clearly improves.
- Preserve all existing HTML tags exactly (h2, h3, p, ul, ol, li, strong, em, a, blockquote). Do not add new tags.
- Return ONLY the polished ${field}. No markdown fences. No commentary.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: rules },
        { role: "user", content: value },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const out = (data.choices?.[0]?.message?.content ?? "").trim();
  return out.replace(/^```(?:html|json|markdown)?\s*|\s*```$/g, "").trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin
      .from("user_roles").select("role")
      .eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: post, error: fetchErr } = await admin
      .from("blog_posts").select("id,title,excerpt,content").eq("id", id).maybeSingle();
    if (fetchErr || !post) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [title, excerpt, content] = await Promise.all([
      polish("title", post.title || ""),
      post.excerpt ? polish("excerpt", post.excerpt) : Promise.resolve(""),
      polish("content", post.content || ""),
    ]);

    const update: Record<string, string> = { content };
    if (title) update.title = title.slice(0, 120);
    if (excerpt) update.excerpt = excerpt.slice(0, 200);

    const { error: upErr } = await admin.from("blog_posts").update(update).eq("id", id);
    if (upErr) throw upErr;

    return new Response(JSON.stringify({ id, ...update }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
