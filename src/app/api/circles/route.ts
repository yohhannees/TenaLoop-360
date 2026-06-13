import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const [circles, memberCounts] = await Promise.all([
    prisma.circleRecord.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.circleMembership.groupBy({
      by: ["circleId"],
      where: { status: "joined" },
      _count: { circleId: true },
    }),
  ]);

  const countMap = Object.fromEntries(memberCounts.map((m) => [m.circleId, m._count.circleId]));

  const result = circles.map((c) => ({
    id: c.id,
    name: c.name,
    time: c.time,
    focus: c.focus,
    challenge: c.challenge,
    members: countMap[c.id] ?? 0,
  }));

  return NextResponse.json({ circles: result });
}
