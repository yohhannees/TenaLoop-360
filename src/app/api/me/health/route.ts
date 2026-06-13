import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { getSession } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.userHealthProfile.findUnique({
    where: { userId: session.userId },
  });

  return NextResponse.json({ healthProfile: profile ?? null });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const data: Record<string, unknown> = {};

  if (typeof body.weightKg === "number" || body.weightKg === null) data.weightKg = body.weightKg;
  if (typeof body.heightCm === "number" || body.heightCm === null) data.heightCm = body.heightCm;
  if (typeof body.bloodType === "string" || body.bloodType === null) data.bloodType = body.bloodType;
  if (typeof body.diabetesType === "string" || body.diabetesType === null) data.diabetesType = body.diabetesType;
  if (Array.isArray(body.allergies)) data.allergies = body.allergies;
  if (Array.isArray(body.conditions)) data.conditions = body.conditions;
  if (typeof body.medications === "string" || body.medications === null) data.medications = body.medications;
  if (typeof body.bloodSugarFasting === "number" || body.bloodSugarFasting === null) data.bloodSugarFasting = body.bloodSugarFasting;
  if (typeof body.bloodPressure === "string" || body.bloodPressure === null) data.bloodPressure = body.bloodPressure;
  if (typeof body.emergencyContact === "string" || body.emergencyContact === null) data.emergencyContact = body.emergencyContact;
  if (typeof body.notes === "string" || body.notes === null) data.notes = body.notes;

  const profile = await prisma.userHealthProfile.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, ...data },
    update: data,
  });

  return NextResponse.json({ healthProfile: profile });
}
