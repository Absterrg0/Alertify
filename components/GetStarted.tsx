"use client";

import Link from "next/link";
import { ArrowLeft, Check, Database, Gauge, ShieldCheck } from "lucide-react";

import { DroplertMark } from "@/components/brand/DroplertMark";
import { AuthForm } from "@/components/ui/AuthForm";

const principles = [
  { icon: Database, title: "Durable by default", copy: "Campaigns survive restarts and reach the next page view." },
  { icon: Gauge, title: "Quiet infrastructure", copy: "Conditional HTTP reads replace permanent visitor connections." },
  { icon: ShieldCheck, title: "No browser secrets", copy: "The installed client only receives a public per-site identifier." },
];

export default function AuthPage() {
  return (
    <main className="grid min-h-screen bg-[#07090d] text-[#f3f3ee] lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,.95fr)]">
      <section className="relative hidden overflow-hidden border-r border-white/10 p-12 lg:flex lg:flex-col xl:p-16">
        <div className="absolute inset-0 ink-grid opacity-55" aria-hidden="true" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#70f0c0]/10 blur-[110px]" aria-hidden="true" />
        <div className="relative z-10"><DroplertMark /></div>
        <div className="relative z-10 my-auto max-w-2xl py-16">
          <p className="eyebrow">Owner control room / secure access</p>
          <h1 className="mt-5 text-5xl font-[580] leading-[.98] tracking-[-.065em] xl:text-6xl">A calmer place to publish product moments.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#9097a5]">Sign in to manage verified sites, shape accessible announcement surfaces, and schedule durable campaigns without operating a realtime delivery stack.</p>
          <div className="mt-10 grid gap-3">
            {principles.map(({ icon: Icon, title, copy }) => <article key={title} className="grid grid-cols-[36px_1fr] gap-4 border-t border-white/10 py-4"><span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[.03] text-[#70f0c0]"><Icon size={16} /></span><div><h2 className="text-sm font-medium">{title}</h2><p className="mt-1 text-xs leading-5 text-[#727b89]">{copy}</p></div></article>)}
          </div>
        </div>
        <p className="relative z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#727b89]"><Check size={13} className="text-[#70f0c0]" /> sdk + versioned http feed</p>
      </section>

      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end"><div className="lg:hidden"><DroplertMark compact /></div><Link href="/" className="inline-flex items-center gap-2 text-xs text-[#9097a5] hover:text-[#f3f3ee]"><ArrowLeft size={14} /> Back to product</Link></div>
        <div className="my-auto w-full max-w-md self-center py-12">
          <p className="eyebrow">Continue</p>
          <h2 className="mt-3 text-3xl font-[580] tracking-[-.05em] sm:text-4xl">Continue to your workspace.</h2>
          <p className="mt-3 text-sm leading-6 text-[#9097a5]">Choose an identity provider to continue. A workspace is created automatically for new users, then you can add verified sites and publish campaigns.</p>
          <div className="mt-8"><AuthForm /></div>
          <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-[#727b89]">By continuing, you acknowledge that campaign content and aggregate delivery events are stored for your workspace.</p>
        </div>
      </section>
    </main>
  );
}
