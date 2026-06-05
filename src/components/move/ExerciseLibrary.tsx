"use client";

import { useState } from "react";
import { Play, Zap } from "lucide-react";
import { Workout, WorkoutCategory, CATEGORY_LABELS, workouts } from "@/lib/exercises";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<WorkoutCategory | "all"> = ["all", "office", "strength", "flex", "cardio", "recovery"];

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     "bg-[#D4C1A0]/40 text-[#0A2318]",
  intermediate: "bg-[#8C6246]/15 text-[#8C6246]",
};

type Props = { onStart: (w: Workout) => void; completedIds: string[] };

export default function ExerciseLibrary({ onStart, completedIds }: Props) {
  const [filter, setFilter] = useState<WorkoutCategory | "all">("all");

  const visible = filter === "all" ? workouts : workouts.filter((w) => w.category === filter);

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm">
      <p className="text-xs font-bold uppercase text-[#8C6246]">TenaMove</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Choose a workout</h2>
      <p className="mt-1 text-sm text-[#0A2318]/65">
        6 workouts · live timers · no equipment needed
      </p>

      {/* Category filter */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "h-8 shrink-0 rounded-full px-4 text-xs font-semibold transition",
              filter === cat
                ? "bg-[#0A2318] text-[#E8EDE7]"
                : "bg-[#0A2318]/8 text-[#0A2318]/65 hover:bg-[#0A2318]/14",
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Workout cards */}
      <div className="mt-4 grid gap-3">
        {visible.map((workout) => {
          const done = completedIds.includes(workout.id);

          return (
            <div
              key={workout.id}
              className={cn(
                "rounded-[1.5rem] border p-4 transition",
                done ? "border-[#0A2318] bg-[#0A2318]" : "border-[#0A2318]/10 bg-[#E5EAE3]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("font-semibold", done ? "text-[#E8EDE7]" : "text-[#0A2318]")}>
                      {workout.title}
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", done ? "bg-white/10 text-[#D4C1A0]" : DIFFICULTY_COLOR[workout.difficulty])}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <p className={cn("mt-1 truncate text-sm", done ? "text-[#E8EDE7]/65" : "text-[#0A2318]/60")}>
                    {workout.subtitle}
                  </p>

                  {/* Meta row */}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className={cn("text-xs font-medium", done ? "text-[#D4C1A0]" : "text-[#8C6246]")}>
                      {workout.duration}
                    </span>
                    <span className={cn("text-xs", done ? "text-[#E8EDE7]/45" : "text-[#0A2318]/45")}>
                      {workout.steps.length} steps
                    </span>
                    <span className={cn("flex items-center gap-1 text-xs font-medium", done ? "text-[#D4C1A0]/70" : "text-[#0A2318]/50")}>
                      <Zap size={11} />
                      +{workout.points} pts
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStart(workout)}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition",
                    done
                      ? "bg-[#D4C1A0]/20 text-[#D4C1A0] hover:bg-[#D4C1A0]/35"
                      : "bg-[#8C6246] text-[#E8EDE7] shadow-sm hover:bg-[#724F38]",
                  )}
                >
                  <Play size={16} fill="currentColor" />
                </button>
              </div>

              {/* Step preview dots */}
              <div className="mt-3 flex gap-1">
                {workout.steps.map((s) => (
                  <span
                    key={s.id}
                    title={s.name}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      done ? "bg-[#D4C1A0]/30" : "bg-[#0A2318]/12",
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
