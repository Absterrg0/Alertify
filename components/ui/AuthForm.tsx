"use client";

import { signIn } from "next-auth/react";
import { AlertCircle, ArrowUpRight, LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";

const providers = [
  { id: "google", label: "Continue with Google", icon: FcGoogle },
  { id: "github", label: "Continue with GitHub", icon: FaGithub },
] as const;

export function AuthForm() {
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const continueWithProvider = async (provider: (typeof providers)[number]["id"]) => {
    setPendingProvider(provider);
    setError(null);
    try {
      const result = await signIn(provider, { callbackUrl: "/dashboard", redirect: false });
      if (result?.error) throw new Error("The provider could not complete sign in.");
      if (result?.url) window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The provider could not complete sign in. Try again.");
      setPendingProvider(null);
    }
  };

  return (
    <div className="grid gap-3">
      {providers.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" onClick={() => void continueWithProvider(id)} disabled={pendingProvider !== null} aria-busy={pendingProvider === id} className="group flex min-h-14 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 text-left text-sm font-medium transition hover:border-[#70f0c0]/35 hover:bg-[#70f0c0]/[.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#70f0c0] disabled:cursor-wait disabled:opacity-60">
          <span className="grid size-8 place-items-center rounded-lg bg-white/[.05]">{pendingProvider === id ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Icon className="size-5" />}</span><span className="flex-1">{pendingProvider === id ? "Connecting…" : label}</span>{pendingProvider === id ? <span className="sr-only">Connecting to {label.replace("Continue with ", "")} </span> : <ArrowUpRight size={15} className="text-[#727b89] transition group-hover:text-[#70f0c0]" />}
        </button>
      ))}
      {error ? <p role="alert" className="flex items-start gap-2 border border-[#f28b8b]/30 bg-[#f28b8b]/[.07] px-3 py-2.5 text-xs leading-5 text-[#f6aaaa]"><AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}</p> : null}
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.12em] text-[#727b89]"><span className="h-px flex-1 bg-white/10" /> OAuth 2.0 <span className="h-px flex-1 bg-white/10" /></div>
    </div>
  );
}
