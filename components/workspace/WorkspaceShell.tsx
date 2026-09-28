"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  BellRing,
  ChevronsUpDown,
  Globe2,
  LayoutGrid,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

import { DroplertMark } from "@/components/brand/DroplertMark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const subscribeNoop = () => () => {};

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Campaigns", href: "/campaigns", icon: BellRing },
  { label: "Sites", href: "/sites", icon: Globe2 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
] as const;

const composerRoutes = ["/alert", "/toast", "/alert_dialog"];

function isActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/campaigns" && composerRoutes.includes(pathname)) return true;
  return href !== "/dashboard" && pathname.startsWith(`${href}/`);
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // The server never has the client session, so identity renders only after hydration.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const sessionUser = hydrated ? session?.user : undefined;
  const userName = sessionUser?.name || sessionUser?.email?.split("@")[0] || "Workspace member";
  const userEmail = sessionUser?.email ?? "";
  const initial = userName.slice(0, 1).toUpperCase();

  /* eslint-disable react-hooks/set-state-in-effect -- route changes close the mobile drawer. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const navLink = ({ label, href, icon: Icon }: (typeof navigation)[number] | { label: string; href: string; icon: typeof Settings }) => (
    <Link
      key={href}
      href={href}
      className="app-nav__link"
      aria-current={isActive(pathname, href) ? "page" : undefined}
    >
      <Icon aria-hidden="true" size={16} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="app">
      <aside id="app-sidebar" className={`app-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Workspace navigation">
        <div className="app-sidebar__top">
          <DroplertMark compact />
          <button type="button" className="app-icon-btn app-sidebar__close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        <nav className="app-nav" aria-label="Workspace destinations">
          <p className="app-nav__label">Workspace</p>
          {navigation.map(navLink)}
          <p className="app-nav__label">Account</p>
          {navLink({ label: "Settings", href: "/profile", icon: Settings })}
        </nav>

        <div className="app-sidebar__bottom">
          <div className="app-feed-status">
            <span className="app-feed-status__dot" aria-hidden="true" />
            Feed delivery online
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="app-account" aria-label="Open account menu">
                <span className="app-avatar" aria-hidden="true">{initial}</span>
                <span className="app-account__text">
                  <strong>{userName}</strong>
                  <small>{userEmail || "Owner workspace"}</small>
                </span>
                <ChevronsUpDown aria-hidden="true" size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" sideOffset={8} className="app-menu app-menu--account">
              <DropdownMenuLabel className="app-menu__label">{userEmail || userName}</DropdownMenuLabel>
              <DropdownMenuItem asChild className="app-menu__item">
                <Link href="/profile"><Settings aria-hidden="true" size={15} /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="app-menu__separator" />
              <DropdownMenuItem className="app-menu__item" onSelect={() => void signOut({ redirectTo: "/getstarted" })}>
                <LogOut aria-hidden="true" size={15} /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {mobileOpen ? <button type="button" className="app-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} /> : null}

      <div className="app-main">
        <header className="app-mobilebar">
          <button
            type="button"
            className="app-icon-btn"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            aria-controls="app-sidebar"
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" size={17} />
          </button>
          <DroplertMark compact />
          <span className="app-avatar" aria-hidden="true">{initial}</span>
        </header>
        {children}
      </div>
    </div>
  );
}

export { navigation as workspaceNavigation };
