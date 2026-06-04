"use client";

import { ChangeEvent, useState } from "react";
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
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">TenaPlate</p>
      <h2 className="text-2xl font-semibold">Ethiopian food tracker</h2>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-[#31463b]">
          Meal log
          <textarea
            value={foodText}
            onChange={(e) => setFoodText(e.target.value)}
            className="min-h-28 rounded-md border border-[#cddbd3] bg-white p-3 text-sm leading-6 text-[#23362c] outline-none focus:border-[#0f6b52]"
          />
        </label>

        <div className="grid gap-2">
          <span className="text-sm font-medium text-[#31463b]">Quick Ethiopian meals</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {foodLibrary.map((food) => (
              <button
                key={food.label}
                type="button"
                onClick={() => setFoodText(food.label)}
                className="min-h-11 rounded-md border border-[#d7e4dc] bg-white px-3 py-2 text-left text-sm font-medium text-[#33483e] transition hover:border-[#0f6b52]"
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

        <label className="grid gap-2 text-sm font-medium text-[#31463b]">
          Meal photo
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="block w-full rounded-md border border-[#cddbd3] bg-white p-2 text-sm file:mr-3 file:h-9 file:rounded-md file:border-0 file:bg-[#eef6f2] file:px-3 file:text-sm file:font-semibold file:text-[#0f6b52]"
          />
        </label>

        {mealPhoto && (
          <div className="overflow-hidden rounded-md border border-[#cddbd3]">
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
          className="h-11 rounded-md bg-[#0f6b52] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5944]"
        >
          Log meal and update score
        </button>
      </div>
    </section>
  );
}
