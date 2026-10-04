"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShoppingCart,
  Settings,
  HelpCircle,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/customers", icon: Users, label: "Customers" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
];

const BOTTOM_ITEMS = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/help", icon: HelpCircle, label: "Help & Support" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-60 flex-col",
          "border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)] text-white",
          "transition-transform duration-200 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-[var(--color-sidebar-border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center bg-white text-[var(--color-accent)] shadow-[2px_2px_0px_rgba(0,0,0,0.35)]">
              <Zap className="h-4 w-4 fill-current text-[var(--color-accent)]" />
            </div>
            <span className="font-bold tracking-tight text-white text-base">
              NEXUS
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-red-200 hover:text-white hover:bg-[var(--color-sidebar-hover)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-3 py-4 gap-1 overflow-y-auto">
          <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-red-200/70">
            Main Menu
          </p>
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-white text-[var(--color-accent)] font-semibold shadow-[2px_2px_0px_rgba(0,0,0,0.3)] translate-x-0.5"
                    : "text-red-100/80 hover:bg-[var(--color-sidebar-hover)] hover:text-white hover:translate-x-0.5"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-[var(--color-accent)]" : "text-red-200/80")} />
                {label}
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t border-[var(--color-sidebar-border)] flex flex-col gap-1">
            <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-wider text-red-200/70">
              System
            </p>
            {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-100/80 hover:bg-[var(--color-sidebar-hover)] hover:text-white hover:translate-x-0.5 transition-all"
              >
                <Icon className="h-4 w-4 shrink-0 text-red-200/80" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="border-t border-[var(--color-sidebar-border)] p-3 bg-black/10">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="h-8 w-8 bg-white text-[var(--color-accent)] flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_rgba(0,0,0,0.35)] shrink-0">
              AJ
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                Ajay Maruda
              </p>
              <p className="text-[11px] text-red-200/70 truncate">
                admin@nexus.io
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
