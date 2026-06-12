"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CIRCLE_CHALLENGES } from "@/lib/circle-content";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type Props = { circleId: string };

export default function ChallengeTracker({ circleId }: Props) {
  const { logCircleChallenge } = useWellness();
  const challenge = CIRCLE_CHALLENGES.find((c) => c.circleId === circleId);
  const [done, setDone] = useState<boolean[]>([true, true, false, false, false]);

  if (!challenge) return null;

  const completedDays = done.filter(Boolean).length;
  const myPct         = Math.round((completedDays / challenge.days) * 100);
  const challengeTitle = challenge.title;

  function toggleDay(i: number) {
    if (done[i]) return; // can't un-complete a day
    const next = [...done];
    next[i] = true;
    setDone(next);
    logCircleChallenge(circleId, `${circleId}:${challengeTitle}:${DAY_LABELS[i]}`, 8);
  }

  return (
    <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-4">
      <p className="text-xs font-bold uppercase text-[#8C6246]">This week&apos;s challenge</p>
      <p className="mt-1 text-sm font-semibold text-[#0A2318]">{challenge.title}</p>

      {/* Day tracker */}
      <div className="mt-3 flex gap-2">
        {DAY_LABELS.map((day, i) => (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(i)}
            disabled={done[i]}
            title={done[i] ? "Completed" : `Mark ${day} done`}
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 rounded-xl py-2 transition",
              done[i]
                ? "bg-[#0A2318] text-[#D4C1A0] cursor-default"
                : "bg-white/70 text-[#0A2318]/45 hover:bg-white hover:text-[#0A2318]/70",
            )}
          >
            <span className="text-[10px] font-semibold">{day}</span>
            {done[i]
              ? <Check size={14} strokeWidth={2.5} />
              : <span className="h-3.5 w-3.5 rounded-full border-2 border-current opacity-40" />
            }
          </button>
        ))}
      </div>

      {/* Progress row */}
      <div className="mt-3 grid gap-2">
        <div className="flex items-center justify-between text-xs text-[#0A2318]/55">
          <span>Your progress</span>
          <span className="font-semibold text-[#0A2318]">{completedDays}/{challenge.days} days</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#0A2318]/8">
          <div className="h-full rounded-full bg-[#0A2318] transition-all duration-500" style={{ width: `${myPct}%` }} />
        </div>

        <div className="flex items-center justify-between text-xs text-[#0A2318]/45">
          <span>Group completion</span>
          <span className="font-semibold text-[#8C6246]">{challenge.groupPct}% completed</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#0A2318]/8">
          <div className="h-full rounded-full bg-[#8C6246] transition-all duration-500" style={{ width: `${challenge.groupPct}%` }} />
        </div>
      </div>

      {completedDays >= challenge.days && (
        <p className="mt-3 rounded-xl bg-[#0A2318] px-3 py-2 text-center text-xs font-bold text-[#D4C1A0]">
          Challenge complete this week! +8 pts earned per day.
        </p>
      )}
    </div>
  );
}
