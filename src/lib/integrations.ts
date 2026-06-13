import { Activity, Apple, Footprints, Heart, HeartPulse, Moon, Scale, Utensils, Watch } from "lucide-react";
import { Stamp } from "./types";

export type Integration = {
  id: string;
  name: string;
  slug: string;        // simpleicons.org slug for the real logo
  color: string;       // brand color
  group: string;
  blurb: string;
  scopes: string[];    // permissions shown on the consent screen
  imported: { value: string; label: string }[]; // sample data "synced" on success
  stamp: Stamp;
  points: number;
  Icon: React.ElementType; // fallback if logo fails
};

export const INTEGRATION_GROUPS = [
  "Fitness & movement",
  "Health & vitals",
  "Nutrition",
  "Sleep & recovery",
] as const;

export const INTEGRATIONS: Integration[] = [
  {
    id: "strava", name: "Strava", slug: "strava", color: "#FC4C02", group: "Fitness & movement",
    blurb: "Auto-import your runs, rides and workouts into TenaMove.",
    scopes: ["Activities & workouts", "Distance & pace", "Heart rate during exercise"],
    imported: [{ value: "3", label: "workouts" }, { value: "21.4 km", label: "distance" }, { value: "142", label: "avg bpm" }],
    stamp: "Move", points: 20, Icon: Activity,
  },
  {
    id: "googlefit", name: "Google Fit", slug: "googlefit", color: "#4285F4", group: "Fitness & movement",
    blurb: "Daily steps and Heart Points sync every morning.",
    scopes: ["Step count", "Heart Points", "Move minutes"],
    imported: [{ value: "8,420", label: "steps" }, { value: "34", label: "heart pts" }, { value: "52 min", label: "active" }],
    stamp: "Move", points: 15, Icon: Footprints,
  },
  {
    id: "fitbit", name: "Fitbit", slug: "fitbit", color: "#00B0B9", group: "Fitness & movement",
    blurb: "Steps, active zone minutes and resting heart rate.",
    scopes: ["Steps & floors", "Active Zone Minutes", "Resting heart rate"],
    imported: [{ value: "9,110", label: "steps" }, { value: "41", label: "AZM" }, { value: "61", label: "resting hr" }],
    stamp: "Move", points: 15, Icon: Watch,
  },
  {
    id: "garmin", name: "Garmin Connect", slug: "garmin", color: "#007CC3", group: "Fitness & movement",
    blurb: "Training load and recovery straight from your watch.",
    scopes: ["Workouts & training load", "Body Battery", "Stress score"],
    imported: [{ value: "2", label: "sessions" }, { value: "68", label: "body batt." }, { value: "Low", label: "stress" }],
    stamp: "Move", points: 15, Icon: Watch,
  },
  {
    id: "applehealth", name: "Apple Health", slug: "apple", color: "#1D1D1F", group: "Health & vitals",
    blurb: "Mirror steps, heart and mindful minutes from your iPhone.",
    scopes: ["Steps & walking", "Heart rate", "Mindful minutes"],
    imported: [{ value: "7,950", label: "steps" }, { value: "70", label: "avg bpm" }, { value: "12 min", label: "mindful" }],
    stamp: "Health", points: 20, Icon: Heart,
  },
  {
    id: "samsunghealth", name: "Samsung Health", slug: "samsung", color: "#1428A0", group: "Health & vitals",
    blurb: "Steps, sleep and stress from your Galaxy devices.",
    scopes: ["Step count", "Sleep stages", "Stress level"],
    imported: [{ value: "8,030", label: "steps" }, { value: "7h 02m", label: "sleep" }, { value: "Mid", label: "stress" }],
    stamp: "Health", points: 15, Icon: HeartPulse,
  },
  {
    id: "withings", name: "Withings", slug: "withings", color: "#00C2A8", group: "Health & vitals",
    blurb: "Weight, blood pressure and body composition.",
    scopes: ["Weight & BMI", "Blood pressure", "Body composition"],
    imported: [{ value: "71.2 kg", label: "weight" }, { value: "118/76", label: "bp" }, { value: "21%", label: "body fat" }],
    stamp: "Health", points: 15, Icon: Scale,
  },
  {
    id: "myfitnesspal", name: "MyFitnessPal", slug: "myfitnesspal", color: "#0066EE", group: "Nutrition",
    blurb: "Logged meals and macros flow into TenaPlate scoring.",
    scopes: ["Logged meals", "Calories", "Macronutrients"],
    imported: [{ value: "3", label: "meals" }, { value: "1,840", label: "kcal" }, { value: "96 g", label: "protein" }],
    stamp: "Food", points: 20, Icon: Utensils,
  },
  {
    id: "cronometer", name: "Cronometer", slug: "cronometer", color: "#4CAF50", group: "Nutrition",
    blurb: "Micronutrient tracking for deeper food insights.",
    scopes: ["Nutrient intake", "Hydration", "Diary entries"],
    imported: [{ value: "84%", label: "nutrients" }, { value: "1.9 L", label: "water" }, { value: "22 g", label: "fiber" }],
    stamp: "Food", points: 15, Icon: Apple,
  },
  {
    id: "oura", name: "Oura Ring", slug: "oura", color: "#8A6FE8", group: "Sleep & recovery",
    blurb: "Sleep stages and readiness shape your daily reset plan.",
    scopes: ["Sleep stages", "Readiness score", "HRV & temperature"],
    imported: [{ value: "7h 41m", label: "sleep" }, { value: "84", label: "readiness" }, { value: "48 ms", label: "hrv" }],
    stamp: "Health", points: 20, Icon: Moon,
  },
];
