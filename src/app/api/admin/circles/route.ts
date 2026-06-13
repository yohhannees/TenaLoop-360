import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

async function requireAdmin(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.role !== "Admin") return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [circles, memberCounts] = await Promise.all([
    prisma.circleRecord.findMany({ orderBy: { name: "asc" } }),
    prisma.circleMembership.groupBy({
      by: ["circleId"],
      _count: { circleId: true },
    }),
  ]);

  const countMap = Object.fromEntries(memberCounts.map((m) => [m.circleId, m._count.circleId]));
  return NextResponse.json({ circles: circles.map((c) => ({ ...c, memberCount: countMap[c.id] ?? 0 })) });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.name) {
    return NextResponse.json({ error: "id and name required" }, { status: 400 });
  }

  const circle = await prisma.circleRecord.create({
    data: {
      id: body.id,
      name: body.name,
      time: body.time ?? "",
      focus: body.focus ?? "",
      challenge: body.challenge ?? "",
    },
  });

  return NextResponse.json({ circle }, { status: 201 });
}
