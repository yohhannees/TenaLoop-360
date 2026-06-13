import { CheckIn, PlanItem } from "./types";
import { getFoodSignal } from "./foods";
import { getBodySignal, getPatternSignal, getTenaScoreBreakdown } from "./rooted-body";

export function calculateScore(checkIn: CheckIn): number {
  return getTenaScoreBreakdown(checkIn).overall;
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Stable";
  if (score >= 50) return "Watch";
  return "Reset";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#0A2318";
  if (score >= 65) return "#8C6246";
  if (score >= 50) return "#D4C1A0";
  return "#724F38";
}

export function buildPlan(checkIn: CheckIn, score: number): PlanItem[] {
  const food = getFoodSignal(checkIn.meal);
  const plan: PlanItem[] = [];
  const bodySignal = getBodySignal(checkIn);
  const painAreas = checkIn.painAreas ?? [];
  const womenWellness = checkIn.womenWellness ?? false;
  const cycleContext = checkIn.cycleContext ?? "None";

  plan.push(
    checkIn.stress >= 7
      ? { title: "Efoy reset", detail: "Do a 3-minute Efoy breathing reset before the next task.", stamp: "Mind" }
      : { title: "Mind maintain", detail: "Protect one quiet 10-minute block before the afternoon push.", stamp: "Mind" },
  );

  if (painAreas.length > 0) {
    plan.push({
      title: "Body map",
      detail: `${bodySignal}. Use gentle mobility and avoid deep twisting if pain is active.`,
      stamp: "Move",
    });
  }

  if (womenWellness && cycleContext !== "None") {
    plan.push({
      title: "Cycle-aware mode",
      detail:
        cycleContext === "Pregnant" || cycleContext === "Postpartum"
          ? "Keep guidance gentle and refer to a licensed professional for severe or unusual symptoms."
          : "Keep today's routine gentle, reduce sugar in coffee, and choose iron-friendly local foods.",
      stamp: "Health",
    });
  }

  if (checkIn.redFlags) {
    plan.push({
      title: "Refer for care",
      detail: "Warning signs are selected. This is a provider referral moment, not a self-treatment moment.",
      stamp: "Health",
    });
  }

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
  const bodySignal = getBodySignal(checkIn);
  const patternSignal = getPatternSignal(checkIn);

  const asksForPlan = text.includes("plan") || text.includes("reset") || text.includes("what should i do") || text.includes("help me");
  const asksForSupport = text.includes("circle") || text.includes("support") || text.includes("provider") || text.includes("book") || text.includes("therapy") || text.includes("counsel");
  const asksForFood = text.includes("eat") || text.includes("food") || text.includes("meal") || text.includes("injera") || text.includes("coffee") || text.includes("sugar");
  const asksForSleep = text.includes("sleep") || text.includes("night") || text.includes("bed");
  const asksForMovement = text.includes("move") || text.includes("walk") || text.includes("exercise") || text.includes("body");
  const asksForBody =
    text.includes("neck") ||
    text.includes("shoulder") ||
    text.includes("back") ||
    text.includes("pain") ||
    text.includes("posture");
  const asksForCycle =
    text.includes("period") ||
    text.includes("cycle") ||
    text.includes("pregnant") ||
    text.includes("postpartum") ||
    text.includes("cramp");
  const crisisLanguage =
    text.includes("kill myself") ||
    text.includes("suicide") ||
    text.includes("hurt myself") ||
    text.includes("harm myself") ||
    text.includes("can't go on") ||
    text.includes("cannot go on");

  const isStressed = text.includes("stress") || text.includes("anxious") || text.includes("pressure") || checkIn.stress >= 7;
  const isTired = text.includes("tired") || text.includes("exhausted") || text.includes("fatigue") || checkIn.energy <= 4;
  const isLowSleep = text.includes("sleep") || text.includes("4 hour") || text.includes("4hours") || checkIn.sleep < 5;
  const isHeavyMeal = text.includes("firfir") || text.includes("coffee") || text.includes("sambusa") || text.includes("pasta") || food.risk === "High";
  const isBurnout = (isStressed && isLowSleep) || (isStressed && isTired);
  const isStudentContext = text.includes("alx") || text.includes("student") || text.includes("exam") || text.includes("study");
  const circleRef = isStudentContext ? "Student stress circle" : checkIn.support === "Low" ? "Young professionals burnout circle" : "Addis walking group";

  if (crisisLanguage) {
    return [
      "I am really glad you said that out loud. This is bigger than a wellness tip.",
      "",
      "Right now: move away from anything you could use to hurt yourself, contact a trusted person, and use local emergency or crisis support if you might act on these thoughts.",
      "",
      "For the next 2 minutes, stay with one simple action: feet on the floor, one hand on your chest, inhale for 4, exhale for 6. Then message or call one real person. You do not need to handle this alone.",
    ].join("\n");
  }

  if (checkIn.redFlags) {
    return [
      `Your TenaScore is ${score}. ${bodySignal}.`,
      "",
      "Because warning signs were selected, keep this conservative: skip intense self-care and contact a licensed provider promptly.",
      "",
      "TenaLoop detects wellness patterns and routes support. It does not diagnose spine, mental health, or women's health conditions.",
    ].join("\n");
  }

  if (asksForBody) {
    return [
      `Your TenaScore is ${score}. ${bodySignal}.`,
      "",
      `Pattern detected: ${patternSignal}`,
      "",
      "Do this now:",
      "1. Inhale, relax your shoulders, and exhale slowly: Efoy.",
      "2. Do shoulder rolls and gentle chin tucks. Skip deep twisting.",
      "3. Take two walking breaks and change your sitting position.",
      "",
      "If pain continues for more than a few days or includes numbness or weakness, book a spine/posture check.",
    ].join("\n");
  }

  if (asksForCycle && (checkIn.womenWellness ?? false)) {
    return [
      `Your TenaScore is ${score}. Women's wellness mode is on.`,
      "",
      `Pattern detected: ${patternSignal}`,
      "",
      "Today's gentle loop:",
      "1. Three-minute Efoy breathing.",
      "2. Light stretching only; avoid intense twisting.",
      "3. Choose shiro or misir with gomen/salad and moderate injera.",
      "4. Use a private circle or licensed provider if symptoms feel severe or unusual.",
      "",
      "This is general wellness guidance, not medical advice.",
    ].join("\n");
  }

  if (asksForPlan || asksForSleep || asksForMovement || asksForFood || asksForSupport) {
    const plan = buildPlan(checkIn, score);
    const firstSteps = plan
      .slice(0, 3)
      .map((item, index) => `${index + 1}. ${item.title}: ${item.detail}`)
      .join("\n");

    if (asksForSupport) {
      return [
        `Your TenaScore is ${score}. I would add human support today, not just self-care.`,
        "",
        "Support ladder:",
        "1. Now: do one 3-minute breathing reset so your body comes down first.",
        `2. Today: join the ${circleRef} and post one anonymous mood check.`,
        "3. If stress keeps rising or you feel unsafe: contact a trusted person or local urgent support.",
        "",
        `Good provider match: ${checkIn.stress >= 7 ? "guided meditation or counseling support" : food.risk === "High" ? "nutrition coaching" : "a beginner movement class"}.`,
      ].join("\n");
    }

    if (asksForFood) {
      return [
        `Your TenaScore is ${score}. Food is currently ${food.risk.toLowerCase()} risk.`,
        "",
        food.insight,
        "",
        `Next plate: ${food.swap}`,
        "Add water before eating and walk 10-15 minutes after the meal. If BP or glucose is a focus, keep injera portions moderate and reduce sugar in coffee.",
      ].join("\n");
    }

    if (asksForSleep) {
      return [
        `Your TenaScore is ${score}. Sleep is the recovery lever tonight.`,
        "",
        "Tonight's wind-down:",
        "1. No coffee or sweet drinks after mid-afternoon.",
        "2. Ten minutes of dim light and no scrolling.",
        "3. One breathing cycle: inhale 4, hold 4, exhale 6.",
        "4. Put tomorrow's first task on paper so your mind can stop rehearsing it.",
      ].join("\n");
    }

    if (asksForMovement) {
      return [
        `Your TenaScore is ${score}. Movement is a useful lever because you have ${checkIn.movement} logged minutes.`,
        "",
        "Do this now:",
        "1. Shoulder rolls x 10.",
        "2. Slow squats x 10, or march in place for 60 seconds.",
        "3. Walk after your next meal for 10-15 minutes.",
        "",
        "Keep it easy enough that you would repeat it tomorrow.",
      ].join("\n");
    }

    return [
      `Your TenaScore is ${score}. Here is the smallest useful loop for today:`,
      "",
      firstSteps,
      "",
      "Do the first step now. When that is done, log it in the app and close one stamp.",
    ].join("\n");
  }

  if (isBurnout && isHeavyMeal) {
    return `Your TenaScore is ${score}. You may be entering a burnout pattern - high stress, short sleep, and a heavy meal are all hitting at once.\n\nRecovery loop:\n1. Do a 3-minute breathing reset right now.\n2. Avoid extra sugar in your next coffee.\n3. Choose shiro with one injera and salad for lunch.\n4. Walk 15 minutes after eating.\n5. Join tonight's ${circleRef}.\n\nA guided meditation or beginner yoga session would also fit this pattern.`;
  }

  if (isBurnout) {
    return `Your TenaScore is ${score}. Burnout signals are early but real - stress and sleep are working against you.\n\nStart with 3 minutes of slow nasal breathing, take a 15-minute walk after lunch, and reduce stimulants this afternoon. For food, choose shiro or misir with more gomen, one injera, and less sugar in coffee. Tonight, a moderated circle would help close the support gap.`;
  }

  if (isStressed) {
    return `Your TenaScore is ${score}. Stress is the main flag today.\n\nTry a 3-minute box-breathing reset: breathe in for 4, hold for 4, out for 4, hold for 4. After lunch, take a 15-minute walk. For food, avoid heavy or oily meals today and choose lighter Ethiopian plates like shiro, gomen, or misir. Consider joining a peer circle this evening.`;
  }

  if (isLowSleep) {
    return `Your TenaScore is ${score}. Short sleep is pulling your score down and increasing burnout risk.\n\nAvoid caffeine after 2 PM, take a 10-minute nap if possible, and set a 20-minute wind-down routine tonight. For food, choose lighter meals today - heavy food worsens fatigue. A walk after lunch will help more than another coffee.`;
  }

  if (isHeavyMeal) {
    return `Your TenaScore is ${score}. The meal pattern is the main concern today - ${food.insight} Better next choice: ${food.swap} Drink water before eating, walk 15 minutes after the meal, and consider a lighter plate for your next meal. Your body will recover faster with lighter food when stress or sleep is already low.`;
  }

  if (isTired) {
    return `Your TenaScore is ${score}. Low energy today. Start with a 5-minute movement break - shoulder rolls, light squats, and nasal breathing. For food, choose high-fiber, lighter plates and avoid sugar spikes. A 15-minute walk after lunch is more effective than a second coffee for sustained energy.`;
  }

  const label = getScoreLabel(score).toLowerCase();
  return `Your TenaScore is ${score}, a ${label} zone. Keep going. Your plan today: protect one quiet focus block, choose a balanced Ethiopian meal, drink eight cups of water, and complete your movement goal. If you want to push your score higher, log tonight's sleep and join a peer circle.`;
}

export type PatternInsightStats = {
  checkInCount?: number;
  avgStress?: number | null;
  avgSleep?: number | null;
  avgMovement?: number | null;
  highRiskMealCount?: number;
  movementCount?: number;
};

export function getPatternInsights(history: number[], stats: PatternInsightStats = {}): string[] {
  const insights: string[] = [];
  const realScores = history.filter((score) => score > 0);

  if ((stats.checkInCount ?? realScores.length) === 0) {
    return [
      "No saved check-ins yet. Save today's loop to start building a real pattern history.",
      "Your next insight will compare stress, sleep, food, movement, and score changes over the last seven days.",
    ];
  }

  const avg = Math.round(realScores.reduce((a, b) => a + b, 0) / realScores.length);
  const trend = realScores[realScores.length - 1] - realScores[0];

  if (trend > 8) insights.push(`Your TenaScore improved by ${trend} points over the past week. Keep the momentum.`);
  else if (trend < -5) insights.push("Your score has been declining. Review sleep and meal patterns from the past three days.");
  else insights.push("Your score has been stable. Small habit improvements will compound quickly from here.");

  if (stats.avgStress !== null && stats.avgStress !== undefined && stats.avgStress >= 7) {
    insights.push(`Stress is averaging ${stats.avgStress}/10. Put the mind reset before market or workout actions.`);
  } else if (stats.avgSleep !== null && stats.avgSleep !== undefined && stats.avgSleep < 6) {
    insights.push(`Sleep is averaging ${stats.avgSleep} hours. A consistent wind-down is the highest-leverage next habit.`);
  } else if (avg < 60) {
    insights.push("Average score is below 60. Keep the next plan small and repeatable until the baseline rises.");
  } else if (avg >= 70) {
    insights.push("Strong average score. Focus on maintaining food balance and movement consistency.");
  }

  if ((stats.highRiskMealCount ?? 0) > 0) {
    insights.push(`${stats.highRiskMealCount} saved check-in${stats.highRiskMealCount === 1 ? "" : "s"} included a high-risk food signal. Use the next meal swap to protect the score.`);
  } else if ((stats.avgMovement ?? 0) < 20 && (stats.movementCount ?? 0) === 0) {
    insights.push("Movement is still under the 20-minute target. Log one short walk to create the first movement signal.");
  } else {
    insights.push("Scores tend to be highest on days with seven-plus hours of sleep and a low-risk meal.");
  }

  return insights;
}
