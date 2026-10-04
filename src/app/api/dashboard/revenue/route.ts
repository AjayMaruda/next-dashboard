import { NextRequest, NextResponse } from "next/server";
import { getRevenue } from "@/lib/api/dashboard";
import type { Period } from "@/types/dashboard";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const period = (searchParams.get("period") ?? "30d") as Period;

  const data = await getRevenue(period);

  return NextResponse.json({ success: true, data });
}
