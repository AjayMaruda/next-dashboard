import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";
import type { StatMetric, Trend } from "@/types/dashboard";

interface StatCardProps {
  label: string;
  icon: LucideIcon;
  metric: StatMetric;
  formatValue: (v: number) => string;
}

function TrendBadge({ change, trend }: { change: number; trend: Trend }) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isUp && "bg-emerald-500/10 text-emerald-400",
        isDown && "bg-red-400/10 text-red-400",
        !isUp && !isDown && "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)]"
      )}
    >
      {isUp && <TrendingUp className="h-3 w-3" aria-hidden />}
      {isDown && <TrendingDown className="h-3 w-3" aria-hidden />}
      {!isUp && !isDown && <Minus className="h-3 w-3" aria-hidden />}
      <span aria-label={`${change > 0 ? "up" : "down"} ${Math.abs(change)} percent`}>
        {formatPercent(change)}
      </span>
    </span>
  );
}

export function StatCard({ label, icon: Icon, metric, formatValue }: StatCardProps) {
  return (
    <article className="card p-5 flex flex-col gap-4 card-hover">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
        <div className="rounded-md bg-[var(--color-surface-raised)] p-1.5">
          <Icon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] tabular-nums">
          {formatValue(metric.value)}
        </p>
        <TrendBadge change={metric.change} trend={metric.trend} />
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        Compared to previous period
      </p>
    </article>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-[var(--color-surface-raised)]" />
        <div className="h-7 w-7 rounded-md bg-[var(--color-surface-raised)]" />
      </div>
      <div className="h-8 w-32 rounded bg-[var(--color-surface-raised)]" />
      <div className="h-3 w-28 rounded bg-[var(--color-surface-raised)]" />
    </div>
  );
}
