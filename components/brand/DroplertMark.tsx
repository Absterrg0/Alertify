import Link from "next/link"
import { cn } from "@/lib/utils"

type DroplertMarkProps = {
  href?: string
  compact?: boolean
  className?: string
  showWordmark?: boolean
}

/**
 * The mark deliberately stays CSS-only so it remains crisp in the app shell,
 * on the marketing page, and in a future embedded SDK surface.
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
        <span className="brand-mark__spark" />
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
