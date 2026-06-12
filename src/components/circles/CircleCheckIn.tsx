"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CIRCLE_SESSIONS } from "@/lib/circle-content";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

type Mood = "Low" | "Okay" | "Good";
const MOODS: Mood[] = ["Low", "Okay", "Good"];
const MOOD_STYLES: Record<Mood, string> = {
  Low:  "border-[#C4503A]/35 bg-[#C4503A]/8  text-[#C4503A]",
  Okay: "border-[#C4956A]/45 bg-[#C4956A]/10 text-[#8C6246]",
  Good: "border-[#0A2318]/25 bg-[#0A2318]/8  text-[#0A2318]",
};
const MOOD_ACTIVE: Record<Mood, string> = {
  Low:  "border-[#C4503A] bg-[#C4503A]  text-white",
  Okay: "border-[#C4956A] bg-[#C4956A]  text-white",
  Good: "border-[#0A2318] bg-[#0A2318]  text-[#D4C1A0]",
};

type Props = { circleId: string };

export default function CircleCheckIn({ circleId }: Props) {
  const { logCircleCheckIn } = useWellness();
  const session    = CIRCLE_SESSIONS.find((s) => s.circleId === circleId);
  const [mood, setMood]     = useState<Mood | null>(null);
  const [text, setText]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!mood) return;
    setSubmitted(true);
    logCircleCheckIn(circleId, mood, text);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-4 text-center">
        <p className="text-2xl">🤝</p>
        <p className="mt-2 text-sm font-semibold text-[#0A2318]">Check-in shared anonymously</p>
        <p className="mt-1 text-xs text-[#0A2318]/55">
          Your mood was added to the group pulse. +15 pts earned.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-4">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Weekly check-in</p>

      {session && (
        <div className={cn(
          "mt-2 rounded-xl px-3 py-2 text-sm",
          session.isToday
            ? "bg-[#0A2318] text-[#D4C1A0]"
            : "bg-[#0A2318]/8 text-[#0A2318]/65",
        )}>
          {session.isToday && <span className="mr-2 text-[10px] font-bold uppercase">Live tonight →</span>}
          {session.label} · <span className="italic">{session.moderatorPrompt}</span>
        </div>
      )}

      <div className="mt-3">
        <p className="text-xs font-semibold text-[#0A2318]/55 mb-2">How are you feeling this week?</p>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={cn(
                "h-9 flex-1 rounded-full border text-xs font-semibold transition",
                mood === m ? MOOD_ACTIVE[m] : MOOD_STYLES[m],
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share one insight anonymously (optional)…"
        rows={2}
        className="mt-3 w-full resize-none rounded-2xl border border-[#0A2318]/12 bg-white/70 p-3 text-sm text-[#0A2318] outline-none focus:border-[#8C6246] focus:bg-white"
      />

      <button
        type="button"
        onClick={submit}
        disabled={!mood}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A] disabled:opacity-35"
      >
        <Send size={14} /> Share anonymously
      </button>
    </div>
  );
}
