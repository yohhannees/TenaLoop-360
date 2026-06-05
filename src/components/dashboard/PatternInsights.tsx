"use client";

import { Brain } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { getPatternInsights } from "@/lib/score";

const STATIC_TREND = [58, 61, 63, 60, 67, 71];

export default function PatternInsights() {
  const { score } = useWellness();
  const trend = [...STATIC_TREND, score];
  const insights = getPatternInsights(trend);

  return (
    <section className="rounded-md border border-[#d7e3db] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-[#64756b]">
            AI pattern analysis
          </p>
          <h2 className="mt-1 text-2xl font-semibold">What the data shows</h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md bg-[#edf6f1] text-[#0f6b52]">
          <Brain size={20} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {insights.map((insight, index) => (
          <div
            key={insight}
            className="grid grid-cols-[auto_1fr] gap-3 rounded-md border border-[#dde8e1] bg-[#fbfcfa] p-3 text-sm leading-6 text-[#52665c]"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#eef6f2] text-xs font-semibold text-[#0f6b52]">
              {index + 1}
            </span>
            <span>{insight}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-[#d6e4ef] bg-[#eff6fb] p-3 text-sm leading-6 text-[#28506f]">
        Insight model: stress x sleep x food x movement patterns over 7 days.
        More check-ins improve accuracy.
      </div>
    </section>
  );
}
