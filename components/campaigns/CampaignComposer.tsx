"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  Globe2,
  LoaderCircle,
  MousePointerClick,
  Play,
  Route,
  Send,
  Sparkles,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NotificationPreview, type PreviewConfig } from "@/components/notifications/NotificationPreview";

type Website = {
  id: string;
  publicId: string;
  name: string;
  url: string;
  status: "PENDING" | "ACTIVE" | "DEACTIVATED";
  isVerified: boolean;
};

const presets = [
  { value: "MINIMAL", label: "Minimal", detail: "Quiet and precise" },
  { value: "GLASS", label: "Glass", detail: "Soft translucent depth" },
  { value: "AURORA", label: "Aurora", detail: "Ambient color wash" },
  { value: "EDITORIAL", label: "Editorial", detail: "Strong typographic voice" },
  { value: "NEON", label: "Neon", detail: "High-energy glow" },
] as const;

const animations = ["FADE", "SLIDE", "POP", "SPRING", "FLIP"] as const;
const positions = [
  ["TOP_CENTER", "Top center"],
  ["TOP_RIGHT", "Top right"],
  ["BOTTOM_RIGHT", "Bottom right"],
  ["BOTTOM_CENTER", "Bottom center"],
] as const;

function localDateTime(date = new Date()) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

export function CampaignComposer({ type }: { type: PreviewConfig["type"] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteIds, setSelectedWebsiteIds] = useState<string[]>([]);
  const [title, setTitle] = useState("A thoughtful product update");
  const [description, setDescription] = useState("We redesigned the workspace to help your team move from idea to published campaign faster.");
  const [preset, setPreset] = useState<PreviewConfig["preset"]>(() => {
    const requested = searchParams.get("preset")?.toUpperCase();
    return presets.some((option) => option.value === requested) ? requested as PreviewConfig["preset"] : "GLASS";
  });
  const [animation, setAnimation] = useState<PreviewConfig["animation"]>("SPRING");
  const [position, setPosition] = useState("TOP_CENTER");
  const [backgroundColor, setBackgroundColor] = useState("#10151f");
  const [textColor, setTextColor] = useState("#f4f4ef");
  const [accentColor, setAccentColor] = useState("#70f0c0");
  const [borderColor, setBorderColor] = useState("#2e3746");
  const [borderRadius, setBorderRadius] = useState(18);
  const [icon, setIcon] = useState<PreviewConfig["icon"]>("SPARKLES");
  const [durationSeconds, setDurationSeconds] = useState(10);
  const [dismissible, setDismissible] = useState(true);
  const [routes, setRoutes] = useState("/*");
  const [scheduled, setScheduled] = useState(false);
  const [startsAt, setStartsAt] = useState(localDateTime());
  const [endsAt, setEndsAt] = useState("");
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState("Read the update");
  const [ctaUrl, setCtaUrl] = useState("");
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/user/websites/list", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load sites");
        return response.json() as Promise<{ websites: Website[] }>;
      })
      .then(({ websites: nextWebsites }) => {
        setWebsites(nextWebsites);
        const active = nextWebsites.filter((website) => website.status === "ACTIVE" && website.isVerified);
        const requested = new Set((searchParams.get("sites") ?? "").split(",").filter(Boolean));
        const requestedActive = active.filter((website) => requested.has(website.id)).map((website) => website.id);
        setSelectedWebsiteIds(requestedActive.length ? requestedActive : active.length === 1 ? [active[0].id] : []);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast({ title: "Could not load sites", description: "Return to Sites and try again.", variant: "destructive" });
      });
    return () => controller.abort();
  }, [searchParams, toast]);

  const preview = useMemo<PreviewConfig>(
    () => ({
      type,
      preset,
      animation,
      title,
      description,
      backgroundColor,
      textColor,
      accentColor,
      borderColor,
      borderRadius,
      icon,
      ctaLabel: ctaEnabled ? ctaLabel : undefined,
    }),
    [accentColor, animation, backgroundColor, borderColor, borderRadius, ctaEnabled, ctaLabel, description, icon, preset, textColor, title, type],
  );

  const publish = () => {
    if (selectedWebsiteIds.length === 0) {
      toast({ title: "Choose at least one active site", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            type,
            preset,
            animation,
            position,
            websiteIds: selectedWebsiteIds,
            routes: routes.split(/[\n,]/).map((route) => route.trim()).filter(Boolean),
            startsAt: scheduled ? new Date(startsAt).toISOString() : new Date().toISOString(),
            endsAt: scheduled && endsAt ? new Date(endsAt).toISOString() : null,
            dismissible,
            durationMs: durationSeconds * 1_000,
            appearance: {
              backgroundColor,
              textColor,
              accentColor,
              borderColor,
              borderRadius,
              shadow: preset === "MINIMAL" ? "NONE" : preset === "NEON" ? "GLOW" : "ELEVATED",
              imageUrl: null,
              icon,
              cta: ctaEnabled && ctaLabel && ctaUrl ? { label: ctaLabel, url: ctaUrl } : null,
            },
          }),
        });
        const result = (await response.json()) as { message?: string; campaignId?: string };
        if (!response.ok) throw new Error(result.message || "Unable to publish campaign");
        toast({ title: scheduled ? "Campaign scheduled" : "Campaign published", description: "The durable site feed has been updated." });
        router.push("/dashboard");
      } catch (error) {
        toast({ title: "Publish failed", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
      }
    });
  };

  const activeSites = websites.filter((website) => website.status === "ACTIVE" && website.isVerified);

  return (
    <main className="min-h-screen bg-[#080a0f] text-[#f3f3ee]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080a0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-8">
          <button onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#70f0c0]">
            <ArrowLeft size={16} /> Workspace
          </button>
          <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-white/45 sm:flex">
            <span>Draft</span><ChevronRight size={13} /><span>{type.replace("_", " ")}</span>
          </div>
          <Button onClick={publish} disabled={isPending} className="h-9 rounded-lg bg-[#70f0c0] px-4 text-[#07100c] hover:bg-[#8affd1]">
            {isPending ? <LoaderCircle className="mr-2 animate-spin" size={16} /> : scheduled ? <CalendarClock className="mr-2" size={16} /> : <Send className="mr-2" size={16} />}
            {scheduled ? "Schedule" : "Publish"}
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-8 sm:px-8 xl:grid-cols-[minmax(0,720px)_minmax(420px,1fr)]">
        <section className="space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-[#70f0c0]"><Sparkles size={14} /> Campaign studio</div>
            <h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Compose with intent.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">One versioned appearance contract powers this preview and every installed Droplert client.</p>
          </div>

          <ComposerSection number="01" title="Message" description="Keep the first line scannable and the detail genuinely useful.">
            <div className="space-y-4">
              <Field label="Title"><Input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} className="border-white/10 bg-white/[.04] text-white placeholder:text-white/25 focus-visible:ring-[#70f0c0]" /></Field>
              <Field label="Description"><Textarea value={description} maxLength={320} rows={4} onChange={(event) => setDescription(event.target.value)} className="resize-none border-white/10 bg-white/[.04] text-white placeholder:text-white/25 focus-visible:ring-[#70f0c0]" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Icon">
                  <select value={icon} onChange={(event) => setIcon(event.target.value as PreviewConfig["icon"])} className="h-10 w-full rounded-md border border-white/10 bg-white/[.04] px-3 text-sm">
                    {(["BELL", "SPARKLES", "CHECK", "WARNING", "INFO"] as const).map((value) => <option key={value} value={value} className="bg-[#11151d]">{value.toLowerCase()}</option>)}
                  </select>
                </Field>
                <Field label="Visible for"><div className="flex items-center gap-3"><Input type="number" min={3} max={60} value={durationSeconds} onChange={(event) => setDurationSeconds(Number(event.target.value))} className="border-white/10 bg-white/[.04] text-white focus-visible:ring-[#70f0c0]" /><span className="text-sm text-white/45">seconds</span></div></Field>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.025] p-4"><div><p className="text-sm font-medium">Dismissible</p><p className="mt-1 text-xs text-white/45">Let visitors close the campaign.</p></div><Switch checked={dismissible} onCheckedChange={setDismissible} /></div>
            </div>
          </ComposerSection>

          <ComposerSection number="02" title="Visual language" description="Choose a preset, then tune its palette and shape.">
            <div className="grid gap-3 sm:grid-cols-5">
              {presets.map((option) => (
                <button key={option.value} onClick={() => setPreset(option.value)} className={`rounded-xl border p-3 text-left transition ${preset === option.value ? "border-[#70f0c0] bg-[#70f0c0]/10" : "border-white/10 bg-white/[.025] hover:border-white/20"}`}>
                  <span className="block text-sm font-medium">{option.label}</span><span className="mt-1 block text-[11px] leading-4 text-white/40">{option.detail}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ColorField label="Surface" value={backgroundColor} onChange={setBackgroundColor} />
              <ColorField label="Text" value={textColor} onChange={setTextColor} />
              <ColorField label="Accent" value={accentColor} onChange={setAccentColor} />
              <ColorField label="Border" value={borderColor} onChange={setBorderColor} />
            </div>
            <Field label={`Corner radius · ${borderRadius}px`}><input className="mt-2 w-full accent-[#70f0c0]" type="range" min="0" max="32" value={borderRadius} onChange={(event) => setBorderRadius(Number(event.target.value))} /></Field>
          </ComposerSection>

          <ComposerSection number="03" title="Motion & placement" description="Movement should clarify arrival, never demand attention forever.">
            <div className="flex flex-wrap gap-2">
              {animations.map((value) => <button key={value} onClick={() => { setAnimation(value); setReplayKey((key) => key + 1); }} className={`rounded-lg border px-3 py-2 font-mono text-[11px] uppercase tracking-[.12em] ${animation === value ? "border-[#70f0c0] text-[#70f0c0]" : "border-white/10 text-white/50 hover:text-white"}`}>{value}</button>)}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {positions.map(([value, label]) => <button key={value} onClick={() => setPosition(value)} className={`flex items-center justify-between rounded-lg border p-3 text-sm ${position === value ? "border-[#9a8cff] bg-[#9a8cff]/10" : "border-white/10"}`}><span>{label}</span>{position === value ? <Check size={15} /> : null}</button>)}
            </div>
          </ComposerSection>

          <ComposerSection number="04" title="Audience & timing" description="Target verified sites and only the routes that should carry the message.">
            <Field label="Sites">
              <div className="grid gap-2">
                {activeSites.length ? activeSites.map((website) => {
                  const checked = selectedWebsiteIds.includes(website.id);
                  return <button key={website.id} onClick={() => setSelectedWebsiteIds((current) => checked ? current.filter((id) => id !== website.id) : [...current, website.id])} className={`flex items-center justify-between rounded-xl border p-4 text-left ${checked ? "border-[#70f0c0] bg-[#70f0c0]/[.07]" : "border-white/10"}`}><span className="flex items-center gap-3"><Globe2 size={17} className="text-white/45" /><span><span className="block text-sm font-medium">{website.name}</span><span className="mt-1 block text-xs text-white/40">{website.url}</span></span></span>{checked ? <Check size={16} className="text-[#70f0c0]" /> : null}</button>;
                }) : <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-white/50">Verify a site from the dashboard before publishing.</div>}
              </div>
            </Field>
            <Field label="Route rules"><div className="relative"><Route className="absolute left-3 top-3 text-white/30" size={16} /><Textarea value={routes} onChange={(event) => setRoutes(event.target.value)} rows={3} className="border-white/10 bg-white/[.04] pl-10 font-mono text-xs text-white placeholder:text-white/25 focus-visible:ring-[#70f0c0]" placeholder="/*&#10;/pricing&#10;/dashboard/*" /></div></Field>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.025] p-4"><div><p className="text-sm font-medium">Schedule campaign</p><p className="mt-1 text-xs text-white/45">Publish now or define a delivery window.</p></div><Switch checked={scheduled} onCheckedChange={setScheduled} /></div>
            {scheduled ? <div className="grid gap-4 sm:grid-cols-2"><Field label="Starts"><Input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="border-white/10 bg-white/[.04] text-white [color-scheme:dark] focus-visible:ring-[#70f0c0]" /></Field><Field label="Ends · optional"><Input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="border-white/10 bg-white/[.04] text-white [color-scheme:dark] focus-visible:ring-[#70f0c0]" /></Field></div> : null}
          </ComposerSection>

          <ComposerSection number="05" title="Call to action" description="Optional. Use one clear next step rather than turning the message into a menu.">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.025] p-4"><div><p className="text-sm font-medium">Add action</p><p className="mt-1 text-xs text-white/45">Open an HTTPS destination in a new tab.</p></div><Switch checked={ctaEnabled} onCheckedChange={setCtaEnabled} /></div>
            {ctaEnabled ? <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Button label"><Input value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} className="border-white/10 bg-white/[.04] text-white focus-visible:ring-[#70f0c0]" /></Field><Field label="Destination"><Input type="url" value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} placeholder="https://…" className="border-white/10 bg-white/[.04] text-white placeholder:text-white/25 focus-visible:ring-[#70f0c0]" /></Field></div> : null}
          </ComposerSection>
        </section>

        <aside className="xl:sticky xl:top-24 xl:h-fit">
          <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[11px] uppercase tracking-[.16em] text-white/45">Live client preview</span><button onClick={() => setReplayKey((key) => key + 1)} className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white"><Play size={13} /> Replay motion</button></div>
          <NotificationPreview config={preview} replayKey={replayKey} />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <PreviewStat icon={Bell} label="Preset" value={preset.toLowerCase()} />
            <PreviewStat icon={MousePointerClick} label="Motion" value={animation.toLowerCase()} />
            <PreviewStat icon={ArrowUpRight} label="Refresh" value="15 min" />
          </div>
        </aside>
      </div>
    </main>
  );
}

function ComposerSection({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/10 bg-[#0d1118] p-5 sm:p-6"><div className="mb-6 grid gap-2 sm:grid-cols-[40px_1fr]"><span className="font-mono text-xs text-[#70f0c0]">{number}</span><div><h2 className="text-lg font-medium tracking-[-.02em]">{title}</h2><p className="mt-1 text-sm leading-6 text-white/45">{description}</p></div></div><div className="sm:pl-10">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="text-xs font-medium text-white/55">{label}</Label>{children}</div>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><label className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/[.025] px-2"><input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent" /><span className="font-mono text-[10px] uppercase text-white/45">{value}</span></label></Field>;
}

function PreviewStat({ icon: Icon, label, value }: { icon: typeof Bell; label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-[#0d1118] p-3"><Icon size={14} className="mb-3 text-[#70f0c0]" /><span className="block text-[10px] uppercase tracking-wider text-white/35">{label}</span><span className="mt-1 block truncate text-xs capitalize text-white/70">{value}</span></div>;
}
