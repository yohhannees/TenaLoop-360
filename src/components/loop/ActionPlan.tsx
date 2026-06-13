"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Baby,
  BadgeCheck,
  Bone,
  BookOpen,
  Brain,
  CalendarCheck,
  CheckCircle2,
  Footprints,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Store,
  Users,
  Utensils,
  Volume2,
  Wind,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import {
  RootedPathItem,
  buildRootedPath,
  getBodySignal,
  getPatternSignal,
  getRootedProviderMatches,
  getTenaScoreBreakdown,
} from "@/lib/rooted-body";
import { cn } from "@/lib/utils";
import ScoreRing from "@/components/ui/ScoreRing";

const STEP_ICONS: Record<RootedPathItem["step"], typeof Wind> = {
  Breathe: Wind,
  Move: Footprints,
  Nourish: Utensils,
  Reflect: BookOpen,
  Connect: Users,
  Refer: Stethoscope,
};

export default function ActionPlan() {
  const {
    checkIn,
    score,
    scoreColor,
    scoreLabel,
    foodSignal,
    award,
    savedProviderMatches,
    saveProviderMatch,
    bookedProviders,
    joinedCircles,
    joinCircle,
  } = useWellness();
  const [resetPlayed, setResetPlayed] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  function completeStep(step: string, stamp: RootedPathItem["stamp"]) {
    if (completedSteps.has(step)) return;
    award(stamp, 12);
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  }

  const breakdown = useMemo(() => getTenaScoreBreakdown(checkIn), [checkIn]);
  const path = useMemo(() => buildRootedPath(checkIn, score), [checkIn, score]);
  const providerMatches = useMemo(() => getRootedProviderMatches(checkIn), [checkIn]);
  const bodySignal = getBodySignal(checkIn);
  const patternSignal = getPatternSignal(checkIn);

  function playEfoyReset() {
    setResetPlayed(true);
    award("Mind", 12);
    award("Move", 8);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Bilingual sequence: phonetic Amharic cue + English guidance × 3 cycles
    const lines = [
      "Tinfis.  Inhale through the nose.",
      "Tezna-na.  Soften your shoulders.",
      "Efoy.",
      "Tinfis.",
      "Tezna-na.",
      "Efoy.",
      "Tinfis.",
      "Tezna-na.",
      "Efoy.  Rest now.  Your body is listening.",
    ];

    function speakNext(idx: number) {
      if (idx >= lines.length) return;
      const u = new SpeechSynthesisUtterance(lines[idx]);
      u.rate  = 0.68;
      u.pitch = 0.9;
      u.onend = () => setTimeout(() => speakNext(idx + 1), 950);
      window.speechSynthesis.speak(u);
    }
    speakNext(0);
  }

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
      <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[#0A2318]/10 bg-[#0A2318] p-4 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#D4C1A0]">
              <Sparkles size={16} />
              Rooted Body Intelligence
            </div>
            <h2 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
              TenaScore: {score}/100
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#E8EDE7]/70">
              Stress, pain, sleep, food, cycle context, and support are now one
              culturally rooted wellness loop.
            </p>
          </div>
          <div className="justify-self-start lg:justify-self-end">
            <ScoreRing score={score} color={scoreColor} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-[1.25rem] border border-[#E8EDE7]/12 bg-[#153023] p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4C1A0] text-[#0A2318]">
              <Brain size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-[#D4C1A0]">Pattern detected</p>
              <p className="mt-1 text-base font-semibold leading-6 text-[#E8EDE7]">
                {patternSignal}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#E8EDE7]/62">
                Status: {scoreLabel}. Food signal: {foodSignal.risk}. Body signal: {bodySignal}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.85fr)]">
        <BodyMapPanel />
        <TenaScorePanel breakdown={breakdown} score={score} />
      </section>

      <section className="min-w-0 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
              <Activity size={16} />
              Rooted wellness path
            </div>
            <h3 className="mt-2 font-serif text-2xl leading-tight text-[#0A2318] sm:text-3xl">
              Breathe, move, nourish, reflect, connect, refer.
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#0A2318]/60">
              Do each action in real life, then tap <span className="font-semibold text-[#0A2318]">Mark done</span>.
              Each one adds <span className="font-semibold text-[#0A2318]">+12 points</span> and earns a passport
              stamp - collect all six to unlock provider discounts.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#D4C1A0]/45 px-3 py-2 text-sm font-semibold text-[#0A2318]">
            {completedSteps.size}/{path.length} done
          </span>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {path.map((item, index) => {
            const Icon = STEP_ICONS[item.step];
            const isDone = completedSteps.has(item.step);
            return (
              <div
                key={item.step}
                className={cn(
                  "grid gap-3 rounded-[1.25rem] border p-3 transition sm:grid-cols-[auto_minmax(0,1fr)]",
                  isDone
                    ? "border-[#2D7A50]/40 bg-[#2D7A50]/8"
                    : "border-[#0A2318]/10 bg-[#E5EAE3] hover:border-[#8C6246]/40",
                )}
              >
                <span className={cn(
                  "grid h-10 w-10 place-items-center rounded-full",
                  isDone ? "bg-[#2D7A50] text-white" : "bg-[#0A2318] text-[#D4C1A0]",
                )}>
                  {isDone ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <Icon size={18} />}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase text-[#8C6246]">
                      {index + 1}. {item.step}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        isDone ? "bg-[#2D7A50]/15 text-[#2D7A50]" : "bg-[#0A2318]/8 text-[#0A2318]/55",
                      )}
                    >
                      {item.stamp} stamp{isDone ? " done" : ""}
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-[#0A2318]">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-[#0A2318]/64">{item.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => completeStep(item.step, item.stamp)}
                  disabled={isDone}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition sm:col-start-2",
                    isDone
                      ? "cursor-default bg-[#2D7A50]/12 text-[#2D7A50]"
                      : "bg-[#0A2318] text-[#E8EDE7] hover:bg-[#1A3A2A]",
                  )}
                >
                  {isDone ? (
                    <><CheckCircle2 size={16} /> Done +12 pts earned</>
                  ) : (
                    <><BadgeCheck size={16} /> Mark done +12 pts</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <EfoyResetPanel played={resetPlayed} onPlay={playEfoyReset} />
        <ProviderMatchPanel
          matches={providerMatches}
          savedProviderMatches={savedProviderMatches}
          bookedProviders={bookedProviders}
          joinedCircles={joinedCircles}
          onSaveProvider={(id, stamp) => {
            saveProviderMatch(id);
            if (stamp !== "Experience") award(stamp, 15);
          }}
          onJoinCircle={joinCircle}
        />
      </section>

      <section className="min-w-0 rounded-[1.5rem] border border-[#8C6246]/18 bg-[#D4C1A0]/30 p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#E8EDE7] text-[#8C6246]">
            {checkIn.redFlags ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-[#8C6246]">Safety positioning</p>
            <p className="mt-2 text-sm leading-6 text-[#0A2318]/74">
              TenaLoop detects wellness patterns, provides safe self-care guidance,
              and refers users to professionals when symptoms need care. It does not
              diagnose depression, spine problems, or women&apos;s health conditions.
            </p>
            {checkIn.redFlags && (
              <p className="mt-3 rounded-[1.25rem] border border-[#8C6246]/25 bg-[#E8EDE7]/70 p-3 text-sm font-semibold leading-6 text-[#0A2318]">
                Warning signs selected. Refer to a licensed provider before continuing
                self-guided movement.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function BodyMapPanel() {
  const { checkIn } = useWellness();
  const selected = checkIn.painAreas.length > 0 ? checkIn.painAreas : ["No pain area"];

  return (
    <section className="min-w-0 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
        <Bone size={16} />
        Body map
      </div>
      <h3 className="mt-2 font-serif text-2xl leading-tight text-[#0A2318]">
        {getBodySignal(checkIn)}
      </h3>

      <div className="mt-4 grid gap-3">
        <div className="grid min-h-44 place-items-center rounded-[1.25rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3">
          <div className="relative grid h-48 w-32 place-items-center">
            <span className="absolute top-0 h-11 w-11 rounded-full border border-[#0A2318]/18 bg-[#D4C1A0]/55" />
            <span className="absolute top-12 h-20 w-16 rounded-[2rem] border border-[#0A2318]/18 bg-[#0A2318]/8" />
            <span className="absolute top-20 h-16 w-24 rounded-full border border-[#0A2318]/12 bg-[#8C6246]/14" />
            <span className="absolute bottom-8 left-8 h-20 w-4 rounded-full bg-[#0A2318]/12" />
            <span className="absolute bottom-8 right-8 h-20 w-4 rounded-full bg-[#0A2318]/12" />
            <span className="absolute left-0 top-24 h-5 w-12 rounded-full bg-[#0A2318]/12" />
            <span className="absolute right-0 top-24 h-5 w-12 rounded-full bg-[#0A2318]/12" />
            {checkIn.painAreas.includes("Neck") && <MapDot className="left-[52px] top-[42px]" />}
            {checkIn.painAreas.includes("Shoulders") && <MapDot className="left-[23px] top-[78px]" />}
            {checkIn.painAreas.includes("Lower back") && <MapDot className="left-[52px] top-[128px]" />}
            {checkIn.painAreas.includes("Head") && <MapDot className="left-[52px] top-[18px]" />}
            {checkIn.painAreas.includes("Stomach") && <MapDot className="left-[52px] top-[105px]" />}
            {checkIn.painAreas.includes("Chest") && <MapDot className="left-[52px] top-[82px]" />}
            {checkIn.painAreas.includes("Hips") && <MapDot className="left-[52px] top-[143px]" />}
            {checkIn.painAreas.includes("Knees") && <MapDot className="left-[38px] top-[178px]" />}
            {checkIn.painAreas.includes("Wrists/hands") && <MapDot className="left-[5px] top-[105px]" />}
          </div>
        </div>

        <div className="grid content-start gap-2 sm:grid-cols-2">
          <SignalRow label="Selected areas" value={selected.join(" + ")} />
          <SignalRow label="Trigger" value={checkIn.painTrigger} />
          <SignalRow label="New pain" value={checkIn.painIsNew ? "Yes" : "No"} />
          <SignalRow label="Warning signs" value={checkIn.redFlags ? "Yes" : "No"} warn={checkIn.redFlags} />
          <div className="rounded-[1rem] border border-[#0A2318]/10 bg-[#D4C1A0]/28 p-3 text-sm leading-6 text-[#0A2318]/72 sm:col-span-2">
            {checkIn.redFlags
              ? "Provider referral is prioritized before movement."
              : "Spine-safe guidance: gentle range, no deep twisting, two walking breaks."}
          </div>
        </div>
      </div>
    </section>
  );
}

function TenaScorePanel({
  breakdown,
  score,
}: {
  breakdown: ReturnType<typeof getTenaScoreBreakdown>;
  score: number;
}) {
  const metrics = [
    { label: "Mind", value: breakdown.mind, icon: Brain },
    { label: "Body", value: breakdown.body, icon: Bone },
    { label: "Food", value: breakdown.food, icon: Utensils },
    { label: "Movement", value: breakdown.movement, icon: Footprints },
    { label: "Support", value: breakdown.support, icon: Users },
    { label: "Women's wellness", value: breakdown.women, icon: Baby },
  ];

  return (
    <section className="min-w-0 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
            <CheckCircle2 size={16} />
            TenaScore breakdown
          </div>
          <h3 className="mt-2 font-serif text-2xl text-[#0A2318]">Overall {score}</h3>
        </div>
        <span className="rounded-full bg-[#0A2318] px-3 py-2 text-sm font-semibold text-[#E8EDE7]">
          AI triage
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {metrics.map((metric) => (
          <ScoreMetric key={metric.label} {...metric} />
        ))}
      </div>
    </section>
  );
}

function EfoyResetPanel({
  played,
  onPlay,
}: {
  played: boolean;
  onPlay: () => void;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[#0A2318]/10 bg-[#0A2318] p-4 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#D4C1A0]">
          <Wind size={16} />
          Efoy reset
        </div>
        <span className="rounded-full bg-[#E8EDE7]/12 px-2.5 py-0.5 text-[10px] font-bold text-[#D4C1A0]">
          EN / AM
        </span>
      </div>
      <h3 className="mt-2 font-serif text-2xl leading-tight">
        Inhale. Relax.{" "}
        <span className="text-[#D4C1A0]">Efoy reset.</span>
      </h3>

      <div className="mt-4 grid min-h-40 place-items-center rounded-[1.25rem] border border-[#E8EDE7]/12 bg-[#153023] p-4">
        <div className="relative grid h-28 w-28 place-items-center">
          <span className="anim-breathe absolute inset-0 rounded-full bg-[#D4C1A0]/22" />
          <span className="anim-breathe absolute inset-6 rounded-full border border-[#D4C1A0]/40" />
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#D4C1A0] text-[#0A2318]">
            <span className="font-serif text-xl font-bold leading-none">ዕፎይ</span>
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm leading-6 text-[#E8EDE7]/70">
        <p><span className="font-bold text-[#D4C1A0]">Inhale</span> through the nose.</p>
        <p><span className="font-bold text-[#D4C1A0]">Soften</span> the shoulders.</p>
        <p><span className="font-bold text-[#D4C1A0]">Exhale</span> slowly - Efoy.</p>
      </div>

      <button
        type="button"
        onClick={onPlay}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#E8EDE7] px-4 text-sm font-semibold text-[#0A2318] transition hover:bg-[#D4C1A0]"
      >
        <Volume2 size={16} />
        {played ? "Reset completed" : "Play 3-minute reset"}
      </button>
    </section>
  );
}

function ProviderMatchPanel({
  matches,
  savedProviderMatches,
  bookedProviders,
  joinedCircles,
  onSaveProvider,
  onJoinCircle,
}: {
  matches: ReturnType<typeof getRootedProviderMatches>;
  savedProviderMatches: string[];
  bookedProviders: string[];
  joinedCircles: string[];
  onSaveProvider: (
    id: string,
    stamp: ReturnType<typeof getRootedProviderMatches>[number]["stamp"],
  ) => void;
  onJoinCircle: (id: string) => void;
}) {
  return (
    <section className="min-w-0 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
            <Store size={16} />
            Provider match
          </div>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-[#0A2318]">
            Digital self-care to real support.
          </h3>
        </div>
        <span className="rounded-full bg-[#D4C1A0]/45 px-3 py-2 text-sm font-semibold text-[#0A2318]">
          {matches.length} matches
        </span>
      </div>

      <div className="mt-4 grid gap-3">
        {matches.map((match) => {
          const isCircle = match.stamp === "Community";
          const saved = savedProviderMatches.includes(match.id);
          const booked = bookedProviders.includes(match.id);
          const joined = joinedCircles.includes(match.id);

          return (
            <article
              key={match.id}
              className="grid gap-3 rounded-[1.25rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-[#8C6246]">
                  {match.type} - {match.area}
                </p>
                <h4 className="mt-1 font-serif text-xl leading-tight text-[#0A2318] sm:text-2xl">
                  {match.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#0A2318]/64">{match.reason}</p>
              </div>
              {isCircle ? (
                joined ? (
                  <Link
                    href={`/circles?circle=${match.id}`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#0A2318] bg-[#E8EDE7] px-4 text-sm font-semibold text-[#0A2318] transition hover:bg-[#0A2318] hover:text-[#E8EDE7]"
                  >
                    <Users size={16} />
                    Open Circle
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => onJoinCircle(match.id)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
                  >
                    <Users size={16} />
                    Join circle
                  </button>
                )
              ) : saved || booked ? (
                <Link
                  href={`/market?provider=${match.id}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#8C6246] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38]"
                >
                  <Store size={16} />
                  {booked ? "Booked in Market" : "Book in Market"}
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onSaveProvider(match.id, match.stamp)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
                >
                  <CalendarCheck size={16} />
                  Save match
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ScoreMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Brain;
}) {
  const tone =
    value >= 75 ? "bg-[#0A2318]" : value >= 55 ? "bg-[#8C6246]" : "bg-[#724F38]";

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex min-w-0 items-center gap-2 font-medium text-[#0A2318]/82">
          <Icon size={15} className="shrink-0 text-[#8C6246]" />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 text-[#0A2318]/58">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#0A2318]/10">
        <div className={cn("h-full rounded-full transition-all duration-500", tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SignalRow({
  label,
  value,
  warn = false,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border p-3",
        warn ? "border-[#8C6246]/35 bg-[#D4C1A0]/35" : "border-[#0A2318]/10 bg-[#E5EAE3]",
      )}
    >
      <p className="text-[10px] font-bold uppercase text-[#0A2318]/42">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#0A2318]">{value}</p>
    </div>
  );
}

function MapDot({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "absolute z-10 h-5 w-5 rounded-full border-4 border-[#E8EDE7] bg-[#8C6246] shadow-lg shadow-[#0A2318]/20",
        className,
      )}
    />
  );
}
