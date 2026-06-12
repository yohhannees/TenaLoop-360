import { NextResponse } from "next/server";
import { codeExpiryDate } from "@/lib/server/auth";
import { jsonError, readJson, asString } from "@/lib/server/http";
import { sendAuthCodeEmail } from "@/lib/server/mail";
import {
  hashLoginCode,
  makeLoginCode,
  normalizeEmail,
} from "@/lib/server/security";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROLES = new Set(["Individual", "Provider", "Employer"]);

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const email = normalizeEmail(asString(body.email));
    const name = asString(body.name) || null;
    const role = ROLES.has(asString(body.role)) ? asString(body.role) : "Individual";
    const organization = asString(body.organization) || null;
    const mode = asString(body.mode) === "signup" ? "signup" : "login";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        role,
        organization,
      },
      update:
        mode === "signup"
          ? {
              ...(name ? { name } : {}),
              ...(organization ? { organization } : {}),
              role,
            }
          : {},
    });

    await prisma.emailLoginCode.deleteMany({
      where: {
        userId: user.id,
        consumedAt: null,
      },
    });

    const code = makeLoginCode();
    await prisma.emailLoginCode.create({
      data: {
        userId: user.id,
        email,
        codeHash: hashLoginCode(email, code),
        purpose: mode,
        expiresAt: codeExpiryDate(),
      },
    });

    const delivery = await sendAuthCodeEmail({
      email,
      code,
      mode,
      name,
    });

    return NextResponse.json({
      ok: true,
      email,
      delivery: delivery.delivery,
    });
  } catch (error) {
    return jsonError(error);
  }
}
