"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  Globe2,
  Radio,
  RefreshCw,
  TerminalSquare,
} from "lucide-react";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

const DASHBOARD_REFERENCE_TIME = Date.now();

export type Website = {
  id: string;
  publicId: string;
  verificationRecord?: string;
  verificationToken?: string;
  verifiedAt?: string | null;
  name: string;
  url: string;
  isVerified: boolean;
  status: "PENDING" | "ACTIVE" | "DEACTIVATED";
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  type: "ALERT" | "ALERT_DIALOG" | "TOAST";
  textColor: string;
  borderColor: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string | Date;
};

type CampaignSummary = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  currentRevision: number;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  revisions: Array<{
    title: string;
    description: string;
    type: "ALERT" | "ALERT_DIALOG" | "TOAST";
    preset: string;
  }>;
  targets: Array<{ website: { id: string; name: string } }>;
  _count: { deliveryEvents: number };
};

type RequestLog = {
  id: string;
  endpoint: string;
  name?: string;
  timestamp: string;
  success: boolean;
};

type ResourceState<T> = {
  data: T;
  loading: boolean;
  error: boolean;
};

const emptyResource = <T,>(data: T): ResourceState<T> => ({ data, loading: true, error: false });

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function campaignLabel(campaign: CampaignSummary) {
  const revision = campaign.revisions[0];
  return revision?.title || "Untitled campaign";
}

function campaignState(campaign: CampaignSummary) {
  if (campaign.status === "ARCHIVED") return "Archived";
  if (campaign.status === "DRAFT") return "Draft";
  return new Date(campaign.startsAt).getTime() > Date.now() ? "Scheduled" : "Published";
}

function ResourceError({ label, onRetry }: { label: string; onRetry: () => void }) {
  return (
    <div className="workspace-empty workspace-empty--error">
      <AlertCircle aria-hidden="true" size={17} />
      <div>
        <strong>{label} could not be loaded.</strong>
        <p>Try the request again to refresh this part of the workspace.</p>
      </div>
      <button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={onRetry}>
        <RefreshCw size={13} /> Retry
      </button>
    </div>
  );
}

function ResourceLoading({ label }: { label: string }) {
  return <div className="workspace-loading" role="status" aria-label={`Loading ${label}`}><span /><span /><span /></div>;
}

function Checklist({ websites, campaigns }: { websites: Website[]; campaigns: CampaignSummary[] }) {
  const activeSites = websites.filter((site) => site.status === "ACTIVE" && site.isVerified);
  const hasPending = websites.some((site) => site.status === "PENDING");
  const hasPublishedCampaign = campaigns.some((campaign) => campaign.status === "PUBLISHED");
  const steps = [
    { label: "Add a site", detail: "Register the exact HTTPS origin.", complete: websites.length > 0, href: "/sites" },
    { label: "Publish the DNS TXT record", detail: "Prove ownership for a pending origin.", complete: websites.length > 0 && !hasPending, href: "/sites" },
    { label: "Verify the origin", detail: "Recheck until the site is active.", complete: activeSites.length > 0, href: "/sites" },
    { label: "Install the SDK", detail: "Mount Droplert with a public site ID in your app.", complete: false, href: "/sites" },
    { label: "Publish a campaign", detail: "Send the first durable record to a verified site.", complete: hasPublishedCampaign, href: "/campaigns" },
  ];
  const completeCount = steps.filter((step) => step.complete).length;

  if (completeCount === steps.length) {
    return <section className="workspace-success-strip"><CheckCircle2 size={18} /><div><strong>Workspace is ready.</strong><span>Sites, SDK connection, and the first campaign are in place.</span></div><Link href="/campaigns">Open registry <ArrowRight size={14} /></Link></section>;
  }

  return (
    <section className="workspace-panel workspace-checklist" aria-labelledby="setup-title">
      <div className="workspace-panel__header">
        <div><span className="workspace-eyebrow">First-run path / {completeCount} of {steps.length}</span><h2 id="setup-title">Prepare a destination for delivery.</h2><p>Each step reflects the state Droplert can verify from this workspace.</p></div>
        <TerminalSquare aria-hidden="true" size={18} />
      </div>
      <ol className="workspace-checklist__items">
        {steps.map((step, index) => (
          <li key={step.label} className={step.complete ? "is-complete" : ""}>
            <span className="workspace-checklist__number">{step.complete ? <Check size={13} /> : String(index + 1).padStart(2, "0")}</span>
            <div><strong>{step.label}</strong><span>{step.detail}</span></div>
            {!step.complete ? <Link href={step.href} aria-label={`Open ${step.label}`}>{index === 3 ? "View guide" : "Open"} <ArrowRight size={13} /></Link> : <span className="workspace-checklist__done">done</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState<ResourceState<Website[]>>(emptyResource([]));
  const [campaigns, setCampaigns] = useState<ResourceState<CampaignSummary[]>>(emptyResource([]));
  const [logs, setLogs] = useState<ResourceState<RequestLog[]>>(emptyResource([]));

  const loadWebsites = useCallback(async () => {
    setWebsites((current) => ({ ...current, loading: true, error: false }));
    try {
      const response = await fetch("/api/user/websites/list");
      if (!response.ok) throw new Error("Unable to load sites");
      const result = (await response.json()) as { websites?: Website[] };
      setWebsites({ data: result.websites ?? [], loading: false, error: false });
    } catch {
      setWebsites((current) => ({ ...current, loading: false, error: true }));
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    setCampaigns((current) => ({ ...current, loading: true, error: false }));
    try {
      const response = await fetch("/api/campaigns");
      if (!response.ok) throw new Error("Unable to load campaigns");
      const result = (await response.json()) as { campaigns?: CampaignSummary[] };
      setCampaigns({ data: result.campaigns ?? [], loading: false, error: false });
    } catch {
      setCampaigns((current) => ({ ...current, loading: false, error: true }));
    }
  }, []);

  const loadLogs = useCallback(async () => {
    setLogs((current) => ({ ...current, loading: true, error: false }));
    try {
      const response = await fetch("/api/user/getApiLogs");
      if (!response.ok) throw new Error("Unable to load delivery events");
      const result = (await response.json()) as { logs?: RequestLog[] };
      setLogs({ data: result.logs ?? [], loading: false, error: false });
    } catch {
      setLogs((current) => ({ ...current, loading: false, error: true }));
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void Promise.all([loadWebsites(), loadCampaigns(), loadLogs()]);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadCampaigns, loadLogs, loadWebsites]);

  const activeSites = websites.data.filter((site) => site.status === "ACTIVE" && site.isVerified);
  const pendingSites = websites.data.filter((site) => site.status === "PENDING");
  const publishedCount = campaigns.data.filter((campaign) => campaign.status === "PUBLISHED" && new Date(campaign.startsAt).getTime() <= DASHBOARD_REFERENCE_TIME).length;
  const scheduledCount = campaigns.data.filter((campaign) => campaign.status === "PUBLISHED" && new Date(campaign.startsAt).getTime() > DASHBOARD_REFERENCE_TIME).length;
  const latestCampaigns = useMemo(() => campaigns.data.slice(0, 3), [campaigns.data]);
  const latestLog = logs.data[0];
  const recommendedHref = activeSites.length === 0 ? "/sites" : publishedCount === 0 ? "/campaigns" : "/analytics";
  const recommendedLabel = activeSites.length === 0 ? "Verify a site" : publishedCount === 0 ? "Compose your first campaign" : "Inspect delivery";

  return (
    <WorkspaceShell hideNewCampaign>
      <main className="workspace-page workspace-page--overview">
        <div className="workspace-page__intro">
          <div><span className="workspace-eyebrow">Overview / durable delivery</span><h1>Keep the next product moment moving.</h1><p>One concise view of destinations, campaign records, and the latest delivery signal.</p></div>
          <Link className="workspace-button workspace-button--primary" href="/alert"><FileText size={15} /> New campaign <ArrowRight size={14} /></Link>
        </div>

        <section className="workspace-metric-grid" aria-label="Workspace summary">
          <article className="workspace-metric"><div><span>Active sites</span><Globe2 size={15} /></div><strong>{websites.loading ? "—" : activeSites.length}</strong><small>{websites.loading ? "Loading destinations" : `${pendingSites.length} pending / ${websites.data.length} total`}</small></article>
          <article className="workspace-metric"><div><span>Published</span><CheckCircle2 size={15} /></div><strong>{campaigns.loading ? "—" : publishedCount}</strong><small>{campaigns.loading ? "Loading campaigns" : `${scheduledCount} scheduled`}</small></article>
          <article className="workspace-metric"><div><span>Recorded events</span><Radio size={15} /></div><strong>{logs.loading ? "—" : logs.data.length}</strong><small>{logs.loading ? "Loading event feed" : "delivery events returned"}</small></article>
          <article className="workspace-metric workspace-metric--signal"><div><span>Next action</span><Clock3 size={15} /></div><strong className="workspace-metric__action">{recommendedLabel}</strong><small><Link href={recommendedHref}>Open destination <ArrowRight size={12} /></Link></small></article>
        </section>

        <div className="workspace-overview-grid">
          <div className="workspace-overview-main">
            {websites.error || campaigns.error || logs.error ? (
              <section className="workspace-panel workspace-panel--notice"><span className="workspace-eyebrow">Resource status</span><h2>Some workspace data needs another read.</h2><p>Independent resources can be retried without losing the rest of the overview.</p><div className="workspace-retry-row">{websites.error ? <button type="button" onClick={() => void loadWebsites()}>Retry sites</button> : null}{campaigns.error ? <button type="button" onClick={() => void loadCampaigns()}>Retry campaigns</button> : null}{logs.error ? <button type="button" onClick={() => void loadLogs()}>Retry events</button> : null}</div></section>
            ) : null}
            <Checklist websites={websites.data} campaigns={campaigns.data} />

            <section className="workspace-panel workspace-panel--compact" aria-labelledby="recent-campaigns-title">
              <div className="workspace-panel__header workspace-panel__header--inline"><div><span className="workspace-eyebrow">Campaign registry</span><h2 id="recent-campaigns-title">Recent campaigns</h2></div><Link href="/campaigns">View all <ArrowRight size={13} /></Link></div>
              {campaigns.loading ? <ResourceLoading label="campaigns" /> : campaigns.error ? <ResourceError label="Campaigns" onRetry={() => void loadCampaigns()} /> : latestCampaigns.length === 0 ? <div className="workspace-empty"><FileText size={17} /><div><strong>No campaigns have been published.</strong><p>Choose a surface and create the first durable record.</p></div><Link href="/alert" className="workspace-button workspace-button--quiet workspace-button--compact">Start composing <ArrowRight size={13} /></Link></div> : <div className="workspace-list workspace-list--campaigns">{latestCampaigns.map((campaign) => <Link key={campaign.id} href="/campaigns" className="workspace-list__row"><span className="workspace-list__marker" aria-hidden="true" /><span className="workspace-list__body"><strong>{campaignLabel(campaign)}</strong><small>{campaign.revisions[0]?.type.replace("_", " ") ?? "Campaign"} · {campaign.targets.length} site{campaign.targets.length === 1 ? "" : "s"}</small></span><span className="workspace-list__meta"><b>{campaignState(campaign)}</b><small>rev {campaign.currentRevision}</small></span><ArrowRight size={14} /></Link>)}</div>}
            </section>
          </div>

          <aside className="workspace-overview-side">
            <section className="workspace-panel workspace-panel--compact" aria-labelledby="signal-title">
              <div className="workspace-panel__header workspace-panel__header--inline"><div><span className="workspace-eyebrow">Latest signal</span><h2 id="signal-title">Delivery event</h2></div><Link href="/analytics" aria-label="Open analytics"><ArrowRight size={15} /></Link></div>
              {logs.loading ? <ResourceLoading label="delivery events" /> : logs.error ? <ResourceError label="Delivery events" onRetry={() => void loadLogs()} /> : latestLog ? <div className="workspace-signal"><span className="workspace-signal__icon"><Radio size={16} /></span><div><strong>{latestLog.name || "Recorded delivery event"}</strong><p>{latestLog.endpoint}</p><small>{formatDate(latestLog.timestamp)}</small></div><span className="workspace-signal__status">recorded</span></div> : <div className="workspace-empty workspace-empty--small"><Radio size={16} /><div><strong>No delivery events yet.</strong><p>Events appear when a published campaign reaches a visitor.</p></div></div>}
            </section>
            <section className="workspace-panel workspace-panel--compact workspace-install-note"><span className="workspace-eyebrow">Installation context</span><h2>Public reader, private publishing.</h2><p>The SDK uses a public site ID. Workspace authorization and campaign records stay on the owner side.</p><Link href="/sites">View install context <ArrowRight size={13} /></Link></section>
          </aside>
        </div>
      </main>
    </WorkspaceShell>
  );
}
