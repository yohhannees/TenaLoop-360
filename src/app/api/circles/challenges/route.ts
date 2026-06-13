import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logCircleChallenge } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const circleId = request.nextUrl.searchParams.get("circleId")?.trim();
    const challengeIdPrefix = request.nextUrl.searchParams.get("challengeIdPrefix")?.trim();
    const days = Math.max(1, asNumber(request.nextUrl.searchParams.get("days")) || 5);
    const weekStart = getWeekStart();

    const where = {
      userId: user.id,
      ...(circleId ? { circleId } : {}),
      ...(challengeIdPrefix ? { challengeId: { startsWith: challengeIdPrefix } } : {}),
      ...(circleId || challengeIdPrefix ? { createdAt: { gte: weekStart } } : {}),
    };

    const challenges = await prisma.circleChallengeLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (!circleId) {
      return NextResponse.json({ challenges });
    }

    const groupWhere = {
      circleId,
      ...(challengeIdPrefix ? { challengeId: { startsWith: challengeIdPrefix } } : {}),
      createdAt: { gte: weekStart },
    };

    const [groupLogs, memberCount] = await Promise.all([
      prisma.circleChallengeLog.findMany({
        where: groupWhere,
        select: { userId: true, challengeId: true },
      }),
      prisma.circleMembership.count({ where: { circleId, status: "joined" } }),
    ]);

    const groupCompletions = new Set(
      groupLogs.map((log) => `${log.userId}:${log.challengeId}`),
    ).size;
    const activeMembers = Math.max(
      memberCount,
      new Set(groupLogs.map((log) => log.userId)).size,
      1,
    );
    const groupPct = Math.min(
      100,
      Math.round((groupCompletions / (activeMembers * days)) * 100),
    );

    return NextResponse.json({
      challenges,
      completedChallengeIds: challenges.map((challenge) => challenge.challengeId),
      groupPct,
    });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const circleId = asString(body.circleId);
    const challengeId = asString(body.challengeId);

    if (!circleId || !challengeId) {
      throw new ApiError("Circle id and challenge id are required.", 400);
    }

    const challenge = await logCircleChallenge(user.id, {
      circleId,
      challengeId,
      points: asNumber(body.points) || 0,
    });

    return NextResponse.json({
      challenge,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}

function getWeekStart() {
  const date = new Date();
  const dayOffset = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - dayOffset);
  return date;
}
