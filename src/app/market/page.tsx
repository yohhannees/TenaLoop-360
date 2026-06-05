"use client";

import { useWellness } from "@/context/WellnessContext";
import { useMarketFilter } from "@/hooks/useMarketFilter";
import ProviderCard from "@/components/market/ProviderCard";
import MarketSidebar from "@/components/market/MarketSidebar";

export default function MarketPage() {
  const { checkIn, bookedProviders, bookProvider } = useWellness();
  const { filter, setFilter, filtered } = useMarketFilter();

  const recommendedCategory =
    checkIn.stress >= 7 ? "Stress" : checkIn.movement < 20 ? "Movement" : "Food";

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <MarketSidebar
        filter={filter}
        setFilter={setFilter}
        recommendedCategory={recommendedCategory}
      />
      <section className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 md:content-start">
        {filtered.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            booked={bookedProviders.includes(provider.id)}
            recommended={provider.category === recommendedCategory}
            onBook={() => bookProvider(provider.id)}
          />
        ))}
      </section>
    </div>
  );
}
