"use client";

import { useState } from "react";
import { Check, Copy, Globe2, LoaderCircle, Plus } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import type { Website } from "./WebsiteList";
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
      <DialogTrigger asChild><button type="button" className="app-btn app-btn--primary"><Plus size={15} /> Add site</button></DialogTrigger>
      <DialogContent className="app-dialog sm:max-w-md">
        <DialogHeader>
          <div className="app-dialog__icon"><Globe2 size={17} /></div>
          <DialogTitle>{record ? "Verify domain control" : "Add a destination"}</DialogTitle>
          <DialogDescription>{record ? "Publish this TXT value at the root of your domain. DNS changes may take a few minutes to appear." : "Register one HTTPS origin. Paths, query strings, and credentials are intentionally rejected."}</DialogDescription>
        </DialogHeader>
        {record ? (
          <div className="mt-2 grid gap-2"><Label className="app-label">TXT record value</Label><button type="button" onClick={copyRecord} className="app-copy app-copy--block"><span>{record}</span>{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>
        ) : (
          <div className="mt-2 grid gap-4"><div className="grid gap-2"><Label htmlFor="site-name" className="app-label">Site name</Label><Input id="site-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={60} placeholder="Marketing site" className="app-input" /></div><div className="grid gap-2"><Label htmlFor="site-origin" className="app-label">HTTPS origin</Label><Input id="site-origin" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" className="app-input" /></div></div>
        )}
        <DialogFooter className="mt-3">{record ? <button type="button" onClick={() => setIsOpen(false)} className="app-btn app-btn--primary">Done</button> : <button type="button" onClick={handleAddWebsite} disabled={loading || name.trim().length < 2 || !url.trim()} className="app-btn app-btn--primary">{loading ? <LoaderCircle size={15} className="animate-spin" /> : <Plus size={15} />} Add destination</button>}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
