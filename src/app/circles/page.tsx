"use client";

import { useWellness } from "@/context/WellnessContext";
import { circles } from "@/lib/circles";
import CircleCard from "@/components/circles/CircleCard";
import MoodPulse from "@/components/circles/MoodPulse";

export default function CirclesPage() {
  const { joinedCircles, joinCircle } = useWellness();

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
        <p className="text-sm font-medium uppercase text-[#64756b]">TenaCircle</p>
        <h2 className="text-2xl font-semibold">Moderated peer support</h2>
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
