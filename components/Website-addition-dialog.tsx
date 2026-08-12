"use client";

import { useState } from "react";
import { Check, Copy, Globe2, LoaderCircle, Plus } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import type { Website } from "./Dashboard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

type WebsiteAdditionProps = { onAddition: (newWebsite: Website) => void };

export function WebsiteAddition({ onAddition }: WebsiteAdditionProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => { setName(""); setUrl(""); setRecord(null); setCopied(false); };

  const handleAddWebsite = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/websites/new", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, url: url.trim() }) });
      const data = (await response.json()) as { message?: string; website?: Website; verificationRecord?: string };
      if (!response.ok || !data.website || !data.verificationRecord) throw new Error(data.message || "Unable to add site");
      onAddition(data.website);
      setRecord(data.verificationRecord);
      toast({ title: "Site added", description: "Add the DNS record, then verify the destination." });
    } catch (error) {
      toast({ title: "Could not add site", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
    } finally { setLoading(false); }
  };

  const copyRecord = async () => {
    if (!record) return;
    await navigator.clipboard.writeText(record);
    setCopied(true);
    setTimeout(() => setCopied(false), 1_500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}>
      <DialogTrigger asChild><Button type="button" variant="outline" className="h-9 border-white/10 bg-white/[0.03] px-3 text-xs text-[#d9ded8] hover:border-[#70f0c0]/40 hover:bg-[#70f0c0]/[0.07] hover:text-[#70f0c0]"><Plus size={14} className="mr-1.5" /> Add site</Button></DialogTrigger>
      <DialogContent className="border-white/10 bg-[#0d1118] text-[#f3f3ee] sm:max-w-lg">
        <DialogHeader>
          <div className="mb-3 grid size-10 place-items-center rounded-lg border border-[#70f0c0]/20 bg-[#70f0c0]/10 text-[#70f0c0]"><Globe2 size={18} /></div>
          <DialogTitle className="text-xl tracking-[-.03em]">{record ? "Verify domain control" : "Add a destination"}</DialogTitle>
          <DialogDescription className="leading-6 text-white/45">{record ? "Publish this TXT value at the root of your domain. DNS changes may take a few minutes to appear." : "Register one HTTPS origin. Paths, query strings, and credentials are intentionally rejected."}</DialogDescription>
        </DialogHeader>
        {record ? (
          <div className="mt-4 space-y-3"><p className="font-mono text-[10px] uppercase tracking-[.14em] text-white/40">TXT record value</p><button type="button" onClick={copyRecord} className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#080a0f] p-4 text-left font-mono text-xs text-[#70f0c0] hover:border-[#70f0c0]/35"><span className="min-w-0 break-all">{record}</span>{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>
        ) : (
          <div className="mt-4 grid gap-4"><div className="space-y-2"><Label htmlFor="site-name" className="text-xs text-white/55">Site name</Label><Input id="site-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} placeholder="Marketing site" className="border-white/10 bg-white/[.04] text-white placeholder:text-white/25 focus-visible:ring-[#70f0c0]" /></div><div className="space-y-2"><Label htmlFor="site-origin" className="text-xs text-white/55">HTTPS origin</Label><Input id="site-origin" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className="border-white/10 bg-white/[.04] text-white placeholder:text-white/25 focus-visible:ring-[#70f0c0]" /></div></div>
        )}
        <DialogFooter className="mt-5">{record ? <Button type="button" onClick={() => setIsOpen(false)} className="bg-[#70f0c0] text-[#07100c] hover:bg-[#8affd1]">Done</Button> : <Button type="button" onClick={handleAddWebsite} disabled={loading || name.trim().length < 2 || !url.trim()} className="bg-[#70f0c0] text-[#07100c] hover:bg-[#8affd1]">{loading ? <LoaderCircle size={15} className="mr-2 animate-spin" /> : <Plus size={15} className="mr-2" />} Add destination</Button>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
