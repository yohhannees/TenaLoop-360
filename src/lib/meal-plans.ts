export type MealPlanMode = "regular" | "fasting" | "bp" | "glucose" | "budget";

export type MealPlanEntry = {
  slot: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  meal: string;
  tip: string;
  score: number;
};

export type MealPlan = {
  mode: MealPlanMode;
  label: string;
  description: string;
  entries: MealPlanEntry[];
};

export const MEAL_PLANS: MealPlan[] = [
  {
    mode: "regular",
    label: "Balanced day",
    description: "A well-rounded Ethiopian day with steady energy.",
    entries: [
      { slot: "Breakfast", meal: "Ful, egg, dabo",                   tip: "High-protein start. Keep dabo to one small piece.", score: 76 },
      { slot: "Snack",     meal: "Dabo kolo, tea",                   tip: "Light mid-morning break. No sugar in tea.", score: 62 },
      { slot: "Lunch",     meal: "Shiro, gomen, one injera",         tip: "The ideal fasting-friendly lunch. Add salad.", score: 86 },
      { slot: "Dinner",    meal: "Tibs, salad, water",               tip: "Grilled or less oil. Add more salad to balance.", score: 68 },
    ],
  },
  {
    mode: "fasting",
    label: "Fasting day",
    description: "Orthodox fasting — no meat or dairy. High fiber and plant protein.",
    entries: [
      { slot: "Breakfast", meal: "Shiro, gomen, one injera",         tip: "Start the fast with this balanced plate.", score: 86 },
      { slot: "Snack",     meal: "Dabo kolo, tea",                   tip: "Plain tea only. No sugar.", score: 60 },
      { slot: "Lunch",     meal: "Beyaynetu with one injera",        tip: "Excellent variety. One injera keeps carbs in check.", score: 82 },
      { slot: "Dinner",    meal: "Misir wot, atkilt, one injera",    tip: "High-fiber close to the day. Eat before 8 PM.", score: 84 },
    ],
  },
  {
    mode: "bp",
    label: "BP-friendly",
    description: "Low sodium, high fiber. Good for hypertension management.",
    entries: [
      { slot: "Breakfast", meal: "Ful, egg, dabo",                   tip: "Ask for less oil and no added salt.", score: 74 },
      { slot: "Snack",     meal: "Salad, water",                     tip: "Fresh vegetables, no dressing or light lemon only.", score: 88 },
      { slot: "Lunch",     meal: "Misir wot, atkilt, one injera",    tip: "Low sodium when oil and salt are controlled.", score: 84 },
      { slot: "Dinner",    meal: "Shiro, gomen, one injera",         tip: "Ask the cook to go light on salt and berbere.", score: 82 },
    ],
  },
  {
    mode: "glucose",
    label: "Glucose-friendly",
    description: "Lower carb loads and slower digestion for blood sugar stability.",
    entries: [
      { slot: "Breakfast", meal: "Ful, egg, dabo",                   tip: "Protein-rich start stabilises morning glucose. One small dabo.", score: 73 },
      { slot: "Snack",     meal: "Dabo kolo, tea",                   tip: "Very small portion. Green or herbal tea, no sugar.", score: 60 },
      { slot: "Lunch",     meal: "Tibs, salad, water",               tip: "High protein, low carb option. Skip bread entirely.", score: 72 },
      { slot: "Dinner",    meal: "Shiro, gomen, one injera",         tip: "One injera maximum. More gomen than shiro to lower glycaemic load.", score: 82 },
    ],
  },
  {
    mode: "budget",
    label: "Budget day",
    description: "Affordable, nutritious Ethiopian meals available everywhere.",
    entries: [
      { slot: "Breakfast", meal: "Ful, egg, dabo",                   tip: "Most affordable high-protein breakfast in Addis.", score: 76 },
      { slot: "Snack",     meal: "Dabo kolo, tea",                   tip: "Cheapest snack option. Keep it small.", score: 62 },
      { slot: "Lunch",     meal: "Shiro, gomen, one injera",         tip: "Shiro is the most affordable high-protein lunch.", score: 86 },
      { slot: "Dinner",    meal: "Misir wot, atkilt, one injera",    tip: "Very affordable and nutritious. Common in every restaurant.", score: 84 },
    ],
  },
];
