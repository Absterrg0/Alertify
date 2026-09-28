"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Bell, ChevronDown, MessageSquare, PanelsTopLeft, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* Shared building blocks for the authenticated app. Styles live under the
   "App" section of app/globals.css. */

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="app-page-header">
      <div className="app-page-header__text">
        {back ? (
          <Link href={back.href} className="app-back-link">
            <ArrowLeft aria-hidden="true" size={14} /> {back.label}
          </Link>
        ) : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="app-page-header__actions">{actions}</div> : null}
    </header>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  flush = false,
  titleId,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Render children edge to edge (for tables and lists). */
  flush?: boolean;
  titleId?: string;
}) {
  return (
    <section className={cn("app-card", className)} aria-labelledby={title ? titleId : undefined}>
      {title ? (
        <div className="app-card__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          {action ? <div className="app-card__action">{action}</div> : null}
        </div>
      ) : null}
      <div className={cn(flush ? "app-card__flush" : "app-card__body", bodyClassName)}>{children}</div>
    </section>
  );
}

export type BadgeTone = "neutral" | "green" | "amber" | "blue" | "red";

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`app-badge app-badge--${tone}`}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="app-stat">
      <div className="app-stat__label">
        <span>{label}</span>
        {icon}
      </div>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("app-empty", compact && "app-empty--compact")}>
      {icon ? <span className="app-empty__icon">{icon}</span> : null}
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div className="app-empty__action">{action}</div> : null}
    </div>
  );
}

export function LoadingRows({ rows = 3, label }: { rows?: number; label: string }) {
  return (
    <div className="app-skeleton" role="status" aria-label={`Loading ${label}`}>
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

export function Tabs<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string; count?: number }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="app-tabs" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? "is-active" : undefined}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined ? <span>{option.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

const campaignFormats = [
  { href: "/alert", label: "Inline alert", detail: "Sits inside the page", icon: PanelsTopLeft },
  { href: "/toast", label: "Toast", detail: "Brief corner notice", icon: Bell },
  { href: "/alert_dialog", label: "Dialog", detail: "Focused modal prompt", icon: MessageSquare },
] as const;

export function NewCampaignMenu({ block = false }: { block?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={cn("app-btn app-btn--primary", block && "app-btn--block")}>
          <Plus aria-hidden="true" size={15} />
          New campaign
          <ChevronDown aria-hidden="true" size={14} className="app-btn__chevron" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={block ? "start" : "end"} sideOffset={6} className="app-menu">
        {campaignFormats.map(({ href, label, detail, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild className="app-menu__item">
            <Link href={href}>
              <span className="app-menu__icon"><Icon aria-hidden="true" size={15} /></span>
              <span className="app-menu__text">
                <strong>{label}</strong>
                <small>{detail}</small>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
