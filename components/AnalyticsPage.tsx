"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Eye,
  MousePointerClick,
  RefreshCw,
  X,
} from "lucide-react";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { Card, EmptyState, LoadingRows, PageHeader, Stat, Tabs } from "@/components/workspace/ui";

const ANALYTICS_REFERENCE_TIME = Date.now();

type DeliveryType = "IMPRESSION" | "CLICK" | "DISMISS";
type DeliveryLog = {
  id: string;
  endpoint: string;
  name?: string;
  timestamp: string;
  success: boolean;
};

const eventLabels: Record<DeliveryType, string> = { IMPRESSION: "Impression", CLICK: "Click", DISMISS: "Dismiss" };

const ranges = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "0", label: "All" },
] as const;

function eventType(log: DeliveryLog): DeliveryType | null {
  const value = (log.name ?? "").toUpperCase();
  return value === "IMPRESSION" || value === "CLICK" || value === "DISMISS" ? value : null;
}

function formatTime(value: string, withDate = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, withDate ? { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" });
}

function formatDay(value: number) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildBuckets(logs: DeliveryLog[], rangeDays: number) {
  if (logs.length === 0) return [];
  const now = Date.now();
  const rangeStart = rangeDays === 0 ? Math.min(...logs.map((log) => new Date(log.timestamp).getTime())) : now - rangeDays * 86_400_000;
  const start = Math.min(rangeStart, ...logs.map((log) => new Date(log.timestamp).getTime()));
  const end = Math.max(now, ...logs.map((log) => new Date(log.timestamp).getTime()));
  const span = Math.max(end - start, 1);
  const bucketCount = rangeDays <= 7 && rangeDays !== 0 ? 7 : 14;
  const interval = span / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({ start: start + index * interval, end: start + (index + 1) * interval, count: 0 }));
  logs.forEach((log) => {
    const timestamp = new Date(log.timestamp).getTime();
    const index = Math.min(bucketCount - 1, Math.max(0, Math.floor((timestamp - start) / interval)));
    buckets[index].count += 1;
  });
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);
  return buckets.map((bucket) => ({ ...bucket, height: bucket.count ? Math.max(4, Math.round((bucket.count / max) * 100)) : 0, label: formatDay(bucket.start) }));
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [range, setRange] = useState<(typeof ranges)[number]["value"]>("30");
  const [type, setType] = useState<DeliveryType | "ALL">("ALL");
  const rangeDays = Number(range);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/user/getApiLogs");
      if (!response.ok) throw new Error("Unable to load events");
      const result = (await response.json()) as { logs?: DeliveryLog[] };
      setLogs(result.logs ?? []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const inRange = useMemo(() => {
    const cutoff = rangeDays === 0 ? 0 : ANALYTICS_REFERENCE_TIME - rangeDays * 86_400_000;
    return logs.filter((log) => rangeDays === 0 || new Date(log.timestamp).getTime() >= cutoff);
  }, [logs, rangeDays]);

  const filtered = useMemo(() => inRange.filter((log) => type === "ALL" || eventType(log) === type), [inRange, type]);
  const buckets = useMemo(() => buildBuckets(filtered, rangeDays), [filtered, rangeDays]);
  const peak = useMemo(() => Math.max(0, ...buckets.map((bucket) => bucket.count)), [buckets]);
  const counts = useMemo(() => ({
    all: inRange.length,
    impression: inRange.filter((log) => eventType(log) === "IMPRESSION").length,
    click: inRange.filter((log) => eventType(log) === "CLICK").length,
    dismiss: inRange.filter((log) => eventType(log) === "DISMISS").length,
  }), [inRange]);
  const clickRate = counts.impression ? `${Math.round((counts.click / counts.impression) * 100)}% of impressions` : "No impressions yet";
  const rangeLabel = ranges.find((option) => option.value === range)?.label ?? "";

  return (
    <WorkspaceShell>
      <main className="app-page">
        <PageHeader
          title="Analytics"
          description="Impressions, clicks, and dismissals recorded by your sites."
          actions={<button type="button" className="app-btn app-btn--secondary" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} size={14} /> Refresh</button>}
        />

        <div className="app-toolbar">
          <Tabs label="Time range" value={range} options={ranges} onChange={setRange} />
          <div className="app-toolbar__end">
            <label>
              <span className="sr-only">Event type</span>
              <select className="app-select" value={type} onChange={(event) => setType(event.target.value as DeliveryType | "ALL")}>
                <option value="ALL">All events</option>
                {Object.entries(eventLabels).map(([value, label]) => <option value={value} key={value}>{label}s</option>)}
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <Card>
            <EmptyState
              compact
              icon={<AlertCircle size={18} />}
              title="Events could not be loaded"
              description="Nothing was changed. Retry when the API is available."
              action={<button type="button" className="app-btn app-btn--secondary app-btn--sm" onClick={() => void load()}><RefreshCw size={13} /> Retry</button>}
            />
          </Card>
        ) : null}

        <section className="app-stats" aria-label="Event counts">
          <Stat label="Total events" icon={<Activity size={15} />} value={loading ? "—" : counts.all} hint={`Last ${rangeLabel.toLowerCase()}`} />
          <Stat label="Impressions" icon={<Eye size={15} />} value={loading ? "—" : counts.impression} hint="Campaign shown to a visitor" />
          <Stat label="Clicks" icon={<MousePointerClick size={15} />} value={loading ? "—" : counts.click} hint={loading ? "—" : clickRate} />
          <Stat label="Dismissals" icon={<X size={15} />} value={loading ? "—" : counts.dismiss} hint="Closed by the visitor" />
        </section>

        <div className="app-grid app-grid--main-side">
          <Card
            title="Events over time"
            titleId="chart-title"
            description={type === "ALL" ? "All event types" : `${eventLabels[type]}s only`}
            action={!loading && filtered.length ? <span className="app-header-note">Peak {peak}</span> : null}
          >
            {loading ? (
              <div className="app-chart app-chart--loading"><LoadingRows rows={4} label="events" /></div>
            ) : filtered.length === 0 ? (
              <EmptyState icon={<BarChart3 size={18} />} title="No events in this range" description="Try a wider range, or publish a campaign to a verified site." />
            ) : (
              <div className="app-chart">
                <div className="app-chart__plot">
                  {buckets.map((bucket) => (
                    <div className="app-chart__col" key={`${bucket.start}-${bucket.end}`} title={`${bucket.count} event${bucket.count === 1 ? "" : "s"} · ${bucket.label}`}>
                      <span style={{ height: `${bucket.height}%` }} />
                    </div>
                  ))}
                </div>
                <div className="app-chart__axis" aria-hidden="true">
                  <span>{buckets[0]?.label}</span>
                  <span>{buckets[Math.floor(buckets.length / 2)]?.label}</span>
                  <span>{buckets[buckets.length - 1]?.label}</span>
                </div>
              </div>
            )}
          </Card>

          <Card title="Recent events" titleId="ledger-title" description={loading ? undefined : `${filtered.length} in range`} flush>
            {loading ? (
              <div className="app-card__body"><LoadingRows label="events" /></div>
            ) : filtered.length === 0 ? (
              <EmptyState compact title="Nothing to show" description="No events match the current filters." />
            ) : (
              <ul className="app-feed app-feed--scroll">
                {filtered.slice(0, 25).map((log) => {
                  const kind = eventType(log);
                  return (
                    <li key={log.id}>
                      <span className={`app-dot app-dot--${(kind ?? "other").toLowerCase()}`} aria-hidden="true" />
                      <span className="app-feed__text">
                        <strong>{kind ? eventLabels[kind] : log.name || "Event"}</strong>
                        <small>{log.endpoint || "site feed"}</small>
                      </span>
                      <time dateTime={log.timestamp}>{formatTime(log.timestamp, true)}</time>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </main>
    </WorkspaceShell>
  );
}
