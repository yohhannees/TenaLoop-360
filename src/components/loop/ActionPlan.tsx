"use client";

import { BadgeCheck, Footprints, Sparkles, Utensils } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { clamp } from "@/lib/utils";
import { getFoodSignal } from "@/lib/foods";
import MetricBar from "@/components/ui/MetricBar";

export default function ActionPlan() {
  const { plan, award, checkIn, score, scoreLabel, foodSignal } = useWellness();

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      {/* AI Plan */}
      <section className="min-w-0 rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#8C6246]">
              <Sparkles size={16} />
              AI action plan
            </div>
            <h2 className="mt-2 font-serif text-3xl text-[#0A2318]">Personalized next loop</h2>
          </div>
          <span className="rounded-full bg-[#D4C1A0]/45 px-3 py-2 text-sm font-semibold text-[#0A2318]">
            {score}/100
          </span>
        </div>
        <div className="mt-4 grid gap-3">
          {plan.map((item) => (
            <div
              key={item.title}
              className="grid gap-3 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-4 transition hover:border-[#8C6246]/40 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-semibold text-[#0A2318]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#0A2318]/64">{item.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => award(item.stamp, 12)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#0A2318] px-3 text-sm font-semibold text-[#0A2318] transition hover:bg-[#0A2318] hover:text-[#E8EDE7]"
              >
                <BadgeCheck size={16} />
                Stamp {item.stamp}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-[#8C6246]/18 bg-[#D4C1A0]/28 p-3 text-sm text-[#0A2318]/74">
          Status: <span className="font-semibold">{scoreLabel}</span>. Score: {score}/100.
        </div>
      </section>

      {/* TenaPlate + TenaMove row */}
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#8C6246]">
            <Utensils size={16} />
            TenaPlate
          </div>
          <h3 className="mt-2 font-serif text-2xl text-[#0A2318]">{foodSignal.risk} nutrition risk</h3>
          <div className="mt-3 grid gap-3">
            <MetricBar label="Stress load" value={100 - checkIn.stress * 10} />
            <MetricBar label="Sleep recovery" value={clamp((checkIn.sleep / 8) * 100)} />
            <MetricBar label="Movement" value={clamp((checkIn.movement / 30) * 100)} />
            <MetricBar label="Food balance" value={getFoodSignal(checkIn.meal).score} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[#0A2318]/64">{foodSignal.insight}</p>
        </div>

        <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#0A2318] p-5 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#D4C1A0]">
            <Footprints size={16} />
            TenaMove
          </div>
          <h3 className="mt-2 font-serif text-2xl">Office recovery block</h3>
          <p className="mt-3 text-sm leading-6 text-[#E8EDE7]/68">
            Shoulder rolls, 10 squats, 2 minutes of nasal breathing, then a short walk after lunch.
          </p>
          <button
            type="button"
            onClick={() => award("Move", 12)}
            className="mt-4 h-10 rounded-full bg-[#E8EDE7] px-4 text-sm font-semibold text-[#0A2318] transition hover:bg-[#D4C1A0]"
          >
            Complete move break
          </button>
        </div>
      </div>
    </div>
  );
}
