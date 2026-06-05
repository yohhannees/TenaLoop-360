"use client";

import { ChangeEvent, useState } from "react";
import { getFoodSignal } from "@/lib/foods";
import FoodLogger from "@/components/food/FoodLogger";
import MealGuidance from "@/components/food/MealGuidance";

export default function FoodPage() {
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

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <FoodLogger
        foodText={foodText}
        setFoodText={setFoodText}
        mealPhoto={mealPhoto}
        onPhotoChange={handlePhotoChange}
      />
      <MealGuidance signal={signal} />
    </div>
  );
}
