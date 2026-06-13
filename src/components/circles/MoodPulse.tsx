"use client";

import { useCallback, useEffect, useState } from "react";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const BROWN = "#9A6B4A";

type CircleMood = "Low" | "Okay" | "Good";

const MOOD_COLOR: Record<CircleMood, string> = {
  Low: "#C05E3A",
  Okay: "#C2913C",
  Good: "#5E7A5C",
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadPulse = useCallback(async () => {
    if (!circleId) return;
    try {
      const response = await fetch(`/api/circles/check-ins?circleId=${encodeURIComponent(circleId)}`, { cache: "no-store" });
      const data = (await response.json().catch(() => null)) as { moodSummary?: MoodSummary; error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Mood pulse could not be loaded.");
      setSummary(data?.moodSummary ?? EMPTY_SUMMARY);
    } catch (err) {
      setSummary(EMPTY_SUMMARY);
      setError(err instanceof Error ? err.message : "Mood pulse could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }, [circleId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadPulse(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadPulse]);

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
    <section className="rounded-3xl border p-6" style={{ background: "#fff", borderColor: `${INK}12` }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: BROWN }}>Group mood</p>
      <h2 className="mt-1 font-serif text-2xl" style={{ color: INK }}>Community pulse</h2>

      {/* Snapshot */}
      <div className="mt-4 grid gap-2.5">
        {(["Good", "Okay", "Low"] as CircleMood[]).map((mood) => (
          <div key={mood}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium" style={{ color: `${INK}75` }}>{mood}</span>
              <span className="font-semibold" style={{ color: MOOD_COLOR[mood] }}>{summary.percentages[mood]}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full" style={{ background: `${INK}0D` }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${summary.percentages[mood]}%`, background: MOOD_COLOR[mood] }} />
            </div>
          </div>
        ))}
      </div>

      {/* Trend */}
      <div className="mt-5">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}45` }}>7-day Good trend</p>
        <div className="flex h-12 items-end gap-1">
          {summary.labels.map((day, i) => {
            const h = Math.max(4, summary.goodTrend[i] * 1.1);
            return (
              <div key={`${day || "empty"}-${i}`} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-md" style={{ height: `${h}px`, background: SAGE_FOR(summary.goodTrend[i]) }} />
                <span className="text-[9px]" style={{ color: `${INK}35` }}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-5" style={{ color: `${INK}45` }}>
        {isLoading ? "Loading live circle mood…"
          : summary.total > 0 ? `${summary.total} mood check-in${summary.total === 1 ? "" : "s"} counted this week.`
          : "No mood check-ins logged for this circle this week."}
      </p>

      {/* My contribution */}
      <div className="mt-5 border-t pt-4" style={{ borderColor: `${INK}0D` }}>
        <p className="mb-2 text-xs font-semibold" style={{ color: `${INK}60` }}>Add your mood to the pulse</p>
        {submitted ? (
          <p className="rounded-2xl py-2.5 text-center text-sm font-medium" style={{ background: `${SAGE}15`, color: SAGE }}>
            Mood shared — thank you 🤝
          </p>
        ) : (
          <div className="flex gap-2">
            {(["Low", "Okay", "Good"] as CircleMood[]).map((m) => {
              const on = myMood === m;
              return (
                <button key={m} type="button" onClick={() => setMyMood(m)} disabled={isSubmitting}
                  className="h-9 flex-1 rounded-full text-xs font-semibold transition"
                  style={{ background: on ? MOOD_COLOR[m] : "transparent", color: on ? "#fff" : `${INK}65`, border: `1.5px solid ${on ? MOOD_COLOR[m] : `${INK}16`}` }}>
                  {m}
                </button>
              );
            })}
            {myMood && (
              <button type="button" onClick={submitMood} disabled={isSubmitting}
                className="h-9 rounded-full px-4 text-xs font-bold transition disabled:opacity-55" style={{ background: INK, color: PAPER }}>
                {isSubmitting ? "Saving" : "Share"}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-2xl px-3 py-2 text-xs font-semibold" style={{ background: "#C05E3A14", color: "#C05E3A", border: "1px solid #C05E3A33" }}>
          {error}
        </p>
      )}

      <p className="mt-3 text-[10px] leading-5" style={{ color: `${INK}40` }}>
        Responses are aggregated for the circle. Names are not shown in the pulse.
      </p>
    </section>
  );
}

const SAGE = "#5E7A5C";
function SAGE_FOR(pct: number) {
  const opacity = 0.35 + Math.max(0.2, pct / 100) * 0.65;
  return `rgba(94,122,92,${opacity})`;
}
