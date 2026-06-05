"use client";

import { useState } from "react";
import { CIRCLE_POSTS } from "@/lib/circle-content";
import { cn } from "@/lib/utils";

type CircleMood = "Low" | "Okay" | "Good";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const WEEK_DATA: Record<CircleMood, number[]> = {
  Low:  [18, 24, 21, 19, 16, 14, 12],
  Okay: [45, 42, 44, 46, 41, 38, 37],
  Good: [37, 34, 35, 35, 43, 48, 51],
};

const MOOD_COLOR: Record<CircleMood, string> = {
  Low:  "#C4503A",
  Okay: "#C4956A",
  Good: "#0A2318",
};

type Props = { circleId?: string };

export default function MoodPulse({ circleId }: Props) {
  const [myMood, setMyMood] = useState<CircleMood | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Derive live percentages from posts (or fallback to static)
  const posts  = circleId ? CIRCLE_POSTS.filter((p) => p.circleId === circleId) : CIRCLE_POSTS;
  const total  = posts.length || 1;
  const goodN  = posts.filter((p) => p.mood === "Good").length;
  const okayN  = posts.filter((p) => p.mood === "Okay").length;
  const lowN   = posts.filter((p) => p.mood === "Low").length;
  const live   = {
    Low:  Math.round((lowN  / total) * 100),
    Okay: Math.round((okayN / total) * 100),
    Good: Math.round((goodN / total) * 100),
  };

  function submitMood() {
    if (!myMood) return;
    setSubmitted(true);
  }

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Group mood</p>
      <h2 className="font-serif text-2xl text-[#0A2318]">Community pulse</h2>

      {/* Live snapshot */}
      <div className="mt-4 grid gap-2">
        {(["Good", "Okay", "Low"] as CircleMood[]).map((mood) => (
          <div key={mood}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-[#0A2318]/70">{mood}</span>
              <span className="font-semibold" style={{ color: MOOD_COLOR[mood] }}>{live[mood]}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#0A2318]/8">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${live[mood]}%`, backgroundColor: MOOD_COLOR[mood] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 7-day trend mini chart */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/40">7-day Good trend</p>
        <div className="flex items-end gap-1 h-12">
          {WEEK.map((day, i) => {
            const h = Math.max(4, WEEK_DATA.Good[i] * 1.1);
            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#0A2318]"
                  style={{ height: `${h}px`, opacity: 0.55 + i * 0.065 }}
                />
                <span className="text-[9px] text-[#0A2318]/35">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* My mood contribution */}
      <div className="mt-5 border-t border-[#0A2318]/8 pt-4">
        <p className="text-xs font-semibold text-[#0A2318]/55 mb-2">Add your mood to the pulse</p>
        {submitted ? (
          <p className="rounded-2xl bg-[#0A2318]/6 py-2 text-center text-sm font-medium text-[#0A2318]/65">
            Mood shared — thank you 🤝
          </p>
        ) : (
          <div className="flex gap-2">
            {(["Low", "Okay", "Good"] as CircleMood[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMyMood(m)}
                className={cn(
                  "flex-1 h-9 rounded-full border text-xs font-semibold transition",
                  myMood === m
                    ? "border-[#0A2318] bg-[#0A2318] text-[#D4C1A0]"
                    : "border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/55 hover:border-[#0A2318]/30",
                )}
              >
                {m}
              </button>
            ))}
            {myMood && (
              <button
                type="button"
                onClick={submitMood}
                className="h-9 rounded-full bg-[#8C6246] px-4 text-xs font-bold text-[#E8EDE7] transition hover:bg-[#724F38]"
              >
                Share
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#0A2318]/40">
        All responses are anonymous and aggregated. Individual data is never stored.
      </p>
    </section>
  );
}
