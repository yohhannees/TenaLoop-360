import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logCircleChallenge } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const challenges = await prisma.circleChallengeLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ challenges });
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
