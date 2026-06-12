import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { jsonError } from "@/lib/server/http";
import { getBackendState } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ authenticated: false });

    const state = await getBackendState(user);
    return NextResponse.json({ authenticated: true, state });
  } catch (error) {
    return jsonError(error);
  }
}
