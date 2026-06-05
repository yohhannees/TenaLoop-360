"use client";

import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

const GOAL = 8;

const TIPS = [
  "Drink a glass of water before your next meal.",
  "Add lemon or mint to make water more enjoyable.",
  "Herbal tea counts toward your daily water goal.",
  "Coffee and sugary drinks do not count — they dehydrate.",
  "Drinking water 30 minutes before eating reduces overeating.",
];

export default function HydrationTracker() {
  const { checkIn, updateCheckIn, award } = useWellness();
  const cups = checkIn.water;

  function add(amount: number) {
    const next = Math.min(GOAL, cups + amount);
    updateCheckIn("water", next);
    if (next >= GOAL && cups < GOAL) {
      award("Health", 12);
    }
  }

  function remove() {
    updateCheckIn("water", Math.max(0, cups - 1));
  }

  const pct      = (cups / GOAL) * 100;
  const goalMet  = cups >= GOAL;
  const tip      = TIPS[cups % TIPS.length];

  return (
    <section className="w-full min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Hydration</p>
      <h2 className="font-serif text-2xl text-[#0A2318]">Water tracker</h2>

      {/* Cup grid */}
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {Array.from({ length: GOAL }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => i < cups ? remove() : add(1)}
            title={i < cups ? "Tap to remove" : "Tap to add"}
            className="group flex flex-col items-center gap-1"
          >
            <span className="text-xl leading-none transition-transform group-hover:scale-110">
              {i < cups ? "🥛" : "🫙"}
            </span>
            <span className={cn("h-1 w-full rounded-full transition", i < cups ? "bg-[#0A2318]" : "bg-[#0A2318]/12")} />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="font-medium text-[#0A2318]/65">
            {cups} of {GOAL} cups
          </span>
          <span className={cn("font-bold", goalMet ? "text-[#0A2318]" : "text-[#0A2318]/45")}>
            {goalMet ? "Goal reached! +12 pts" : `${GOAL - cups} to go`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#0A2318]/8">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: goalMet ? "#8C6246" : "#0A2318" }}
          />
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => add(1)}
          disabled={cups >= GOAL}
          className="h-10 flex-1 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A] disabled:opacity-40"
        >
          + 1 cup
        </button>
        <button
          type="button"
          onClick={() => add(2)}
          disabled={cups >= GOAL}
          className="h-10 flex-1 rounded-full border border-[#0A2318]/12 text-sm font-semibold text-[#0A2318]/72 transition hover:border-[#0A2318]/30 disabled:opacity-40"
        >
          + 2 cups
        </button>
      </div>

      {/* Tip */}
      <p className="mt-3 text-xs leading-5 text-[#0A2318]/55">{tip}</p>
    </section>
  );
}
