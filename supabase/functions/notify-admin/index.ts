// Edge function: notify-admin
// Sends an email notification to the agency mailbox when a new form is submitted.
// Uses Resend if RESEND_API_KEY is configured. If not configured, returns
// success without sending so the form flow is never blocked.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_INBOX = "info@theheroesagency.org";
const FROM_ADDRESS = "The Heroes Agency <onboarding@resend.dev>";

interface NotifyPayload {
  type:
    | "contact"
    | "quote_request"
    | "system_audit"
    | "review"
    | "chat_message";
  subject?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(p: NotifyPayload) {
  const meta = p.meta ?? {};
  const rows = Object.entries(meta)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">${escapeHtml(
          k,
        )}</td><td style="padding:4px 0;">${escapeHtml(String(v ?? "—"))}</td></tr>`,
    )
    .join("");
  return `
  <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:auto;color:#0f172a;">
    <h2 style="color:#0284c7;margin:0 0 8px;">New ${escapeHtml(p.type.replace(/_/g, " "))}</h2>
    <p style="color:#475569;margin:0 0 16px;">A new submission was received from your website.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${p.name ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Name</td><td>${escapeHtml(p.name)}</td></tr>` : ""}
      ${p.email ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td>${escapeHtml(p.email)}</td></tr>` : ""}
      ${p.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">Phone</td><td>${escapeHtml(p.phone)}</td></tr>` : ""}
      ${rows}
    </table>
    ${p.message ? `<div style="margin-top:16px;padding:12px;border-left:3px solid #0ea5e9;background:#f1f5f9;white-space:pre-wrap;font-size:14px;">${escapeHtml(p.message)}</div>` : ""}
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Manage all submissions inside the admin panel at /admin.</p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as NotifyPayload;
    if (!payload?.type) {
      return new Response(JSON.stringify({ error: "type is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          ok: true,
          delivered: false,
          reason: "RESEND_API_KEY not configured — admin will see this in the panel.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const subject =
      payload.subject ??
      `New ${payload.type.replace(/_/g, " ")} — ${payload.name ?? "Website"}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [ADMIN_INBOX],
        reply_to: payload.email ? [payload.email] : undefined,
        subject,
        html: buildHtml(payload),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, delivered: false, error: data }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ ok: true, delivered: true, id: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
