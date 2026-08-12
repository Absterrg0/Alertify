"use client"

import { useMemo, useState } from "react"
import { Copy, ExternalLink, Globe2, Plus, RefreshCw, Search, ShieldCheck, X } from "lucide-react"
import { WebsiteAddition } from "./Website-addition-dialog"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

export type WebsiteStatus = "PENDING" | "ACTIVE" | "DEACTIVATED"

export interface Website {
  id: string
  publicId: string
  verificationRecord?: string
  name: string
  url: string
  status: WebsiteStatus
  isVerified: boolean
}

interface VerifiedWebsiteManagerProps {
  websites: Website[]
  selectedWebsites: Website[]
  onWebsitesChange: (websites?: Website[]) => void | Promise<void>
  onSelectedWebsitesChange: (selectedWebsites: Website[]) => void
}

const statusCopy: Record<WebsiteStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "text-[#70f0c0] border-[#70f0c0]/25 bg-[#70f0c0]/[0.08]" },
  PENDING: { label: "Pending", className: "text-[#f5c86b] border-[#f5c86b]/25 bg-[#f5c86b]/[0.08]" },
  DEACTIVATED: { label: "Deactivated", className: "text-[#9097a5] border-white/[0.14] bg-white/[0.04]" },
}

const SITE_LIMIT = 6

function hostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0]
  }
}

export default function VerifiedWebsiteManager({
  websites,
  selectedWebsites,
  onWebsitesChange,
  onSelectedWebsitesChange,
}: VerifiedWebsiteManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isVerifying, setIsVerifying] = useState<string | null>(null)
  const [isDeactivating, setIsDeactivating] = useState<string | null>(null)

  const copyVerificationRecord = async (site: Website) => {
    if (!site.verificationRecord) return
    await navigator.clipboard.writeText(site.verificationRecord)
    toast({ title: "TXT value copied", description: `Add it to ${hostname(site.url)}, then verify.` })
  }

  const sortWebsites = (items: Website[]) => {
    const order: Record<WebsiteStatus, number> = { ACTIVE: 0, PENDING: 1, DEACTIVATED: 2 }
    return [...items].sort((a, b) => order[a.status] - order[b.status])
  }

  const filteredWebsites = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return websites.filter((site) => {
      if (!query) return true
      return site.name.toLowerCase().includes(query) || site.url.toLowerCase().includes(query)
    })
  }, [searchTerm, websites])

  const activeFiltered = filteredWebsites.filter((site) => site.status !== "DEACTIVATED")
  const allActiveSelected = activeFiltered.length > 0 && activeFiltered.every((site) => selectedWebsites.some((selected) => selected.id === site.id))

  const handleVerify = async (site: Website) => {
    setIsVerifying(site.id)
    try {
      const response = await fetch("/api/notify/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: site.id }) })
      if (!response.ok) {
        const result = (await response.json()) as { message?: string }
        throw new Error(result.message || "Verification failed")
      }
      const updated = websites.map((item) => item.id === site.id ? { ...item, status: "ACTIVE" as const, isVerified: true } : item)
      await onWebsitesChange(sortWebsites(updated))
      toast({ title: "Site verified", description: `${site.name} is ready for campaigns.` })
    } catch (error) {
      console.error("Error during verification:", error)
      toast({ title: "Verification failed", description: "Check the URL and try again.", variant: "destructive" })
    } finally {
      setIsVerifying(null)
    }
  }

  const handleDeactivate = async (id: string) => {
    setIsDeactivating(id)
    try {
      const response = await fetch(`/api/user/websites/update/${id}`, { method: "POST" })
      if (!response.ok) throw new Error("Deactivation failed")
      const updated = websites.map((item) => item.id === id ? { ...item, status: "DEACTIVATED" as const, isVerified: false } : item)
      onSelectedWebsitesChange(selectedWebsites.filter((site) => site.id !== id))
      await onWebsitesChange(sortWebsites(updated))
      toast({ title: "Site deactivated", description: "It will no longer receive new campaigns." })
    } catch (error) {
      console.error("Error deactivating website:", error)
      toast({ title: "Could not deactivate site", variant: "destructive" })
    } finally {
      setIsDeactivating(null)
    }
  }

  const toggleSite = (site: Website) => {
    if (site.status === "DEACTIVATED") return
    const isSelected = selectedWebsites.some((selected) => selected.id === site.id)
    onSelectedWebsitesChange(isSelected ? selectedWebsites.filter((selected) => selected.id !== site.id) : [...selectedWebsites, site])
  }

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const selected = [...selectedWebsites]
      activeFiltered.forEach((site) => {
        if (!selected.some((item) => item.id === site.id)) selected.push(site)
      })
      onSelectedWebsitesChange(selected)
    } else {
      onSelectedWebsitesChange(selectedWebsites.filter((selected) => !activeFiltered.some((site) => site.id === selected.id)))
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-white/[0.1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="relative w-full sm:max-w-[18rem]">
          <Search aria-hidden="true" size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#727b89]" />
          <input className="dashboard-input w-full pl-9 pr-3" type="search" placeholder="Search sites or domains" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} aria-label="Search sites or domains" />
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          {selectedWebsites.length > 0 ? <span className="font-mono text-[0.59rem] text-[#70f0c0]">{selectedWebsites.length} selected</span> : <span className="font-mono text-[0.59rem] text-[#727b89]">{websites.length} / {SITE_LIMIT} sites</span>}
          {websites.length < SITE_LIMIT ? <WebsiteAddition onAddition={() => onWebsitesChange()} /> : null}
        </div>
      </div>

      {filteredWebsites.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded border border-[#70f0c0]/20 bg-[#70f0c0]/[0.07] text-[#70f0c0]"><Globe2 size={19} /></div>
          <h3 className="mt-4 text-[0.85rem] font-[580] text-[#f3f3ee]">{websites.length ? "No sites match this search" : "Add your first site"}</h3>
          <p className="mx-auto mt-2 max-w-sm text-[0.7rem] leading-5 text-[#9097a5]">{websites.length ? "Try a different name or domain." : "Verify a destination before publishing your first durable campaign."}</p>
          {websites.length === 0 ? <div className="mt-5"><WebsiteAddition onAddition={() => onWebsitesChange()} /></div> : null}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[38rem] text-left">
            <thead className="border-b border-white/[0.08] bg-white/[0.02]">
              <tr className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-[#727b89]">
                <th className="w-12 px-5 py-3 font-normal"><input type="checkbox" aria-label="Select all active sites" checked={allActiveSelected} onChange={(event) => toggleAll(event.target.checked)} className="h-3.5 w-3.5 accent-[#70f0c0]" /></th>
                <th className="px-3 py-3 font-normal">Destination</th>
                <th className="px-3 py-3 font-normal">Status</th>
                <th className="px-3 py-3 font-normal">Verification</th>
                <th className="px-5 py-3 text-right font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.08]">
              {filteredWebsites.map((site) => {
                const isSelected = selectedWebsites.some((selected) => selected.id === site.id)
                const status = statusCopy[site.status]
                return (
                  <tr className={`transition-colors hover:bg-white/[0.025] ${site.status === "DEACTIVATED" ? "opacity-60" : ""} ${isSelected ? "bg-[#70f0c0]/[0.04]" : ""}`} key={site.id}>
                    <td className="px-5 py-4 align-top"><input type="checkbox" aria-label={`Select ${site.name}`} checked={isSelected} disabled={site.status === "DEACTIVATED"} onChange={() => toggleSite(site)} className="h-3.5 w-3.5 accent-[#70f0c0] disabled:cursor-not-allowed" /></td>
                    <td className="px-3 py-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded border border-white/[0.1] bg-white/[0.03] text-[#9097a5]"><Globe2 size={13} /></span>
                        <div className="min-w-0">
                          <p className="truncate text-[0.76rem] font-[560] text-[#f3f3ee]">{site.name}</p>
                          <a className="mt-1 inline-flex max-w-[17rem] items-center gap-1 truncate font-mono text-[0.6rem] text-[#9097a5] hover:text-[#70f0c0]" href={site.url} target="_blank" rel="noopener noreferrer">{hostname(site.url)} <ExternalLink aria-hidden="true" size={10} /></a>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 align-top"><span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[0.56rem] ${status.className}`}><span className={`status-dot ${site.status === "ACTIVE" ? "status-dot--success" : site.status === "PENDING" ? "status-dot--warning" : ""}`} /> {status.label}</span></td>
                    <td className="px-3 py-4 align-top"><span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] text-[#9097a5]">{site.isVerified ? <ShieldCheck aria-hidden="true" size={13} className="text-[#70f0c0]" /> : <RefreshCw aria-hidden="true" size={12} className="text-[#f5c86b]" />} {site.isVerified ? "Verified" : "Needs check"}</span></td>
                    <td className="px-5 py-4 text-right align-top">
                      {site.status === "PENDING" ? <span className="inline-flex gap-1.5"><button type="button" className="button-quiet !min-h-8 !px-2.5 !text-[0.62rem]" disabled={!site.verificationRecord} onClick={() => void copyVerificationRecord(site)}><Copy aria-hidden="true" size={12} /> TXT</button><button type="button" className="button-quiet !min-h-8 !px-2.5 !text-[0.62rem]" disabled={isVerifying === site.id} onClick={() => void handleVerify(site)}>{isVerifying === site.id ? <RefreshCw aria-hidden="true" size={12} className="animate-spin" /> : <ShieldCheck aria-hidden="true" size={12} />} Verify</button></span> : site.status === "ACTIVE" ? <AlertDialog><AlertDialogTrigger asChild><button type="button" className="inline-flex min-h-8 items-center gap-1.5 rounded border border-[#f28b8b]/20 px-2.5 text-[0.62rem] text-[#9097a5] transition-colors hover:border-[#f28b8b]/45 hover:text-[#f28b8b]" disabled={isDeactivating === site.id}>Deactivate</button></AlertDialogTrigger><AlertDialogContent className="border-white/[0.14] bg-[#151a22] text-[#f3f3ee]"><AlertDialogHeader><AlertDialogTitle className="text-base">Deactivate {site.name}?</AlertDialogTitle><AlertDialogDescription className="text-sm leading-6 text-[#9097a5]">New campaigns will stop targeting this site. Contact support if you need to reactivate it during the rollback window.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="border-white/[0.14] bg-transparent text-[#d9ded8] hover:bg-white/[0.07]">Cancel</AlertDialogCancel><AlertDialogAction className="bg-[#f28b8b] text-[#07090d] hover:bg-[#f5aaaa]" onClick={() => void handleDeactivate(site.id)}>Deactivate</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> : <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] text-[#727b89]"><X size={12} /> inactive</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] px-5 py-3 font-mono text-[0.57rem] text-[#727b89]"><span>Active sites can receive campaigns.</span><span className="inline-flex items-center gap-1.5"><Plus aria-hidden="true" size={11} /> {Math.max(0, SITE_LIMIT - websites.length)} slots left</span></div>
    </div>
  )
}
