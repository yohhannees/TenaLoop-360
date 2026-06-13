"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { CIRCLE_SESSIONS } from "@/lib/circle-content";
import { useWellness } from "@/context/WellnessContext";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const BROWN = "#9A6B4A";

type Mood = "Low" | "Okay" | "Good";
const MOODS: Mood[] = ["Low", "Okay", "Good"];
const MOOD_COLOR: Record<Mood, string> = {
  Low: "#C05E3A",
  Okay: "#C2913C",
  Good: "#5E7A5C",
};

type Props = { circleId: string };

export default function CircleCheckIn({ circleId }: Props) {
  const { logCircleCheckIn } = useWellness();
  const session = CIRCLE_SESSIONS.find((s) => s.circleId === circleId);
  const [mood, setMood] = useState<Mood | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!mood) return;
    setSubmitted(true);
    logCircleCheckIn(circleId, mood, text);
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border p-6 text-center" style={{ background: "#fff", borderColor: `${INK}12` }}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: `${SAGE}1A` }}>
          <span className="text-2xl">🤝</span>
        </div>
        <p className="mt-3 font-serif text-xl" style={{ color: INK }}>Check-in shared anonymously</p>
        <p className="mt-1 text-sm" style={{ color: `${INK}60` }}>Your mood was added to the group pulse. +15 pts earned.</p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border p-6" style={{ background: "#fff", borderColor: `${INK}12` }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: BROWN }}>Weekly check-in</p>

      {session && (
        <div className="mt-3 rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={session.isToday ? { background: INK, color: PAPER } : { background: PAPER, color: `${INK}75` }}>
          {session.isToday && <span className="mr-2 text-[10px] font-bold uppercase" style={{ color: "#8FB89A" }}>Live tonight →</span>}
          {session.label} · <span className="italic">{session.moderatorPrompt}</span>
        </div>
      )}

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold" style={{ color: `${INK}60` }}>How are you feeling this week?</p>
        <div className="flex gap-2">
          {MOODS.map((m) => {
            const on = mood === m;
            return (
              <button key={m} type="button" onClick={() => setMood(m)}
                className="h-10 flex-1 rounded-full text-xs font-semibold transition"
                style={{ background: on ? MOOD_COLOR[m] : "transparent", color: on ? "#fff" : MOOD_COLOR[m], border: `1.5px solid ${on ? MOOD_COLOR[m] : `${MOOD_COLOR[m]}55`}` }}>
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Share one insight anonymously (optional)…" rows={2}
        className="mt-3 w-full resize-none rounded-2xl p-3.5 text-sm outline-none"
        style={{ background: PAPER, border: `1px solid ${INK}12`, color: INK }} />

      <button type="button" onClick={submit} disabled={!mood}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition active:scale-[0.98] disabled:opacity-35"
        style={{ background: INK, color: PAPER }}>
        <Send size={15} /> Share anonymously
      </button>
    </section>
  );
}
