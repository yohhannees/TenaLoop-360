"use client";

import { useState } from "react";
import { ChevronDown, Clock, Plus, X } from "lucide-react";
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

const SLOTS: { slot: MealSlot; emoji: string; window: string }[] = [
  { slot: "Breakfast", emoji: "🌅", window: "6–10 AM" },
  { slot: "Snack",     emoji: "☕", window: "10 AM–12" },
  { slot: "Lunch",     emoji: "☀️", window: "12–3 PM" },
  { slot: "Dinner",    emoji: "🌙", window: "6–9 PM" },
];

const RISK_COLOR: Record<string, string> = {
  Low:    "#0A2318",
  Medium: "#8C6246",
  High:   "#C4503A",
};

const SEED: MealEntry[] = [
  { id: "s1", slot: "Breakfast", text: "Ful, egg, dabo",                signal: getFoodSignal("Ful, egg, dabo"),                time: "07:30" },
  { id: "s2", slot: "Snack",     text: "Coffee with sugar, no food",    signal: getFoodSignal("Coffee with sugar, no food"),    time: "10:00" },
];

export default function DailyMealLog({ onMealSelect }: { onMealSelect: (text: string) => void }) {
  const [entries, setEntries]     = useState<MealEntry[]>(SEED);
  const [open, setOpen]           = useState<MealSlot | null>("Breakfast");
  const [adding, setAdding]       = useState<MealSlot | null>(null);
  const [draft, setDraft]         = useState("");

  function submitEntry(slot: MealSlot) {
    if (!draft.trim()) return;
    const now  = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setEntries(prev => [...prev, { id: `${Date.now()}`, slot, text: draft.trim(), signal: getFoodSignal(draft.trim()), time }]);
    onMealSelect(draft.trim());
    setDraft("");
    setAdding(null);
  }

  function remove(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  const logged   = entries.length;
  const dayScore = logged === 0 ? null : Math.round(entries.reduce((s,e) => s + e.signal.score, 0) / logged);

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">Today's log</p>
          <h2 className="font-serif text-2xl text-[#0A2318]">
            {logged === 0 ? "No meals logged yet" : `${logged} meal${logged > 1 ? "s" : ""} logged`}
          </h2>
        </div>
        {dayScore !== null && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-[#0A2318]/40">Day avg</p>
            <p className="font-serif text-3xl font-bold" style={{ color: dayScore >= 70 ? "#0A2318" : dayScore >= 55 ? "#8C6246" : "#C4503A" }}>
              {dayScore}
            </p>
          </div>
        )}
      </div>

      {/* Slot accordion */}
      <div className="mt-4 grid gap-2">
        {SLOTS.map(({ slot, emoji, window: w }) => {
          const slotEntries = entries.filter(e => e.slot === slot);
          const isOpen      = open === slot;
          const isAdding    = adding === slot;

          return (
            <div key={slot} className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] overflow-hidden">

              {/* Slot header row — always visible */}
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : slot)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-base leading-none">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[#0A2318]">{slot}</span>
                  <span className="ml-2 text-xs text-[#0A2318]/40">{w}</span>
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

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-[#0A2318]/8 px-4 pb-3 pt-2 grid gap-2">

                  {/* Logged entries */}
                  {slotEntries.map(entry => (
                    <div
                      key={entry.id}
                      onClick={() => onMealSelect(entry.text)}
                      className="flex cursor-pointer items-start gap-2 rounded-xl bg-white/65 px-3 py-2 transition hover:bg-white/90"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-[#0A2318]">{entry.text}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-[#0A2318]/40">
                            <Clock size={9} />{entry.time}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: RISK_COLOR[entry.signal.risk] + "18", color: RISK_COLOR[entry.signal.risk] }}
                          >
                            {entry.signal.risk} · {entry.signal.score}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); remove(entry.id); }}
                        className="mt-0.5 text-[#0A2318]/25 hover:text-[#0A2318]/60 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Add form or empty state */}
                  {isAdding ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && submitEntry(slot)}
                        placeholder={`What did you eat for ${slot.toLowerCase()}?`}
                        className="h-10 flex-1 min-w-0 rounded-full border border-[#0A2318]/12 bg-white px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                      />
                      <button type="button" onClick={() => submitEntry(slot)}
                        className="h-10 shrink-0 rounded-full bg-[#8C6246] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38]">
                        Log
                      </button>
                      <button type="button" onClick={() => setAdding(null)}
                        className="h-10 w-10 shrink-0 grid place-items-center rounded-full border border-[#0A2318]/12 text-[#0A2318]/45">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAdding(slot)}
                      className="flex h-9 items-center gap-2 rounded-full border border-dashed border-[#0A2318]/18 px-4 text-xs font-medium text-[#0A2318]/45 transition hover:border-[#8C6246] hover:text-[#0A2318]/70"
                    >
                      <Plus size={12} /> Add {slot.toLowerCase()}
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
