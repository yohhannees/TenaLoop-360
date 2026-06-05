"use client";

import { useState } from "react";
import Segmented from "@/components/ui/Segmented";
import PulseRow from "@/components/ui/PulseRow";

type CircleMood = "Low" | "Okay" | "Good";

export default function MoodPulse() {
  const [mood, setMood] = useState<CircleMood>("Okay");

  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Group check-in</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Anonymous mood pulse</h2>

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

      <div className="mt-5 rounded-[1.25rem] bg-[#D4C1A0]/35 p-3 text-sm leading-6 text-[#0A2318]/76">
        Moderator prompt: share one habit that helped your sleep or stress this week.
      </div>
    </section>
  );
}
