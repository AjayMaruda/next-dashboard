import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatsGridSkeleton } from "@/components/dashboard/stats-grid";
import { RevenueChartSkeleton } from "@/components/dashboard/revenue-chart";
import { TrafficChartSkeleton } from "@/components/dashboard/traffic-chart";
import { ActivityTableSkeleton } from "@/components/dashboard/activity-table";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="mb-6 pb-4 border-b border-[var(--color-border)]">
        <div className="h-6 w-32 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] animate-pulse" />
        <div className="mt-2 h-4 w-56 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] animate-pulse" />
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
