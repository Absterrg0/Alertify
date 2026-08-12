"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DroplertMark } from "@/components/brand/DroplertMark"
import OnboardingModal from "@/components/OnboardingModal"
import VerifiedWebsiteManager from "./WebsiteList"
import NotificationPage from "./RecentAlerts"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type NotificationType = "ALERT" | "ALERT_DIALOG" | "TOAST"
type CampaignPreset = "MINIMAL" | "GLASS" | "AURORA" | "EDITORIAL" | "NEON"

export type Website = {
  id: string
  publicId: string
  verificationRecord?: string
  name: string
  url: string
  isVerified: boolean
  status: "PENDING" | "ACTIVE" | "DEACTIVATED"
}

export type Alert = {
  id: string
  title: string
  description: string
  backgroundColor: string
  type: "ALERT" | "ALERT_DIALOG" | "TOAST"
  textColor: string
  borderColor: string
  imageUrl?: string
}

type RequestLog = {
  id: string
  endpoint: string
  name?: string
  timestamp: string | Date
  success: boolean
}

const SITE_LIMIT = 6

const navItems = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard, current: true },
  { label: "Campaigns", href: "#campaigns", icon: Bell },
  { label: "Sites", href: "#sites", icon: Globe2 },
  { label: "Analytics", href: "#analytics", icon: BarChart3 },
  { label: "Settings", href: "/profile", icon: Settings },
]

const notificationOptions: Array<{
  type: NotificationType
  label: string
  description: string
  icon: typeof AlertCircle
  route: string
}> = [
  {
    type: "ALERT",
    label: "Inline alert",
    description: "A persistent strip for high-signal updates.",
    icon: AlertCircle,
    route: "/alert",
  },
  {
    type: "TOAST",
    label: "Toast",
    description: "A compact note that stays out of the way.",
    icon: Bell,
    route: "/toast",
  },
  {
    type: "ALERT_DIALOG",
    label: "Alert dialog",
    description: "A focused prompt for decisions that need attention.",
    icon: MessageSquare,
    route: "/alert_dialog",
  },
]

const presetOptions: Array<{
  value: CampaignPreset
  label: string
  detail: string
  swatch: string
}> = [
  { value: "MINIMAL", label: "Minimal", detail: "quiet / direct", swatch: "dashboard-preset-swatch--minimal" },
  { value: "GLASS", label: "Glass", detail: "soft / layered", swatch: "dashboard-preset-swatch--glass" },
  { value: "AURORA", label: "Aurora", detail: "luminous / calm", swatch: "dashboard-preset-swatch--aurora" },
  { value: "EDITORIAL", label: "Editorial", detail: "warm / considered", swatch: "dashboard-preset-swatch--editorial" },
  { value: "NEON", label: "Neon", detail: "sharp / high-signal", swatch: "dashboard-preset-swatch--neon" },
]

function formatTimestamp(timestamp: string | Date) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

function DashboardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-label="Loading">
      {Array.from({ length: lines }).map((_, index) => (
        <div className="flex animate-pulse items-center gap-3" key={index}>
          <div className="h-8 w-8 rounded bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-2/5 rounded bg-white/[0.08]" />
            <div className="h-2 w-3/5 rounded bg-white/[0.05]" />
          </div>
          <div className="h-2 w-12 rounded bg-white/[0.06]" />
        </div>
      ))}
    </div>
  )
}

function RequestLogCard({ logs, loading, error }: { logs: RequestLog[]; loading: boolean; error: boolean }) {
  return (
    <section className="surface-card surface-card--quiet overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.1] px-5 py-4">
        <div>
          <p className="eyebrow">Request history</p>
          <h2 className="mt-1 text-[0.95rem] font-[580] tracking-[-0.02em] text-[#f3f3ee]">Latest delivery events</h2>
        </div>
        <Activity aria-hidden="true" size={16} className="text-[#70f0c0]" />
      </div>
      <div className="px-5 py-3">
        {loading ? (
          <DashboardSkeleton lines={4} />
        ) : error ? (
          <div className="flex items-center gap-2 py-5 text-[0.72rem] text-[#f28b8b]"><AlertCircle size={14} /> Request history is temporarily unavailable.</div>
        ) : logs.length === 0 ? (
          <div className="py-6 text-center">
            <Radio aria-hidden="true" size={18} className="mx-auto text-[#727b89]" />
            <p className="mt-2 text-[0.75rem] font-[560] text-[#f3f3ee]">No delivery events yet</p>
            <p className="mx-auto mt-1 max-w-xs text-[0.68rem] leading-5 text-[#9097a5]">Impressions, clicks, and dismissals appear after a published campaign reaches visitors.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.08]">
            {logs.slice(0, 6).map((log) => (
              <div className="flex items-center gap-3 py-3" key={log.id}>
                <span className={`status-dot ${log.success ? "status-dot--success" : "status-dot--danger"}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[0.66rem] text-[#d9ded8]">{log.name || log.endpoint}</p>
                  <p className="mt-0.5 text-[0.62rem] text-[#727b89]">{formatTimestamp(log.timestamp)}</p>
                </div>
                <span className="font-mono text-[0.58rem] text-[#70f0c0]">recorded</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedType, setSelectedType] = useState<NotificationType>("ALERT")
  const [selectedPreset, setSelectedPreset] = useState<CampaignPreset>("GLASS")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [websites, setWebsites] = useState<Website[]>([])
  const [selectedWebsites, setSelectedWebsites] = useState<Website[]>([])
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([])
  const [isWebsitesLoading, setIsWebsitesLoading] = useState(true)
  const [isAlertsLoading, setIsAlertsLoading] = useState(true)
  const [isRequestsLoading, setIsRequestsLoading] = useState(true)
  const [websiteError, setWebsiteError] = useState(false)
  const [alertError, setAlertError] = useState(false)
  const [requestError, setRequestError] = useState(false)

  const sortWebsites = (items: Website[]) => {
    const order: Record<Website["status"], number> = { ACTIVE: 0, PENDING: 1, DEACTIVATED: 2 }
    return [...items].sort((a, b) => order[a.status] - order[b.status])
  }

  const fetchWebsites = async () => {
    setIsWebsitesLoading(true)
    setWebsiteError(false)
    try {
      const response = await fetch("/api/user/websites/list")
      if (!response.ok) throw new Error("Unable to load sites")
      const result = (await response.json()) as { websites: Website[] }
      setWebsites(sortWebsites(result.websites || []))
    } catch (error) {
      console.error("Error fetching websites:", error)
      setWebsiteError(true)
      toast({ title: "Could not load sites", description: "Try refreshing the workspace.", variant: "destructive" })
    } finally {
      setIsWebsitesLoading(false)
    }
  }

  const fetchAlerts = async () => {
    setIsAlertsLoading(true)
    setAlertError(false)
    try {
      const response = await fetch("/api/user/alerts/list")
      if (!response.ok) throw new Error("Unable to load campaigns")
      const result = (await response.json()) as { response?: Alert[] }
      setAlerts(result.response || [])
    } catch (error) {
      console.error("Error fetching alerts:", error)
      setAlertError(true)
      toast({ title: "Could not load campaigns", description: "Try refreshing the workspace.", variant: "destructive" })
    } finally {
      setIsAlertsLoading(false)
    }
  }

  const fetchRequestLogs = async () => {
    setIsRequestsLoading(true)
    setRequestError(false)
    try {
      const response = await fetch("/api/user/getApiLogs")
      if (!response.ok) throw new Error("Unable to load request history")
      const result = (await response.json()) as { logs?: RequestLog[] }
      setRequestLogs(result.logs || [])
    } catch (error) {
      console.error("Error fetching request history:", error)
      setRequestError(true)
    } finally {
      setIsRequestsLoading(false)
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- initial network hydration intentionally reuses the retry functions */
  useEffect(() => {
    void Promise.all([fetchWebsites(), fetchAlerts(), fetchRequestLogs()])
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const handleWebsitesChange = async (updated?: Website[]) => {
    if (updated) {
      setWebsites(sortWebsites(updated))
      return
    }
    await fetchWebsites()
  }

  const activeSites = useMemo(() => websites.filter((site) => site.status === "ACTIVE"), [websites])
  const recordedEvents = requestLogs.length
  const activityBuckets = useMemo(() => {
    if (requestLogs.length === 0) return []

    const orderedLogs = [...requestLogs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    const bucketCount = Math.min(8, Math.max(4, orderedLogs.length))
    const buckets = Array.from({ length: bucketCount }, () => ({ count: 0, label: "" }))

    orderedLogs.forEach((log, index) => {
      const bucket = buckets[Math.min(bucketCount - 1, Math.floor((index / orderedLogs.length) * bucketCount))]
      bucket.count += 1
      bucket.label = formatTimestamp(log.timestamp)
    })

    const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1)
    return buckets.map((bucket) => ({
      ...bucket,
      height: Math.round((bucket.count / maxCount) * 100),
    }))
  }, [requestLogs])

  const handleCustomize = () => {
    if (selectedWebsites.length === 0) {
      toast({ title: "Select at least one site", description: "Choose an active site before composing.", variant: "destructive" })
      return
    }
    if (selectedWebsites.some((website) => website.status !== "ACTIVE")) {
      toast({ title: "Verify your selected sites first", variant: "destructive" })
      return
    }
    const option = notificationOptions.find((item) => item.type === selectedType) || notificationOptions[0]
    const query = new URLSearchParams({
      sites: selectedWebsites.map((website) => website.id).join(","),
      preset: selectedPreset,
    })
    router.push(`${option.route}?${query.toString()}`)
  }

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Builder"
  const accountInitial = userName.slice(0, 1).toUpperCase()

  return (
    <div className="dashboard-surface min-h-screen overflow-x-hidden">
      <div className="flex min-h-screen">
        <aside className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 hidden shrink-0 flex-col px-3 py-5 transition-[width] duration-200 lg:flex ${sidebarCollapsed ? "w-[4.9rem]" : "w-[15rem]"}`}>
          <div className={`mb-8 flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between px-2"}`}>
            <DroplertMark compact showWordmark={!sidebarCollapsed} />
            {!sidebarCollapsed ? (
              <button type="button" className="button-icon !h-8 !w-8 !border-0 !text-[#9097a5] hover:!text-[#f3f3ee]" aria-label="Collapse sidebar" onClick={() => setSidebarCollapsed(true)}>
                <PanelLeftClose aria-hidden="true" size={15} />
              </button>
            ) : null}
          </div>
          {sidebarCollapsed ? (
            <button type="button" className="button-icon mx-auto mb-5 !h-8 !w-8 !border-0 !text-[#9097a5] hover:!text-[#f3f3ee]" aria-label="Expand sidebar" onClick={() => setSidebarCollapsed(false)}>
              <PanelLeftOpen aria-hidden="true" size={15} />
            </button>
          ) : null}
          {!sidebarCollapsed ? <p className="mb-2 px-3 font-mono text-[0.58rem] uppercase tracking-[0.13em] text-[#727b89]">Workspace</p> : null}
          <nav aria-label="Dashboard navigation" className="space-y-1">
            {navItems.map(({ label, href, icon: Icon, current }) => (
              <a className="dashboard-nav-link" aria-current={current ? "page" : undefined} href={href} key={label} title={sidebarCollapsed ? label : undefined}>
                <Icon aria-hidden="true" size={16} />
                {!sidebarCollapsed ? <span>{label}</span> : null}
              </a>
            ))}
          </nav>
          {!sidebarCollapsed ? (
            <div className="mt-auto space-y-4">
              <div className="rounded-lg border border-white/[0.1] bg-white/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <span className="status-dot status-dot--success" />
                  <span className="font-mono text-[0.58rem] text-[#c8cec9]">feed status</span>
                </div>
                <p className="mt-2 text-[0.68rem] leading-5 text-[#727b89]">HTTP delivery is ready for your active sites.</p>
              </div>
              <div className="flex items-center gap-2 border-t border-white/[0.1] pt-4">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[#9a8cff]/15 font-mono text-[0.7rem] text-[#d6d1ff]">{accountInitial}</div>
                <div className="min-w-0">
                  <p className="truncate text-[0.69rem] font-[560] text-[#f3f3ee]">{userName}</p>
                  <p className="font-mono text-[0.56rem] text-[#727b89]">Builder workspace</p>
                </div>
              </div>
            </div>
          ) : null}
        </aside>

        <div className={`min-w-0 flex-1 transition-[padding] duration-200 ${sidebarCollapsed ? "lg:pl-[4.9rem]" : "lg:pl-[15rem]"}`}>
          <header className="sticky top-0 z-30 border-b border-white/[0.1] bg-[#07090d]/90 backdrop-blur-xl">
            <div className="mx-auto flex min-h-[4.4rem] max-w-[100rem] items-center justify-between gap-4 px-5 sm:px-8">
              <div className="flex items-center gap-3">
                <button type="button" className="button-icon lg:hidden" aria-expanded={mobileNavOpen} aria-controls="mobile-dashboard-navigation" aria-label={mobileNavOpen ? "Close dashboard navigation" : "Open dashboard navigation"} onClick={() => setMobileNavOpen((open) => !open)}>
                  {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
                <div className="lg:hidden"><DroplertMark compact /></div>
                <div className="hidden items-center gap-2 lg:flex">
                  <span className="eyebrow">Control room</span>
                  <ChevronRight aria-hidden="true" size={13} className="text-[#727b89]" />
                  <span className="font-mono text-[0.62rem] text-[#9097a5]">Overview</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-2 rounded border border-white/[0.12] bg-white/[0.03] px-2 py-1.5 text-left transition-colors hover:border-white/[0.25]" aria-label="Open account menu">
                      <span className="grid h-6 w-6 place-items-center rounded bg-[#9a8cff]/15 font-mono text-[0.62rem] text-[#d6d1ff]">{accountInitial}</span>
                      <span className="hidden max-w-[8rem] truncate text-[0.68rem] text-[#d9ded8] sm:block">{userName}</span>
                      <MoreHorizontal aria-hidden="true" size={14} className="text-[#727b89]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-52 border-white/[0.14] bg-[#151a22] p-2 text-[#f3f3ee] shadow-2xl">
                    <Link className="flex items-center gap-2 rounded px-2 py-2 text-[0.72rem] text-[#c9cec9] hover:bg-white/[0.07]" href="/profile"><Settings size={14} /> Profile settings</Link>
                    <button type="button" className="mt-1 flex w-full items-center gap-2 rounded px-2 py-2 text-[0.72rem] text-[#f28b8b] hover:bg-[#f28b8b]/[0.08]" onClick={() => void signOut({ redirectTo: "/getstarted" })}><LogOut size={14} /> Sign out</button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {mobileNavOpen ? (
              <div id="mobile-dashboard-navigation" className="border-t border-white/[0.1] bg-[#0b0e14] px-5 py-3 lg:hidden">
                <nav aria-label="Mobile dashboard navigation" className="grid gap-1 sm:grid-cols-5">
                  {navItems.map(({ label, href, icon: Icon, current }) => (
                    <a key={label} href={href} aria-current={current ? "page" : undefined} onClick={() => setMobileNavOpen(false)} className="dashboard-nav-link">
                      <Icon aria-hidden="true" size={15} /> {label}
                    </a>
                  ))}
                </nav>
              </div>
            ) : null}
          </header>

          <main id="overview" className="mx-auto w-full max-w-[100rem] px-5 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.12] pb-8 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Workspace overview / durable delivery</p>
                <h1 className="mt-3 max-w-xl text-3xl font-[560] tracking-[-0.065em] text-[#f3f3ee] sm:text-4xl">Good to see you, {userName}.</h1>
                <p className="mt-3 max-w-2xl text-[0.89rem] leading-7 text-[#9097a5]">Monitor active campaigns, verify destinations, and publish the next announcement from one calm workspace.</p>
              </div>
              <Link href="#campaigns" className="button-mint shrink-0 self-start sm:self-auto"><Plus aria-hidden="true" size={15} /> New campaign</Link>
            </div>

            <section aria-label="Workspace metrics" className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="surface-card surface-card--quiet p-4">
                <div className="flex items-center justify-between"><span className="metric-label">Active sites</span><Globe2 aria-hidden="true" size={15} className="text-[#70f0c0]" /></div>
                <p className="metric-value mt-4">{isWebsitesLoading ? "—" : activeSites.length}</p>
                <p className="mt-2 text-[0.65rem] text-[#727b89]">{websites.length} total destinations</p>
              </article>
              <article className="surface-card surface-card--quiet p-4">
                <div className="flex items-center justify-between"><span className="metric-label">Published history</span><FileText aria-hidden="true" size={15} className="text-[#9a8cff]" /></div>
                <p className="metric-value mt-4">{isAlertsLoading ? "—" : alerts.length}</p>
                <p className="mt-2 text-[0.65rem] text-[#727b89]">campaign records available</p>
              </article>
              <article className="surface-card surface-card--quiet p-4">
                <div className="flex items-center justify-between"><span className="metric-label">Recorded events</span><CheckCircle2 aria-hidden="true" size={15} className="text-[#70f0c0]" /></div>
                <p className="metric-value mt-4">{isRequestsLoading ? "—" : recordedEvents}</p>
                <p className="mt-2 text-[0.65rem] text-[#727b89]">{recordedEvents ? "impressions, clicks, and dismissals" : "waiting for first campaign event"}</p>
              </article>
              <article className="surface-card surface-card--quiet p-4">
                <div className="flex items-center justify-between"><span className="metric-label">Site capacity</span><ShieldCheck aria-hidden="true" size={15} className="text-[#f5c86b]" /></div>
                <p className="metric-value mt-4">{websites.length}<span className="text-base font-normal tracking-normal text-[#727b89]"> / {SITE_LIMIT}</span></p>
                <p className="mt-2 text-[0.65rem] text-[#727b89]">destinations in this workspace</p>
              </article>
            </section>

            <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.32fr)_minmax(20rem,0.68fr)]">
              <div className="min-w-0 space-y-8">
                <section id="campaigns" className="surface-card overflow-hidden">
                  <div className="flex flex-col justify-between gap-4 border-b border-white/[0.1] px-5 py-5 sm:flex-row sm:items-start sm:px-6">
                    <div>
                      <p className="eyebrow">Compose a campaign</p>
                      <h2 className="mt-1 text-xl font-[560] tracking-[-0.045em] text-[#f3f3ee]">Choose the surface first.</h2>
                      <p className="mt-2 max-w-xl text-[0.75rem] leading-5 text-[#9097a5]">Select an active destination, then hand off to the focused composer for content and scheduling.</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] text-[#70f0c0]"><Sparkles aria-hidden="true" size={12} /> BUILDER</span>
                  </div>
                  <div className="px-5 py-5 sm:px-6">
                    <div className="grid gap-2 md:grid-cols-3">
                      {notificationOptions.map(({ type, label, description, icon: Icon }) => {
                        const selected = selectedType === type
                        return (
                          <button key={type} type="button" aria-pressed={selected} onClick={() => setSelectedType(type)} className={`rounded border px-3 py-3 text-left transition-colors ${selected ? "border-[#70f0c0]/60 bg-[#70f0c0]/[0.09]" : "border-white/[0.12] bg-white/[0.02] hover:border-white/[0.26] hover:bg-white/[0.04]"}`}>
                            <div className="flex items-center justify-between gap-2"><Icon aria-hidden="true" size={16} className={selected ? "text-[#70f0c0]" : "text-[#9097a5]"} /><span className="font-mono text-[0.56rem] text-[#727b89]">{type === "ALERT_DIALOG" ? "DIALOG" : type}</span></div>
                            <strong className="mt-3 block text-[0.75rem] font-[580] text-[#f3f3ee]">{label}</strong>
                            <span className="mt-1 block text-[0.65rem] leading-5 text-[#9097a5]">{description}</span>
                          </button>
                        )
                      })}
                    </div>
                    <div className="mt-6 border-t border-white/[0.1] pt-5">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                          <p className="font-mono text-[0.61rem] uppercase tracking-[0.08em] text-[#9097a5]">Appearance preset</p>
                          <p className="mt-1 text-[0.68rem] leading-5 text-[#727b89]">Choose the visual system that opens in the focused composer. You can tune its palette and shape there.</p>
                        </div>
                        <span className="font-mono text-[0.57rem] uppercase tracking-[0.08em] text-[#70f0c0]">{selectedPreset.toLowerCase()} / 5 systems</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                        {presetOptions.map((option) => {
                          const selected = selectedPreset === option.value
                          return (
                            <button
                              key={option.value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => setSelectedPreset(option.value)}
                              className={`dashboard-preset-card ${selected ? "dashboard-preset-card--selected" : ""}`}
                            >
                              <span className={`dashboard-preset-swatch ${option.swatch}`} aria-hidden="true"><span /></span>
                              <span className="mt-2 block text-[0.68rem] font-[580] text-[#f3f3ee]">{option.label}</span>
                              <span className="mt-0.5 block font-mono text-[0.52rem] text-[#727b89]">{option.detail}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 border-t border-white/[0.1] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-mono text-[0.59rem] text-[#727b89]">Next: motion, routes, schedule, and optional action.</p>
                      <div className="flex items-center justify-end gap-4">
                        <button type="button" className="button-mint !min-h-10 !px-3.5 !text-[0.72rem]" onClick={handleCustomize}>Continue with {selectedPreset.toLowerCase()} <ArrowRight aria-hidden="true" size={14} /></button>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="sites">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div><p className="eyebrow">Destinations</p><h2 className="mt-1 text-xl font-[560] tracking-[-0.045em] text-[#f3f3ee]">Your sites</h2></div>
                    <span className="font-mono text-[0.59rem] text-[#727b89]">{selectedWebsites.length} selected</span>
                  </div>
                  {isWebsitesLoading ? <div className="surface-card p-5"><DashboardSkeleton lines={4} /></div> : websiteError ? <div className="surface-card p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[0.78rem] font-[560] text-[#f3f3ee]">Sites could not be loaded.</p><p className="mt-1 text-[0.68rem] text-[#9097a5]">The workspace will keep your selection once the request succeeds.</p></div><button type="button" className="button-quiet !min-h-9 !px-3 !text-[0.68rem]" onClick={() => void fetchWebsites()}>Retry</button></div></div> : <VerifiedWebsiteManager websites={websites} selectedWebsites={selectedWebsites} onWebsitesChange={handleWebsitesChange} onSelectedWebsitesChange={setSelectedWebsites} />}
                </section>

                <section id="analytics" className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="surface-card surface-card--quiet p-5">
                    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Pulse</p><h2 className="mt-1 text-[0.95rem] font-[580] text-[#f3f3ee]">Recent feed activity</h2></div><BarChart3 aria-hidden="true" size={16} className="text-[#9a8cff]" /></div>
                    {isRequestsLoading ? (
                      <div className="mt-7 flex h-32 items-end gap-2 border-b border-white/[0.1] px-1" aria-label="Loading activity">
                        {[34, 52, 42, 68, 48, 62, 38, 56].map((height, index) => <div key={index} className="h-full flex-1 animate-pulse rounded-t-sm bg-white/[0.06]" style={{ transform: `scaleY(${height / 100})`, transformOrigin: "bottom" }} />)}
                      </div>
                    ) : requestError ? (
                      <div className="mt-7 flex h-32 items-center justify-center border-y border-white/[0.1] text-center"><p className="max-w-[15rem] text-[0.68rem] leading-5 text-[#f28b8b]">Activity is temporarily unavailable. Retry the workspace request to view delivery checks.</p></div>
                    ) : activityBuckets.length === 0 ? (
                      <div className="mt-7 flex h-32 flex-col items-center justify-center border-y border-white/[0.1] text-center"><Radio aria-hidden="true" size={18} className="text-[#727b89]" /><p className="mt-2 text-[0.72rem] font-[560] text-[#f3f3ee]">No delivery events yet</p><p className="mt-1 max-w-[15rem] text-[0.63rem] leading-5 text-[#9097a5]">The pulse chart will use actual impressions, clicks, and dismissals.</p></div>
                    ) : (
                      <div className="mt-7 flex h-32 items-end gap-2 border-b border-white/[0.1] px-1">
                        {activityBuckets.map((bucket, index) => <div key={`${bucket.label}-${index}`} className="group relative flex h-full flex-1 items-end" title={`${bucket.count} event${bucket.count === 1 ? "" : "s"}`}><div className="w-full rounded-t-sm bg-[#70f0c0]" style={{ height: `${bucket.height}%` }} /><span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[0.52rem] text-[#9097a5] group-hover:block">{bucket.count} event{bucket.count === 1 ? "" : "s"}</span></div>)}
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[0.57rem] text-[#727b89]"><span className="truncate">{activityBuckets.length ? `${activityBuckets[0].label} → ${activityBuckets.at(-1)?.label}` : "waiting for first event"}</span><span className="shrink-0 text-[#70f0c0]">{activityBuckets.length ? `${requestLogs.length} events` : "—"}</span></div>
                  </div>
                  <RequestLogCard logs={requestLogs} loading={isRequestsLoading} error={requestError} />
                </section>
              </div>

              <aside className="space-y-8">
                <OnboardingModal />
                <section className="surface-card surface-card--quiet overflow-hidden">
                  <div className="flex items-start justify-between gap-4 border-b border-white/[0.1] px-5 py-4"><div><p className="eyebrow">Campaign history</p><h2 className="mt-1 text-[0.95rem] font-[580] text-[#f3f3ee]">Recent announcements</h2></div><Link href="#campaigns" aria-label="Create campaign" className="text-[#9097a5] hover:text-[#70f0c0]"><Plus size={16} /></Link></div>
                  <div className="p-3">{isAlertsLoading ? <DashboardSkeleton lines={3} /> : alertError ? <div className="flex items-center gap-2 px-2 py-5 text-[0.7rem] text-[#f28b8b]"><AlertCircle size={14} /> Campaign history is unavailable.</div> : <NotificationPage alerts={alerts} />}</div>
                </section>
              </aside>
            </div>
          </main>

          <footer className="border-t border-white/[0.1] px-5 py-7 sm:px-8">
            <div className="mx-auto flex max-w-[100rem] flex-col justify-between gap-3 font-mono text-[0.58rem] text-[#727b89] sm:flex-row"><span>Droplert / Builder workspace</span><span className="inline-flex items-center gap-1.5"><Code2 size={12} /> sdk + durable feed</span></div>
          </footer>
        </div>
      </div>
    </div>
  )
}
