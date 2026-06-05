"use client";

import { ChangeEvent } from "react";
import { useWellness } from "@/context/WellnessContext";
import { foodLibrary } from "@/lib/foods";
import Toggle from "@/components/ui/Toggle";

type Props = {
  foodText: string;
  setFoodText: (value: string) => void;
  mealPhoto: string | null;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function FoodLogger({ foodText, setFoodText, mealPhoto, onPhotoChange }: Props) {
  const { checkIn, updateCheckIn, award } = useWellness();

  return (
    <section className="min-w-0 rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">TenaPlate</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Ethiopian food tracker</h2>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-[#0A2318]/82">
          Meal log
          <textarea
            value={foodText}
            onChange={(e) => setFoodText(e.target.value)}
            className="min-h-28 rounded-[1.5rem] border border-[#0A2318]/12 bg-[#E5EAE3] p-4 text-sm leading-6 text-[#0A2318] outline-none focus:border-[#8C6246] focus:bg-[#F3F5F1]"
          />
        </label>

        <div className="grid gap-2">
          <span className="text-sm font-medium text-[#0A2318]/82">Quick Ethiopian meals</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {foodLibrary.map((food) => (
              <button
                key={food.label}
                type="button"
                onClick={() => setFoodText(food.label)}
                className="min-h-11 rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-4 py-2 text-left text-sm font-medium text-[#0A2318]/72 transition hover:border-[#8C6246] hover:text-[#0A2318]"
              >
                {food.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="Fasting-aware" checked={checkIn.fasting} onChange={() => updateCheckIn("fasting", !checkIn.fasting)} />
          <Toggle label="BP-friendly" checked={checkIn.bpFocus} onChange={() => updateCheckIn("bpFocus", !checkIn.bpFocus)} />
          <Toggle label="Glucose-aware" checked={checkIn.glucoseFocus} onChange={() => updateCheckIn("glucoseFocus", !checkIn.glucoseFocus)} />
        </div>

        <label className="grid gap-2 text-sm font-medium text-[#0A2318]/82">
          Meal photo
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="block w-full rounded-[1.5rem] border border-[#0A2318]/12 bg-[#E5EAE3] p-2 text-sm text-[#0A2318]/72 file:mr-3 file:h-9 file:rounded-full file:border-0 file:bg-[#0A2318] file:px-4 file:text-sm file:font-semibold file:text-[#E8EDE7]"
          />
        </label>

        {mealPhoto && (
          <div className="overflow-hidden rounded-[1.5rem] border border-[#0A2318]/12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mealPhoto} alt="Meal preview" className="h-48 w-full object-cover" />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            updateCheckIn("meal", foodText);
            award("Food", 15);
          }}
          className="h-11 rounded-full bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#1A3A2A]"
        >
          Log meal and update score
        </button>
      </div>
    </section>
  );
}
