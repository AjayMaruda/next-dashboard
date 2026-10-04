"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APP_ROUTES,
  MAIN_NAV_ITEMS,
  SYSTEM_NAV_ITEMS,
  NAVIGATION_SECTIONS,
} from "@/config/navigation";
import { SITE_CONTENT } from "@/config/site-content";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const isItemActive = (id: string) => {
    if (id === "dashboard") {
      return pathname === "/dashboard" && (!currentTab || currentTab === "dashboard");
    }
    return currentTab === id;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-60 flex-col",
          "border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)] text-white",
          "transition-transform duration-200 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 border-b border-[var(--color-sidebar-border)]">
          <Link href={APP_ROUTES.DASHBOARD} className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center bg-white text-[var(--color-accent)] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]">
              <Zap className="h-4 w-4 fill-current text-[var(--color-accent)]" />
            </div>
            <span className="font-bold tracking-tight text-white text-base">
              {SITE_CONTENT.brand.name}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-red-200 hover:text-white hover:bg-[var(--color-sidebar-hover)] transition-colors"
            aria-label={SITE_CONTENT.topNav.menuCloseAriaLabel}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4 gap-1 overflow-y-auto">
          <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-red-200/70">
            {NAVIGATION_SECTIONS.MAIN_MENU}
          </p>
          {MAIN_NAV_ITEMS.map(({ id, href, icon: Icon, label }) => {
            const active = isItemActive(id);
            return (
              <Link
                key={id}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-white text-[var(--color-accent)] font-semibold shadow-[2px_2px_0px_rgba(0,0,0,0.3)] translate-x-0.5"
                    : "text-red-100/80 hover:bg-[var(--color-sidebar-hover)] hover:text-white hover:translate-x-0.5",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-[var(--color-accent)]" : "text-red-200/80",
                  )}
                />
                {label}
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t border-[var(--color-sidebar-border)] flex flex-col gap-1">
            <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-red-200/70">
              {NAVIGATION_SECTIONS.SYSTEM}
            </p>
            {SYSTEM_NAV_ITEMS.map(({ id, href, icon: Icon, label }) => {
              const active = isItemActive(id);
              return (
                <Link
                  key={id}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-white text-[var(--color-accent)] font-semibold shadow-[2px_2px_0px_rgba(0,0,0,0.3)] translate-x-0.5"
                      : "text-red-100/80 hover:bg-[var(--color-sidebar-hover)] hover:text-white hover:translate-x-0.5",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-[var(--color-accent)]" : "text-red-200/80",
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[var(--color-sidebar-border)] p-3 bg-black/10">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="h-8 w-8 bg-white text-[var(--color-accent)] flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.35)] shrink-0">
              {SITE_CONTENT.user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {SITE_CONTENT.user.name}
              </p>
              <p className="text-[11px] text-red-200/70 truncate">
                {SITE_CONTENT.user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={null}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
