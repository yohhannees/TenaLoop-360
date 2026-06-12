export type Mood = "Heavy" | "Steady" | "Bright";
export type Support = "Low" | "Some" | "Strong";
export type Stamp = "Mind" | "Food" | "Move" | "Community" | "Experience" | "Health";
export type MessageRole = "assistant" | "user";
export type Language = "English" | "Amharic-ready";
export type PreferredLanguage = "English" | "Amharic-ready" | "Mixed";
export type BodyArea =
  | "Neck"
  | "Shoulders"
  | "Lower back"
  | "Head"
  | "Stomach"
  | "Chest"
  | "Hips"
  | "Knees"
  | "Wrists/hands";
export type PainTrigger = "Long sitting" | "Stress" | "Poor sleep" | "Exercise" | "Not sure";
export type CycleContext = "None" | "Period near" | "On period" | "Pregnant" | "Postpartum";

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
  painAreas: BodyArea[];
  painIsNew: boolean;
  painTrigger: PainTrigger;
  redFlags: boolean;
  womenWellness: boolean;
  cycleContext: CycleContext;
  privacyMode: boolean;
  screenHours: number;
  coffeeCups: number;
  sugarServings: number;
  familyStress: boolean;
  communitySupport: boolean;
  preferredLanguage: PreferredLanguage;
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

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  organization: string | null;
};

export type MealLogEntry = {
  id: string;
  slot: string | null;
  text: string;
  risk: string | null;
  score: number | null;
  photoUrl: string | null;
  createdAt: string;
};

export type BookingEntry = {
  id: string;
  providerId: string;
  providerName: string | null;
  bookingRef: string;
  bookingDate: string;
  slot: string;
  paymentMethod: string | null;
  status: string;
  createdAt: string;
};

export type WellnessBackendState = {
  user: AuthUser;
  checkIn: CheckIn;
  stamps: Stamp[];
  points: number;
  savedProviderMatches: string[];
  bookedProviders: string[];
  joinedCircles: string[];
  language: Language;
  messages: ChatMessage[];
  recentMeals: MealLogEntry[];
  bookings: BookingEntry[];
};
