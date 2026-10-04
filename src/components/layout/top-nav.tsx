"use client";

import { Bell, Search, Menu } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export function TopNav({ onMenuClick, title = "Dashboard", subtitle }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-background)]/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title (mobile only) */}
      <div className="lg:hidden flex-1">
        <h1 className="font-semibold text-sm text-[var(--color-text-primary)]">{title}</h1>
      </div>

      {/* Search bar (desktop) */}
      <div className="hidden lg:flex flex-1 items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
            aria-label="Global search"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative rounded-md p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Notifications (3 unread)"
        >
          <Bell className="h-4.5 w-4.5" />
          <span
            className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
            aria-hidden="true"
          />
        </button>

        {/* Avatar */}
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
          AJ
        </div>
      </div>
    </header>
  );
}
