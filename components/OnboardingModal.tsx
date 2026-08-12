"use client";

import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, TerminalSquare } from "lucide-react";

import SetupInstructionsDialog from "./SetupInstructionDialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Site = { id: string; name: string; publicId: string; status: string; isVerified: boolean };

export default function OnboardingModal() {
  const [sites, setSites] = useState<Site[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/user/websites/list", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Unable to load sites"))))
      .then((data: { websites: Site[] }) => setSites(data.websites))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const copy = async (site: Site) => {
    await navigator.clipboard.writeText(site.publicId);
    setCopied(site.id);
    setTimeout(() => setCopied(null), 1_500);
  };

  return (
    <Card className="border-white/10 bg-[#0d1118] text-[#f3f3ee] shadow-none">
      <CardHeader className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-[#70f0c0]/10 text-[#70f0c0]"><TerminalSquare size={18} /></div>
            <div><CardTitle className="text-lg">Install the client</CardTitle><p className="mt-1 text-sm text-white/45">One public site ID. No browser secret or server route.</p></div>
          </div>
          <SetupInstructionsDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="rounded-xl border border-white/10 bg-[#080a0f] p-4 font-mono text-sm text-[#70f0c0]">npx droplert init</div>
        {sites.length ? (
          <div className="space-y-2">
            {sites.map((site) => (
              <div key={site.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/10 p-4">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{site.name}</p><p className="mt-1 truncate font-mono text-[11px] text-white/40">{site.publicId}</p></div>
                <Button variant="ghost" size="sm" onClick={() => copy(site)} className="text-white/55 hover:bg-white/5 hover:text-white">
                  {copied === site.id ? <Check size={15} className="text-[#70f0c0]" /> : <Copy size={15} />}<span className="sr-only">Copy site ID</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-dashed border-white/15 p-4 text-sm text-white/50"><KeyRound size={17} className="mt-0.5 text-[#9a8cff]" /> Add a site to generate its public installation identifier.</div>
        )}
      </CardContent>
    </Card>
  );
}
