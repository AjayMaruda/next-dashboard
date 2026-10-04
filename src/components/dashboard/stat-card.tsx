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
        "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold border",
        isUp && "bg-emerald-50 text-emerald-800 border-emerald-600 shadow-[1px_1px_0px_#15803d]",
        isDown && "bg-red-50 text-[var(--color-accent)] border-[var(--color-accent)] shadow-[1px_1px_0px_var(--color-accent)]",
        !isUp && !isDown && "bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border-[var(--color-border)]"
      )}
    >
      {isUp && <TrendingUp className="h-3 w-3 stroke-[2.5]" aria-hidden />}
      {isDown && <TrendingDown className="h-3 w-3 stroke-[2.5]" aria-hidden />}
      {!isUp && !isDown && <Minus className="h-3 w-3 stroke-[2.5]" aria-hidden />}
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
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{label}</p>
        <div className="p-2 bg-[var(--color-accent-subtle)] border border-[var(--color-accent)] text-[var(--color-accent)] shadow-[2px_2px_0px_rgba(155,28,28,0.2)]">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
          {formatValue(metric.value)}
        </p>
        <TrendBadge change={metric.change} trend={metric.trend} />
      </div>
      <p className="text-[11px] font-medium text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)] pt-2 mt-auto">
        Compared to previous 30 days
      </p>
    </article>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
        <div className="h-8 w-8 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
      </div>
      <div className="h-8 w-32 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
      <div className="h-3 w-28 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
    </div>
  );
}
