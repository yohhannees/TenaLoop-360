"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronRight, SkipForward, X } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { Workout, ExerciseCue } from "@/lib/exercises";
import { cn } from "@/lib/utils";

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

  // initialise timer for each step
  useEffect(() => {
    setRepsCompleted(0);
    if (step.type === "hold" || step.type === "rest") {
      setSecondsLeft(step.count);
    } else {
      setSecondsLeft(0);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, phase, step.type]);

  const advance = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (stepIdx >= workout.steps.length - 1) {
      setPhase("done");
      award("Move", workout.points);
    } else {
      setStepIdx((i) => i + 1);
    }
  }, [stepIdx, workout.steps.length, workout.points, award]);

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
        {/* Animated shape */}
        <div className="mt-6 flex flex-col items-center gap-5">
          <div className="relative">
            {/* Outer ring for hold/breathe types */}
            {(step.type === "hold" || step.type === "rest") && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(${colors.ring} ${holdFraction * 360}deg, rgb(10 35 24 / 0.08) 0deg)`,
                  transform: "scale(1.18)",
                }}
              />
            )}
            {/* Main animated circle */}
            <div
              className={cn("grid h-32 w-32 place-items-center rounded-full", animClass)}
              style={{ backgroundColor: colors.bg, position: "relative", zIndex: 1 }}
            >
              <div className="grid place-items-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.text, opacity: 0.65 }}>
                  {CUE_LABEL[step.cue]}
                </span>
                {(step.type === "hold" || step.type === "rest") && (
                  <span className="font-serif text-4xl font-bold leading-none" style={{ color: colors.text }}>
                    {secondsLeft}
                  </span>
                )}
                {step.type === "reps" && (
                  <span className="font-serif text-3xl font-bold leading-none" style={{ color: colors.text }}>
                    {repsCompleted}<span className="text-lg opacity-50">/{step.count}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

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
