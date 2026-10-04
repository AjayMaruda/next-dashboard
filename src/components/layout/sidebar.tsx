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
          "border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)]",
          "transition-transform duration-200 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-[var(--color-border-subtle)]">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-[var(--color-text-primary)]">
              Nexus
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col px-3 py-4 gap-0.5 overflow-y-auto">
          <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
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
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)]"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}

          <div className="mt-auto pt-4 border-t border-[var(--color-border-subtle)] flex flex-col gap-0.5">
            {BOTTOM_ITEMS.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="border-t border-[var(--color-border-subtle)] p-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              AJ
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--color-text-primary)] truncate">
                Ajay Maruda
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                admin@nexus.io
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
