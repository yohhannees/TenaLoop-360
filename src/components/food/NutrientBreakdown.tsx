import { getMealNutrients, NUTRIENT_LABELS, NutrientProfile } from "@/lib/nutrients";
import { cn } from "@/lib/utils";

type Props = { meal: string };

export default function NutrientBreakdown({ meal }: Props) {
  const profile = getMealNutrients(meal);
  const keys = Object.keys(NUTRIENT_LABELS) as Array<keyof NutrientProfile>;

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Nutrition estimate</p>
      <h2 className="font-serif text-2xl text-[#0A2318]">Macro breakdown</h2>
      <p className="mt-1 text-xs text-[#0A2318]/55">
        Estimated profile for the logged meal · 10 = very high
      </p>

      <div className="mt-4 grid gap-3">
        {keys.map((key) => {
          const { label, color, goodHigh } = NUTRIENT_LABELS[key];
          const value = profile[key];
          const isGood = goodHigh ? value >= 6 : value <= 4;
          const isWarn = goodHigh ? value <= 3 : value >= 7;

          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#0A2318]/82">{label}</span>
                  {isWarn && (
                    <span className="rounded-full bg-[#C4503A]/12 px-2 py-0.5 text-[10px] font-semibold text-[#C4503A]">
                      Watch
                    </span>
                  )}
                  {isGood && (
                    <span className="rounded-full bg-[#0A2318]/8 px-2 py-0.5 text-[10px] font-semibold text-[#0A2318]/65">
                      Good
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#0A2318]/55">{value}/10</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#0A2318]/8">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${value * 10}%`, backgroundColor: isWarn ? "#C4503A" : color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-[#0A2318]/6 p-3 text-xs leading-5 text-[#0A2318]/65">
        Aim for high protein and fiber, moderate carbs, low fat and sodium — especially for BP and glucose management.
      </div>
    </section>
  );
}
