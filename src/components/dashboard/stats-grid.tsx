import { IndianRupee, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard, StatCardSkeleton } from "./stat-card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { DashboardStats } from "@/types/dashboard";
import { SITE_CONTENT } from "@/config/site-content";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const content = SITE_CONTENT.statsGrid;
  const revenueVal = stats.totalRevenue.value;
  const targetRevenue = 300000;
  const revProgress = Math.min(100, Math.round((revenueVal / targetRevenue) * 1000) / 10);
  const userProgress = Math.min(100, Math.round((stats.totalUsers.value / 18000) * 100));
  const orderProgress = Math.min(100, Math.round((stats.totalOrders.value / 4000) * 100));
  const convProgress = Math.min(100, Math.round((stats.conversionRate.value / 4.0) * 100));

  const statItems = [
    {
      key: "totalRevenue" as const,
      label: content.revenue.label,
      icon: IndianRupee,
      metric: stats.totalRevenue,
      formatValue: formatCurrency,
      subtext: `${revProgress}% ${content.revenue.subtextSuffix}`,
      progress: revProgress,
      badgeText: content.revenue.badge,
    },
    {
      key: "totalUsers" as const,
      label: content.users.label,
      icon: Users,
      metric: stats.totalUsers,
      formatValue: formatNumber,
      subtext: `${formatPercent(stats.totalUsers.change)} ${content.users.subtextSuffix}`,
      progress: userProgress,
      badgeText: content.users.badge,
    },
    {
      key: "totalOrders" as const,
      label: content.orders.label,
      icon: ShoppingCart,
      metric: stats.totalOrders,
      formatValue: formatNumber,
      subtext: `${formatPercent(stats.totalOrders.change)} ${content.orders.subtextSuffix}`,
      progress: orderProgress,
      badgeText: content.orders.badge,
    },
    {
      key: "conversionRate" as const,
      label: content.conversion.label,
      icon: TrendingUp,
      metric: stats.conversionRate,
      formatValue: (v: number) => `${v.toFixed(1)}%`,
      subtext:
        stats.conversionRate.value >= 3.2
          ? content.conversion.benchmarkExceeds
          : content.conversion.benchmarkUnder,
      progress: convProgress,
      badgeText: content.conversion.badge,
    },
  ];

  return (
    <section aria-label={content.sectionAriaLabel} className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <StatCard
            key={item.key}
            label={item.label}
            icon={item.icon}
            metric={item.metric}
            formatValue={item.formatValue}
            subtext={item.subtext}
            progress={item.progress}
            badgeText={item.badgeText}
          />
        ))}
      </div>
    </section>
  );
}

export function StatsGridSkeleton() {
  return (
    <section aria-label={SITE_CONTENT.statsGrid.loadingAriaLabel} className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
