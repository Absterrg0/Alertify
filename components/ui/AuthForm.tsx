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
      if (result?.error) throw new Error("The provider could not complete sign-in.");
      if (result?.url) window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The provider could not complete sign-in. Try again.");
      setPendingProvider(null);
    }
  };

  return (
    <div className="auth-form">
      {providers.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" onClick={() => void continueWithProvider(id)} disabled={pendingProvider !== null} aria-busy={pendingProvider === id} className="auth-form__provider">
          <span className="auth-form__icon">{pendingProvider === id ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Icon className="size-5" />}</span>
          <span className="auth-form__label">{pendingProvider === id ? "Connecting…" : label}</span>
          {pendingProvider === id ? <span className="sr-only">Connecting to {label.replace("Continue with ", "")} </span> : <ArrowUpRight size={17} aria-hidden="true" />}
        </button>
      ))}
      {error ? <p role="alert" className="auth-form__error"><AlertCircle size={15} /> {error}</p> : null}
      <div className="auth-form__divider"><span /> OAuth 2.0 <span /></div>
    </div>
  );
}
