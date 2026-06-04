"use client";

import { useState } from "react";
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
      "Do 2 minutes of slow nasal breathing — in for 4, out for 4.",
      "Walk to a window, look outside for 30 seconds, then return.",
    ],
  },
  {
    id: "beginner-walk",
    title: "Beginner walking challenge",
    duration: "15–20 min",
    type: "Movement",
    steps: [
      "Put on comfortable shoes and step outside.",
      "Walk at a comfortable pace — not a rush, not a stroll.",
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
  const { award } = useWellness();
  const [expanded, setExpanded] = useState<string | null>("office-break");
  const [completed, setCompleted] = useState<string[]>([]);

  function complete(id: string) {
    if (!completed.includes(id)) {
      setCompleted((prev) => [...prev, id]);
      award("Move", 18);
    }
  }

  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">TenaMove</p>
      <h2 className="text-2xl font-semibold">Movement routines</h2>
      <p className="mt-1 text-sm text-[#52665c]">No gym required. Pick one and earn your Move stamp.</p>

      <div className="mt-5 grid gap-3">
        {ROUTINES.map((routine) => {
          const isOpen = expanded === routine.id;
          const isDone = completed.includes(routine.id);

          return (
            <div
              key={routine.id}
              className={cn(
                "rounded-md border p-3 transition",
                isDone ? "border-[#0f6b52] bg-[#eef6f2]" : "border-[#dde8e1] bg-[#fbfdfb]",
              )}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : routine.id)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#14231d]">{routine.title}</span>
                    <span className="rounded-md bg-[#ecf2fb] px-2 py-0.5 text-xs font-medium text-[#28506f]">
                      {routine.duration}
                    </span>
                    <span className="rounded-md bg-[#f8eadf] px-2 py-0.5 text-xs font-medium text-[#88471f]">
                      {routine.type}
                    </span>
                    {isDone && (
                      <span className="rounded-md bg-[#eef6f2] px-2 py-0.5 text-xs font-semibold text-[#0f6b52]">
                        Done
                      </span>
                    )}
                  </div>
                </div>
                <span className="mt-0.5 shrink-0 text-sm text-[#64756b]">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="mt-3 grid gap-2">
                  {routine.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm leading-6 text-[#52665c]">
                      <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#eef6f2] text-center text-xs font-semibold text-[#0f6b52]">
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => complete(routine.id)}
                      className="mt-2 h-10 rounded-md bg-[#1d84a6] px-4 text-sm font-semibold text-white transition hover:bg-[#1670a0]"
                    >
                      Mark complete · earn 18 pts
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
