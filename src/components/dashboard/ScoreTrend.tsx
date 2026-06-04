"use client";

import { useWellness } from "@/context/WellnessContext";
import MiniStat from "@/components/ui/MiniStat";

export default function ScoreTrend() {
  const { score, points, stamps } = useWellness();
  const trend = [58, 61, 63, 60, 67, 71, score];

  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-[#64756b]">TenaScore · Wellness Passport</p>
          <h2 className="text-2xl font-semibold">Seven-day improvement view</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Score" value={`${score}`} tone="#0f6b52" />
          <MiniStat label="Points" value={`${points}`} tone="#d86f45" />
          <MiniStat label="Stamps" value={`${stamps.length}/6`} tone="#1d84a6" />
        </div>
      </div>

      <div className="mt-6 grid h-52 grid-cols-7 items-end gap-2">
        {trend.map((value, i) => (
          <div key={i} className="grid h-full items-end gap-2">
            <div
              className="rounded-t-md bg-[#0f6b52]"
              style={{ height: `${Math.max(16, value * 1.8)}px` }}
            />
            <span className="text-center text-xs font-medium text-[#64756b]">D{i + 1}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
