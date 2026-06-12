"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

type Routine = {
  id: string;
  title: string;
  duration: string;
  type: string;
  steps: string[];
};

const ROUTINES: Routine[] = [
  {
    id: "office-break",
    title: "Office recovery break",
    duration: "5 min",
    type: "Posture & reset",
    steps: [
      "Stand up and roll your shoulders backward 10 times.",
      "Do 10 slow bodyweight squats, keeping knees over toes.",
      "Reach both arms overhead and hold for 10 seconds.",
      "Do 2 minutes of slow nasal breathing - in for 4, out for 4.",
      "Walk to a window, look outside for 30 seconds, then return.",
    ],
  },
  {
    id: "beginner-walk",
    title: "Beginner walking challenge",
    duration: "15-20 min",
    type: "Movement",
    steps: [
      "Put on comfortable shoes and step outside.",
      "Walk at a comfortable pace - not a rush, not a stroll.",
      "Keep your phone in your pocket for the first 10 minutes.",
      "Notice your breathing and aim for nasal breathing throughout.",
      "Return slowly and drink a full glass of water.",
    ],
  },
  {
    id: "morning-energy",
    title: "Morning energy routine",
    duration: "8 min",
    type: "Wake-up",
    steps: [
      "Start with 10 jumping jacks or marching in place.",
      "Do 10 slow arm circles, then 10 in the other direction.",
      "Hold a wall sit for 20 to 30 seconds.",
      "Do 10 slow push-ups or modified knee push-ups.",
      "Finish with 1 minute of slow deep breathing.",
    ],
  },
  {
    id: "stress-release",
    title: "Stress release stretch",
    duration: "6 min",
    type: "Recovery",
    steps: [
      "Sit upright and drop your chin slowly to your chest for 10 seconds.",
      "Roll your head gently to each side, holding 10 seconds each.",
      "Reach one arm across your chest and hold for 15 seconds, then switch.",
      "Interlace your fingers, stretch arms overhead, hold for 15 seconds.",
      "Sit quietly for 1 minute and breathe slowly.",
    ],
  },
];

export default function WorkoutRoutines() {
  const { logMovement } = useWellness();
  const [expanded, setExpanded] = useState<string | null>("office-break");
  const [completed, setCompleted] = useState<string[]>([]);

  function complete(id: string) {
    if (!completed.includes(id)) {
      setCompleted((prev) => [...prev, id]);
      const routine = ROUTINES.find((item) => item.id === id);
      logMovement({
        type: "routine",
        workoutId: id,
        title: routine?.title,
        points: 18,
      });
    }
  }

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">TenaMove</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Movement routines</h2>
      <p className="mt-1 text-sm text-[#0A2318]/64">
        No gym required. Pick one and earn your Move stamp.
      </p>

      <div className="mt-5 grid gap-3">
        {ROUTINES.map((routine) => {
          const isOpen = expanded === routine.id;
          const isDone = completed.includes(routine.id);

          return (
            <div
              key={routine.id}
              className={cn(
                "rounded-[1.5rem] border p-4 transition",
                isDone
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                  : "border-[#0A2318]/10 bg-[#E5EAE3]",
              )}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : routine.id)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "font-semibold",
                      isDone ? "text-[#E8EDE7]" : "text-[#0A2318]",
                    )}
                  >
                    {routine.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isDone
                        ? "bg-[#E8EDE7]/10 text-[#D4C1A0]"
                        : "bg-[#D4C1A0]/35 text-[#0A2318]",
                    )}
                  >
                    {routine.duration}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isDone
                        ? "bg-[#E8EDE7]/10 text-[#E8EDE7]/78"
                        : "bg-[#E8EDE7] text-[#8C6246]",
                    )}
                  >
                    {routine.type}
                  </span>
                  {isDone && (
                    <span className="rounded-full bg-[#D4C1A0] px-2.5 py-0.5 text-xs font-semibold text-[#0A2318]">
                      Done
                    </span>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className={cn(
                    "mt-0.5 shrink-0 transition",
                    isOpen && "rotate-180",
                    isDone ? "text-[#E8EDE7]/70" : "text-[#0A2318]/58",
                  )}
                />
              </button>

              {isOpen && (
                <div className="mt-3 grid gap-2">
                  {routine.steps.map((step, i) => (
                    <div
                      key={step}
                      className={cn(
                        "flex gap-3 text-sm leading-6",
                        isDone ? "text-[#E8EDE7]/68" : "text-[#0A2318]/64",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 h-5 w-5 shrink-0 rounded-full text-center text-xs font-semibold",
                          isDone
                            ? "bg-[#E8EDE7]/10 text-[#D4C1A0]"
                            : "bg-[#0A2318] text-[#E8EDE7]",
                        )}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => complete(routine.id)}
                      className="mt-2 h-10 rounded-full bg-[#8C6246] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38]"
                    >
                      Mark complete - earn 18 pts
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
