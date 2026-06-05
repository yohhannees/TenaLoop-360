"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FoodSignal } from "@/lib/types";
import { getMealNutrients, NUTRIENT_LABELS, NutrientProfile } from "@/lib/nutrients";
import { cn } from "@/lib/utils";

type Props = { signal: FoodSignal; meal: string };

export default function MealGuidance({ signal, meal }: Props) {
  const [showNutrients, setShowNutrients] = useState(false);
  const profile = getMealNutrients(meal);
  const keys    = Object.keys(NUTRIENT_LABELS) as Array<keyof NutrientProfile>;

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">

      {/* Score row */}
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-[#8C6246]">AI meal guidance</p>
          <h2 className="font-serif text-3xl text-[#0A2318]">{signal.risk} risk</h2>
        </div>
        <div className="text-right">
          <span className="font-serif text-5xl font-bold text-[#0A2318]">{signal.score}</span>
          <span className="block text-xs text-[#0A2318]/40">/100</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#0A2318]/8">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${signal.score}%`,
            backgroundColor: signal.score >= 75 ? "#0A2318" : signal.score >= 55 ? "#8C6246" : "#C4503A",
          }}
        />
      </div>

      {/* Insight */}
      <p className="mt-4 text-sm leading-6 text-[#0A2318]/68">{signal.insight}</p>

      {/* Better choice */}
      <div className="mt-3 rounded-2xl bg-[#D4C1A0]/30 p-3.5">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8C6246]">Better next choice</p>
        <p className="text-sm leading-6 text-[#0A2318]/78">{signal.swap}</p>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {signal.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[#0A2318]/10 bg-[#E5EAE3] px-3 py-1 text-xs font-medium text-[#0A2318]/65">
            {tag}
          </span>
        ))}
      </div>

      {/* ── Nutrients toggle ───────────────────────────── */}
      <button
        type="button"
        onClick={() => setShowNutrients(v => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#0A2318]/6 px-4 py-2.5 text-sm font-semibold text-[#0A2318]/70 transition hover:bg-[#0A2318]/10"
      >
        <span>Macro breakdown</span>
        <ChevronDown size={15} className={cn("transition-transform", showNutrients && "rotate-180")} />
      </button>

      {showNutrients && (
        <div className="mt-3 grid gap-2.5">
          {keys.map((key) => {
            const { label, color, goodHigh } = NUTRIENT_LABELS[key];
            const value = profile[key];
            const isGood = goodHigh ? value >= 6 : value <= 4;
            const isWarn = goodHigh ? value <= 3 : value >= 7;

            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <span className="font-medium text-[#0A2318]/75">{label}</span>
                    {isWarn && <span className="rounded-full bg-[#C4503A]/12 px-2 py-0.5 text-[10px] font-semibold text-[#C4503A]">Watch</span>}
                    {isGood && <span className="rounded-full bg-[#0A2318]/8 px-2 py-0.5 text-[10px] font-semibold text-[#0A2318]/55">Good</span>}
                  </div>
                  <span className="text-[#0A2318]/45">{value}/10</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#0A2318]/8">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value * 10}%`, backgroundColor: isWarn ? "#C4503A" : color }}
                  />
                </div>
              </div>
            );
          })}
          <p className="mt-1 text-[10px] leading-5 text-[#0A2318]/45">
            Aim for high protein + fiber, moderate carbs, low sodium — especially for BP and glucose health.
          </p>
        </div>
      )}

    </section>
  );
}
