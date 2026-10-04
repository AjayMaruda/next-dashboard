import { NextRequest, NextResponse } from "next/server";
import { MOCK_DASHBOARD_DATA } from "@/lib/mock-data/dashboard";
import type { TransactionStatus } from "@/types/dashboard";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status") as TransactionStatus | "all" | null;
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  let items = MOCK_DASHBOARD_DATA.activity;

  if (search) {
    items = items.filter(
      (item) =>
        item.customer.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search)
    );
  }

  if (status && status !== "all") {
    items = items.filter((item) => item.status === status);
  }

  const total = items.length;
  const paginated = items.slice((page - 1) * limit, page * limit);

  await new Promise((r) => setTimeout(r, 60));
  return NextResponse.json({
    success: true,
    data: paginated,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}
