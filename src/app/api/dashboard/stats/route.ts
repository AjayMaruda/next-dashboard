import { NextResponse } from "next/server";
import { MOCK_DASHBOARD_DATA } from "@/lib/mock-data/dashboard";

export async function GET() {
  await new Promise((r) => setTimeout(r, 60));
  return NextResponse.json({ success: true, data: MOCK_DASHBOARD_DATA.stats });
}
