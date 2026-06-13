import { NextResponse } from "next/server";
import {
  dashboardConfigDefaults,
  normalizeDashboardConfig,
} from "@/lib/dashboard-config";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { id: "dashboard" },
    });

    return NextResponse.json({
      config: normalizeDashboardConfig(setting?.value),
    });
  } catch {
    return NextResponse.json({ config: dashboardConfigDefaults });
  }
}
