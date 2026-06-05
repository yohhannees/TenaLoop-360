"use client";

import { useState } from "react";
import { ArrowRight, BadgePercent, PackageCheck, Sparkles } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { wellnessPackages } from "@/lib/market-providers";
import { cn } from "@/lib/utils";

export default function WellnessPackages() {
  const { award } = useWellness();
  const [booked, setBooked] = useState<string[]>([]);

  function book(id: string) {
    if (!booked.includes(id)) {
      setBooked((prev) => [...prev, id]);
      award("Experience", 45);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
      <div className="grid gap-4 bg-[#0A2318] p-5 text-[#E8EDE7] md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#D4C1A0]">
            <Sparkles size={15} />
            Wellness packages
          </div>
          <h2 className="mt-2 font-serif text-3xl leading-tight">Bundle and save</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#E8EDE7]/66">
            Curated combinations for burnout, movement, nutrition, and full-day reset.
            Pay at each venue.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E8EDE7]/14 px-3 py-2 text-xs font-semibold text-[#D4C1A0]">
          <BadgePercent size={15} />
          Up to 22% off
        </div>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
        {wellnessPackages.map((pkg, index) => {
          const isBooked = booked.includes(pkg.id);
          return (
            <article
              key={pkg.id}
              className={cn(
                "group relative min-h-72 overflow-hidden rounded-[1.5rem] border p-4 transition duration-500 hover:-translate-y-1",
                isBooked
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                  : "border-[#0A2318]/10 bg-[#E5EAE3] text-[#0A2318]",
              )}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border border-current/10" />

              <div className="relative flex items-start justify-between gap-3">
                <div className={cn(
                  "grid h-11 w-11 place-items-center rounded-2xl",
                  isBooked ? "bg-[#D4C1A0] text-[#0A2318]" : "bg-[#D4C1A0]/45 text-[#0A2318]",
                )}>
                  <PackageCheck size={21} />
                </div>
                <span className="font-mono text-xs font-bold opacity-40">0{index + 1}</span>
              </div>

              <div className="relative mt-5">
                <p className={cn("text-xs font-bold uppercase", isBooked ? "text-[#D4C1A0]" : "text-[#8C6246]")}>
                  {pkg.subtitle}
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-tight">{pkg.title}</h3>
                <p className={cn("mt-3 text-xs leading-5", isBooked ? "text-[#E8EDE7]/62" : "text-[#0A2318]/55")}>
                  Best for: {pkg.bestFor}
                </p>
              </div>

              <div className="relative mt-5 flex items-end justify-between gap-3 border-t border-current/12 pt-4">
                <div>
                  <p className="text-xs line-through opacity-38">
                    {pkg.originalEtb.toLocaleString()} ETB
                  </p>
                  <p className={cn("font-serif text-3xl leading-none", isBooked ? "text-[#D4C1A0]" : "text-[#8C6246]")}>
                    {pkg.finalEtb.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase opacity-60">
                    ETB after {pkg.discountPct}% off
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex flex-wrap gap-1">
                {pkg.providerNames.map((name) => (
                  <span
                    key={name}
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      isBooked ? "bg-[#E8EDE7]/10 text-[#D4C1A0]" : "bg-[#0A2318]/8 text-[#0A2318]/60",
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => book(pkg.id)}
                className={cn(
                  "relative mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-xs font-semibold transition active:scale-[0.98]",
                  isBooked
                    ? "border border-[#E8EDE7]/20 bg-transparent text-[#D4C1A0]"
                    : "bg-[#8C6246] text-[#E8EDE7] hover:bg-[#724F38]",
                )}
              >
                {isBooked ? "Package booked +45 pts" : `Book bundle - save ${pkg.discountPct}%`}
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
