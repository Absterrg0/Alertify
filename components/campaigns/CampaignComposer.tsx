"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  Globe2,
  LoaderCircle,
  Play,
  Send,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NotificationPreview, type PreviewConfig } from "@/components/notifications/NotificationPreview";
import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { EmptyState, PageHeader } from "@/components/workspace/ui";

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

function scheduleValidationError(startsAt: string, endsAt: string, scheduled: boolean, now: number | null) {
  if (!scheduled) return null;

  const startsDate = new Date(startsAt);
  const endsDate = endsAt ? new Date(endsAt) : null;
  if (Number.isNaN(startsDate.getTime())) return "Enter a valid start time.";
  if (now !== null && startsDate.getTime() < now) return "Start time must be in the future.";
  if (endsDate !== null && Number.isNaN(endsDate.getTime())) return "Enter a valid end time.";
  if (endsDate !== null && endsDate <= startsDate) return "End time must be later than the start time.";
  return null;
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
  const [durationSeconds, setDurationSeconds] = useState("10");
  const [dismissible, setDismissible] = useState(true);
  const [routes, setRoutes] = useState("/*");
  const [scheduled, setScheduled] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState("Read the update");
  const [ctaUrl, setCtaUrl] = useState("");
  const [replayKey, setReplayKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- the wall clock is an external source that keeps scheduled validation current. */
  useEffect(() => {
    const initialTime = Date.now();
    setCurrentTime(initialTime);
    setStartsAt((value) => value || localDateTime(new Date(initialTime + 60_000)));
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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
  const parsedDurationSeconds = /^\d+$/.test(durationSeconds.trim()) ? Number(durationSeconds) : null;
  const durationError = parsedDurationSeconds === null || parsedDurationSeconds < 3 || parsedDurationSeconds > 60 ? "Duration must be a whole number from 3 to 60 seconds." : null;
  const startsDate = new Date(startsAt);
  const endsDate = endsAt ? new Date(endsAt) : null;
  const scheduleError = scheduleValidationError(startsAt, endsAt, scheduled, currentTime);
  const ctaError = ctaEnabled && (!ctaLabel.trim() || !ctaUrl.startsWith("https://")) ? "Use an action label and an HTTPS destination." : null;
  const readiness = [title.trim().length >= 2, description.trim().length >= 2, durationError === null, selectedWebsiteIds.length > 0, !routeError, !scheduleError, !ctaError];
  const ready = readiness.every(Boolean);

  const preview = useMemo<PreviewConfig>(() => ({ type, preset, animation, title, description, backgroundColor, textColor, accentColor, borderColor, borderRadius, icon, ctaLabel: ctaEnabled ? ctaLabel : undefined }), [accentColor, animation, backgroundColor, borderColor, borderRadius, ctaEnabled, ctaLabel, description, icon, preset, textColor, title, type]);

  const resetPreset = (nextPreset: Preset) => {
    const next = presetDefaults[nextPreset];
    setPreset(nextPreset); setBackgroundColor(next.background); setTextColor(next.text); setAccentColor(next.accent); setBorderColor(next.border); setBorderRadius(next.radius); setIcon(next.icon); setAnimation(next.animation); setReplayKey((value) => value + 1);
  };

  const publish = () => {
    const latestScheduleError = scheduleValidationError(startsAt, endsAt, scheduled, Date.now());
    if (!ready || latestScheduleError) { toast({ title: "Campaign is not ready", description: latestScheduleError ?? "Complete the highlighted message, destination, and timing fields first.", variant: "destructive" }); return; }
    setIsPending(true);
    void (async () => {
      try {
        const response = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description, type, preset, animation, position, websiteIds: selectedWebsiteIds, routes: routes.split(/[\n,]/).map((route) => route.trim()).filter(Boolean), startsAt: scheduled ? startsDate.toISOString() : new Date().toISOString(), endsAt: scheduled && endsAt ? endsDate?.toISOString() ?? null : null, dismissible, durationMs: (parsedDurationSeconds ?? 0) * 1_000, appearance: { backgroundColor, textColor, accentColor, borderColor, borderRadius, shadow: preset === "MINIMAL" ? "NONE" : preset === "NEON" ? "GLOW" : "ELEVATED", imageUrl: null, icon, cta: ctaEnabled ? { label: ctaLabel, url: ctaUrl } : null } }) });
        const result = (await response.json()) as { message?: string };
        if (!response.ok) throw new Error(result.message || "Unable to publish campaign");
        toast({ title: scheduled ? "Campaign scheduled" : "Campaign published", description: "The durable site feed has been updated." });
        router.push("/campaigns");
      } catch (error) {
        toast({ title: "Publish failed", description: error instanceof Error ? error.message : "Try again.", variant: "destructive" });
      } finally { setIsPending(false); }
    })();
  };

  const stepReady = (id: StepId) => id === "message" ? title.trim().length >= 2 && description.trim().length >= 2 && !durationError : id === "surface" ? true : id === "audience" ? selectedWebsiteIds.length > 0 && !routeError : !scheduleError;
  const goNext = () => { const index = stepMeta.findIndex((item) => item.id === step); if (index < stepMeta.length - 1) setStep(stepMeta[index + 1].id); };

  const stepIndex = stepMeta.findIndex((item) => item.id === step);
  const goBack = () => { if (stepIndex > 0) setStep(stepMeta[stepIndex - 1].id); };
  const routeCount = routes.split(/[\n,]/).filter((route) => route.trim()).length;
  const publishButton = (
    <button type="button" className="app-btn app-btn--primary" onClick={publish} disabled={isPending}>
      {isPending ? <LoaderCircle className="animate-spin" size={15} /> : scheduled ? <Clock3 size={15} /> : <Send size={15} />}
      {scheduled ? "Schedule" : "Publish"}
    </button>
  );

  return (
    <WorkspaceShell>
      <main className="app-page app-page--wide">
        <PageHeader
          back={{ href: "/campaigns", label: "Campaigns" }}
          title={`New ${typeLabel(type).toLowerCase()}`}
          description="Write the message, choose where it appears, then publish an immutable revision."
          actions={
            <>
              <span className={`app-readiness ${ready ? "is-ready" : ""}`}>
                <i aria-hidden="true" />
                {ready ? "Ready to publish" : `${readiness.filter(Boolean).length} of ${readiness.length} checks passed`}
              </span>
              {publishButton}
            </>
          }
        />

        <div className="app-composer">
          <section className="app-card app-composer__editor" aria-label="Campaign editor">
            <nav className="app-steps" aria-label="Campaign steps">
              <ol>
                {stepMeta.map((item, index) => (
                  <li key={item.id}>
                    <button type="button" className={step === item.id ? "is-active" : undefined} aria-current={step === item.id ? "step" : undefined} onClick={() => setStep(item.id)}>
                      <span className={`app-steps__index ${stepReady(item.id) && step !== item.id ? "is-ready" : ""}`}>
                        {stepReady(item.id) && step !== item.id ? <Check size={11} strokeWidth={3} /> : index + 1}
                      </span>
                      <span className="app-steps__text">
                        <strong>{item.label}</strong>
                        <small>{item.hint}</small>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="app-composer__body">
              {step === "message" ? (
                <>
                  <SectionIntro id="message-title" title="Message" description="One clear thought, with enough context to act on it." />
                  <Field label="Title" hint={`${title.length}/80`} htmlFor="campaign-title">
                    <Input id="campaign-title" className="app-input" value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} aria-invalid={title.trim().length < 2} />
                  </Field>
                  <Field label="Description" hint={`${description.length}/320`} htmlFor="campaign-description">
                    <Textarea id="campaign-description" className="app-input app-textarea" value={description} maxLength={320} rows={4} onChange={(event) => setDescription(event.target.value)} aria-invalid={description.trim().length < 2} />
                  </Field>
                  <div className="app-form-row">
                    <Field label="Icon" htmlFor="campaign-icon">
                      <select id="campaign-icon" className="app-select app-select--block" value={icon} onChange={(event) => setIcon(event.target.value as PreviewConfig["icon"])}>
                        {(["BELL", "SPARKLES", "CHECK", "WARNING", "INFO"] as const).map((value) => <option key={value} value={value}>{titleCase(value)}</option>)}
                      </select>
                    </Field>
                    <Field label="Visible for" htmlFor="campaign-duration" error={durationError}>
                      <div className="app-input-group">
                        <Input id="campaign-duration" className="app-input" type="number" min={3} max={60} step={1} inputMode="numeric" value={durationSeconds} onChange={(event) => setDurationSeconds(event.target.value)} aria-invalid={durationError !== null} aria-describedby={durationError ? "campaign-duration-error" : undefined} />
                        <span>seconds</span>
                      </div>
                    </Field>
                  </div>
                  <ToggleRow title="Dismissible" description="Let visitors close the campaign." checked={dismissible} onChange={setDismissible} />
                </>
              ) : null}

              {step === "surface" ? (
                <>
                  <SectionIntro id="surface-title" title="Appearance" description="Start from a preset, then fine-tune colors, motion, and placement." />
                  <div className="app-field">
                    <span className="app-label">Preset</span>
                    <div className="app-presets" role="group" aria-label="Preset">
                      {presets.map((option) => (
                        <button key={option.value} type="button" className={`app-preset ${preset === option.value ? "is-selected" : ""}`} aria-pressed={preset === option.value} onClick={() => resetPreset(option.value)}>
                          <span className={`app-preset__swatch app-preset__swatch--${option.value.toLowerCase()}`} aria-hidden="true"><i /></span>
                          <strong>{option.label}</strong>
                          <small>{option.detail}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="app-field">
                    <div className="app-field__label">
                      <span className="app-label">Colors</span>
                      <button type="button" className="app-link-btn" onClick={() => resetPreset(preset)}>Reset to preset</button>
                    </div>
                    <div className="app-colors">
                      <ColorField label="Surface" value={backgroundColor} onChange={setBackgroundColor} />
                      <ColorField label="Text" value={textColor} onChange={setTextColor} />
                      <ColorField label="Accent" value={accentColor} onChange={setAccentColor} />
                      <ColorField label="Border" value={borderColor} onChange={setBorderColor} />
                    </div>
                  </div>
                  <div className="app-field">
                    <span className="app-label">Animation</span>
                    <div className="app-segmented" role="group" aria-label="Animation">
                      {animations.map((value) => (
                        <button key={value} type="button" className={animation === value ? "is-selected" : undefined} aria-pressed={animation === value} onClick={() => { setAnimation(value); setReplayKey((key) => key + 1); }}>{titleCase(value)}</button>
                      ))}
                    </div>
                  </div>
                  <div className="app-field">
                    <span className="app-label">Position</span>
                    <div className="app-segmented" role="group" aria-label="Position">
                      {positions.map(([value, label]) => (
                        <button key={value} type="button" className={position === value ? "is-selected" : undefined} aria-pressed={position === value} onClick={() => setPosition(value)}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <Field label="Corner radius" hint={`${borderRadius}px`} htmlFor="campaign-radius">
                    <input id="campaign-radius" className="app-range" type="range" min={0} max={32} value={borderRadius} onChange={(event) => setBorderRadius(Number(event.target.value))} />
                  </Field>
                </>
              ) : null}

              {step === "audience" ? (
                <>
                  <SectionIntro id="audience-title" title="Audience" description="Choose verified sites and the routes where the campaign can appear." />
                  <div className="app-field">
                    <div className="app-field__label">
                      <span className="app-label">Sites</span>
                      <small>{selectedWebsiteIds.length ? `${selectedWebsiteIds.length} selected` : "Required"}</small>
                    </div>
                    {activeSites.length ? (
                      <div className="app-choice-list" role="group" aria-label="Verified sites">
                        {activeSites.map((website) => {
                          const selected = selectedWebsiteIds.includes(website.id);
                          return (
                            <button type="button" key={website.id} className={`app-choice ${selected ? "is-selected" : ""}`} aria-pressed={selected} onClick={() => setSelectedWebsiteIds((current) => selected ? current.filter((id) => id !== website.id) : [...current, website.id])}>
                              <span className="app-choice__check" aria-hidden="true">{selected ? <Check size={12} strokeWidth={3} /> : null}</span>
                              <span className="app-choice__text">
                                <strong>{website.name}</strong>
                                <small>{website.url}</small>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState compact icon={<Globe2 size={18} />} title="No verified sites yet" description="Add and verify a site before publishing." action={<Link href="/sites" className="app-btn app-btn--secondary app-btn--sm">Open Sites</Link>} />
                    )}
                  </div>
                  <Field
                    label="Route rules"
                    hint="One per line"
                    htmlFor="campaign-routes"
                    error={routeError}
                    help={<>Use <code>{"/*"}</code> for every route or an exact path like <code>/changelog</code>. Wildcards must end in <code>{"/*"}</code>.</>}
                  >
                    <Textarea id="campaign-routes" className="app-input app-textarea app-mono" value={routes} onChange={(event) => setRoutes(event.target.value)} rows={4} placeholder={"/*\n/pricing\n/dashboard/*"} aria-invalid={Boolean(routeError)} />
                  </Field>
                </>
              ) : null}

              {step === "delivery" ? (
                <>
                  <SectionIntro id="delivery-title" title="Delivery" description="Decide when the campaign enters the feed, and add an optional action." />
                  <ToggleRow title="Schedule for later" description="Publish now, or set a start and optional end time." checked={scheduled} onChange={setScheduled} />
                  {scheduled ? (
                    <div className="app-form-row">
                      <Field label="Starts" htmlFor="campaign-starts"><Input id="campaign-starts" className="app-input" type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} /></Field>
                      <Field label="Ends" hint="Optional" htmlFor="campaign-ends"><Input id="campaign-ends" className="app-input" type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} /></Field>
                    </div>
                  ) : (
                    <p className="app-note"><Clock3 aria-hidden="true" size={14} /> The campaign goes live as soon as you publish.</p>
                  )}
                  {scheduleError ? <p className="app-field__error"><CircleAlert aria-hidden="true" size={13} /> {scheduleError}</p> : null}
                  <ToggleRow title="Add a call to action" description="Link to an HTTPS page from the campaign." checked={ctaEnabled} onChange={setCtaEnabled} />
                  {ctaEnabled ? (
                    <div className="app-form-row">
                      <Field label="Button label" htmlFor="campaign-cta-label"><Input id="campaign-cta-label" className="app-input" value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} /></Field>
                      <Field label="Link" htmlFor="campaign-cta-url"><Input id="campaign-cta-url" className="app-input" type="url" value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} placeholder="https://example.com/update" /></Field>
                    </div>
                  ) : null}
                  {ctaError ? <p className="app-field__error"><CircleAlert aria-hidden="true" size={13} /> {ctaError}</p> : null}
                  <dl className="app-summary">
                    <div><dt>Surface</dt><dd>{typeLabel(type)} · {titleCase(preset)}</dd></div>
                    <div><dt>Sites</dt><dd>{selectedWebsiteIds.length ? `${selectedWebsiteIds.length} verified` : "None selected"}</dd></div>
                    <div><dt>Routes</dt><dd>{routeCount} rule{routeCount === 1 ? "" : "s"}</dd></div>
                  </dl>
                </>
              ) : null}
            </div>

            <div className="app-composer__footer">
              <button type="button" className="app-btn app-btn--ghost" onClick={goBack} disabled={stepIndex === 0}><ArrowLeft size={14} /> Back</button>
              {stepIndex < stepMeta.length - 1 ? (
                <button type="button" className="app-btn app-btn--secondary" onClick={goNext}>Next: {stepMeta[stepIndex + 1].label} <ArrowRight size={14} /></button>
              ) : publishButton}
            </div>
          </section>

          <aside className="app-card app-composer__preview" aria-label="Live preview">
            <div className="app-card__header">
              <div>
                <h2>Preview</h2>
                <p>{typeLabel(type)} · {titleCase(preset)}</p>
              </div>
              <button type="button" className="app-btn app-btn--ghost app-btn--sm" onClick={() => setReplayKey((value) => value + 1)}><Play size={13} /> Replay</button>
            </div>
            <div className="app-card__body app-composer__preview-body">
              <NotificationPreview config={preview} replayKey={replayKey} />
              <dl className="app-details app-details--compact">
                <div><dt>Motion</dt><dd>{titleCase(animation)}</dd></div>
                <div><dt>Position</dt><dd>{titleCase(position.replaceAll("_", " "))}</dd></div>
                <div><dt>Duration</dt><dd>{parsedDurationSeconds ?? "—"} s{dismissible ? " · dismissible" : ""}</dd></div>
              </dl>
              <ul className="app-checks" aria-label="Publish checks">
                <li className={title.trim().length >= 2 && description.trim().length >= 2 && !durationError ? "is-complete" : undefined}><span>{title.trim().length >= 2 && description.trim().length >= 2 && !durationError ? <Check size={11} strokeWidth={3} /> : null}</span> Message is complete</li>
                <li className={selectedWebsiteIds.length > 0 ? "is-complete" : undefined}><span>{selectedWebsiteIds.length > 0 ? <Check size={11} strokeWidth={3} /> : null}</span> A verified site is selected</li>
                <li className={!routeError && !scheduleError && !ctaError ? "is-complete" : undefined}><span>{!routeError && !scheduleError && !ctaError ? <Check size={11} strokeWidth={3} /> : null}</span> Routes and timing are valid</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </WorkspaceShell>
  );
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function SectionIntro({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div className="app-section-intro">
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function Field({ label, hint, htmlFor, error, help, children }: { label: string; hint?: string; htmlFor: string; error?: string | null; help?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="app-field">
      <div className="app-field__label">
        <label className="app-label" htmlFor={htmlFor}>{label}</label>
        {hint ? <small>{hint}</small> : null}
      </div>
      {children}
      {error ? <p className="app-field__error" id={`${htmlFor}-error`}><CircleAlert aria-hidden="true" size={13} /> {error}</p> : help ? <p className="app-field__help">{help}</p> : null}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="app-color">
      <input type="color" value={value} onChange={(event) => onChange(event.target.value)} aria-label={`${label} color`} />
      <span>
        <small>{label}</small>
        <code>{value}</code>
      </span>
    </label>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="app-toggle">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}
