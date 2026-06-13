"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Clock, Plus, X } from "lucide-react";
import { getFoodSignal } from "@/lib/foods";
import { FoodSignal } from "@/lib/types";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

type MealSlot = "Breakfast" | "Snack" | "Lunch" | "Dinner";

type MealEntry = {
  id: string;
  slot: MealSlot;
  text: string;
  signal: FoodSignal;
  time: string;
};

type ApiMeal = {
  id: string;
  slot: string | null;
  text: string;
  risk: string | null;
  score: number | null;
  createdAt: string;
};

const SLOTS: { slot: MealSlot; marker: string; window: string }[] = [
  { slot: "Breakfast", marker: "AM", window: "6-10 AM" },
  { slot: "Snack", marker: "SN", window: "10 AM-12" },
  { slot: "Lunch", marker: "NO", window: "12-3 PM" },
  { slot: "Dinner", marker: "PM", window: "6-9 PM" },
];

const RISK_COLOR: Record<string, string> = {
  Low: "#0A2318",
  Medium: "#8C6246",
  High: "#C4503A",
};

export default function DailyMealLog({
  onMealSelect,
}: {
  onMealSelect: (text: string) => void;
}) {
  const { logMeal } = useWellness();
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [open, setOpen] = useState<MealSlot | null>("Breakfast");
  const [adding, setAdding] = useState<MealSlot | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingSlot, setSavingSlot] = useState<MealSlot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadMeals();
  }, []);

  async function loadMeals() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/food/meals", { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as {
        meals?: ApiMeal[];
        error?: string;
      } | null;

      if (!response.ok) throw new Error(data?.error || "Meal log could not be loaded.");
      setEntries((data?.meals ?? []).filter(isToday).map(toMealEntry).reverse());
    } catch (err) {
      setEntries([]);
      setError(err instanceof Error ? err.message : "Meal log could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitEntry(slot: MealSlot) {
    if (!draft.trim() || savingSlot) return;
    setSavingSlot(slot);
    setError("");

    try {
      const mealText = draft.trim();
      const saved = await logMeal(mealText, slot);
      if (!saved) {
        throw new Error("Meal could not be saved. Sign in and check the database connection.");
      }

      onMealSelect(mealText);
      setDraft("");
      setAdding(null);
      await loadMeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Meal could not be saved.");
    } finally {
      setSavingSlot(null);
    }
  }

  const logged = entries.length;
  const dayScore =
    logged === 0
      ? null
      : Math.round(entries.reduce((sum, entry) => sum + entry.signal.score, 0) / logged);

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">Today&apos;s log</p>
          <h2 className="font-serif text-2xl text-[#0A2318]">
            {logged === 0 ? "No meals logged yet" : `${logged} meal${logged > 1 ? "s" : ""} logged`}
          </h2>
        </div>
        {dayScore !== null && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-[#0A2318]/40">Day avg</p>
            <p
              className="font-serif text-3xl font-bold"
              style={{
                color: dayScore >= 70 ? "#0A2318" : dayScore >= 55 ? "#8C6246" : "#C4503A",
              }}
            >
              {dayScore}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        {isLoading && (
          <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] px-4 py-3 text-sm text-[#0A2318]/55">
            Loading meals from your account...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-[#C4503A]/20 bg-[#C4503A]/8 px-4 py-3 text-sm font-semibold text-[#C4503A]">
            {error}
          </div>
        )}

        {SLOTS.map(({ slot, marker, window }) => {
          const slotEntries = entries.filter((entry) => entry.slot === slot);
          const isOpen = open === slot;
          const isAdding = adding === slot;

          return (
            <div key={slot} className="overflow-hidden rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : slot)}
                className="flex w-full min-w-0 items-center gap-3 px-4 py-3 text-left"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0A2318]/8 text-[10px] font-bold text-[#0A2318]/55">
                  {marker}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-[#0A2318]">{slot}</span>
                  <span className="ml-2 text-xs text-[#0A2318]/40">{window}</span>
                </div>
                {slotEntries.length > 0 && (
                  <span className="rounded-full bg-[#0A2318]/8 px-2 py-0.5 text-xs font-semibold text-[#0A2318]/65">
                    {slotEntries.length}
                  </span>
                )}
                <ChevronDown
                  size={15}
                  className={cn("shrink-0 text-[#0A2318]/35 transition-transform", isOpen && "rotate-180")}
                />
              </button>

              {isOpen && (
                <div className="grid gap-2 border-t border-[#0A2318]/8 px-4 pb-3 pt-2">
                  {slotEntries.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => onMealSelect(entry.text)}
                      className="flex cursor-pointer items-start gap-2 rounded-xl bg-white/65 px-3 py-2 text-left transition hover:bg-white/90"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#0A2318]">{entry.text}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-[#0A2318]/40">
                            <Clock size={9} />
                            {entry.time}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${RISK_COLOR[entry.signal.risk]}18`,
                              color: RISK_COLOR[entry.signal.risk],
                            }}
                          >
                            {entry.signal.risk} - {entry.signal.score}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}

                  {slotEntries.length === 0 && !isAdding && (
                    <div className="rounded-xl border border-dashed border-[#0A2318]/12 bg-white/35 px-3 py-3 text-xs leading-5 text-[#0A2318]/45">
                      No {slot.toLowerCase()} logged yet. Add the meal when you are ready and it will save to your account history.
                    </div>
                  )}

                  {isAdding ? (
                    <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                      <input
                        autoFocus
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void submitEntry(slot);
                        }}
                        placeholder={`What did you eat for ${slot.toLowerCase()}?`}
                        className="h-10 min-w-0 flex-1 rounded-full border border-[#0A2318]/12 bg-white px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                      />
                      <button
                        type="button"
                        onClick={() => submitEntry(slot)}
                        disabled={savingSlot !== null}
                        className="h-10 rounded-full bg-[#8C6246] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38] disabled:opacity-55"
                      >
                        {savingSlot === slot ? "Saving" : "Log"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdding(null)}
                        className="grid h-10 w-full place-items-center rounded-full border border-[#0A2318]/12 text-[#0A2318]/45 sm:w-10"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAdding(slot)}
                      className="flex h-9 items-center gap-2 rounded-full border border-dashed border-[#0A2318]/18 px-4 text-xs font-medium text-[#0A2318]/45 transition hover:border-[#8C6246] hover:text-[#0A2318]/70"
                    >
                      <Plus size={12} />
                      Add {slot.toLowerCase()}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function toMealEntry(meal: ApiMeal): MealEntry {
  const signal = getFoodSignal(meal.text);

  return {
    id: meal.id,
    slot: toMealSlot(meal.slot),
    text: meal.text,
    signal: {
      ...signal,
      risk:
        meal.risk === "Low" || meal.risk === "Medium" || meal.risk === "High"
          ? meal.risk
          : signal.risk,
      score: typeof meal.score === "number" ? meal.score : signal.score,
    },
    time: formatTime(meal.createdAt),
  };
}

function toMealSlot(slot: string | null): MealSlot {
  if (slot === "Breakfast" || slot === "Snack" || slot === "Lunch" || slot === "Dinner") {
    return slot;
  }

  return "Snack";
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function isToday(meal: ApiMeal) {
  const date = new Date(meal.createdAt);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
