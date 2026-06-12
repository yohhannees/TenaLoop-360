import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { getBackendState, saveProviderMatch } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const matches = await prisma.providerMatch.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const providerId = asString(body.providerId);

    if (!providerId) throw new ApiError("Provider id is required.", 400);

    await saveProviderMatch(user.id, providerId, asString(body.source, "market"));
    return NextResponse.json({ state: await getBackendState(user) });
  } catch (error) {
    return jsonError(error);
  }
}
