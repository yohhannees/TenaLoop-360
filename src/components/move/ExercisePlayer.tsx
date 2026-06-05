"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronRight, SkipForward, X } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { Workout, ExerciseCue } from "@/lib/exercises";
import { cn } from "@/lib/utils";
import ExerciseFigure from "@/components/move/ExerciseFigure";

const CUE_ANIM: Record<ExerciseCue, string> = {
  breathe: "anim-breathe",
  bounce:  "anim-bounce",
  hold:    "anim-hold",
  stretch: "anim-stretch",
  spin:    "anim-spin",
  rest:    "anim-rest",
};

const CUE_COLOR: Record<ExerciseCue, { bg: string; ring: string; text: string }> = {
  breathe: { bg: "#E8EDE7", ring: "#0A2318", text: "#0A2318" },
  bounce:  { bg: "#8C6246", ring: "#724F38", text: "#E8EDE7" },
  hold:    { bg: "#0A2318", ring: "#1A3A2A", text: "#D4C1A0" },
  stretch: { bg: "#D4C1A0", ring: "#8C6246", text: "#0A2318" },
  spin:    { bg: "#8C6246", ring: "#724F38", text: "#E8EDE7" },
  rest:    { bg: "#E5EAE3", ring: "#0A2318", text: "#0A2318" },
};

const CUE_LABEL: Record<ExerciseCue, string> = {
  breathe: "Breathe",
  bounce:  "Move",
  hold:    "Hold",
  stretch: "Stretch",
  spin:    "Rotate",
  rest:    "Rest",
};

type Props = {
  workout: Workout;
  onClose: () => void;
};

export default function ExercisePlayer({ workout, onClose }: Props) {
  const { award } = useWellness();

  const [stepIdx, setStepIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [phase, setPhase] = useState<"active" | "done">("active");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = workout.steps[stepIdx];
  const isLast = stepIdx === workout.steps.length - 1;
  const nextStep = workout.steps[stepIdx + 1];
  const progress = ((stepIdx + 1) / workout.steps.length) * 100;

  const colors = CUE_COLOR[step.cue];
  const animClass = CUE_ANIM[step.cue];

  const advance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stepIdx >= workout.steps.length - 1) {
      setPhase("done");
      award("Move", workout.points);
    } else {
      setStepIdx((i) => i + 1);
    }
  }, [stepIdx, workout.steps.length, workout.points, award]);

  // initialise timer for each step
  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setRepsCompleted(0);
      if (step.type === "hold" || step.type === "rest") {
        setSecondsLeft(step.count);
      } else {
        setSecondsLeft(0);
      }
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [stepIdx, step.type, step.count]);

  // countdown tick
  useEffect(() => {
    if (step.type !== "hold" && step.type !== "rest") return;
    if (phase === "done") return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          advance();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [advance, phase, step.type]);

  function tapRep() {
    const next = repsCompleted + 1;
    setRepsCompleted(next);
    if (next >= step.count) {
      setTimeout(advance, 600);
    }
  }

  const holdFraction = step.type === "hold" || step.type === "rest"
    ? 1 - secondsLeft / step.count
    : 0;

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-8 text-center shadow-sm">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-[#0A2318]">
          <Check size={40} strokeWidth={2} className="text-[#D4C1A0]" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">Complete</p>
          <h2 className="mt-1 font-serif text-3xl text-[#0A2318]">{workout.title}</h2>
          <p className="mt-2 text-sm text-[#0A2318]/65">
            You earned <span className="font-bold text-[#8C6246]">+{workout.points} pts</span> and a Move stamp.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-12 rounded-full bg-[#0A2318] px-8 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
        >
          Back to workouts
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">{workout.title}</p>
          <p className="mt-0.5 text-sm text-[#0A2318]/65">
            Step {stepIdx + 1} of {workout.steps.length}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#0A2318]/12 text-[#0A2318]/55 transition hover:bg-[#0A2318]/8"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-[#0A2318]/8 mx-5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#8C6246] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Exercise visual + controls */}
      <div className="px-5 pb-5">
        {/* Character figure + timer */}
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Animated SVG character */}
          <div className="rounded-2xl bg-[#E5EAE3] px-4 py-3">
            <ExerciseFigure cue={step.cue} />
          </div>

          {/* Timer chip — holds and rests show a countdown ring + number */}
          {(step.type === "hold" || step.type === "rest") && (
            <div className="relative grid h-20 w-20 place-items-center">
              <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgb(10 35 24 / 0.08)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none"
                  stroke={colors.ring} strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${213.6}`}
                  strokeDashoffset={`${213.6 * (1 - holdFraction)}`}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="relative text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.ring, opacity: 0.7 }}>
                  {CUE_LABEL[step.cue]}
                </span>
                <span className="font-serif text-2xl font-bold leading-none" style={{ color: colors.ring }}>
                  {secondsLeft}
                </span>
              </div>
            </div>
          )}

          {/* Rep counter chip */}
          {step.type === "reps" && (
            <div className="flex items-baseline gap-1 rounded-2xl px-5 py-2" style={{ backgroundColor: colors.bg + "22" }}>
              <span className="font-serif text-3xl font-bold" style={{ color: colors.ring }}>
                {repsCompleted}
              </span>
              <span className="text-base font-medium" style={{ color: colors.ring, opacity: 0.45 }}>
                / {step.count} reps
              </span>
            </div>
          )}

          {/* Exercise name */}
          <div className="text-center">
            <h3 className="font-serif text-2xl text-[#0A2318]">{step.name}</h3>
            <p className="mt-1.5 max-w-xs text-sm leading-6 text-[#0A2318]/65">{step.instruction}</p>
          </div>

          {/* Rep tap button */}
          {step.type === "reps" && (
            <div className="flex flex-col items-center gap-3">
              {repsCompleted < step.count ? (
                <button
                  type="button"
                  onClick={tapRep}
                  className="h-14 w-48 rounded-full bg-[#0A2318] text-base font-semibold text-[#E8EDE7] shadow-md transition active:scale-95 hover:bg-[#1A3A2A]"
                >
                  Tap each rep
                </button>
              ) : (
                <div className="flex h-14 w-48 items-center justify-center gap-2 rounded-full bg-[#8C6246] text-base font-semibold text-[#E8EDE7]">
                  <Check size={18} /> Done!
                </div>
              )}
              <p className="text-xs text-[#0A2318]/45">
                Or tap Skip to advance manually
              </p>
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={advance}
              className="flex items-center gap-2 rounded-full border border-[#0A2318]/12 px-4 py-2 text-sm font-medium text-[#0A2318]/65 transition hover:border-[#0A2318]/30 hover:text-[#0A2318]"
            >
              <SkipForward size={14} />
              Skip
            </button>
            {!isLast && nextStep && (
              <div className="flex items-center gap-1.5 rounded-full bg-[#0A2318]/6 px-4 py-2 text-sm text-[#0A2318]/55">
                <span>Next:</span>
                <ChevronRight size={12} />
                <span className="font-medium text-[#0A2318]/75">{nextStep.name}</span>
                <span className="text-[#0A2318]/40">
                  {nextStep.type === "reps" ? `${nextStep.count} reps` : `${nextStep.count}s`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
