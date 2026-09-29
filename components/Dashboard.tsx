"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  Globe2,
  RefreshCw,
} from "lucide-react";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { Badge, Card, EmptyState, LoadingRows, NewCampaignMenu, PageHeader, Stat, type BadgeTone } from "@/components/workspace/ui";

const DASHBOARD_REFERENCE_TIME = Date.now();
const subscribeNoop = () => () => {};

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

const typeLabels = { ALERT: "Inline alert", TOAST: "Toast", ALERT_DIALOG: "Dialog" } as const;

function formatDate(value: string | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function campaignState(campaign: CampaignSummary): { label: string; tone: BadgeTone } {
  if (campaign.status === "ARCHIVED") return { label: "Archived", tone: "neutral" };
  if (campaign.status === "DRAFT") return { label: "Draft", tone: "blue" };
  return new Date(campaign.startsAt).getTime() > Date.now() ? { label: "Scheduled", tone: "amber" } : { label: "Live", tone: "green" };
}

function eventTone(name?: string) {
  const value = (name ?? "").toLowerCase();
  return value === "click" ? "click" : value === "dismiss" ? "dismiss" : value === "impression" ? "impression" : "other";
}

function ResourceError({ label, onRetry }: { label: string; onRetry: () => void }) {
  return (
    <EmptyState
      compact
      icon={<AlertCircle size={18} />}
      title={`${label} could not be loaded`}
      description="Nothing was changed. Try the request again."
      action={<button type="button" className="app-btn app-btn--secondary app-btn--sm" onClick={onRetry}><RefreshCw size={13} /> Retry</button>}
    />
  );
}

function Checklist({ websites, campaigns, storageKey }: { websites: Website[]; campaigns: CampaignSummary[]; storageKey: string | null }) {
  const [sdkConfirmed, setSdkConfirmed] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- localStorage is the external browser state for this manual confirmation. */
  useEffect(() => {
    if (!storageKey) {
      setSdkConfirmed(false);
      return;
    }

    try {
      setSdkConfirmed(window.localStorage.getItem(storageKey) === "true");
    } catch {
      setSdkConfirmed(false);
    }
  }, [storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleSdkConfirmation = () => {
    const nextValue = !sdkConfirmed;
    setSdkConfirmed(nextValue);
    if (!storageKey) return;

    try {
      if (nextValue) {
        window.localStorage.setItem(storageKey, "true");
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      // The control remains usable if browser storage is unavailable.
    }
  };

  const activeSites = websites.filter((site) => site.status === "ACTIVE" && site.isVerified);
  const hasPending = websites.some((site) => site.status === "PENDING");
  const hasPublishedCampaign = campaigns.some((campaign) => campaign.status === "PUBLISHED");
  const steps = [
    { label: "Add a site", detail: "Register the exact HTTPS origin.", complete: websites.length > 0, href: "/sites" },
    { label: "Publish the DNS TXT record", detail: "Prove ownership of every pending origin.", complete: websites.length > 0 && !hasPending, href: "/sites" },
    { label: "Verify the origin", detail: "Recheck until the site is active.", complete: activeSites.length > 0, href: "/sites" },
    { label: "Install the SDK", detail: "Mount Droplert with a public site ID. Confirmed in this browser.", complete: sdkConfirmed, href: "/sites" },
    { label: "Publish a campaign", detail: "Send the first record to a verified site.", complete: hasPublishedCampaign, href: "/campaigns" },
  ];
  const completeCount = steps.filter((step) => step.complete).length;

  if (completeCount === steps.length) {
    return (
      <div className="app-banner app-banner--success">
        <CheckCircle2 aria-hidden="true" size={18} />
        <div>
          <strong>Your workspace is set up</strong>
          <span>Sites are verified, the SDK is installed, and a campaign is live.</span>
        </div>
        <button type="button" className="app-btn app-btn--ghost app-btn--sm" aria-label="Undo browser-local SDK confirmation" onClick={toggleSdkConfirmation}>
          Undo SDK confirmation
        </button>
      </div>
    );
  }

  return (
    <Card
      title="Get set up"
      titleId="setup-title"
      description={`${completeCount} of ${steps.length} steps complete`}
      action={<div className="app-progress" aria-hidden="true"><span style={{ width: `${(completeCount / steps.length) * 100}%` }} /></div>}
      flush
    >
      <ol className="app-checklist">
        {steps.map((step, index) => (
          <li key={step.label} className={step.complete ? "is-complete" : undefined}>
            <span className="app-checklist__mark">{step.complete ? <Check size={12} strokeWidth={3} /> : index + 1}</span>
            <div className="app-checklist__text">
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </div>
            {index === 3 ? (
              <button type="button" className="app-btn app-btn--secondary app-btn--sm" aria-pressed={step.complete} onClick={toggleSdkConfirmation} disabled={!storageKey}>
                {step.complete ? "Undo" : "Mark installed"}
              </button>
            ) : step.complete ? (
              <span className="app-checklist__done">Done</span>
            ) : (
              <Link href={step.href} className="app-btn app-btn--secondary app-btn--sm" aria-label={`Open ${step.label}`}>
                Open
              </Link>
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
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
  const liveCount = campaigns.data.filter((campaign) => campaign.status === "PUBLISHED" && new Date(campaign.startsAt).getTime() <= DASHBOARD_REFERENCE_TIME).length;
  const scheduledCount = campaigns.data.filter((campaign) => campaign.status === "PUBLISHED" && new Date(campaign.startsAt).getTime() > DASHBOARD_REFERENCE_TIME).length;
  const latestCampaigns = useMemo(() => campaigns.data.slice(0, 5), [campaigns.data]);
  const latestLogs = useMemo(() => logs.data.slice(0, 6), [logs.data]);
  // The server has no client session; read it only after hydration so markup matches.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const sessionUser = hydrated ? session?.user : undefined;
  const sdkIdentity = sessionUser?.id ?? sessionUser?.email?.toLowerCase() ?? null;
  const sdkConfirmationStorageKey = sdkIdentity ? `droplert:sdk-reader-installed:${sdkIdentity}` : null;
  const firstName = sessionUser?.name?.split(" ")[0];
  const publicId = activeSites[0]?.publicId;

  return (
    <WorkspaceShell>
      <main className="app-page">
        <PageHeader
          title={firstName ? `Welcome back, ${firstName}` : "Overview"}
          description="Your sites, campaigns, and the latest delivery activity."
          actions={<NewCampaignMenu />}
        />

        <section className="app-stats" aria-label="Workspace summary">
          <Stat label="Active sites" icon={<Globe2 size={15} />} value={websites.loading ? "—" : activeSites.length} hint={websites.loading ? "Loading" : `${pendingSites.length} pending · ${websites.data.length} total`} />
          <Stat label="Live campaigns" icon={<BellRing size={15} />} value={campaigns.loading ? "—" : liveCount} hint={campaigns.loading ? "Loading" : `${campaigns.data.length} total records`} />
          <Stat label="Scheduled" icon={<CalendarClock size={15} />} value={campaigns.loading ? "—" : scheduledCount} hint="Waiting for their start time" />
          <Stat label="Delivery events" icon={<Activity size={15} />} value={logs.loading ? "—" : logs.data.length} hint="Most recent recorded" />
        </section>

        <div className="app-grid app-grid--main-side">
          <div className="app-stack">
            {websites.error ? (
              <Card><ResourceError label="Sites" onRetry={() => void loadWebsites()} /></Card>
            ) : null}
            {websites.loading || campaigns.loading ? null : websites.error || campaigns.error ? null : (
              <Checklist websites={websites.data} campaigns={campaigns.data} storageKey={sdkConfirmationStorageKey} />
            )}

            <Card title="Recent campaigns" titleId="recent-campaigns-title" action={<Link href="/campaigns" className="app-link">View all</Link>} flush>
              {campaigns.loading ? (
                <div className="app-card__body"><LoadingRows label="campaigns" /></div>
              ) : campaigns.error ? (
                <div className="app-card__body"><ResourceError label="Campaigns" onRetry={() => void loadCampaigns()} /></div>
              ) : latestCampaigns.length === 0 ? (
                <EmptyState icon={<BellRing size={18} />} title="No campaigns yet" description="Compose your first campaign and publish it to a verified site." action={<NewCampaignMenu />} />
              ) : (
                <ul className="app-rows">
                  {latestCampaigns.map((campaign) => {
                    const revision = campaign.revisions[0];
                    const state = campaignState(campaign);
                    return (
                      <li key={campaign.id}>
                        <Link href="/campaigns" className="app-row">
                          <span className="app-row__main">
                            <strong>{revision?.title || "Untitled campaign"}</strong>
                            <small>{revision ? typeLabels[revision.type] : "Campaign"} · {campaign.targets.length} site{campaign.targets.length === 1 ? "" : "s"}</small>
                          </span>
                          <Badge tone={state.tone}>{state.label}</Badge>
                          <span className="app-row__meta">{formatDate(campaign.startsAt)}</span>
                          <ArrowRight aria-hidden="true" size={15} className="app-row__arrow" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>

          <div className="app-stack">
            <Card title="Latest activity" titleId="activity-title" action={<Link href="/analytics" className="app-link">Analytics</Link>} flush>
              {logs.loading ? (
                <div className="app-card__body"><LoadingRows label="delivery events" /></div>
              ) : logs.error ? (
                <div className="app-card__body"><ResourceError label="Delivery events" onRetry={() => void loadLogs()} /></div>
              ) : latestLogs.length === 0 ? (
                <EmptyState compact icon={<Activity size={18} />} title="No events yet" description="Events appear when a live campaign reaches a visitor." />
              ) : (
                <ul className="app-feed">
                  {latestLogs.map((log) => (
                    <li key={log.id}>
                      <span className={`app-dot app-dot--${eventTone(log.name)}`} aria-hidden="true" />
                      <span className="app-feed__text">
                        <strong>{log.name || "Event"}</strong>
                        <small>{log.endpoint}</small>
                      </span>
                      <time dateTime={log.timestamp}>{formatDate(log.timestamp)}</time>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Install the reader" titleId="install-title">
              <p className="app-muted">Mount the component in your app with a site&apos;s public ID. Publishing stays private to this workspace.</p>
              <pre className="app-code"><code>{`<Droplert siteId="${publicId ?? "site_public_id"}" />`}</code></pre>
              <Link href="/sites" className="app-link">Find site IDs <ArrowRight aria-hidden="true" size={13} /></Link>
            </Card>
          </div>
        </div>
      </main>
    </WorkspaceShell>
  );
}
