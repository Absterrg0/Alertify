"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Clock3,
  MousePointerClick,
  RefreshCw,
  X,
} from "lucide-react";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

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

function eventType(log: DeliveryLog): DeliveryType | null {
  const value = (log.name ?? "").toUpperCase();
  return value === "IMPRESSION" || value === "CLICK" || value === "DISMISS" ? value : null;
}

function formatTime(value: string, withDate = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, withDate ? { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" });
}

function buildBuckets(logs: DeliveryLog[], rangeDays: number) {
  if (logs.length === 0) return [];
  const now = Date.now();
  const rangeStart = rangeDays === 0 ? Math.min(...logs.map((log) => new Date(log.timestamp).getTime())) : now - rangeDays * 86_400_000;
  const start = Math.min(rangeStart, ...logs.map((log) => new Date(log.timestamp).getTime()));
  const end = Math.max(now, ...logs.map((log) => new Date(log.timestamp).getTime()));
  const span = Math.max(end - start, 1);
  const bucketCount = rangeDays <= 7 ? 7 : rangeDays <= 30 ? 10 : 12;
  const interval = span / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index) => ({ start: start + index * interval, end: start + (index + 1) * interval, count: 0 }));
  logs.forEach((log) => {
    const timestamp = new Date(log.timestamp).getTime();
    const index = Math.min(bucketCount - 1, Math.max(0, Math.floor((timestamp - start) / interval)));
    buckets[index].count += 1;
  });
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);
  return buckets.map((bucket) => ({ ...bucket, height: Math.max(bucket.count ? 8 : 2, Math.round((bucket.count / max) * 100)), label: formatTime(new Date(bucket.start).toISOString(), rangeDays > 7) }));
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rangeDays, setRangeDays] = useState(30);
  const [type, setType] = useState<DeliveryType | "ALL">("ALL");

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

  const filtered = useMemo(() => {
    const cutoff = rangeDays === 0 ? 0 : ANALYTICS_REFERENCE_TIME - rangeDays * 86_400_000;
    return logs.filter((log) => {
      const timestamp = new Date(log.timestamp).getTime();
      const withinRange = rangeDays === 0 || timestamp >= cutoff;
      const matchesType = type === "ALL" || eventType(log) === type;
      return withinRange && matchesType;
    });
  }, [logs, rangeDays, type]);

  const buckets = useMemo(() => buildBuckets(filtered, rangeDays), [filtered, rangeDays]);
  const counts = useMemo(() => ({
    all: filtered.length,
    impression: filtered.filter((log) => eventType(log) === "IMPRESSION").length,
    click: filtered.filter((log) => eventType(log) === "CLICK").length,
    dismiss: filtered.filter((log) => eventType(log) === "DISMISS").length,
  }), [filtered]);

  return (
    <WorkspaceShell context="Analytics">
      <main className="workspace-page workspace-page--analytics">
        <div className="workspace-page__intro"><div><span className="workspace-eyebrow">Analytics / delivery ledger</span><h1>Inspect what the feed recorded.</h1><p>These are delivery events returned by the workspace API, grouped by their actual timestamps.</p></div><button type="button" className="workspace-button workspace-button--quiet" onClick={() => void load()} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} size={14} /> Refresh</button></div>
        <section className="workspace-analytics-toolbar" aria-label="Analytics filters"><div className="workspace-analytics-toolbar__label"><CalendarRange size={15} /><span>Window</span></div><div className="workspace-segmented" role="group" aria-label="Time range"><button type="button" className={rangeDays === 7 ? "is-active" : ""} onClick={() => setRangeDays(7)}>7 days</button><button type="button" className={rangeDays === 30 ? "is-active" : ""} onClick={() => setRangeDays(30)}>30 days</button><button type="button" className={rangeDays === 90 ? "is-active" : ""} onClick={() => setRangeDays(90)}>90 days</button><button type="button" className={rangeDays === 0 ? "is-active" : ""} onClick={() => setRangeDays(0)}>All returned</button></div><label className="workspace-select"><span>Event type</span><select value={type} onChange={(event) => setType(event.target.value as DeliveryType | "ALL")}><option value="ALL">All recorded events</option>{Object.entries(eventLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></section>
        {error ? <section className="workspace-panel workspace-empty workspace-empty--error"><AlertCircle size={17} /><div><strong>Delivery events could not be loaded.</strong><p>Nothing was changed. Retry the read when the API is available.</p></div><button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={() => void load()}>Retry <RefreshCw size={13} /></button></section> : null}
        <section className="workspace-analytics-metrics" aria-label="Recorded delivery event counts"><article><span><Activity size={15} /> Recorded events</span><strong>{loading ? "—" : counts.all}</strong><small>from returned API rows</small></article><article><span><CheckCircle2 size={15} /> Impressions</span><strong>{loading ? "—" : counts.impression}</strong><small>actual event category</small></article><article><span><MousePointerClick size={15} /> Clicks</span><strong>{loading ? "—" : counts.click}</strong><small>actual event category</small></article><article><span><X size={15} /> Dismissals</span><strong>{loading ? "—" : counts.dismiss}</strong><small>actual event category</small></article></section>
        <div className="workspace-analytics-grid">
          <section className="workspace-panel workspace-chart-panel" aria-labelledby="chart-title"><div className="workspace-panel__header workspace-panel__header--inline"><div><span className="workspace-eyebrow">Timestamp buckets</span><h2 id="chart-title">Recorded delivery events</h2></div><BarChart3 size={17} /></div>{loading ? <div className="workspace-chart workspace-chart--loading" role="status"><span>Loading events…</span></div> : filtered.length === 0 ? <div className="workspace-empty workspace-empty--chart"><BarChart3 size={19} /><div><strong>No events in this window.</strong><p>Try a wider range or publish a campaign to a verified site.</p></div></div> : <div className="workspace-chart"><div className="workspace-chart__bars">{buckets.map((bucket) => <div className="workspace-chart__bar" key={`${bucket.start}-${bucket.end}`} title={`${bucket.count} event${bucket.count === 1 ? "" : "s"} · ${bucket.label}`}><span style={{ height: `${bucket.height}%` }} /></div>)}</div><div className="workspace-chart__labels">{buckets.map((bucket) => <span key={bucket.start}>{bucket.label}</span>)}</div></div>}</section>
          <section className="workspace-panel workspace-ledger" aria-labelledby="ledger-title"><div className="workspace-panel__header workspace-panel__header--inline"><div><span className="workspace-eyebrow">Event ledger</span><h2 id="ledger-title">Latest returned rows</h2></div><Clock3 size={17} /></div>{loading ? <div className="workspace-loading" role="status"><span /><span /><span /></div> : filtered.length === 0 ? <div className="workspace-empty workspace-empty--small"><Clock3 size={16} /><div><strong>Ledger is empty.</strong><p>No returned events match the current filters.</p></div></div> : <div className="workspace-ledger__rows">{filtered.slice(0, 20).map((log) => <div className="workspace-ledger__row" key={log.id}><span className={`workspace-ledger__dot workspace-ledger__dot--${(eventType(log) ?? "unknown").toLowerCase()}`} aria-hidden="true" /><div><strong>{eventType(log) ? eventLabels[eventType(log) as DeliveryType] : log.name || "Recorded event"}</strong><small>{log.endpoint || "site feed"}</small></div><time dateTime={log.timestamp}>{formatTime(log.timestamp, true)}</time></div>)}</div>}</section>
        </div>
      </main>
    </WorkspaceShell>
  );
}
