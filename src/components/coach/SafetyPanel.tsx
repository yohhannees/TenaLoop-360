"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { circles } from "@/lib/circles";
import { providers } from "@/lib/providers";
import { cn } from "@/lib/utils";

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
    score,
  });
  const joined = joinedCircles.includes(circle.id);
  const booked = bookedProviders.includes(provider.id);
  const supportLevel = score < 55 || checkIn.stress >= 8 ? "High attention" : score < 70 ? "Watch" : "Steady";

  return (
    <aside className="grid min-w-0 content-start gap-5">
      <section className="min-w-0 overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-[#8C6246]">Support layer</p>
            <h2 className="mt-1 font-serif text-3xl text-[#0A2318]">Care routing</h2>
            <p className="mt-2 text-sm leading-6 text-[#0A2318]/62">
              TenaBot keeps self-care, community, and local services in one path.
            </p>
          </div>
          <div
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-full",
              supportLevel === "High attention" ? "bg-[#8C6246] text-[#E8EDE7]" : "bg-[#D4C1A0]/45 text-[#0A2318]",
            )}
          >
            <ShieldCheck size={22} />
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {plan.slice(0, 3).map((item, index) => (
            <div
              key={item.title}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-[1.25rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0A2318] text-xs font-bold text-[#E8EDE7]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[#0A2318]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#0A2318]/64">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#0A2318] p-4 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4C1A0] text-[#0A2318]">
            <Users size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-[#D4C1A0]">Recommended circle</p>
            <h3 className="mt-1 font-serif text-2xl">{circle.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#E8EDE7]/68">{circle.focus}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-[#E8EDE7]/10 bg-[#153023] p-3 text-sm leading-6 text-[#E8EDE7]/72">
          {circle.time} · {circle.members} members
          <br />
          Challenge: {circle.challenge}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => joinCircle(circle.id)}
            className="h-10 rounded-full bg-[#E8EDE7] px-4 text-sm font-semibold text-[#0A2318] transition hover:bg-[#D4C1A0]"
          >
            {joined ? "Circle joined" : "Join circle"}
          </button>
          <Link
            href="/circles"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#E8EDE7]/18 px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#E8EDE7]/10"
          >
            View circles
          </Link>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4C1A0]/45 text-[#0A2318]">
            <Store size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-[#8C6246]">Local support match</p>
            <h3 className="mt-1 font-serif text-2xl text-[#0A2318]">{provider.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#0A2318]/64">
              {provider.type} · {provider.area} · {provider.price}
            </p>
          </div>
        </div>

        <p className="mt-3 rounded-[1.25rem] bg-[#D4C1A0]/30 p-3 text-sm leading-6 text-[#0A2318]/72">
          Best for: {provider.bestFor}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => bookProvider(provider.id)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
          >
            <CalendarCheck size={16} />
            {booked ? "Saved" : "Save match"}
          </button>
          <Link
            href="/market"
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#0A2318]/12 px-4 text-sm font-semibold text-[#0A2318]/72 transition hover:border-[#0A2318]/35 hover:text-[#0A2318]"
          >
            Marketplace
          </Link>
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-[2rem] border border-[#8C6246]/18 bg-[#D4C1A0]/30 p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
        <div className="flex items-start gap-3">
          <HeartPulse size={20} className="mt-0.5 shrink-0 text-[#8C6246]" />
          <div>
            <p className="text-xs font-bold uppercase text-[#8C6246]">Safety note</p>
            <p className="mt-2 text-sm leading-6 text-[#0A2318]/72">
              TenaBot is wellness coaching, not a diagnosis or emergency service. If someone may be in immediate danger, contact local emergency support or a trusted person right now.
            </p>
          </div>
        </div>

        {supportLevel === "High attention" && (
          <div className="mt-3 flex gap-2 rounded-[1.25rem] border border-[#8C6246]/25 bg-[#E8EDE7]/60 p-3 text-sm leading-6 text-[#0A2318]/76">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#8C6246]" />
            <span>High stress pattern detected. Add human support today and keep the next step small.</span>
          </div>
        )}
      </section>
    </aside>
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
  support: string;
  bpFocus: boolean;
  glucoseFocus: boolean;
  movement: number;
}) {
  const id =
    glucoseFocus ? "diabetes-prevention" :
    bpFocus ? "bp-lifestyle" :
    movement < 20 ? "walking-group" :
    support === "Low" || stress >= 7 ? "young-pros" :
    "fitness-beginners";

  return circles.find((circle) => circle.id === id) ?? circles[0];
}

function getRecommendedProvider({
  stress,
  movement,
  foodRisk,
  score,
}: {
  stress: number;
  movement: number;
  foodRisk: string;
  score: number;
}) {
  const category =
    stress >= 7 ? "Stress" :
    foodRisk === "High" ? "Food" :
    movement < 20 ? "Movement" :
    score < 65 ? "Recovery" :
    "Movement";

  return providers.find((provider) => provider.category === category) ?? providers[0];
}
