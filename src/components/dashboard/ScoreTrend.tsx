"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import MiniStat from "@/components/ui/MiniStat";
import { CheckIn, Stamp } from "@/lib/types";

type AnalyticsData = {
  trend: number[];
  checkInCount: number;
  mealCount: number;
  movementCount: number;
  avgHydration: number;
};

export default function ScoreTrend() {
  const { checkIn, score, points, stamps, scoreLabel, plan } = useWellness();
  const config = useDashboardConfig();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const nextBestAction = getNextBestAction(checkIn, score, stamps, plan[0]?.detail);
  const passportGoal = getPassportGoal({
    currentStamps: stamps.length,
    totalStamps: 6,
    requiredStamps: config.reward.requiredStamps,
    points,
    pointThreshold: config.reward.pointThreshold,
    discountLabel: config.reward.discountLabel,
  });

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data: AnalyticsData) => { if (data.trend) setAnalytics(data); })
      .catch(() => {});
  }, [score]);

  // Use real trend but replace the last value with live score
  const rawTrend = analytics?.trend ?? [0, 0, 0, 0, 0, 0, score];
  const trend = [...rawTrend.slice(0, 6), score];
  const bestScore = Math.max(...trend.filter(Boolean), score, 1);

  return (
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
      <div className="grid gap-6 bg-[#0A2318] p-6 text-[#E8EDE7] lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#D4C1A0]">
            <Sparkles size={16} />
            TenaScore command view
          </div>
          <h2 className="mt-3 font-serif text-4xl leading-tight">
            Seven-day wellness trajectory
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#E8EDE7]/68">
            Your score blends stress, sleep, mood, food, movement, water, and support
            into one daily action plan.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Score" value={`${score}`} tone="#D4C1A0" variant="dark" />
          <MiniStat label="Points" value={`${points}`} tone="#E8EDE7" variant="dark" />
          <MiniStat label="Stamps" value={`${stamps.length}/6`} tone="#D4C1A0" variant="dark" />
        </div>
      </div>

      <div className="grid min-w-0 gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#8C6246]">Current state</p>
              <h3 className="mt-1 font-serif text-3xl text-[#0A2318]">{scoreLabel}</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4C1A0]/45 px-3 py-2 text-sm font-semibold text-[#0A2318]">
              <ArrowUpRight size={17} />
              Live scoring
            </div>
          </div>

          <div className="mt-8 grid h-56 min-w-0 grid-cols-7 items-end gap-1 sm:gap-2">
            {trend.map((value, index) => {
              const dayLabel = getDayLabel(index, trend.length);
              return (
                <div key={index} className="grid h-full min-w-0 items-end gap-2">
                  <div className="relative flex h-full items-end overflow-hidden rounded-[1rem] bg-[#0A2318]/10">
                    <div
                      className="w-full rounded-t-[1rem] bg-[#8C6246]"
                      style={{ height: value > 0 ? `${Math.max(14, (value / bestScore) * 100)}%` : "4%" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-[#0A2318]">{value > 0 ? value : "—"}</p>
                    <p className="text-xs text-[#0A2318]/52">{dayLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {analytics && (
            <div className="mt-4 flex flex-wrap gap-3">
              <Pill label="Check-ins" value={analytics.checkInCount.toString()} />
              <Pill label="Meals logged" value={analytics.mealCount.toString()} />
              <Pill label="Workouts" value={analytics.movementCount.toString()} />
              <Pill label="Avg. water" value={`${analytics.avgHydration} cups`} />
            </div>
          )}
        </div>

        <aside className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-4">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-[#E8EDE7] text-[#8C6246] shadow-sm">
            <Activity size={22} />
          </div>
          <h3 className="mt-4 font-serif text-2xl text-[#0A2318]">Next best action</h3>
          <p className="mt-2 text-sm leading-6 text-[#0A2318]/64">
            {nextBestAction}
          </p>
          <div className="mt-5 rounded-[1.25rem] bg-[#E8EDE7] p-3 text-sm leading-6 text-[#0A2318]/70 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-[#8C6246]">
              <BadgeCheck size={17} />
              Passport goal
            </div>
            {passportGoal}
          </div>
        </aside>
      </div>
    </section>
  );
}

function getNextBestAction(
  checkIn: CheckIn,
  score: number,
  stamps: Stamp[],
  firstPlanDetail?: string,
) {
  if (checkIn.redFlags) {
    return "Warning signs are selected. Prioritize licensed care and keep self-care gentle today.";
  }

  if (score < 50) {
    return firstPlanDetail || "Start with the smallest reset action, then save today's check-in.";
  }

  if (!stamps.includes("Health")) {
    return "Save today's check-in to lock the Health stamp and refresh your seven-day trend.";
  }

  if (checkIn.stress >= 7 && !stamps.includes("Mind")) {
    return "Stress is the main signal. Complete one Efoy mind reset before adding movement or market actions.";
  }

  if (checkIn.movement < 20 && !stamps.includes("Move")) {
    return "Movement is below target. Log a short walk or mobility session to close the Move stamp.";
  }

  if ((checkIn.bpFocus || checkIn.glucoseFocus) && !stamps.includes("Food")) {
    return "Food is the best next lever. Log the next meal and use a lower-sugar, higher-fiber swap.";
  }

  if (!stamps.includes("Community")) {
    return "Add one human support signal by joining a circle or posting a quick anonymous mood check.";
  }

  if (!stamps.includes("Experience")) {
    return "You have the habit base. Save or book one matched Ethiopian provider to close the Experience stamp.";
  }

  return "All core stamps are active. Keep today's loop small and protect the habit that lifted your score most.";
}

function getPassportGoal({
  currentStamps,
  totalStamps,
  requiredStamps,
  points,
  pointThreshold,
  discountLabel,
}: {
  currentStamps: number;
  totalStamps: number;
  requiredStamps: number;
  points: number;
  pointThreshold: number;
  discountLabel: string;
}) {
  const missingStamps = Math.max(0, requiredStamps - currentStamps);
  const missingPoints = Math.max(0, pointThreshold - points);

  if (missingStamps === 0 && missingPoints === 0) {
    return `Reward unlocked: ${discountLabel}.`;
  }

  if (missingStamps === 0) {
    return `Stamp goal cleared at ${currentStamps}/${totalStamps}. ${missingPoints} more point${missingPoints === 1 ? "" : "s"} to unlock ${discountLabel}.`;
  }

  if (missingPoints === 0) {
    return `${missingStamps} more stamp${missingStamps === 1 ? "" : "s"} to unlock ${discountLabel}.`;
  }

  return `${missingStamps} more stamp${missingStamps === 1 ? "" : "s"} and ${missingPoints} more point${missingPoints === 1 ? "" : "s"} to unlock ${discountLabel}.`;
}

function getDayLabel(index: number, total: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const offset = total - 1 - index;
  const d = new Date();
  d.setDate(d.getDate() - offset);
  if (offset === 0) return "Today";
  return days[d.getDay()];
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#0A2318]/8 bg-[#E5EAE3] px-3 py-1.5 text-xs">
      <span className="font-bold text-[#0A2318]">{value}</span>
      <span className="ml-1 text-[#0A2318]/50">{label}</span>
    </div>
  );
}
