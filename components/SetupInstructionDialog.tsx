"use client";

import { CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const steps = [
  {
    title: "Run the installer",
    detail: "The CLI asks for the public site ID and API origin, then writes a tiny provider and .env.local entries.",
    code: "npx droplert init",
  },
  {
    title: "Mount the provider",
    detail: "Add the generated provider once near the end of your root layout body.",
    code: 'import { DroplertProvider } from "@/components/droplert/provider";\n\n// after {children}\n<DroplertProvider />',
  },
  {
    title: "Deploy",
    detail: "The SDK loads the durable site feed on page view and refreshes visible pages efficiently. It never receives an owner credential.",
  },
];

export default function SetupInstructionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="border-white/10 bg-transparent text-white/60 hover:bg-white/5 hover:text-white"><HelpCircle size={15} className="mr-2" /> Setup</Button></DialogTrigger>
      <DialogContent className="max-w-2xl border-white/10 bg-[#0c1017] text-[#f3f3ee]">
        <DialogHeader><DialogTitle className="text-2xl tracking-[-.03em]">Install Droplert without a secret.</DialogTitle><DialogDescription className="text-white/45">The v2 client is a package-based feed reader. There is no WebSocket process, copied renderer tree, or customer verification endpoint.</DialogDescription></DialogHeader>
        <div className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <div key={step.title} className="grid gap-4 rounded-xl border border-white/10 bg-white/[.025] p-4 sm:grid-cols-[34px_1fr]">
              <div className="grid size-8 place-items-center rounded-lg bg-[#70f0c0]/10 font-mono text-xs text-[#70f0c0]">0{index + 1}</div>
              <div><h3 className="text-sm font-medium">{step.title}</h3><p className="mt-1 text-sm leading-6 text-white/45">{step.detail}</p>{step.code ? <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-[#07090d] p-3 text-xs leading-5 text-[#70f0c0]"><code>{step.code}</code></pre> : null}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="flex items-center gap-2 text-xs text-white/45"><ShieldCheck size={15} className="text-[#70f0c0]" /> Owner credentials stay in Droplert.</div><div className="flex items-center gap-2 text-xs text-white/45"><CheckCircle2 size={15} className="text-[#70f0c0]" /> Respects reduced-motion preferences.</div></div>
      </DialogContent>
    </Dialog>
  );
}
