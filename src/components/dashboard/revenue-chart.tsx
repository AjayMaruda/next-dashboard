"use client";

import { useState, useEffect, useCallback } from "react";
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

// Custom tooltip for the chart
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
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 shadow-lg text-xs">
      <p className="mb-2 font-medium text-[var(--color-text-secondary)]">{label}</p>
      <p className="text-[var(--color-text-primary)] font-semibold">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[1] && (
        <p className="text-[var(--color-text-muted)] mt-0.5">
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

  // Ticks: show every nth label to avoid crowding
  const tickInterval = data.length > 60 ? Math.floor(data.length / 12) - 1 : data.length > 20 ? 4 : 0;

  return (
    <section className="card p-5" aria-label="Revenue over time chart">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-[var(--color-text-primary)]">Revenue</h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Total revenue over the selected period
          </p>
        </div>

        {/* Period selector */}
        <div
          role="group"
          aria-label="Select time period"
          className="flex items-center gap-1 rounded-lg border border-[var(--color-border-subtle)] p-1"
        >
          {PERIODS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => handlePeriodChange(value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                period === value
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-raised)]"
              }`}
              aria-pressed={period === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className={`h-56 transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              tickLine={false}
              axisLine={false}
              interval={tickInterval}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
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
          <div className="h-4 w-20 rounded bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-40 rounded bg-[var(--color-surface-raised)]" />
        </div>
        <div className="h-8 w-36 rounded-lg bg-[var(--color-surface-raised)]" />
      </div>
      <div className="h-56 rounded-lg bg-[var(--color-surface-raised)]" />
    </div>
  );
}
