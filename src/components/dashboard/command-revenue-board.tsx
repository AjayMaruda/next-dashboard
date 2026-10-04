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
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, BarChart2 } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { RevenueDataPoint, Period, DashboardStats } from "@/types/dashboard";

const PERIODS: { label: string; value: Period }[] = [
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "90D", value: "90d" },
  { label: "1Y", value: "1y" },
];

type MetricKey = "revenue" | "orders" | "users";

interface CommandRevenueBoardProps {
  initialData: RevenueDataPoint[];
  initialPeriod?: Period;
  stats: DashboardStats;
}

export function CommandRevenueBoard({
  initialData,
  initialPeriod = "30d",
  stats,
}: CommandRevenueBoardProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [data, setData] = useState<RevenueDataPoint[]>(initialData);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("revenue");
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

  // Metrics configurations
  const metricTabs = [
    {
      key: "revenue" as MetricKey,
      label: "TOTAL REVENUE",
      value: formatCurrency(stats.totalRevenue.value),
      change: stats.totalRevenue.change,
      trend: stats.totalRevenue.trend,
      color: "#9b1c1c", // Cardinal Red
      stroke: "#9b1c1c",
    },
    {
      key: "orders" as MetricKey,
      label: "TOTAL ORDERS",
      value: formatNumber(stats.totalOrders.value),
      change: stats.totalOrders.change,
      trend: stats.totalOrders.trend,
      color: "#c2410c", // Terracotta
      stroke: "#c2410c",
    },
    {
      key: "users" as MetricKey,
      label: "ACTIVE USERS",
      value: formatNumber(stats.totalUsers.value),
      change: stats.totalUsers.change,
      trend: stats.totalUsers.trend,
      color: "#7f1d1d", // Deep Bordeaux
      stroke: "#7f1d1d",
    },
  ];

  const currentTab = metricTabs.find((m) => m.key === activeMetric)!;

  // Compute summary stats for the active metric in current period
  const statsSummary = useMemo(() => {
    if (!data.length) return { max: 0, min: 0, avg: 0 };
    const values = data.map((d) => d[activeMetric]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return { max, min, avg };
  }, [data, activeMetric]);

  const tickInterval = data.length > 60 ? Math.floor(data.length / 12) - 1 : data.length > 20 ? 4 : 0;

  return (
    <section className="card p-4 sm:p-5 flex flex-col justify-between" aria-label="Integrated Command Revenue Board">
      {/* Top Header & Section Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-[var(--color-accent)] inline-block shadow-[1px_1px_0px_#000]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
            SECTION 01 // FINANCIAL & VOLUME COMMAND
          </span>
        </div>

        {/* Period Selector */}
        <div
          role="group"
          aria-label="Select timeframe"
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

      {/* Interactive Command Tabs Row (replaces generic disconnected stat cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {metricTabs.map((tab) => {
          const isActive = activeMetric === tab.key;
          const isUp = tab.trend === "up";
          const isDown = tab.trend === "down";

          return (
            <button
              key={tab.key}
              onClick={() => setActiveMetric(tab.key)}
              className={`p-3 text-left transition-all border ${
                isActive
                  ? "bg-[var(--color-surface)] border-[var(--color-accent)] shadow-[3px_3px_0px_var(--color-accent)] -translate-y-0.5"
                  : "bg-[var(--color-surface-raised)]/60 border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:border-[var(--color-text-secondary)]"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                  {tab.label}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 border ${
                    isUp
                      ? "bg-emerald-50 text-emerald-800 border-emerald-600"
                      : isDown
                      ? "bg-red-50 text-[var(--color-accent)] border-[var(--color-accent)]"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {isUp && <TrendingUp className="h-2.5 w-2.5" />}
                  {isDown && <TrendingDown className="h-2.5 w-2.5" />}
                  {!isUp && !isDown && <Minus className="h-2.5 w-2.5" />}
                  {formatPercent(tab.change)}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)] tabular-nums">
                {tab.value}
              </p>
              <p className="text-[10px] font-medium text-[var(--color-text-muted)] mt-0.5">
                Click to render telemetry
              </p>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className={`h-64 transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 6, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="commandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentTab.stroke} stopOpacity={0.25} />
                <stop offset="95%" stopColor={currentTab.stroke} stopOpacity={0.0} />
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
              tickFormatter={(v) =>
                activeMetric === "revenue"
                  ? `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  : v >= 1000
                  ? `${(v / 1000).toFixed(1)}k`
                  : v
              }
              width={50}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const val = payload[0].value as number;
                return (
                  <div className="border border-[var(--color-text-primary)] bg-[var(--color-surface)] p-3 shadow-[3px_3px_0px_#0a0a0a] text-xs">
                    <p className="mb-1 font-bold text-[var(--color-text-muted)] uppercase tracking-wide text-[10px]">
                      {label}
                    </p>
                    <p className="text-[var(--color-text-primary)] font-extrabold text-sm tabular-nums">
                      {activeMetric === "revenue" ? formatCurrency(val) : formatNumber(val)}{" "}
                      <span className="text-[11px] font-bold uppercase text-[var(--color-accent)]">
                        {activeMetric}
                      </span>
                    </p>
                  </div>
                );
              }}
              cursor={{ stroke: currentTab.stroke, strokeWidth: 1.5, strokeDasharray: "2 2" }}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={currentTab.stroke}
              strokeWidth={2.5}
              fill="url(#commandGradient)"
              dot={false}
              activeDot={{ r: 5, fill: currentTab.stroke, stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Analytical Footnote Strip */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 text-[11px] font-semibold text-[var(--color-text-muted)]">
          <span>
            PEAK:{" "}
            <strong className="text-[var(--color-text-primary)] font-bold">
              {activeMetric === "revenue"
                ? formatCurrency(statsSummary.max)
                : formatNumber(statsSummary.max)}
            </strong>
          </span>
          <span>
            FLOOR:{" "}
            <strong className="text-[var(--color-text-primary)] font-bold">
              {activeMetric === "revenue"
                ? formatCurrency(statsSummary.min)
                : formatNumber(statsSummary.min)}
            </strong>
          </span>
          <span>
            MEAN:{" "}
            <strong className="text-[var(--color-text-primary)] font-bold">
              {activeMetric === "revenue"
                ? formatCurrency(statsSummary.avg)
                : formatNumber(statsSummary.avg)}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[var(--color-accent)] tracking-wider">
          <span className="h-1.5 w-1.5 bg-[var(--color-accent)]" />
          ACTIVE STREAM: {activeMetric.toUpperCase()} // LIVE SYNC
        </div>
      </div>
    </section>
  );
}

export function CommandRevenueBoardSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="h-4 w-40 bg-[var(--color-surface-raised)] mb-4" />
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="h-20 bg-[var(--color-surface-raised)] border border-[var(--color-border)]" />
        <div className="h-20 bg-[var(--color-surface-raised)] border border-[var(--color-border)]" />
        <div className="h-20 bg-[var(--color-surface-raised)] border border-[var(--color-border)]" />
      </div>
      <div className="h-64 bg-[var(--color-surface-raised)] border border-[var(--color-border)]" />
    </div>
  );
}
