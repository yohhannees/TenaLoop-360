import { BodyArea, CheckIn, PlanItem, Stamp } from "./types";
import { getFoodSignal } from "./foods";
import { clamp } from "./utils";

export const bodyAreas: BodyArea[] = [
  "Neck",
  "Shoulders",
  "Lower back",
  "Head",
  "Stomach",
  "Chest",
  "Hips",
  "Knees",
  "Wrists/hands",
];

const MOOD_SCORES: Record<string, number> = { Heavy: 42, Steady: 70, Bright: 90 };
const SUPPORT_SCORES: Record<string, number> = { Low: 44, Some: 68, Strong: 88 };

export type TenaScoreBreakdown = {
  mind: number;
  body: number;
  food: number;
  movement: number;
  support: number;
  women: number;
  overall: number;
};

export type RootedPathItem = PlanItem & {
  step: "Breathe" | "Move" | "Nourish" | "Reflect" | "Connect" | "Refer";
};

export type RootedProviderMatch = {
  id: string;
  title: string;
  type: string;
  area: string;
  reason: string;
  stamp: Stamp;
};

export function getTenaScoreBreakdown(checkIn: CheckIn): TenaScoreBreakdown {
  const foodSignal = getFoodSignal(checkIn.meal);
  const painAreas = checkIn.painAreas ?? [];
  const screenHours = checkIn.screenHours ?? 0;
  const coffeeCups = checkIn.coffeeCups ?? 0;
  const sugarServings = checkIn.sugarServings ?? 0;
  const cycleContext = checkIn.cycleContext ?? "None";
  const womenWellness = checkIn.womenWellness ?? false;
  const privacyMode = checkIn.privacyMode ?? false;
  const familyStress = checkIn.familyStress ?? false;
  const communitySupport = checkIn.communitySupport ?? false;
  const painLoad = painAreas.length * 8;
  const redFlagPenalty = checkIn.redFlags ? 26 : 0;
  const newPainPenalty = checkIn.painIsNew ? 8 : 0;
  const screenPenalty = screenHours >= 8 ? 8 : screenHours >= 6 ? 4 : 0;
  const cyclePenalty =
    womenWellness && cycleContext !== "None"
      ? cycleContext === "Pregnant" || cycleContext === "Postpartum"
        ? 8
        : 5
      : 0;

  const mind = clamp(
      (100 - checkIn.stress * 10) * 0.48 +
      (MOOD_SCORES[checkIn.mood] ?? 70) * 0.24 +
      checkIn.energy * 10 * 0.2 -
      (familyStress ? 6 : 0) -
      cyclePenalty,
  );

  const body = clamp(
    82 -
      painLoad -
      redFlagPenalty -
      newPainPenalty -
      screenPenalty +
      clamp((checkIn.sleep / 8) * 100) * 0.1 +
      clamp((checkIn.movement / 30) * 100) * 0.08,
  );

  const food = clamp(
    foodSignal.score -
      coffeeCups * 3 -
      sugarServings * 4 -
      (checkIn.fasting ? 2 : 0),
  );

  const movement = clamp(
    clamp((checkIn.movement / 30) * 100) -
      (screenHours >= 8 ? 10 : 0) -
      (painAreas.includes("Lower back") ? 5 : 0),
  );

  const support = clamp(
    (SUPPORT_SCORES[checkIn.support] ?? 68) +
      (communitySupport ? 10 : 0) -
      (privacyMode ? 3 : 0) -
      (familyStress ? 5 : 0),
  );

  const women = womenWellness
    ? clamp(
        78 -
          cyclePenalty -
          (checkIn.energy <= 4 ? 5 : 0) -
          (checkIn.redFlags ? 30 : 0) +
          (privacyMode ? 4 : 0),
      )
    : 84;

  const riskPenalty =
    (checkIn.bpFocus && foodSignal.risk === "High" ? 2 : 0) +
    (checkIn.glucoseFocus && foodSignal.risk !== "Low" ? 2 : 0);

  const overall = clamp(
    Math.round(
      10 +
        mind * 0.24 +
        body * 0.21 +
        food * 0.16 +
        movement * 0.14 +
        support * 0.11 +
        women * 0.08 +
        clamp((checkIn.water / 8) * 100) * 0.06 -
        riskPenalty,
    ),
  );

  return {
    mind: Math.round(mind),
    body: Math.round(body),
    food: Math.round(food),
    movement: Math.round(movement),
    support: Math.round(support),
    women: Math.round(women),
    overall,
  };
}

export function getBodySignal(checkIn: CheckIn): string {
  const painAreas = checkIn.painAreas ?? [];

  if (checkIn.redFlags) return "Warning signs reported";
  if (painAreas.length === 0) return "No pain area selected";

  const selected = painAreas.join(" + ");
  return `${selected} tension detected`;
}

export function getPatternSignal(checkIn: CheckIn): string {
  const painAreas = checkIn.painAreas ?? [];
  const screenHours = checkIn.screenHours ?? 0;
  const cycleContext = checkIn.cycleContext ?? "None";
  const womenWellness = checkIn.womenWellness ?? false;
  const neckShoulder =
    painAreas.includes("Neck") || painAreas.includes("Shoulders");
  const lowRecovery = checkIn.sleep < 6 || checkIn.energy <= 4;

  if (checkIn.redFlags) {
    return "Red flags override self-care. Refer to a licensed professional before continuing intense movement.";
  }

  if (neckShoulder && checkIn.stress >= 7 && lowRecovery && screenHours >= 7) {
    return "Stress + poor sleep + long sitting = repeated neck/shoulder tension.";
  }

  if (womenWellness && cycleContext !== "None" && lowRecovery) {
    return "Cycle context + low recovery = gentle routine, iron-friendly meals, and private support.";
  }

  if (painAreas.includes("Lower back") && screenHours >= 7) {
    return "Long sitting + low movement = lower-back load. Use posture breaks before adding intensity.";
  }

  if (checkIn.stress >= 7 && checkIn.support !== "Strong") {
    return "High stress + low support = nervous-system reset plus human connection.";
  }

  return "Today is best handled with a simple loop: breathe, move lightly, eat steadily, and connect.";
}

export function buildRootedPath(checkIn: CheckIn, score: number): RootedPathItem[] {
  const food = getFoodSignal(checkIn.meal);
  const painAreas = checkIn.painAreas ?? [];
  const cycleContext = checkIn.cycleContext ?? "None";
  const womenWellness = checkIn.womenWellness ?? false;
  const privacyMode = checkIn.privacyMode ?? false;
  const hasNeckShoulder =
    painAreas.includes("Neck") || painAreas.includes("Shoulders");
  const gentleMode =
    womenWellness &&
    (cycleContext === "Period near" ||
      cycleContext === "On period" ||
      cycleContext === "Pregnant" ||
      cycleContext === "Postpartum");

  return [
    {
      step: "Breathe",
      title: "Efoy breathing reset",
      detail:
        checkIn.stress >= 7
          ? "Start with 3 minutes: inhale, relax your shoulders, slow exhale, then say Efoy."
          : "Keep one 3-minute breathing pause before your next demanding task.",
      stamp: "Mind",
    },
    {
      step: "Move",
      title: hasNeckShoulder ? "Spine-safe neck and shoulder release" : "Gentle mobility block",
      detail: hasNeckShoulder
        ? "Use shoulder rolls, chin tucks, and two walking breaks. Skip deep twisting today."
        : "Use easy joint circles and a 10-minute walk after lunch.",
      stamp: "Move",
    },
    {
      step: "Nourish",
      title: gentleMode ? "Gentle, iron-friendly local plate" : "Steady Ethiopian plate",
      detail: gentleMode
        ? "Choose shiro or misir with gomen or salad, keep injera moderate, and reduce sugar in coffee."
        : food.risk === "High"
          ? food.swap
          : "Keep the plate balanced with lentils, greens, water, and a short walk after eating.",
      stamp: "Food",
    },
    {
      step: "Reflect",
      title: "Rooted reflection",
      detail: "Journal prompt: Where did I feel pressure in my body before I noticed it in my mind?",
      stamp: "Mind",
    },
    {
      step: "Connect",
      title:
        womenWellness && privacyMode
          ? "Private support circle"
          : score < 65
            ? "Peer support loop"
            : "Community support",
      detail:
        womenWellness && privacyMode
          ? "Join a private women's stress circle or ask for one trusted check-in today."
          : "Join tonight's ALX burnout circle or a gentle walking group.",
      stamp: "Community",
    },
    {
      step: "Refer",
      title: checkIn.redFlags ? "Licensed care now" : "Provider path",
      detail: checkIn.redFlags
        ? "Because warning signs were selected, skip self-treatment and contact a licensed provider promptly."
        : "If pain continues for more than a few days, includes numbness or weakness, or symptoms feel unusual, book a licensed provider.",
      stamp: "Experience",
    },
  ];
}

export function getRootedProviderMatches(checkIn: CheckIn): RootedProviderMatch[] {
  const matches: RootedProviderMatch[] = [];
  const painAreas = checkIn.painAreas ?? [];
  const hasPain = painAreas.length > 0;
  const neckShoulder =
    painAreas.includes("Neck") || painAreas.includes("Shoulders");

  if (checkIn.stress >= 7) {
    matches.push({
      id: "tulsi-ayurveda-yoga",
      title: "Tulsi Ayurveda, Yoga and Wellness Center",
      type: "Yoga, Ayurveda, massage and wellness",
      area: "Addis Ababa",
      reason: "Best match for high stress, low sleep, and a gentle nervous-system reset.",
      stamp: "Experience",
    });
  }

  if (hasPain || neckShoulder) {
    matches.push({
      id: "signature-wellness-bole",
      title: "Signature Wellness",
      type: "Fitness, Pilates, yoga and recovery",
      area: "Bole",
      reason: "Good fit for neck, shoulder, back, wrist, or long-sitting movement patterns.",
      stamp: "Health",
    });
  }

  if (checkIn.womenWellness ?? false) {
    matches.push({
      id: "american-medical-center-checkup",
      title: "American Medical Center",
      type: "Health check-up and specialist appointment",
      area: "Addis Ababa",
      reason: "Useful when wellness questions should be routed to licensed medical support.",
      stamp: "Health",
    });
  }

  matches.push({
    id: "radisson-rainforest-spa",
    title: "Rainforest Day Spa at Radisson Blu",
    type: "Spa, massage, salon and fitness center",
    area: "Kazanchis",
    reason: "Helps turn body signals into a practical recovery appointment.",
    stamp: "Experience",
  });

  matches.push({
    id: "student-stress",
    title: "Peer support circle",
    type: "ALX burnout circle",
    area: "Community",
    reason: "Useful when stress is high or support feels low.",
    stamp: "Community",
  });

  return matches.slice(0, 5);
}
