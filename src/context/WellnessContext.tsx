"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { AuthUser, CheckIn, ChatMessage, Language, Stamp, UserHealthProfile, WellnessBackendState } from "@/lib/types";
import { calculateScore, buildPlan, getScoreColor, getScoreLabel } from "@/lib/score";
import { getFoodSignal } from "@/lib/foods";
import { DEFAULT_CHECK_IN, DEFAULT_STAMPS, INITIAL_MESSAGES } from "@/lib/defaults";

function normalizeCheckIn(checkIn: CheckIn): CheckIn {
  return {
    ...DEFAULT_CHECK_IN,
    ...checkIn,
    painAreas: checkIn.painAreas ?? DEFAULT_CHECK_IN.painAreas,
  };
}

type WellnessContextValue = {
  user: AuthUser | null;
  healthProfile: UserHealthProfile | null;
  isBackendReady: boolean;
  // check-in
  checkIn: CheckIn;
  updateCheckIn: <K extends keyof CheckIn>(key: K, value: CheckIn[K]) => void;
  saveCheckIn: () => void;
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
  bookProvider: (id: string, details?: BookingDetails) => void;
  // circles
  joinedCircles: string[];
  joinCircle: (id: string) => void;
  logCircleCheckIn: (circleId: string, mood: string, note?: string) => void;
  logCircleChallenge: (circleId: string, challengeId: string, points: number) => void;
  // food and movement
  logMeal: (text: string, slot?: string, photoUrl?: string | null) => Promise<boolean>;
  logHydration: (cups: number, goal?: number) => void;
  logMovement: (details: MovementDetails) => void;
  // language
  language: Language;
  setLanguage: (lang: Language) => void;
  // profile
  refreshProfile: () => Promise<void>;
};

type BookingDetails = {
  providerName?: string;
  bookingRef?: string;
  bookingDate?: string;
  slot?: string;
  customerName?: string;
  phone?: string;
  note?: string;
  paymentMethod?: string;
  price?: string;
};

type MovementDetails = {
  type: string;
  workoutId?: string;
  title?: string;
  durationSeconds?: number;
  minutes?: number;
  cycles?: number;
  points?: number;
};

const WellnessContext = createContext<WellnessContextValue | null>(null);

export function WellnessProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [healthProfile, setHealthProfile] = useState<UserHealthProfile | null>(null);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [checkIn, setCheckIn] = useState<CheckIn>(DEFAULT_CHECK_IN);
  const [stamps, setStamps] = useState<Stamp[]>(DEFAULT_STAMPS);
  const [points, setPoints] = useState(180);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [savedProviderMatches, setSavedProviderMatches] = useState<string[]>([]);
  const [bookedProviders, setBookedProviders] = useState<string[]>([]);
  const [joinedCircles, setJoinedCircles] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>("English");
  const statePatchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedCheckIn = useMemo(() => normalizeCheckIn(checkIn), [checkIn]);
  const score = useMemo(() => calculateScore(normalizedCheckIn), [normalizedCheckIn]);
  const scoreColor = useMemo(() => getScoreColor(score), [score]);
  const scoreLabel = useMemo(() => getScoreLabel(score), [score]);
  const plan = useMemo(() => buildPlan(normalizedCheckIn, score), [normalizedCheckIn, score]);
  const foodSignal = useMemo(() => getFoodSignal(normalizedCheckIn.meal), [normalizedCheckIn.meal]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const response = await fetch("/api/me", { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json().catch(() => null)) as {
          state?: WellnessBackendState;
        } | null;

        if (!cancelled && data?.state) {
          applyBackendState(data.state);
          setIsBackendReady(true);
        }
      } catch {
        // Local demo mode remains available when the backend is not configured.
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
      if (statePatchTimer.current) clearTimeout(statePatchTimer.current);
    };
  }, []);

  function applyBackendState(state: WellnessBackendState) {
    setUser(state.user);
    setHealthProfile(state.healthProfile ?? null);
    setCheckIn(normalizeCheckIn(state.checkIn));
    setStamps(state.stamps);
    setPoints(state.points);
    setMessages(state.messages.length > 0 ? state.messages : INITIAL_MESSAGES);
    setSavedProviderMatches(state.savedProviderMatches);
    setBookedProviders(state.bookedProviders);
    setJoinedCircles(state.joinedCircles);
    setLanguage(state.language);
  }

  async function refreshProfile() {
    const res = await fetch("/api/me").catch(() => null);
    const data = (await res?.json().catch(() => null)) as { state?: WellnessBackendState } | null;
    if (data?.state) applyBackendState(data.state);
  }

  function updateCheckIn<K extends keyof CheckIn>(key: K, value: CheckIn[K]) {
    setCheckIn((prev) => {
      const next = { ...prev, [key]: value };
      queueStatePatch({ checkIn: next });
      return next;
    });
  }

  function optimisticAward(stamp: Stamp, amount: number) {
    setStamps((prev) => (prev.includes(stamp) ? prev : [...prev, stamp]));
    setPoints((prev) => prev + amount);
  }

  function award(stamp: Stamp, amount: number) {
    optimisticAward(stamp, amount);
    void postStateful("/api/passport/award", {
      stamp,
      points: amount,
      source: "client-action",
    });
  }

  function saveCheckIn() {
    optimisticAward("Health", 15);
    void postStateful("/api/checkins", { checkIn }).then(() =>
      postStateful("/api/passport/award", {
        stamp: "Health",
        points: 15,
        source: "rooted-check-in",
      }),
    );
  }

  function addMessage(message: ChatMessage) {
    setMessages((prev) => [...prev, message]);
  }

  function saveProviderMatch(id: string) {
    setSavedProviderMatches((prev) => (prev.includes(id) ? prev : [...prev, id]));
    void postStateful("/api/market/provider-matches", {
      providerId: id,
      source: "rooted-body",
    });
  }

  function bookProvider(id: string, details: BookingDetails = {}) {
    const alreadyBooked = bookedProviders.includes(id);
    setBookedProviders((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (!alreadyBooked) optimisticAward("Experience", 30);
    void postStateful("/api/market/bookings", {
      providerId: id,
      bookingDate: details.bookingDate || new Date().toISOString(),
      slot: details.slot || "Selected in app",
      ...details,
    });
  }

  function joinCircle(id: string) {
    const alreadyJoined = joinedCircles.includes(id);
    setJoinedCircles((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (!alreadyJoined) optimisticAward("Community", 20);
    void postStateful("/api/circles/memberships", { circleId: id });
  }

  function logMeal(text: string, slot?: string, photoUrl?: string | null) {
    updateCheckIn("meal", text);
    optimisticAward("Food", 15);
    return postStateful("/api/food/meals", {
      text,
      slot,
      photoUrl: photoUrl || undefined,
    });
  }

  function logHydration(cups: number, goal = 8) {
    updateCheckIn("water", cups);
    void postStateful("/api/food/hydration", { cups, goal });
  }

  function logMovement(details: MovementDetails) {
    if (details.points && details.points > 0) {
      optimisticAward("Move", details.points);
    }
    void postStateful("/api/move/sessions", details);
  }

  function logCircleCheckIn(circleId: string, mood: string, note?: string) {
    optimisticAward("Community", 15);
    void postStateful("/api/circles/check-ins", { circleId, mood, note });
  }

  function logCircleChallenge(circleId: string, challengeId: string, challengePoints: number) {
    optimisticAward("Community", challengePoints);
    void postStateful("/api/circles/challenges", {
      circleId,
      challengeId,
      points: challengePoints,
    });
  }

  function setLanguageAndPersist(lang: Language) {
    setLanguage(lang);
    queueStatePatch({ language: lang });
  }

  function queueStatePatch(patch: { checkIn?: CheckIn; language?: Language }) {
    if (statePatchTimer.current) clearTimeout(statePatchTimer.current);
    statePatchTimer.current = setTimeout(() => {
      void fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }).catch(() => {});
    }, 350);
  }

  async function postStateful(endpoint: string, body: Record<string, unknown>) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) return false;
      const data = (await response.json().catch(() => null)) as {
        state?: WellnessBackendState;
      } | null;

      if (data?.state) applyBackendState(data.state);
      return true;
    } catch {
      // Keep the optimistic local experience if the backend is offline.
      return false;
    }
  }

  return (
    <WellnessContext.Provider
      value={{
        checkIn: normalizedCheckIn,
        user,
        healthProfile,
        isBackendReady,
        updateCheckIn,
        saveCheckIn,
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
        logCircleCheckIn,
        logCircleChallenge,
        logMeal,
        logHydration,
        logMovement,
        language,
        setLanguage: setLanguageAndPersist,
        refreshProfile,
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
