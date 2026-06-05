"use client";

import { useState } from "react";
import { Clock, Plus, X } from "lucide-react";
import { getFoodSignal } from "@/lib/foods";
import { FoodSignal } from "@/lib/types";
import { cn } from "@/lib/utils";

type MealSlot = "Breakfast" | "Snack" | "Lunch" | "Dinner";

type MealEntry = {
  id: string;
  slot: MealSlot;
  text: string;
  signal: FoodSignal;
  time: string;
};

const SLOTS: { slot: MealSlot; icon: string; window: string; color: string }[] = [
  { slot: "Breakfast", icon: "🌅", window: "6 – 10 AM",  color: "#D4C1A0" },
  { slot: "Snack",     icon: "☕", window: "10 AM – 12", color: "#C4956A" },
  { slot: "Lunch",     icon: "☀️", window: "12 – 3 PM",  color: "#8C6246" },
  { slot: "Dinner",    icon: "🌙", window: "6 – 9 PM",   color: "#0A2318" },
];

const SEED_ENTRIES: MealEntry[] = [
  {
    id: "seed-1",
    slot: "Breakfast",
    text: "Ful, egg, dabo",
    signal: getFoodSignal("Ful, egg, dabo"),
    time: "07:30",
  },
  {
    id: "seed-2",
    slot: "Snack",
    text: "Coffee with sugar, no food",
    signal: getFoodSignal("Coffee with sugar, no food"),
    time: "10:00",
  },
];

const SCORE_COLOR: Record<string, string> = {
  Low:    "#0A2318",
  Medium: "#8C6246",
  High:   "#C4503A",
};

export default function DailyMealLog({
  onMealSelect,
}: {
  onMealSelect: (text: string) => void;
}) {
  const [entries, setEntries] = useState<MealEntry[]>(SEED_ENTRIES);
  const [adding, setAdding] = useState<MealSlot | null>(null);
  const [draft, setDraft] = useState("");

  function submitEntry(slot: MealSlot) {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const entry: MealEntry = {
      id: `${Date.now()}`,
      slot,
      text: draft.trim(),
      signal: getFoodSignal(draft.trim()),
      time,
    };
    setEntries((prev) => [...prev, entry]);
    setDraft("");
    setAdding(null);
    onMealSelect(draft.trim());
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const dayScore =
    entries.length === 0
      ? null
      : Math.round(entries.reduce((sum, e) => sum + e.signal.score, 0) / entries.length);

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">Today's log</p>
          <h2 className="font-serif text-3xl text-[#0A2318]">Daily meal timeline</h2>
        </div>
        {dayScore !== null && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase text-[#0A2318]/45">Day avg</span>
            <span
              className="font-serif text-3xl font-bold"
              style={{ color: dayScore >= 70 ? "#0A2318" : dayScore >= 55 ? "#8C6246" : "#C4503A" }}
            >
              {dayScore}
            </span>
          </div>
        )}
      </div>

      {/* Slots */}
      <div className="mt-5 grid gap-3">
        {SLOTS.map(({ slot, icon, window: w, color }) => {
          const slotEntries = entries.filter((e) => e.slot === slot);
          const isAdding = adding === slot;

          return (
            <div
              key={slot}
              className="rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3"
            >
              {/* Slot header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0A2318]">{slot}</p>
                    <p className="text-[10px] text-[#0A2318]/45">{w}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdding(isAdding ? null : slot)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition",
                    isAdding
                      ? "bg-[#0A2318] text-[#E8EDE7]"
                      : "bg-[#0A2318]/8 text-[#0A2318]/65 hover:bg-[#0A2318]/14",
                  )}
                >
                  {isAdding ? <X size={13} /> : <Plus size={13} />}
                </button>
              </div>

              {/* Logged entries for this slot */}
              {slotEntries.length > 0 && (
                <div className="mt-2 grid gap-2">
                  {slotEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-2 rounded-xl bg-white/60 px-3 py-2 cursor-pointer hover:bg-white/90 transition"
                      onClick={() => onMealSelect(entry.text)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-[#0A2318]">
                          {entry.text}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <Clock size={10} className="text-[#0A2318]/35" />
                          <span className="text-[10px] text-[#0A2318]/45">{entry.time}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: SCORE_COLOR[entry.signal.risk] + "18",
                              color: SCORE_COLOR[entry.signal.risk],
                            }}
                          >
                            {entry.signal.risk} risk · {entry.signal.score}/100
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeEntry(entry.id); }}
                        className="text-[#0A2318]/25 hover:text-[#0A2318]/60 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add form */}
              {isAdding && (
                <div className="mt-2 flex gap-2">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitEntry(slot)}
                    placeholder={`What did you eat for ${slot.toLowerCase()}?`}
                    className="h-10 flex-1 rounded-full border border-[#0A2318]/12 bg-white px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                  />
                  <button
                    type="button"
                    onClick={() => submitEntry(slot)}
                    className="h-10 rounded-full bg-[#8C6246] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38]"
                  >
                    Log
                  </button>
                </div>
              )}

              {/* Empty state */}
              {slotEntries.length === 0 && !isAdding && (
                <p className="mt-1.5 text-xs text-[#0A2318]/35">
                  Not logged yet — tap + to add
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
