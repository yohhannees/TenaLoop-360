import { ChatMessage, CheckIn, Stamp } from "@/lib/types";

export const DEFAULT_CHECK_IN: CheckIn = {
  mood: "Steady",
  stress: 7,
  sleep: 4,
  energy: 4,
  movement: 10,
  water: 4,
  meal: "Firfir and sweet coffee",
  support: "Low",
  fasting: false,
  painAreas: ["Neck", "Shoulders"],
  painIsNew: false,
  painTrigger: "Long sitting",
  redFlags: false,
  womenWellness: true,
  cycleContext: "Period near",
  privacyMode: true,
  screenHours: 8,
  coffeeCups: 2,
  sugarServings: 2,
  familyStress: false,
  communitySupport: false,
  preferredLanguage: "Mixed",
  bpFocus: true,
  glucoseFocus: false,
  bp: "",
  glucose: "",
};

export const DEFAULT_STAMPS: Stamp[] = ["Mind", "Food"];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    text: "Selam, I am TenaBot. Tell me what is happening today and I will turn it into one practical wellness loop.",
  },
];
