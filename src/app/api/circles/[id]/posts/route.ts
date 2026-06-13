import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: circleId } = await params;
  const posts = await prisma.circlePost.findMany({
    where: { circleId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      circleId: p.circleId,
      text: p.text,
      mood: p.mood,
      likes: p.likes,
      author: p.user.name ? p.user.name.split(" ")[0] : "Member",
      timeAgo: formatTimeAgo(p.createdAt),
      createdAt: p.createdAt.toISOString(),
    })),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: circleId } = await params;
  const body = (await req.json().catch(() => null)) as { text?: string; mood?: string } | null;

  if (!body?.text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const post = await prisma.circlePost.create({
    data: {
      circleId,
      userId: session.userId,
      text: body.text.trim(),
      mood: body.mood ?? "Okay",
    },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json({
    post: {
      id: post.id,
      circleId: post.circleId,
      text: post.text,
      mood: post.mood,
      likes: post.likes,
      author: post.user.name ? post.user.name.split(" ")[0] : "Member",
      timeAgo: "just now",
      createdAt: post.createdAt.toISOString(),
    },
  });
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
