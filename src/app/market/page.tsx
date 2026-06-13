"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, MapPin, Search, Sparkles, Star, Store } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { useMarketFilter, SortMode } from "@/hooks/useMarketFilter";
import { ExtendedProvider, extendedProviders } from "@/lib/market-providers";
import BookingModal from "@/components/market/BookingModal";
import ProviderCard from "@/components/market/ProviderCard";
import MarketSidebar from "@/components/market/MarketSidebar";
import WellnessPackages from "@/components/market/WellnessPackages";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "recommended", label: "Best match" },
  { id: "available", label: "Available today" },
  { id: "rating", label: "Top rated" },
  { id: "price-asc", label: "Lowest price" },
];

function dbProviderToExtended(p: Record<string, unknown>): ExtendedProvider {
  return {
    id: p.id as string,
    name: p.name as string,
    type: p.type as string,
    area: p.area as string,
    price: p.price as string,
    bestFor: p.bestFor as string,
    category: p.category as ExtendedProvider["category"],
    description: p.description as string,
    rating: p.avgRating as number,
    reviews: p.reviewCount as number,
    emoji: p.emoji as string,
    tags: p.tags as string[],
    availableToday: p.availableToday as boolean,
    slots: p.slots as string[],
    passportDiscount: p.passportDiscount as number,
    distance: p.distance as string,
    hours: p.hours as string,
    phone: p.phone as string,
    imageUrl: (p.imageUrl as string | null) ?? "/tenaloop-photo-market.jpg",
    sourceUrl: (p.sourceUrl as string | null) ?? "",
  };
}

export default function MarketPage() {
  return (
    <Suspense fallback={null}>
      <MarketPageContent />
    </Suspense>
  );
}

function MarketPageContent() {
  const { checkIn, bookedProviders, bookProvider, stamps } = useWellness();
  const searchParams = useSearchParams();
  const linkedProviderId = searchParams.get("provider");

  const [providers, setProviders] = useState<ExtendedProvider[]>(extendedProviders);
  const [expandedId, setExpandedId] = useState<string | null>(linkedProviderId ?? null);
  const [bookingProvider, setBookingProvider] = useState<ExtendedProvider | null>(null);
  const [dismissedLinkedProviderId, setDismissedLinkedProviderId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/providers", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { providers?: Record<string, unknown>[] }) => {
        if (data.providers?.length) setProviders(data.providers.map(dbProviderToExtended));
      })
      .catch(() => {});
  }, []);

  const recommendedCategory =
    checkIn.redFlags ? "Recovery" :
    checkIn.womenWellness ? "Recovery" :
    checkIn.painAreas.length > 0 ? "Movement" :
    checkIn.stress >= 7 ? "Stress" :
    checkIn.movement < 20 ? "Movement" :
    checkIn.bpFocus || checkIn.glucoseFocus ? "Food" : "Recovery";

  const { filter, setFilter, search, setSearch, sort, setSort, filtered } =
    useMarketFilter(providers, recommendedCategory);

  const linkedProvider = providers.find((p) => p.id === linkedProviderId) ?? null;
  const queryBookingProvider =
    linkedProvider && dismissedLinkedProviderId !== linkedProvider.id && !bookedProviders.includes(linkedProvider.id)
      ? linkedProvider
      : null;
  const activeBookingProvider = bookingProvider ?? queryBookingProvider;

  const heroProvider = useMemo(() => {
    return providers.find((provider) => provider.category === recommendedCategory && provider.availableToday) ??
      providers.find((provider) => provider.category === recommendedCategory) ??
      providers[0];
  }, [providers, recommendedCategory]);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function initiateBooking(provider: ExtendedProvider) {
    if (!bookedProviders.includes(provider.id)) setBookingProvider(provider);
  }

  function confirmBooking(details: Parameters<typeof bookProvider>[1]) {
    if (activeBookingProvider) bookProvider(activeBookingProvider.id, details);
  }

  function closeModal() {
    if (queryBookingProvider) setDismissedLinkedProviderId(queryBookingProvider.id);
    setBookingProvider(null);
    setExpandedId(null);
  }

  function handleReviewSubmit(providerId: string, newRating: number, newCount: number) {
    setProviders((prev) =>
      prev.map((provider) =>
        provider.id === providerId ? { ...provider, rating: newRating, reviews: newCount } : provider,
      ),
    );
  }

  return (
    <div className="grid min-w-0 gap-6 pb-10">
      {activeBookingProvider ? (
        <BookingModal provider={activeBookingProvider} onClose={closeModal} onConfirm={confirmBooking} />
      ) : null}

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
        <div className="relative min-h-[330px] overflow-hidden rounded-lg bg-[#0A2318] text-white shadow-sm shadow-[#0A2318]/10">
          <Image
            src={heroProvider?.imageUrl || "/tenaloop-photo-market.jpg"}
            alt={heroProvider?.name || "TenaMarket"}
            fill
            priority
            unoptimized={Boolean(heroProvider?.imageUrl?.startsWith("http"))}
            sizes="(min-width: 1280px) 720px, 100vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,35,24,0.92),rgba(10,35,24,0.62)_42%,rgba(10,35,24,0.12))]" />
          <div className="relative z-10 flex min-h-[330px] max-w-2xl flex-col justify-between p-5 sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EFB84C]">TenaMarket Addis</p>
              <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[0.98] text-white">
                Care that feels selected, not searched.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-white/72">
                Real Ethiopian wellness providers matched to your current score, body signals, passport stamps, and daily loop.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <HeroStat icon={Sparkles} label="Match" value={recommendedCategory} />
              <HeroStat icon={CalendarCheck} label="Bookings" value={bookedProviders.length.toString()} />
              <HeroStat icon={Store} label="Passport" value={`${stamps.length}/6`} />
            </div>
          </div>
        </div>

        <div className="grid content-stretch gap-4">
          <article className="rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Featured nearby</p>
                <h2 className="mt-1 font-serif text-3xl leading-tight text-[#0A2318]">{heroProvider?.name}</h2>
              </div>
              <span className="rounded-lg border border-[#EFB84C]/28 bg-[#FFF6DD] px-3 py-1.5 text-xs font-bold text-[#8C6246]">
                {heroProvider?.price}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#0A2318]/64">{heroProvider?.bestFor}</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniMetric icon={Star} label="Rating" value={heroProvider ? heroProvider.rating.toFixed(1) : "--"} />
              <MiniMetric icon={MapPin} label="Area" value={heroProvider?.area ?? "--"} />
              <MiniMetric icon={CalendarCheck} label="Today" value={heroProvider?.availableToday ? "Open" : "Soon"} />
            </div>
          </article>

          <div className="rounded-lg border border-[#0A2318]/10 bg-white p-3 shadow-sm shadow-[#0A2318]/5">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0A2318]/38" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search spa, gym, nutrition, Bole..."
                className="h-12 w-full rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] pl-10 pr-4 text-sm text-[#0A2318] outline-none transition focus:border-[#8C6246]/50"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <MarketSidebar
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          recommendedCategory={recommendedCategory}
          providers={providers}
        />

        <div className="grid min-w-0 content-start gap-5">
          <div className="flex flex-col gap-3 rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-[#0A2318]/64">
              <span className="font-bold text-[#0A2318]">{filtered.length}</span>{" "}
              service{filtered.length === 1 ? "" : "s"}
              {search ? <span> matching <span className="font-semibold text-[#0A2318]">{search}</span></span> : null}
            </p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {SORT_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSort(id)}
                  className={cn(
                    "h-9 shrink-0 rounded-lg border px-3 text-xs font-semibold transition",
                    sort === id
                      ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                      : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/62 hover:border-[#0A2318]/24 hover:text-[#0A2318]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-[#0A2318]/10 bg-white p-10 text-center shadow-sm shadow-[#0A2318]/5">
              <p className="font-serif text-3xl text-[#0A2318]">No providers match yet</p>
              <p className="mt-2 text-sm text-[#0A2318]/58">Try a different search, category, or sort mode.</p>
            </div>
          ) : (
            <div className="grid min-w-0 gap-5 lg:grid-cols-2">
              {filtered.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  booked={bookedProviders.includes(provider.id)}
                  recommended={provider.category === recommendedCategory}
                  passportStamps={stamps.length}
                  expanded={expandedId === provider.id}
                  onExpand={() => toggleExpand(provider.id)}
                  onBook={() => initiateBooking(provider)}
                  onReviewSubmit={handleReviewSubmit}
                />
              ))}
            </div>
          )}

          <WellnessPackages />
        </div>
      </div>
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/10 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/58">
        <Icon size={12} className="text-[#EFB84C]" />
        {label}
      </div>
      <p className="mt-1 truncate font-serif text-xl leading-none text-white">{value}</p>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: typeof Store; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] px-3 py-2">
      <div className="flex items-center gap-1.5 text-[#8C6246]">
        <Icon size={13} />
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm font-bold text-[#0A2318]">{value}</p>
    </div>
  );
}
