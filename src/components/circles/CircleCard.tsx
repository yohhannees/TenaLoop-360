"use client";

import { Circle } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  circle: Circle;
  joined: boolean;
  onJoin: () => void;
};

export default function CircleCard({ circle, joined, onJoin }: Props) {
  return (
    <div className="grid gap-3 rounded-md border border-[#dde8e1] bg-[#fbfdfb] p-3 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-[#14231d]">{circle.name}</h3>
          <span className="rounded-md bg-[#eef6f2] px-2 py-1 text-xs font-medium text-[#0f6b52]">
            {circle.members} members
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-[#52665c]">{circle.focus}</p>
        <p className="mt-1 text-sm font-medium text-[#284237]">{circle.time}</p>
        <p className="mt-1 text-sm text-[#52665c]">Challenge: {circle.challenge}</p>
      </div>
      <button
        type="button"
        onClick={onJoin}
        className={cn(
          "h-10 rounded-md px-3 text-sm font-semibold transition",
          joined
            ? "border border-[#0f6b52] bg-white text-[#0f6b52]"
            : "bg-[#0f6b52] text-white hover:bg-[#0b5944]",
        )}
      >
        {joined ? "Joined" : "Join circle"}
      </button>
    </div>
  );
}
