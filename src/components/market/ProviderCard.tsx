"use client";

import { Provider } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  provider: Provider;
  booked: boolean;
  recommended: boolean;
  onBook: () => void;
};

export default function ProviderCard({ provider, booked, recommended, onBook }: Props) {
  return (
    <article
      className={cn(
        "rounded-[2rem] border bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5 transition hover:border-[#8C6246]/40",
        recommended ? "border-[#0A2318]" : "border-[#0A2318]/10",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">{provider.type}</p>
          <h3 className="mt-1 font-serif text-2xl text-[#0A2318]">{provider.name}</h3>
        </div>
        {recommended && (
          <span className="rounded-full bg-[#0A2318] px-2.5 py-1 text-xs font-semibold text-[#E8EDE7]">
            Match
          </span>
        )}
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-[#0A2318]/62">
        <div className="flex justify-between gap-3">
          <dt>Area</dt>
          <dd className="font-medium text-[#0A2318]">{provider.area}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Price</dt>
          <dd className="font-medium text-[#0A2318]">{provider.price}</dd>
        </div>
        <div className="grid gap-1">
          <dt>Best for</dt>
          <dd className="font-medium text-[#0A2318]">{provider.bestFor}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onBook}
        className={cn(
          "mt-4 h-10 w-full rounded-full px-3 text-sm font-semibold transition",
          booked
            ? "border border-[#0A2318] bg-[#E5EAE3] text-[#0A2318]"
            : "bg-[#8C6246] text-[#E8EDE7] hover:bg-[#724F38]",
        )}
      >
        {booked ? "Booked" : "Book and stamp passport"}
      </button>
    </article>
  );
}
