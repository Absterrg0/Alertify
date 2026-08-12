"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  RefreshCw,
  Search,
  ShieldCheck,
  TerminalSquare,
  X,
} from "lucide-react";

import { WebsiteAddition } from "@/components/Website-addition-dialog";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type WebsiteStatus = "PENDING" | "ACTIVE" | "DEACTIVATED";

export interface Website {
  id: string;
  publicId: string;
  verificationRecord?: string;
  verificationToken?: string;
  verifiedAt?: string | null;
  name: string;
  url: string;
  status: WebsiteStatus;
  isVerified: boolean;
}

interface VerifiedWebsiteManagerProps {
  websites: Website[];
  selectedWebsites?: Website[];
  onWebsitesChange: (websites?: Website[]) => void | Promise<void>;
  onSelectedWebsitesChange?: (selectedWebsites: Website[]) => void;
}

const statusCopy: Record<WebsiteStatus, { label: string; detail: string }> = {
  ACTIVE: { label: "Active", detail: "Verified and targetable" },
  PENDING: { label: "Pending", detail: "DNS record required" },
  DEACTIVATED: { label: "Deactivated", detail: "No longer targetable" },
};

const SITE_LIMIT = 6;

function hostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

function sortWebsites(items: Website[]) {
  const order: Record<WebsiteStatus, number> = { ACTIVE: 0, PENDING: 1, DEACTIVATED: 2 };
  return [...items].sort((a, b) => order[a.status] - order[b.status]);
}

export default function VerifiedWebsiteManager({
  websites,
  selectedWebsites = [],
  onWebsitesChange,
  onSelectedWebsitesChange,
}: VerifiedWebsiteManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<WebsiteStatus | "ALL">("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(websites[0]?.id ?? null);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState<string | null>(null);
  const [isReactivating, setIsReactivating] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredWebsites = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return sortWebsites(websites).filter((site) => {
      const matchesStatus = statusFilter === "ALL" || site.status === statusFilter;
      const matchesQuery = !query || site.name.toLowerCase().includes(query) || site.url.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [searchTerm, statusFilter, websites]);

  const selectedSite = websites.find((site) => site.id === selectedId) ?? null;
  const activeSites = websites.filter((site) => site.status === "ACTIVE" && site.isVerified);
  const pendingSites = websites.filter((site) => site.status === "PENDING");
  const deactivatedSites = websites.filter((site) => site.status === "DEACTIVATED");
  const targetableSelectedWebsites = selectedWebsites.filter((site) => site.status === "ACTIVE" && site.isVerified);
  const selectedIds = new Set(targetableSelectedWebsites.map((site) => site.id));
  const visibleTargetable = filteredWebsites.filter((site) => site.status === "ACTIVE" && site.isVerified);
  const allVisibleSelected = visibleTargetable.length > 0 && visibleTargetable.every((site) => selectedIds.has(site.id));

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1_500);
      toast({ title: "Copied", description: label === "id" ? "Public site ID copied." : "DNS TXT value copied." });
    } catch {
      toast({ title: "Copy failed", description: "Copy the value manually from the panel.", variant: "destructive" });
    }
  };

  const handleVerify = async (site: Website) => {
    setIsVerifying(site.id);
    try {
      const response = await fetch("/api/notify/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: site.id }) });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Verification failed");
      await onWebsitesChange(sortWebsites(websites.map((item) => item.id === site.id ? { ...item, status: "ACTIVE" as const, isVerified: true, verifiedAt: new Date().toISOString() } : item)));
      toast({ title: "Site verified", description: `${site.name} is ready for campaign targeting.` });
    } catch (error) {
      toast({ title: "Verification failed", description: error instanceof Error ? error.message : "Check the DNS record and try again.", variant: "destructive" });
    } finally {
      setIsVerifying(null);
    }
  };

  const handleDeactivate = async (site: Website) => {
    setIsDeactivating(site.id);
    try {
      const response = await fetch(`/api/user/websites/update/${site.id}`, { method: "POST" });
      const result = (await response.json()) as { msg?: string };
      if (!response.ok) throw new Error(result.msg || "Deactivation failed");
      onSelectedWebsitesChange?.(targetableSelectedWebsites.filter((item) => item.id !== site.id));
      await onWebsitesChange(sortWebsites(websites.map((item) => item.id === site.id ? { ...item, status: "DEACTIVATED" as const } : item)));
      toast({ title: "Site deactivated", description: "It will no longer receive new campaigns." });
    } catch (error) {
      toast({ title: "Could not deactivate site", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
    } finally {
      setIsDeactivating(null);
    }
  };

  const handleReactivate = async (site: Website) => {
    setIsReactivating(site.id);
    try {
      const response = await fetch(`/api/user/websites/update/${site.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reactivate" }),
      });
      const result = (await response.json()) as { msg?: string; website?: Pick<Website, "status" | "isVerified" | "verifiedAt"> };
      if (!response.ok) throw new Error(result.msg || "Reactivation failed");

      const nextStatus = result.website?.status ?? (site.isVerified ? "ACTIVE" : "PENDING");
      const nextVerified = result.website?.isVerified ?? site.isVerified;
      await onWebsitesChange(sortWebsites(websites.map((item) => item.id === site.id ? { ...item, status: nextStatus, isVerified: nextVerified, verifiedAt: result.website?.verifiedAt ?? item.verifiedAt } : item)));
      toast({ title: nextVerified ? "Site reactivated" : "Site returned to pending", description: nextVerified ? "Its existing DNS verification is still recorded and it can receive new campaigns." : "Publish its DNS record and recheck verification before targeting it." });
    } catch (error) {
      toast({ title: "Could not reactivate site", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
    } finally {
      setIsReactivating(null);
    }
  };

  const toggleSite = (site: Website) => {
    if (site.status !== "ACTIVE" || !site.isVerified || !onSelectedWebsitesChange) return;
    onSelectedWebsitesChange(selectedIds.has(site.id) ? targetableSelectedWebsites.filter((item) => item.id !== site.id) : [...targetableSelectedWebsites, site]);
  };

  const toggleAll = (checked: boolean) => {
    if (!onSelectedWebsitesChange) return;
    if (checked) {
      const next = [...targetableSelectedWebsites];
      visibleTargetable.forEach((site) => { if (!selectedIds.has(site.id)) next.push(site); });
      onSelectedWebsitesChange(next);
    } else {
      onSelectedWebsitesChange(targetableSelectedWebsites.filter((site) => !visibleTargetable.some((visible) => visible.id === site.id)));
    }
  };

  return (
    <div className="workspace-sites-registry">
      <div className="workspace-site-metrics" aria-label="Site counts">
        <button type="button" className={statusFilter === "ALL" ? "is-active" : ""} onClick={() => setStatusFilter("ALL")}><strong>{websites.length}</strong><span>All sites</span></button>
        <button type="button" className={statusFilter === "ACTIVE" ? "is-active" : ""} onClick={() => setStatusFilter("ACTIVE")}><strong>{activeSites.length}</strong><span>Active</span></button>
        <button type="button" className={statusFilter === "PENDING" ? "is-active" : ""} onClick={() => setStatusFilter("PENDING")}><strong>{pendingSites.length}</strong><span>Pending</span></button>
        <button type="button" className={statusFilter === "DEACTIVATED" ? "is-active" : ""} onClick={() => setStatusFilter("DEACTIVATED")}><strong>{deactivatedSites.length}</strong><span>Deactivated</span></button>
      </div>
      <div className="workspace-panel workspace-sites-panel">
        <div className="workspace-panel__header workspace-panel__header--inline">
          <label className="workspace-search"><Search aria-hidden="true" size={15} /><span className="sr-only">Search sites</span><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search site name or origin" /></label>
          <div className="workspace-site-actions"><span>{websites.length} / {SITE_LIMIT} slots</span>{websites.length < SITE_LIMIT ? <WebsiteAddition onAddition={() => void onWebsitesChange()} /> : null}</div>
        </div>
        {filteredWebsites.length === 0 ? <div className="workspace-empty workspace-empty--large"><Globe2 size={19} /><div><strong>{websites.length ? "No sites match this view." : "Add your first site."}</strong><p>{websites.length ? "Try a different search or status filter." : "Register an HTTPS origin before publishing campaigns."}</p></div>{websites.length === 0 ? <WebsiteAddition onAddition={() => void onWebsitesChange()} /> : null}</div> : <>
          <div className="workspace-sites-select-all">{onSelectedWebsitesChange ? <label><input type="checkbox" checked={allVisibleSelected} onChange={(event) => toggleAll(event.target.checked)} /> {targetableSelectedWebsites.length ? `${targetableSelectedWebsites.length} active target${targetableSelectedWebsites.length === 1 ? "" : "s"} selected` : "Select active sites to target"}</label> : <span>Active sites are the only targetable destinations.</span>}{onSelectedWebsitesChange && targetableSelectedWebsites.length > 0 ? <Link href={`/alert?sites=${targetableSelectedWebsites.map((site) => site.id).join(",")}`}>Compose with selected <ArrowRight size={13} /></Link> : <span>{onSelectedWebsitesChange ? "Choose a site to continue" : ""}</span>}</div>
          <div className="workspace-site-list" role="list">
            {filteredWebsites.map((site) => {
              const targetable = site.status === "ACTIVE" && site.isVerified;
              const selected = selectedIds.has(site.id);
              const status = statusCopy[site.status];
              return <article key={site.id} className={`workspace-site-row ${selectedId === site.id ? "is-focused" : ""} ${site.status === "DEACTIVATED" ? "is-deactivated" : ""}`} role="listitem" tabIndex={0} onClick={() => setSelectedId(site.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(site.id); } }}>
                <div className="workspace-site-row__select">{onSelectedWebsitesChange ? <input type="checkbox" aria-label={`Select ${site.name}`} checked={selected} disabled={!targetable} onClick={(event) => event.stopPropagation()} onChange={() => toggleSite(site)} /> : <Globe2 size={17} />}</div>
                <div className="workspace-site-row__identity"><strong>{site.name}</strong><a href={site.url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>{hostname(site.url)} <ExternalLink size={11} /></a></div>
                <span className={`workspace-status-badge workspace-status-badge--${site.status.toLowerCase()}`}><i aria-hidden="true" /> {status.label}</span>
                <span className="workspace-site-row__detail">{status.detail}</span>
                <div className="workspace-site-row__action">{site.status === "PENDING" ? <button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={(event) => { event.stopPropagation(); if (site.verificationRecord) void copy(site.verificationRecord, "record"); }} disabled={!site.verificationRecord}><Copy size={13} /> TXT</button> : site.status === "ACTIVE" ? <AlertDialog><AlertDialogTrigger asChild><button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={(event) => event.stopPropagation()} disabled={isDeactivating === site.id}><X size={13} /> Deactivate</button></AlertDialogTrigger><AlertDialogContent className="workspace-dialog"><AlertDialogHeader><AlertDialogTitle>Deactivate {site.name}?</AlertDialogTitle><AlertDialogDescription>New campaigns will stop targeting this site. Existing records remain in the registry.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="workspace-button workspace-button--quiet">Cancel</AlertDialogCancel><AlertDialogAction className="workspace-button workspace-button--danger" onClick={() => void handleDeactivate(site)}>Deactivate</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> : <AlertDialog><AlertDialogTrigger asChild><button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={(event) => event.stopPropagation()} disabled={isReactivating === site.id}><RefreshCw size={13} /> Reactivate</button></AlertDialogTrigger><AlertDialogContent className="workspace-dialog"><AlertDialogHeader><AlertDialogTitle>Reactivate {site.name}?</AlertDialogTitle><AlertDialogDescription>Droplert will restore this destination’s stored verification state. A previously verified site becomes targetable again; an unverified record returns to pending.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="workspace-button workspace-button--quiet">Cancel</AlertDialogCancel><AlertDialogAction className="workspace-button workspace-button--primary" onClick={() => void handleReactivate(site)}>Reactivate</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>}</div>
              </article>;
            })}
          </div>
        </>}
      </div>
      {selectedSite ? <aside className="workspace-site-inspector" aria-label={`${selectedSite.name} details`}><div className="workspace-site-inspector__head"><div><span className="workspace-eyebrow">Destination record</span><h2>{selectedSite.name}</h2></div><span className={`workspace-status-badge workspace-status-badge--${selectedSite.status.toLowerCase()}`}><i aria-hidden="true" /> {statusCopy[selectedSite.status].label}</span></div><dl className="workspace-detail-list"><div><dt>Canonical origin</dt><dd><a href={selectedSite.url} target="_blank" rel="noopener noreferrer">{selectedSite.url} <ExternalLink size={11} /></a></dd></div><div><dt>Public site ID</dt><dd><button type="button" className="workspace-copy-value" onClick={() => void copy(selectedSite.publicId, "id")}>{selectedSite.publicId}<span>{copied === "id" ? <Check size={13} /> : <Copy size={13} />}</span></button></dd></div><div><dt>Verified time</dt><dd>{selectedSite.verifiedAt ? new Date(selectedSite.verifiedAt).toLocaleString() : "Not verified yet"}</dd></div></dl>{selectedSite.status === "PENDING" ? <div className="workspace-dns-card"><div><TerminalSquare size={15} /><strong>Publish this DNS TXT record</strong></div><p>Add the value at the root of the canonical origin, then recheck verification.</p><div className="workspace-dns-field"><span>_droplert-verification</span><button type="button" onClick={() => selectedSite.verificationRecord && void copy(selectedSite.verificationRecord, "record")} disabled={!selectedSite.verificationRecord}>{selectedSite.verificationRecord ?? "Unavailable"}{copied === "record" ? <Check size={13} /> : <Copy size={13} />}</button></div><button type="button" className="workspace-button workspace-button--primary workspace-button--full" disabled={isVerifying === selectedSite.id} onClick={() => void handleVerify(selectedSite)}>{isVerifying === selectedSite.id ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} />} Recheck verification</button></div> : selectedSite.status === "ACTIVE" ? <div className="workspace-install-card"><div><ShieldCheck size={15} /><strong>SDK installation context</strong></div><p>Pass this public ID to <code>Droplert</code> from your verified app. The owner credential stays private.</p><code>siteId=&quot;{selectedSite.publicId}&quot;</code><Link href={`/alert?sites=${selectedSite.id}`} className="workspace-button workspace-button--quiet workspace-button--full">Target this site <ArrowRight size={13} /></Link></div> : <div className="workspace-site-inactive-note"><X size={15} /><p>This destination is deactivated and cannot receive new campaigns. Reactivate it from the registry when it should receive new campaigns again.</p></div>}</aside> : null}
    </div>
  );
}
