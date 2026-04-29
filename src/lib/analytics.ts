import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "tha_session_id";
const VIEW_DEDUPE_MS = 500;

let lastViewKey = "";
let lastViewAt = 0;

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `anon-${Date.now()}`;
  }
}

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getUtmFromUrl(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    };
  } catch {
    return {};
  }
}

export async function trackPageView(path: string) {
  const key = `${path}`;
  const now = Date.now();
  if (key === lastViewKey && now - lastViewAt < VIEW_DEDUPE_MS) return;
  lastViewKey = key;
  lastViewAt = now;

  const utm = getUtmFromUrl();
  try {
    await supabase.from("page_views").insert({
      session_id: getSessionId(),
      path,
      referrer: document.referrer || null,
      utm_source: utm.utm_source || null,
      utm_medium: utm.utm_medium || null,
      utm_campaign: utm.utm_campaign || null,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      screen_width: window.innerWidth,
      language: navigator.language,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("trackPageView failed", err);
  }
}

export async function trackEvent(
  event_name: string,
  opts: { label?: string; metadata?: Record<string, unknown> } = {}
) {
  try {
    await supabase.from("page_events").insert({
      session_id: getSessionId(),
      event_name,
      path: window.location.pathname,
      label: opts.label || null,
      metadata: opts.metadata || null,
    });
  } catch (err) {
    if (import.meta.env.DEV) console.warn("trackEvent failed", err);
  }
}
