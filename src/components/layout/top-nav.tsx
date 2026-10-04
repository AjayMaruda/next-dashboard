"use client";

import { Bell, Search, Menu } from "lucide-react";

interface TopNavProps {
  onMenuClick: () => void;
  title?: string;
  subtitle?: string;
}

export function TopNav({ onMenuClick, title = "Dashboard", subtitle }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.06)]"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title (mobile only) */}
      <div className="lg:hidden flex-1">
        <h1 className="font-bold text-sm text-[var(--color-text-primary)] uppercase tracking-wide">{title}</h1>
      </div>

      {/* Search bar (desktop) */}
      <div className="hidden lg:flex flex-1 items-center">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Search metrics, orders, customers..."
            className="w-full border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-8 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[2px_2px_0px_rgba(0,0,0,0.05)] focus:border-[var(--color-accent)] focus:outline-none focus:shadow-[3px_3px_0px_rgba(155,28,28,0.25)] transition-all"
            aria-label="Global search"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick action button */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-[var(--color-accent-subtle)] border border-[var(--color-accent)] text-[var(--color-accent)] shadow-[2px_2px_0px_rgba(155,28,28,0.15)]">
          <span className="h-1.5 w-1.5 bg-[var(--color-accent)]" />
          LIVE METRICS
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)] shadow-[2px_2px_0px_rgba(0,0,0,0.06)] transition-all"
          aria-label="Notifications (3 unread)"
        >
          <Bell className="h-4 w-4" />
          <span
            className="absolute -top-1 -right-1 h-2 w-2 bg-[var(--color-accent)]"
            aria-hidden="true"
          />
        </button>

        {/* Avatar */}
        <div className="h-8 w-8 bg-[var(--color-accent)] border border-[var(--color-accent-hover)] text-white flex items-center justify-center text-xs font-bold shadow-[2px_2px_0px_rgba(0,0,0,0.25)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.35)] hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer transition-all">
          AJ
        </div>
      </div>
    </header>
  );
}
