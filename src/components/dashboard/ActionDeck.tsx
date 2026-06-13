"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CalendarCheck,
  Dumbbell,
  ListChecks,
  Utensils,
  type LucideIcon,
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
    tone: "border-[#4C956C]/24 bg-[#F8FBF7]",
  },
  {
    href: "/food",
    icon: Utensils,
    label: "Plate signal",
    title: "Choose the next better meal",
    body: "",
    src: "/tenaloop-photo-food-plate.jpg",
    position: "50% 52%",
    tone: "border-[#EFB84C]/32 bg-[#FFFCF3]",
  },
  {
    href: "/market",
    icon: CalendarCheck,
    label: "Care signal",
    title: "Book the right local support",
    body: "",
    src: "/tenaloop-photo-market.jpg",
    position: "50% 54%",
    tone: "border-[#2C7DA0]/24 bg-[#F4FAFC]",
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
    <section className="grid min-w-0 gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Action stack</p>
          <h2 className="mt-1 font-serif text-3xl text-[#0A2318]">Today&apos;s recommended moves</h2>
        </div>
        <Link
          href="/loop"
          className="inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#0A2318] px-4 text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#173829]"
        >
          Open daily loop <Dumbbell size={16} />
        </Link>
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)]">
        <article className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#EAF4EE] text-[#276442]">
              <ListChecks size={18} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8C6246]">3-step plan</p>
              <h3 className="font-serif text-xl text-[#0A2318]">Generated from check-in</h3>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {quickPlan.length > 0 ? (
              quickPlan.map((item, index) => (
                <div
                  key={item.title}
                  className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 border-b border-[#0A2318]/8 pb-3 last:border-0 last:pb-0"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0A2318] text-xs font-bold text-[#EFB84C]">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0A2318]">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#0A2318]/58">{item.detail}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-4 text-sm text-[#0A2318]/62">
                Save today&apos;s check-in to generate a plan.
              </div>
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Signal label="Score" value={`${score}`} />
            <Signal label="Zone" value={scoreLabel} />
            <Signal label="Food" value={foodSignal.risk} />
          </div>
        </article>

        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          {deckCards.map((card, index) => (
            <ActionCard
              key={card.title}
              {...card}
              body={cardBodies[index]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionCard({
  href,
  icon: Icon,
  label,
  title,
  body,
  src,
  position,
  tone,
  index,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
  src: string;
  position: string;
  tone: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group grid min-h-[330px] overflow-hidden rounded-lg border shadow-sm shadow-[#0A2318]/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0A2318]/10",
        tone,
      )}
    >
      <div className="relative aspect-[4/3] min-h-36 overflow-hidden bg-[#0A2318]">
        <Image
          src={src}
          alt={title}
          fill
          sizes="(min-width: 1024px) 260px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          style={{ objectPosition: position }}
        />
        <div className="absolute inset-0 bg-[#0A2318]/14" />
        <span className="absolute right-3 top-3 rounded-md bg-white/92 px-2 py-1 text-[10px] font-bold text-[#0A2318]">
          0{index + 1}
        </span>
      </div>

      <div className="grid gap-3 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8C6246]">
          <Icon size={15} />
          {label}
        </div>
        <h3 className="font-serif text-xl leading-tight text-[#0A2318]">{title}</h3>
        <p className="line-clamp-4 text-sm leading-6 text-[#0A2318]/66">{body}</p>
        <div className="mt-auto flex items-center justify-between border-t border-[#0A2318]/10 pt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0A2318]/62">
          <span>Open</span>
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
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
        ? "BP/glucose focus is on. Keep injera moderate, reduce sweet coffee, and log the next plate."
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
    <div className="min-w-0 rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A2318]/45">{label}</p>
      <p className="truncate text-sm font-semibold text-[#0A2318]">{value}</p>
    </div>
  );
}
