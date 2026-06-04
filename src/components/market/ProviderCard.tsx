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
        "rounded-md border bg-white p-4 shadow-sm",
        recommended ? "border-[#0f6b52]" : "border-[#d8e4dc]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase text-[#64756b]">{provider.type}</p>
          <h3 className="mt-1 text-xl font-semibold">{provider.name}</h3>
        </div>
        {recommended && (
          <span className="rounded-md bg-[#eef6f2] px-2.5 py-1 text-xs font-semibold text-[#0f6b52]">
            Match
          </span>
        )}
      </div>

      <dl className="mt-4 grid gap-2 text-sm text-[#52665c]">
        <div className="flex justify-between gap-3">
          <dt>Area</dt>
          <dd className="font-medium text-[#23362c]">{provider.area}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Price</dt>
          <dd className="font-medium text-[#23362c]">{provider.price}</dd>
        </div>
        <div className="grid gap-1">
          <dt>Best for</dt>
          <dd className="font-medium text-[#23362c]">{provider.bestFor}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onBook}
        className={cn(
          "mt-4 h-10 w-full rounded-md px-3 text-sm font-semibold transition",
          booked
            ? "border border-[#0f6b52] bg-white text-[#0f6b52]"
            : "bg-[#d86f45] text-white hover:bg-[#c55f38]",
        )}
      >
        {booked ? "Booked" : "Book and stamp passport"}
      </button>
    </article>
  );
}
