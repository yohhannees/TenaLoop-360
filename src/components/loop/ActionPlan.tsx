"use client";

import { useWellness } from "@/context/WellnessContext";
import { clamp } from "@/lib/utils";
import { getFoodSignal } from "@/lib/foods";
import MetricBar from "@/components/ui/MetricBar";

export default function ActionPlan() {
  const { plan, award, checkIn, score, scoreLabel, foodSignal } = useWellness();

  return (
    <div className="grid gap-5">
      {/* AI Plan */}
      <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
        <p className="text-sm font-medium uppercase text-[#64756b]">AI action plan</p>
        <h2 className="text-2xl font-semibold">Personalized next loop</h2>
        <div className="mt-4 grid gap-3">
          {plan.map((item) => (
            <div
              key={item.title}
              className="grid gap-3 rounded-md border border-[#dde8e1] bg-[#fbfdfb] p-3 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-semibold text-[#14231d]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#52665c]">{item.detail}</p>
              </div>
              <button
                type="button"
                onClick={() => award(item.stamp, 12)}
                className="h-10 rounded-md border border-[#0f6b52] px-3 text-sm font-semibold text-[#0f6b52] transition hover:bg-[#eef6f2]"
              >
                Stamp {item.stamp}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-md bg-[#eef6f2] p-3 text-sm text-[#284237]">
          Status: <span className="font-semibold">{scoreLabel}</span>. Score: {score}/100.
        </div>
      </section>

      {/* TenaPlate + TenaMove row */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium uppercase text-[#64756b]">TenaPlate</p>
          <h3 className="text-xl font-semibold">{foodSignal.risk} nutrition risk</h3>
          <div className="mt-3 grid gap-3">
            <MetricBar label="Stress load" value={100 - checkIn.stress * 10} />
            <MetricBar label="Sleep recovery" value={clamp((checkIn.sleep / 8) * 100)} />
            <MetricBar label="Movement" value={clamp((checkIn.movement / 30) * 100)} />
            <MetricBar label="Food balance" value={getFoodSignal(checkIn.meal).score} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[#52665c]">{foodSignal.insight}</p>
        </div>

        <div className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium uppercase text-[#64756b]">TenaMove</p>
          <h3 className="text-xl font-semibold">Office recovery block</h3>
          <p className="mt-3 text-sm leading-6 text-[#52665c]">
            Shoulder rolls, 10 squats, 2 minutes of nasal breathing, then a short walk after lunch.
          </p>
          <button
            type="button"
            onClick={() => award("Move", 12)}
            className="mt-4 h-10 rounded-md bg-[#1d84a6] px-3 text-sm font-semibold text-white transition hover:bg-[#1670a0]"
          >
            Complete move break
          </button>
        </div>
      </div>
    </div>
  );
}
