import type {
  DashboardData,
  DashboardStats,
  RevenueDataPoint,
  ActivityItem,
  Period,
  SortField,
  SortDir,
} from "@/types/dashboard";
import {
  MOCK_DASHBOARD_DATA,
  REVENUE_BY_PERIOD,
} from "@/lib/mock-data/dashboard";

export async function getDashboardData(period: Period = "30d"): Promise<DashboardData> {
  const safePeriod: Period = REVENUE_BY_PERIOD[period] ? period : "30d";
  return {
    ...MOCK_DASHBOARD_DATA,
    revenue: REVENUE_BY_PERIOD[safePeriod],
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return MOCK_DASHBOARD_DATA.stats;
}

export async function getRevenue(period: Period): Promise<RevenueDataPoint[]> {
  const safePeriod: Period = REVENUE_BY_PERIOD[period] ? period : "30d";
  return REVENUE_BY_PERIOD[safePeriod];
}

export async function getActivity(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortField?: SortField;
  sortDir?: SortDir;
}): Promise<{
  data: ActivityItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    sortField: SortField;
    sortDir: SortDir;
  };
}> {
  const search = params?.search?.toLowerCase().trim() ?? "";
  const status = params?.status ?? "all";
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.max(1, params?.limit ?? 5);
  const sortField = params?.sortField ?? "date";
  const sortDir = params?.sortDir ?? "desc";

  let filtered: ActivityItem[] = [...MOCK_DASHBOARD_DATA.activity];

  if (search) {
    filtered = filtered.filter(
      (item: ActivityItem) =>
        item.customer.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search),
    );
  }

  if (status !== "all") {
    filtered = filtered.filter((item: ActivityItem) => item.status === status);
  }

  filtered.sort((a, b) => {
    let av: string | number = a[sortField];
    let bv: string | number = b[sortField];
    if (sortField === "amount") {
      av = Number(av);
      bv = Number(bv);
    } else if (sortField === "date") {
      av = new Date(av).getTime();
      bv = new Date(bv).getTime();
    } else {
      av = String(av).toLowerCase();
      bv = String(bv).toLowerCase();
    }
    return sortDir === "asc" ? (av < bv ? -1 : 1) : av > bv ? -1 : 1;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      sortField,
      sortDir,
    },
  };
}
