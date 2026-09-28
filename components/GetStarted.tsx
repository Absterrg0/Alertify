"use client";

import Link from "next/link";
import { ArrowLeft, Database, Gauge, ShieldCheck } from "lucide-react";

import { DroplertMark } from "@/components/brand/DroplertMark";
import { AuthForm } from "@/components/ui/AuthForm";

const principles = [
  { icon: Database, title: "Durable by default", copy: "Campaigns survive restarts and reach the next page view.", tone: "green" },
  { icon: Gauge, title: "Quiet infrastructure", copy: "Conditional HTTP reads replace permanent visitor connections.", tone: "pink" },
  { icon: ShieldCheck, title: "No browser secrets", copy: "The installed client only receives a public per-site identifier.", tone: "blue" },
] as const;

export default function AuthPage() {
  return (
    <main className="auth">
      <section className="auth__story" aria-labelledby="auth-story-title">
        <DroplertMark />
        <div className="auth__story-body">
          <p className="lp-label">Owner workspace</p>
          <h1 id="auth-story-title">Publish product moments without running a realtime stack.</h1>
          <p className="auth__intro">Manage verified sites, shape accessible announcement surfaces, and schedule durable campaigns from one workspace.</p>
          <ul className="auth__principles">
            {principles.map(({ icon: Icon, title, copy, tone }) => (
              <li key={title} className={`auth__principle auth__principle--${tone}`}>
                <span><Icon aria-hidden="true" size={18} /></span>
                <div><strong>{title}</strong><p>{copy}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <p className="auth__footnote">SDK + versioned HTTP feed</p>
      </section>

      <section className="auth__panel">
        <div className="auth__panel-top">
          <div className="auth__mobile-brand"><DroplertMark compact /></div>
          <Link href="/" className="auth__back"><ArrowLeft aria-hidden="true" size={15} /> Back to product</Link>
        </div>
        <div className="auth__card">
          <h2>Sign in to Droplert</h2>
          <p className="auth__lede">Choose an identity provider. New accounts get a workspace automatically — then add a verified site and publish.</p>
          <AuthForm />
          <p className="auth__legal">By continuing, you acknowledge that campaign content and aggregate delivery events are stored for your workspace.</p>
        </div>
      </section>
    </main>
  );
}
