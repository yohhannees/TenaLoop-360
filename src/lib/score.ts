import { CheckIn, PlanItem } from "./types";
import { clamp } from "./utils";
import { getFoodSignal } from "./foods";

const MOOD_SCORES: Record<string, number> = { Heavy: 42, Steady: 70, Bright: 90 };
const SUPPORT_SCORES: Record<string, number> = { Low: 44, Some: 68, Strong: 88 };

export function calculateScore(checkIn: CheckIn): number {
  const food = getFoodSignal(checkIn.meal);
  const riskPenalty =
    (checkIn.bpFocus && food.risk === "High" ? 5 : 0) +
    (checkIn.glucoseFocus && food.risk !== "Low" ? 4 : 0);

  return clamp(
    Math.round(
      (100 - checkIn.stress * 10) * 0.22 +
        clamp((checkIn.sleep / 8) * 100) * 0.17 +
        checkIn.energy * 10 * 0.14 +
        clamp((checkIn.movement / 30) * 100) * 0.14 +
        food.score * 0.17 +
        clamp((checkIn.water / 8) * 100) * 0.08 +
        (MOOD_SCORES[checkIn.mood] ?? 70) * 0.04 +
        (SUPPORT_SCORES[checkIn.support] ?? 68) * 0.04 -
        riskPenalty,
    ),
  );
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Stable";
  if (score >= 50) return "Watch";
  return "Reset";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#11845b";
  if (score >= 65) return "#1d84a6";
  if (score >= 50) return "#c47a16";
  return "#c44949";
}

export function buildPlan(checkIn: CheckIn, score: number): PlanItem[] {
  const food = getFoodSignal(checkIn.meal);
  const plan: PlanItem[] = [];

  plan.push(
    checkIn.stress >= 7
      ? { title: "Mind reset", detail: "Do a 3-minute box-breathing reset before the next task.", stamp: "Mind" }
      : { title: "Mind maintain", detail: "Protect one quiet 10-minute block before the afternoon push.", stamp: "Mind" },
  );

  if (checkIn.sleep < 6) {
    plan.push({ title: "Sleep repair", detail: "Cut late coffee, set a 20-minute wind-down, and keep the room cool.", stamp: "Health" });
  }

  if (checkIn.movement < 20) {
    plan.push({ title: "Move break", detail: "Walk 15 minutes after lunch or join the Meskel Walk Club.", stamp: "Move" });
  }

  plan.push({ title: food.risk === "High" ? "Food swap" : "Food balance", detail: food.swap, stamp: "Food" });

  if (checkIn.support !== "Strong" || score < 65) {
    plan.push({ title: "Support loop", detail: "Join a moderated peer circle tonight and post one anonymous mood check.", stamp: "Community" });
  }

  return plan.slice(0, 5);
}

export function coachReply(input: string, checkIn: CheckIn, score: number): string {
  const text = input.toLowerCase();
  const food = getFoodSignal(checkIn.meal);

  const isStressed = text.includes("stress") || text.includes("anxious") || text.includes("pressure") || checkIn.stress >= 7;
  const isTired = text.includes("tired") || text.includes("exhausted") || text.includes("fatigue") || checkIn.energy <= 4;
  const isLowSleep = text.includes("sleep") || text.includes("4 hour") || text.includes("4hours") || checkIn.sleep < 5;
  const isHeavyMeal = text.includes("firfir") || text.includes("coffee") || text.includes("sambusa") || text.includes("pasta") || food.risk === "High";
  const isBurnout = (isStressed && isLowSleep) || (isStressed && isTired);
  const isStudentContext = text.includes("alx") || text.includes("student") || text.includes("exam") || text.includes("study");

  if (isBurnout && isHeavyMeal) {
    const circleRef = isStudentContext ? "ALX stress circle" : "young professionals burnout circle";
    return `Your TenaScore is ${score}. You may be entering a burnout pattern — high stress, short sleep, and a heavy meal are all hitting at once. Here is your recovery loop: do a 3-minute breathing reset right now, avoid extra sugar in your next coffee, choose shiro with one injera and salad for lunch, walk 15 minutes after eating, and join tonight's ${circleRef}. There is also a beginner yoga class near Bole at 6 PM — 20% off with your Wellness Passport.`;
  }

  if (isBurnout) {
    return `Your TenaScore is ${score}. Burnout signals are early but real — stress and sleep are working against you. Start with 3 minutes of slow nasal breathing, take a 15-minute walk after lunch, and reduce stimulants this afternoon. For food, choose shiro or misir with more gomen, one injera, and less sugar in coffee. Tonight, a moderated circle would help close the support gap.`;
  }

  if (isStressed) {
    return `Your TenaScore is ${score}. Stress is the main flag today. Try a 3-minute box-breathing reset — breathe in for 4, hold for 4, out for 4, hold for 4. After lunch, take a 15-minute walk. For food, avoid heavy or oily meals today and choose lighter Ethiopian plates like shiro, gomen, or misir. Consider joining a peer circle this evening.`;
  }

  if (isLowSleep) {
    return `Your TenaScore is ${score}. Short sleep is pulling your score down and increasing burnout risk. Avoid caffeine after 2 PM, take a 10-minute nap if possible, and set a 20-minute wind-down routine tonight. For food, choose lighter meals today — heavy food worsens fatigue. A walk after lunch will help more than another coffee.`;
  }

  if (isHeavyMeal) {
    return `Your TenaScore is ${score}. The meal pattern is the main concern today — ${food.insight} Better next choice: ${food.swap} Drink water before eating, walk 15 minutes after the meal, and consider a lighter plate for your next meal. Your body will recover faster with lighter food when stress or sleep is already low.`;
  }

  if (isTired) {
    return `Your TenaScore is ${score}. Low energy today. Start with a 5-minute movement break — shoulder rolls, light squats, and nasal breathing. For food, choose high-fiber, lighter plates and avoid sugar spikes. A 15-minute walk after lunch is more effective than a second coffee for sustained energy.`;
  }

  const label = getScoreLabel(score).toLowerCase();
  return `Your TenaScore is ${score}, a ${label} zone. Keep going. Your plan today: protect one quiet focus block, choose a balanced Ethiopian meal, drink eight cups of water, and complete your movement goal. If you want to push your score higher, log tonight's sleep and join a peer circle.`;
}

export function getPatternInsights(history: number[]): string[] {
  const insights: string[] = [];
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const trend = history[history.length - 1] - history[0];

  if (trend > 8) insights.push(`Your TenaScore improved by ${trend} points over the past week. Keep the momentum.`);
  else if (trend < -5) insights.push("Your score has been declining. Review sleep and meal patterns from the past three days.");
  else insights.push("Your score has been stable. Small habit improvements will compound quickly from here.");

  if (avg < 60) insights.push("Average score below 60 — stress and sleep are likely the main drag. Prioritize a consistent wind-down routine.");
  else if (avg >= 70) insights.push("Strong average score. Focus on maintaining food balance and movement consistency.");

  insights.push("Scores tend to be highest on days with seven-plus hours of sleep and a low-risk meal.");

  return insights;
}
