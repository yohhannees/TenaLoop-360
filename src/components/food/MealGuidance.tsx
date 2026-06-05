import { FoodSignal } from "@/lib/types";
import NutrientBreakdown from "@/components/food/NutrientBreakdown";

type Props = { signal: FoodSignal; meal: string };

export default function MealGuidance({ signal, meal }: Props) {
  return (
    <div className="grid gap-5">
      {/* Score + insight */}
      <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-[#8C6246]">AI meal guidance</p>
            <h2 className="font-serif text-3xl text-[#0A2318]">{signal.risk} risk</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-serif text-4xl font-bold text-[#0A2318]">{signal.score}</span>
            <span className="text-xs text-[#0A2318]/45">/100</span>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#0A2318]/68">{signal.insight}</p>

        <div className="mt-4 rounded-2xl bg-[#D4C1A0]/30 p-4 text-sm leading-6 text-[#0A2318]/80">
          <span className="block text-xs font-bold uppercase text-[#8C6246] mb-1">Better next choice</span>
          {signal.swap}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {signal.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#0A2318]/10 bg-[#E5EAE3] px-3 py-1 text-xs font-medium text-[#0A2318]/68"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Nutrient breakdown */}
      <NutrientBreakdown meal={meal} />
    </div>
  );
}
