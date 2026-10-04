import { NextRequest, NextResponse } from "next/server";
import { getActivity } from "@/lib/api/dashboard";
import type { SortField, SortDir } from "@/types/dashboard";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const sortField = (searchParams.get("sortField") as SortField) || "date";
  const sortDir = (searchParams.get("sortDir") as SortDir) || "desc";

  const result = await getActivity({ search, status, page, limit, sortField, sortDir });

  return NextResponse.json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
}
