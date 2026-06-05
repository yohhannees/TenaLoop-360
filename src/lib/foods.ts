import { FoodSignal } from "./types";

export const foodLibrary: FoodSignal[] = [
  {
    label: "Shiro, gomen, one injera",
    score: 86,
    risk: "Low",
    insight: "Balanced fasting-friendly plate with fiber, protein, and a controlled injera portion.",
    swap: "Add salad or atkilt, keep oil moderate, and drink water before coffee.",
    tags: ["fasting", "bp-friendly", "steady energy"],
  },
  {
    label: "Beyaynetu with one injera",
    score: 82,
    risk: "Low",
    insight: "Excellent variety, fiber, and plant protein. One injera keeps the carb load in check.",
    swap: "Keep oil portions light and add a glass of water before eating.",
    tags: ["fasting", "high fiber", "plant protein"],
  },
  {
    label: "Beyaynetu with two injera",
    score: 72,
    risk: "Medium",
    insight: "Strong variety and plant protein, but carb load rises quickly with two injera.",
    swap: "Keep one injera, add more gomen and misir, and reduce oily portions.",
    tags: ["fasting", "portion watch", "fiber"],
  },
  {
    label: "Misir wot, atkilt, one injera",
    score: 84,
    risk: "Low",
    insight: "High-fiber, high-protein fasting plate. Great for sustained energy and blood pressure.",
    swap: "Keep oil low, add salad, and avoid eating too fast.",
    tags: ["fasting", "bp-friendly", "diabetes-friendly"],
  },
  {
    label: "Firfir and sweet coffee",
    score: 48,
    risk: "High",
    insight: "Likely heavy in carbs, oil, and sugar, which can pull energy down after the meal.",
    swap: "Choose one injera portion, less oil, extra greens, and coffee with less sugar.",
    tags: ["sugar watch", "energy dip", "portion watch"],
  },
  {
    label: "Tibs, salad, water",
    score: 68,
    risk: "Medium",
    insight: "Good protein, but salt and oil can climb depending on preparation and portion size.",
    swap: "Add salad, skip extra bread, and choose grilled or less oily preparation.",
    tags: ["protein", "salt watch", "recovery"],
  },
  {
    label: "Kitfo with kocho",
    score: 55,
    risk: "Medium",
    insight: "High protein but also high in fat and calories. Good occasionally, less ideal daily.",
    swap: "Pair with more ayib, reduce kocho portion, and add salad or gomen on the side.",
    tags: ["protein", "portion watch", "occasional"],
  },
  {
    label: "Ful, egg, dabo",
    score: 76,
    risk: "Medium",
    insight: "Good breakfast energy, with protein and fiber if the bread portion stays modest.",
    swap: "Use less oil, add tomato or salad, and keep dabo to one small serving.",
    tags: ["breakfast", "protein", "budget"],
  },
  {
    label: "Pasta be siga",
    score: 52,
    risk: "High",
    insight: "High in refined carbs and often prepared with heavy sauce. Blood sugar can spike quickly.",
    swap: "Reduce portion, add a side salad, and choose a tomato-based sauce over creamy options.",
    tags: ["carb watch", "blood sugar", "portion watch"],
  },
  {
    label: "Sambusa",
    score: 44,
    risk: "High",
    insight: "Deep-fried dough with a high oil and carb load. Best as a small snack, not a meal.",
    swap: "Limit to one or two pieces, pair with salad, and avoid sugary drinks alongside.",
    tags: ["fried", "snack only", "oil watch"],
  },
  {
    label: "Chechebsa with honey",
    score: 58,
    risk: "Medium",
    insight: "Traditional breakfast food, but high in oil and simple sugars. Energy peaks then dips.",
    swap: "Keep portion small, reduce honey, and pair with plain water or herbal tea.",
    tags: ["breakfast", "sugar watch", "portion watch"],
  },
  {
    label: "Dabo kolo, tea",
    score: 62,
    risk: "Medium",
    insight: "Light snack option but low in protein and fiber. Suitable for a mid-morning break.",
    swap: "Pair with an egg or ful for protein, or follow with a proper meal within two hours.",
    tags: ["snack", "low protein", "budget"],
  },
  {
    label: "Shiro with extra injera",
    score: 65,
    risk: "Medium",
    insight: "Shiro is an excellent protein source, but two or more injera raises the carb load significantly.",
    swap: "Limit to one injera, add salad or gomen, and drink water between bites.",
    tags: ["portion watch", "fasting", "carb watch"],
  },
  {
    label: "Tibs firfir",
    score: 54,
    risk: "High",
    insight: "Combination of injera and tibs in oil and spice. Dense calories and high salt.",
    swap: "Order a smaller portion, add salad, and avoid eating it with additional bread.",
    tags: ["salt watch", "oil watch", "portion watch"],
  },
  {
    label: "Coffee with sugar, no food",
    score: 36,
    risk: "High",
    insight: "Skipping a meal and only drinking sugary coffee increases stress hormones and energy crashes.",
    swap: "Eat a small balanced meal - ful, egg, or shiro - before or with coffee.",
    tags: ["skip meal", "sugar watch", "energy crash"],
  },
];

export function getFoodSignal(meal: string): FoodSignal {
  const lowered = meal.toLowerCase();

  const exactMatch = foodLibrary.find((food) =>
    lowered.includes(food.label.toLowerCase().split(",")[0].split(" ")[0]),
  );
  if (exactMatch) return exactMatch;

  if (lowered.includes("firfir") && lowered.includes("tibs")) return foodLibrary[13];
  if (lowered.includes("firfir")) return foodLibrary[4];
  if (lowered.includes("beyaynetu") || lowered.includes("beyainetu")) {
    return lowered.includes("two") || lowered.includes("2") ? foodLibrary[2] : foodLibrary[1];
  }
  if (lowered.includes("shiro") || lowered.includes("gomen")) return foodLibrary[0];
  if (lowered.includes("misir") || lowered.includes("atkilt")) return foodLibrary[3];
  if (lowered.includes("tibs")) return foodLibrary[5];
  if (lowered.includes("kitfo")) return foodLibrary[6];
  if (lowered.includes("ful")) return foodLibrary[7];
  if (lowered.includes("pasta")) return foodLibrary[8];
  if (lowered.includes("sambusa")) return foodLibrary[9];
  if (lowered.includes("chechebsa")) return foodLibrary[10];
  if (lowered.includes("dabo kolo") || lowered.includes("tea")) return foodLibrary[11];
  if (lowered.includes("coffee") && !lowered.trim().match(/\w+ (with|and|plus)/)) return foodLibrary[14];
  if (lowered.includes("coffee")) return foodLibrary[4];

  return {
    label: meal || "Unlogged meal",
    score: meal.trim() ? 64 : 52,
    risk: meal.trim() ? "Medium" : "High",
    insight: meal.trim()
      ? "The meal needs more context, so TenaPlate is using a balanced-plate estimate."
      : "No food logged yet, so nutrition confidence is low for today's score.",
    swap: "Aim for one injera or modest starch, more vegetables, lean protein, and water.",
    tags: ["needs detail", "balanced plate"],
  };
}
