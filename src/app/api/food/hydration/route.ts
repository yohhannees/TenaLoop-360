import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logHydration } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const hydration = await prisma.hydrationLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ hydration });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const cups = asNumber(body.cups);
    const goal = asNumber(body.goal, 8);

    if (!Number.isInteger(cups) || cups < 0) {
      throw new ApiError("Cups must be a non-negative integer.", 400);
    }

    const hydration = await logHydration(user.id, cups, goal);
    return NextResponse.json({
      hydration,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}
