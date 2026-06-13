"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { circles } from "@/lib/circles";
import { providers } from "@/lib/providers";
import type { FoodSignal, Support } from "@/lib/types";

function statusTone(score: number, stress: number) {
  if (score < 55 || stress >= 8) return { label: "High attention", text: "#B23A24", bg: "#FCECE7", border: "#D65A3140" };
  if (score < 70) return { label: "Watch", text: "#8C6246", bg: "#FFF6DD", border: "#EFB84C55" };
  return { label: "Steady", text: "#276442", bg: "#EAF4EE", border: "#4C956C44" };
}

export default function SafetyPanel() {
  const {
    checkIn,
    score,
    plan,
    foodSignal,
    joinedCircles,
    joinCircle,
    bookedProviders,
    bookProvider,
  } = useWellness();

  const circle = getRecommendedCircle({
    stress: checkIn.stress,
    support: checkIn.support,
    bpFocus: checkIn.bpFocus,
    glucoseFocus: checkIn.glucoseFocus,
    movement: checkIn.movement,
  });

  const provider = getRecommendedProvider({
    stress: checkIn.stress,
    movement: checkIn.movement,
    foodRisk: foodSignal.risk,
    painAreas: checkIn.painAreas.length,
    redFlags: checkIn.redFlags,
    womenWellness: checkIn.womenWellness,
  });

  const tone = statusTone(score, checkIn.stress);
  const resetPlan = plan.slice(0, 3);
  const joined = joinedCircles.includes(circle.id);
  const booked = bookedProviders.includes(provider.id);
  const highAttention = score < 55 || checkIn.stress >= 8;

  return (
    <aside className="grid content-start gap-4">
      <section className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Care path</p>
            <h2 className="mt-1 font-serif text-2xl leading-tight text-[#0A2318]">Reset plan</h2>
          </div>
          <span
            className="rounded-lg border px-3 py-1.5 text-xs font-bold"
            style={{ color: tone.text, backgroundColor: tone.bg, borderColor: tone.border }}
          >
            {tone.label}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          {resetPlan.map((item, index) => (
            <div key={item.title} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0A2318] text-xs font-bold text-[#EFB84C]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0A2318]">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-[#0A2318]/62">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[#0A2318]/10 bg-[#0A2318] p-5 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#EFB84C]">
            <Users size={16} />
            <p className="text-xs font-bold uppercase tracking-[0.16em]">Suggested circle</p>
          </div>
          <Link href="/circles" aria-label="Open circles" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/62 transition hover:text-white">
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <h3 className="mt-4 font-serif text-2xl leading-tight text-white">{circle.name}</h3>
        <p className="mt-2 text-sm leading-6 text-[#E8EDE7]/72">{circle.focus}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <MiniDetail icon={Clock} label="When" value={circle.time} dark />
          <MiniDetail icon={Users} label="Members" value={`${circle.members} people`} dark />
        </div>

        <button
          type="button"
          onClick={() => joinCircle(circle.id)}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#E8EDE7] text-xs font-bold uppercase tracking-[0.14em] text-[#0A2318] transition hover:bg-white active:scale-[0.98]"
        >
          {joined ? "Member" : "Join circle"}
        </button>
      </section>

      <section className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Local specialist</p>
            <h3 className="mt-1 font-serif text-2xl leading-tight text-[#0A2318]">{provider.name}</h3>
          </div>
          <Link href="/market" aria-label="Open market" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/66 transition hover:text-[#0A2318]">
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-2.5 py-1.5 text-xs font-semibold text-[#0A2318]/66">
            <MapPin size={12} />
            {provider.area}
          </span>
          <span className="rounded-lg border border-[#EFB84C]/28 bg-[#FFF6DD] px-2.5 py-1.5 text-xs font-semibold text-[#8C6246]">
            {provider.price}
          </span>
        </div>

        <div className="mt-4 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">Why this match</p>
          <p className="mt-1 text-sm leading-6 text-[#0A2318]/68">Ideal for {provider.bestFor.toLowerCase()}.</p>
        </div>

        <button
          type="button"
          onClick={() => bookProvider(provider.id)}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0A2318] text-xs font-bold uppercase tracking-[0.14em] text-[#E8EDE7] transition hover:bg-[#173829] active:scale-[0.98]"
        >
          <CalendarCheck size={15} className="text-[#EFB84C]" />
          {booked ? "Saved" : "Save match"}
        </button>
      </section>

      <section
        className="rounded-lg border p-4 shadow-sm shadow-[#0A2318]/5"
        style={{ color: tone.text, backgroundColor: tone.bg, borderColor: tone.border }}
      >
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/70">
            {highAttention ? <AlertTriangle size={17} /> : <ShieldCheck size={17} />}
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.14em]">Safety guidance</h4>
            <p className="mt-1 text-sm leading-6 text-[#0A2318]/68">
              TenaBot is a reset guide, not emergency care. If you are in immediate danger, reach a trusted professional.
            </p>
            {highAttention ? (
              <p className="mt-2 text-xs font-semibold leading-5">High stress pattern detected. Prioritize human connection today.</p>
            ) : null}
          </div>
        </div>
      </section>
    </aside>
  );
}

function MiniDetail({
  icon: Icon,
  label,
  value,
  dark = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "rounded-lg bg-white/8 px-3 py-2" : "rounded-lg bg-[#F7F9F5] px-3 py-2"}>
      <div className={dark ? "flex items-center gap-1.5 text-[#EFB84C]" : "flex items-center gap-1.5 text-[#8C6246]"}>
        <Icon size={12} />
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className={dark ? "mt-1 text-xs font-semibold text-white" : "mt-1 text-xs font-semibold text-[#0A2318]"}>
        {value}
      </p>
    </div>
  );
}

function getRecommendedCircle({
  stress,
  support,
  bpFocus,
  glucoseFocus,
  movement,
}: {
  stress: number;
  support: Support;
  bpFocus: boolean;
  glucoseFocus: boolean;
  movement: number;
}) {
  const id = glucoseFocus
    ? "diabetes-prevention"
    : bpFocus
      ? "bp-lifestyle"
      : movement < 20
        ? "walking-group"
        : support === "Low" || stress >= 7
          ? "young-pros"
          : "fitness-beginners";
  return circles.find((c) => c.id === id) ?? circles[0];
}

function getRecommendedProvider({
  stress,
  movement,
  foodRisk,
  painAreas,
  redFlags,
  womenWellness,
}: {
  stress: number;
  movement: number;
  foodRisk: FoodSignal["risk"];
  painAreas: number;
  redFlags: boolean;
  womenWellness: boolean;
}) {
  if (redFlags || womenWellness) return providers.find((p) => p.id === "american-medical-center-checkup") ?? providers[0];
  if (painAreas > 0) return providers.find((p) => p.id === "signature-wellness-bole") ?? providers[0];
  const category = stress >= 7 ? "Stress" : foodRisk === "High" ? "Food" : movement < 20 ? "Movement" : "Recovery";
  return providers.find((p) => p.category === category) ?? providers[0];
}
