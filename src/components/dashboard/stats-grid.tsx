import { DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { StatCard, StatCardSkeleton } from "./stat-card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/types/dashboard";

interface StatsGridProps {
  stats: DashboardStats;
}

const STAT_CONFIG = [
  {
    key: "totalRevenue" as const,
    label: "Total Revenue",
    icon: DollarSign,
    formatValue: formatCurrency,
  },
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: Users,
    formatValue: formatNumber,
  },
  {
    key: "totalOrders" as const,
    label: "Total Orders",
    icon: ShoppingCart,
    formatValue: formatNumber,
  },
  {
    key: "conversionRate" as const,
    label: "Conversion Rate",
    icon: TrendingUp,
    formatValue: (v: number) => `${v.toFixed(1)}%`,
  },
];

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section aria-label="Key performance indicators">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CONFIG.map(({ key, label, icon, formatValue }) => (
          <StatCard
            key={key}
            label={label}
            icon={icon}
            metric={stats[key]}
            formatValue={formatValue}
          />
        ))}
      </div>
    </section>
  );
}

export function StatsGridSkeleton() {
  return (
    <section aria-label="Loading key performance indicators">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
