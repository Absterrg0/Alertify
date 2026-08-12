"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Globe2,
  LoaderCircle,
  Play,
  Route,
  Send,
  Settings2,
  Sparkles,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NotificationPreview, type PreviewConfig } from "@/components/notifications/NotificationPreview";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";

type Website = {
  id: string;
  publicId: string;
  name: string;
  url: string;
  status: "PENDING" | "ACTIVE" | "DEACTIVATED";
  isVerified: boolean;
};

type StepId = "message" | "surface" | "audience" | "delivery";
type ComposerType = PreviewConfig["type"];
type Preset = PreviewConfig["preset"];

const stepMeta: Array<{ id: StepId; number: string; label: string; hint: string }> = [
  { id: "message", number: "01", label: "Message", hint: "Content and action" },
  { id: "surface", number: "02", label: "Surface", hint: "Preset and appearance" },
  { id: "audience", number: "03", label: "Audience", hint: "Sites and routes" },
  { id: "delivery", number: "04", label: "Delivery", hint: "Timing and dismissal" },
];

const presets: Array<{ value: Preset; label: string; detail: string }> = [
  { value: "MINIMAL", label: "Minimal", detail: "Quiet and precise" },
  { value: "GLASS", label: "Glass", detail: "Soft layered depth" },
  { value: "AURORA", label: "Aurora", detail: "Ambient color wash" },
  { value: "EDITORIAL", label: "Editorial", detail: "Strong typographic voice" },
  { value: "NEON", label: "Neon", detail: "High-signal glow" },
];

const animations = ["FADE", "SLIDE", "POP", "SPRING", "FLIP"] as const;
const positions = [["TOP_CENTER", "Top center"], ["TOP_RIGHT", "Top right"], ["BOTTOM_RIGHT", "Bottom right"], ["BOTTOM_CENTER", "Bottom center"]] as const;

const presetDefaults: Record<Preset, { background: string; text: string; accent: string; border: string; radius: number; icon: PreviewConfig["icon"]; animation: PreviewConfig["animation"] }> = {
  MINIMAL: { background: "#f5f4ef", text: "#12161c", accent: "#2457d6", border: "#c7c7bd", radius: 2, icon: "INFO", animation: "FADE" },
  GLASS: { background: "#10151f", text: "#f4f4ef", accent: "#70f0c0", border: "#2e3746", radius: 18, icon: "SPARKLES", animation: "SPRING" },
  AURORA: { background: "#19213b", text: "#f5f2ff", accent: "#9a8cff", border: "#4d4a79", radius: 18, icon: "SPARKLES", animation: "FADE" },
  EDITORIAL: { background: "#f2eadf", text: "#17120e", accent: "#c86e3e", border: "#b89c82", radius: 4, icon: "BELL", animation: "SLIDE" },
  NEON: { background: "#0c1117", text: "#effff8", accent: "#70f0c0", border: "#70f0c0", radius: 8, icon: "WARNING", animation: "POP" },
};

function localDateTime(date = new Date()) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return shifted.toISOString().slice(0, 16);
}

function typeLabel(type: ComposerType) {
  return type === "ALERT_DIALOG" ? "Alert dialog" : type === "TOAST" ? "Toast" : "Inline alert";
}

function routeValidation(value: string) {
  const routes = value.split(/[\n,]/).map((route) => route.trim()).filter(Boolean);
  const invalid = routes.find((route) => !route.startsWith("/") || (route.includes("*") && !route.endsWith("/*")));
  return invalid ? `“${invalid}” must start with / and only support a trailing /* wildcard.` : null;
}

export function CampaignComposer({ type }: { type: ComposerType }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<StepId>("message");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteIds, setSelectedWebsiteIds] = useState<string[]>([]);
  const [title, setTitle] = useState("A thoughtful product update");
  const [description, setDescription] = useState("We redesigned the workspace to help your team move from idea to published campaign faster.");
  const [preset, setPreset] = useState<Preset>(() => { const requested = searchParams.get("preset")?.toUpperCase() as Preset | undefined; return requested && presets.some((option) => option.value === requested) ? requested : "GLASS"; });
  const defaults = presetDefaults[preset];
  const [animation, setAnimation] = useState<PreviewConfig["animation"]>(defaults.animation);
  const [position, setPosition] = useState("TOP_CENTER");
  const [backgroundColor, setBackgroundColor] = useState(defaults.background);
  const [textColor, setTextColor] = useState(defaults.text);
  const [accentColor, setAccentColor] = useState(defaults.accent);
  const [borderColor, setBorderColor] = useState(defaults.border);
  const [borderRadius, setBorderRadius] = useState(defaults.radius);
  const [icon, setIcon] = useState<PreviewConfig["icon"]>(defaults.icon);
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
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/user/websites/list", { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Unable to load sites");
      return response.json() as Promise<{ websites: Website[] }>;
    }).then(({ websites: nextWebsites }) => {
      setWebsites(nextWebsites);
      const active = nextWebsites.filter((website) => website.status === "ACTIVE" && website.isVerified);
      const requested = new Set((searchParams.get("sites") ?? "").split(",").filter(Boolean));
      const requestedActive = active.filter((website) => requested.has(website.id)).map((website) => website.id);
      setSelectedWebsiteIds(requestedActive.length ? requestedActive : active.length === 1 ? [active[0].id] : []);
    }).catch((error) => { if (!(error instanceof DOMException && error.name === "AbortError")) toast({ title: "Could not load sites", description: "Return to Sites and verify a destination before publishing.", variant: "destructive" }); });
    return () => controller.abort();
  }, [searchParams]);

  const activeSites = websites.filter((website) => website.status === "ACTIVE" && website.isVerified);
  const routeError = routeValidation(routes);
  const startsDate = new Date(startsAt);
  const endsDate = endsAt ? new Date(endsAt) : null;
  const scheduleError = scheduled && (Number.isNaN(startsDate.getTime()) || (endsDate !== null && (Number.isNaN(endsDate.getTime()) || endsDate <= startsDate))) ? "End time must be after the start time." : null;
  const ctaError = ctaEnabled && (!ctaLabel.trim() || !ctaUrl.startsWith("https://")) ? "Use an action label and an HTTPS destination." : null;
  const readiness = [title.trim().length >= 2, description.trim().length >= 2, selectedWebsiteIds.length > 0, !routeError, !scheduleError, !ctaError];
  const ready = readiness.every(Boolean);

  const preview = useMemo<PreviewConfig>(() => ({ type, preset, animation, title, description, backgroundColor, textColor, accentColor, borderColor, borderRadius, icon, ctaLabel: ctaEnabled ? ctaLabel : undefined }), [accentColor, animation, backgroundColor, borderColor, borderRadius, ctaEnabled, ctaLabel, description, icon, preset, textColor, title, type]);

  const resetPreset = (nextPreset: Preset) => {
    const next = presetDefaults[nextPreset];
    setPreset(nextPreset); setBackgroundColor(next.background); setTextColor(next.text); setAccentColor(next.accent); setBorderColor(next.border); setBorderRadius(next.radius); setIcon(next.icon); setAnimation(next.animation); setReplayKey((value) => value + 1);
  };

  const publish = () => {
    if (!ready) { toast({ title: "Campaign is not ready", description: "Complete the highlighted message, destination, and timing fields first.", variant: "destructive" }); return; }
    setIsPending(true);
    void (async () => {
      try {
        const response = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description, type, preset, animation, position, websiteIds: selectedWebsiteIds, routes: routes.split(/[\n,]/).map((route) => route.trim()).filter(Boolean), startsAt: scheduled ? startsDate.toISOString() : new Date().toISOString(), endsAt: scheduled && endsAt ? endsDate?.toISOString() ?? null : null, dismissible, durationMs: durationSeconds * 1_000, appearance: { backgroundColor, textColor, accentColor, borderColor, borderRadius, shadow: preset === "MINIMAL" ? "NONE" : preset === "NEON" ? "GLOW" : "ELEVATED", imageUrl: null, icon, cta: ctaEnabled ? { label: ctaLabel, url: ctaUrl } : null } }) });
        const result = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(result.message || "Unable to publish campaign");
        toast({ title: scheduled ? "Campaign scheduled" : "Campaign published", description: "The durable site feed has been updated." });
        router.push("/campaigns");
      } catch (error) {
        toast({ title: "Publish failed", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
      } finally { setIsPending(false); }
    })();
  };

  const stepReady = (id: StepId) => id === "message" ? title.trim().length >= 2 && description.trim().length >= 2 : id === "surface" ? true : id === "audience" ? selectedWebsiteIds.length > 0 && !routeError : !scheduleError;
  const goNext = () => { const index = stepMeta.findIndex((item) => item.id === step); if (index < stepMeta.length - 1) setStep(stepMeta[index + 1].id); };

  return (
    <WorkspaceShell context={`Compose / ${typeLabel(type)}`} hideNewCampaign>
      <main className="workspace-page workspace-page--composer">
        <header className="workspace-composer-header"><div className="workspace-composer-header__crumb"><button type="button" className="workspace-back-link" onClick={() => router.push("/campaigns")}><ArrowLeft size={15} /> Campaigns</button><span>/</span><span>{typeLabel(type)}</span></div><div className="workspace-composer-header__action"><span className={`workspace-readiness ${ready ? "is-ready" : ""}`}><i aria-hidden="true" /> {ready ? "Ready to publish" : `${readiness.filter(Boolean).length} of ${readiness.length} checks`}</span><button type="button" className="workspace-button workspace-button--primary" onClick={publish} disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin" size={15} /> : scheduled ? <Clock3 size={15} /> : <Send size={15} />}{scheduled ? "Schedule" : "Publish"}</button></div></header>
        <div className="workspace-composer-layout">
          <aside className="workspace-composer-rail" aria-label="Campaign studio steps"><span className="workspace-eyebrow">Studio / {typeLabel(type)}</span><h1>Compose with intent.</h1><p>Shape the record, confirm its destination, then publish one immutable revision.</p><ol>{stepMeta.map((item) => <li key={item.id}><button type="button" className={step === item.id ? "is-active" : ""} aria-current={step === item.id ? "step" : undefined} onClick={() => setStep(item.id)}><span>{stepReady(item.id) ? <Check size={13} /> : item.number}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span><ChevronDown size={14} /></button></li>)}</ol><div className="workspace-composer-rail__note"><Settings2 size={14} /><span>Steps can be revisited before final publish. No draft is persisted until the request succeeds.</span></div></aside>
          <section className="workspace-composer-editor" aria-label="Campaign editor">
            {step === "message" ? <section className="workspace-editor-section is-current" aria-labelledby="message-title"><EditorHeading number="01" title="Message" description="Give visitors one clear thought, then enough context to act." id="message-title" /><div className="workspace-form-stack"><Field label="Title" hint={`${title.length} / 80`}><Input value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} aria-invalid={title.trim().length < 2} /></Field><Field label="Description" hint={`${description.length} / 320`}><Textarea value={description} maxLength={320} rows={5} onChange={(event) => setDescription(event.target.value)} aria-invalid={description.trim().length < 2} /></Field><div className="workspace-form-two"><Field label="Icon"><select value={icon} onChange={(event) => setIcon(event.target.value as PreviewConfig["icon"])}>{(["BELL", "SPARKLES", "CHECK", "WARNING", "INFO"] as const).map((value) => <option key={value} value={value}>{value.toLowerCase()}</option>)}</select></Field><Field label="Visible for"><div className="workspace-inline-input"><Input type="number" min={3} max={60} value={durationSeconds} onChange={(event) => setDurationSeconds(Number(event.target.value))} /><span>seconds</span></div></Field></div><ToggleRow title="Dismissible" description="Let visitors close the campaign." checked={dismissible} onChange={setDismissible} /></div><EditorContinue onClick={goNext} label="Choose a surface" /></section> : null}
            {step === "surface" ? <section className="workspace-editor-section is-current" aria-labelledby="surface-title"><EditorHeading number="02" title="Surface" description="Start with a specimen, then tune the appearance contract." id="surface-title" /><div className="workspace-preset-grid">{presets.map((option) => <button key={option.value} type="button" className={`workspace-preset-option ${preset === option.value ? "is-selected" : ""}`} aria-pressed={preset === option.value} onClick={() => resetPreset(option.value)}><span className={`workspace-preset-specimen workspace-preset-specimen--${option.value.toLowerCase()}`} aria-hidden="true"><i /></span><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div><button type="button" className="workspace-reset-button" onClick={() => resetPreset(preset)}><Sparkles size={13} /> Reset {preset.toLowerCase()} defaults</button><div className="workspace-form-color-grid"><ColorField label="Surface" value={backgroundColor} onChange={setBackgroundColor} /><ColorField label="Text" value={textColor} onChange={setTextColor} /><ColorField label="Accent" value={accentColor} onChange={setAccentColor} /><ColorField label="Border" value={borderColor} onChange={setBorderColor} /></div><Field label="Animation"><div className="workspace-choice-row">{animations.map((value) => <button key={value} type="button" className={animation === value ? "is-selected" : ""} aria-pressed={animation === value} onClick={() => { setAnimation(value); setReplayKey((key) => key + 1); }}>{value}</button>)}</div></Field><Field label="Position"><div className="workspace-choice-grid">{positions.map(([value, label]) => <button key={value} type="button" className={position === value ? "is-selected" : ""} aria-pressed={position === value} onClick={() => setPosition(value)}>{label}</button>)}</div></Field><Field label={`Corner radius · ${borderRadius}px`}><input className="workspace-range" type="range" min={0} max={32} value={borderRadius} onChange={(event) => setBorderRadius(Number(event.target.value))} /></Field><EditorContinue onClick={goNext} label="Set the audience" /></section> : null}
            {step === "audience" ? <section className="workspace-editor-section is-current" aria-labelledby="audience-title"><EditorHeading number="03" title="Audience" description="Only verified ACTIVE sites can receive a campaign. Route rules are evaluated by the installed client." id="audience-title" /><Field label="Verified active sites" hint={selectedWebsiteIds.length ? `${selectedWebsiteIds.length} selected` : "Required"}><div className="workspace-target-list">{activeSites.length ? activeSites.map((website) => { const selected = selectedWebsiteIds.includes(website.id); return <button type="button" key={website.id} className={selected ? "is-selected" : ""} aria-pressed={selected} onClick={() => setSelectedWebsiteIds((current) => selected ? current.filter((id) => id !== website.id) : [...current, website.id])}><span><Globe2 size={16} /><span><strong>{website.name}</strong><small>{website.url}</small></span></span>{selected ? <Check size={15} /> : null}</button>; }) : <div className="workspace-empty workspace-empty--small"><CircleAlert size={16} /><div><strong>No verified active sites yet.</strong><p>Add and verify a destination before publishing.</p></div><a href="/sites">Open Sites <ArrowRight size={13} /></a></div>}</div></Field><Field label="Route rules" hint="One per line or comma separated"><div className="workspace-route-input"><Route size={15} /><Textarea value={routes} onChange={(event) => setRoutes(event.target.value)} rows={4} placeholder="/*\n/pricing\n/dashboard/*" aria-invalid={Boolean(routeError)} /></div>{routeError ? <p className="workspace-field-error"><CircleAlert size={13} /> {routeError}</p> : <p className="workspace-field-help">Use <code>{"/*"}</code> for every route, or an exact path such as <code>/changelog</code>. Wildcards must end with <code>{"/*"}</code>.</p>}</Field><EditorContinue onClick={goNext} label="Set delivery timing" /></section> : null}
            {step === "delivery" ? <section className="workspace-editor-section is-current" aria-labelledby="delivery-title"><EditorHeading number="04" title="Delivery" description="Choose when this record enters the feed and whether visitors can dismiss it." id="delivery-title" /><ToggleRow title="Schedule campaign" description="Publish now or define a future delivery window." checked={scheduled} onChange={setScheduled} />{scheduled ? <div className="workspace-form-two"><Field label="Starts"><Input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} /></Field><Field label="Ends · optional"><Input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} /></Field></div> : <div className="workspace-delivery-now"><Clock3 size={16} /><div><strong>Publish immediately</strong><p>The campaign will use the current time as its feed start.</p></div></div>}{scheduleError ? <p className="workspace-field-error"><CircleAlert size={13} /> {scheduleError}</p> : null}<div className="workspace-delivery-summary"><div><span>Surface</span><strong>{typeLabel(type)} / {preset}</strong></div><div><span>Targets</span><strong>{selectedWebsiteIds.length ? `${selectedWebsiteIds.length} verified site${selectedWebsiteIds.length === 1 ? "" : "s"}` : "None selected"}</strong></div><div><span>Routes</span><strong>{routes.split(/[\n,]/).filter((route) => route.trim()).length || 0} rule{routes.split(/[\n,]/).filter((route) => route.trim()).length === 1 ? "" : "s"}</strong></div></div><div className="workspace-cta-block"><ToggleRow title="Add action" description="Optional HTTPS destination." checked={ctaEnabled} onChange={setCtaEnabled} />{ctaEnabled ? <div className="workspace-form-two"><Field label="Button label"><Input value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} /></Field><Field label="Destination"><Input type="url" value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} placeholder="https://example.com/update" /></Field></div> : null}{ctaError ? <p className="workspace-field-error"><CircleAlert size={13} /> {ctaError}</p> : null}</div><div className="workspace-final-action"><div><strong>{ready ? "Ready to publish" : "Finish the checks"}</strong><span>{ready ? "The request will create an immutable revision." : "Missing fields are called out in the editor."}</span></div><button type="button" className="workspace-button workspace-button--primary" onClick={publish} disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin" size={15} /> : <Send size={15} />}{scheduled ? "Schedule campaign" : "Publish campaign"}</button></div></section> : null}
          </section>
          <aside className="workspace-composer-preview"><div className="workspace-preview-head"><div><span className="workspace-eyebrow">Live client preview</span><h2>{typeLabel(type)}</h2></div><button type="button" onClick={() => setReplayKey((value) => value + 1)}><Play size={13} /> Replay</button></div><NotificationPreview config={preview} replayKey={replayKey} /><div className="workspace-preview-summary"><div><span>Preset</span><strong>{preset}</strong></div><div><span>Motion</span><strong>{animation}</strong></div><div><span>Position</span><strong>{position.replaceAll("_", " ")}</strong></div></div><div className="workspace-readiness-card"><div><span className={`workspace-readiness ${ready ? "is-ready" : ""}`}><i aria-hidden="true" /> {ready ? "Ready" : "Needs attention"}</span></div><ul><li className={title.trim().length >= 2 && description.trim().length >= 2 ? "is-complete" : ""}><span>{title.trim().length >= 2 && description.trim().length >= 2 ? <Check size={12} /> : "01"}</span> Message has a title and description</li><li className={selectedWebsiteIds.length > 0 ? "is-complete" : ""}><span>{selectedWebsiteIds.length > 0 ? <Check size={12} /> : "02"}</span> Verified active destination selected</li><li className={!routeError && !scheduleError && !ctaError ? "is-complete" : ""}><span>{!routeError && !scheduleError && !ctaError ? <Check size={12} /> : "03"}</span> Routes and timing are valid</li></ul></div></aside>
        </div>
      </main>
    </WorkspaceShell>
  );
}

function EditorHeading({ number, title, description, id }: { number: string; title: string; description: string; id: string }) {
  return <div className="workspace-editor-heading"><span>{number}</span><div><h2 id={id}>{title}</h2><p>{description}</p></div></div>;
}

function EditorContinue({ onClick, label }: { onClick: () => void; label: string }) {
  return <div className="workspace-editor-footer"><span>Next section can be revisited before publish.</span><button type="button" className="workspace-button workspace-button--quiet" onClick={onClick}>{label} <ArrowRight size={14} /></button></div>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="workspace-field"><span className="workspace-field__label"><span>{label}</span>{hint ? <small>{hint}</small> : null}</span>{children}</label>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><span className="workspace-color-field"><input type="color" value={value} onChange={(event) => onChange(event.target.value)} /><code>{value}</code></span></Field>;
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="workspace-toggle-row"><div><strong>{title}</strong><span>{description}</span></div><Switch checked={checked} onCheckedChange={onChange} /></div>;
}
