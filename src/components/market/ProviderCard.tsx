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
  type LucideIcon,
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
      const response = await fetch(`/api/providers/${provider.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      });
      if (response.ok) {
        const data = (await response.json()) as { review: { rating: number } };
        setReviewDone(true);
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
        "group min-w-0 overflow-hidden rounded-lg border bg-white shadow-sm shadow-[#0A2318]/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0A2318]/10",
        recommended ? "border-[#0A2318]/40" : "border-[#0A2318]/10",
      )}
    >
      <button type="button" onClick={onExpand} className="block w-full text-left">
        <div className="relative h-56 overflow-hidden bg-[#0A2318]">
          <Image
            src={imageUrl}
            alt={provider.name}
            fill
            unoptimized={imageUrl.startsWith("http")}
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
            style={{ objectPosition: meta.position }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,35,24,0.92),rgba(10,35,24,0.34)_52%,rgba(10,35,24,0.06))]" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {recommended ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#EFB84C] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0A2318]">
                <Sparkles size={12} /> AI match
              </span>
            ) : null}
            {provider.availableToday ? (
              <span className="rounded-lg bg-white/92 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0A2318]">
                Today
              </span>
            ) : null}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#EFB84C]">{provider.type}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <h3 className="min-w-0 font-serif text-3xl leading-none text-white">{provider.name}</h3>
              <span className="shrink-0 rounded-lg border border-white/14 bg-black/28 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                {provider.price}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: meta.soft, color: meta.color }}
            >
              <Icon size={21} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#0A2318]/56">
                <span className="flex items-center gap-1">
                  <Star size={12} fill="#EFB84C" className="text-[#EFB84C]" />
                  <span className="font-bold text-[#0A2318]">{provider.rating.toFixed(1)}</span>
                  <span>({provider.reviews})</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {provider.area} &middot; {provider.distance}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#0A2318]/68">Best for: {provider.bestFor}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {provider.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-md bg-[#0A2318]/6 px-2.5 py-1 text-[10px] font-semibold text-[#0A2318]/62">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#0A2318]/8 pt-4">
            {showDiscount ? (
              <p className="text-xs font-bold text-[#8C6246]">Save {discount}% with Passport</p>
            ) : (
              <p className="text-xs text-[#0A2318]/48">
                {provider.passportDiscount > 0 ? "Passport discount eligible" : "Community care partner"}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#0A2318]/58">
              {expanded ? "Less" : "Details"}
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </span>
          </div>
        </div>
      </button>

      {expanded ? (
        <div className="grid gap-4 border-t border-[#0A2318]/8 px-5 pb-5 pt-4">
          <p className="text-sm leading-6 text-[#0A2318]/72">{provider.description}</p>

          <div className="grid gap-2 text-xs text-[#0A2318]/62">
            <DetailRow icon={Clock} text={provider.hours} />
            <DetailRow icon={Phone} text={provider.phone} />
            {provider.sourceUrl ? (
              <a
                href={provider.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 font-semibold text-[#8C6246] transition hover:text-[#0A2318]"
              >
                <ExternalLink size={13} className="mt-0.5 shrink-0" />
                <span>Provider source</span>
              </a>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0A2318]/42">
              {provider.availableToday ? "Available today" : "Upcoming slots"}
            </p>
            <div className="flex flex-wrap gap-2">
              {provider.slots.map((slot) => (
                <span key={slot} className="rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 py-1.5 text-xs font-semibold text-[#0A2318]/68">
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onBook}
            className={cn(
              "inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition active:scale-[0.98]",
              booked
                ? "border border-[#0A2318]/20 bg-white text-[#0A2318]"
                : "bg-[#0A2318] text-[#E8EDE7] hover:bg-[#173829]",
            )}
          >
            <CalendarCheck size={17} />
            {booked ? "Booked - Experience stamp earned" : showDiscount ? `Book now - save ${discount}%` : "Book now - earn Experience stamp"}
          </button>

          {provider.passportDiscount > 0 && !booked && passportStamps < 2 ? (
            <p className="text-center text-[10px] text-[#0A2318]/48">
              Earn {2 - passportStamps} more passport stamp{2 - passportStamps > 1 ? "s" : ""} to unlock {provider.passportDiscount}% off.
            </p>
          ) : null}

          <div className="rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">Rate this provider</p>
            {reviewDone ? (
              <p className="mt-2 text-sm text-[#0A2318]/68">Thanks for your review.</p>
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
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                    >
                      <Star
                        size={22}
                        fill={(reviewHover || reviewRating) >= star ? "#EFB84C" : "none"}
                        className={(reviewHover || reviewRating) >= star ? "text-[#EFB84C]" : "text-[#0A2318]/25"}
                      />
                    </button>
                  ))}
                </div>
                {reviewRating > 0 ? (
                  <>
                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      placeholder="Optional: share your experience"
                      rows={2}
                      className="w-full resize-none rounded-lg border border-[#0A2318]/10 bg-white px-3 py-2 text-sm text-[#0A2318] outline-none"
                    />
                    <button
                      type="button"
                      onClick={submitReview}
                      disabled={reviewSubmitting}
                      className="h-9 rounded-lg bg-[#8C6246] px-4 text-xs font-semibold text-white transition disabled:opacity-50"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit review"}
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function DetailRow({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={13} className="mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function getCategoryMeta(category: ExtendedProvider["category"]) {
  switch (category) {
    case "Stress":
      return { icon: Brain, image: "/tenaloop-photo-mind.jpg", position: "50% 48%", color: "#2C7DA0", soft: "#E8F3F7" };
    case "Movement":
      return { icon: Dumbbell, image: "/tenaloop-photo-move.jpg", position: "50% 50%", color: "#276442", soft: "#EAF4EE" };
    case "Food":
      return { icon: Utensils, image: "/tenaloop-photo-food-plate.jpg", position: "50% 52%", color: "#A85A10", soft: "#FFF1DE" };
    default:
      return { icon: HeartPulse, image: "/tenaloop-photo-market.jpg", position: "50% 54%", color: "#B23A24", soft: "#FCECE7" };
  }
}
