"use client";

import { useEffect, useRef, useState } from "react";
import { useWellness } from "@/context/WellnessContext";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out" | "idle";

const BOX_SEQUENCE: { phase: Phase; label: string; duration: number }[] = [
  { phase: "inhale", label: "Breathe in", duration: 4 },
  { phase: "hold-in", label: "Hold", duration: 4 },
  { phase: "exhale", label: "Breathe out", duration: 4 },
  { phase: "hold-out", label: "Hold", duration: 4 },
];

const PHASE_COLORS: Record<Phase | "idle", string> = {
  inhale: "#0A2318",
  "hold-in": "#8C6246",
  exhale: "#D4C1A0",
  "hold-out": "#724F38",
  idle: "#8A978D",
};

export default function BreathingTimer() {
  const { award } = useWellness();
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BOX_SEQUENCE[0].duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TARGET_CYCLES = 3;
  const current = BOX_SEQUENCE[stepIndex];
  const color = running ? PHASE_COLORS[current.phase] : PHASE_COLORS.idle;
  const progress = running ? ((current.duration - secondsLeft) / current.duration) * 100 : 0;

  function start() {
    setDone(false);
    setCyclesCompleted(0);
    setStepIndex(0);
    setSecondsLeft(BOX_SEQUENCE[0].duration);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        setStepIndex((si) => {
          const next = (si + 1) % BOX_SEQUENCE.length;
          if (next === 0) {
            setCyclesCompleted((c) => {
              const newCount = c + 1;
              if (newCount >= TARGET_CYCLES) {
                setRunning(false);
                setDone(true);
                award("Mind", 20);
              }
              return newCount;
            });
          }
          setSecondsLeft(BOX_SEQUENCE[next].duration);
          return next;
        });

        return BOX_SEQUENCE[0].duration;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, award]);

  return (
    <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Breathing reset</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Box breathing - 3 cycles</h2>
      <p className="mt-1 text-sm text-[#0A2318]/64">
        Inhale 4, hold 4, exhale 4, hold 4. Three cycles takes 48 seconds.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {/* Circle */}
        <div
          className="relative grid h-36 w-36 place-items-center rounded-full transition-all duration-1000"
          style={{
            background: `conic-gradient(${color} ${progress * 3.6}deg, rgb(10 35 24 / 0.12) 0deg)`,
          }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-[#E5EAE3] text-center">
            {done ? (
              <span className="text-sm font-semibold text-[#8C6246]">Done +20 pts</span>
            ) : running ? (
              <>
                <span className="text-xs font-medium text-[#0A2318]/58">{current.label}</span>
                <span className="font-serif text-4xl" style={{ color }}>{secondsLeft}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-[#0A2318]/58">Ready</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#0A2318]/58">
          {Array.from({ length: TARGET_CYCLES }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: i < cyclesCompleted ? "#8C6246" : "rgb(10 35 24 / 0.12)" }}
            />
          ))}
          <span className="ml-1">{cyclesCompleted}/{TARGET_CYCLES} cycles</span>
        </div>

        <div className="flex gap-3">
          {!running && !done && (
            <button
              type="button"
              onClick={start}
              className="h-11 rounded-full bg-[#0A2318] px-6 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
            >
              Start reset
            </button>
          )}
          {running && (
            <button
              type="button"
              onClick={stop}
              className="h-11 rounded-full border border-[#0A2318]/18 px-6 text-sm font-semibold text-[#0A2318]"
            >
              Stop
            </button>
          )}
          {done && (
            <button
              type="button"
              onClick={start}
              className="h-11 rounded-full border border-[#0A2318] px-6 text-sm font-semibold text-[#0A2318] transition hover:bg-[#0A2318] hover:text-[#E8EDE7]"
            >
              Run again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
