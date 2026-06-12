import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, joinCircle } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const memberships = await prisma.circleMembership.findMany({
      where: { userId: user.id },
      orderBy: { joinedAt: "desc" },
    });

    return NextResponse.json({ memberships });
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

    await joinCircle(user.id, circleId);
    return NextResponse.json({ state: await getBackendState(user) });
  } catch (error) {
    return jsonError(error);
  }
}
