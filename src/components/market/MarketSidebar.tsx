"use client";

import { useWellness } from "@/context/WellnessContext";
import { extendedProviders } from "@/lib/market-providers";
import { Provider } from "@/lib/types";
import { MarketCategory } from "@/hooks/useMarketFilter";
import { cn } from "@/lib/utils";

const CATEGORIES: { id: MarketCategory; label: string; emoji: string }[] = [
  { id: "All",      label: "All services", emoji: "✨" },
  { id: "Stress",   label: "Stress relief", emoji: "🧘" },
  { id: "Movement", label: "Movement",      emoji: "🏃" },
  { id: "Food",     label: "Nutrition",     emoji: "🥗" },
  { id: "Recovery", label: "Recovery",      emoji: "💆" },
];

type Props = {
  filter: MarketCategory;
  setFilter: (v: MarketCategory) => void;
  search: string;
  setSearch: (v: string) => void;
  recommendedCategory: Provider["category"];
};

export default function MarketSidebar({ filter, setFilter, search, setSearch, recommendedCategory }: Props) {
  const { score, scoreLabel, checkIn, stamps } = useWellness();

  const todayCount = extendedProviders.filter((p) => p.availableToday).length;

  // Personalised recommendation reason
  const reason =
    checkIn.stress >= 8 ? "Your stress is high — these services target nervous system reset." :
    checkIn.stress >= 6 ? "Your stress level suggests relaxation services would help most today." :
    checkIn.movement < 15 ? "Low movement today — movement services ranked first for you." :
    checkIn.sleep < 5 ? "Short sleep — recovery and relaxation services are prioritised." :
    "Balanced recommendation based on your current TenaScore.";

  return (
    <div className="grid content-start gap-5">

      {/* AI recommendation */}
      <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
        <p className="text-xs font-bold uppercase text-[#8C6246]">TenaMarket</p>
        <h2 className="font-serif text-2xl text-[#0A2318]">Wellness booking</h2>

        <div className="mt-4 rounded-2xl bg-[#0A2318] p-4 text-[#E8EDE7]">
          <p className="text-[10px] font-bold uppercase text-[#D4C1A0]/70">AI recommendation</p>
          <p className="mt-1 text-sm font-semibold capitalize text-[#D4C1A0]">
            Prioritise {recommendedCategory} services
          </p>
          <p className="mt-1.5 text-xs leading-5 text-[#E8EDE7]/65">{reason}</p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="rounded-full bg-[#E8EDE7]/10 px-2.5 py-1 font-semibold text-[#D4C1A0]">
              Score {score} · {scoreLabel}
            </span>
            <span className="text-[#E8EDE7]/45">{todayCount} available today</span>
          </div>
        </div>

        {/* Passport rewards */}
        {stamps.length >= 2 && (
          <div className="mt-3 rounded-2xl bg-[#8C6246]/12 px-4 py-3">
            <p className="text-xs font-bold text-[#8C6246]">
              🎉 Passport discount active — {stamps.length} stamps earned
            </p>
            <p className="mt-0.5 text-xs text-[#0A2318]/60">
              You qualify for 10–20% off on eligible services.
            </p>
          </div>
        )}
      </section>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-3.5 text-[#0A2318]/35 pointer-events-none text-sm">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or area…"
          className="h-12 w-full rounded-2xl border border-[#0A2318]/12 bg-[#E8EDE7] pl-10 pr-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
        />
      </div>

      {/* Category filters */}
      <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5">
        <p className="mb-3 text-xs font-bold uppercase text-[#0A2318]/40">Filter by type</p>
        <div className="grid gap-1.5">
          {CATEGORIES.map(({ id, label, emoji }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "flex h-10 items-center gap-2.5 rounded-2xl px-3.5 text-sm font-medium transition",
                filter === id
                  ? "bg-[#0A2318] text-[#E8EDE7]"
                  : "text-[#0A2318]/65 hover:bg-[#0A2318]/6",
              )}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span className="flex-1 text-left">{label}</span>
              {id !== "All" && (
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  filter === id ? "bg-[#E8EDE7]/15 text-[#D4C1A0]" : "bg-[#0A2318]/8 text-[#0A2318]/45",
                )}>
                  {extendedProviders.filter((p) => p.category === id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
