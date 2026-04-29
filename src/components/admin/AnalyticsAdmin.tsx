import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Eye, MousePointerClick, Globe, RefreshCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

type Range = "24h" | "7d" | "30d";

function rangeToDate(range: Range): Date {
  const ms = range === "24h" ? 86400000 : range === "7d" ? 7 * 86400000 : 30 * 86400000;
  return new Date(Date.now() - ms);
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
        <div
          className="h-full gradient-gold rounded-full"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
    </div>
  );
}

export function AnalyticsAdmin() {
  const [range, setRange] = useState<Range>("7d");
  const [views, setViews] = useState<PageView[]>([]);
  const [events, setEvents] = useState<PageEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    setIsLoading(true);
    try {
      const since = rangeToDate(range).toISOString();
      const [{ data: v, error: ev }, { data: e, error: ee }] = await Promise.all([
        supabase
          .from("page_views")
          .select("*")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("page_events")
          .select("*")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(2000),
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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

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
  const topReferrers = useMemo(
    () => topN(views.map((v) => shortReferrer(v.referrer))),
    [views]
  );
  const topUtm = useMemo(() => topN(views.map((v) => v.utm_source)), [views]);
  const topDevices = useMemo(() => topN(views.map((v) => v.device_type)), [views]);
  const topLanguages = useMemo(
    () => topN(views.map((v) => (v.language || "").split("-")[0])),
    [views]
  );
  const topEvents = useMemo(() => topN(events.map((e) => e.event_name)), [events]);

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
            Where your traffic comes from and what visitors do on the site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
            <TabsList className="glass">
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7 days</TabsTrigger>
              <TabsTrigger value="30d">30 days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={load} variant="outline" size="icon" className="glass" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Eye} label="Page views" value={stats.totalViews} />
        <StatCard icon={Users} label="Unique visitors" value={stats.uniqueVisitors} />
        <StatCard icon={MousePointerClick} label="Tracked actions" value={stats.totalEvents} />
        <StatCard icon={BarChart3} label="Pages / visit" value={stats.avgPerSession} />
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
              No tracked actions yet. Use <code>trackEvent()</code> from <code>src/lib/analytics.ts</code> to log clicks.
            </p>
          )}
          {topEvents.map((e) => (
            <Bar key={e.key} label={e.key} count={e.count} total={stats.totalEvents} />
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
