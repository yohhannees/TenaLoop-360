"use client";

import { useWellness } from "@/context/WellnessContext";
import { circles } from "@/lib/circles";
import CircleCard from "@/components/circles/CircleCard";
import MoodPulse from "@/components/circles/MoodPulse";

export default function CirclesPage() {
  const { joinedCircles, joinCircle } = useWellness();

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[1fr_0.85fr]">
      <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
        <p className="text-xs font-bold uppercase text-[#8C6246]">TenaCircle</p>
        <h2 className="font-serif text-3xl text-[#0A2318]">Moderated peer support</h2>
        <div className="mt-5 grid gap-3">
          {circles.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              joined={joinedCircles.includes(circle.id)}
              onJoin={() => joinCircle(circle.id)}
            />
          ))}
        </div>
      </section>
      <MoodPulse />
    </div>
  );
}
