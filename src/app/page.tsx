"use client";

import Image from "next/image";
import Link from "next/link";
import { useWellness } from "@/context/WellnessContext";
import ScoreRing from "@/components/ui/ScoreRing";
import MetricBar from "@/components/ui/MetricBar";
import MiniStat from "@/components/ui/MiniStat";
import { clamp } from "@/lib/utils";
import { getFoodSignal } from "@/lib/foods";

const MODULES = [
  { href: "/loop", label: "Daily Loop", description: "Check in and get your personalized wellness plan.", color: "#0f6b52" },
  { href: "/coach", label: "TenaBot", description: "AI wellness companion for stress, habits, and reflection.", color: "#1d84a6" },
  { href: "/food", label: "TenaPlate", description: "Ethiopian food tracker with fasting and BP guidance.", color: "#d86f45" },
  { href: "/move", label: "TenaMove", description: "Breathing resets, workouts, and walking challenges.", color: "#1d84a6" },
  { href: "/circles", label: "TenaCircle", description: "Moderated peer support circles for students and workers.", color: "#7c4f9e" },
  { href: "/market", label: "TenaMarket", description: "Book spas, yoga, gyms, nutritionists, and retreats.", color: "#b04a2a" },
  { href: "/dashboard", label: "Dashboard", description: "Wellness passport, rewards, and business metrics.", color: "#2e7d6b" },
] as const;

export default function HomePage() {
  const { score, scoreColor, scoreLabel, plan, checkIn, points, stamps, bookedProviders } = useWellness();

  return (
    <div className="grid gap-5">
      {/* Hero row */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Score card */}
          <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
            <p className="text-sm font-medium uppercase text-[#64756b]">Today</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#102018]">
              One daily loop for mind, food, movement, and support.
            </h1>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniStat label="TenaScore" value={`${score}/100`} tone={scoreColor} />
              <MiniStat label="Points" value={`${points}`} tone="#d86f45" />
              <MiniStat label="Bookings" value={`${bookedProviders.length}`} tone="#1d84a6" />
            </div>
            <Link
              href="/loop"
              className="mt-5 flex h-11 w-full items-center justify-center rounded-md bg-[#d86f45] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#c55f38]"
            >
              Run today&apos;s wellness loop
            </Link>
          </section>

          {/* Hero image */}
          <section className="relative min-h-[280px] overflow-hidden rounded-md border border-[#d8e4dc] bg-[#dcebe4] shadow-sm">
            <Image
              src="/tenaloop-hero.png"
              alt="TenaLoop wellness app in Addis Ababa"
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#102018]/80 to-transparent p-4 text-white">
              <p className="max-w-md text-sm">
                Local wellness, Ethiopian food guidance, peer support, and bookings in one daily passport.
              </p>
            </div>
          </section>
        </div>

        {/* Live score */}
        <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase text-[#64756b]">Live engine</p>
              <h2 className="text-2xl font-semibold">TenaScore</h2>
            </div>
            <ScoreRing score={score} color={scoreColor} />
          </div>
          <div className="mt-5 grid gap-3">
            <MetricBar label="Stress load" value={100 - checkIn.stress * 10} />
            <MetricBar label="Sleep recovery" value={clamp((checkIn.sleep / 8) * 100)} />
            <MetricBar label="Movement" value={clamp((checkIn.movement / 30) * 100)} />
            <MetricBar label="Food balance" value={getFoodSignal(checkIn.meal).score} />
          </div>
          <div className="mt-5 rounded-md bg-[#eef6f2] p-3 text-sm text-[#284237]">
            Status: <span className="font-semibold">{scoreLabel}</span>.{" "}
            {plan[0] ? `Next: ${plan[0].detail}` : "Complete your check-in to get a plan."}
          </div>
          <div className="mt-3 text-sm text-[#64756b]">
            Stamps earned: {stamps.length}/6
          </div>
        </section>
      </div>

      {/* Module cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ href, label, description, color }) => (
          <Link
            key={href}
            href={href}
            className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm transition hover:border-[#0f6b52] hover:shadow-md"
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-md text-sm font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {label.slice(0, 2)}
            </div>
            <h3 className="font-semibold text-[#14231d]">{label}</h3>
            <p className="mt-1 text-sm leading-6 text-[#52665c]">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
