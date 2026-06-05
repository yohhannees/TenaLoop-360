"use client";

import { useState } from "react";
import { Provider } from "@/lib/types";
import { extendedProviders, ExtendedProvider } from "@/lib/market-providers";

export type MarketCategory = Provider["category"] | "All";
export type SortMode = "recommended" | "rating" | "price-asc" | "available";

export function useMarketFilter(recommendedCategory?: Provider["category"]) {
  const [filter, setFilter]   = useState<MarketCategory>("All");
  const [search, setSearch]   = useState("");
  const [sort, setSort]       = useState<SortMode>("recommended");

  let filtered: ExtendedProvider[] = extendedProviders;

  // category filter
  if (filter !== "All") {
    filtered = filtered.filter((p) => p.category === filter);
  }

  // search
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
    );
  }

  // sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "rating")     return b.rating - a.rating;
    if (sort === "price-asc")  return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sort === "available")  return Number(b.availableToday) - Number(a.availableToday);
    // recommended — match category first, then available today, then rating
    const aMatch = recommendedCategory ? (a.category === recommendedCategory ? 0 : 1) : 0;
    const bMatch = recommendedCategory ? (b.category === recommendedCategory ? 0 : 1) : 0;
    if (aMatch !== bMatch) return aMatch - bMatch;
    if (a.availableToday !== b.availableToday) return Number(b.availableToday) - Number(a.availableToday);
    return b.rating - a.rating;
  });

  return { filter, setFilter, search, setSearch, sort, setSort, filtered };
}
