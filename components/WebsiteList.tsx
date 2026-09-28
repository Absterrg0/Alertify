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
import { Badge, Card, EmptyState, Tabs, type BadgeTone } from "@/components/workspace/ui";

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

const statusCopy: Record<WebsiteStatus, { label: string; detail: string; tone: BadgeTone }> = {
  ACTIVE: { label: "Active", detail: "Verified and targetable", tone: "green" },
  PENDING: { label: "Pending", detail: "DNS record required", tone: "amber" },
  DEACTIVATED: { label: "Deactivated", detail: "Not targetable", tone: "neutral" },
};

export const SITE_LIMIT = 6;

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

  if (websites.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Globe2 size={18} />}
          title="Add your first site"
          description="Register an HTTPS origin and verify it with a DNS record before publishing campaigns."
          action={<WebsiteAddition onAddition={() => void onWebsitesChange()} />}
        />
      </Card>
    );
  }

  const statusOptions = [
    { value: "ALL" as const, label: "All", count: websites.length },
    { value: "ACTIVE" as const, label: "Active", count: activeSites.length },
    { value: "PENDING" as const, label: "Pending", count: pendingSites.length },
    { value: "DEACTIVATED" as const, label: "Deactivated", count: deactivatedSites.length },
  ];

  return (
    <>
      <div className="app-toolbar">
        <Tabs label="Filter by status" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
        <div className="app-toolbar__end">
          <label className="app-search">
            <Search aria-hidden="true" size={15} />
            <span className="sr-only">Search sites</span>
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search sites" />
          </label>
        </div>
      </div>

      <div className={`app-split ${selectedSite ? "" : "app-split--full"}`}>
        <Card flush className="app-table-card">
          {onSelectedWebsitesChange && targetableSelectedWebsites.length > 0 ? (
            <div className="app-selection-bar">
              <span>{targetableSelectedWebsites.length} site{targetableSelectedWebsites.length === 1 ? "" : "s"} selected</span>
              <Link href={`/alert?sites=${targetableSelectedWebsites.map((site) => site.id).join(",")}`} className="app-btn app-btn--primary app-btn--sm">
                Compose for selected <ArrowRight size={13} />
              </Link>
            </div>
          ) : null}
          {filteredWebsites.length === 0 ? (
            <EmptyState compact icon={<Search size={18} />} title="No sites match" description="Try a different search or status." />
          ) : (
            <div className="app-table app-table--sites" role="list" aria-label="Sites">
              <div className="app-table__head">
                <span>
                  {onSelectedWebsitesChange ? (
                    <input type="checkbox" className="app-checkbox" aria-label="Select all visible active sites" checked={allVisibleSelected} disabled={visibleTargetable.length === 0} onChange={(event) => toggleAll(event.target.checked)} />
                  ) : null}
                </span>
                <span>Site</span>
                <span>Status</span>
                <span>Verified</span>
                <span className="is-numeric">Action</span>
              </div>
              {filteredWebsites.map((site) => {
                const targetable = site.status === "ACTIVE" && site.isVerified;
                const status = statusCopy[site.status];
                return (
                  <div key={site.id} role="listitem" className={`app-table__row ${selectedId === site.id ? "is-selected" : ""} ${site.status === "DEACTIVATED" ? "is-muted" : ""}`}>
                    <button type="button" className="app-table__select" aria-pressed={selectedId === site.id} onClick={() => setSelectedId(site.id)}>
                      <span className="sr-only">Inspect {site.name}</span>
                    </button>
                    <span className="app-table__raise">
                      {onSelectedWebsitesChange ? (
                        <input type="checkbox" className="app-checkbox" aria-label={`Select ${site.name}`} checked={selectedIds.has(site.id)} disabled={!targetable} onChange={() => toggleSite(site)} />
                      ) : null}
                    </span>
                    <span className="app-table__primary">
                      <span className="app-type-icon"><Globe2 size={15} /></span>
                      <span>
                        <strong>{site.name}</strong>
                        <small className="app-mono">{hostname(site.url)}</small>
                      </span>
                    </span>
                    <span><Badge tone={status.tone}>{status.label}</Badge></span>
                    <span className="app-table__muted">{site.verifiedAt ? new Date(site.verifiedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
                    <span className="is-numeric app-table__raise">
                      {site.status === "PENDING" ? (
                        <button type="button" className="app-btn app-btn--secondary app-btn--sm" onClick={() => site.verificationRecord && void copy(site.verificationRecord, "record")} disabled={!site.verificationRecord}>
                          <Copy size={13} /> Copy TXT
                        </button>
                      ) : site.status === "ACTIVE" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button type="button" className="app-btn app-btn--ghost app-btn--sm" disabled={isDeactivating === site.id}>Deactivate</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="app-dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate {site.name}?</AlertDialogTitle>
                              <AlertDialogDescription>New campaigns will stop targeting this site. Existing records remain in the registry.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="app-btn app-btn--secondary">Cancel</AlertDialogCancel>
                              <AlertDialogAction className="app-btn app-btn--danger" onClick={() => void handleDeactivate(site)}>Deactivate</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button type="button" className="app-btn app-btn--ghost app-btn--sm" disabled={isReactivating === site.id}><RefreshCw size={13} /> Reactivate</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="app-dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reactivate {site.name}?</AlertDialogTitle>
                              <AlertDialogDescription>Droplert restores this site&apos;s stored verification state. A previously verified site becomes targetable again; an unverified one returns to pending.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="app-btn app-btn--secondary">Cancel</AlertDialogCancel>
                              <AlertDialogAction className="app-btn app-btn--primary" onClick={() => void handleReactivate(site)}>Reactivate</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {selectedSite ? (
          <aside className="app-card app-inspector" aria-label={`${selectedSite.name} details`}>
            <div className="app-inspector__head">
              <div>
                <Badge tone={statusCopy[selectedSite.status].tone}>{statusCopy[selectedSite.status].label}</Badge>
                <h2>{selectedSite.name}</h2>
              </div>
              <button type="button" className="app-icon-btn" aria-label="Close site details" onClick={() => setSelectedId(null)}><X size={15} /></button>
            </div>
            <dl className="app-details">
              <div><dt>Origin</dt><dd><a href={selectedSite.url} target="_blank" rel="noopener noreferrer" className="app-link">{hostname(selectedSite.url)} <ExternalLink size={12} /></a></dd></div>
              <div>
                <dt>Public ID</dt>
                <dd>
                  <button type="button" className="app-copy" onClick={() => void copy(selectedSite.publicId, "id")}>
                    <span>{selectedSite.publicId}</span>
                    {copied === "id" ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </dd>
              </div>
              <div><dt>Verified</dt><dd>{selectedSite.verifiedAt ? new Date(selectedSite.verifiedAt).toLocaleString() : "Not yet"}</dd></div>
            </dl>

            {selectedSite.status === "PENDING" ? (
              <div className="app-callout app-callout--amber">
                <strong>Add this DNS TXT record</strong>
                <p>Publish the value at the root of the origin, then recheck. DNS changes can take a few minutes.</p>
                <span className="app-callout__label">Name</span>
                <code className="app-code app-code--inline">_droplert-verification</code>
                <span className="app-callout__label">Value</span>
                <button type="button" className="app-copy" onClick={() => selectedSite.verificationRecord && void copy(selectedSite.verificationRecord, "record")} disabled={!selectedSite.verificationRecord}>
                  <span>{selectedSite.verificationRecord ?? "Unavailable"}</span>
                  {copied === "record" ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button type="button" className="app-btn app-btn--primary app-btn--block" disabled={isVerifying === selectedSite.id} onClick={() => void handleVerify(selectedSite)}>
                  {isVerifying === selectedSite.id ? <RefreshCw className="animate-spin" size={14} /> : <ShieldCheck size={14} />} Check verification
                </button>
              </div>
            ) : selectedSite.status === "ACTIVE" ? (
              <div className="app-callout">
                <strong>Install on this site</strong>
                <p>Pass the public ID to the Droplert component. It can only read this site&apos;s feed.</p>
                <pre className="app-code"><code>{`<Droplert siteId="${selectedSite.publicId}" />`}</code></pre>
                <Link href={`/alert?sites=${selectedSite.id}`} className="app-btn app-btn--secondary app-btn--block">Compose for this site <ArrowRight size={13} /></Link>
              </div>
            ) : (
              <div className="app-callout">
                <strong>Deactivated</strong>
                <p>This site can&apos;t receive new campaigns. Reactivate it from the list when you need it again.</p>
              </div>
            )}
          </aside>
        ) : null}
      </div>
    </>
  );
}
