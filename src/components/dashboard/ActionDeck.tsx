"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarCheck,
  Dumbbell,
  Utensils,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { CheckIn, Stamp } from "@/lib/types";
import { cn } from "@/lib/utils";

const deckCards = [
  {
    href: "/coach",
    icon: Brain,
    label: "Mind signal",
    title: "Reset before the next task",
    body: "",
    src: "/tenaloop-photo-mind.jpg",
    position: "50% 48%",
    tone: "bg-[#E8EDE7] text-[#0A2318]",
    transform: "top-0 left-1/2 -translate-x-1/2 -rotate-6 md:left-[56%]",
  },
  {
    href: "/food",
    icon: Utensils,
    label: "Plate signal",
    title: "Choose the next better meal",
    body: "",
    src: "/tenaloop-photo-food-plate.jpg",
    position: "50% 52%",
    tone: "bg-[#D4C1A0] text-[#0A2318]",
    transform: "top-[130px] left-1/2 -translate-x-1/2 rotate-[3deg] md:left-[42%]",
  },
  {
    href: "/market",
    icon: CalendarCheck,
    label: "Care signal",
    title: "Book the right local support",
    body: "",
    src: "/tenaloop-photo-market.jpg",
    position: "50% 54%",
    tone: "bg-[#0A2318] text-[#E8EDE7]",
    transform: "top-[260px] left-1/2 -translate-x-1/2 -rotate-2 md:left-[52%]",
  },
];

export default function ActionDeck() {
  const { checkIn, plan, score, scoreLabel, foodSignal, stamps } = useWellness();
  const quickPlan = plan.slice(0, 3);
  const cardBodies = getActionCardBodies({
    checkIn,
    score,
    scoreLabel,
    foodRisk: foodSignal.risk,
    foodSwap: foodSignal.swap,
    stamps,
  });

  return (
    <section className="grid min-w-0 gap-8 overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5 lg:grid-cols-[0.82fr_1.18fr] lg:p-8">
      <div className="flex min-w-0 flex-col justify-center gap-6">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">Command library</p>
          <h2 className="mt-2 font-serif text-4xl leading-tight text-[#0A2318]">
            Today&apos;s action stack
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[#0A2318]/64">
            Today&apos;s cards are built from your latest check-in, food signal,
            stamps, and score history.
          </p>
        </div>

        <div className="grid gap-2 border-y border-[#0A2318]/10 py-3">
          {quickPlan.map((item, index) => (
            <div
              key={item.title}
              className="group grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#0A2318] text-xs font-bold text-[#D4C1A0]">
                0{index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#0A2318]">{item.title}</p>
                <p className="truncate text-xs text-[#0A2318]/52">{item.detail}</p>
              </div>
              <ArrowRight
                size={16}
                className="text-[#0A2318]/35 transition group-hover:translate-x-1 group-hover:text-[#8C6246]"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Signal label="Score" value={`${score}`} />
          <Signal label="Zone" value={scoreLabel} />
          <Signal label="Food" value={foodSignal.risk} />
        </div>

        <Link
          href="/loop"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#0A2318] px-5 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
        >
          Open daily loop <Dumbbell size={16} />
        </Link>
      </div>

      <div className="relative mx-auto h-[680px] w-full max-w-[34rem] overflow-hidden">
        {deckCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={cn(
                "group absolute w-[min(19rem,calc(100vw-4rem))] overflow-hidden rounded-[1.5rem] border border-[#0A2318]/10 p-3 shadow-2xl shadow-[#0A2318]/14 transition duration-500 hover:z-30 hover:scale-[1.02] sm:w-80",
                card.tone,
                card.transform,
              )}
              style={{ zIndex: index + 1 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] bg-[#0A2318]">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  sizes="320px"
                  className="object-cover saturate-[0.92] transition duration-700 group-hover:scale-105"
                  style={{ objectPosition: card.position }}
                />
                <div className="absolute inset-0 bg-[#0A2318]/16" />
                <span className="absolute right-3 top-3 rounded-full bg-[#E8EDE7] px-2.5 py-1 text-[10px] font-bold text-[#0A2318]">
                  0{index + 1}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-70">
                  <Icon size={15} />
                  {card.label}
                </div>
                <h3 className="font-serif text-2xl leading-tight">{card.title}</h3>
                <p className="text-sm leading-6 opacity-72">{cardBodies[index]}</p>
                <div className="flex items-center justify-between border-t border-current/12 pt-3 text-xs font-semibold uppercase">
                  <span>Open module</span>
                  <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getActionCardBodies({
  checkIn,
  score,
  scoreLabel,
  foodRisk,
  foodSwap,
  stamps,
}: {
  checkIn: CheckIn;
  score: number;
  scoreLabel: string;
  foodRisk: string;
  foodSwap: string;
  stamps: Stamp[];
}) {
  const mind =
    checkIn.stress >= 7
      ? `Stress is ${checkIn.stress}/10. Start with a 3-minute Efoy reset, then protect one quiet block.`
      : checkIn.sleep < 6
        ? `Sleep is ${checkIn.sleep} hours. Keep the next action gentle and protect tonight's wind-down.`
        : `${scoreLabel} zone at ${score}. Maintain the habit that kept stress and support steady.`;

  const food =
    foodRisk === "High"
      ? `Food risk is high from the latest meal. Next swap: ${foodSwap}`
      : checkIn.bpFocus || checkIn.glucoseFocus
        ? `BP/glucose focus is on. Keep injera moderate, reduce sweet coffee, and log the next plate.`
        : `Food signal is ${foodRisk.toLowerCase()}. Repeat the balanced plate and add water before the next meal.`;

  const care =
    checkIn.redFlags
      ? "Warning signs selected. Skip self-treatment and route to licensed care before intense activity."
      : checkIn.painAreas.length > 0
        ? `${checkIn.painAreas.join(", ")} need attention. Pick gentle movement or a provider match before pushing harder.`
        : !stamps.includes("Experience")
          ? "You have not closed the Experience stamp yet. Save one matched Ethiopian provider from the market."
          : "Experience stamp is active. Use the market only if today's score or body signal needs extra support.";

  return [mind, food, care];
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[#D4C1A0]/35 px-3 py-2">
      <p className="text-[10px] font-bold uppercase text-[#0A2318]/45">{label}</p>
      <p className="truncate text-sm font-semibold text-[#0A2318]">{value}</p>
    </div>
  );
}
