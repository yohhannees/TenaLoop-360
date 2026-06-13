import { DEFAULT_CHECK_IN, DEFAULT_STAMPS, INITIAL_MESSAGES } from "@/lib/defaults";
import {
  BookingEntry,
  ChatMessage,
  CheckIn,
  Language,
  MealLogEntry,
  Stamp,
  UserHealthProfile,
  WellnessBackendState,
} from "@/lib/types";
import { calculateScore, buildPlan } from "@/lib/score";
import { getFoodSignal } from "@/lib/foods";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/server/prisma";
import { publicUser } from "@/lib/server/auth";

const STAMPS: Stamp[] = ["Mind", "Food", "Move", "Community", "Experience", "Health"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeCheckIn(value: unknown): CheckIn {
  const incoming = isRecord(value) ? value : {};
  const painAreas = Array.isArray(incoming.painAreas)
    ? incoming.painAreas.filter((item): item is CheckIn["painAreas"][number] => typeof item === "string")
    : DEFAULT_CHECK_IN.painAreas;

  return {
    ...DEFAULT_CHECK_IN,
    ...incoming,
    painAreas,
  } as CheckIn;
}

function toStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback;
}

function toStampArray(value: unknown) {
  const stamps = toStringArray(value, DEFAULT_STAMPS);
  return stamps.filter((stamp): stamp is Stamp => STAMPS.includes(stamp as Stamp));
}

function toLanguage(value: unknown): Language {
  return value === "Amharic-ready" ? "Amharic-ready" : "English";
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function asJson(value: unknown): Prisma.InputJsonValue | undefined {
  return value === undefined ? undefined : (value as Prisma.InputJsonValue);
}

export async function ensureWellnessState(userId: string) {
  return prisma.wellnessState.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      checkIn: DEFAULT_CHECK_IN,
      stamps: DEFAULT_STAMPS,
      points: 180,
      savedProviderMatches: [],
      bookedProviders: [],
      joinedCircles: [],
      language: "English",
    },
  });
}

type WellnessUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organization: string | null;
  gender?: string | null;
  dateOfBirth?: Date | string | null;
};

export async function getBackendState(user: WellnessUser): Promise<WellnessBackendState> {
  const state = await ensureWellnessState(user.id);
  const [messages, recentMeals, bookings, rawProfile] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      take: 40,
    }),
    prisma.mealLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.booking.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.userHealthProfile.findUnique({ where: { userId: user.id } }),
  ]);

  const healthProfile: UserHealthProfile | null = rawProfile
    ? {
        weightKg: rawProfile.weightKg,
        heightCm: rawProfile.heightCm,
        bloodType: rawProfile.bloodType,
        diabetesType: rawProfile.diabetesType,
        allergies: toStringArray(rawProfile.allergies),
        conditions: toStringArray(rawProfile.conditions),
        medications: rawProfile.medications,
        bloodSugarFasting: rawProfile.bloodSugarFasting,
        bloodPressure: rawProfile.bloodPressure,
        emergencyContact: rawProfile.emergencyContact,
        notes: rawProfile.notes,
      }
    : null;

  // Derive womenWellness from gender so the feature activates automatically
  const baseCheckIn = normalizeCheckIn(state.checkIn);
  const isWoman = (user.gender ?? null) === "Female";
  const checkIn: CheckIn = { ...baseCheckIn, womenWellness: isWoman || baseCheckIn.womenWellness };

  return {
    user: publicUser(user),
    healthProfile,
    checkIn,
    stamps: toStampArray(state.stamps),
    points: state.points,
    savedProviderMatches: toStringArray(state.savedProviderMatches),
    bookedProviders: toStringArray(state.bookedProviders),
    joinedCircles: toStringArray(state.joinedCircles),
    language: toLanguage(state.language),
    messages: messages.length > 0 ? messages.map(toChatMessage) : INITIAL_MESSAGES,
    recentMeals: recentMeals.map(toMealLogEntry),
    bookings: bookings.map(toBookingEntry),
  };
}

export async function patchWellnessState(
  userId: string,
  patch: {
    checkIn?: Partial<CheckIn>;
    language?: Language;
    stamps?: Stamp[];
    points?: number;
    savedProviderMatches?: string[];
    bookedProviders?: string[];
    joinedCircles?: string[];
  },
) {
  const state = await ensureWellnessState(userId);
  const data: Record<string, unknown> = {};

  if (patch.checkIn) {
    data.checkIn = normalizeCheckIn({
      ...normalizeCheckIn(state.checkIn),
      ...patch.checkIn,
    });
  }

  if (patch.language) data.language = patch.language;
  if (patch.stamps) data.stamps = uniqueStrings(patch.stamps);
  if (typeof patch.points === "number") data.points = patch.points;
  if (patch.savedProviderMatches) data.savedProviderMatches = uniqueStrings(patch.savedProviderMatches);
  if (patch.bookedProviders) data.bookedProviders = uniqueStrings(patch.bookedProviders);
  if (patch.joinedCircles) data.joinedCircles = uniqueStrings(patch.joinedCircles);

  return prisma.wellnessState.update({
    where: { userId },
    data,
  });
}

export async function saveCheckInSnapshot(userId: string, checkIn?: CheckIn) {
  const state = await ensureWellnessState(userId);
  const nextCheckIn = normalizeCheckIn(checkIn ?? state.checkIn);
  const score = calculateScore(nextCheckIn);

  await prisma.wellnessState.update({
    where: { userId },
    data: { checkIn: nextCheckIn },
  });

  return prisma.checkInEntry.create({
    data: {
      userId,
      score,
      checkIn: nextCheckIn,
      foodSignal: getFoodSignal(nextCheckIn.meal),
      plan: buildPlan(nextCheckIn, score),
    },
  });
}

export async function awardPassport(
  userId: string,
  stamp: Stamp,
  points: number,
  source = "manual",
  metadata?: Record<string, unknown>,
) {
  const state = await ensureWellnessState(userId);
  const stamps = toStampArray(state.stamps);
  const nextStamps = stamps.includes(stamp) ? stamps : [...stamps, stamp];

  await prisma.$transaction([
    prisma.passportEvent.create({
      data: {
        userId,
        stamp,
        points,
        source,
        metadata: asJson(metadata),
      },
    }),
    prisma.wellnessState.update({
      where: { userId },
      data: {
        stamps: nextStamps,
        points: state.points + points,
      },
    }),
  ]);
}

export async function saveProviderMatch(
  userId: string,
  providerId: string,
  source = "rooted-body",
  metadata?: Record<string, unknown>,
) {
  const state = await ensureWellnessState(userId);
  const savedProviderMatches = uniqueStrings([
    ...toStringArray(state.savedProviderMatches),
    providerId,
  ]);

  await prisma.$transaction([
    prisma.providerMatch.upsert({
      where: { userId_providerId: { userId, providerId } },
      create: {
        userId,
        providerId,
        status: "saved",
        source,
        metadata: asJson(metadata),
      },
      update: {
        status: "saved",
        source,
        metadata: asJson(metadata),
      },
    }),
    prisma.wellnessState.update({
      where: { userId },
      data: { savedProviderMatches },
    }),
  ]);
}

export async function createBooking(
  userId: string,
  input: {
    providerId: string;
    providerName?: string;
    bookingRef?: string;
    bookingDate?: Date;
    slot: string;
    customerName?: string;
    phone?: string;
    note?: string;
    paymentMethod?: string;
    price?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const state = await ensureWellnessState(userId);
  const previousBooked = toStringArray(state.bookedProviders);
  const bookedProviders = uniqueStrings([...previousBooked, input.providerId]);
  const savedProviderMatches = uniqueStrings([
    ...toStringArray(state.savedProviderMatches),
    input.providerId,
  ]);

  const booking = await prisma.$transaction(async (tx) => {
    await tx.providerMatch.upsert({
      where: { userId_providerId: { userId, providerId: input.providerId } },
      create: {
        userId,
        providerId: input.providerId,
        status: "booked",
        source: "market",
        metadata: asJson(input.metadata),
      },
      update: {
        status: "booked",
        source: "market",
        metadata: asJson(input.metadata),
      },
    });

    const booking = await tx.booking.create({
      data: {
        userId,
        providerId: input.providerId,
        providerName: input.providerName,
        bookingRef: input.bookingRef || makeBookingRef(),
        bookingDate: input.bookingDate || new Date(),
        slot: input.slot,
        customerName: input.customerName,
        phone: input.phone,
        note: input.note,
        paymentMethod: input.paymentMethod,
        price: input.price,
        metadata: asJson(input.metadata),
      },
    });

    await tx.wellnessState.update({
      where: { userId },
      data: {
        bookedProviders,
        savedProviderMatches,
      },
    });

    return booking;
  });

  if (!previousBooked.includes(input.providerId)) {
    await awardPassport(userId, "Experience", 30, "market-booking", {
      providerId: input.providerId,
      bookingId: booking.id,
    });
  }

  return booking;
}

export async function joinCircle(userId: string, circleId: string) {
  const state = await ensureWellnessState(userId);
  const previousJoined = toStringArray(state.joinedCircles);
  const joinedCircles = uniqueStrings([...previousJoined, circleId]);

  await prisma.$transaction([
    prisma.circleMembership.upsert({
      where: { userId_circleId: { userId, circleId } },
      create: { userId, circleId },
      update: { status: "joined" },
    }),
    prisma.wellnessState.update({
      where: { userId },
      data: { joinedCircles },
    }),
  ]);

  if (!previousJoined.includes(circleId)) {
    await awardPassport(userId, "Community", 20, "circle-join", { circleId });
  }
}

export async function addChatMessage(
  userId: string,
  message: ChatMessage & { source?: string; model?: string },
) {
  return prisma.chatMessage.create({
    data: {
      userId,
      role: message.role,
      text: message.text,
      source: message.source,
      model: message.model,
    },
  });
}

export async function logMeal(
  userId: string,
  input: {
    text: string;
    slot?: string;
    photoUrl?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const signal = getFoodSignal(input.text);

  await patchWellnessState(userId, { checkIn: { meal: input.text } });
  const entry = await prisma.mealLog.create({
    data: {
      userId,
      text: input.text,
      slot: input.slot,
      risk: signal.risk,
      score: signal.score,
      photoUrl: input.photoUrl,
      metadata: asJson({
        ...input.metadata,
        signal,
      }),
    },
  });

  await awardPassport(userId, "Food", 15, "meal-log", { mealId: entry.id });
  return entry;
}

export async function logHydration(userId: string, cups: number, goal = 8) {
  await patchWellnessState(userId, { checkIn: { water: cups } });
  return prisma.hydrationLog.create({
    data: { userId, cups, goal },
  });
}

export async function logMovement(
  userId: string,
  input: {
    type: string;
    workoutId?: string;
    title?: string;
    durationSeconds?: number;
    minutes?: number;
    cycles?: number;
    points?: number;
    metadata?: Record<string, unknown>;
  },
) {
  const entry = await prisma.movementSession.create({
    data: {
      userId,
      type: input.type,
      workoutId: input.workoutId,
      title: input.title,
      durationSeconds: input.durationSeconds,
      minutes: input.minutes,
      cycles: input.cycles,
      points: input.points || 0,
      metadata: asJson(input.metadata),
    },
  });

  if (input.points && input.points > 0) {
    await awardPassport(userId, "Move", input.points, "movement-session", {
      movementId: entry.id,
      type: input.type,
    });
  }

  return entry;
}

export async function logCircleCheckIn(
  userId: string,
  input: {
    circleId: string;
    mood?: string;
    stressRelief?: number;
    note?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const entry = await prisma.circleCheckIn.create({
    data: {
      userId,
      circleId: input.circleId,
      mood: input.mood,
      stressRelief: input.stressRelief,
      note: input.note,
      metadata: asJson(input.metadata),
    },
  });

  await awardPassport(userId, "Community", 15, "circle-check-in", {
    circleId: input.circleId,
    checkInId: entry.id,
  });

  return entry;
}

export async function logCircleChallenge(
  userId: string,
  input: {
    circleId: string;
    challengeId: string;
    points?: number;
    metadata?: Record<string, unknown>;
  },
) {
  const entry = await prisma.circleChallengeLog.create({
    data: {
      userId,
      circleId: input.circleId,
      challengeId: input.challengeId,
      points: input.points || 0,
      metadata: asJson(input.metadata),
    },
  });

  if (input.points && input.points > 0) {
    await awardPassport(userId, "Community", input.points, "circle-challenge", {
      circleId: input.circleId,
      challengeId: input.challengeId,
      challengeLogId: entry.id,
    });
  }

  return entry;
}

function toChatMessage(message: { role: string; text: string }): ChatMessage {
  return {
    role: message.role === "user" ? "user" : "assistant",
    text: message.text,
  };
}

function toMealLogEntry(meal: {
  id: string;
  slot: string | null;
  text: string;
  risk: string | null;
  score: number | null;
  photoUrl: string | null;
  createdAt: Date;
}): MealLogEntry {
  return {
    id: meal.id,
    slot: meal.slot,
    text: meal.text,
    risk: meal.risk,
    score: meal.score,
    photoUrl: meal.photoUrl,
    createdAt: meal.createdAt.toISOString(),
  };
}

function toBookingEntry(booking: {
  id: string;
  providerId: string;
  providerName: string | null;
  bookingRef: string;
  bookingDate: Date;
  slot: string;
  paymentMethod: string | null;
  status: string;
  createdAt: Date;
}): BookingEntry {
  return {
    id: booking.id,
    providerId: booking.providerId,
    providerName: booking.providerName,
    bookingRef: booking.bookingRef,
    bookingDate: booking.bookingDate.toISOString(),
    slot: booking.slot,
    paymentMethod: booking.paymentMethod,
    status: booking.status,
    createdAt: booking.createdAt.toISOString(),
  };
}

function makeBookingRef() {
  return `TL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}
