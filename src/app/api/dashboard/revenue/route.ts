import { NextRequest, NextResponse } from "next/server";
import { REVENUE_BY_PERIOD } from "@/lib/mock-data/dashboard";
import type { Period } from "@/types/dashboard";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const period = (searchParams.get("period") ?? "30d") as Period;
  const validPeriods: Period[] = ["7d", "30d", "90d", "1y"];
  const safePeriod = validPeriods.includes(period) ? period : "30d";

  await new Promise((r) => setTimeout(r, 60));
  return NextResponse.json({ success: true, data: REVENUE_BY_PERIOD[safePeriod] });
}
