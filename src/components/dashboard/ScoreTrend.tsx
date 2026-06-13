"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Droplets,
  Dumbbell,
  HeartPulse,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { CheckIn, Stamp } from "@/lib/types";
import { cn } from "@/lib/utils";

type AnalyticsData = {
  trend: number[];
  checkInCount: number;
  mealCount: number;
  movementCount: number;
  avgHydration: number;
};

type MetricTone = "green" | "gold" | "blue" | "coral";

const metricToneClasses: Record<MetricTone, string> = {
  green: "bg-[#EAF4EE] text-[#0A2318] border-[#4C956C]/22",
  gold: "bg-[#FFF6DD] text-[#0A2318] border-[#EFB84C]/30",
  blue: "bg-[#E8F3F7] text-[#0A2318] border-[#2C7DA0]/24",
  coral: "bg-[#FCECE7] text-[#0A2318] border-[#D65A31]/22",
};

function scoreColor(s: number) {
  if (s >= 80) return { bar: "#4C956C", soft: "#EAF4EE", text: "#276442" };
  if (s >= 65) return { bar: "#EFB84C", soft: "#FFF6DD", text: "#8C6246" };
  if (s >= 50) return { bar: "#D58A25", soft: "#FFF1DE", text: "#A85A10" };
  return { bar: "#D65A31", soft: "#FCECE7", text: "#B23A24" };
}

function getDayLabel(index: number, total: number) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const offset = total - 1 - index;
  const d = new Date();
  d.setDate(d.getDate() - offset);
  if (offset === 0) return "Today";
  return days[d.getDay()];
}

export default function ScoreTrend() {
  const { checkIn, score, points, stamps, scoreLabel, plan } = useWellness();
  const config = useDashboardConfig();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    fetch("/api/analytics", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: AnalyticsData) => {
        if (Array.isArray(data.trend)) setAnalytics(data);
      })
      .catch(() => {});
  }, [score]);

  const trend = useMemo(() => {
    const source = analytics?.trend?.length ? analytics.trend : [0, 0, 0, 0, 0, 0, score];
    const next = source.slice(-7);
    while (next.length < 7) next.unshift(0);
    next[next.length - 1] = score;
    return next.map((value) => (Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0));
  }, [analytics, score]);

  const bestScore = Math.max(...trend, score, 1);
  const previousScore = trend[trend.length - 2] || score;
  const delta = score - previousScore;
  const colors = scoreColor(score);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference - (circumference * score) / 100;

  const metricCards = [
    {
      icon: HeartPulse,
      label: "TenaScore",
      value: `${score}/100`,
      detail: scoreLabel,
      tone: "green" as const,
      trend,
    },
    {
      icon: Sparkles,
      label: "Points",
      value: points.toString(),
      detail: "Passport balance",
      tone: "gold" as const,
    },
    {
      icon: BadgeCheck,
      label: "Stamps",
      value: `${stamps.length}/6`,
      detail: `${config.reward.requiredStamps} needed for reward`,
      tone: "blue" as const,
    },
    {
      icon: Zap,
      label: "Check-ins",
      value: (analytics?.checkInCount ?? 0).toString(),
      detail: "Saved history",
      tone: "coral" as const,
    },
  ];

  return (
    <section className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(280px,0.88fr)_minmax(0,1.12fr)]">
        <article className="relative min-h-[238px] overflow-hidden rounded-lg border border-[#0A2318]/12 bg-[#0A2318] p-5 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/8">
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EFB84C]">Live score</p>
              <h2 className="mt-2 font-serif text-3xl leading-none text-white">TenaScore</h2>
              <p className="mt-2 text-sm text-[#E8EDE7]/66">{scoreLabel} zone</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-white/72">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.bar }} />
              Live
            </span>
          </div>

          <div className="relative z-10 mt-7 grid items-center gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div className="relative grid h-32 w-32 place-items-center">
              <svg width="132" height="132" className="-rotate-90" aria-hidden="true">
                <circle cx="66" cy="66" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
                <circle
                  cx="66"
                  cy="66"
                  r={radius}
                  fill="none"
                  stroke={colors.bar}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={filled}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute text-center">
                <p className="font-serif text-5xl font-bold leading-none text-white">{score}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">of 100</p>
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.bar }}>
                <TrendingUp size={16} />
                <span>{delta >= 0 ? "+" : ""}{delta} from yesterday</span>
              </div>
              <div className="mt-4 h-16 rounded-lg border border-white/10 bg-white/6 p-2">
                <Sparkline values={trend} color={colors.bar} />
              </div>
              <p className="mt-3 text-sm leading-6 text-[#E8EDE7]/62">
                Your dashboard is using saved check-ins, passport activity, meals, movement, and water logs.
              </p>
            </div>
          </div>
        </article>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          {metricCards.map((card) => (
            <MetricTile key={card.label} {...card} />
          ))}
        </div>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <article className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">7-day trend</p>
              <h2 className="mt-1 font-serif text-2xl text-[#0A2318]">Weekly trajectory</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 text-right sm:min-w-[280px]">
              <SmallStat icon={UtensilsCrossed} label="Meals" value={analytics?.mealCount ?? 0} />
              <SmallStat icon={Dumbbell} label="Move" value={analytics?.movementCount ?? 0} />
              <SmallStat icon={Droplets} label="Water" value={analytics?.avgHydration ?? 0} suffix="cups" />
            </div>
          </div>

          <div className="mt-6 flex h-44 items-end gap-2">
            {trend.map((value, index) => {
              const isToday = index === trend.length - 1;
              const isHovered = hoveredIndex === index;
              const heightPct = value > 0 ? Math.max(12, (value / bestScore) * 100) : 6;
              const c = scoreColor(value || score);

              return (
                <button
                  key={`${index}-${getDayLabel(index, trend.length)}`}
                  type="button"
                  className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  aria-label={`${getDayLabel(index, trend.length)} score ${value}`}
                >
                  <span
                    className={cn(
                      "h-5 text-[10px] font-bold transition",
                      isHovered ? "opacity-100" : "opacity-0",
                    )}
                    style={{ color: c.text }}
                  >
                    {value || "--"}
                  </span>
                  <span className="flex h-[132px] w-full items-end overflow-hidden rounded-md bg-[#EEF2ED]">
                    <span
                      className="block w-full rounded-md transition-all duration-700"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: isToday ? colors.bar : c.bar,
                        opacity: value > 0 ? 1 : 0.32,
                      }}
                    />
                  </span>
                  <span className={cn("text-[11px]", isToday ? "font-bold text-[#0A2318]" : "text-[#0A2318]/48")}>
                    {getDayLabel(index, trend.length)}
                  </span>
                </button>
              );
            })}
          </div>
        </article>

        <div className="grid min-w-0 gap-4">
          <article className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FCECE7] text-[#D65A31]">
                <Activity size={18} />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Next best action</p>
                <h3 className="font-serif text-xl text-[#0A2318]">Do this next</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#0A2318]/68">{nextBestAction}</p>
          </article>

          <article className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Passport goal</p>
                <h3 className="font-serif text-xl text-[#0A2318]">Reward progress</h3>
              </div>
              <span className="text-sm font-bold text-[#0A2318]">{stamps.length}/6</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6ECE5]">
              <div
                className="h-full rounded-full bg-[#EFB84C] transition-all duration-700"
                style={{ width: `${Math.min(100, (stamps.length / 6) * 100)}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#0A2318]/68">{passportGoal}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
  tone,
  trend,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
  trend?: number[];
}) {
  return (
    <article className={cn("min-h-[116px] rounded-lg border p-4 shadow-sm shadow-[#0A2318]/5", metricToneClasses[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-60">{label}</p>
          <p className="mt-2 truncate font-serif text-3xl font-bold leading-none">{value}</p>
          <p className="mt-2 truncate text-sm opacity-64">{detail}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/70">
          <Icon size={18} />
        </span>
      </div>
      {trend ? (
        <div className="mt-3 h-8">
          <Sparkline values={trend} color="#0A2318" muted />
        </div>
      ) : null}
    </article>
  );
}

function SmallStat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] px-3 py-2 text-left">
      <div className="flex items-center gap-1.5 text-[#8C6246]">
        <Icon size={13} />
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-1 text-sm font-bold text-[#0A2318]">
        {value}
        {suffix ? <span className="ml-1 text-[10px] font-normal text-[#0A2318]/48">{suffix}</span> : null}
      </p>
    </div>
  );
}

function Sparkline({ values, color, muted = false }: { values: number[]; color: string; muted?: boolean }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * 100;
      const y = 32 - ((value - min) / range) * 26 - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="h-full w-full overflow-visible" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        fill="none"
        points={points}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={muted ? 2.2 : 3}
        opacity={muted ? 0.55 : 1}
      />
    </svg>
  );
}

function getNextBestAction(checkIn: CheckIn, score: number, stamps: Stamp[], firstPlanDetail?: string) {
  if (checkIn.redFlags) return "Warning signs are selected. Prioritize licensed care and keep self-care gentle today.";
  if (score < 50) return firstPlanDetail || "Start with the smallest reset action, then save today's check-in.";
  if (!stamps.includes("Health")) return "Save today's check-in to lock the Health stamp and refresh your seven-day trend.";
  if (checkIn.stress >= 7 && !stamps.includes("Mind")) return "Stress is the main signal. Complete one Efoy mind reset before adding movement or market actions.";
  if (checkIn.movement < 20 && !stamps.includes("Move")) return "Movement is below target. Log a short walk or mobility session to close the Move stamp.";
  if ((checkIn.bpFocus || checkIn.glucoseFocus) && !stamps.includes("Food")) return "Food is the best next lever. Log the next meal and use a lower-sugar, higher-fiber swap.";
  if (!stamps.includes("Community")) return "Add one human support signal by joining a circle or posting a quick anonymous mood check.";
  if (!stamps.includes("Experience")) return "You have the habit base. Save or book one matched Ethiopian provider to close the Experience stamp.";
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
  if (missingStamps === 0 && missingPoints === 0) return `Reward unlocked: ${discountLabel}.`;
  if (missingStamps === 0) return `Stamps cleared. ${missingPoints} more point${missingPoints === 1 ? "" : "s"} to unlock ${discountLabel}.`;
  if (missingPoints === 0) return `${missingStamps} more stamp${missingStamps === 1 ? "" : "s"} to unlock ${discountLabel}.`;
  return `${missingStamps} more stamp${missingStamps === 1 ? "" : "s"} and ${missingPoints} more point${missingPoints === 1 ? "" : "s"} to unlock ${discountLabel}. ${currentStamps}/${totalStamps} stamps are active.`;
}
