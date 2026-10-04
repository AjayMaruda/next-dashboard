import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsGridSkeleton } from "@/components/dashboard/stats-grid";
import { ExecutiveTickerSkeleton } from "@/components/dashboard/executive-ticker";
import { RevenueChartSkeleton } from "@/components/dashboard/revenue-chart";
import { TrafficChartSkeleton } from "@/components/dashboard/traffic-chart";
import { ActivityTableSkeleton } from "@/components/dashboard/activity-table";
import { CustomerActivityFeedSkeleton } from "@/components/dashboard/customer-activity-feed";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--color-border)] animate-pulse">
          <div>
            <div className="h-6 w-36 bg-[var(--color-surface-raised)]" />
            <div className="mt-1 h-3 w-56 bg-[var(--color-surface-raised)]" />
          </div>
          <div className="h-7 w-40 bg-[var(--color-surface-raised)]" />
        </div>

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
      </div>
    </DashboardShell>
  );
}
