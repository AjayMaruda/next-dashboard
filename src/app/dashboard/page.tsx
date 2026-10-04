import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardData } from "@/lib/api/dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ExecutiveTicker, ExecutiveTickerSkeleton } from "@/components/dashboard/executive-ticker";
import { CommandRevenueBoard, CommandRevenueBoardSkeleton } from "@/components/dashboard/command-revenue-board";
import { ConversionRadar, ConversionRadarSkeleton } from "@/components/dashboard/conversion-radar";
import { ChannelMatrix, ChannelMatrixSkeleton } from "@/components/dashboard/channel-matrix";
import { ActivityTable, ActivityTableSkeleton } from "@/components/dashboard/activity-table";
import { CustomerActivityFeed, CustomerActivityFeedSkeleton } from "@/components/dashboard/customer-activity-feed";
import { AlertCircle, RefreshCw, Download, Calendar, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Command Center — Nexus Executive",
  description: "Asymmetric operational telemetry, financial trajectory, and live ledger.",
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
          Unable to load command telemetry
        </p>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm font-medium">
          Failed to establish link with live analytics pipeline. Verify network gateway and retry.
        </p>
      </div>
      <form action="">
        <button
          type="submit"
          className="btn-sharp inline-flex items-center gap-2 bg-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white border border-[var(--color-accent-hover)] transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Reconnect Pipeline
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
    <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--color-border)]">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 bg-[var(--color-accent)] shadow-[1px_1px_0px_#000]" />
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary)] uppercase">
            OPERATIONAL COMMAND CENTER
          </h1>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)] text-[10px] font-black tracking-wider">
            v2.4 BENTO
          </span>
        </div>
        <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          High-fidelity financial performance, channel acquisition, & transactional audit ledger
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-bold text-[var(--color-text-secondary)] shadow-[1px_1px_0px_rgba(0,0,0,0.06)]">
          <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span>{formattedDate}</span>
        </div>
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
      {/* Top Banner: Executive Ticker with Target Progress */}
      <ExecutiveTicker currentRevenue={data.stats.totalRevenue.value} />

      {/* Row 1: Asymmetric Command Bento (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 items-start">
        {/* Main Stage: Integrated Command Revenue Board */}
        <div className="xl:col-span-8">
          <CommandRevenueBoard
            initialData={data.revenue}
            initialPeriod="30d"
            stats={data.stats}
          />
        </div>

        {/* Side Stack: Conversion Radar + Traffic Channels */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <ConversionRadar
            metric={data.stats.conversionRate}
            totalUsers={data.stats.totalUsers.value}
          />
          <ChannelMatrix data={data.traffic} />
        </div>
      </div>

      {/* Row 2: Intelligence & Audit Ledger (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 items-start">
        {/* Main Activity Ledger */}
        <div className="xl:col-span-8">
          <ActivityTable
            initialData={initialActivity}
            totalCount={data.activity.length}
          />
        </div>

        {/* Live Stream & Command Actions */}
        <div className="xl:col-span-4">
          <CustomerActivityFeed recentItems={data.activity} />
        </div>
      </div>
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
            <ExecutiveTickerSkeleton />
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <CommandRevenueBoardSkeleton />
              </div>
              <div className="xl:col-span-4 flex flex-col gap-5">
                <ConversionRadarSkeleton />
                <ChannelMatrixSkeleton />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="xl:col-span-8">
                <ActivityTableSkeleton />
              </div>
              <div className="xl:col-span-4">
                <CustomerActivityFeedSkeleton />
              </div>
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </DashboardShell>
  );
}
