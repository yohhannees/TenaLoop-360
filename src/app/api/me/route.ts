import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, jsonError, readJson } from "@/lib/server/http";
import { Language } from "@/lib/types";
import {
  getBackendState,
  normalizeCheckIn,
  patchWellnessState,
} from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    return NextResponse.json({ state: await getBackendState(user) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const patch: Parameters<typeof patchWellnessState>[1] = {};

    if ("checkIn" in body) {
      patch.checkIn = normalizeCheckIn(body.checkIn);
    }

    if ("language" in body) {
      if (body.language !== "English" && body.language !== "Amharic-ready") {
        throw new ApiError("Unsupported language.", 400);
      }
      patch.language = body.language as Language;
    }

    await patchWellnessState(user.id, patch);
    return NextResponse.json({ state: await getBackendState(user) });
  } catch (error) {
    return jsonError(error);
  }
}
