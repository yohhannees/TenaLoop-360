import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logMovement } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const sessions = await prisma.movementSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const type = asString(body.type);

    if (!type) throw new ApiError("Movement session type is required.", 400);

    const session = await logMovement(user.id, {
      type,
      workoutId: asString(body.workoutId) || undefined,
      title: asString(body.title) || undefined,
      durationSeconds: asNumber(body.durationSeconds) || undefined,
      minutes: asNumber(body.minutes) || undefined,
      cycles: asNumber(body.cycles) || undefined,
      points: asNumber(body.points) || 0,
    });

    return NextResponse.json({
      session,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}
