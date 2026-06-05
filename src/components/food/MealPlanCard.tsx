"use client";

import { useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { MEAL_PLANS, MealPlanMode } from "@/lib/meal-plans";
import { cn } from "@/lib/utils";

const MODE_TABS: { mode: MealPlanMode; label: string }[] = [
  { mode: "regular",  label: "Balanced" },
  { mode: "fasting",  label: "Fasting" },
  { mode: "bp",       label: "BP" },
  { mode: "glucose",  label: "Glucose" },
  { mode: "budget",   label: "Budget" },
];

function scoreBg(s: number) {
  if (s >= 80) return "#0A2318";
  if (s >= 70) return "#8C6246";
  if (s >= 60) return "#C4956A";
  return "#C4503A";
}

type Props = { onSelectMeal: (meal: string) => void };

export default function MealPlanCard({ onSelectMeal }: Props) {
  const { checkIn } = useWellness();

  const defaultMode: MealPlanMode =
    checkIn.fasting ? "fasting" :
    checkIn.bpFocus ? "bp" :
    checkIn.glucoseFocus ? "glucose" : "regular";

  const [mode, setMode] = useState<MealPlanMode>(defaultMode);

  const plan = MEAL_PLANS.find((p) => p.mode === mode) ?? MEAL_PLANS[0];

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Meal planner</p>
      <h2 className="font-serif text-2xl text-[#0A2318]">{plan.label}</h2>
      <p className="mt-1 text-sm text-[#0A2318]/60">{plan.description}</p>

      {/* Mode tabs */}
      <div className="no-scrollbar mt-4 flex min-w-0 max-w-full gap-1.5 overflow-x-auto pb-0.5">
        {MODE_TABS.map(({ mode: m, label }) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "h-8 shrink-0 rounded-full px-4 text-xs font-semibold transition",
              mode === m
                ? "bg-[#0A2318] text-[#E8EDE7]"
                : "bg-[#0A2318]/8 text-[#0A2318]/65 hover:bg-[#0A2318]/14",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Meal entries */}
      <div className="mt-4 grid gap-2">
        {plan.entries.map(({ slot, meal, tip, score }) => (
          <button
            key={slot}
            type="button"
            onClick={() => onSelectMeal(meal)}
            className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] px-4 py-3 text-left transition hover:border-[#8C6246]"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#0A2318]/45">{slot}</span>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-[#0A2318]">{meal}</p>
              <p className="mt-0.5 text-xs leading-5 text-[#0A2318]/55">{tip}</p>
            </div>
            <span
              className="mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-[#E8EDE7]"
              style={{ backgroundColor: scoreBg(score) }}
            >
              {score}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 text-[10px] text-[#0A2318]/40">
        Tap any meal to analyse it in TenaPlate.
      </p>
    </section>
  );
}
