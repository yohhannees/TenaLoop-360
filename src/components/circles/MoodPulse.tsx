"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CircleMood = "Low" | "Okay" | "Good";

const MOOD_COLOR: Record<CircleMood, string> = {
  Low:  "#C4503A",
  Okay: "#C4956A",
  Good: "#0A2318",
};

type Props = { circleId?: string };
type MoodSummary = {
  total: number;
  percentages: Record<CircleMood, number>;
  goodTrend: number[];
  labels: string[];
};

const EMPTY_SUMMARY: MoodSummary = {
  total: 0,
  percentages: { Low: 0, Okay: 0, Good: 0 },
  goodTrend: [0, 0, 0, 0, 0, 0, 0],
  labels: ["", "", "", "", "", "", "Today"],
};

export default function MoodPulse({ circleId }: Props) {
  const [myMood, setMyMood] = useState<CircleMood | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<MoodSummary>(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadPulse();
  }, [circleId]);

  async function loadPulse() {
    if (!circleId) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/circles/check-ins?circleId=${encodeURIComponent(circleId)}`, {
        cache: "no-store",
      });
      const data = (await response.json().catch(() => null)) as {
        moodSummary?: MoodSummary;
        error?: string;
      } | null;

      if (!response.ok) throw new Error(data?.error || "Mood pulse could not be loaded.");
      setSummary(data?.moodSummary ?? EMPTY_SUMMARY);
    } catch (err) {
      setSummary(EMPTY_SUMMARY);
      setError(err instanceof Error ? err.message : "Mood pulse could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitMood() {
    if (!myMood) return;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/circles/check-ins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId, mood: myMood }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) throw new Error(data?.error || "Mood could not be shared.");
      setSubmitted(true);
      await loadPulse();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mood could not be shared.");
    } finally {
      setIsSubmitting(false);
    }
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
              <span className="font-semibold" style={{ color: MOOD_COLOR[mood] }}>{summary.percentages[mood]}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#0A2318]/8">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${summary.percentages[mood]}%`, backgroundColor: MOOD_COLOR[mood] }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 7-day trend mini chart */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/40">7-day Good trend</p>
        <div className="flex items-end gap-1 h-12">
          {summary.labels.map((day, i) => {
            const h = Math.max(4, summary.goodTrend[i] * 1.1);
            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-[#0A2318]"
                  style={{ height: `${h}px`, opacity: 0.35 + Math.max(0.2, summary.goodTrend[i] / 100) * 0.65 }}
                />
                <span className="text-[9px] text-[#0A2318]/35">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-5 text-[#0A2318]/40">
        {isLoading
          ? "Loading live circle mood..."
          : summary.total > 0
            ? `${summary.total} mood check-in${summary.total === 1 ? "" : "s"} counted this week.`
            : "No mood check-ins logged for this circle this week."}
      </p>

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="h-9 rounded-full bg-[#8C6246] px-4 text-xs font-bold text-[#E8EDE7] transition hover:bg-[#724F38] disabled:opacity-55"
              >
                {isSubmitting ? "Saving" : "Share"}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-2xl border border-[#C4503A]/20 bg-[#C4503A]/8 px-3 py-2 text-xs font-semibold text-[#C4503A]">
          {error}
        </p>
      )}

      <p className="mt-3 text-[10px] leading-5 text-[#0A2318]/40">
        Responses are aggregated for the circle. Names are not shown in the pulse.
      </p>
    </section>
  );
}
