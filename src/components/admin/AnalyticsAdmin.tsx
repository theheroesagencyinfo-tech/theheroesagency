import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Eye,
  MousePointerClick,
  Globe,
  RefreshCw,
  Smartphone,
  Download,
  Target,
  Zap,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CONVERSION_EVENTS, FUNNEL_STEPS } from "@/lib/analytics";

interface PageView {
  id: string;
  session_id: string;
  path: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device_type: string | null;
  language: string | null;
  created_at: string;
}

interface PageEvent {
  id: string;
  session_id: string;
  event_name: string;
  path: string | null;
  label: string | null;
  created_at: string;
}

type Range = "24h" | "7d" | "30d" | "custom";

function rangeToDates(range: Range, customStart?: string, customEnd?: string): { start: Date; end: Date } {
  const end = new Date();
  if (range === "custom" && customStart) {
    const s = new Date(customStart);
    const e = customEnd ? new Date(customEnd) : new Date();
    e.setHours(23, 59, 59, 999);
    return { start: s, end: e };
  }
  const ms = range === "24h" ? 86400000 : range === "7d" ? 7 * 86400000 : 30 * 86400000;
  return { start: new Date(Date.now() - ms), end };
}

function topN<T extends string>(items: (T | null | undefined)[], n = 8): { key: string; count: number }[] {
  const map = new Map<string, number>();
  items.forEach((item) => {
    const k = (item || "").trim();
    if (!k) return;
    map.set(k, (map.get(k) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

function shortReferrer(ref: string | null): string {
  if (!ref) return "Direct";
  try {
    const u = new URL(ref);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return ref;
  }
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-4 sm:p-5 border border-border/40">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg gradient-gold">
          <Icon className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="truncate max-w-[60%]" title={label}>{label}</span>
        <span className="text-muted-foreground tabular-nums">{count} · {pct}%</span>
      </div>
      <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
        <div className="h-full gradient-gold rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

// CSV escaping that works for Excel + Google Sheets.
function toCsv<T extends Record<string, unknown>>(rows: T[], headers?: string[]): string {
  if (rows.length === 0) return "";
  const keys = headers || Object.keys(rows[0]);
  const escape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/\r?\n/g, " ");
    if (/[",]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [keys.join(",")];
  for (const row of rows) {
    lines.push(keys.map((k) => escape(row[k])).join(","));
  }
  return lines.join("\n");
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const CONVERSION_LABELS: Record<string, string> = {
  [CONVERSION_EVENTS.HERO_CTA_CLICK]: "Hero CTA click",
  [CONVERSION_EVENTS.CONTACT_SUBMIT]: "Contact form submit",
  [CONVERSION_EVENTS.EMAIL_CLICK]: "Email click",
  [CONVERSION_EVENTS.PROPOSAL_CLICK]: "“Get a proposal”",
  [CONVERSION_EVENTS.WHATSAPP_CLICK]: "WhatsApp click",
  [CONVERSION_EVENTS.CALENDLY_CLICK]: "Calendly / strategy call",
  [CONVERSION_EVENTS.REVIEW_SUBMIT]: "Review submit",
  [CONVERSION_EVENTS.NEWSLETTER_SUBSCRIBE]: "Newsletter subscribe",
};

export function AnalyticsAdmin() {
  const [range, setRange] = useState<Range>("7d");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [views, setViews] = useState<PageView[]>([]);
  const [events, setEvents] = useState<PageEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const { start, end } = rangeToDates(range, customStart, customEnd);
      const startIso = start.toISOString();
      const endIso = end.toISOString();
      const [{ data: v, error: ev }, { data: e, error: ee }] = await Promise.all([
        supabase
          .from("page_views")
          .select("*")
          .gte("created_at", startIso)
          .lte("created_at", endIso)
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("page_events")
          .select("*")
          .gte("created_at", startIso)
          .lte("created_at", endIso)
          .order("created_at", { ascending: false })
          .limit(5000),
      ]);
      if (ev) throw ev;
      if (ee) throw ee;
      setViews((v || []) as PageView[]);
      setEvents((e || []) as PageEvent[]);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load analytics", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (range !== "custom" || (customStart && customEnd)) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, customStart, customEnd]);

  const stats = useMemo(() => {
    const sessions = new Set(views.map((v) => v.session_id));
    return {
      totalViews: views.length,
      uniqueVisitors: sessions.size,
      totalEvents: events.length,
      avgPerSession: sessions.size ? (views.length / sessions.size).toFixed(1) : "0",
    };
  }, [views, events]);

  const topPaths = useMemo(() => topN(views.map((v) => v.path)), [views]);
  const topReferrers = useMemo(() => topN(views.map((v) => shortReferrer(v.referrer))), [views]);
  const topUtm = useMemo(() => topN(views.map((v) => v.utm_source)), [views]);
  const topDevices = useMemo(() => topN(views.map((v) => v.device_type)), [views]);
  const topLanguages = useMemo(() => topN(views.map((v) => (v.language || "").split("-")[0])), [views]);
  const topEvents = useMemo(() => topN(events.map((e) => e.event_name)), [events]);

  // Top interactions per page (event_name + label grouped by page).
  const interactionsByPage = useMemo(() => {
    const byPage = new Map<string, Map<string, number>>();
    for (const e of events) {
      const page = e.path || "(unknown)";
      const key = `${CONVERSION_LABELS[e.event_name] || e.event_name}${e.label ? ` — ${e.label}` : ""}`;
      if (!byPage.has(page)) byPage.set(page, new Map());
      const m = byPage.get(page)!;
      m.set(key, (m.get(key) || 0) + 1);
    }
    return Array.from(byPage.entries())
      .map(([page, m]) => ({
        page,
        total: Array.from(m.values()).reduce((a, b) => a + b, 0),
        items: Array.from(m.entries())
          .map(([key, count]) => ({ key, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [events]);

  // Conversion totals per CTA.
  const conversions = useMemo(() => {
    const counts = new Map<string, { count: number; sessions: Set<string> }>();
    for (const e of events) {
      if (!CONVERSION_LABELS[e.event_name]) continue;
      const c = counts.get(e.event_name) || { count: 0, sessions: new Set<string>() };
      c.count += 1;
      c.sessions.add(e.session_id);
      counts.set(e.event_name, c);
    }
    return Object.keys(CONVERSION_LABELS).map((k) => ({
      key: k,
      label: CONVERSION_LABELS[k],
      count: counts.get(k)?.count || 0,
      sessions: counts.get(k)?.sessions.size || 0,
    }));
  }, [events]);

  // Funnel: drop-off across configured funnel steps, per session.
  const funnel = useMemo(() => {
    const sessions = new Set(views.map((v) => v.session_id));
    const totalSessions = sessions.size;

    // Sessions that fired each event.
    const sessionsWith: Record<string, Set<string>> = {};
    for (const step of FUNNEL_STEPS) sessionsWith[step.key] = new Set();
    for (const e of events) {
      if (sessionsWith[e.event_name]) sessionsWith[e.event_name].add(e.session_id);
    }

    // Cumulative funnel (each step requires previous).
    let acc: Set<string> | null = null;
    const steps = FUNNEL_STEPS.map((step) => {
      const reached = sessionsWith[step.key];
      const cum = acc === null ? new Set(reached) : new Set([...reached].filter((s) => acc!.has(s)));
      acc = cum;
      return { ...step, sessions: cum.size };
    });

    const top = totalSessions || (steps[0]?.sessions ?? 0) || 1;
    return { totalSessions, steps, top };
  }, [views, events]);

  const exportPageViews = () => {
    if (views.length === 0) {
      toast({ title: "Nothing to export", description: "No page views in this range." });
      return;
    }
    const csv = toCsv(
      views.map((v) => ({
        created_at: v.created_at,
        session_id: v.session_id,
        path: v.path,
        referrer: v.referrer || "",
        utm_source: v.utm_source || "",
        utm_medium: v.utm_medium || "",
        utm_campaign: v.utm_campaign || "",
        device_type: v.device_type || "",
        language: v.language || "",
      })),
    );
    downloadCsv(`page_views_${range}_${Date.now()}.csv`, csv);
  };

  const exportEvents = () => {
    if (events.length === 0) {
      toast({ title: "Nothing to export", description: "No events in this range." });
      return;
    }
    const csv = toCsv(
      events.map((e) => ({
        created_at: e.created_at,
        session_id: e.session_id,
        event_name: e.event_name,
        path: e.path || "",
        label: e.label || "",
      })),
    );
    downloadCsv(`page_events_${range}_${Date.now()}.csv`, csv);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Visitor Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Where your traffic comes from, what visitors do, and which CTAs convert.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList className="glass">
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={load} variant="outline" size="icon" className="glass" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {range === "custom" && (
        <div className="glass rounded-xl p-4 border border-border/40 flex flex-wrap items-end gap-3">
          <CalendarIcon className="w-4 h-4 text-primary self-center" />
          <div className="space-y-1">
            <Label htmlFor="start" className="text-xs">From</Label>
            <Input
              id="start"
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="glass"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="end" className="text-xs">To</Label>
            <Input
              id="end"
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="glass"
            />
          </div>
          <p className="text-xs text-muted-foreground">Pick both dates to load.</p>
        </div>
      )}

      {/* Export bar */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="glass" onClick={exportPageViews}>
          <Download className="w-4 h-4 mr-2" /> Export page views (CSV)
        </Button>
        <Button variant="outline" size="sm" className="glass" onClick={exportEvents}>
          <Download className="w-4 h-4 mr-2" /> Export events (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Eye} label="Page views" value={stats.totalViews} />
        <StatCard icon={Users} label="Unique visitors" value={stats.uniqueVisitors} />
        <StatCard icon={MousePointerClick} label="Tracked actions" value={stats.totalEvents} />
        <StatCard icon={BarChart3} label="Pages / visit" value={stats.avgPerSession} />
      </div>

      {/* Conversions */}
      <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" /> Conversions (key CTAs)
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Total clicks/submits and the number of unique sessions that converted.
        </p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {conversions.map((c) => (
            <div key={c.key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="truncate max-w-[60%]" title={c.label}>{c.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {c.count} · {c.sessions} sess.
                </span>
              </div>
              <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-gold rounded-full"
                  style={{
                    width: `${Math.max(stats.uniqueVisitors ? Math.round((c.sessions / stats.uniqueVisitors) * 100) : 0, 2)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Conversion funnel
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Sessions that progressed from a hero CTA all the way to a contact submit. Each bar is cumulative.
        </p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>All sessions</span>
            <span className="text-muted-foreground tabular-nums">{funnel.totalSessions}</span>
          </div>
          <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
            <div className="h-full bg-primary/60 rounded-full" style={{ width: "100%" }} />
          </div>
          {funnel.steps.map((s, idx) => {
            const pct = funnel.top > 0 ? Math.round((s.sessions / funnel.top) * 100) : 0;
            const prev = idx === 0 ? funnel.totalSessions : funnel.steps[idx - 1].sessions;
            const drop = prev > 0 ? Math.max(0, Math.round(((prev - s.sessions) / prev) * 100)) : 0;
            return (
              <div key={s.key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{idx + 1}. {s.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {s.sessions} · {pct}% {idx > 0 && drop > 0 ? `· -${drop}% drop` : ""}
                  </span>
                </div>
                <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div className="h-full gradient-gold rounded-full" style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" /> Top pages
          </h3>
          {topPaths.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
          {topPaths.map((p) => (
            <Bar key={p.key} label={p.key} count={p.count} total={stats.totalViews} />
          ))}
        </div>

        <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Top traffic sources
          </h3>
          {topReferrers.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
          {topReferrers.map((r) => (
            <Bar key={r.key} label={r.key} count={r.count} total={stats.totalViews} />
          ))}
        </div>

        <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Top campaigns (UTM)
          </h3>
          {topUtm.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No UTM-tagged traffic yet. Add <code>?utm_source=...</code> to your campaign links.
            </p>
          )}
          {topUtm.map((u) => (
            <Bar key={u.key} label={u.key} count={u.count} total={stats.totalViews} />
          ))}
        </div>

        <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" /> Devices
          </h3>
          {topDevices.map((d) => (
            <Bar key={d.key} label={d.key} count={d.count} total={stats.totalViews} />
          ))}
        </div>

        <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Languages
          </h3>
          {topLanguages.map((l) => (
            <Bar key={l.key} label={l.key} count={l.count} total={stats.totalViews} />
          ))}
        </div>

        <div className="glass rounded-xl p-5 border border-border/40 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-primary" /> Top actions
          </h3>
          {topEvents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tracked actions yet. CTAs are wired across the homepage and footer.
            </p>
          )}
          {topEvents.map((e) => (
            <Bar
              key={e.key}
              label={CONVERSION_LABELS[e.key] || e.key}
              count={e.count}
              total={stats.totalEvents}
            />
          ))}
        </div>
      </div>

      {/* Top interactions per page */}
      <div className="glass rounded-xl p-5 border border-border/40 space-y-5">
        <h3 className="font-semibold flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-primary" /> Top interactions per page
        </h3>
        {interactionsByPage.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tracked interactions yet for this range.
          </p>
        )}
        <div className="grid md:grid-cols-2 gap-5">
          {interactionsByPage.map((p) => (
            <div key={p.page} className="space-y-2 p-3 rounded-lg border border-border/30 bg-background/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate" title={p.page}>{p.page}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{p.total} actions</span>
              </div>
              <div className="space-y-1.5">
                {p.items.map((it) => (
                  <Bar key={it.key} label={it.key} count={it.count} total={p.total} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5 border border-border/40">
        <h3 className="font-semibold mb-3">Recent visits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr className="border-b border-border/40">
                <th className="text-left py-2 pr-3">When</th>
                <th className="text-left py-2 pr-3">Page</th>
                <th className="text-left py-2 pr-3">Source</th>
                <th className="text-left py-2 pr-3">Device</th>
              </tr>
            </thead>
            <tbody>
              {views.slice(0, 25).map((v) => (
                <tr key={v.id} className="border-b border-border/20">
                  <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 truncate max-w-[200px]" title={v.path}>{v.path}</td>
                  <td className="py-2 pr-3">{shortReferrer(v.referrer)}</td>
                  <td className="py-2 pr-3 capitalize">{v.device_type || "-"}</td>
                </tr>
              ))}
              {views.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    No visits in this range yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
