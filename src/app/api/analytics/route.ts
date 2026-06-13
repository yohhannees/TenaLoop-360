import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [
    checkIns,
    mealCount,
    movementCount,
    hydrationLogs,
    bookingCount,
    joinedCircleCount,
  ] = await Promise.all([
    prisma.checkInEntry.findMany({
      where: { userId: session.userId, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: { score: true, checkIn: true, foodSignal: true, createdAt: true },
    }),
    prisma.mealLog.count({ where: { userId: session.userId, createdAt: { gte: since } } }),
    prisma.movementSession.count({ where: { userId: session.userId, createdAt: { gte: since } } }),
    prisma.hydrationLog.findMany({
      where: { userId: session.userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 7,
    }),
    prisma.booking.count({ where: { userId: session.userId } }),
    prisma.circleMembership.count({ where: { userId: session.userId, status: "joined" } }),
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
  const avgScore =
    checkIns.length > 0
      ? Math.round(checkIns.reduce((sum, item) => sum + item.score, 0) / checkIns.length)
      : null;
  const avgStress = averageJsonNumber(checkIns.map((item) => item.checkIn), "stress");
  const avgSleep = averageJsonNumber(checkIns.map((item) => item.checkIn), "sleep");
  const avgMovement = averageJsonNumber(checkIns.map((item) => item.checkIn), "movement");
  const highRiskMealCount = checkIns.filter((item) => readRisk(item.foodSignal) === "High").length;

  return NextResponse.json({
    trend,
    checkInCount: checkIns.length,
    mealCount,
    movementCount,
    avgHydration,
    avgScore,
    avgStress,
    avgSleep,
    avgMovement,
    highRiskMealCount,
    bookingCount,
    joinedCircleCount,
  });
}

function averageJsonNumber(values: unknown[], key: string) {
  const numbers = values
    .map((value) => readNumber(value, key))
    .filter((value): value is number => typeof value === "number");

  if (numbers.length === 0) return null;
  return Math.round((numbers.reduce((sum, value) => sum + value, 0) / numbers.length) * 10) / 10;
}

function readNumber(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  return typeof record[key] === "number" ? record[key] : null;
}

function readRisk(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  return typeof record.risk === "string" ? record.risk : null;
}
