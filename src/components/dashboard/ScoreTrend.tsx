"use client";

import { Activity, ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import MiniStat from "@/components/ui/MiniStat";

export default function ScoreTrend() {
  const { score, points, stamps, scoreLabel } = useWellness();
  const trend = [58, 61, 63, 60, 67, 71, score];
  const bestScore = Math.max(...trend);

  return (
    <section className="overflow-hidden rounded-md border border-[#d7e3db] bg-white shadow-sm">
      <div className="grid gap-6 bg-[#102018] p-5 text-white lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#9ee3ca]">
            <Sparkles size={16} />
            TenaScore command view
          </div>
          <h2 className="mt-3 text-3xl font-semibold leading-tight">
            Seven-day wellness trajectory
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">
            Your score blends stress, sleep, mood, food, movement, water, and support
            into one daily action plan.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Score" value={`${score}`} tone="#9ee3ca" variant="dark" />
          <MiniStat label="Points" value={`${points}`} tone="#f0aa6e" variant="dark" />
          <MiniStat label="Stamps" value={`${stamps.length}/6`} tone="#9dcbe0" variant="dark" />
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#64786e]">
                Current state
              </p>
              <h3 className="mt-1 text-2xl font-semibold">{scoreLabel}</h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-md bg-[#edf6f1] px-3 py-2 text-sm font-semibold text-[#0f6b52]">
              <ArrowUpRight size={17} />
              Live scoring
            </div>
          </div>

          <div className="mt-8 grid h-56 grid-cols-7 items-end gap-2">
            {trend.map((value, index) => (
              <div key={`${value}-${index}`} className="grid h-full items-end gap-2">
                <div className="relative flex h-full items-end overflow-hidden rounded-md bg-[#edf3ef]">
                  <div
                    className="w-full rounded-t-md bg-[#0f6b52]"
                    style={{ height: `${Math.max(14, (value / bestScore) * 100)}%` }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[#102018]">{value}</p>
                  <p className="text-xs text-[#708278]">D{index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-md border border-[#dce8df] bg-[#f8faf6] p-4">
          <div className="grid h-11 w-11 place-items-center rounded-md bg-white text-[#0f6b52] shadow-sm">
            <Activity size={22} />
          </div>
          <h3 className="mt-4 text-xl font-semibold">Next best action</h3>
          <p className="mt-2 text-sm leading-6 text-[#5b7066]">
            Complete the daily loop, then stamp one mind action and one movement action
            before booking a provider.
          </p>
          <div className="mt-5 rounded-md bg-white p-3 text-sm leading-6 text-[#40564b] shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-[#0f6b52]">
              <BadgeCheck size={17} />
              Passport goal
            </div>
            Earn 4 of 6 stamps to unlock the first wellness discount.
          </div>
        </aside>
      </div>
    </section>
  );
}
