import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession, publicUser } from "@/lib/server/auth";

export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    role?: string;
    organization?: string;
  } | null;

  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const VALID_ROLES = ["Individual", "Provider", "Employer", "Admin"];
  const data: Record<string, string | null> = {};

  if (typeof body.name === "string") data.name = body.name.trim() || null;
  if (typeof body.role === "string" && VALID_ROLES.includes(body.role)) data.role = body.role;
  if (typeof body.organization === "string") data.organization = body.organization.trim() || null;

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data,
  });

  return NextResponse.json({ user: publicUser(updated) });
}
