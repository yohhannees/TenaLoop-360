import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logCircleCheckIn } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
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
