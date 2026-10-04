"use client";

import { FileText, Download, ShieldAlert, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ActivityItem } from "@/types/dashboard";

interface CustomerActivityFeedProps {
  recentItems: ActivityItem[];
}

export function CustomerActivityFeed({ recentItems }: CustomerActivityFeedProps) {
  // Grab top 4 high-signal items
  const feedItems = recentItems.slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      {/* Real-time Event Stream */}
      <section className="card p-4 sm:p-5 flex flex-col justify-between" aria-label="Live Event Stream">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[var(--color-accent)] inline-block shadow-[1px_1px_0px_#000]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
              SECTION 04 // LIVE STREAM
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-600 px-1.5 py-0.2">
            <span className="h-1.5 w-1.5 rounded-none bg-emerald-600 animate-pulse" />
            RECEIVING
          </span>
        </div>

        <div className="space-y-3">
          {feedItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-2.5 border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-raised)] transition-all flex items-start justify-between gap-2 shadow-[1px_1px_0px_rgba(0,0,0,0.04)]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-[140px]">
                    {item.customer}
                  </p>
                  <span className="text-[10px] font-semibold text-[var(--color-text-muted)]">
                    • {idx === 0 ? "2m ago" : idx === 1 ? "18m ago" : idx === 2 ? "45m ago" : "2h ago"}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 truncate">
                  {item.type} // {item.status.toUpperCase()}
                </p>
              </div>

              <span
                className={`text-xs font-black tabular-nums shrink-0 ${
                  item.amount < 0 ? "text-[var(--color-negative)]" : "text-[var(--color-text-primary)]"
                }`}
              >
                {item.amount < 0 ? "-" : "+"}{formatCurrency(Math.abs(item.amount))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-text-muted)] flex items-center justify-between">
          <span>Continuous webhook ingest</span>
          <span className="text-[var(--color-text-primary)] font-bold">Latency: 24ms</span>
        </div>
      </section>

      {/* Quick Operational Command Actions */}
      <section className="card p-4 sm:p-5" aria-label="Executive Quick Actions">
        <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[var(--color-border)]">
          <span className="h-3 w-3 bg-[#171717] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
            SECTION 05 // COMMAND UTILITIES
          </span>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            className="w-full btn-sharp p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] hover:border-black flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)] transition-all"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Generate Monthly Statement
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          </button>

          <button
            type="button"
            className="w-full btn-sharp p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] hover:border-black flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)] transition-all"
          >
            <span className="flex items-center gap-2">
              <Download className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              Export Full Audit Log (.CSV)
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          </button>
        </div>
      </section>
    </div>
  );
}

export function CustomerActivityFeedSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 w-32 bg-[var(--color-surface-raised)] mb-4" />
      <div className="space-y-3">
        <div className="h-12 w-full bg-[var(--color-surface-raised)]" />
        <div className="h-12 w-full bg-[var(--color-surface-raised)]" />
        <div className="h-12 w-full bg-[var(--color-surface-raised)]" />
      </div>
    </div>
  );
}
