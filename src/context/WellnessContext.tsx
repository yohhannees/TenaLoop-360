"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { CheckIn, ChatMessage, Language, Stamp } from "@/lib/types";
import { calculateScore, buildPlan, getScoreColor, getScoreLabel } from "@/lib/score";
import { getFoodSignal } from "@/lib/foods";

const DEFAULT_CHECK_IN: CheckIn = {
  mood: "Steady",
  stress: 7,
  sleep: 5,
  energy: 5,
  movement: 12,
  water: 4,
  meal: "Firfir and sweet coffee",
  support: "Low",
  fasting: false,
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
  const [bookedProviders, setBookedProviders] = useState<string[]>([]);
  const [joinedCircles, setJoinedCircles] = useState<string[]>(["student-stress"]);
  const [language, setLanguage] = useState<Language>("English");

  const score = useMemo(() => calculateScore(checkIn), [checkIn]);
  const scoreColor = useMemo(() => getScoreColor(score), [score]);
  const scoreLabel = useMemo(() => getScoreLabel(score), [score]);
  const plan = useMemo(() => buildPlan(checkIn, score), [checkIn, score]);
  const foodSignal = useMemo(() => getFoodSignal(checkIn.meal), [checkIn.meal]);

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
        checkIn,
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
