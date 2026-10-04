import type {
  DashboardData,
  RevenueDataPoint,
  ActivityItem,
  Period,
} from "@/types/dashboard";

// ─── Revenue time series ────────────────────────────────────────────────────

const generateRevenueSeries = (days: number): RevenueDataPoint[] => {
  const data: RevenueDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const label =
      days <= 30
        ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

    // Simulate a realistic revenue curve with some noise + upward trend
    const base = 8000 + (days - i) * 40;
    const noise = Math.sin(i * 0.7) * 1200 + Math.random() * 800;
    const revenue = Math.round(base + noise);
    const orders = Math.round(revenue / 75 + Math.random() * 8);
    const users = Math.round(orders * 3.2 + Math.random() * 20);

    data.push({ date: label, revenue, orders, users });
  }

  // Deduplicate labels for 1Y (monthly grouping)
  if (days > 90) {
    const seen = new Set<string>();
    return data.filter((d) => {
      if (seen.has(d.date)) return false;
      seen.add(d.date);
      return true;
    });
  }

  return data;
};

const REVENUE_BY_PERIOD: Record<Period, RevenueDataPoint[]> = {
  "7d": generateRevenueSeries(7),
  "30d": generateRevenueSeries(30),
  "90d": generateRevenueSeries(90),
  "1y": generateRevenueSeries(365),
};

// ─── Activity / Transactions ────────────────────────────────────────────────

const NAMES = [
  ["Liam Johnson", "liam@example.com"],
  ["Sophia Chen", "sophia@example.com"],
  ["Marcus Williams", "marcus@example.com"],
  ["Aisha Patel", "aisha@example.com"],
  ["Oliver Smith", "oliver@example.com"],
  ["Emma Rodriguez", "emma@example.com"],
  ["Noah Kim", "noah@example.com"],
  ["Isabella Brown", "isabella@example.com"],
  ["Ethan Davis", "ethan@example.com"],
  ["Mia Wilson", "mia@example.com"],
  ["James Martinez", "james@example.com"],
  ["Charlotte Taylor", "charlotte@example.com"],
  ["Benjamin Lee", "ben@example.com"],
  ["Amelia Thomas", "amelia@example.com"],
  ["Lucas Jackson", "lucas@example.com"],
];

const TRANSACTION_TYPES = [
  "Subscription",
  "One-time Purchase",
  "Upgrade",
  "Renewal",
  "Add-on",
  "Refund",
];

const STATUSES: ActivityItem["status"][] = [
  "completed",
  "completed",
  "completed",
  "pending",
  "pending",
  "failed",
  "cancelled",
];

const formatRelativeDate = (daysAgo: number): string => {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const ACTIVITY: ActivityItem[] = Array.from({ length: 40 }, (_, i) => {
  const [customer, email] = NAMES[i % NAMES.length];
  const status = STATUSES[i % STATUSES.length];
  const type = TRANSACTION_TYPES[i % TRANSACTION_TYPES.length];
  const amount = Math.round(Math.random() * 480 + 20);

  return {
    id: `txn_${String(i + 1).padStart(4, "0")}`,
    customer,
    email,
    type,
    amount,
    status,
    date: formatRelativeDate(Math.floor(i / 3)),
  };
});

// ─── Full dashboard payload ─────────────────────────────────────────────────

export const MOCK_DASHBOARD_DATA: DashboardData = {
  stats: {
    totalRevenue: { value: 248_500, change: 12.4, trend: "up" },
    totalUsers: { value: 14_820, change: 8.1, trend: "up" },
    totalOrders: { value: 3_247, change: -2.3, trend: "down" },
    conversionRate: { value: 3.6, change: 0.4, trend: "up" },
  },
  revenue: REVENUE_BY_PERIOD["30d"], // default period
  traffic: [
    { source: "Organic Search", value: 38, color: "#9b1c1c" },
    { source: "Direct",         value: 24, color: "#c2410c" },
    { source: "Referral",       value: 18, color: "#b45309" },
    { source: "Social",         value: 13, color: "#d4a373" },
    { source: "Email",          value: 7,  color: "#292524" },
  ],
  activity: ACTIVITY,
};

export { REVENUE_BY_PERIOD };
