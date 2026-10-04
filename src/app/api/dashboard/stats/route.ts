import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/api/dashboard";

export async function GET() {
  const data = await getDashboardStats();
  return NextResponse.json({ success: true, data });
}
