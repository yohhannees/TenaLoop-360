"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BadgeCheck, CalendarCheck, Moon, TrendingUp, Zap } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";

const DARK = "#0A2318";
const PAPER = "#E8EDE7";
const GOLD = "#E0B362";
const SAGE = "#8FB89A";
const CLAY = "#E89070";

type Analytics = {
  trend: number[];
  avgStress: number | null;
  avgSleep: number | null;
  checkInCount: number;
};

function delta(trend: number[]) {
  const nonZero = trend.map((v, i) => ({ v, i })).filter((x) => x.v > 0);
  if (nonZero.length < 2) return null;
  const first = nonZero[0].v;
  const last = nonZero[nonZero.length - 1].v;
  return Math.round(((last - first) / first) * 100);
}

export default function OutcomesStrip() {
  const { stamps, score } = useWellness();
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d: Analytics) => setData(d))
      .catch(() => {});
  }, [score]);

  const trend = data?.trend ?? [];
  const scoreDelta = delta(trend);
  const daysActive = trend.filter((v) => v > 0).length;
  const latest = [...trend].reverse().find((v) => v > 0) ?? score;

  const headline =
    scoreDelta === null ? "Your first week is taking shape" :
    scoreDelta >= 5 ? "You're trending upward" :
    scoreDelta <= -5 ? "A gentler reset week" :
    "Holding steady";

  const metrics = [
    {
      Icon: TrendingUp, label: "Wellbeing", value: `${latest}`, sub: "TenaScore",
      chip: scoreDelta === null ? null : { up: scoreDelta >= 0, text: `${scoreDelta >= 0 ? "+" : ""}${scoreDelta}%` },
    },
    {
      Icon: Zap, label: "Avg stress", value: data?.avgStress != null ? `${data.avgStress}` : "—", sub: "out of 10 · lower is better",
      chip: null,
    },
    {
      Icon: Moon, label: "Avg sleep", value: data?.avgSleep != null ? `${data.avgSleep}h` : "—", sub: "per night",
      chip: null,
    },
    {
      Icon: BadgeCheck, label: "Passport", value: `${stamps.length}/6`, sub: "stamps earned",
      chip: null,
    },
  ];

  return (
    <section className="overflow-hidden rounded-lg p-6 text-[var(--p)] sm:p-7" style={{ background: DARK, ["--p" as string]: PAPER, color: PAPER }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
            <CalendarCheck size={13} /> Your last 7 days
          </div>
          <h2 className="mt-2 font-serif text-3xl leading-tight">{headline}</h2>
          <p className="mt-1 text-sm" style={{ color: `${PAPER}99` }}>
            {daysActive > 0
              ? `${daysActive} of 7 days checked in${data?.checkInCount ? ` · ${data.checkInCount} entries logged` : ""}.`
              : "Save a daily check-in to start measuring outcomes."}
          </p>
        </div>
        {scoreDelta !== null && (
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold"
            style={{ background: scoreDelta >= 0 ? `${SAGE}22` : `${CLAY}22`, color: scoreDelta >= 0 ? SAGE : CLAY }}>
            {scoreDelta >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            {scoreDelta >= 0 ? "+" : ""}{scoreDelta}% wellbeing
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ Icon, label, value, sub, chip }) => (
          <div key={label} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <Icon size={15} style={{ color: GOLD }} />
              {chip && (
                <span className="flex items-center gap-0.5 text-[11px] font-bold" style={{ color: chip.up ? SAGE : CLAY }}>
                  {chip.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{chip.text}
                </span>
              )}
            </div>
            <p className="mt-3 font-serif text-3xl leading-none">{value}</p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${PAPER}55` }}>{label}</p>
            <p className="text-[11px]" style={{ color: `${PAPER}45` }}>{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
