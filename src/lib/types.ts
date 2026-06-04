export type Mood = "Heavy" | "Steady" | "Bright";
export type Support = "Low" | "Some" | "Strong";
export type Stamp = "Mind" | "Food" | "Move" | "Community" | "Experience" | "Health";
export type MessageRole = "assistant" | "user";
export type Language = "English" | "Amharic-ready";

export type CheckIn = {
  mood: Mood;
  stress: number;
  sleep: number;
  energy: number;
  movement: number;
  water: number;
  meal: string;
  support: Support;
  fasting: boolean;
  bpFocus: boolean;
  glucoseFocus: boolean;
  bp: string;
  glucose: string;
};

export type FoodSignal = {
  label: string;
  score: number;
  risk: "Low" | "Medium" | "High";
  insight: string;
  swap: string;
  tags: string[];
};

export type Provider = {
  id: string;
  name: string;
  type: string;
  area: string;
  price: string;
  bestFor: string;
  category: "Stress" | "Movement" | "Food" | "Recovery";
};

export type Circle = {
  id: string;
  name: string;
  time: string;
  members: number;
  focus: string;
  challenge: string;
};

export type ChatMessage = {
  role: MessageRole;
  text: string;
};

export type PlanItem = {
  title: string;
  detail: string;
  stamp: Stamp;
};
