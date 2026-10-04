"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
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
    <div className="border border-[var(--color-text-primary)] bg-[var(--color-surface)] px-3 py-2 shadow-[3px_3px_0px_#0a0a0a] text-xs">
      <p className="font-bold text-[var(--color-text-primary)] uppercase tracking-wide text-[10px]">{item.name}</p>
      <p className="text-[var(--color-accent)] font-extrabold mt-0.5 tabular-nums">{item.value}% of traffic</p>
    </div>
  );
}

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <section className="card p-5 flex flex-col justify-between" aria-label="Traffic sources chart">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[#c2410c] inline-block shadow-[1px_1px_0px_#000]" />
          <h2 className="font-bold text-base text-[var(--color-text-primary)] uppercase tracking-tight">Traffic Acquisition</h2>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
          Channel breakdown by user sessions
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 my-auto">
        {/* Pie chart */}
        <div className="h-44 w-full sm:w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                dataKey="value"
                nameKey="source"
                stroke="#f7f4ee"
                strokeWidth={2}
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
        <ul className="flex flex-col gap-2 w-full" role="list" aria-label="Traffic source breakdown">
          {data.map((item) => (
            <li key={item.source} className="flex items-center justify-between gap-3 p-1 hover:bg-[var(--color-surface-raised)] transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 shadow-[1px_1px_0px_rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: item.color }}
                  aria-hidden
                />
                <span className="text-xs font-semibold text-[var(--color-text-secondary)] truncate">
                  {item.source}
                </span>
              </div>
              <span className="text-xs font-bold text-[var(--color-text-primary)] tabular-nums shrink-0">
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
        <div className="h-4 w-28 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
        <div className="h-3 w-44 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-40 w-40 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] shrink-0" />
        <div className="flex flex-col gap-2.5 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-24 bg-[var(--color-surface-raised)]" />
              <div className="h-3 w-8 bg-[var(--color-surface-raised)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
