import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, logMeal } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const meals = await prisma.mealLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ meals });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const text = asString(body.text);

    if (!text) throw new ApiError("Meal text is required.", 400);

    const meal = await logMeal(user.id, {
      text,
      slot: asString(body.slot) || undefined,
      photoUrl: asString(body.photoUrl) || undefined,
    });

    return NextResponse.json({
      meal,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}
