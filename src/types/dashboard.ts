export type Trend = "up" | "down" | "neutral";
export type TransactionStatus = "completed" | "pending" | "failed" | "cancelled";
export type Period = "7d" | "30d" | "90d" | "1y";

export interface StatMetric {
  value: number;
  change: number; // percentage change vs previous period
  trend: Trend;
}

export interface DashboardStats {
  totalRevenue: StatMetric;
  totalUsers: StatMetric;
  totalOrders: StatMetric;
  conversionRate: StatMetric;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  users: number;
}

export interface TrafficSource {
  source: string;
  value: number; // percentage
  color: string;
}

export interface ActivityItem {
  id: string;
  customer: string;
  email: string;
  type: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  avatar?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenue: RevenueDataPoint[];
  traffic: TrafficSource[];
  activity: ActivityItem[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
