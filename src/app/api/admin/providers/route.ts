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
  const providers = await prisma.provider.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ providers });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.id || !body?.name) {
    return NextResponse.json({ error: "id and name required" }, { status: 400 });
  }

  const provider = await prisma.provider.create({
    data: {
      id: body.id,
      name: body.name,
      type: body.type ?? "",
      area: body.area ?? "",
      price: body.price ?? "",
      bestFor: body.bestFor ?? "",
      category: body.category ?? "Recovery",
      description: body.description ?? "",
      emoji: body.emoji ?? "",
      tags: body.tags ?? [],
      slots: body.slots ?? [],
      availableToday: body.availableToday ?? true,
      passportDiscount: body.passportDiscount ?? 0,
      distance: body.distance,
      hours: body.hours,
      phone: body.phone,
      imageUrl: body.imageUrl,
      sourceUrl: body.sourceUrl,
    },
  });

  return NextResponse.json({ provider }, { status: 201 });
}
