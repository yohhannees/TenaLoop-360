"use client";

import { useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const INITIAL = [true, true, false, false, false, false, false];
const GOAL_MIN = 15;

export default function WeeklyStreak() {
  const { logMovement } = useWellness();
  const [done, setDone] = useState<boolean[]>(INITIAL);
  const [minutes, setMinutes] = useState<number[]>([20, 18, 0, 0, 0, 0, 0]);

  const completedDays = done.filter(Boolean).length;
  const totalMinutes = minutes.reduce((a, b) => a + b, 0);

  function toggle(i: number) {
    const wasOff = !done[i];
    setDone((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
    setMinutes((prev) => {
      const next = [...prev];
      next[i] = wasOff ? GOAL_MIN : 0;
      return next;
    });
    if (wasOff) {
      logMovement({
        type: "walking-challenge",
        title: `${DAYS[i]} walk`,
        minutes: GOAL_MIN,
        points: 8,
      });
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Walking challenge</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">This week</h2>

      <div className="mt-1 flex items-center gap-4 text-sm">
        <span className="font-semibold text-[#0A2318]">{completedDays}/7 days</span>
        <span className="text-[#0A2318]/55">{totalMinutes} min total</span>
      </div>

      {/* Day rows */}
      <div className="mt-4 grid gap-2.5">
        {DAYS.map((day, i) => (
          <button
            key={day}
            type="button"
            onClick={() => toggle(i)}
            className="group flex items-center gap-3 text-left"
          >
            <span className={cn(
              "w-8 shrink-0 text-xs font-semibold",
              done[i] ? "text-[#0A2318]" : "text-[#0A2318]/45",
            )}>
              {day}
            </span>

            <div className="relative flex-1 overflow-hidden rounded-full bg-[#0A2318]/8" style={{ height: 10 }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: done[i] ? "100%" : "0%",
                  backgroundColor: "#8C6246",
                }}
              />
            </div>

            <span className={cn(
              "w-14 shrink-0 text-right text-xs font-medium transition",
              done[i] ? "text-[#8C6246]" : "text-[#0A2318]/30 group-hover:text-[#0A2318]/50",
            )}>
              {done[i] ? `${minutes[i]} min` : "Tap to log"}
            </span>
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className={cn(
        "mt-4 rounded-2xl p-3 text-sm",
        completedDays >= 5
          ? "bg-[#0A2318] text-[#D4C1A0]"
          : "bg-[#0A2318]/6 text-[#0A2318]/70",
      )}>
        {completedDays >= 5
          ? `Strong week! ${completedDays} days logged. You've earned your Move streak.`
          : completedDays > 0
            ? `${completedDays} day${completedDays > 1 ? "s" : ""} done. ${5 - completedDays} more to complete your weekly goal.`
            : "Tap a day above to log your walk. Goal: 5 days this week."}
      </div>
    </section>
  );
}
