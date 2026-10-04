"use client";

import { TrendingUp, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPercent } from "@/lib/utils";
import type { StatMetric } from "@/types/dashboard";

interface ConversionRadarProps {
  metric: StatMetric;
  totalUsers: number;
}

export function ConversionRadar({ metric, totalUsers }: ConversionRadarProps) {
  const isUp = metric.trend === "up";

  const FUNNEL_STAGES = [
    { label: "Total Sessions", count: totalUsers, pct: 100 },
    { label: "Cart Additions", count: Math.round(totalUsers * 0.183), pct: 18.3 },
    { label: "Checkout Initiated", count: Math.round(totalUsers * 0.074), pct: 7.4 },
    { label: "Completed Orders", count: Math.round(totalUsers * (metric.value / 100)), pct: metric.value },
  ];

  return (
    <section className="card p-4 sm:p-5 flex flex-col justify-between" aria-label="Conversion Efficiency Radar">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#c2410c] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
            SECTION 02 // CONVERSION FUNNEL
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 border ${
            isUp
              ? "bg-emerald-50 text-emerald-800 border-emerald-600"
              : "bg-red-50 text-[var(--color-accent)] border-[var(--color-accent)]"
          }`}
        >
          <TrendingUp className="h-2.5 w-2.5" />
          {formatPercent(metric.change)}
        </span>
      </div>

      {/* Primary Conversion Figure */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-black tracking-tight text-[var(--color-text-primary)] tabular-nums">
            {metric.value.toFixed(1)}%
          </p>
          <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
            E-COMMERCE RATE
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
          Benchmark target is 3.2% // Outperforming by +0.4%
        </p>
      </div>

      {/* Funnel Dropoff Stages */}
      <div className="space-y-2.5 mb-2">
        {FUNNEL_STAGES.map((stage, idx) => (
          <div key={stage.label} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--color-text-secondary)] text-[11px]">
                {idx + 1}. {stage.label}
              </span>
              <span className="text-[var(--color-text-primary)] font-bold tabular-nums text-[11px]">
                {stage.count.toLocaleString()} ({stage.pct}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent)] transition-all duration-300"
                style={{ width: `${stage.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mini Insight Footer */}
      <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)] font-semibold mt-2">
        <span>Cart Abandonment: 59.5%</span>
        <span className="text-[var(--color-accent)] font-bold">Optimal</span>
      </div>
    </section>
  );
}

export function ConversionRadarSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 w-32 bg-[var(--color-surface-raised)] mb-4" />
      <div className="h-8 w-20 bg-[var(--color-surface-raised)] mb-4" />
      <div className="space-y-3">
        <div className="h-3 w-full bg-[var(--color-surface-raised)]" />
        <div className="h-3 w-full bg-[var(--color-surface-raised)]" />
        <div className="h-3 w-full bg-[var(--color-surface-raised)]" />
      </div>
    </div>
  );
}
