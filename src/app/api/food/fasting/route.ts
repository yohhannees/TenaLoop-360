import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const sessions = await prisma.fastingSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
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
    const action = asString(body.action, "start");

    if (action === "start") {
      const session = await prisma.fastingSession.create({
        data: {
          userId: user.id,
          targetHours: asNumber(body.targetHours, 16),
        },
      });
      return NextResponse.json({ session });
    }

    if (action === "end") {
      const sessionId = asString(body.sessionId);
      if (!sessionId) throw new ApiError("Session id is required.", 400);

      const existing = await prisma.fastingSession.findFirst({
        where: { id: sessionId, userId: user.id },
      });
      if (!existing) throw new ApiError("Fasting session not found.", 404);

      const session = await prisma.fastingSession.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          status: "completed",
        },
      });
      return NextResponse.json({ session });
    }

    throw new ApiError("Unsupported fasting action.", 400);
  } catch (error) {
    return jsonError(error);
  }
}
