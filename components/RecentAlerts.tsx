"use client"

import { Bell, Clock3, ExternalLink, MessageSquare, PanelsTopLeft } from "lucide-react"
import type { Alert } from "./Dashboard"

interface InputProps {
  alerts: Alert[]
}
const typeLabels: Record<Alert["type"], string> = {
  ALERT: "Inline alert",
  ALERT_DIALOG: "Alert dialog",
  TOAST: "Toast",
}

function typeIcon(type: Alert["type"]) {
  if (type === "ALERT_DIALOG") return MessageSquare
  if (type === "TOAST") return Bell
  return PanelsTopLeft
}

export default function NotificationPage({ alerts }: InputProps) {
  if (alerts.length === 0) {
    return (
      <div className="px-2 py-7 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded border border-[#9a8cff]/20 bg-[#9a8cff]/[0.08] text-[#9a8cff]"><Bell size={17} /></div>
        <p className="mt-3 text-[0.76rem] font-[560] text-[#f3f3ee]">No campaigns yet</p>
        <p className="mx-auto mt-1 max-w-xs text-[0.67rem] leading-5 text-[#9097a5]">Your next published announcement will appear here with its delivery style.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {alerts.slice(0, 5).map((alert) => {
        const Icon = typeIcon(alert.type)
        return (
          <article className="rounded border border-white/[0.1] bg-[#0c1016] p-3 transition-colors hover:border-white/[0.22]" key={alert.id}>
            <div className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/[0.1] bg-white/[0.04] text-[#9a8cff]"><Icon aria-hidden="true" size={13} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-[0.72rem] font-[580] text-[#f3f3ee]">{alert.title || "Untitled campaign"}</p>
                  <span className="shrink-0 font-mono text-[0.54rem] text-[#70f0c0]">published</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[0.65rem] leading-5 text-[#9097a5]">{alert.description || "No description provided."}</p>
                <div className="mt-2 flex items-center gap-3 font-mono text-[0.54rem] text-[#727b89]"><span>{typeLabels[alert.type]}</span><span className="inline-flex items-center gap-1"><Clock3 aria-hidden="true" size={10} /> feed ready</span></div>
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded border" style={{ background: alert.backgroundColor || "#151a22", borderColor: alert.borderColor || "rgba(243,243,238,.15)" }}>
              <div className="flex items-center gap-2 px-3 py-2" style={{ color: alert.textColor || "#f3f3ee" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                <span className="truncate text-[0.62rem] font-[560]">{alert.title || "Campaign preview"}</span>
                <ExternalLink aria-hidden="true" size={10} className="ml-auto opacity-60" />
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
