"use client";

import { useState } from "react";
import { Workout } from "@/lib/exercises";
import BreathingTimer from "@/components/move/BreathingTimer";
import WeeklyStreak from "@/components/move/WeeklyStreak";
import ExerciseLibrary from "@/components/move/ExerciseLibrary";
import ExercisePlayer from "@/components/move/ExercisePlayer";

export default function MovePage() {
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  function startWorkout(workout: Workout) {
    setActiveWorkout(workout);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finishWorkout() {
    if (activeWorkout && !completedIds.includes(activeWorkout.id)) {
      setCompletedIds((prev) => [...prev, activeWorkout.id]);
    }
    setActiveWorkout(null);
  }

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      {/* Left column */}
      <div className="grid min-w-0 content-start gap-5">
        <BreathingTimer />
        <WeeklyStreak />
      </div>

      {/* Right column — player or library */}
      <div className="min-w-0">
        {activeWorkout ? (
          <ExercisePlayer workout={activeWorkout} onClose={finishWorkout} />
        ) : (
          <ExerciseLibrary onStart={startWorkout} completedIds={completedIds} />
        )}
      </div>
    </div>
  );
}
