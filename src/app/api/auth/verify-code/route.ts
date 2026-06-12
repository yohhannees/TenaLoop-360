import { NextResponse } from "next/server";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/auth";
import { jsonError, readJson, asString } from "@/lib/server/http";
import { hashLoginCode, normalizeEmail } from "@/lib/server/security";
import { prisma } from "@/lib/server/prisma";
import { getBackendState } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const email = normalizeEmail(asString(body.email));
    const code = asString(body.code).replace(/\D/g, "");

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }

    const loginCode = await prisma.emailLoginCode.findUnique({
      where: { codeHash: hashLoginCode(email, code) },
      include: { user: true },
    });

    if (!loginCode || loginCode.email !== email) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
    }

    if (loginCode.consumedAt || loginCode.expiresAt <= new Date()) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
    }

    if (loginCode.attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
    }

    await prisma.$transaction([
      prisma.emailLoginCode.update({
        where: { id: loginCode.id },
        data: {
          consumedAt: new Date(),
          attempts: { increment: 1 },
        },
      }),
      prisma.user.update({
        where: { id: loginCode.userId },
        data: { emailVerified: new Date() },
      }),
    ]);

    const session = await createSession(loginCode.userId);
    const state = await getBackendState(loginCode.user);
    const response = NextResponse.json({ ok: true, state });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
