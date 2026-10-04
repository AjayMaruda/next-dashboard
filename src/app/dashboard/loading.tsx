import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsGridSkeleton } from "@/components/dashboard/stats-grid";
import { RevenueChartSkeleton } from "@/components/dashboard/revenue-chart";
import { TrafficChartSkeleton } from "@/components/dashboard/traffic-chart";
import { ActivityTableSkeleton } from "@/components/dashboard/activity-table";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <div className="h-6 w-20 rounded-md bg-[var(--color-surface-raised)] animate-pulse" />
        <div className="mt-1.5 h-4 w-48 rounded bg-[var(--color-surface-raised)] animate-pulse" />
      </div>
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
    </DashboardShell>
  );
}
