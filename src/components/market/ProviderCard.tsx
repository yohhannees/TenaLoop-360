"use client";

import { Star, Clock, MapPin, Phone } from "lucide-react";
import { ExtendedProvider } from "@/lib/market-providers";
import { cn } from "@/lib/utils";

type Props = {
  provider: ExtendedProvider;
  booked: boolean;
  recommended: boolean;
  passportStamps: number;
  onBook: () => void;
  onExpand: () => void;
  expanded: boolean;
};

export default function ProviderCard({
  provider, booked, recommended, passportStamps, onBook, onExpand, expanded,
}: Props) {
  const discount     = passportStamps >= 2 ? provider.passportDiscount : 0;
  const showDiscount = discount > 0 && !booked;

  return (
    <article
      className={cn(
        "rounded-[2rem] border bg-[#E8EDE7] shadow-sm shadow-[#0A2318]/5 transition-all",
        recommended ? "border-[#0A2318]" : "border-[#0A2318]/10",
        expanded && "ring-2 ring-[#8C6246]/30",
      )}
    >
      {/* Card summary */}
      <button
        type="button"
        onClick={onExpand}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Emoji icon */}
          <span className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl",
            recommended ? "bg-[#0A2318]" : "bg-[#0A2318]/8",
          )}>
            {provider.emoji}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase text-[#8C6246]">{provider.type}</p>
                <h3 className="font-serif text-xl leading-tight text-[#0A2318]">{provider.name}</h3>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {recommended && (
                  <span className="rounded-full bg-[#0A2318] px-2.5 py-1 text-[10px] font-bold text-[#D4C1A0]">
                    AI Match
                  </span>
                )}
                {provider.availableToday && (
                  <span className="rounded-full bg-[#8C6246]/12 px-2.5 py-1 text-[10px] font-bold text-[#8C6246]">
                    Available today
                  </span>
                )}
              </div>
            </div>

            {/* Rating + area row */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#0A2318]/55">
              <span className="flex items-center gap-1">
                <Star size={11} fill="currentColor" className="text-[#C4956A]" />
                <span className="font-semibold text-[#0A2318]">{provider.rating}</span>
                <span>({provider.reviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={10} />
                {provider.area} · {provider.distance}
              </span>
            </div>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {provider.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-[#0A2318]/8 px-2 py-0.5 text-[10px] font-medium text-[#0A2318]/65">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price row */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0A2318]">{provider.price}</span>
            {showDiscount && (
              <span className="rounded-full bg-[#8C6246]/12 px-2 py-0.5 text-[10px] font-bold text-[#8C6246]">
                -{discount}% with Passport
              </span>
            )}
          </div>
          <span className="text-xs text-[#0A2318]/40">{expanded ? "▲ less" : "▼ details"}</span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[#0A2318]/8 px-5 pb-5 pt-4 grid gap-4">
          <p className="text-sm leading-6 text-[#0A2318]/68">{provider.description}</p>

          {/* Meta grid */}
          <div className="grid gap-2 text-xs">
            <div className="flex items-start gap-2 text-[#0A2318]/60">
              <Clock size={12} className="mt-0.5 shrink-0" />
              <span>{provider.hours}</span>
            </div>
            <div className="flex items-start gap-2 text-[#0A2318]/60">
              <Phone size={12} className="mt-0.5 shrink-0" />
              <span>{provider.phone}</span>
            </div>
          </div>

          {/* Available slots */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/40">
              {provider.availableToday ? "Available today" : "Upcoming slots"}
            </p>
            <div className="flex flex-wrap gap-2">
              {provider.slots.map((slot) => (
                <span key={slot} className="rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-3 py-1 text-xs font-medium text-[#0A2318]/70">
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Book CTA */}
          <button
            type="button"
            onClick={onBook}
            className={cn(
              "h-12 w-full rounded-full text-sm font-semibold transition active:scale-[0.98]",
              booked
                ? "border border-[#0A2318] bg-[#E5EAE3] text-[#0A2318]"
                : "bg-[#0A2318] text-[#E8EDE7] hover:bg-[#1A3A2A]",
            )}
          >
            {booked
              ? "Booked ✓ — Experience stamp earned"
              : showDiscount
                ? `Book now · save ${discount}% with your Passport`
                : "Book now · earn Experience stamp"}
          </button>

          {provider.passportDiscount > 0 && !booked && passportStamps < 2 && (
            <p className="text-center text-[10px] text-[#0A2318]/40">
              Earn {2 - passportStamps} more passport stamp{2 - passportStamps > 1 ? "s" : ""} to unlock {provider.passportDiscount}% off
            </p>
          )}
        </div>
      )}
    </article>
  );
}
