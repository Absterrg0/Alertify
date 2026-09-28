"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  MessageSquare,
  PanelsTopLeft,
  Search,
  X,
} from "lucide-react";

import { ArchiveCampaignButton } from "@/components/campaigns/ArchiveCampaignButton";
import { Badge, Card, EmptyState, NewCampaignMenu, PageHeader, Tabs, type BadgeTone } from "@/components/workspace/ui";

export type CampaignRegistryRecord = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  currentRevision: number;
  startsAt: string;
  endsAt: string | null;
  createdAt: string;
  revisions: Array<{
    revision: number;
    type: "ALERT" | "ALERT_DIALOG" | "TOAST";
    preset: "MINIMAL" | "GLASS" | "AURORA" | "EDITORIAL" | "NEON";
    animation: string;
    position: string;
    title: string;
    description: string;
    appearance: Record<string, unknown>;
    routeRules: string[];
    dismissible: boolean;
    durationMs: number;
  }>;
  targets: Array<{ website: { id: string; name: string; url: string } }>;
  deliveryEventCount: number;
};

type StatusFilter = "ALL" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" | "DRAFT";
type TypeFilter = "ALL" | "ALERT" | "TOAST" | "ALERT_DIALOG";

const typeLabels: Record<Exclude<TypeFilter, "ALL">, string> = {
  ALERT: "Inline alert",
  TOAST: "Toast",
  ALERT_DIALOG: "Dialog",
};

const statusMeta: Record<Exclude<StatusFilter, "ALL">, { label: string; tone: BadgeTone }> = {
  PUBLISHED: { label: "Live", tone: "green" },
  SCHEDULED: { label: "Scheduled", tone: "amber" },
  DRAFT: { label: "Draft", tone: "blue" },
  ARCHIVED: { label: "Archived", tone: "neutral" },
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getStatus(campaign: CampaignRegistryRecord): Exclude<StatusFilter, "ALL"> {
  if (campaign.status === "ARCHIVED") return "ARCHIVED";
  if (campaign.status === "DRAFT") return "DRAFT";
  return new Date(campaign.startsAt).getTime() > Date.now() ? "SCHEDULED" : "PUBLISHED";
}

function StatusBadge({ status }: { status: Exclude<StatusFilter, "ALL"> }) {
  return <Badge tone={statusMeta[status].tone}>{statusMeta[status].label}</Badge>;
}

function TypeIcon({ type }: { type: CampaignRegistryRecord["revisions"][number]["type"] }) {
  if (type === "TOAST") return <Bell size={15} />;
  if (type === "ALERT_DIALOG") return <MessageSquare size={15} />;
  return <PanelsTopLeft size={15} />;
}

function titleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

export function CampaignRegistry({ campaigns }: { campaigns: CampaignRegistryRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(campaigns[0]?.id ?? null);
  const [inspectorClosed, setInspectorClosed] = useState(false);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const revision = campaign.revisions[0];
      const matchesQuery = !normalizedQuery || [revision?.title, revision?.description, revision?.preset, ...campaign.targets.map((target) => target.website.name)].some((value) => value?.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === "ALL" || getStatus(campaign) === status;
      const matchesType = type === "ALL" || revision?.type === type;
      return matchesQuery && matchesStatus && matchesType;
    });
  }, [campaigns, query, status, type]);

  const visibleSelectedId = inspectorClosed ? null : selectedId === null ? null : filtered.some((campaign) => campaign.id === selectedId) ? selectedId : filtered[0]?.id ?? null;

  /* eslint-disable react-hooks/set-state-in-effect -- the inspector selection must follow the filtered master collection. */
  useEffect(() => {
    if (selectedId !== visibleSelectedId) setSelectedId(visibleSelectedId);
  }, [selectedId, visibleSelectedId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selected = filtered.find((campaign) => campaign.id === visibleSelectedId) ?? null;

  const selectCampaign = (id: string) => {
    setInspectorClosed(false);
    setSelectedId(id);
  };

  const counts = useMemo(() => campaigns.reduce<Record<StatusFilter, number>>((accumulator, campaign) => {
    accumulator.ALL += 1;
    accumulator[getStatus(campaign)] += 1;
    return accumulator;
  }, { ALL: 0, PUBLISHED: 0, SCHEDULED: 0, ARCHIVED: 0, DRAFT: 0 }), [campaigns]);

  const statusOptions = (["ALL", "PUBLISHED", "SCHEDULED", "DRAFT", "ARCHIVED"] as const).map((value) => ({
    value,
    label: value === "ALL" ? "All" : statusMeta[value].label,
    count: counts[value],
  }));

  return (
    <main className="app-page">
      <PageHeader
        title="Campaigns"
        description="Every published, scheduled, and archived revision across your sites."
        actions={<NewCampaignMenu />}
      />

      {campaigns.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BellRing size={18} />}
            title="No campaigns yet"
            description="Pick a surface, target a verified site, and publish your first campaign."
            action={<NewCampaignMenu />}
          />
        </Card>
      ) : (
        <>
          <div className="app-toolbar">
            <Tabs label="Filter by status" value={status} options={statusOptions} onChange={setStatus} />
            <div className="app-toolbar__end">
              <label className="app-search">
                <Search aria-hidden="true" size={15} />
                <span className="sr-only">Search campaigns</span>
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns" />
              </label>
              <label>
                <span className="sr-only">Filter by surface</span>
                <select className="app-select" value={type} onChange={(event) => setType(event.target.value as TypeFilter)}>
                  <option value="ALL">All surfaces</option>
                  {Object.entries(typeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className={`app-split ${selected ? "" : "app-split--full"}`}>
            <Card flush className="app-table-card">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<Search size={18} />}
                  title="No campaigns match"
                  description="Try a different search, status, or surface."
                  action={<button type="button" className="app-btn app-btn--secondary app-btn--sm" onClick={() => { setQuery(""); setStatus("ALL"); setType("ALL"); }}>Clear filters</button>}
                />
              ) : (
                <div className="app-table app-table--campaigns" role="list" aria-label="Campaigns">
                  <div className="app-table__head" aria-hidden="true">
                    <span>Campaign</span>
                    <span>Status</span>
                    <span>Sites</span>
                    <span>Starts</span>
                    <span className="is-numeric">Events</span>
                  </div>
                  {filtered.map((campaign) => {
                    const revision = campaign.revisions[0];
                    const isSelected = visibleSelectedId === campaign.id;
                    return (
                      <div
                        key={campaign.id}
                        role="listitem"
                        className={`app-table__row ${isSelected ? "is-selected" : ""}`}
                      >
                        <button type="button" className="app-table__select" aria-pressed={isSelected} onClick={() => selectCampaign(campaign.id)}>
                          <span className="sr-only">Inspect {revision?.title ?? "campaign"}</span>
                        </button>
                        <span className="app-table__primary">
                          <span className="app-type-icon"><TypeIcon type={revision?.type ?? "ALERT"} /></span>
                          <span>
                            <strong>{revision?.title ?? "Untitled campaign"}</strong>
                            <small>{revision?.type ? typeLabels[revision.type] : "Campaign"} · {revision ? titleCase(revision.preset) : "—"}</small>
                          </span>
                        </span>
                        <span><StatusBadge status={getStatus(campaign)} /></span>
                        <span className="app-table__muted">{campaign.targets.length ? campaign.targets.map((target) => target.website.name).join(", ") : "—"}</span>
                        <span className="app-table__muted">{formatDate(campaign.startsAt)}</span>
                        <span className="is-numeric">{campaign.deliveryEventCount}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {selected ? <CampaignInspector campaign={selected} onClose={() => { setInspectorClosed(true); setSelectedId(null); }} /> : null}
          </div>
        </>
      )}
    </main>
  );
}

function CampaignInspector({ campaign, onClose }: { campaign: CampaignRegistryRecord; onClose: () => void }) {
  const revision = campaign.revisions[0];
  const status = getStatus(campaign);
  const canArchive = status === "PUBLISHED" || status === "SCHEDULED";
  return (
    <aside className="app-card app-inspector" aria-label="Campaign details">
      <div className="app-inspector__head">
        <div>
          <StatusBadge status={status} />
          <h2>{revision?.title ?? "Untitled campaign"}</h2>
        </div>
        <button type="button" className="app-icon-btn" aria-label="Close campaign details" onClick={onClose}><X size={15} /></button>
      </div>
      <p className="app-inspector__description">{revision?.description ?? "No description provided."}</p>
      <dl className="app-details">
        <div><dt>Surface</dt><dd>{revision?.type ? typeLabels[revision.type] : "—"} · {revision ? titleCase(revision.preset) : "—"}</dd></div>
        <div><dt>Sites</dt><dd>{campaign.targets.length ? campaign.targets.map((target) => target.website.name).join(", ") : "No sites"}</dd></div>
        <div><dt>Routes</dt><dd className="app-mono">{revision?.routeRules?.length ? revision.routeRules.join(", ") : "All routes"}</dd></div>
        <div><dt>Window</dt><dd>{formatDate(campaign.startsAt)} → {campaign.endsAt ? formatDate(campaign.endsAt) : "open"}</dd></div>
        <div><dt>Events</dt><dd>{campaign.deliveryEventCount}</dd></div>
        <div><dt>Revision</dt><dd>{campaign.currentRevision} · created {formatDate(campaign.createdAt)}</dd></div>
      </dl>
      <p className="app-inspector__note"><CheckCircle2 aria-hidden="true" size={14} /> Published revisions are immutable. Archiving removes the campaign from site feeds.</p>
      <div className="app-inspector__actions">
        <Link href="/analytics" className="app-btn app-btn--secondary app-btn--sm">View events <ArrowRight size={13} /></Link>
        {canArchive ? <ArchiveCampaignButton campaignId={campaign.id} /> : null}
      </div>
    </aside>
  );
}
