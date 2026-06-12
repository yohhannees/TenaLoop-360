import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { ApiError } from "@/lib/server/http";
import { hashValue, makeSessionToken } from "@/lib/server/security";

const DEFAULT_SESSION_DAYS = 30;

export function sessionCookieName() {
  return process.env.AUTH_COOKIE_NAME || "tenaloop_session";
}

function sessionDurationMs() {
  const days = Number(process.env.AUTH_SESSION_DAYS || DEFAULT_SESSION_DAYS);
  return Math.max(1, days) * 24 * 60 * 60 * 1000;
}

export function codeExpiryDate() {
  const minutes = Number(process.env.AUTH_CODE_MINUTES || 10);
  return new Date(Date.now() + Math.max(1, minutes) * 60 * 1000);
}

function hashSessionToken(token: string) {
  return hashValue(`session:${token}`);
}

export async function createSession(userId: string) {
  const token = makeSessionToken();
  const expiresAt = new Date(Date.now() + sessionDurationMs());

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  response.cookies.set(sessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  await prisma.session
    .update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    })
    .catch(() => {});

  return session.user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) throw new ApiError("Authentication required.", 401);
  return user;
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName())?.value;
  if (!token) return;

  await prisma.session
    .deleteMany({ where: { tokenHash: hashSessionToken(token) } })
    .catch(() => {});
}

export function publicUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organization: string | null;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organization: user.organization,
  };
}
