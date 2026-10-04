"use client";

import { useState, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { RevenueDataPoint, Period } from "@/types/dashboard";

const PERIODS: { label: string; value: Period }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

interface RevenueChartProps {
  initialData: RevenueDataPoint[];
  initialPeriod?: Period;
}

// Custom tooltip with sharp architectural border and hard shadow
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-[var(--color-text-primary)] bg-[var(--color-surface)] p-3 shadow-[3px_3px_0px_#0a0a0a] text-xs">
      <p className="mb-1 font-bold text-[var(--color-text-secondary)] uppercase tracking-wide text-[10px]">{label}</p>
      <p className="text-[var(--color-accent)] font-extrabold text-sm tabular-nums">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[1] && (
        <p className="text-[var(--color-text-muted)] mt-1 font-medium">
          {payload[1].value} orders
        </p>
      )}
    </div>
  );
}

export function RevenueChart({ initialData, initialPeriod = "30d" }: RevenueChartProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [data, setData] = useState<RevenueDataPoint[]>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchRevenue = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/revenue?period=${p}`);
      const json = await res.json();
      setData(json.data);
    } catch {
      // Retain existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    fetchRevenue(p);
  };

  const tickInterval = data.length > 60 ? Math.floor(data.length / 12) - 1 : data.length > 20 ? 4 : 0;

  return (
    <section className="card p-5" aria-label="Revenue over time chart">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[var(--color-accent)] inline-block shadow-[1px_1px_0px_#000]" />
            <h2 className="font-bold text-base text-[var(--color-text-primary)] uppercase tracking-tight">Revenue Overview</h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
            Financial gross revenue trajectory over selected timeline
          </p>
        </div>

        {/* Period selector */}
        <div
          role="group"
          aria-label="Select time period"
          className="flex items-center gap-1.5"
        >
          {PERIODS.map(({ label, value }) => {
            const isSelected = period === value;
            return (
              <button
                key={value}
                onClick={() => handlePeriodChange(value)}
                className={`px-3 py-1 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-[var(--color-accent)] text-white border border-[var(--color-accent-hover)] shadow-[2px_2px_0px_#0a0a0a] translate-x-[-1px] translate-y-[-1px]"
                    : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-raised)] hover:text-black shadow-[1px_1px_0px_rgba(0,0,0,0.06)]"
                }`}
                aria-pressed={isSelected}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className={`h-60 transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b1c1c" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#9b1c1c" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 2"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--color-text-muted)", fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-text-muted)", fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border)" }}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-accent)", strokeWidth: 1.5, strokeDasharray: "2 2" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#9b1c1c"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#9b1c1c", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="mb-5 flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-24 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
          <div className="h-3 w-40 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
        </div>
        <div className="h-8 w-36 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
      </div>
      <div className="h-60 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)]" />
    </div>
  );
}
