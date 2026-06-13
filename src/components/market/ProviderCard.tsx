"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Brain,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  ExternalLink,
  HeartPulse,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";
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
  onReviewSubmit?: (providerId: string, newRating: number, newCount: number) => void;
};

export default function ProviderCard({
  provider,
  booked,
  recommended,
  passportStamps,
  onBook,
  onExpand,
  expanded,
  onReviewSubmit,
}: Props) {
  const discount = passportStamps >= 2 ? provider.passportDiscount : 0;
  const showDiscount = discount > 0 && !booked;
  const meta = getCategoryMeta(provider.category);
  const Icon = meta.icon;
  const imageUrl = provider.imageUrl || meta.image;

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  async function submitReview() {
    if (!reviewRating || reviewSubmitting) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/providers/${provider.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      });
      if (res.ok) {
        const data = (await res.json()) as { review: { rating: number } };
        setReviewDone(true);
        // Optimistic update: recompute rating locally
        const newCount = provider.reviews + 1;
        const newRating = Math.round(((provider.rating * provider.reviews + data.review.rating) / newCount) * 10) / 10;
        onReviewSubmit?.(provider.id, newRating, newCount);
      }
    } finally {
      setReviewSubmitting(false);
    }
  }

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[2rem] border bg-[#E8EDE7] shadow-sm shadow-[#0A2318]/5 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A2318]/10",
        recommended ? "border-[#0A2318]" : "border-[#0A2318]/10",
        expanded && "ring-2 ring-[#8C6246]/30",
      )}
    >
      <button type="button" onClick={onExpand} className="block w-full text-left">
        <div className="relative h-40 overflow-hidden bg-[#0A2318]">
          <Image
            src={imageUrl}
            alt={`${provider.name} visual`}
            fill
            unoptimized={imageUrl.startsWith("http")}
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover saturate-[0.92] transition duration-700 group-hover:scale-105"
            style={{ objectPosition: meta.position }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2318]/86 via-[#0A2318]/22 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {recommended && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4C1A0] px-3 py-1 text-[10px] font-bold uppercase text-[#0A2318]">
                <Sparkles size={12} />
                AI match
              </span>
            )}
            {provider.availableToday && (
              <span className="rounded-full bg-[#E8EDE7] px-3 py-1 text-[10px] font-bold uppercase text-[#0A2318]">
                Today
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-[#E8EDE7]">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase text-[#D4C1A0]">{provider.type}</p>
              <h3 className="mt-1 truncate font-serif text-2xl leading-tight">{provider.name}</h3>
            </div>
            <span className="shrink-0 rounded-full border border-[#E8EDE7]/20 bg-[#0A2318]/60 px-3 py-1 text-xs font-semibold backdrop-blur">
              {provider.price}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
                recommended ? "bg-[#0A2318] text-[#D4C1A0]" : "bg-[#D4C1A0]/45 text-[#0A2318]",
              )}
            >
              <Icon size={22} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#0A2318]/58">
                <span className="flex items-center gap-1">
                  <Star size={12} fill="currentColor" className="text-[#C4956A]" />
                  <span className="font-semibold text-[#0A2318]">{provider.rating.toFixed(1)}</span>
                  <span>({provider.reviews} reviews)</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {provider.area} · {provider.distance}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#0A2318]/66">Best for: {provider.bestFor}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {provider.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#0A2318]/8 px-2.5 py-1 text-[10px] font-semibold text-[#0A2318]/62"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#0A2318]/10 pt-3">
            <div className="min-w-0">
              {showDiscount ? (
                <p className="text-xs font-bold text-[#8C6246]">Save {discount}% with Passport</p>
              ) : (
                <p className="text-xs text-[#0A2318]/48">
                  {provider.passportDiscount > 0 ? "Passport discount eligible" : "Community service"}
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A2318]/58">
              {expanded ? "Less" : "Details"}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="grid gap-4 border-t border-[#0A2318]/8 px-5 pb-5 pt-4">
          <p className="text-sm leading-6 text-[#0A2318]/68">{provider.description}</p>

          <div className="grid gap-2 text-xs">
            <div className="flex items-start gap-2 text-[#0A2318]/62">
              <Clock size={13} className="mt-0.5 shrink-0" />
              <span>{provider.hours}</span>
            </div>
            <div className="flex items-start gap-2 text-[#0A2318]/62">
              <Phone size={13} className="mt-0.5 shrink-0" />
              <span>{provider.phone}</span>
            </div>
            {provider.sourceUrl && (
              <a
                href={provider.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 font-semibold text-[#8C6246] transition hover:text-[#724F38]"
              >
                <ExternalLink size={13} className="mt-0.5 shrink-0" />
                <span>Provider source</span>
              </a>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/42">
              {provider.availableToday ? "Available today" : "Upcoming slots"}
            </p>
            <div className="flex flex-wrap gap-2">
              {provider.slots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-3 py-1 text-xs font-medium text-[#0A2318]/70"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onBook}
            className={cn(
              "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition active:scale-[0.98]",
              booked
                ? "border border-[#0A2318] bg-[#E5EAE3] text-[#0A2318]"
                : "bg-[#0A2318] text-[#E8EDE7] hover:bg-[#1A3A2A]",
            )}
          >
            <CalendarCheck size={17} />
            {booked
              ? "Booked — Experience stamp earned"
              : showDiscount
                ? `Book now — save ${discount}% with Passport`
                : "Book now — earn Experience stamp"}
          </button>

          {provider.passportDiscount > 0 && !booked && passportStamps < 2 && (
            <p className="text-center text-[10px] text-[#0A2318]/42">
              Earn {2 - passportStamps} more passport stamp{2 - passportStamps > 1 ? "s" : ""} to unlock {provider.passportDiscount}% off
            </p>
          )}

          {/* Review section */}
          <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-4">
            <p className="text-xs font-bold uppercase text-[#8C6246]">Rate this provider</p>
            {reviewDone ? (
              <p className="mt-2 text-sm text-[#0A2318]/70">Thanks for your review!</p>
            ) : (
              <div className="mt-3 grid gap-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="text-xl transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        fill={(reviewHover || reviewRating) >= star ? "#C4956A" : "none"}
                        className={(reviewHover || reviewRating) >= star ? "text-[#C4956A]" : "text-[#0A2318]/30"}
                      />
                    </button>
                  ))}
                </div>
                {reviewRating > 0 && (
                  <>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Optional: share your experience"
                      rows={2}
                      className="w-full resize-none rounded-xl border border-[#0A2318]/12 bg-[#E8EDE7] px-3 py-2 text-sm text-[#0A2318] placeholder:text-[#0A2318]/35 outline-none focus:border-[#8C6246]"
                    />
                    <button
                      type="button"
                      onClick={submitReview}
                      disabled={reviewSubmitting}
                      className="h-9 rounded-full bg-[#8C6246] px-4 text-xs font-semibold text-[#E8EDE7] transition hover:bg-[#724F38] disabled:opacity-50"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit review"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function getCategoryMeta(category: ExtendedProvider["category"]) {
  switch (category) {
    case "Stress":
      return { icon: Brain, image: "/tenaloop-photo-mind.jpg", position: "50% 48%" };
    case "Movement":
      return { icon: Dumbbell, image: "/tenaloop-photo-move.jpg", position: "50% 50%" };
    case "Food":
      return { icon: Utensils, image: "/tenaloop-photo-food-plate.jpg", position: "50% 52%" };
    default:
      return { icon: HeartPulse, image: "/tenaloop-photo-market.jpg", position: "50% 54%" };
  }
}
