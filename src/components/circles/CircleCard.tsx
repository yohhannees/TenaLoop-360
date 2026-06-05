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
    <div
      className={cn(
        "grid gap-3 rounded-[1.5rem] border p-4 transition md:grid-cols-[1fr_auto] md:items-center",
        joined
          ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
          : "border-[#0A2318]/10 bg-[#E5EAE3]",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn("font-semibold", joined ? "text-[#E8EDE7]" : "text-[#0A2318]")}>
            {circle.name}
          </h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              joined ? "bg-[#E8EDE7]/10 text-[#D4C1A0]" : "bg-[#D4C1A0]/35 text-[#0A2318]",
            )}
          >
            {circle.members} members
          </span>
        </div>
        <p className={cn("mt-1 text-sm leading-6", joined ? "text-[#E8EDE7]/68" : "text-[#0A2318]/64")}>
          {circle.focus}
        </p>
        <p className={cn("mt-1 text-sm font-medium", joined ? "text-[#D4C1A0]" : "text-[#8C6246]")}>
          {circle.time}
        </p>
        <p className={cn("mt-1 text-sm", joined ? "text-[#E8EDE7]/68" : "text-[#0A2318]/64")}>
          Challenge: {circle.challenge}
        </p>
      </div>
      <button
        type="button"
        onClick={onJoin}
        className={cn(
          "h-10 rounded-full px-4 text-sm font-semibold transition",
          joined
            ? "border border-[#E8EDE7]/28 bg-[#E8EDE7]/10 text-[#E8EDE7]"
            : "bg-[#0A2318] text-[#E8EDE7] hover:bg-[#1A3A2A]",
        )}
      >
        {joined ? "Joined" : "Join circle"}
      </button>
    </div>
  );
}
