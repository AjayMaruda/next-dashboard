"use client";

import { useState } from "react";
import { FileText, Download, ArrowUpRight, Zap, RefreshCw, Server } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { ActivityItem } from "@/types/dashboard";
import { SITE_CONTENT } from "@/config/site-content";

interface CustomerActivityFeedProps {
  recentItems: ActivityItem[];
}

export function CustomerActivityFeed({ recentItems }: CustomerActivityFeedProps) {
  const content = SITE_CONTENT.activityFeed;
  const feedItems = recentItems.slice(0, 4);
  const latency = 24;
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>(content.utilities.justNow);

  const handleExportCSV = () => {
    toast.success(content.utilities.exportAuditLog.toastTitle, {
      description: content.utilities.exportAuditLog.toastDescription(recentItems.length),
    });
  };

  const handleGenerateStatement = () => {
    const totalVolume = recentItems.reduce((sum, item) => sum + item.amount, 0);
    toast.success(content.utilities.generateStatement.toastTitle, {
      description: content.utilities.generateStatement.toastDescription(formatCurrency(totalVolume)),
    });
  };

  const handleSyncGateways = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    toast.info(content.utilities.syncGateways.toastSyncingTitle, {
      description: content.utilities.syncGateways.toastSyncingDescription,
    });
    await new Promise((r) => setTimeout(r, 800));
    setIsSyncing(false);
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setSyncStatus(content.utilities.todayAt(timeStr));
    toast.success(content.utilities.syncGateways.toastSuccessTitle, {
      description: content.utilities.syncGateways.toastSuccessDescription,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full">
      <section
        className="card p-4 sm:p-5 flex flex-col justify-between h-full"
        aria-label={content.stream.title}
      >
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[var(--color-accent)]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                {content.stream.title}
              </h2>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
              <span className="h-1.5 w-1.5 bg-emerald-600 animate-pulse" />
              {content.stream.badge}
            </span>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3">
            {content.stream.subtitle}
          </p>

          <div className="space-y-2.5">
            {feedItems.map((item) => (
              <div
                key={item.id}
                className="p-2.5 border border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-border)] transition-all flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-[150px] sm:max-w-[200px]">
                      {item.customer}
                    </p>
                    <span className="text-[10px] font-semibold text-[var(--color-text-muted)] shrink-0">
                      • {item.date}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate uppercase tracking-wider font-semibold">
                    {item.type} <span className="text-[var(--color-text-muted)] font-normal">{"//"} {item.status}</span>
                  </p>
                </div>

                <span
                  className={`text-xs font-bold tabular-nums shrink-0 ${
                    item.amount < 0 ? "text-[var(--color-negative)]" : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {item.amount < 0 ? "-" : "+"}{formatCurrency(Math.abs(item.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] text-[11px] font-medium text-[var(--color-text-muted)] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-[var(--color-accent)]" />
            {content.stream.streamStatus}
          </span>
          <span className="text-[var(--color-text-primary)] font-semibold text-[10px] tabular-nums">
            {content.stream.ingestLatencyPrefix} {latency}ms
          </span>
        </div>
      </section>

      <section
        className="card p-4 sm:p-5 flex flex-col justify-between h-full"
        aria-label={content.utilities.title}
      >
        <div>
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[var(--color-text-secondary)]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                {content.utilities.title}
              </h2>
            </div>
            <span className="text-[9px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider bg-[var(--color-surface-raised)] px-2 py-0.5 border border-[var(--color-border)]">
              {content.utilities.badge}
            </span>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] font-medium mb-3">
            {content.utilities.subtitle}
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGenerateStatement}
              className="w-full btn-sharp p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)] flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)] transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                {content.utilities.generateStatement.label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full btn-sharp p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)] flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)] transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Download className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                {content.utilities.exportAuditLog.label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </button>

            <button
              type="button"
              onClick={handleSyncGateways}
              disabled={isSyncing}
              className="w-full btn-sharp p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-accent)] flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)] transition-all cursor-pointer disabled:opacity-60"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`h-3.5 w-3.5 text-[var(--color-accent)] ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? content.utilities.syncGateways.syncingLabel : content.utilities.syncGateways.label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] text-[11px] font-medium text-[var(--color-text-muted)] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Server className="h-3 w-3 text-emerald-700" />
            {content.utilities.syncedPrefix}{" "}
            <strong className="text-[var(--color-text-primary)] font-semibold">{syncStatus}</strong>
          </span>
          <span className="text-[var(--color-text-secondary)] font-semibold text-[10px]">
            {content.utilities.nodeLabel}
          </span>
        </div>
      </section>
    </div>
  );
}

export function CustomerActivityFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full animate-pulse">
      <div className="card p-4 sm:p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
            <div className="h-4 w-32 bg-[var(--color-surface-raised)]" />
            <div className="h-4 w-16 bg-[var(--color-surface-raised)]" />
          </div>
          <div className="h-3 w-48 bg-[var(--color-surface-raised)] mb-3" />
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-full bg-[var(--color-surface-raised)]" />
            ))}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex justify-between">
          <div className="h-3 w-28 bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-16 bg-[var(--color-surface-raised)]" />
        </div>
      </div>

      <div className="card p-4 sm:p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
            <div className="h-4 w-36 bg-[var(--color-surface-raised)]" />
            <div className="h-4 w-20 bg-[var(--color-surface-raised)]" />
          </div>
          <div className="h-3 w-48 bg-[var(--color-surface-raised)] mb-3" />
          <div className="space-y-2.5">
            <div className="h-10 w-full bg-[var(--color-surface-raised)]" />
            <div className="h-10 w-full bg-[var(--color-surface-raised)]" />
            <div className="h-10 w-full bg-[var(--color-surface-raised)]" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex justify-between">
          <div className="h-3 w-32 bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-20 bg-[var(--color-surface-raised)]" />
        </div>
      </div>
    </div>
  );
}
