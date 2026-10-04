import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import type { StatMetric, Trend } from "@/types/dashboard";
import { SITE_CONTENT } from "@/config/site-content";

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  metric: StatMetric;
  formatValue: (v: number) => string;
  subtext?: string;
  progress?: number;
  badgeText?: string;
}

function TrendBadge({ change, trend }: { change: number; trend: Trend }) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold border transition-colors",
        isUp && "bg-emerald-50 text-emerald-800 border-emerald-300",
        isDown && "bg-red-50 text-[var(--color-accent)] border-red-300",
        !isUp &&
          !isDown &&
          "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border-[var(--color-border)]",
      )}
    >
      {isUp && <TrendingUp className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden />}
      {isDown && <TrendingDown className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden />}
      {!isUp && !isDown && <Minus className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden />}
      <span>{formatPercent(change)}</span>
    </span>
  );
}

export function StatCard({
  label,
  icon: Icon,
  metric,
  formatValue,
  subtext = SITE_CONTENT.statsGrid.defaultSubtext,
  progress,
  badgeText = SITE_CONTENT.statsGrid.defaultBadgeText,
}: StatCardProps) {
  return (
    <article className="card p-4 sm:p-5 flex flex-col justify-between gap-3 card-hover group transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors">
          {label}
        </span>
        <div className="p-1.5 bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-colors">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-0.5">
        <p className="text-2xl sm:text-[1.7rem] font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
          {formatValue(metric.value)}
        </p>
        <TrendBadge change={metric.change} trend={metric.trend} />
      </div>

      {typeof progress === "number" && (
        <div className="w-full bg-[var(--color-surface-raised)] h-1 border border-[var(--color-border-subtle)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] font-medium text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border-subtle)]">
        <span className="truncate">{subtext}</span>
        <span className="text-[9px] uppercase font-bold text-[var(--color-accent)] tracking-wider shrink-0 ml-1">
          {badgeText}
        </span>
      </div>
    </article>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-4 sm:p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-[var(--color-surface-raised)]" />
        <div className="h-6 w-6 bg-[var(--color-surface-raised)]" />
      </div>
      <div className="h-7 w-28 bg-[var(--color-surface-raised)] mt-1" />
      <div className="h-1 w-full bg-[var(--color-surface-raised)]" />
      <div className="h-3 w-28 bg-[var(--color-surface-raised)] mt-2" />
    </div>
  );
}
