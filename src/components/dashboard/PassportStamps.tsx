"use client";

import { useWellness } from "@/context/WellnessContext";
import { Stamp } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL_STAMPS: Stamp[] = ["Mind", "Food", "Move", "Community", "Experience", "Health"];

export default function PassportStamps() {
  const { stamps, points } = useWellness();

  return (
    <div className="rounded-md border border-[#d7e3db] bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase text-[#64756b]">Passport stamps</p>
      <h2 className="mt-1 text-2xl font-semibold">Rewards loop</h2>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_STAMPS.map((stamp) => {
          const earned = stamps.includes(stamp);
          return (
            <div
              key={stamp}
              className={cn(
                "flex min-h-24 flex-col justify-between rounded-md border p-3 transition",
                earned
                  ? "border-[#0f6b52] bg-[#edf6f1] text-[#0f6b52] shadow-sm"
                  : "border-[#d8e4dc] bg-[#fbfcfa] text-[#64756b]",
              )}
            >
              <span className="text-sm font-semibold">{stamp}</span>
              <span className="text-xs font-medium">{earned ? "Earned" : "Open"}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-md border border-[#f3d8c2] bg-[#fff3ea] p-3 text-sm leading-6 text-[#72401f]">
        {points >= 240
          ? "Reward unlocked: 20% off a yoga, spa, or nutrition booking."
          : `${240 - points} more points to unlock your 20% wellness discount.`}
      </div>
    </div>
  );
}
