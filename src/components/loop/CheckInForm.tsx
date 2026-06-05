"use client";

import { ClipboardCheck, HeartPulse } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { foodLibrary } from "@/lib/foods";
import Segmented from "@/components/ui/Segmented";
import Slider from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";

export default function CheckInForm() {
  const { checkIn, updateCheckIn, score, award } = useWellness();

  return (
    <section className="min-w-0 rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-[#8C6246]">
            <ClipboardCheck size={16} />
            Daily check-in
          </div>
          <h2 className="mt-2 font-serif text-3xl text-[#0A2318]">Today&apos;s inputs</h2>
          <p className="mt-1 text-sm leading-6 text-[#0A2318]/62">
            Update the signals that drive your TenaScore and action plan.
          </p>
        </div>
        <span className="rounded-full bg-[#0A2318] px-3 py-2 text-sm font-semibold text-[#E8EDE7]">
          {score}/100
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        <Segmented
          label="Mood"
          options={["Heavy", "Steady", "Bright"]}
          value={checkIn.mood}
          onChange={(v) => updateCheckIn("mood", v as typeof checkIn.mood)}
        />

        <Slider label="Stress" min={1} max={10} value={checkIn.stress} onChange={(v) => updateCheckIn("stress", v)} />
        <Slider label="Sleep hours" min={0} max={10} value={checkIn.sleep} onChange={(v) => updateCheckIn("sleep", v)} />
        <Slider label="Energy" min={1} max={10} value={checkIn.energy} onChange={(v) => updateCheckIn("energy", v)} />
        <Slider label="Movement minutes" min={0} max={60} value={checkIn.movement} onChange={(v) => updateCheckIn("movement", v)} />
        <Slider label="Water cups" min={0} max={10} value={checkIn.water} onChange={(v) => updateCheckIn("water", v)} />

        <label className="grid gap-2 text-sm font-medium text-[#0A2318]/82">
          Last meal
          <select
            value={checkIn.meal}
            onChange={(e) => updateCheckIn("meal", e.target.value)}
            className="h-11 w-full min-w-0 rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246] focus:bg-[#F3F5F1]"
          >
            {foodLibrary.map((food) => (
              <option key={food.label}>{food.label}</option>
            ))}
          </select>
        </label>

        <Segmented
          label="Social support"
          options={["Low", "Some", "Strong"]}
          value={checkIn.support}
          onChange={(v) => updateCheckIn("support", v as typeof checkIn.support)}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle label="Fasting day" checked={checkIn.fasting} onChange={() => updateCheckIn("fasting", !checkIn.fasting)} />
          <Toggle label="BP focus" checked={checkIn.bpFocus} onChange={() => updateCheckIn("bpFocus", !checkIn.bpFocus)} />
          <Toggle label="Glucose focus" checked={checkIn.glucoseFocus} onChange={() => updateCheckIn("glucoseFocus", !checkIn.glucoseFocus)} />
        </div>

        {(checkIn.bpFocus || checkIn.glucoseFocus) && (
          <div className="grid gap-3 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#0A2318]">
              <HeartPulse size={17} />
              Health self-log
            </p>
            {checkIn.bpFocus && (
              <label className="grid gap-1.5 text-sm font-medium text-[#0A2318]/82">
                Blood pressure (e.g. 130/85)
                <input
                  type="text"
                  value={checkIn.bp}
                  onChange={(e) => updateCheckIn("bp", e.target.value)}
                  placeholder="systolic / diastolic"
                  className="h-10 rounded-full border border-[#0A2318]/12 bg-[#E8EDE7] px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                />
              </label>
            )}
            {checkIn.glucoseFocus && (
              <label className="grid gap-1.5 text-sm font-medium text-[#0A2318]/82">
                Blood glucose (mg/dL)
                <input
                  type="text"
                  value={checkIn.glucose}
                  onChange={(e) => updateCheckIn("glucose", e.target.value)}
                  placeholder="e.g. 108"
                  className="h-10 rounded-full border border-[#0A2318]/12 bg-[#E8EDE7] px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                />
              </label>
            )}
            <p className="text-xs text-[#0A2318]/58">
              Self-logs help the AI action plan adjust for BP and glucose risk. Not shared with third parties.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => award("Health", 15)}
          className="h-11 rounded-full bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#1A3A2A]"
        >
          Save check-in
        </button>
      </div>
    </section>
  );
}
