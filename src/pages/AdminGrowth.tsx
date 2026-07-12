import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Eye, MousePointerClick, Send, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

type Timeseries = { date: string; views: number; submissions: number };

type TopPath = { path: string; views: number };
type TopReferrer = { referrer: string; views: number };
type EventCount = { event: string; count: number };

const RANGE_DAYS = 30;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function AdminGrowth() {
  const { user, isAdmin, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    views: 0,
    uniqueVisitors: 0,
    submissions: 0,
    calendlyClicks: 0,
  });
  const [series, setSeries] = useState<Timeseries[]>([]);
  const [topPaths, setTopPaths] = useState<TopPath[]>([]);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [topEvents, setTopEvents] = useState<EventCount[]>([]);

  const since = useMemo(() => {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() - (RANGE_DAYS - 1));
    return d.toISOString();
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const [viewsRes, submissionsRes, eventsRes] = await Promise.all([
        supabase
          .from("page_views")
          .select("path, referrer, session_id, created_at")
          .gte("created_at", since)
          .limit(5000),
        supabase
          .from("contact_submissions")
          .select("created_at, service")
          .gte("created_at", since)
          .limit(1000),
        supabase
          .from("page_events")
          .select("event_name, created_at")
          .gte("created_at", since)
          .limit(5000),
      ]);

      if (cancelled) return;

      const views = viewsRes.data || [];
      const submissions = submissionsRes.data || [];
      const events = eventsRes.data || [];

      // Totals
      const sessions = new Set(views.map((v) => v.session_id).filter(Boolean));
      const calendlyClicks = events.filter((e) =>
        (e.event_name || "").toLowerCase().includes("calendly"),
      ).length;

      setTotals({
        views: views.length,
        uniqueVisitors: sessions.size,
        submissions: submissions.length,
        calendlyClicks,
      });

      // Timeseries (last 30 days)
      const days: Record<string, Timeseries> = {};
      for (let i = 0; i < RANGE_DAYS; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const k = d.toISOString().slice(0, 10);
        days[k] = { date: k, views: 0, submissions: 0 };
      }
      for (const v of views) {
        const k = (v.created_at || "").slice(0, 10);
        if (days[k]) days[k].views += 1;
      }
      for (const s of submissions) {
        const k = (s.created_at || "").slice(0, 10);
        if (days[k]) days[k].submissions += 1;
      }
      setSeries(Object.values(days).sort((a, b) => a.date.localeCompare(b.date)));

      // Top paths
      const pathMap: Record<string, number> = {};
      for (const v of views) {
        const p = (v.path || "/").split("?")[0];
        pathMap[p] = (pathMap[p] || 0) + 1;
      }
      setTopPaths(
        Object.entries(pathMap)
          .map(([path, views]) => ({ path, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10),
      );

      // Top referrers
      const refMap: Record<string, number> = {};
      for (const v of views) {
        const raw = (v.referrer || "").trim();
        let host = "Direct";
        if (raw) {
          try {
            host = new URL(raw).hostname.replace(/^www\./, "");
          } catch {
            host = raw.slice(0, 40);
          }
        }
        refMap[host] = (refMap[host] || 0) + 1;
      }
      setTopReferrers(
        Object.entries(refMap)
          .map(([referrer, views]) => ({ referrer, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10),
      );

      // Top events
      const eventMap: Record<string, number> = {};
      for (const e of events) {
        const k = e.event_name || "unknown";
        eventMap[k] = (eventMap[k] || 0) + 1;
      }
      setTopEvents(
        Object.entries(eventMap)
          .map(([event, count]) => ({ event, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
      );

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, since]);

  if (isLoading) return <div className="min-h-screen bg-background" />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const conversionRate =
    totals.uniqueVisitors > 0
      ? ((totals.submissions / totals.uniqueVisitors) * 100).toFixed(2)
      : "0.00";

  const maxSeries = Math.max(1, ...series.map((s) => s.views));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Growth Dashboard — Admin"
        description="Acquisition dashboard for The Heroes Agency."
        noindex
      />
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to admin
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Growth Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Last {RANGE_DAYS} days · updated live from analytics
            </p>
          </div>
          <Button asChild variant="outline" className="glass">
            <Link to="/free-audit">View /free-audit</Link>
          </Button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon={Eye}
            label="Page views"
            value={totals.views.toLocaleString()}
            loading={loading}
          />
          <KpiCard
            icon={TrendingUp}
            label="Unique visitors"
            value={totals.uniqueVisitors.toLocaleString()}
            loading={loading}
          />
          <KpiCard
            icon={Send}
            label="Form submissions"
            value={totals.submissions.toLocaleString()}
            sub={`${conversionRate}% of visitors`}
            loading={loading}
          />
          <KpiCard
            icon={MousePointerClick}
            label="Calendly clicks"
            value={totals.calendlyClicks.toLocaleString()}
            loading={loading}
          />
        </div>

        {/* Timeseries */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Daily traffic & inquiries</h2>
            <div className="flex gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" /> Views
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Submissions
              </span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-40">
            {series.map((s) => {
              const h = (s.views / maxSeries) * 100;
              return (
                <div
                  key={s.date}
                  className="group relative flex-1 flex flex-col justify-end items-center gap-0.5"
                  title={`${s.date} — ${s.views} views, ${s.submissions} submissions`}
                >
                  <div
                    className="w-full bg-primary/40 hover:bg-primary transition-colors rounded-sm min-h-[2px]"
                    style={{ height: `${h}%` }}
                  />
                  {s.submissions > 0 && (
                    <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{series[0]?.date.slice(5)}</span>
            <span>{series[series.length - 1]?.date.slice(5)}</span>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RankedTable title="Top pages" rows={topPaths.map((r) => ({ label: r.path, value: r.views }))} />
          <RankedTable
            title="Top referrers"
            rows={topReferrers.map((r) => ({ label: r.referrer, value: r.views }))}
          />
        </div>

        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Top conversion events</h2>
          <RankedTable
            title=""
            rows={topEvents.map((r) => ({ label: r.event, value: r.count }))}
            compact
          />
        </div>

        {/* Playbook */}
        <div className="glass rounded-2xl p-6 border border-primary/20">
          <h2 className="text-lg font-bold mb-3">This week's growth checklist</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Send 20 personalized outbound audits/day using <Link to="/free-audit" className="text-primary hover:underline">/free-audit</Link> as the CTA.</li>
            <li>• Post 3× teardowns on LinkedIn + X this week. Repurpose each as a blog draft.</li>
            <li>• Publish 2 low-KDI Shopify posts (target: shopify speed optimization, shopify checkout conversion).</li>
            <li>• Submit the site to Clutch, DesignRush, and Shopify Experts directory.</li>
            <li>• Check Search Console weekly and re-optimize any post with impressions but no clicks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider mb-2">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </div>
      <div className="text-3xl font-bold text-gradient">
        {loading ? "…" : value}
      </div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function RankedTable({
  title,
  rows,
  compact,
}: {
  title: string;
  rows: { label: string; value: number }[];
  compact?: boolean;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className={compact ? "" : "glass rounded-2xl p-6"}>
      {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-3 text-sm">
              <span className="flex-1 truncate font-mono text-xs text-foreground/90">
                {r.label}
              </span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right tabular-nums text-muted-foreground">
                {r.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
