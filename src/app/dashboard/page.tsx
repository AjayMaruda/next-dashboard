import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardData } from "@/lib/api/dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsGrid, StatsGridSkeleton } from "@/components/dashboard/stats-grid";
import { RevenueChart, RevenueChartSkeleton } from "@/components/dashboard/revenue-chart";
import { TrafficChart, TrafficChartSkeleton } from "@/components/dashboard/traffic-chart";
import { ActivityTable, ActivityTableSkeleton } from "@/components/dashboard/activity-table";
import { AlertCircle, RefreshCw } from "lucide-react";

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
      <div className="rounded-full bg-red-400/10 p-4">
        <AlertCircle className="h-6 w-6 text-red-400" aria-hidden />
      </div>
      <div>
        <p className="font-semibold text-[var(--color-text-primary)] mb-1">
          Unable to load dashboard data
        </p>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
          Something went wrong while loading your dashboard. Please try again.
        </p>
      </div>
      <form action="">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Retry
        </button>
      </form>
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────

function DashboardHeader() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mb-6">
      <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        Overview
      </h1>
      <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{formattedDate}</p>
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
