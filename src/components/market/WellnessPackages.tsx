"use client";

import { useState } from "react";
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
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Wellness packages</p>
      <h2 className="font-serif text-2xl text-[#0A2318]">Bundle and save</h2>
      <p className="mt-1 text-xs text-[#0A2318]/50">Curated service bundles at a discount. Pay at each venue.</p>

      <div className="mt-4 grid gap-3">
        {wellnessPackages.map((pkg) => {
          const isBooked = booked.includes(pkg.id);
          return (
            <div
              key={pkg.id}
              className={cn(
                "rounded-2xl border p-4 transition",
                isBooked ? "border-[#0A2318] bg-[#0A2318]" : "border-[#0A2318]/10 bg-[#E5EAE3]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl leading-none">{pkg.emoji}</span>
                  <div>
                    <p className={cn("font-semibold", isBooked ? "text-[#E8EDE7]" : "text-[#0A2318]")}>
                      {pkg.title}
                    </p>
                    <p className={cn("text-xs", isBooked ? "text-[#D4C1A0]/70" : "text-[#0A2318]/50")}>
                      {pkg.subtitle}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className={cn("text-xs line-through", isBooked ? "text-[#E8EDE7]/35" : "text-[#0A2318]/35")}>
                    {pkg.originalEtb.toLocaleString()} ETB
                  </p>
                  <p className={cn("font-bold", isBooked ? "text-[#D4C1A0]" : "text-[#8C6246]")}>
                    {pkg.finalEtb.toLocaleString()} ETB
                  </p>
                  <p className={cn("text-[10px] font-bold", isBooked ? "text-[#D4C1A0]/60" : "text-[#8C6246]/70")}>
                    -{pkg.discountPct}% off
                  </p>
                </div>
              </div>

              <p className={cn("mt-2 text-xs", isBooked ? "text-[#E8EDE7]/55" : "text-[#0A2318]/45")}>
                Best for: {pkg.bestFor}
              </p>

              {/* Provider list */}
              <div className="mt-2 flex flex-wrap gap-1">
                {pkg.providerNames.map((name) => (
                  <span key={name} className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    isBooked ? "bg-[#E8EDE7]/10 text-[#D4C1A0]" : "bg-[#0A2318]/8 text-[#0A2318]/60",
                  )}>
                    {name}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => book(pkg.id)}
                className={cn(
                  "mt-3 h-9 w-full rounded-full text-xs font-semibold transition",
                  isBooked
                    ? "border border-[#E8EDE7]/20 bg-transparent text-[#D4C1A0]"
                    : "bg-[#8C6246] text-[#E8EDE7] hover:bg-[#724F38]",
                )}
              >
                {isBooked ? "Package booked ✓ +45 pts" : `Book bundle · save ${pkg.discountPct}%`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
