"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  BellPlus,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Globe2,
  X,
} from "lucide-react";
import { useState } from "react";

import { DroplertMark } from "@/components/brand/DroplertMark";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/campaigns", icon: BellPlus },
  { label: "Sites", href: "/sites", icon: Globe2 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/profile", icon: Settings },
] as const;

type WorkspaceShellProps = {
  children: React.ReactNode;
  context?: string;
  className?: string;
  hideNewCampaign?: boolean;
};

export function WorkspaceShell({
  children,
  context,
  className = "",
  hideNewCampaign = false,
}: WorkspaceShellProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Workspace member";
  const initial = userName.slice(0, 1).toUpperCase();
  const currentItem = navigation.find((item) => pathname === item.href);
  const currentContext = context ?? currentItem?.label ?? "Workspace";

  return (
    <div className={`workspace-shell ${className}`}>
      <aside className={`workspace-sidebar ${collapsed ? "workspace-sidebar--collapsed" : ""}`} aria-label="Workspace navigation">
        <div className="workspace-sidebar__brand">
          <DroplertMark compact showWordmark={!collapsed} />
          <button
            type="button"
            className="workspace-icon-button workspace-sidebar__collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {!collapsed ? <p className="workspace-sidebar__label">Workspace / owner view</p> : null}
        <nav className="workspace-nav" aria-label="Workspace destinations">
            {navigation.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className="workspace-nav__link"
                aria-current={active ? "page" : undefined}
                title={collapsed ? label : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <Icon aria-hidden="true" size={15} />
                {!collapsed ? <span>{label}</span> : null}
              </Link>
            );
          })}
        </nav>

        {!collapsed ? (
          <div className="workspace-sidebar__footer">
            <div className="workspace-feed-status">
              <span className="workspace-status-dot workspace-status-dot--active" aria-hidden="true" />
              <div>
                <p>HTTP feed ready</p>
                <span>Verified destinations can receive published records.</span>
              </div>
            </div>
            <div className="workspace-user workspace-user--sidebar">
              <span className="workspace-avatar" aria-hidden="true">{initial}</span>
              <span className="workspace-user__text">
                <strong>{userName}</strong>
                <small>{status === "loading" ? "Loading session" : "Owner workspace"}</small>
              </span>
            </div>
          </div>
        ) : null}
      </aside>

      <div className={`workspace-main ${collapsed ? "workspace-main--collapsed" : ""}`}>
        <header className="workspace-topbar">
          <div className="workspace-topbar__left">
            <button
              type="button"
              className="workspace-icon-button workspace-mobile-menu"
              aria-expanded={mobileOpen}
              aria-controls="workspace-mobile-navigation"
              aria-label={mobileOpen ? "Close workspace navigation" : "Open workspace navigation"}
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div className="workspace-mobile-brand"><DroplertMark compact /></div>
            <div className="workspace-context">
              <span>Droplert / workspace</span>
              <ChevronRight aria-hidden="true" size={10} />
              <strong>{currentContext}</strong>
            </div>
          </div>
          <div className="workspace-topbar__right">
            {!hideNewCampaign ? (
              <Link className="workspace-button workspace-button--primary workspace-button--compact" href="/alert" aria-label="New campaign">
                <BellPlus aria-hidden="true" size={13} />
                <span>New campaign</span>
              </Link>
            ) : null}
            <details className="workspace-account-menu">
              <summary className="workspace-user workspace-user--trigger" aria-label="Open account menu">
                <span className="workspace-avatar" aria-hidden="true">{initial}</span>
                <span className="workspace-user__text"><strong>{userName}</strong><small>Account</small></span>
              </summary>
              <div className="workspace-account-popover">
                <Link href="/profile"><Settings size={13} /> Profile settings</Link>
                <button type="button" onClick={() => void signOut({ redirectTo: "/getstarted" })}><LogOut size={13} /> Sign out</button>
              </div>
            </details>
          </div>
        </header>

        {mobileOpen ? (
          <div id="workspace-mobile-navigation" className="workspace-mobile-navigation">
            <nav aria-label="Mobile workspace destinations">
              {navigation.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
                return (
                  <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)} className="workspace-nav__link">
                    <Icon aria-hidden="true" size={15} /><span className="workspace-mobile-nav-label">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}

export { navigation as workspaceNavigation };
