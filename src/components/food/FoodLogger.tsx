"use client";

import { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { foodLibrary } from "@/lib/foods";
import Toggle from "@/components/ui/Toggle";
import { cn } from "@/lib/utils";

type Props = {
  foodText: string;
  setFoodText: (value: string) => void;
  mealPhoto: string | null;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

// Risk colour for each meal chip
const RISK_STYLE: Record<string, string> = {
  Low:    "border-[#0A2318]/18 bg-[#0A2318]/6 text-[#0A2318]/80 hover:border-[#0A2318]/35",
  Medium: "border-[#C4956A]/40 bg-[#C4956A]/10 text-[#0A2318]/80 hover:border-[#C4956A]/65",
  High:   "border-[#C4503A]/30 bg-[#C4503A]/8  text-[#0A2318]/80 hover:border-[#C4503A]/55",
};

export default function FoodLogger({ foodText, setFoodText, mealPhoto, onPhotoChange }: Props) {
  const { checkIn, updateCheckIn, award } = useWellness();

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">TenaPlate</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Log a meal</h2>

      <div className="mt-4 grid gap-4">

        {/* Meal text input */}
        <div className="relative">
          <Search size={15} className="absolute left-4 top-3.5 text-[#0A2318]/35 pointer-events-none" />
          <input
            value={foodText}
            onChange={(e) => setFoodText(e.target.value)}
            placeholder="Type what you ate, e.g. shiro, gomen, one injera…"
            className="h-12 w-full rounded-2xl border border-[#0A2318]/12 bg-[#E5EAE3] pl-10 pr-4 text-sm text-[#0A2318] outline-none transition focus:border-[#8C6246] focus:bg-white/70"
          />
        </div>

        {/* Quick meal chips — horizontally scrollable */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-[#0A2318]/45">
            Quick pick
          </p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {foodLibrary.map((food) => (
              <button
                key={food.label}
                type="button"
                onClick={() => setFoodText(food.label)}
                className={cn(
                  "h-9 shrink-0 rounded-full border px-3.5 text-xs font-medium transition",
                  foodText === food.label
                    ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                    : RISK_STYLE[food.risk],
                )}
              >
                {food.label}
              </button>
            ))}
          </div>
          {/* Risk legend */}
          <div className="mt-2 flex items-center gap-3 text-[10px] text-[#0A2318]/38">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#0A2318]/25" /> Low risk
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#C4956A]/55" /> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#C4503A]/45" /> High
            </span>
          </div>
        </div>

        {/* Health flags */}
        <div className="grid grid-cols-3 gap-2">
          <Toggle label="Fasting" checked={checkIn.fasting}     onChange={() => updateCheckIn("fasting",     !checkIn.fasting)}     />
          <Toggle label="BP"      checked={checkIn.bpFocus}     onChange={() => updateCheckIn("bpFocus",     !checkIn.bpFocus)}     />
          <Toggle label="Glucose" checked={checkIn.glucoseFocus} onChange={() => updateCheckIn("glucoseFocus", !checkIn.glucoseFocus)} />
        </div>

        {/* Photo upload */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase text-[#0A2318]/45">
            Meal photo (optional)
          </p>
          <label className="flex h-10 cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#0A2318]/18 bg-[#E5EAE3] px-4 text-sm text-[#0A2318]/55 transition hover:border-[#8C6246] hover:text-[#0A2318]/75">
            📷 <span>Upload plate photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              className="sr-only"
            />
          </label>
          {mealPhoto && (
            <div className="mt-2 overflow-hidden rounded-2xl border border-[#0A2318]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mealPhoto} alt="Meal preview" className="h-36 w-full object-cover" />
            </div>
          )}
        </div>

        {/* Log CTA */}
        <button
          type="button"
          onClick={() => { updateCheckIn("meal", foodText); award("Food", 15); }}
          className="h-12 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] shadow-sm transition hover:bg-[#1A3A2A] active:scale-[0.98]"
        >
          Log meal · earn 15 pts
        </button>

      </div>
    </section>
  );
}
