"use client";

import {
  AlertTriangle,
  Baby,
  Bone,
  ClipboardCheck,
  Coffee,
  EyeOff,
  HeartPulse,
  Monitor,
  Users,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import BodyMapInput from "@/components/loop/BodyMapInput";
import { BodyArea, CycleContext, PainTrigger, PreferredLanguage } from "@/lib/types";
import { foodLibrary } from "@/lib/foods";
import Segmented from "@/components/ui/Segmented";
import Slider from "@/components/ui/Slider";
import Toggle from "@/components/ui/Toggle";

const PAIN_TRIGGERS: PainTrigger[] = [
  "Long sitting",
  "Stress",
  "Poor sleep",
  "Exercise",
  "Not sure",
];

const CYCLE_OPTIONS: CycleContext[] = [
  "None",
  "Period near",
  "On period",
  "Pregnant",
  "Postpartum",
];

const LANGUAGE_OPTIONS: PreferredLanguage[] = ["English", "Amharic-ready", "Mixed"];

export default function CheckInForm() {
  const { checkIn, updateCheckIn, score, saveCheckIn } = useWellness();

  function togglePainArea(area: BodyArea) {
    const next = checkIn.painAreas.includes(area)
      ? checkIn.painAreas.filter((item) => item !== area)
      : [...checkIn.painAreas, area];

    updateCheckIn("painAreas", next);
  }

  return (
    <section className="grid min-w-0 content-start gap-4">
      <div className="rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between xl:flex-col">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
            <ClipboardCheck size={16} />
            Rooted check-in
          </div>
          <h2 className="mt-2 font-serif text-2xl leading-tight text-[#0A2318] sm:text-3xl">
            What is your body telling you today?
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#0A2318]/62">
            Mind, body, food, movement, women&apos;s wellness, and routine signals feed
            today&apos;s wellness path.
          </p>
        </div>
        <span className="rounded-full bg-[#0A2318] px-3 py-2 text-sm font-semibold text-[#E8EDE7]">
          {score}/100
        </span>
        </div>
      </div>

      <div className="grid gap-4">
        <InputGroup icon={HeartPulse} label="Mind">
          <Segmented
            label="Mood"
            options={["Heavy", "Steady", "Bright"]}
            value={checkIn.mood}
            onChange={(v) => updateCheckIn("mood", v as typeof checkIn.mood)}
          />

          <Slider
            label="Stress"
            min={1}
            max={10}
            value={checkIn.stress}
            onChange={(v) => updateCheckIn("stress", v)}
          />
          <Slider
            label="Energy"
            min={1}
            max={10}
            value={checkIn.energy}
            onChange={(v) => updateCheckIn("energy", v)}
          />
        </InputGroup>

        <InputGroup icon={Bone} label="Body map">
          <BodyMapInput selected={checkIn.painAreas} onToggle={togglePainArea} />

          <div className="grid gap-3">
            <Segmented
              label="Pain trigger"
              options={PAIN_TRIGGERS}
              value={checkIn.painTrigger}
              onChange={(v) => updateCheckIn("painTrigger", v as PainTrigger)}
            />
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <Toggle
                label="New pain"
                checked={checkIn.painIsNew}
                onChange={() => updateCheckIn("painIsNew", !checkIn.painIsNew)}
              />
              <Toggle
                label="Warning signs"
                checked={checkIn.redFlags}
                onChange={() => updateCheckIn("redFlags", !checkIn.redFlags)}
              />
            </div>
          </div>
        </InputGroup>

        <InputGroup icon={Baby} label="Women's wellness">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end xl:grid-cols-1">
            <Segmented
              label="Mode"
              options={["Off", "On"]}
              value={checkIn.womenWellness ? "On" : "Off"}
              onChange={(v) => updateCheckIn("womenWellness", v === "On")}
            />
            <Toggle
              label="Privacy"
              checked={checkIn.privacyMode}
              onChange={() => updateCheckIn("privacyMode", !checkIn.privacyMode)}
            />
          </div>

          {checkIn.womenWellness && (
            <Segmented
              label="Cycle context"
              options={CYCLE_OPTIONS}
              value={checkIn.cycleContext}
              onChange={(v) => updateCheckIn("cycleContext", v as CycleContext)}
            />
          )}

          <div className="flex items-start gap-2 rounded-[1.25rem] border border-[#8C6246]/18 bg-[#D4C1A0]/28 p-3 text-xs leading-5 text-[#0A2318]/70">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#8C6246]" />
            <span>
              General wellness guidance only. Severe or unusual symptoms should route
              to a licensed provider.
            </span>
          </div>
        </InputGroup>

        <InputGroup icon={Coffee} label="Lifestyle">
          <Slider
            label="Sleep hours"
            min={0}
            max={10}
            value={checkIn.sleep}
            onChange={(v) => updateCheckIn("sleep", v)}
          />
          <Slider
            label="Movement minutes"
            min={0}
            max={60}
            value={checkIn.movement}
            onChange={(v) => updateCheckIn("movement", v)}
          />
          <Slider
            label="Water cups"
            min={0}
            max={10}
            value={checkIn.water}
            onChange={(v) => updateCheckIn("water", v)}
          />

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

          <div className="grid gap-3">
            <Slider
              label="Screen hours"
              min={0}
              max={12}
              value={checkIn.screenHours}
              onChange={(v) => updateCheckIn("screenHours", v)}
            />
            <Slider
              label="Coffee cups"
              min={0}
              max={6}
              value={checkIn.coffeeCups}
              onChange={(v) => updateCheckIn("coffeeCups", v)}
            />
            <Slider
              label="Sugar servings"
              min={0}
              max={6}
              value={checkIn.sugarServings}
              onChange={(v) => updateCheckIn("sugarServings", v)}
            />
          </div>
        </InputGroup>

        <InputGroup icon={Users} label="Culture & routine">
          <Segmented
            label="Social support"
            options={["Low", "Some", "Strong"]}
            value={checkIn.support}
            onChange={(v) => updateCheckIn("support", v as typeof checkIn.support)}
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Toggle
              label="Fasting day"
              checked={checkIn.fasting}
              onChange={() => updateCheckIn("fasting", !checkIn.fasting)}
            />
            <Toggle
              label="Family stress"
              checked={checkIn.familyStress}
              onChange={() => updateCheckIn("familyStress", !checkIn.familyStress)}
            />
            <Toggle
              label="Religious/community support"
              checked={checkIn.communitySupport}
              onChange={() => updateCheckIn("communitySupport", !checkIn.communitySupport)}
            />
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-full border border-[#0A2318]/12 bg-[#E8EDE7] px-3 text-sm font-semibold text-[#0A2318]/72">
              <Monitor size={15} className="shrink-0 text-[#8C6246]" />
              <select
                value={checkIn.preferredLanguage}
                onChange={(e) =>
                  updateCheckIn("preferredLanguage", e.target.value as PreferredLanguage)
                }
                className="min-w-0 flex-1 bg-transparent outline-none"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </InputGroup>

        <InputGroup icon={EyeOff} label="Health self-log">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Toggle
              label="BP focus"
              checked={checkIn.bpFocus}
              onChange={() => updateCheckIn("bpFocus", !checkIn.bpFocus)}
            />
            <Toggle
              label="Glucose focus"
              checked={checkIn.glucoseFocus}
              onChange={() => updateCheckIn("glucoseFocus", !checkIn.glucoseFocus)}
            />
          </div>

          {(checkIn.bpFocus || checkIn.glucoseFocus) && (
            <div className="grid gap-3 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#0A2318]">
                <HeartPulse size={17} />
                Private health notes
              </p>
              {checkIn.bpFocus && (
                <label className="grid gap-1.5 text-sm font-medium text-[#0A2318]/82">
                  Blood pressure
                  <input
                    type="text"
                    value={checkIn.bp}
                    onChange={(e) => updateCheckIn("bp", e.target.value)}
                    placeholder="e.g. 130/85"
                    className="h-10 rounded-full border border-[#0A2318]/12 bg-[#E8EDE7] px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                  />
                </label>
              )}
              {checkIn.glucoseFocus && (
                <label className="grid gap-1.5 text-sm font-medium text-[#0A2318]/82">
                  Blood glucose
                  <input
                    type="text"
                    value={checkIn.glucose}
                    onChange={(e) => updateCheckIn("glucose", e.target.value)}
                    placeholder="e.g. 108"
                    className="h-10 rounded-full border border-[#0A2318]/12 bg-[#E8EDE7] px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                  />
                </label>
              )}
              <p className="text-xs leading-5 text-[#0A2318]/58">
                Self-logs help the wellness path adjust for BP and glucose risk.
                They are not shared with providers unless the user chooses to share.
              </p>
            </div>
          )}
        </InputGroup>

        <button
          type="button"
          onClick={saveCheckIn}
          className="h-11 rounded-full bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#1A3A2A]"
        >
          Save rooted check-in
        </button>
      </div>
    </section>
  );
}

function InputGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  children: React.ReactNode;
}) {
  return (
      <div className="grid gap-3 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
        <Icon size={15} />
        {label}
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}
