import Link from "next/link"
import { cn } from "@/lib/utils"

type DroplertMarkProps = {
  href?: string
  compact?: boolean
  className?: string
  showWordmark?: boolean
}

/**
 * The glyph is inline SVG so it stays crisp in the app shell, on the marketing
 * page, and in a future embedded SDK surface. Colors come from CSS tokens.
 */
export function DroplertMark({
  href = "/",
  compact = false,
  className,
  showWordmark = true,
}: DroplertMarkProps) {
  const content = (
    <span className={cn("brand-mark", compact && "brand-mark--compact", className)}>
      <span className="brand-mark__glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 2.5c3.6 4.3 6.5 7.9 6.5 11.4a6.5 6.5 0 0 1-13 0c0-3.5 2.9-7.1 6.5-11.4Z" />
          <circle cx="9.6" cy="14.2" r="1.7" />
        </svg>
      </span>
      {showWordmark ? <span className="brand-mark__wordmark">Droplert</span> : null}
    </span>
  )

  return href ? (
    <Link href={href} aria-label="Droplert home" className="brand-mark__link">
      {content}
    </Link>
  ) : (
    content
  )
}
