import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logCircleCheckIn } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const circleId = request.nextUrl.searchParams.get("circleId")?.trim();

    if (circleId) {
      const since = new Date();
      since.setDate(since.getDate() - 6);
      since.setHours(0, 0, 0, 0);

      const checkIns = await prisma.circleCheckIn.findMany({
        where: {
          circleId,
          createdAt: { gte: since },
          mood: { not: null },
        },
        select: { mood: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      });

      const moods = ["Low", "Okay", "Good"] as const;
      const counts = Object.fromEntries(moods.map((mood) => [mood, 0])) as Record<
        (typeof moods)[number],
        number
      >;

      for (const checkIn of checkIns) {
        if (checkIn.mood === "Low" || checkIn.mood === "Okay" || checkIn.mood === "Good") {
          counts[checkIn.mood] += 1;
        }
      }

      const total = checkIns.length;
      const percentages = Object.fromEntries(
        moods.map((mood) => [mood, total > 0 ? Math.round((counts[mood] / total) * 100) : 0]),
      );
      const labels: string[] = [];
      const goodTrend: number[] = [];

      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - offset);
        const key = date.toISOString().slice(0, 10);
        const dayLogs = checkIns.filter((checkIn) => checkIn.createdAt.toISOString().slice(0, 10) === key);
        const goodCount = dayLogs.filter((checkIn) => checkIn.mood === "Good").length;

        labels.push(getDayLabel(date, offset));
        goodTrend.push(dayLogs.length > 0 ? Math.round((goodCount / dayLogs.length) * 100) : 0);
      }

      return NextResponse.json({
        moodSummary: {
          total,
          percentages,
          goodTrend,
          labels,
        },
      });
    }

    const checkIns = await prisma.circleCheckIn.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ checkIns });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const circleId = asString(body.circleId);

    if (!circleId) throw new ApiError("Circle id is required.", 400);

    const checkIn = await logCircleCheckIn(user.id, {
      circleId,
      mood: asString(body.mood) || undefined,
      stressRelief: asNumber(body.stressRelief) || undefined,
      note: asString(body.note) || undefined,
    });

    return NextResponse.json({
      checkIn,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}

function getDayLabel(date: Date, offset: number) {
  if (offset === 0) return "Today";
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}
