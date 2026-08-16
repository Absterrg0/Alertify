"use client"

import { useState } from "react"
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check"
import { CopySimpleIcon } from "@phosphor-icons/react/dist/ssr/CopySimple"

import { INSTALL_SNIPPET, LANDING_INTERACTIVE } from "@/components/landing/constants"
import { cn } from "@/lib/utils"

type CopyInstallProps = {
  framed?: boolean
}

export function CopyInstall({ framed = true }: CopyInstallProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = async () => {
    setError(null)
    try {
      await navigator.clipboard.writeText(INSTALL_SNIPPET)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Copy failed. Select the snippet instead.")
    }
  }

  const body = (
    <>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm font-semibold text-white/70">app/layout.tsx</p>
        <button
          type="button"
          onClick={() => void copy()}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white",
            LANDING_INTERACTIVE,
            "hover:bg-violet-500/20 hover:text-violet-300 transition-colors",
          )}
        >
          {copied ? <CheckIcon aria-hidden="true" size={16} /> : <CopySimpleIcon aria-hidden="true" size={16} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 pb-4 font-[var(--font-geist-mono),ui-monospace,monospace] text-sm leading-6 text-[#cfcfcf]">
        <code>
          <span className="text-[#8b949e]">{"import "}</span>
          <span className="text-[#f0f6fc]">{"{ Droplert } "}</span>
          <span className="text-[#8b949e]">{"from "}</span>
          <span className="text-[#8b5cf6]">{'"droplert/react"'}</span>
          {"\n"}
          <span className="text-[#8b949e]">{"import "}</span>
          <span className="text-[#8b5cf6]">{'"droplert/styles.css"'}</span>
          {"\n\n"}
          <span className="text-[#8b949e]">{"export default function "}</span>
          <span className="text-[#06b6d4]">{"AppLayout"}</span>
          <span className="text-[#f0f6fc]">{"({ children }) {"}</span>
          {"\n"}
          {"  "}
          <span className="text-[#8b949e]">{"return ("}</span>
          {"\n"}
          {"    "}
          <span className="text-[#f0f6fc]">{"<>"}</span>
          {"\n"}
          {"      "}
          <span className="text-[#f0f6fc]">{"{children}"}</span>
          {"\n"}
          {"      "}
          <span className="text-[#f0f6fc]">{"<"}</span>
          <span className="text-[#06b6d4]">{"Droplert"}</span>
          {"\n"}
          {"        "}
          <span className="text-[#7c3aed]">{"siteId"}</span>
          <span className="text-[#f0f6fc]">{"="}</span>
          <span className="text-[#8b5cf6]">{'"site_public_id"'}</span>
          {"\n"}
          {"        "}
          <span className="text-[#7c3aed]">{"apiUrl"}</span>
          <span className="text-[#f0f6fc]">{"="}</span>
          <span className="text-[#8b5cf6]">{'"https://droplert.abstergo.fyi"'}</span>
          {"\n"}
          {"      "}
          <span className="text-[#f0f6fc]">{"/>"}</span>
          {"\n"}
          {"    "}
          <span className="text-[#f0f6fc]">{"</>"}</span>
          {"\n"}
          {"  "}
          <span className="text-[#8b949e]">{")"}</span>
          {"\n"}
          <span className="text-[#f0f6fc]">{"}"}</span>
        </code>
      </pre>
      {error ? (
        <p role="alert" className="px-4 pb-4 text-sm text-[#f28b8b]">
          {error}
        </p>
      ) : null}
    </>
  )

  if (!framed) {
    return <div>{body}</div>
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-[#0d1117] p-2">
      <div className="rounded-lg bg-[#161b22]">{body}</div>
    </div>
  )
}
