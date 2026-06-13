"use client";

import { useMemo, useState, type ElementType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  Check,
  Coffee,
  Droplets,
  HeartPulse,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import BodyMapInput from "@/components/loop/BodyMapInput";
import ActionPlan from "@/components/loop/ActionPlan";
import { BodyArea, CycleContext, PainTrigger, PreferredLanguage } from "@/lib/types";
import { foodLibrary } from "@/lib/foods";
import { cn } from "@/lib/utils";

const INK = "#0A2318";
const SAGE = "#4C956C";
const GOLD = "#EFB84C";
const CLAY = "#D65A31";
const WATER = "#2C7DA0";
const BROWN = "#8C6246";

function tone(score: number) {
  if (score >= 75) return { hex: SAGE, bg: "#EAF4EE", name: "Rooted" };
  if (score >= 55) return { hex: GOLD, bg: "#FFF6DD", name: "Steady" };
  return { hex: CLAY, bg: "#FCECE7", name: "Go gentle" };
}

const PAIN_TRIGGERS: PainTrigger[] = ["Long sitting", "Stress", "Poor sleep", "Exercise", "Not sure"];
const CYCLE_OPTIONS: CycleContext[] = ["None", "Period near", "On period", "Pregnant", "Postpartum"];
const LANGUAGE_OPTIONS: PreferredLanguage[] = ["English", "Amharic-ready", "Mixed"];

const STEPS = [
  { id: "mind", label: "Mind", icon: Brain, caption: "Mood, stress, energy" },
  { id: "body", label: "Body", icon: Bone, caption: "Pain map and triggers" },
  { id: "lifestyle", label: "Lifestyle", icon: Coffee, caption: "Sleep, food, water" },
  { id: "health", label: "Health", icon: HeartPulse, caption: "Private health context" },
  { id: "plan", label: "Plan", icon: Sparkles, caption: "Your rooted path" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function LoopShell() {
  const { checkIn, updateCheckIn, score, scoreLabel, saveCheckIn } = useWellness();
  const [step, setStep] = useState<StepId>("mind");
  const [saved, setSaved] = useState(false);

  const idx = STEPS.findIndex((item) => item.id === step);
  const activeStep = STEPS[idx];
  const scoreTone = tone(score);
  const progress = ((idx + 1) / STEPS.length) * 100;
  const mealOptions = useMemo(() => foodLibrary.map((food) => food.label), []);

  function togglePainArea(area: BodyArea) {
    const next = checkIn.painAreas.includes(area)
      ? checkIn.painAreas.filter((item) => item !== area)
      : [...checkIn.painAreas, area];
    updateCheckIn("painAreas", next);
  }

  function handleSave() {
    saveCheckIn();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function goNext() {
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  }

  function goBack() {
    if (idx > 0) setStep(STEPS[idx - 1].id);
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#E5EAE3] text-[#0A2318]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="relative overflow-hidden rounded-lg border border-[#0A2318]/10 bg-[#0A2318] p-5 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 sm:p-7">
            <div className="relative z-10 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EFB84C]">Daily check-in</p>
              <h1 className="mt-3 font-serif text-5xl leading-[0.98] text-white">
                What Does your Body Telling you Today?
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                One calm loop for mood, pain, sleep, food, movement, and private health context.
              </p>
            </div>

            <div className="relative z-10 mt-6 grid gap-2 sm:grid-cols-4">
              <HeroMetric icon={Brain} label="Mood" value={checkIn.mood} />
              <HeroMetric icon={Activity} label="Stress" value={`${checkIn.stress}/10`} />
              <HeroMetric icon={Moon} label="Sleep" value={`${checkIn.sleep}h`} />
              <HeroMetric icon={Droplets} label="Water" value={`${checkIn.water} cups`} />
            </div>
          </section>

          <section className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Live TenaScore</p>
                <p className="mt-2 font-serif text-5xl leading-none text-[#0A2318]">{score}</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: scoreTone.hex }}>{scoreTone.name} zone</p>
              </div>
              <ScoreDial score={score} color={scoreTone.hex} />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E6ECE5]">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: scoreTone.hex }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-[#0A2318]/62">
              Current status: <span className="font-semibold text-[#0A2318]">{scoreLabel}</span>. Saving this loop updates analytics, points, and passport progress.
            </p>
          </section>
        </header>

        <section className={cn("grid min-w-0 gap-5", step === "plan" ? "xl:grid-cols-[280px_minmax(0,1fr)]" : "xl:grid-cols-[280px_minmax(0,1fr)_320px]")}>
          <StepRail active={step} progress={progress} onSelect={setStep} />

          <main className="grid min-w-0 content-start gap-4">
            <div className="rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Step {idx + 1} of {STEPS.length}</p>
                  <h2 className="mt-1 font-serif text-3xl leading-tight text-[#0A2318]">{activeStep.label}</h2>
                  <p className="mt-1 text-sm text-[#0A2318]/58">{activeStep.caption}</p>
                </div>
                <span className="w-fit rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 py-2 text-xs font-semibold text-[#0A2318]/62">
                  {Math.round(progress)}% complete
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="grid min-w-0 gap-4"
              >
                {step === "mind" ? (
                  <SectionCard icon={Brain} eyebrow="Mind check" title="Name the signal, then make it small enough to move.">
                    <Pills
                      label="How is your mood?"
                      options={["Heavy", "Steady", "Bright"]}
                      value={checkIn.mood}
                      accent={GOLD}
                      onChange={(value) => updateCheckIn("mood", value as typeof checkIn.mood)}
                    />
                    <Range label="Stress level" min={1} max={10} value={checkIn.stress} hex={CLAY} onChange={(value) => updateCheckIn("stress", value)} />
                    <Range label="Energy level" min={1} max={10} value={checkIn.energy} hex={SAGE} onChange={(value) => updateCheckIn("energy", value)} />
                  </SectionCard>
                ) : null}

                {step === "body" ? (
                  <>
                    <SectionCard icon={Bone} eyebrow="Body map" title="Mark what needs gentleness today.">
                      <BodyMapInput selected={checkIn.painAreas} onToggle={togglePainArea} />
                    </SectionCard>
                    <SectionCard icon={Activity} eyebrow="Pain context" title="Connect the ache to its pattern.">
                      <Pills
                        label="What brings it on?"
                        options={PAIN_TRIGGERS}
                        value={checkIn.painTrigger}
                        accent={BROWN}
                        onChange={(value) => updateCheckIn("painTrigger", value as PainTrigger)}
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Switch label="This pain is new" checked={checkIn.painIsNew} accent={GOLD} onChange={() => updateCheckIn("painIsNew", !checkIn.painIsNew)} />
                        <Switch label="Warning signs" checked={checkIn.redFlags} accent={CLAY} onChange={() => updateCheckIn("redFlags", !checkIn.redFlags)} />
                      </div>
                      {checkIn.redFlags ? (
                        <Note hex={CLAY}>Warning signs selected. Consult a licensed provider before continuing self-guided movement.</Note>
                      ) : null}
                    </SectionCard>
                  </>
                ) : null}

                {step === "lifestyle" ? (
                  <>
                    <SectionCard icon={Coffee} eyebrow="Daily rhythm" title="The small levers that change the whole day.">
                      <Range label="Sleep" min={0} max={10} value={checkIn.sleep} hex={SAGE} unit="h" onChange={(value) => updateCheckIn("sleep", value)} />
                      <Range label="Movement" min={0} max={60} value={checkIn.movement} hex={GOLD} unit="min" onChange={(value) => updateCheckIn("movement", value)} />
                      <Range label="Water" min={0} max={10} value={checkIn.water} hex={WATER} unit="cups" onChange={(value) => updateCheckIn("water", value)} />
                      <MealField value={checkIn.meal} options={mealOptions} onChange={(value) => updateCheckIn("meal", value)} />
                    </SectionCard>
                    <SectionCard icon={Utensils} eyebrow="Inputs" title="Screens, coffee, and sugar without judgment.">
                      <Range label="Screen time" min={0} max={12} value={checkIn.screenHours} hex={CLAY} unit="h" onChange={(value) => updateCheckIn("screenHours", value)} />
                      <Range label="Coffee" min={0} max={6} value={checkIn.coffeeCups} hex={BROWN} unit="cups" onChange={(value) => updateCheckIn("coffeeCups", value)} />
                      <Range label="Sugar" min={0} max={6} value={checkIn.sugarServings} hex={GOLD} unit="servings" onChange={(value) => updateCheckIn("sugarServings", value)} />
                    </SectionCard>
                  </>
                ) : null}

                {step === "health" ? (
                  <>
                    <SectionCard icon={Baby} eyebrow="Women&apos;s wellness" title="Private context that keeps guidance gentle.">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Pills
                          label="Mode"
                          options={["Off", "On"]}
                          value={checkIn.womenWellness ? "On" : "Off"}
                          accent={BROWN}
                          onChange={(value) => updateCheckIn("womenWellness", value === "On")}
                        />
                        <Switch label="Privacy mode" checked={checkIn.privacyMode} accent={SAGE} onChange={() => updateCheckIn("privacyMode", !checkIn.privacyMode)} />
                      </div>
                      {checkIn.womenWellness ? (
                        <Pills
                          label="Cycle context"
                          options={CYCLE_OPTIONS}
                          value={checkIn.cycleContext}
                          accent={BROWN}
                          onChange={(value) => updateCheckIn("cycleContext", value as CycleContext)}
                        />
                      ) : null}
                      <Note hex={BROWN}>General wellness guidance only. Severe or unusual symptoms should route to a licensed provider.</Note>
                    </SectionCard>

                    <SectionCard icon={Users} eyebrow="Culture and support" title="Your loop should fit your real routine.">
                      <Pills
                        label="Social support"
                        options={["Low", "Some", "Strong"]}
                        value={checkIn.support}
                        accent={SAGE}
                        onChange={(value) => updateCheckIn("support", value as typeof checkIn.support)}
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Switch label="Fasting day" checked={checkIn.fasting} accent={GOLD} onChange={() => updateCheckIn("fasting", !checkIn.fasting)} />
                        <Switch label="Family stress" checked={checkIn.familyStress} accent={CLAY} onChange={() => updateCheckIn("familyStress", !checkIn.familyStress)} />
                        <Switch label="Community support" checked={checkIn.communitySupport} accent={SAGE} onChange={() => updateCheckIn("communitySupport", !checkIn.communitySupport)} />
                        <Select label="Language" value={checkIn.preferredLanguage} options={LANGUAGE_OPTIONS} onChange={(value) => updateCheckIn("preferredLanguage", value as PreferredLanguage)} />
                      </div>
                    </SectionCard>

                    <SectionCard icon={Lock} eyebrow="Health self-log" title="Private BP and glucose context when it matters.">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Switch label="BP focus" checked={checkIn.bpFocus} accent={WATER} onChange={() => updateCheckIn("bpFocus", !checkIn.bpFocus)} />
                        <Switch label="Glucose focus" checked={checkIn.glucoseFocus} accent={GOLD} onChange={() => updateCheckIn("glucoseFocus", !checkIn.glucoseFocus)} />
                      </div>
                      {checkIn.bpFocus || checkIn.glucoseFocus ? (
                        <div className="grid gap-3 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-4">
                          {checkIn.bpFocus ? <Field label="Blood pressure" value={checkIn.bp} placeholder="e.g. 130/85" onChange={(value) => updateCheckIn("bp", value)} /> : null}
                          {checkIn.glucoseFocus ? <Field label="Blood glucose" value={checkIn.glucose} placeholder="e.g. 108" onChange={(value) => updateCheckIn("glucose", value)} /> : null}
                          <p className="text-xs leading-5 text-[#0A2318]/58">Self-logs help the wellness path adjust for BP and glucose risk.</p>
                        </div>
                      ) : null}
                    </SectionCard>
                  </>
                ) : null}

                {step === "plan" ? <ActionPlan /> : null}
              </motion.div>
            </AnimatePresence>

            <LoopFooter
              isPlan={step === "plan"}
              canBack={idx > 0}
              isLastFormStep={idx === STEPS.length - 2}
              saved={saved}
              onBack={goBack}
              onNext={goNext}
              onSave={handleSave}
            />
          </main>

          {step !== "plan" ? <LiveSummary /> : null}
        </section>
      </div>
    </div>
  );
}

function StepRail({
  active,
  progress,
  onSelect,
}: {
  active: StepId;
  progress: number;
  onSelect: (step: StepId) => void;
}) {
  return (
    <aside className="grid content-start gap-4 xl:sticky xl:top-6">
      <section className="rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Loop path</p>
          <span className="text-xs font-bold text-[#0A2318]/54">{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E6ECE5]">
          <div className="h-full rounded-full bg-[#EFB84C] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto xl:grid">
          {STEPS.map(({ id, label, icon: Icon, caption }, index) => {
            const selected = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className={cn(
                  "flex min-w-44 items-center gap-3 rounded-lg border px-3 py-3 text-left transition xl:min-w-0",
                  selected
                    ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                    : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318] hover:border-[#0A2318]/24",
                )}
              >
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", selected ? "bg-white/10 text-[#EFB84C]" : "bg-white text-[#8C6246]")}>
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{index + 1}. {label}</span>
                  <span className={cn("mt-0.5 block truncate text-xs", selected ? "text-white/50" : "text-[#0A2318]/48")}>{caption}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

function LiveSummary() {
  const { checkIn, foodSignal, score, scoreLabel } = useWellness();
  const scoreTone = tone(score);
  const selectedPain = checkIn.painAreas.length ? checkIn.painAreas.join(" + ") : "None";

  return (
    <aside className="grid content-start gap-4">
      <section className="rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Live signals</p>
        <div className="mt-4 grid gap-2">
          <Signal icon={Brain} label="Status" value={`${score} - ${scoreLabel}`} color={scoreTone.hex} />
          <Signal icon={Bone} label="Body" value={selectedPain} color={BROWN} />
          <Signal icon={Utensils} label="Food" value={foodSignal.risk} color={GOLD} />
          <Signal icon={Moon} label="Sleep" value={`${checkIn.sleep}h`} color={SAGE} />
          <Signal icon={Users} label="Support" value={checkIn.support} color={WATER} />
        </div>
      </section>

      <section className="rounded-lg border border-[#0A2318]/10 bg-[#0A2318] p-4 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-center gap-2 text-[#EFB84C]">
          <ShieldCheck size={16} />
          <p className="text-xs font-bold uppercase tracking-[0.16em]">Safety</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/68">
          Red flags route to care. Otherwise, the loop stays gentle: breathe, move lightly, nourish, connect.
        </p>
      </section>
    </aside>
  );
}

function LoopFooter({
  isPlan,
  canBack,
  isLastFormStep,
  saved,
  onBack,
  onNext,
  onSave,
}: {
  isPlan: boolean;
  canBack: boolean;
  isLastFormStep: boolean;
  saved: boolean;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
}) {
  if (isPlan) {
    return (
      <button
        type="button"
        onClick={onSave}
        className={cn(
          "flex h-14 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold uppercase tracking-[0.14em] transition active:scale-[0.98]",
          saved ? "bg-[#4C956C] text-white" : "bg-[#0A2318] text-[#E8EDE7] hover:bg-[#173829]",
        )}
      >
        {saved ? <><Check size={18} /> Check-in saved +15 points</> : <>Save today&apos;s check-in</>}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#0A2318]/10 bg-white p-3 shadow-sm shadow-[#0A2318]/5">
      {canBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 items-center gap-2 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-4 text-sm font-semibold text-[#0A2318]/68 transition hover:text-[#0A2318]"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSave}
        className={cn(
          "h-11 rounded-lg px-4 text-sm font-semibold transition",
          saved ? "bg-[#4C956C] text-white" : "bg-[#F7F9F5] text-[#0A2318]/68 hover:text-[#0A2318]",
        )}
      >
        {saved ? "Saved" : "Save"}
      </button>
      <button
        type="button"
        onClick={onNext}
        className="ml-auto flex h-11 items-center gap-2 rounded-lg bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#173829]"
      >
        {isLastFormStep ? "See plan" : "Next"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: ElementType;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#F7F9F5] text-[#8C6246]">
          <Icon size={20} />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">{eyebrow}</p>
          <h3 className="mt-1 font-serif text-2xl leading-tight text-[#0A2318]">{title}</h3>
        </div>
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function HeroMetric({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/8 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">
        <Icon size={12} className="text-[#EFB84C]" />
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function Signal({ icon: Icon, label, value, color }: { icon: ElementType; label: string; value: string; color: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-white" style={{ color }}>
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A2318]/42">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-semibold text-[#0A2318]">{value}</span>
      </span>
    </div>
  );
}

function ScoreDial({ score, color }: { score: number; color: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const filled = circumference - (circumference * score) / 100;

  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <svg width="96" height="96" className="-rotate-90" aria-hidden="true">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#E6ECE5" strokeWidth="10" />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={filled}
        />
      </svg>
      <span className="absolute text-sm font-bold text-[#0A2318]">{score}%</span>
    </div>
  );
}

function Pills({
  label,
  options,
  value,
  accent,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  accent: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2.5">
      <span className="text-sm font-semibold text-[#0A2318]/82">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className="rounded-lg border px-4 py-2 text-sm font-semibold transition active:scale-95"
              style={{
                backgroundColor: selected ? accent : "#F7F9F5",
                color: selected ? "#FFFFFF" : "#0A2318",
                borderColor: selected ? accent : "rgb(10 35 24 / 0.1)",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Range({
  label,
  min,
  max,
  value,
  hex,
  unit,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  hex: string;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="grid gap-2.5">
      <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#0A2318]/82">
        {label}
        <span className="rounded-lg bg-[#F7F9F5] px-2 py-1 text-sm font-bold" style={{ color: hex }}>
          {value}{unit ? <span className="ml-1 text-[10px] font-medium text-[#0A2318]/45">{unit}</span> : null}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: `linear-gradient(to right, ${hex} ${pct}%, rgb(10 35 24 / 0.12) ${pct}%)`, accentColor: hex }}
      />
    </label>
  );
}

function Switch({
  label,
  checked,
  accent,
  onChange,
}: {
  label: string;
  checked: boolean;
  accent: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex min-h-12 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition"
      style={{
        backgroundColor: checked ? `${accent}14` : "#F7F9F5",
        borderColor: checked ? `${accent}55` : "rgb(10 35 24 / 0.1)",
        color: INK,
      }}
    >
      {label}
      <span className="relative h-6 w-11 shrink-0 rounded-full transition-colors" style={{ backgroundColor: checked ? accent : "rgb(10 35 24 / 0.18)" }}>
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: checked ? "1.375rem" : "0.125rem" }} />
      </span>
    </button>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#0A2318]/82">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-4 text-sm text-[#0A2318] outline-none"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function MealField({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (value: string) => void }) {
  const known = options.includes(value);
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#0A2318]/82">
      <span className="flex items-center justify-between gap-3">
        Last meal
        <span className="text-xs font-medium text-[#0A2318]/45">{value.trim() ? (known ? "From library" : "Custom meal") : "Pick or type"}</span>
      </span>
      <input
        list="loop-meal-options"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pick from the list or type your own..."
        className="h-11 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-4 text-sm text-[#0A2318] outline-none"
      />
      <datalist id="loop-meal-options">
        {options.map((option) => <option key={option} value={option} />)}
      </datalist>
    </label>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[#0A2318]/82">
      {label}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-[#0A2318]/10 bg-white px-4 text-sm text-[#0A2318] outline-none"
      />
    </label>
  );
}

function Note({ children, hex }: { children: React.ReactNode; hex: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4" style={{ backgroundColor: `${hex}12`, borderColor: `${hex}30` }}>
      <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: hex }} />
      <p className="text-sm leading-6 text-[#0A2318]/68">{children}</p>
    </div>
  );
}
