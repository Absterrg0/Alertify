"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowLeft, Check, LoaderCircle, ShieldCheck, UserRound } from "lucide-react";

import { DroplertMark } from "@/components/brand/DroplertMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  // Session hydration is the external source of truth for these editable fields.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setName(session?.user?.name ?? "");
    setEmail(session?.user?.email ?? "");
  }, [session?.user?.email, session?.user?.name]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const save = () => startTransition(async () => {
    try {
      const response = await fetch("/api/user/details", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to update profile");
      await update({ name, email });
      toast({ title: "Profile updated" });
    } catch (error) {
      toast({ title: "Update failed", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
    }
  });

  return (
    <main className="min-h-screen bg-[#080a0f] text-[#f3f3ee]">
      <header className="border-b border-white/10 bg-[#07090d]/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"><DroplertMark compact /><Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-[#9097a5] hover:text-white"><ArrowLeft size={14} /> Workspace</Link></div></header>
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section>
          <p className="eyebrow">Workspace settings</p><h1 className="mt-3 text-3xl font-[580] tracking-[-.05em]">Profile and identity.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#9097a5]">Keep the account attached to your campaign history current. Publishing authorization remains bound to your authenticated session.</p>
          <div className="mt-8 max-w-2xl rounded-2xl border border-white/10 bg-[#0d1118] p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5"><span className="grid size-10 place-items-center rounded-lg bg-[#9a8cff]/10 text-[#b9afff]"><UserRound size={18} /></span><div><h2 className="text-sm font-medium">Account details</h2><p className="mt-1 text-xs text-[#727b89]">Used in the workspace and authentication session.</p></div></div>
            <div className="grid gap-5"><div className="space-y-2"><Label htmlFor="profile-name" className="text-xs text-white/55">Display name</Label><Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} className="border-white/10 bg-white/[.04] text-white focus-visible:ring-[#70f0c0]" /></div><div className="space-y-2"><Label htmlFor="profile-email" className="text-xs text-white/55">Email</Label><Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="border-white/10 bg-white/[.04] text-white focus-visible:ring-[#70f0c0]" /></div><div className="flex justify-end border-t border-white/10 pt-5"><Button onClick={save} disabled={isPending || name.trim().length < 2 || !email.includes("@")} className="bg-[#70f0c0] text-[#07100c] hover:bg-[#8affd1]">{isPending ? <LoaderCircle size={15} className="mr-2 animate-spin" /> : <Check size={15} className="mr-2" />} Save changes</Button></div></div>
          </div>
        </section>
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[.025] p-5"><ShieldCheck size={18} className="text-[#70f0c0]" /><h2 className="mt-4 text-sm font-medium">Session-secured publishing</h2><p className="mt-2 text-xs leading-5 text-[#727b89]">Droplert v2 does not expose or rotate a browser API key. Public site IDs can read only the published feed for their verified origin.</p><div className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[.1em] text-[#70f0c0]">No customer secret required</div></aside>
      </div>
    </main>
  );
}
