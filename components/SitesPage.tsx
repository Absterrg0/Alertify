"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import VerifiedWebsiteManager, { type Website } from "@/components/WebsiteList";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

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
    <WorkspaceShell context="Sites">
      <main className="workspace-page workspace-page--sites">
        <div className="workspace-page__intro"><div><span className="workspace-eyebrow">Sites / verification registry</span><h1>Own the destination before you publish.</h1><p>Register canonical origins, verify their DNS record, and keep the targetable surface explicit.</p></div></div>
        {loading ? <section className="workspace-panel workspace-loading-panel" role="status"><RefreshCw className="animate-spin" size={17} /><span>Loading destination records…</span></section> : error ? <section className="workspace-panel workspace-empty workspace-empty--error"><AlertCircle size={17} /><div><strong>Sites could not be loaded.</strong><p>The registry request failed before any destination state was changed.</p></div><button type="button" className="workspace-button workspace-button--quiet workspace-button--compact" onClick={() => void load()}>Retry <RefreshCw size={13} /></button></section> : <VerifiedWebsiteManager websites={websites} selectedWebsites={selected} onWebsitesChange={async (next) => { if (next) setWebsites(next); else await load(); }} onSelectedWebsitesChange={setSelected} />}
      </main>
    </WorkspaceShell>
  );
}
