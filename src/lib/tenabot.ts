import { ChatMessage, CheckIn } from "./types";
import { getFoodSignal } from "./foods";
import {
  buildRootedPath,
  getBodySignal,
  getPatternSignal,
  getRootedProviderMatches,
  getTenaScoreBreakdown,
} from "./rooted-body";
import { getScoreLabel } from "./score";

export const DEFAULT_OPENAI_MODEL = "gpt-5-mini";
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export const TENABOT_INSTRUCTIONS = [
  "You are TenaBot, the AI wellness coach inside TenaLoop 360.",
  "TenaLoop is a body-aware wellness app for Addis Ababa users. It connects daily check-ins, TenaScore, Rooted Body Intelligence, Efoy breathing, TenaPlate food swaps, TenaMove, TenaCircle peer groups, and TenaMarket providers.",
  "Give practical, culturally relevant support using Ethiopian food examples, gentle movement, sleep recovery, stress regulation, community support, and provider referrals when appropriate.",
  "Do not diagnose, prescribe medication, or replace a licensed clinician. If red flags, severe/unusual symptoms, pregnancy/postpartum concerns, chest pain, weakness, numbness, or danger language appear, prioritize real-world help and licensed care.",
  "If the user mentions self-harm or immediate danger, respond warmly, tell them to contact emergency/local crisis support or a trusted person now, and keep the next step very simple.",
  "Keep replies grounded in the supplied TenaLoop context. Recommend app actions naturally: save/book in TenaMarket, join/open a TenaCircle, complete an Efoy reset, log a meal, or do a gentle move break.",
  "Use a calm, direct tone. Keep most answers under 220 words. Prefer 3 to 5 numbered steps when a plan is useful.",
].join("\n");

type TenaBotRequestInput = {
  message: string;
  messages: ChatMessage[];
  checkIn?: CheckIn;
  score?: number;
};

export function buildTenaBotRequestInput({
  message,
  messages,
  checkIn,
  score,
}: TenaBotRequestInput) {
  const chatHistory =
    messages.length > 0 ? messages.slice(-10) : [{ role: "user" as const, text: message }];

  return {
    instructions: `${TENABOT_INSTRUCTIONS}\n\nCurrent app context:\n${buildContextSnapshot(
      checkIn,
      score,
    )}`,
    input: chatHistory.map((msg) => ({
      role: msg.role,
      content: msg.text,
    })),
  };
}

export function buildGeminiTenaBotRequestInput(input: TenaBotRequestInput) {
  const request = buildTenaBotRequestInput(input);

  return {
    systemInstruction: {
      parts: [{ text: request.instructions }],
    },
    contents: request.input.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      maxOutputTokens: 700,
      temperature: 0.65,
    },
  };
}

export function extractResponseText(data: unknown): string {
  if (!data || typeof data !== "object") return "";

  const outputText = (data as { output_text?: unknown }).output_text;
  if (typeof outputText === "string" && outputText.trim()) return outputText.trim();

  const output = (data as { output?: unknown }).output;
  const textParts = collectOutputText(output);
  return textParts.join("\n").trim();
}

export function extractGeminiResponseText(data: unknown): string {
  if (!data || typeof data !== "object") return "";

  const candidates = (data as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates)) return "";

  return candidates
    .flatMap((candidate) => {
      if (!candidate || typeof candidate !== "object") return [];
      const content = (candidate as { content?: unknown }).content;
      if (!content || typeof content !== "object") return [];
      const parts = (content as { parts?: unknown }).parts;
      if (!Array.isArray(parts)) return [];

      return parts
        .map((part) =>
          part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string"
            ? (part as { text: string }).text
            : "",
        )
        .filter(Boolean);
    })
    .join("\n")
    .trim();
}

export function modelSupportsReasoning(model: string): boolean {
  return /^gpt-5/i.test(model) || /^o\d/i.test(model);
}

function buildContextSnapshot(checkIn?: CheckIn, score?: number): string {
  if (!checkIn) {
    return JSON.stringify({
      note: "No check-in was supplied. Ask one short clarifying question if needed, then offer a safe starter wellness loop.",
    });
  }

  const currentScore = typeof score === "number" ? score : getTenaScoreBreakdown(checkIn).overall;
  const foodSignal = getFoodSignal(checkIn.meal);
  const path = buildRootedPath(checkIn, currentScore).map((item) => ({
    step: item.step,
    title: item.title,
    detail: item.detail,
    stamp: item.stamp,
  }));
  const providerMatches = getRootedProviderMatches(checkIn).map((match) => ({
    id: match.id,
    title: match.title,
    type: match.type,
    area: match.area,
    reason: match.reason,
    nextAction: match.stamp === "Community" ? "Join or open this TenaCircle" : "Save or book this provider in TenaMarket",
  }));

  return JSON.stringify(
    {
      score: currentScore,
      zone: getScoreLabel(currentScore),
      checkIn: {
        mood: checkIn.mood,
        stress: checkIn.stress,
        sleep: checkIn.sleep,
        energy: checkIn.energy,
        movement: checkIn.movement,
        water: checkIn.water,
        meal: checkIn.meal,
        support: checkIn.support,
        fasting: checkIn.fasting,
        painAreas: checkIn.painAreas,
        painIsNew: checkIn.painIsNew,
        painTrigger: checkIn.painTrigger,
        redFlags: checkIn.redFlags,
        womenWellness: checkIn.womenWellness,
        cycleContext: checkIn.cycleContext,
        privacyMode: checkIn.privacyMode,
        screenHours: checkIn.screenHours,
        coffeeCups: checkIn.coffeeCups,
        sugarServings: checkIn.sugarServings,
        familyStress: checkIn.familyStress,
        communitySupport: checkIn.communitySupport,
        preferredLanguage: checkIn.preferredLanguage,
        bpFocus: checkIn.bpFocus,
        glucoseFocus: checkIn.glucoseFocus,
      },
      signals: {
        body: getBodySignal(checkIn),
        pattern: getPatternSignal(checkIn),
        food: foodSignal,
      },
      suggestedPath: path,
      providerMatches,
    },
    null,
    2,
  );
}

function collectOutputText(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(collectOutputText);
  if (typeof value !== "object") return [];

  const item = value as { type?: unknown; text?: unknown; content?: unknown };
  const parts: string[] = [];

  if (item.type === "output_text" && typeof item.text === "string") {
    parts.push(item.text);
  }

  if (Array.isArray(item.content)) {
    parts.push(...collectOutputText(item.content));
  }

  return parts;
}
