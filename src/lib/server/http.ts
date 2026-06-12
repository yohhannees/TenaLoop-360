import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function jsonError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const message =
    error instanceof Error ? error.message : "Unexpected server error.";

  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJson<T extends Record<string, unknown>>(request: Request) {
  const body = (await request.json().catch(() => null)) as T | null;
  if (!body || typeof body !== "object") {
    throw new ApiError("Request body must be JSON.", 400);
  }
  return body;
}

export function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}
