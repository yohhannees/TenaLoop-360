import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reviews = await prisma.providerReview.findMany({
    where: { providerId: id },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ reviews });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: providerId } = await params;
  const body = (await req.json().catch(() => null)) as { rating?: number; text?: string } | null;
  const rating = Number(body?.rating);

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }

  const review = await prisma.providerReview.upsert({
    where: { userId_providerId: { userId: session.userId, providerId } },
    create: { userId: session.userId, providerId, rating, text: body?.text },
    update: { rating, text: body?.text },
  });

  // Recompute average rating
  const agg = await prisma.providerReview.aggregate({
    where: { providerId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.provider.update({
    where: { id: providerId },
    data: {
      avgRating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count.rating,
    },
  });

  return NextResponse.json({ review });
}
