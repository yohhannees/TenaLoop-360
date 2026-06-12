import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/server/auth";
import { ApiError, asString, jsonError, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { createBooking, getBackendState } from "@/lib/server/wellness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireCurrentUser();
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCurrentUser();
    const body = await readJson(request);
    const providerId = asString(body.providerId);
    const slot = asString(body.slot);

    if (!providerId || !slot) {
      throw new ApiError("Provider id and slot are required.", 400);
    }

    const dateText = asString(body.bookingDate) || asString(body.date);
    const bookingDate = dateText ? new Date(dateText) : new Date();
    if (Number.isNaN(bookingDate.getTime())) {
      throw new ApiError("Booking date is invalid.", 400);
    }

    const booking = await createBooking(user.id, {
      providerId,
      providerName: asString(body.providerName) || undefined,
      bookingRef: asString(body.bookingRef) || undefined,
      bookingDate,
      slot,
      customerName: asString(body.customerName) || asString(body.name) || undefined,
      phone: asString(body.phone) || undefined,
      note: asString(body.note) || undefined,
      paymentMethod: asString(body.paymentMethod) || undefined,
      price: asString(body.price) || undefined,
    });

    return NextResponse.json({
      booking,
      state: await getBackendState(user),
    });
  } catch (error) {
    return jsonError(error);
  }
}
