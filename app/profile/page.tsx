"use client";

import { useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { Check, KeyRound, LoaderCircle, LockKeyhole, LogOut, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { toast } from "@/hooks/use-toast";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { Card, LoadingRows, PageHeader } from "@/components/workspace/ui";

const subscribeNoop = () => () => {};

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  // The server has no client session, so hold the loading state until hydration.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

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

  const dirty = name.trim() !== (session?.user?.name ?? "") || email.trim() !== (session?.user?.email ?? "");
  const valid = name.trim().length >= 2 && email.includes("@");

  return (
    <WorkspaceShell>
      <main className="app-page app-page--narrow">
        <PageHeader title="Settings" description="Manage the identity attached to your workspace and campaign history." />

        <Card title="Profile" titleId="profile-title" description="Shown in the workspace and recorded on the campaigns you publish.">
          {!hydrated || status === "loading" ? (
            <LoadingRows rows={2} label="profile" />
          ) : (
            <form
              className="app-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (valid && dirty) save();
              }}
            >
              <label className="app-field">
                <span className="app-label">Display name</span>
                <input className="app-input" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} autoComplete="name" />
              </label>
              <label className="app-field">
                <span className="app-label">Email</span>
                <input className="app-input" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" />
              </label>
              <div className="app-form__footer">
                <span className="app-muted">{dirty ? "You have unsaved changes." : "Up to date."}</span>
                <button type="submit" className="app-btn app-btn--primary" disabled={isPending || !valid || !dirty}>
                  {isPending ? <LoaderCircle className="animate-spin" size={15} /> : <Check size={15} />} Save changes
                </button>
              </div>
            </form>
          )}
        </Card>

        <Card title="Security" titleId="security-title" description="How publishing and delivery are separated.">
          <dl className="app-details">
            <div><dt><LockKeyhole size={14} /> Sign-in</dt><dd>OAuth provider (Google or GitHub)</dd></div>
            <div><dt><KeyRound size={14} /> Browser credentials</dt><dd>None — the SDK only receives a public site ID</dd></div>
            <div><dt><ShieldCheck size={14} /> Publishing</dt><dd>Only signed-in owners can publish or archive</dd></div>
          </dl>
        </Card>

        <Card title="Session" titleId="session-title">
          <div className="app-inline-row">
            <p className="app-muted">Sign out of Droplert on this device.</p>
            <button type="button" className="app-btn app-btn--secondary" onClick={() => void signOut({ redirectTo: "/getstarted" })}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </Card>
      </main>
    </WorkspaceShell>
  );
}
