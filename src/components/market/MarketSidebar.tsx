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
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">TenaMarket</p>
      <h2 className="text-2xl font-semibold">Wellness booking</h2>

      <div className="mt-5 rounded-md bg-[#eef6f2] p-3 text-sm leading-6 text-[#284237]">
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
              "h-10 rounded-md border px-3 text-sm font-semibold transition",
              filter === cat
                ? "border-[#0f6b52] bg-[#0f6b52] text-white"
                : "border-[#d7e4dc] bg-white text-[#33483e] hover:border-[#0f6b52]",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-[#d8e4dc] p-3">
        <p className="font-semibold">Provider tools</p>
        <p className="mt-2 text-sm leading-6 text-[#52665c]">
          Listings, booking intake, discount campaigns, client trends, and wellness packages for
          small local providers.
        </p>
      </div>
    </section>
  );
}
