"use client";

import { useState } from "react";
import Segmented from "@/components/ui/Segmented";
import PulseRow from "@/components/ui/PulseRow";

type CircleMood = "Low" | "Okay" | "Good";

export default function MoodPulse() {
  const [mood, setMood] = useState<CircleMood>("Okay");

  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">Group check-in</p>
      <h2 className="text-2xl font-semibold">Anonymous mood pulse</h2>

      <div className="mt-5">
        <Segmented
          label="Mood"
          options={["Low", "Okay", "Good"]}
          value={mood}
          onChange={(v) => setMood(v as CircleMood)}
        />
      </div>

      <div className="mt-5 grid gap-3">
        <PulseRow label="Low" value={mood === "Low" ? 41 : 23} />
        <PulseRow label="Okay" value={mood === "Okay" ? 52 : 44} />
        <PulseRow label="Good" value={mood === "Good" ? 58 : 33} />
      </div>

      <div className="mt-5 rounded-md bg-[#f8eadf] p-3 text-sm leading-6 text-[#72401f]">
        Moderator prompt: share one habit that helped your sleep or stress this week.
      </div>
    </section>
  );
}
