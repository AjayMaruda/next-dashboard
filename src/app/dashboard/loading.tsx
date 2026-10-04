import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ExecutiveTickerSkeleton } from "@/components/dashboard/executive-ticker";
import { CommandRevenueBoardSkeleton } from "@/components/dashboard/command-revenue-board";
import { ConversionRadarSkeleton } from "@/components/dashboard/conversion-radar";
import { ChannelMatrixSkeleton } from "@/components/dashboard/channel-matrix";
import { ActivityTableSkeleton } from "@/components/dashboard/activity-table";
import { CustomerActivityFeedSkeleton } from "@/components/dashboard/customer-activity-feed";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="mb-5 pb-3 border-b border-[var(--color-border)]">
        <div className="h-7 w-64 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] animate-pulse" />
        <div className="mt-2 h-4 w-96 bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] animate-pulse" />
      </div>
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
    </DashboardShell>
  );
}
