import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const bundles = await prisma.wellnessBundle.findMany({
    where: { active: true },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({ bundles });
}
