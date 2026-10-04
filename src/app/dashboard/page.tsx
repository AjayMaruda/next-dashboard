import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardData } from "@/lib/api/dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsGrid, StatsGridSkeleton } from "@/components/dashboard/stats-grid";
import { RevenueChart, RevenueChartSkeleton } from "@/components/dashboard/revenue-chart";
import { TrafficChart, TrafficChartSkeleton } from "@/components/dashboard/traffic-chart";
import { ActivityTable, ActivityTableSkeleton } from "@/components/dashboard/activity-table";
import { AlertCircle, RefreshCw, Download, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard — Nexus",
  description: "Monitor your key metrics, revenue, and activity.",
};

// Dynamic rendering — no caching on the dashboard page
export const dynamic = "force-dynamic";

// ─── Error UI ────────────────────────────────────────────────────────────────

function DashboardError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
      <div className="bg-red-50 border border-[var(--color-accent)] p-4 shadow-[2px_2px_0px_var(--color-accent)]">
        <AlertCircle className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
      </div>
      <div>
        <p className="font-bold text-lg text-[var(--color-text-primary)] mb-1 uppercase tracking-tight">
          Unable to load dashboard data
        </p>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm font-medium">
          Something went wrong while retrieving live operational metrics. Please retry.
        </p>
      </div>
      <form action="">
        <button
          type="submit"
          className="btn-sharp inline-flex items-center gap-2 bg-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white border border-[var(--color-accent-hover)] transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Retry Connection
        </button>
      </form>
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────

function DashboardHeader() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 bg-[var(--color-accent)] shadow-[1px_1px_0px_#000]" />
          <h1 className="text-xl font-black tracking-tight text-[var(--color-text-primary)] uppercase">
            Executive Overview
          </h1>
        </div>
        <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          Real-time performance analytics & transactional telemetry
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-bold text-[var(--color-text-secondary)] shadow-[1px_1px_0px_rgba(0,0,0,0.08)]">
          <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span>{formattedDate}</span>
        </div>
        <button
          type="button"
          className="btn-sharp inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider border border-[var(--color-accent-hover)]"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Content (async, fetches real data) ─────────────────────────────

async function DashboardContent() {
  let data;

  try {
    data = await getDashboardData("30d");
  } catch {
    return <DashboardError />;
  }

  const initialActivity = data.activity.slice(0, 8);

  return (
    <div className="flex flex-col gap-5">
      {/* KPI Stats */}
      <StatsGrid stats={data.stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart initialData={data.revenue} initialPeriod="30d" />
        </div>
        <div>
          <TrafficChart data={data.traffic} />
        </div>
      </div>

      {/* Activity table */}
      <ActivityTable
        initialData={initialActivity}
        totalCount={data.activity.length}
      />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader />
      <Suspense
        fallback={
          <div className="flex flex-col gap-5">
            <StatsGridSkeleton />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChartSkeleton />
              </div>
              <div>
                <TrafficChartSkeleton />
              </div>
            </div>
            <ActivityTableSkeleton />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </DashboardShell>
  );
}
