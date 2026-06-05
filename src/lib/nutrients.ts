// Nutrient scores 0-10 (10 = high) per typical Ethiopian serving
export type NutrientProfile = {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
};

const PROFILES: Record<string, NutrientProfile> = {
  shiro:      { protein: 8, carbs: 5, fat: 4, fiber: 6, sodium: 4 },
  misir:      { protein: 7, carbs: 5, fat: 3, fiber: 9, sodium: 3 },
  gomen:      { protein: 3, carbs: 2, fat: 3, fiber: 8, sodium: 3 },
  beyaynetu:  { protein: 7, carbs: 6, fat: 4, fiber: 8, sodium: 4 },
  firfir:     { protein: 4, carbs: 8, fat: 7, fiber: 3, sodium: 6 },
  tibs:       { protein: 9, carbs: 1, fat: 7, fiber: 1, sodium: 7 },
  kitfo:      { protein: 9, carbs: 0, fat: 8, fiber: 0, sodium: 4 },
  ful:        { protein: 8, carbs: 6, fat: 5, fiber: 7, sodium: 3 },
  pasta:      { protein: 4, carbs: 9, fat: 6, fiber: 2, sodium: 6 },
  sambusa:    { protein: 3, carbs: 7, fat: 9, fiber: 2, sodium: 5 },
  chechebsa:  { protein: 3, carbs: 7, fat: 8, fiber: 2, sodium: 3 },
  "dabo kolo":{ protein: 3, carbs: 7, fat: 4, fiber: 2, sodium: 3 },
  injera:     { protein: 3, carbs: 9, fat: 1, fiber: 4, sodium: 2 },
  coffee:     { protein: 0, carbs: 3, fat: 0, fiber: 0, sodium: 0 },
  atkilt:     { protein: 2, carbs: 4, fat: 2, fiber: 7, sodium: 2 },
  egg:        { protein: 8, carbs: 1, fat: 6, fiber: 0, sodium: 3 },
  salad:      { protein: 1, carbs: 2, fat: 1, fiber: 5, sodium: 1 },
};

const DEFAULT: NutrientProfile = { protein: 5, carbs: 6, fat: 4, fiber: 4, sodium: 4 };

export function getMealNutrients(meal: string): NutrientProfile {
  const lowered = meal.toLowerCase();
  // Sum contributions from multiple ingredients
  let matches = 0;
  const total: NutrientProfile = { protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 };

  for (const [key, profile] of Object.entries(PROFILES)) {
    if (lowered.includes(key)) {
      for (const k of Object.keys(total) as Array<keyof NutrientProfile>) {
        total[k] += profile[k];
      }
      matches++;
    }
  }

  if (matches === 0) return DEFAULT;

  // Average across matched ingredients, clamp 0-10
  const avg: NutrientProfile = { protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 };
  for (const k of Object.keys(avg) as Array<keyof NutrientProfile>) {
    avg[k] = Math.min(10, Math.round(total[k] / matches));
  }
  return avg;
}

export const NUTRIENT_LABELS: Record<keyof NutrientProfile, { label: string; unit: string; color: string; goodHigh: boolean }> = {
  protein: { label: "Protein",  unit: "g", color: "#8C6246", goodHigh: true  },
  carbs:   { label: "Carbs",    unit: "g", color: "#D4C1A0", goodHigh: false },
  fat:     { label: "Fat",      unit: "g", color: "#C4956A", goodHigh: false },
  fiber:   { label: "Fiber",    unit: "g", color: "#0A2318", goodHigh: true  },
  sodium:  { label: "Sodium",   unit: "mg",color: "#B07040", goodHigh: false },
};
