"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DroplertMark } from "@/components/brand/DroplertMark";
import { AuthForm } from "@/components/ui/AuthForm";

export default function AuthPage() {
  return (
    <main className="grid min-h-screen bg-black text-white lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
      <section className="relative hidden border-r border-[#313131] bg-black p-12 lg:flex lg:flex-col xl:p-16">
        <div>
          <DroplertMark />
        </div>
        <div className="my-auto max-w-[680px] py-16">
          <h1 className="text-5xl font-semibold leading-none text-balance xl:text-6xl">
            Continue to the workspace that publishes the record.
          </h1>
          <p className="mt-6 max-w-xl text-base text-[#9b9b9b] text-pretty">
            Sign in with Google or GitHub. Verify an origin, then publish a campaign the next page
            load can read. No credit card.
          </p>
        </div>
        <p className="text-sm text-[#9b9b9b]">Feed is available for verified sites.</p>
      </section>

      <section className="flex min-h-screen flex-col bg-[#181818] px-6 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <DroplertMark compact />
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#9b9b9b] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to Droplert
          </Link>
        </div>
        <div className="my-auto w-full max-w-md self-center py-12">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Create your workspace.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#9b9b9b] text-pretty">
            Choose an identity provider to continue. A workspace is created for new accounts, then
            you can add a verified site and publish.
          </p>
          <div className="mt-8">
            <AuthForm />
          </div>
          <p className="mt-8 border-t border-[#313131] pt-5 text-xs leading-5 text-[#9b9b9b] text-pretty">
            By continuing, you acknowledge that campaign content and aggregate delivery events are
            stored for your workspace.
          </p>
        </div>
      </section>
    </main>
  );
}
