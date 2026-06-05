"use client";

import { Provider } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MarketCategory } from "@/hooks/useMarketFilter";

const CATEGORIES: MarketCategory[] = ["All", "Stress", "Movement", "Food", "Recovery"];

type Props = {
  filter: MarketCategory;
  setFilter: (v: MarketCategory) => void;
  recommendedCategory: Provider["category"];
};

export default function MarketSidebar({ filter, setFilter, recommendedCategory }: Props) {
  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">TenaMarket</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">Wellness booking</h2>

      <div className="mt-5 rounded-[1.25rem] bg-[#D4C1A0]/35 p-3 text-sm leading-6 text-[#0A2318]/76">
        AI recommendation: prioritize{" "}
        <span className="font-semibold">{recommendedCategory.toLowerCase()}</span> services for
        your current TenaScore pattern.
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "h-10 rounded-full border px-3 text-sm font-semibold transition",
              filter === cat
                ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                : "border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/72 hover:border-[#8C6246] hover:text-[#0A2318]",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3">
        <p className="font-semibold text-[#0A2318]">Provider tools</p>
        <p className="mt-2 text-sm leading-6 text-[#0A2318]/64">
          Listings, booking intake, discount campaigns, client trends, and wellness packages for
          small local providers.
        </p>
      </div>
    </section>
  );
}
