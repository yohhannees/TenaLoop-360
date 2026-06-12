import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  destroyCurrentSession,
} from "@/lib/server/auth";
import { jsonError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroyCurrentSession();
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
