"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FASTING_SUGGESTIONS = [
  { meal: "Shiro, gomen, one injera",      note: "Best fasting-break plate. High protein and fiber." },
  { meal: "Beyaynetu with one injera",      note: "Excellent variety. One injera keeps carbs managed." },
  { meal: "Misir wot, atkilt, one injera", note: "Diabetes-friendly. Very high fiber." },
  { meal: "Ful, egg, dabo",                note: "Good protein start to break a morning fast." },
];

type Props = { onSelectMeal: (meal: string) => void };

export default function FastingTimer({ onSelectMeal }: Props) {
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0); // seconds

  useEffect(() => {
    if (!started || startTime === null) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [started, startTime]);

  function begin() {
    const now = Date.now();
    setStartTime(now);
    setStarted(true);
    setElapsed(0);
  }

  function reset() {
    setStarted(false);
    setStartTime(null);
    setElapsed(0);
  }

  const hours   = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const secs    = elapsed % 60;

  const TARGET_HOURS = 16;
  const targetSecs   = TARGET_HOURS * 3600;
  const fraction     = Math.min(1, elapsed / targetSecs);
  const pct          = fraction * 100;

  const isReady      = elapsed >= 12 * 3600; // 12h+ recommend breaking
  const isMilestone  = elapsed > 0 && elapsed % 3600 < 3; // just hit an hour

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Fasting mode</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Fasting timer</h2>

      {!started ? (
        <div className="mt-4 grid gap-3">
          <p className="text-sm text-[#0A2318]/65">
            Start the timer when you begin your fast. It tracks your duration and tells you when to break safely.
          </p>
          <button
            type="button"
            onClick={begin}
            className="h-11 rounded-full bg-[#0A2318] px-6 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
          >
            Start fasting now
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          {/* Ring timer */}
          <div className="flex items-center gap-5">
            <div className="relative grid h-24 w-24 shrink-0 place-items-center">
              <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgb(10 35 24 / 0.08)" strokeWidth="6" />
                <circle cx="48" cy="48" r="40" fill="none"
                  stroke={isReady ? "#8C6246" : "#0A2318"}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={`${251.2 * (1 - fraction)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="relative text-center">
                <span className="block font-serif text-xl font-bold text-[#0A2318]">
                  {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
                </span>
                <span className="block text-[10px] text-[#0A2318]/45">
                  {String(secs).padStart(2, "0")} sec
                </span>
              </div>
            </div>

            <div className="flex-1 grid gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#0A2318]/55">Progress to 16h</span>
                <span className="font-semibold text-[#0A2318]/70">{Math.round(pct)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#0A2318]/8">
                <div className="h-full rounded-full bg-[#0A2318] transition-all duration-1000" style={{ width: `${pct}%` }} />
              </div>

              <p className={cn(
                "mt-1 text-sm font-medium",
                isReady ? "text-[#8C6246]" : "text-[#0A2318]/65",
              )}>
                {isReady
                  ? "Ready to break your fast — see suggestions below."
                  : `${TARGET_HOURS - hours}h ${60 - minutes}m until recommended break`}
              </p>
            </div>
          </div>

          {isReady && (
            <div className="grid gap-2">
              <p className="text-xs font-bold uppercase text-[#8C6246]">Break-fast suggestions</p>
              {FASTING_SUGGESTIONS.map(({ meal, note }) => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => { onSelectMeal(meal); reset(); }}
                  className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] px-4 py-3 text-left transition hover:border-[#8C6246]"
                >
                  <p className="text-sm font-semibold text-[#0A2318]">{meal}</p>
                  <p className="mt-0.5 text-xs text-[#0A2318]/55">{note}</p>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={reset}
            className="h-9 self-start rounded-full border border-[#0A2318]/12 px-4 text-sm text-[#0A2318]/55 transition hover:border-[#0A2318]/30 hover:text-[#0A2318]"
          >
            Reset timer
          </button>
        </div>
      )}
    </section>
  );
}
