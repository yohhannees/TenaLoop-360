"use client";

import { useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { useMarketFilter, SortMode } from "@/hooks/useMarketFilter";
import ProviderCard from "@/components/market/ProviderCard";
import MarketSidebar from "@/components/market/MarketSidebar";
import WellnessPackages from "@/components/market/WellnessPackages";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "recommended", label: "Best match" },
  { id: "available",   label: "Available today" },
  { id: "rating",      label: "Top rated" },
  { id: "price-asc",   label: "Price: low first" },
];

export default function MarketPage() {
  const { checkIn, bookedProviders, bookProvider, stamps } = useWellness();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const recommendedCategory =
    checkIn.stress >= 7 ? "Stress" :
    checkIn.movement < 20 ? "Movement" :
    checkIn.bpFocus || checkIn.glucoseFocus ? "Food" : "Recovery";

  const { filter, setFilter, search, setSearch, sort, setSort, filtered } =
    useMarketFilter(recommendedCategory);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">

      {/* ── LEFT: Sidebar ─────────────────────────────────── */}
      <MarketSidebar
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        recommendedCategory={recommendedCategory}
      />

      {/* ── RIGHT: Results + Packages ─────────────────────── */}
      <div className="grid content-start gap-5">

        {/* Sort + results count bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#0A2318]/55">
            <span className="font-semibold text-[#0A2318]">{filtered.length}</span>
            {" "}service{filtered.length !== 1 ? "s" : ""} found
            {search && <span> for &quot;<span className="font-medium">{search}</span>&quot;</span>}
          </p>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {SORT_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSort(id)}
                className={cn(
                  "h-8 shrink-0 rounded-full px-3.5 text-xs font-semibold transition",
                  sort === id
                    ? "bg-[#0A2318] text-[#E8EDE7]"
                    : "bg-[#0A2318]/8 text-[#0A2318]/60 hover:bg-[#0A2318]/14",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Provider grid */}
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-8 text-center">
            <p className="text-2xl">🔍</p>
            <p className="mt-2 font-serif text-xl text-[#0A2318]">No results</p>
            <p className="mt-1 text-sm text-[#0A2318]/55">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                booked={bookedProviders.includes(provider.id)}
                recommended={provider.category === recommendedCategory}
                passportStamps={stamps.length}
                expanded={expandedId === provider.id}
                onExpand={() => toggleExpand(provider.id)}
                onBook={() => { bookProvider(provider.id); setExpandedId(null); }}
              />
            ))}
          </div>
        )}

        {/* Wellness packages */}
        <WellnessPackages />

      </div>
    </div>
  );
}
