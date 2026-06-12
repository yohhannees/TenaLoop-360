import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";

function authSecret() {
  return process.env.AUTH_SECRET || "tenaloop-dev-secret-change-me";
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function makeLoginCode() {
  return String(randomInt(100000, 1_000_000));
}

export function makeSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashValue(value: string) {
  return createHmac("sha256", authSecret()).update(value).digest("hex");
}

export function hashLoginCode(email: string, code: string) {
  return hashValue(`login-code:${normalizeEmail(email)}:${code.trim()}`);
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
