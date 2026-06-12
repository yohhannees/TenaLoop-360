import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import {
  getBackendState,
  normalizeCheckIn,
  saveCheckInSnapshot,
} from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const checkIns = await prisma.checkInEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
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
    const checkIn = "checkIn" in body ? normalizeCheckIn(body.checkIn) : undefined;
    const entry = await saveCheckInSnapshot(user.id, checkIn);

    return NextResponse.json({
      checkIn: entry,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}
