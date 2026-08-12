"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  FileText,
  Globe2,
  MessageSquare,
  PanelsTopLeft,
  Search,
  X,
} from "lucide-react";

import { ArchiveCampaignButton } from "@/components/campaigns/ArchiveCampaignButton";

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
  ALERT_DIALOG: "Alert dialog",
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
  return <span className={`workspace-status-badge workspace-status-badge--${status.toLowerCase()}`}><i aria-hidden="true" /> {status[0] + status.slice(1).toLowerCase()}</span>;
}

function TypeIcon({ type }: { type: CampaignRegistryRecord["revisions"][number]["type"] }) {
  if (type === "TOAST") return <Bell size={16} />;
  if (type === "ALERT_DIALOG") return <MessageSquare size={16} />;
  return <PanelsTopLeft size={16} />;
}

export function CampaignRegistry({ campaigns }: { campaigns: CampaignRegistryRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [type, setType] = useState<TypeFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(campaigns[0]?.id ?? null);
  const selected = campaigns.find((campaign) => campaign.id === selectedId) ?? null;

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

  const counts = useMemo(() => campaigns.reduce<Record<StatusFilter, number>>((accumulator, campaign) => {
    accumulator.ALL += 1;
    accumulator[getStatus(campaign)] += 1;
    return accumulator;
  }, { ALL: 0, PUBLISHED: 0, SCHEDULED: 0, ARCHIVED: 0, DRAFT: 0 }), [campaigns]);

  return (
    <main className="workspace-page workspace-page--registry">
      <div className="workspace-page__intro workspace-page__intro--registry">
        <div><span className="workspace-eyebrow">Campaign registry / immutable records</span><h1>Every message has a place in the feed.</h1><p>Search published, scheduled, draft, and archived revisions without losing the delivery context around them.</p></div>
        <div className="workspace-format-actions" aria-label="Choose a campaign format">
          <span>New campaign</span>
          <Link href="/alert" title="Create inline alert"><PanelsTopLeft size={14} /> Alert</Link>
          <Link href="/toast" title="Create toast"><Bell size={14} /> Toast</Link>
          <Link href="/alert_dialog" title="Create alert dialog"><MessageSquare size={14} /> Dialog</Link>
        </div>
      </div>

      <section className="workspace-registry-toolbar" aria-label="Campaign filters">
        <label className="workspace-search"><Search aria-hidden="true" size={15} /><span className="sr-only">Search campaigns</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, preset, or destination" /></label>
        <div className="workspace-filter-row">
          <label><span className="sr-only">Filter by status</span><select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>{(["ALL", "PUBLISHED", "SCHEDULED", "DRAFT", "ARCHIVED"] as const).map((value) => <option key={value} value={value}>{value === "ALL" ? `All records · ${counts.ALL}` : `${value[0] + value.slice(1).toLowerCase()} · ${counts[value]}`}</option>)}</select></label>
          <label><span className="sr-only">Filter by type</span><select value={type} onChange={(event) => setType(event.target.value as TypeFilter)}><option value="ALL">All surfaces</option>{Object.entries(typeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="workspace-panel workspace-empty workspace-empty--large"><FileText size={20} /><div><strong>{campaigns.length === 0 ? "No campaigns yet." : "No records match those filters."}</strong><p>{campaigns.length === 0 ? "Start with a focused surface and publish it to a verified site." : "Try a different title, status, or campaign type."}</p></div>{campaigns.length === 0 ? <Link className="workspace-button workspace-button--primary workspace-button--compact" href="/alert">Compose campaign <ArrowRight size={13} /></Link> : <button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={() => { setQuery(""); setStatus("ALL"); setType("ALL"); }}>Clear filters</button>}</section>
      ) : (
        <div className="workspace-registry-layout">
          <section className="workspace-registry-list" aria-label="Campaign records">
            <div className="workspace-registry-list__head"><span>{filtered.length} visible record{filtered.length === 1 ? "" : "s"}</span><span>Click a record to inspect</span></div>
            {filtered.map((campaign) => {
              const revision = campaign.revisions[0];
              const currentStatus = getStatus(campaign);
              const isSelected = selectedId === campaign.id;
              return (
                <article
                  key={campaign.id}
                  className={`workspace-campaign-row ${isSelected ? "is-selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(campaign.id)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(campaign.id); } }}
                >
                  <div className="workspace-campaign-row__icon"><TypeIcon type={revision?.type ?? "ALERT"} /></div>
                  <div className="workspace-campaign-row__main"><div className="workspace-campaign-row__tags"><StatusBadge status={currentStatus} /><span>{revision?.type ? typeLabels[revision.type] : "Campaign"}</span><span>{revision?.preset ?? "—"}</span></div><h2>{revision?.title ?? "Untitled campaign"}</h2><p>{revision?.description ?? "No description provided."}</p><div className="workspace-campaign-row__meta"><span><Globe2 size={12} /> {campaign.targets.length ? campaign.targets.map((target) => target.website.name).join(", ") : "No target sites"}</span><span><CalendarClock size={12} /> {formatDate(campaign.startsAt)}</span></div></div>
                  <div className="workspace-campaign-row__side"><span>rev {campaign.currentRevision}</span><strong>{campaign.deliveryEventCount}</strong><small>events</small>{currentStatus === "PUBLISHED" || currentStatus === "SCHEDULED" ? <ArchiveCampaignButton campaignId={campaign.id} onClick={(event) => event.stopPropagation()} /> : null}</div>
                </article>
              );
            })}
          </section>
          <CampaignInspector campaign={selected} onClose={() => setSelectedId(null)} />
        </div>
      )}
    </main>
  );
}

function CampaignInspector({ campaign, onClose }: { campaign: CampaignRegistryRecord | null; onClose: () => void }) {
  if (!campaign) return <aside className="workspace-inspector workspace-inspector--empty"><FileText size={18} /><strong>Select a campaign record.</strong><p>The immutable revision, destinations, and delivery count will appear here.</p></aside>;
  const revision = campaign.revisions[0];
  const status = getStatus(campaign);
  return (
    <aside className="workspace-inspector" aria-label="Campaign details">
      <div className="workspace-inspector__head"><div><span className="workspace-eyebrow">Record inspector</span><h2>{revision?.title ?? "Untitled campaign"}</h2></div><button type="button" className="workspace-icon-button" aria-label="Close campaign inspector" onClick={onClose}><X size={15} /></button></div>
      <div className="workspace-inspector__status"><StatusBadge status={status} /><span>Revision {campaign.currentRevision}</span></div>
      <p className="workspace-inspector__description">{revision?.description ?? "No description provided."}</p>
      <dl className="workspace-detail-list"><div><dt>Surface</dt><dd>{revision?.type ? typeLabels[revision.type] : "—"} / {revision?.preset ?? "—"}</dd></div><div><dt>Targets</dt><dd>{campaign.targets.length ? campaign.targets.map((target) => target.website.name).join(", ") : "No sites"}</dd></div><div><dt>Schedule</dt><dd>{formatDate(campaign.startsAt)}{campaign.endsAt ? ` → ${formatDate(campaign.endsAt)}` : " → open"}</dd></div><div><dt>Recorded events</dt><dd>{campaign.deliveryEventCount}</dd></div><div><dt>Routes</dt><dd>{revision?.routeRules?.length ? revision.routeRules.join(", ") : "All routes"}</dd></div><div><dt>Published</dt><dd>{campaign.createdAt ? formatDate(campaign.createdAt) : "—"}</dd></div></dl>
      <div className="workspace-inspector__note"><CheckCircle2 size={15} /><span>Published revisions are immutable. Archive is the available lifecycle action.</span></div>
      <Link href="/analytics" className="workspace-button workspace-button--quiet workspace-button--full">Inspect delivery events <ArrowRight size={13} /></Link>
    </aside>
  );
}
