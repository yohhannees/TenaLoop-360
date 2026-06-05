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
    // On mobile, scroll back to top so the user sees the analysis update
    if (window.innerWidth < 768) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">

      {/* ── LEFT: Input panel ─────────────────────────────────── */}
      <div className="grid min-w-0 content-start gap-5">
        <FoodLogger
          foodText={foodText}
          setFoodText={setFoodText}
          mealPhoto={mealPhoto}
          onPhotoChange={handlePhotoChange}
        />
        {/* Hydration or fasting — both useful alongside the logger */}
        {checkIn.fasting
          ? <FastingTimer onSelectMeal={selectMeal} />
          : <HydrationTracker />
        }
      </div>

      {/* ── RIGHT: Output + tracking ──────────────────────────── */}
      <div className="grid min-w-0 content-start gap-5">
        {/* Analysis + nutrients — primary feedback for logged meal */}
        <MealGuidance signal={signal} meal={foodText} />

        {/* Daily log — most actionable secondary feature */}
        <DailyMealLog onMealSelect={selectMeal} />

        {/* Meal plan — discovery / planning */}
        <MealPlanCard onSelectMeal={selectMeal} />
      </div>

    </div>
  );
}
