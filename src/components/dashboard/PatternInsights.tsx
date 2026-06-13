"use client";

import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { getPatternInsights, PatternInsightStats } from "@/lib/score";

type AnalyticsData = PatternInsightStats & {
  trend?: number[];
};

export default function PatternInsights() {
  const { score } = useWellness();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data: AnalyticsData) => { if (data.trend) setAnalytics(data); })
      .catch(() => {});
  }, [score]);

  const trend = analytics?.trend ? [...analytics.trend.slice(0, 6), score] : [0, 0, 0, 0, 0, 0, score];
  const insights = getPatternInsights(trend, analytics ?? {});

  return (
    <section className="h-full rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Pattern analysis</p>
          <h2 className="mt-1 font-serif text-2xl text-[#0A2318]">What the data shows</h2>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#E8F3F7] text-[#2C7DA0]">
          <Brain size={20} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {insights.map((insight, index) => (
          <div
            key={insight}
            className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-3 text-sm leading-6 text-[#0A2318]/66"
          >
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#0A2318] text-xs font-semibold text-[#E8EDE7]">
              {index + 1}
            </span>
            <span>{insight}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-[#EFB84C]/25 bg-[#FFF6DD] p-3 text-sm leading-6 text-[#0A2318]/72">
        {analytics
          ? "Insight model: stress x sleep x food x movement patterns from your real check-in history."
          : "Insight model: stress x sleep x food x movement patterns over 7 days. More check-ins improve accuracy."}
      </div>
    </section>
  );
}
