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
  inhale: "#0f6b52",
  "hold-in": "#1d84a6",
  exhale: "#c47a16",
  "hold-out": "#7c4f9e",
  idle: "#64756b",
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
    <div className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">Breathing reset</p>
      <h2 className="text-2xl font-semibold">Box breathing · 3 cycles</h2>
      <p className="mt-1 text-sm text-[#52665c]">
        Inhale 4 · Hold 4 · Exhale 4 · Hold 4. Three cycles takes 48 seconds.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        {/* Circle */}
        <div
          className="relative grid h-36 w-36 place-items-center rounded-full transition-all duration-1000"
          style={{
            background: `conic-gradient(${color} ${progress * 3.6}deg, #e5eee8 0deg)`,
          }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
            {done ? (
              <span className="text-sm font-semibold text-[#0f6b52]">Done +20 pts</span>
            ) : running ? (
              <>
                <span className="text-xs font-medium text-[#64756b]">{current.label}</span>
                <span className="text-3xl font-semibold" style={{ color }}>{secondsLeft}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-[#64756b]">Ready</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#64756b]">
          {Array.from({ length: TARGET_CYCLES }).map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: i < cyclesCompleted ? "#0f6b52" : "#e5eee8" }}
            />
          ))}
          <span className="ml-1">{cyclesCompleted}/{TARGET_CYCLES} cycles</span>
        </div>

        <div className="flex gap-3">
          {!running && !done && (
            <button
              type="button"
              onClick={start}
              className="h-11 rounded-md bg-[#0f6b52] px-6 text-sm font-semibold text-white transition hover:bg-[#0b5944]"
            >
              Start reset
            </button>
          )}
          {running && (
            <button
              type="button"
              onClick={stop}
              className="h-11 rounded-md border border-[#cddbd3] px-6 text-sm font-semibold text-[#33483e]"
            >
              Stop
            </button>
          )}
          {done && (
            <button
              type="button"
              onClick={start}
              className="h-11 rounded-md border border-[#0f6b52] px-6 text-sm font-semibold text-[#0f6b52]"
            >
              Run again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
