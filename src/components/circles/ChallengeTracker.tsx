"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { CIRCLE_CHALLENGES } from "@/lib/circle-content";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const BROWN = "#9A6B4A";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = { circleId: string };

export default function ChallengeTracker({ circleId }: Props) {
  const challenge = CIRCLE_CHALLENGES.find((c) => c.circleId === circleId);
  const dayLabels = useMemo(() => DAY_LABELS.slice(0, challenge?.days ?? 5), [challenge?.days]);
  const challengePrefix = challenge ? `${circleId}:${challenge.title}:` : "";
  const [done, setDone] = useState<boolean[]>(() => dayLabels.map(() => false));
  const [groupPct, setGroupPct] = useState(0);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!challenge) return;
    let cancelled = false;
    fetch(`/api/circles/challenges?circleId=${encodeURIComponent(circleId)}&challengeIdPrefix=${encodeURIComponent(challengePrefix)}&days=${challenge.days}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { completedChallengeIds?: string[]; groupPct?: number; error?: string } | null;
        if (!response.ok) throw new Error(data?.error || "Challenge progress could not be loaded.");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const completed = new Set(data?.completedChallengeIds ?? []);
        setDone(dayLabels.map((day) => completed.has(`${challengePrefix}${day}`)));
        setGroupPct(typeof data?.groupPct === "number" ? data.groupPct : 0);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setDone(dayLabels.map(() => false));
        setGroupPct(0);
        setError(err instanceof Error ? err.message : "Challenge progress could not be loaded.");
      });
    return () => { cancelled = true; };
  }, [challenge, challengePrefix, circleId, dayLabels]);

  if (!challenge) return null;

  const completedDays = done.filter(Boolean).length;
  const myPct = Math.round((completedDays / challenge.days) * 100);
  const challengeTitle = challenge.title;

  async function toggleDay(i: number) {
    if (done[i] || savingDay !== null) return;
    setSavingDay(i);
    setError("");
    try {
      const response = await fetch("/api/circles/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId, challengeId: `${circleId}:${challengeTitle}:${dayLabels[i]}`, points: 8 }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Challenge day could not be saved.");
      setDone((prev) => prev.map((value, index) => (index === i ? true : value)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Challenge day could not be saved.");
    } finally {
      setSavingDay(null);
    }
  }

  return (
    <section className="rounded-3xl border p-6" style={{ background: "#fff", borderColor: `${INK}12` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: BROWN }}>This week&apos;s challenge</p>
          <h2 className="mt-1 font-serif text-2xl" style={{ color: INK }}>{challenge.title}</h2>
        </div>
        <span className="font-serif text-2xl" style={{ color: SAGE }}>{completedDays}<span style={{ color: `${INK}35` }}>/{challenge.days}</span></span>
      </div>

      {/* Day tracker */}
      <div className="mt-4 flex gap-2">
        {dayLabels.map((day, i) => {
          const isDone = done[i];
          return (
            <button key={day} type="button" onClick={() => toggleDay(i)} disabled={isDone || savingDay !== null}
              title={isDone ? "Completed" : `Mark ${day} done`}
              className="flex flex-1 flex-col items-center gap-2 rounded-2xl py-3 transition"
              style={isDone ? { background: INK, color: SAGE_LIGHT, cursor: "default" } : { background: PAPER, color: `${INK}50` }}>
              <span className="text-[10px] font-bold">{day}</span>
              {isDone ? <Check size={15} strokeWidth={2.5} />
                : savingDay === i ? <span className="h-3.5 w-3.5 animate-pulse rounded-full" style={{ background: "currentColor", opacity: 0.4 }} />
                : <span className="h-3.5 w-3.5 rounded-full border-2 border-current" style={{ opacity: 0.4 }} />}
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-5 grid gap-2.5">
        <div className="flex items-center justify-between text-xs" style={{ color: `${INK}60` }}>
          <span>Your progress</span>
          <span className="font-semibold" style={{ color: INK }}>{completedDays}/{challenge.days} days</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: `${INK}0D` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${myPct}%`, background: INK }} />
        </div>

        <div className="flex items-center justify-between text-xs" style={{ color: `${INK}50` }}>
          <span>Group completion</span>
          <span className="font-semibold" style={{ color: BROWN }}>{groupPct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: `${INK}0D` }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${groupPct}%`, background: BROWN }} />
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#C05E3A14", color: "#C05E3A", border: "1px solid #C05E3A33" }}>
          {error}
        </p>
      )}

      {completedDays >= challenge.days && (
        <p className="mt-3 rounded-xl px-3 py-2.5 text-center text-xs font-bold" style={{ background: SAGE, color: "#fff" }}>
          Challenge complete this week! +8 pts earned per day.
        </p>
      )}
    </section>
  );
}

const SAGE_LIGHT = "#8FB89A";
