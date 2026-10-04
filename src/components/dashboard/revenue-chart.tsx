"use client";

import { useState, useCallback, useMemo } from "react";
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
import { SITE_CONTENT } from "@/config/site-content";

interface RevenueChartProps {
  initialData: RevenueDataPoint[];
  initialPeriod?: Period;
}

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
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[2px_2px_0px_rgba(0,0,0,0.08)] text-xs">
      <p className="font-semibold text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-[var(--color-text-primary)] font-bold text-sm tabular-nums">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[1] && (
        <p className="text-[var(--color-text-secondary)] text-[11px] mt-0.5">
          {payload[1].value} {SITE_CONTENT.revenueChart.ordersSuffix}
        </p>
      )}
    </div>
  );
}

export function RevenueChart({
  initialData,
  initialPeriod = "30d",
}: RevenueChartProps) {
  const content = SITE_CONTENT.revenueChart;
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
      // Retain existing data
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    fetchRevenue(p);
  };

  const summary = useMemo(() => {
    if (!data.length) return { avg: 0, max: 0, min: 0 };
    const revs = data.map((d) => d.revenue);
    const avg = Math.round(revs.reduce((a, b) => a + b, 0) / revs.length);
    const max = Math.max(...revs);
    const min = Math.min(...revs);
    return { avg, max, min };
  }, [data]);

  const tickInterval =
    data.length > 60
      ? Math.floor(data.length / 12) - 1
      : data.length > 20
        ? 4
        : 0;

  return (
    <section
      className="card p-4 sm:p-5 flex flex-col justify-between"
      aria-label={content.chartAriaLabel}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="h-2 w-2 bg-[var(--color-accent)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {content.title}
            </h2>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            {content.subtitle}
          </p>
        </div>

        <div
          role="group"
          aria-label={content.timeframeAriaLabel}
          className="flex items-center gap-1 border border-[var(--color-border)] p-0.5 bg-[var(--color-surface-raised)]"
        >
          {content.periods.map(({ label, value }) => {
            const isSelected = period === value;
            return (
              <button
                key={value}
                onClick={() => handlePeriodChange(value as Period)}
                className={`px-2.5 py-1 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-[1px_1px_0px_rgba(0,0,0,0.06)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
                aria-pressed={isSelected}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`w-full h-[270px] transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
      >
        <ResponsiveContainer width="100%" height={270}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 6, bottom: 0, left: -6 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a82020" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a82020" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{
                fontSize: 11,
                fill: "var(--color-text-muted)",
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border-subtle)" }}
              interval={tickInterval}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: "var(--color-text-muted)",
                fontWeight: 500,
              }}
              tickLine={false}
              axisLine={false}
              domain={[
                (dataMin: number) =>
                  Math.max(0, Math.floor((dataMin - 1500) / 1000) * 1000),
                (dataMax: number) => Math.ceil((dataMax + 1000) / 1000) * 1000,
              ]}
              tickFormatter={(v) =>
                `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              }
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#a82020"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#a82020",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-muted)] font-medium">
        <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
          <span>
            {content.dailyAvg}{" "}
            <strong className="text-[var(--color-text-primary)] font-bold">
              {formatCurrency(summary.avg)}
            </strong>
          </span>
          <span>
            {content.peak}{" "}
            <strong className="text-[var(--color-text-primary)] font-bold">
              {formatCurrency(summary.max)}
            </strong>
          </span>
          <span className="hidden sm:inline">
            {content.floor}{" "}
            <strong className="text-[var(--color-text-primary)] font-bold">
              {formatCurrency(summary.min)}
            </strong>
          </span>
        </div>
        <span className="text-[10px] text-[var(--color-accent)] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-[var(--color-accent)]" />
          {content.liveSync}
        </span>
      </div>
    </section>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className="card p-4 sm:p-5 flex flex-col justify-between animate-pulse">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-subtle)]">
        <div className="space-y-1.5">
          <div className="h-3 w-40 bg-[var(--color-surface-raised)]" />
          <div className="h-3 w-56 bg-[var(--color-surface-raised)]" />
        </div>
        <div className="h-7 w-32 bg-[var(--color-surface-raised)]" />
      </div>
      <div className="h-[270px] bg-[var(--color-surface-raised)]" />
      <div className="mt-2.5 pt-2.5 border-t border-[var(--color-border-subtle)] flex justify-between">
        <div className="h-3 w-40 bg-[var(--color-surface-raised)]" />
        <div className="h-3 w-24 bg-[var(--color-surface-raised)]" />
      </div>
    </div>
  );
}
