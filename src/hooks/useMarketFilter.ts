"use client";

import { useState } from "react";
import { Provider } from "@/lib/types";
import { providers } from "@/lib/providers";

export type MarketCategory = Provider["category"] | "All";

export function useMarketFilter() {
  const [filter, setFilter] = useState<MarketCategory>("All");

  const filtered =
    filter === "All" ? providers : providers.filter((p) => p.category === filter);

  return { filter, setFilter, filtered };
}
