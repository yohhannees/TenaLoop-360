"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { CheckIn, ChatMessage, Language, Stamp } from "@/lib/types";
import { calculateScore, buildPlan, getScoreColor, getScoreLabel } from "@/lib/score";
import { getFoodSignal } from "@/lib/foods";

const DEFAULT_CHECK_IN: CheckIn = {
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

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    text: "Selam, I am TenaBot. Tell me what is happening today and I will turn it into one practical wellness loop.",
  },
];

function normalizeCheckIn(checkIn: CheckIn): CheckIn {
  return {
    ...DEFAULT_CHECK_IN,
    ...checkIn,
    painAreas: checkIn.painAreas ?? DEFAULT_CHECK_IN.painAreas,
  };
}

type WellnessContextValue = {
  // check-in
  checkIn: CheckIn;
  updateCheckIn: <K extends keyof CheckIn>(key: K, value: CheckIn[K]) => void;
  // derived score state
  score: number;
  scoreColor: string;
  scoreLabel: string;
  plan: ReturnType<typeof buildPlan>;
  foodSignal: ReturnType<typeof getFoodSignal>;
  // passport
  stamps: Stamp[];
  points: number;
  award: (stamp: Stamp, amount: number) => void;
  // chat
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  // market
  savedProviderMatches: string[];
  saveProviderMatch: (id: string) => void;
  bookedProviders: string[];
  bookProvider: (id: string) => void;
  // circles
  joinedCircles: string[];
  joinCircle: (id: string) => void;
  // language
  language: Language;
  setLanguage: (lang: Language) => void;
};

const WellnessContext = createContext<WellnessContextValue | null>(null);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState<CheckIn>(DEFAULT_CHECK_IN);
  const [stamps, setStamps] = useState<Stamp[]>(["Mind", "Food"]);
  const [points, setPoints] = useState(180);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [savedProviderMatches, setSavedProviderMatches] = useState<string[]>([]);
  const [bookedProviders, setBookedProviders] = useState<string[]>([]);
  const [joinedCircles, setJoinedCircles] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>("English");

  const normalizedCheckIn = useMemo(() => normalizeCheckIn(checkIn), [checkIn]);
  const score = useMemo(() => calculateScore(normalizedCheckIn), [normalizedCheckIn]);
  const scoreColor = useMemo(() => getScoreColor(score), [score]);
  const scoreLabel = useMemo(() => getScoreLabel(score), [score]);
  const plan = useMemo(() => buildPlan(normalizedCheckIn, score), [normalizedCheckIn, score]);
  const foodSignal = useMemo(() => getFoodSignal(normalizedCheckIn.meal), [normalizedCheckIn.meal]);

  function updateCheckIn<K extends keyof CheckIn>(key: K, value: CheckIn[K]) {
    setCheckIn((prev) => ({ ...prev, [key]: value }));
  }

  function award(stamp: Stamp, amount: number) {
    setStamps((prev) => (prev.includes(stamp) ? prev : [...prev, stamp]));
    setPoints((prev) => prev + amount);
  }

  function addMessage(message: ChatMessage) {
    setMessages((prev) => [...prev, message]);
  }

  function saveProviderMatch(id: string) {
    setSavedProviderMatches((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function bookProvider(id: string) {
    setBookedProviders((prev) => (prev.includes(id) ? prev : [...prev, id]));
    award("Experience", 30);
  }

  function joinCircle(id: string) {
    setJoinedCircles((prev) => (prev.includes(id) ? prev : [...prev, id]));
    award("Community", 20);
  }

  return (
    <WellnessContext.Provider
      value={{
        checkIn: normalizedCheckIn,
        updateCheckIn,
        score,
        scoreColor,
        scoreLabel,
        plan,
        foodSignal,
        stamps,
        points,
        award,
        messages,
        addMessage,
        savedProviderMatches,
        saveProviderMatch,
        bookedProviders,
        bookProvider,
        joinedCircles,
        joinCircle,
        language,
        setLanguage,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness(): WellnessContextValue {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error("useWellness must be used inside WellnessProvider");
  return ctx;
}
