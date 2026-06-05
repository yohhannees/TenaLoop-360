"use client";

import { ChangeEvent, useState } from "react";
import { getFoodSignal } from "@/lib/foods";
import { useWellness } from "@/context/WellnessContext";
import FoodLogger from "@/components/food/FoodLogger";
import MealGuidance from "@/components/food/MealGuidance";
import DailyMealLog from "@/components/food/DailyMealLog";
import FastingTimer from "@/components/food/FastingTimer";
import HydrationTracker from "@/components/food/HydrationTracker";
import MealPlanCard from "@/components/food/MealPlanCard";

export default function FoodPage() {
  const { checkIn } = useWellness();
  const [foodText, setFoodText] = useState("beyaynetu with two injera");
  const [mealPhoto, setMealPhoto] = useState<string | null>(null);

  const signal = getFoodSignal(foodText);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMealPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function selectMeal(text: string) {
    setFoodText(text);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[1fr_1fr_1fr]">

      {/* ── Column 1: Logger + Fasting / Hydration ────────────── */}
      <div className="grid min-w-0 content-start gap-5">
        <FoodLogger
          foodText={foodText}
          setFoodText={setFoodText}
          mealPhoto={mealPhoto}
          onPhotoChange={handlePhotoChange}
        />
        {checkIn.fasting
          ? <FastingTimer onSelectMeal={selectMeal} />
          : <HydrationTracker />
        }
      </div>

      {/* ── Column 2: Guidance + Nutrients ────────────────────── */}
      <div className="grid min-w-0 content-start gap-5">
        <MealGuidance signal={signal} meal={foodText} />
      </div>

      {/* ── Column 3: Daily log + Meal plan ───────────────────── */}
      <div className="grid min-w-0 content-start gap-5">
        <DailyMealLog onMealSelect={selectMeal} />
        <MealPlanCard onSelectMeal={selectMeal} />
      </div>

    </div>
  );
}
