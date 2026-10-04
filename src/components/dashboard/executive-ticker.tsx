"use client";

import { ShieldCheck } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";
import { SITE_CONTENT } from "@/config/site-content";

interface ExecutiveTickerProps {
  stats?: DashboardStats;
  currentRevenue?: number;
  targetRevenue?: number;
}

export function ExecutiveTicker({
  stats,
  currentRevenue,
  targetRevenue = 300000,
}: ExecutiveTickerProps) {
  const content = SITE_CONTENT.executiveTicker;
  const rev = stats?.totalRevenue.value ?? currentRevenue ?? 248500;
  const percentage = Math.min(100, Math.round((rev / targetRevenue) * 1000) / 10);
  const remaining = Math.max(0, targetRevenue - rev);

  const runRate = Math.round(rev / 30);
  const totalOrders = stats?.totalOrders.value ?? 3247;
  const avgOrderVal = totalOrders > 0 ? (rev / totalOrders).toFixed(2) : "76.53";
  const revChange = stats?.totalRevenue.change ?? 12.4;
  const netRetentionVal = (100 + revChange * 0.35).toFixed(1);

  return (
    <section
      aria-label={content.sectionAriaLabel}
      className="card p-3 sm:p-4 border-l-4 border-l-[var(--color-accent)]"
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full bg-[var(--color-accent)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-[var(--color-accent)]" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-primary)]">
                {content.targetTitle}
              </span>
              <span className="px-1.5 py-0.2 bg-[var(--color-accent-subtle)] text-[var(--color-accent)] text-[10px] font-extrabold border border-[var(--color-accent)]">
                {percentage}%
              </span>
            </div>
            <span className="text-[11px] font-bold text-[var(--color-text-muted)]">
              ₹{remaining.toLocaleString()} {content.remainingSuffix}
            </span>
          </div>

          <div className="h-2.5 w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] relative overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="hidden xl:block h-9 w-[1px] bg-[var(--color-border)]" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 xl:gap-6 shrink-0">
          <div className="border-l-2 border-[var(--color-border)] pl-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {content.runRateLabel}
            </p>
            <p className="text-sm font-extrabold text-[var(--color-text-primary)] tabular-nums">
              ₹{runRate.toLocaleString()}
              <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                {content.runRateUnit}
              </span>
            </p>
          </div>

          <div className="border-l-2 border-[var(--color-border)] pl-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {content.avgOrderLabel}
            </p>
            <p className="text-sm font-extrabold text-[var(--color-text-primary)] tabular-nums">
              ₹{avgOrderVal}
            </p>
          </div>

          <div className="border-l-2 border-[var(--color-border)] pl-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {content.netRetentionLabel}
            </p>
            <p className="text-sm font-extrabold text-emerald-800 tabular-nums">
              {netRetentionVal}%
            </p>
          </div>

          <div className="border-l-2 border-[var(--color-border)] pl-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {content.healthLabel}
            </p>
            <p className="text-sm font-extrabold text-[var(--color-accent)] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> {content.healthValue}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExecutiveTickerSkeleton() {
  return (
    <div className="card p-4 mb-5 border-l-4 border-l-[var(--color-border)] animate-pulse">
      <div className="h-4 w-48 bg-[var(--color-surface-raised)] mb-2" />
      <div className="h-2.5 w-full bg-[var(--color-surface-raised)]" />
    </div>
  );
}
