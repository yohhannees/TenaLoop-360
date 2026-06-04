"use client";

import { useWellness } from "@/context/WellnessContext";
import { getPatternInsights } from "@/lib/score";

const STATIC_TREND = [58, 61, 63, 60, 67, 71];

export default function PatternInsights() {
  const { score } = useWellness();
  const trend = [...STATIC_TREND, score];
  const insights = getPatternInsights(trend);

  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">AI pattern analysis</p>
      <h2 className="text-2xl font-semibold">What the data shows</h2>
      <div className="mt-4 grid gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="rounded-md border border-[#dde8e1] bg-[#fbfdfb] p-3 text-sm leading-6 text-[#52665c]"
          >
            <span className="mr-2 inline-block h-5 w-5 shrink-0 rounded-full bg-[#eef6f2] text-center text-xs font-semibold leading-5 text-[#0f6b52]">
              {i + 1}
            </span>
            {insight}
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md bg-[#ecf2fb] p-3 text-sm leading-6 text-[#28506f]">
        Insight model: stress × sleep × food × movement patterns over 7 days. More check-ins improve accuracy.
      </div>
    </section>
  );
}
