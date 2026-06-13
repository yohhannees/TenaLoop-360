import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession, publicUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_ROLES = ["Individual", "Provider", "Employer", "Admin"];
const VALID_GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") data.name = body.name.trim() || null;
  if (typeof body.role === "string" && VALID_ROLES.includes(body.role)) data.role = body.role;
  if (typeof body.organization === "string") data.organization = body.organization.trim() || null;
  if (typeof body.gender === "string" && VALID_GENDERS.includes(body.gender)) data.gender = body.gender;
  if (body.gender === null) data.gender = null;
  if (typeof body.dateOfBirth === "string") {
    const d = new Date(body.dateOfBirth);
    data.dateOfBirth = isNaN(d.getTime()) ? null : d;
  }

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data,
  });

  return NextResponse.json({ user: publicUser(updated) });
}
