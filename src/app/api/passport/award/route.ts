import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asNumber, asString, jsonError, readJson } from "@/lib/server/http";
import { Stamp } from "@/lib/types";
import { awardPassport, getBackendState } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STAMPS: Stamp[] = ["Mind", "Food", "Move", "Community", "Experience", "Health"];

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const stamp = asString(body.stamp) as Stamp;
    const points = asNumber(body.points);

    if (!STAMPS.includes(stamp)) throw new ApiError("Unknown passport stamp.", 400);
    if (!Number.isInteger(points) || points <= 0) {
      throw new ApiError("Points must be a positive integer.", 400);
    }

    await awardPassport(user.id, stamp, points, asString(body.source, "manual"), {
      client: "web",
    });

    return NextResponse.json({ state: await getBackendState(user) });
  } catch (error) {
    return jsonError(error);
  }
}
