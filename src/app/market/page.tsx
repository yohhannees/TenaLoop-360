"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, Sparkles, Store } from "lucide-react";
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
  { id: "available",   label: "Available today" },
  { id: "rating",      label: "Top rated" },
  { id: "price-asc",   label: "Price: low first" },
];

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
  const linkedProvider =
    extendedProviders.find((provider) => provider.id === linkedProviderId) ?? null;
  const [expandedId, setExpandedId] = useState<string | null>(linkedProvider?.id ?? null);
  const [bookingProvider, setBookingProvider] = useState<ExtendedProvider | null>(null);
  const [dismissedLinkedProviderId, setDismissedLinkedProviderId] = useState<string | null>(null);

  const recommendedCategory =
    checkIn.redFlags ? "Recovery" :
    checkIn.womenWellness ? "Recovery" :
    checkIn.painAreas.length > 0 ? "Movement" :
    checkIn.stress >= 7 ? "Stress" :
    checkIn.movement < 20 ? "Movement" :
    checkIn.bpFocus || checkIn.glucoseFocus ? "Food" : "Recovery";

  const { filter, setFilter, search, setSearch, sort, setSort, filtered } =
    useMarketFilter(recommendedCategory);

  function toggleExpand(id: string) { setExpandedId((prev) => (prev === id ? null : id)); }

  function initiateBooking(p: ExtendedProvider) { if (!bookedProviders.includes(p.id)) setBookingProvider(p); }

  const queryBookingProvider =
    linkedProvider &&
    dismissedLinkedProviderId !== linkedProvider.id &&
    !bookedProviders.includes(linkedProvider.id)
      ? linkedProvider
      : null;
  const activeBookingProvider = bookingProvider ?? queryBookingProvider;

  function confirmBooking(details: Parameters<typeof bookProvider>[1]) {
    if (activeBookingProvider) bookProvider(activeBookingProvider.id, details);
  }

  function closeModal() {
    if (queryBookingProvider) {
      setDismissedLinkedProviderId(queryBookingProvider.id);
    }
    setBookingProvider(null);
    setExpandedId(null);
  }

  return (
    <>
      {activeBookingProvider && (
        <BookingModal provider={activeBookingProvider} onClose={closeModal} onConfirm={confirmBooking} />
      )}
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
        <section className="overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
          <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#D4C1A0]">
                <Store size={15} />
                Marketplace command center
              </div>
              <h1 className="mt-2 font-serif text-4xl leading-tight">
                Local care matched to today&apos;s score.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#E8EDE7]/68">
                Browse providers, bundles, and same-day slots that connect the
                TenaScore to real services around Addis.
              </p>
            </div>
            <div className="grid min-w-0 grid-cols-3 gap-2">
              <MarketStat icon={Sparkles} label="Match" value={recommendedCategory} />
              <MarketStat icon={CalendarCheck} label="Booked" value={`${bookedProviders.length}`} />
              <MarketStat icon={Store} label="Stamps" value={`${stamps.length}/6`} />
            </div>
          </div>
        </section>

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
                onBook={() => initiateBooking(provider)}
              />
            ))}
          </div>
        )}

        {/* Wellness packages */}
        <WellnessPackages />

      </div>
    </div>
    </>
  );
}

function MarketStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Store;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E8EDE7]/12 px-3 py-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#D4C1A0]/72">
        <Icon size={13} />
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-semibold text-[#E8EDE7]">{value}</p>
    </div>
  );
}
