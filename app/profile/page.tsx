"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

import { toast } from "@/hooks/use-toast";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  /* eslint-disable react-hooks/set-state-in-effect -- session hydration is the external source of truth for these fields. */
  useEffect(() => {
    setName(session?.user?.name ?? "");
    setEmail(session?.user?.email ?? "");
  }, [session?.user?.email, session?.user?.name]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const save = () => startTransition(async () => {
    try {
      const response = await fetch("/api/user/details", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), email: email.trim() }) });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to update profile");
      await update({ name: name.trim(), email: email.trim() });
      toast({ title: "Profile updated", description: "Your workspace identity is current." });
    } catch (error) {
      toast({ title: "Update failed", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
    }
  });

  return (
    <WorkspaceShell context="Settings">
      <main className="workspace-page workspace-page--profile">
        <div className="workspace-page__intro"><div><span className="workspace-eyebrow">Settings / workspace identity</span><h1>Keep the owner record current.</h1><p>Your identity is attached to campaign history and publishing authorization. Provider credentials are handled by authentication.</p></div></div>
        <div className="workspace-profile-grid">
          <section className="workspace-panel workspace-profile-form" aria-labelledby="profile-details-title"><div className="workspace-panel__header"><div><span className="workspace-eyebrow">Account details</span><h2 id="profile-details-title">Workspace member</h2><p>Used in the owner workspace and authentication session.</p></div><span className="workspace-profile-icon"><ShieldCheck size={18} /></span></div>{status === "loading" ? <div className="workspace-loading" role="status"><span /><span /><span /></div> : <div className="workspace-form-grid"><label><span>Display name</span><input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} autoComplete="name" /></label><label><span>Email</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" /></label><div className="workspace-form-actions"><button type="button" className="workspace-button workspace-button--primary" onClick={save} disabled={isPending || name.trim().length < 2 || !email.includes("@")} >{isPending ? <LoaderCircle className="animate-spin" size={15} /> : <Check size={15} />} Save changes</button></div></div>}</section>
          <aside className="workspace-panel workspace-security-card"><LockKeyhole size={18} /><span className="workspace-eyebrow">Session boundary</span><h2>Publishing stays owner-side.</h2><p>Droplert does not expose or rotate a browser API key. Public site IDs read only the verified origin feed.</p><dl><div><dt>Credential exposure</dt><dd>None in browser</dd></div><div><dt>Workspace session</dt><dd>OAuth provider</dd></div></dl></aside>
        </div>
      </main>
    </WorkspaceShell>
  );
}
