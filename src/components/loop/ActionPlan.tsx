"use client";

import { BadgeCheck, Footprints, Sparkles, Utensils } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { clamp } from "@/lib/utils";
import { getFoodSignal } from "@/lib/foods";
import MetricBar from "@/components/ui/MetricBar";

export default function ActionPlan() {
  const { plan, award, checkIn, score, scoreLabel, foodSignal } = useWellness();

  return (
    <div className="grid gap-5">
      {/* AI Plan */}
      <section className="rounded-md border border-[#d7e3db] bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#0f6b52]">
              <Sparkles size={16} />
              AI action plan
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Personalized next loop</h2>
          </div>
          <span className="rounded-md bg-[#edf6f1] px-3 py-2 text-sm font-semibold text-[#0f6b52]">
            {score}/100
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          {plan.map((item) => (
            <div
              key={item.title}
              className="grid gap-3 rounded-md border border-[#dde8e1] bg-[#fbfcfa] p-3 transition hover:border-[#b9d4c6] sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-semibold text-[#14231d]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#52665c]">{item.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => award(item.stamp, 12)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#0f6b52] px-3 text-sm font-semibold text-[#0f6b52] transition hover:bg-[#eef6f2]"
              >
                <BadgeCheck size={16} />
                Stamp {item.stamp}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-[#d8e8df] bg-[#eef6f2] p-3 text-sm text-[#284237]">
          Status: <span className="font-semibold">{scoreLabel}</span>. Score: {score}/100.
        </div>
      </section>

      {/* TenaPlate + TenaMove row */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-md border border-[#d7e3db] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#64756b]">
            <Utensils size={16} />
            TenaPlate
          </div>
          <h3 className="mt-2 text-xl font-semibold">{foodSignal.risk} nutrition risk</h3>
          <div className="mt-3 grid gap-3">
            <MetricBar label="Stress load" value={100 - checkIn.stress * 10} />
            <MetricBar label="Sleep recovery" value={clamp((checkIn.sleep / 8) * 100)} />
            <MetricBar label="Movement" value={clamp((checkIn.movement / 30) * 100)} />
            <MetricBar label="Food balance" value={getFoodSignal(checkIn.meal).score} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[#52665c]">{foodSignal.insight}</p>
        </div>

        <div className="rounded-md border border-[#d7e3db] bg-[#102018] p-5 text-white shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#9ee3ca]">
            <Footprints size={16} />
            TenaMove
          </div>
          <h3 className="mt-2 text-xl font-semibold">Office recovery block</h3>
          <p className="mt-3 text-sm leading-6 text-white/68">
            Shoulder rolls, 10 squats, 2 minutes of nasal breathing, then a short walk after lunch.
          </p>
          <button
            type="button"
            onClick={() => award("Move", 12)}
            className="mt-4 h-10 rounded-md bg-white px-3 text-sm font-semibold text-[#102018] transition hover:bg-[#edf6f1]"
          >
            Complete move break
          </button>
        </div>
      </div>
    </div>
  );
}
