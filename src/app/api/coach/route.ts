import { NextResponse } from "next/server";
import { ChatMessage, CheckIn } from "@/lib/types";
import { calculateScore, coachReply } from "@/lib/score";
import {
  DEFAULT_GEMINI_MODEL,
  DEFAULT_OPENAI_MODEL,
  buildGeminiTenaBotRequestInput,
  buildTenaBotRequestInput,
  extractGeminiResponseText,
  extractResponseText,
  modelSupportsReasoning,
} from "@/lib/tenabot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const GEMINI_GENERATE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

type CoachRequestBody = {
  message?: unknown;
  messages?: unknown;
  checkIn?: unknown;
  score?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CoachRequestBody;
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const checkIn = isCheckIn(body.checkIn) ? body.checkIn : undefined;
    const score =
      typeof body.score === "number"
        ? body.score
        : checkIn
          ? calculateScore(checkIn)
          : undefined;
    const messages = normalizeMessages(body.messages, message);
    const fallbackReply = buildFallbackReply(message, checkIn, score);
    const provider = getProvider();

    if (provider === "gemini") {
      return handleGeminiRequest({
        message,
        messages,
        checkIn,
        score,
        fallbackReply,
      });
    }

    return handleOpenAIRequest({
      message,
      messages,
      checkIn,
      score,
      fallbackReply,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleGeminiRequest({
  message,
  messages,
  checkIn,
  score,
  fallbackReply,
}: {
  message: string;
  messages: ChatMessage[];
  checkIn?: CheckIn;
  score?: number;
  fallbackReply: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply: `${fallbackReply}\n\nOffline note: add GEMINI_API_KEY on the server to enable live Gemini replies.`,
      source: "fallback",
      missingKey: true,
    });
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const payload = buildGeminiTenaBotRequestInput({
    message,
    messages,
    checkIn,
    score,
  });

  const response = await fetch(
    `${GEMINI_GENERATE_URL}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const messageFromApi = getGeminiErrorMessage(data);
    return NextResponse.json(
      {
        reply: `${fallbackReply}\n\nGemini note: ${getUserFacingGeminiError(messageFromApi)}`,
        source: "fallback",
        error: messageFromApi,
      },
      { status: 200 },
    );
  }

  const reply = extractGeminiResponseText(data);
  if (!reply) {
    return NextResponse.json({
      reply: `${fallbackReply}\n\nGemini note: the response did not include text, so TenaBot used the local safety fallback.`,
      source: "fallback",
    });
  }

  return NextResponse.json({ reply, source: "gemini", model });
}

async function handleOpenAIRequest({
  message,
  messages,
  checkIn,
  score,
  fallbackReply,
}: {
  message: string;
  messages: ChatMessage[];
  checkIn?: CheckIn;
  score?: number;
  fallbackReply: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reply: `${fallbackReply}\n\nOffline note: add OPENAI_API_KEY on the server to enable live OpenAI replies.`,
      source: "fallback",
      missingKey: true,
    });
  }

  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  const { instructions, input } = buildTenaBotRequestInput({
    message,
    messages,
    checkIn,
    score,
  });

  const payload: Record<string, unknown> = {
    model,
    instructions,
    input,
    max_output_tokens: 700,
    store: false,
  };

  if (modelSupportsReasoning(model)) {
    payload.reasoning = { effort: "low" };
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const messageFromApi = getOpenAIErrorMessage(data);
    const userFacingMessage = getUserFacingOpenAIError(messageFromApi);
    return NextResponse.json(
      {
        reply: `${fallbackReply}\n\nOpenAI note: ${userFacingMessage}`,
        source: "fallback",
        error: messageFromApi,
      },
      { status: 200 },
    );
  }

  const reply = extractResponseText(data);
  if (!reply) {
    return NextResponse.json({
      reply: `${fallbackReply}\n\nOpenAI note: the response did not include text, so TenaBot used the local safety fallback.`,
      source: "fallback",
    });
  }

  return NextResponse.json({ reply, source: "openai", model });
}

function getProvider() {
  const provider = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (provider === "gemini" || provider === "openai") return provider;
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) return "gemini";
  return "openai";
}

function normalizeMessages(rawMessages: unknown, message: string): ChatMessage[] {
  const messages: ChatMessage[] = Array.isArray(rawMessages)
    ? rawMessages
        .filter(isChatMessage)
        .map((msg) => ({ role: msg.role, text: msg.text.trim() }))
        .filter((msg) => msg.text.length > 0)
        .slice(-10)
    : [];

  if (messages.length === 0 || messages[messages.length - 1].text !== message) {
    const userMessage: ChatMessage = { role: "user", text: message };
    return [...messages, userMessage].slice(-10);
  }

  return messages;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const msg = value as Partial<ChatMessage>;
  return (
    (msg.role === "assistant" || msg.role === "user") &&
    typeof msg.text === "string"
  );
}

function isCheckIn(value: unknown): value is CheckIn {
  if (!value || typeof value !== "object") return false;
  const checkIn = value as Partial<CheckIn>;

  return (
    typeof checkIn.mood === "string" &&
    typeof checkIn.stress === "number" &&
    typeof checkIn.sleep === "number" &&
    typeof checkIn.energy === "number" &&
    typeof checkIn.movement === "number" &&
    typeof checkIn.water === "number" &&
    typeof checkIn.meal === "string" &&
    typeof checkIn.support === "string" &&
    Array.isArray(checkIn.painAreas)
  );
}

function buildFallbackReply(message: string, checkIn?: CheckIn, score?: number) {
  if (checkIn && typeof score === "number") {
    return coachReply(message, checkIn, score);
  }

  return [
    "I can help with a TenaLoop reset, but I do not have your check-in context yet.",
    "",
    "Start simple:",
    "1. Do a 3-minute Efoy breathing reset.",
    "2. Drink water before your next coffee or meal.",
    "3. Take a 10-minute walk if your body feels safe.",
    "4. If symptoms feel severe, unusual, or unsafe, contact a trusted person or licensed provider.",
  ].join("\n");
}

function getOpenAIErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") return "OpenAI request failed.";
  const error = (data as { error?: { message?: unknown } }).error;
  return typeof error?.message === "string"
    ? error.message
    : "OpenAI request failed.";
}

function getGeminiErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") return "Gemini request failed.";
  const error = (data as { error?: { message?: unknown } }).error;
  return typeof error?.message === "string"
    ? error.message
    : "Gemini request failed.";
}

function getUserFacingOpenAIError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("quota") || lower.includes("billing")) {
    return "API billing has no available credits or the monthly spend limit is blocking requests. Add API credits or raise the project/org spend limit, then retry TenaBot.";
  }

  if (lower.includes("model") && lower.includes("does not exist")) {
    return `The configured model is not available. Set OPENAI_MODEL=${DEFAULT_OPENAI_MODEL} in .env.local and restart the dev server.`;
  }

  return message;
}

function getUserFacingGeminiError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("api key") || lower.includes("permission") || lower.includes("denied")) {
    return "Gemini could not use the configured API key. Check that GEMINI_API_KEY is valid in .env.local and that the key's project has Gemini API access.";
  }

  if (lower.includes("quota") || lower.includes("rate") || lower.includes("resource exhausted")) {
    return "Gemini free-tier quota or rate limit was reached. Wait for the limit to reset, lower traffic, or enable billing in Google AI Studio.";
  }

  if (lower.includes("model") && lower.includes("not found")) {
    return `The configured Gemini model is not available. Set GEMINI_MODEL=${DEFAULT_GEMINI_MODEL} in .env.local and restart the dev server.`;
  }

  return message;
}
