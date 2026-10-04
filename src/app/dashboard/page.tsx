import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardData, getActivity } from "@/lib/api/dashboard";
import type { SortField, SortDir } from "@/types/dashboard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsGrid, StatsGridSkeleton } from "@/components/dashboard/stats-grid";
import { ExecutiveTicker, ExecutiveTickerSkeleton } from "@/components/dashboard/executive-ticker";
import { RevenueChart, RevenueChartSkeleton } from "@/components/dashboard/revenue-chart";
import { TrafficChart, TrafficChartSkeleton } from "@/components/dashboard/traffic-chart";
import { ActivityTable, ActivityTableSkeleton } from "@/components/dashboard/activity-table";
import { CustomerActivityFeed, CustomerActivityFeedSkeleton } from "@/components/dashboard/customer-activity-feed";
import { ExportButton } from "@/components/dashboard/export-button";
import { AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { SITE_CONTENT } from "@/config/site-content";

export const metadata: Metadata = {
  title: SITE_CONTENT.metadata.title,
  description: SITE_CONTENT.metadata.description,
};

export const dynamic = "force-dynamic";

function DashboardError() {
  const content = SITE_CONTENT.error;
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
      <div className="bg-red-50 border border-[var(--color-accent)] p-4 shadow-[2px_2px_0px_var(--color-accent)]">
        <AlertCircle className="h-6 w-6 text-[var(--color-accent)]" aria-hidden />
      </div>
      <div>
        <p className="font-bold text-base text-[var(--color-text-primary)] mb-1">
          {content.title}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] max-w-sm font-medium">
          {content.description}
        </p>
      </div>
      <form action="">
        <button
          type="submit"
          className="btn-sharp inline-flex items-center gap-2 bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-white border border-[var(--color-accent-hover)] transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          {content.retryButton}
        </button>
      </form>
    </div>
  );
}

function DashboardHeader() {
  const content = SITE_CONTENT.dashboardHeader;
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {content.title}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="h-1.5 w-1.5 bg-emerald-600 animate-pulse" />
            {content.liveBadge}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)] font-medium">
          {content.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-secondary)] shadow-[1px_1px_0px_rgba(0,0,0,0.04)]">
          <Calendar className="h-3.5 w-3.5 text-[var(--color-accent)]" />
          <span>{formattedDate}</span>
        </div>

        <ExportButton />
      </div>
    </div>
  );
}

interface DashboardContentProps {
  sortField: SortField;
  sortDir: SortDir;
}

async function DashboardContent({ sortField, sortDir }: DashboardContentProps) {
  let data;
  let activityResult;

  try {
    const [dashboardData, initialActivity] = await Promise.all([
      getDashboardData("30d"),
      getActivity({ page: 1, limit: 5, sortField, sortDir }),
    ]);
    data = dashboardData;
    activityResult = initialActivity;
  } catch {
    return <DashboardError />;
  }

  return (
    <div className="flex flex-col gap-5">
      <ExecutiveTicker stats={data.stats} />

      <section aria-label={SITE_CONTENT.statsGrid.sectionAriaLabel}>
        <StatsGrid stats={data.stats} />
      </section>

      <section aria-label="Financial Performance & Traffic Acquisition" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <RevenueChart initialData={data.revenue} initialPeriod="30d" />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <TrafficChart data={data.traffic} />
        </div>
      </section>

      <section aria-label="Real-Time Telemetry & Operational Utilities" className="w-full">
        <CustomerActivityFeed recentItems={data.activity} />
      </section>

      <section aria-label={SITE_CONTENT.activityTable.sectionAriaLabel} className="w-full">
        <ActivityTable
          initialData={activityResult.data}
          totalCount={activityResult.meta.total}
          initialSortField={sortField}
          initialSortDir={sortDir}
        />
      </section>
    </div>
  );
}

interface DashboardPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const sortField = (searchParams?.sortField as SortField) || "date";
  const sortDir = (searchParams?.sortDir as SortDir) || "desc";

  return (
    <DashboardShell>
      <div className="flex flex-col gap-5">
        <DashboardHeader />
        <Suspense
          fallback={
            <div className="flex flex-col gap-5">
              <ExecutiveTickerSkeleton />
              <StatsGridSkeleton />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-8 flex flex-col">
                  <RevenueChartSkeleton />
                </div>
                <div className="lg:col-span-4 flex flex-col">
                  <TrafficChartSkeleton />
                </div>
              </div>
              <CustomerActivityFeedSkeleton />
              <ActivityTableSkeleton />
            </div>
          }
        >
          <DashboardContent sortField={sortField} sortDir={sortDir} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
