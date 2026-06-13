"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BadgePercent, PackageCheck, Sparkles } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { wellnessPackages as staticPackages, WellnessPackage } from "@/lib/market-providers";

type DbBundle = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  providerIds: string[];
  providerNames: string[];
  originalEtb: number;
  discountPct: number;
  finalEtb: number;
  bestFor: string;
};

function dbToPackage(bundle: DbBundle): WellnessPackage {
  return {
    id: bundle.id,
    title: bundle.title,
    subtitle: bundle.subtitle,
    emoji: bundle.emoji,
    providerIds: bundle.providerIds,
    providerNames: bundle.providerNames,
    originalEtb: bundle.originalEtb,
    discountPct: bundle.discountPct,
    finalEtb: bundle.finalEtb,
    bestFor: bundle.bestFor,
  };
}

export default function WellnessPackages() {
  const { award } = useWellness();
  const [booked, setBooked] = useState<string[]>([]);
  const [packages, setPackages] = useState<WellnessPackage[]>(staticPackages);

  useEffect(() => {
    fetch("/api/bundles", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { bundles?: DbBundle[] }) => {
        if (data.bundles?.length) setPackages(data.bundles.map(dbToPackage));
      })
      .catch(() => {});
  }, []);

  function book(id: string) {
    if (!booked.includes(id)) {
      setBooked((prev) => [...prev, id]);
      award("Experience", 45);
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-[#0A2318]/10 bg-white shadow-sm shadow-[#0A2318]/5">
      <div className="grid gap-4 bg-[#0A2318] p-5 text-[#E8EDE7] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#EFB84C]">
            <Sparkles size={14} />
            Wellness packages
          </div>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-white">Bundle a full reset day</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/68">
            Curated Addis combinations for burnout, movement, nutrition, and recovery. Each bundle still uses real providers.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-xs font-bold text-[#EFB84C]">
          <BadgePercent size={15} />
          Up to 22% off
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
        {packages.map((pkg, index) => {
          const isBooked = booked.includes(pkg.id);
          return (
            <article
              key={pkg.id}
              className={
                isBooked
                  ? "group flex min-h-[270px] flex-col rounded-lg border border-[#0A2318] bg-[#0A2318] p-4 text-[#E8EDE7]"
                  : "group flex min-h-[270px] flex-col rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-4 text-[#0A2318] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-[#0A2318]/8"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={
                    isBooked
                      ? "grid h-10 w-10 place-items-center rounded-lg bg-[#EFB84C] text-[#0A2318]"
                      : "grid h-10 w-10 place-items-center rounded-lg bg-[#FFF6DD] text-[#8C6246]"
                  }
                >
                  <PackageCheck size={20} />
                </span>
                <span className={isBooked ? "font-mono text-xs font-bold text-white/32" : "font-mono text-xs font-bold text-[#0A2318]/30"}>
                  0{index + 1}
                </span>
              </div>

              <p className={isBooked ? "mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#EFB84C]" : "mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246]"}>
                {pkg.subtitle}
              </p>
              <h3 className="mt-2 font-serif text-2xl leading-tight">{pkg.title}</h3>
              <p className={isBooked ? "mt-3 text-xs leading-5 text-white/62" : "mt-3 text-xs leading-5 text-[#0A2318]/58"}>
                Best for: {pkg.bestFor}
              </p>

              <div className="mt-auto pt-5">
                <div className={isBooked ? "border-t border-white/12 pt-4" : "border-t border-[#0A2318]/10 pt-4"}>
                  <p className={isBooked ? "text-xs line-through text-white/35" : "text-xs line-through text-[#0A2318]/35"}>
                    {pkg.originalEtb.toLocaleString()} ETB
                  </p>
                  <p className={isBooked ? "font-serif text-3xl leading-none text-[#EFB84C]" : "font-serif text-3xl leading-none text-[#8C6246]"}>
                    {pkg.finalEtb.toLocaleString()}
                  </p>
                  <p className={isBooked ? "mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/42" : "mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A2318]/42"}>
                    ETB after {pkg.discountPct}% off
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {pkg.providerNames.map((name) => (
                    <span
                      key={name}
                      className={isBooked ? "rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[#EFB84C]" : "rounded-md bg-[#0A2318]/6 px-2 py-0.5 text-[10px] font-medium text-[#0A2318]/58"}
                    >
                      {name}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => book(pkg.id)}
                  className={
                    isBooked
                      ? "mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/14 text-xs font-semibold text-[#EFB84C]"
                      : "mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#8C6246] text-xs font-semibold text-white transition hover:bg-[#724F38] active:scale-[0.98]"
                  }
                >
                  {isBooked ? "Package booked +45 pts" : `Book bundle - save ${pkg.discountPct}%`}
                  <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
