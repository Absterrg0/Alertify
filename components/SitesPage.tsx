"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import VerifiedWebsiteManager, { SITE_LIMIT, type Website } from "@/components/WebsiteList";
import { WebsiteAddition } from "@/components/Website-addition-dialog";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { Card, EmptyState, LoadingRows, PageHeader } from "@/components/workspace/ui";

export default function SitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selected, setSelected] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/user/websites/list");
      if (!response.ok) throw new Error("Unable to load sites");
      const result = (await response.json()) as { websites?: Website[] };
      setWebsites(result.websites ?? []);
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

  return (
    <WorkspaceShell>
      <main className="app-page">
        <PageHeader
          title="Sites"
          description="Verified origins that can receive campaigns. Each site gets a public ID for the SDK."
          actions={loading || error ? null : (
            <>
              <span className="app-header-note">{websites.length} of {SITE_LIMIT} sites</span>
              {websites.length < SITE_LIMIT ? <WebsiteAddition onAddition={() => void load()} /> : null}
            </>
          )}
        />
        {loading ? (
          <Card><LoadingRows rows={4} label="sites" /></Card>
        ) : error ? (
          <Card>
            <EmptyState
              icon={<AlertCircle size={18} />}
              title="Sites could not be loaded"
              description="The request failed before anything was changed."
              action={<button type="button" className="app-btn app-btn--secondary app-btn--sm" onClick={() => void load()}><RefreshCw size={13} /> Retry</button>}
            />
          </Card>
        ) : (
          <VerifiedWebsiteManager
            websites={websites}
            selectedWebsites={selected}
            onWebsitesChange={async (next) => { if (next) setWebsites(next); else await load(); }}
            onSelectedWebsitesChange={setSelected}
          />
        )}
      </main>
    </WorkspaceShell>
  );
}
