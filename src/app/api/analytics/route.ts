import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [checkIns, mealCount, movementCount, hydrationLogs] = await Promise.all([
    prisma.checkInEntry.findMany({
      where: { userId: session.userId, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: { score: true, createdAt: true },
    }),
    prisma.mealLog.count({ where: { userId: session.userId, createdAt: { gte: since } } }),
    prisma.movementSession.count({ where: { userId: session.userId, createdAt: { gte: since } } }),
    prisma.hydrationLog.findMany({
      where: { userId: session.userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
  ]);

  // Build a 7-day score array (fill missing days with 0)
  const scoreByDay: Record<string, number> = {};
  for (const c of checkIns) {
    const day = c.createdAt.toISOString().slice(0, 10);
    scoreByDay[day] = Math.max(scoreByDay[day] ?? 0, c.score);
  }

  const trend: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    trend.push(scoreByDay[key] ?? 0);
  }

  const avgHydration =
    hydrationLogs.length > 0
      ? Math.round(hydrationLogs.reduce((s, h) => s + h.cups, 0) / hydrationLogs.length)
      : 0;

  return NextResponse.json({
    trend,
    checkInCount: checkIns.length,
    mealCount,
    movementCount,
    avgHydration,
  });
}
