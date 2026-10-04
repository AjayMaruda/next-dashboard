import type { DashboardData, DashboardStats, RevenueDataPoint, ActivityItem, Period } from "@/types/dashboard";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Unknown error");
  return json.data as T;
}

export async function getDashboardData(period: Period = "30d"): Promise<DashboardData> {
  return fetcher<DashboardData>(`/api/dashboard?period=${period}`);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetcher<DashboardStats>("/api/dashboard/stats");
}

export async function getRevenue(period: Period): Promise<RevenueDataPoint[]> {
  return fetcher<RevenueDataPoint[]>(`/api/dashboard/revenue?period=${period}`);
}

export async function getActivity(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ActivityItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const qs = query.toString();
  const res = await fetch(`${BASE_URL}/api/dashboard/activity${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  const json = await res.json();
  return { data: json.data, meta: json.meta };
}
