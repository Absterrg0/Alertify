"use client";

import { signIn } from "next-auth/react";
import { ArrowUpRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const providers = [
  { id: "google", label: "Continue with Google", icon: FcGoogle },
  { id: "github", label: "Continue with GitHub", icon: FaGithub },
] as const;

export function AuthForm() {
  return (
    <div className="grid gap-3">
      {providers.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" onClick={() => void signIn(id, { callbackUrl: "/dashboard" })} className="group flex min-h-14 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-4 text-left text-sm font-medium transition hover:border-[#70f0c0]/35 hover:bg-[#70f0c0]/[.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#70f0c0]">
          <span className="grid size-8 place-items-center rounded-lg bg-white/[.05]"><Icon className="size-5" /></span><span className="flex-1">{label}</span><ArrowUpRight size={15} className="text-[#727b89] transition group-hover:text-[#70f0c0]" />
        </button>
      ))}
      <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.12em] text-[#727b89]"><span className="h-px flex-1 bg-white/10" /> OAuth 2.0 <span className="h-px flex-1 bg-white/10" /></div>
    </div>
  );
}
