import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    type?: string;
    title?: string;
    body?: string;
  } | null;

  if (!body?.title || !body?.type) {
    return NextResponse.json({ error: "type and title required" }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: {
      userId: session.userId,
      type: body.type,
      title: body.title,
      body: body.body,
    },
  });

  return NextResponse.json({ notification });
}
