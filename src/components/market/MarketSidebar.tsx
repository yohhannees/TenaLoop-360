"use client";

import { Brain, Dumbbell, HeartPulse, Search, Sparkles, Utensils } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { ExtendedProvider } from "@/lib/market-providers";
import { Provider } from "@/lib/types";
import { MarketCategory } from "@/hooks/useMarketFilter";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "All", label: "All services", Icon: Sparkles, tone: "text-[#8C6246]" },
  { id: "Stress", label: "Stress relief", Icon: Brain, tone: "text-[#2C7DA0]" },
  { id: "Movement", label: "Movement", Icon: Dumbbell, tone: "text-[#276442]" },
  { id: "Food", label: "Nutrition", Icon: Utensils, tone: "text-[#D58A25]" },
  { id: "Recovery", label: "Recovery", Icon: HeartPulse, tone: "text-[#B23A24]" },
] as const;

type Props = {
  filter: MarketCategory;
  setFilter: (value: MarketCategory) => void;
  search: string;
  setSearch: (value: string) => void;
  recommendedCategory: Provider["category"];
  providers: ExtendedProvider[];
};

export default function MarketSidebar({
  filter,
  setFilter,
  search,
  setSearch,
  recommendedCategory,
  providers,
}: Props) {
  const { score, scoreLabel, checkIn, stamps } = useWellness();
  const todayCount = providers.filter((provider) => provider.availableToday).length;
  const reason = getRecommendationReason(checkIn, recommendedCategory);

  return (
    <aside className="grid content-start gap-4 xl:sticky xl:top-6">
      <section className="overflow-hidden rounded-lg border border-[#0A2318]/10 bg-[#0A2318] p-5 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
        <div className="flex items-center gap-2 text-[#EFB84C]">
          <Sparkles size={16} />
          <p className="text-xs font-bold uppercase tracking-[0.16em]">AI recommendation</p>
        </div>
        <h2 className="mt-4 font-serif text-3xl leading-tight text-white">{recommendedCategory} first</h2>
        <p className="mt-3 text-sm leading-6 text-white/70">{reason}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <RecommendationStat label="Score" value={`${score} ${scoreLabel}`} />
          <RecommendationStat label="Today" value={`${todayCount} open`} />
        </div>
        {stamps.length >= 2 ? (
          <div className="mt-4 rounded-lg border border-[#EFB84C]/20 bg-[#EFB84C]/12 p-3">
            <p className="text-xs font-bold text-[#EFB84C]">Passport active</p>
            <p className="mt-1 text-xs leading-5 text-white/70">{stamps.length} stamps unlock eligible market discounts.</p>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Refine</p>
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2318]/38" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search area or service"
            className="h-11 w-full rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] pl-9 pr-3 text-sm text-[#0A2318] outline-none transition focus:border-[#8C6246]/50"
          />
        </div>

        <div className="mt-4 grid gap-1.5">
          {CATEGORIES.map(({ id, label, Icon, tone }) => {
            const selected = filter === id;
            const count = id === "All" ? providers.length : providers.filter((provider) => provider.category === id).length;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition",
                  selected
                    ? "bg-[#0A2318] text-[#E8EDE7]"
                    : "text-[#0A2318]/68 hover:bg-[#F7F9F5] hover:text-[#0A2318]",
                )}
              >
                <Icon size={16} className={selected ? "text-[#EFB84C]" : tone} />
                <span className="flex-1 text-left">{label}</span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-bold",
                    selected ? "bg-white/10 text-[#EFB84C]" : "bg-[#0A2318]/6 text-[#0A2318]/45",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}

function RecommendationStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/8 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/42">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function getRecommendationReason(checkIn: ReturnType<typeof useWellness>["checkIn"], recommendedCategory: Provider["category"]) {
  if (checkIn.redFlags) return "Warning signs are selected, so licensed recovery options are ranked first.";
  if (checkIn.womenWellness) return "Women's wellness mode is on, so private recovery and care options are prioritized.";
  if (checkIn.painAreas.length > 0) return "Body-map pain is selected, so movement and posture-safe services rise to the top.";
  if (checkIn.stress >= 8) return "Stress is high today, so calming services and guided reset support are prioritized.";
  if (checkIn.stress >= 6) return "Your stress signal suggests relaxation and mind-body services would help most.";
  if (checkIn.movement < 15) return "Movement is low today, so trainer-led and gentle activity services are ranked first.";
  if (checkIn.sleep < 5) return "Short sleep makes recovery, massage, and low-stimulation support more relevant.";
  return `Balanced recommendation based on your current TenaScore, with ${recommendedCategory.toLowerCase()} as the strongest signal.`;
}
