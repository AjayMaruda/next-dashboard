"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { TrafficSource } from "@/types/dashboard";

interface TrafficChartProps {
  data: TrafficSource[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: TrafficSource }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-[var(--color-text-primary)]">{item.name}</p>
      <p className="text-[var(--color-text-muted)] mt-0.5">{item.value}% of total traffic</p>
    </div>
  );
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <section className="card p-5 flex flex-col" aria-label="Traffic sources chart">
      <div className="mb-5">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Traffic Sources</h2>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Distribution by acquisition channel
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Pie chart */}
        <div className="h-44 w-full sm:w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                dataKey="value"
                nameKey="source"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <ul className="flex flex-col gap-2.5 w-full" role="list" aria-label="Traffic source breakdown">
          {data.map((item) => (
            <li key={item.source} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <span className="text-xs text-[var(--color-text-secondary)] truncate">
                  {item.source}
                </span>
              </div>
              <span className="text-xs font-medium text-[var(--color-text-primary)] tabular-nums shrink-0">
                {item.value}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function TrafficChartSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="mb-5 space-y-1.5">
        <div className="h-4 w-28 rounded bg-[var(--color-surface-raised)]" />
        <div className="h-3 w-44 rounded bg-[var(--color-surface-raised)]" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-44 w-44 rounded-full bg-[var(--color-surface-raised)] shrink-0" />
        <div className="flex flex-col gap-2.5 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-24 rounded bg-[var(--color-surface-raised)]" />
              <div className="h-3 w-8 rounded bg-[var(--color-surface-raised)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
