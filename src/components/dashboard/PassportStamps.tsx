"use client";

import { useWellness } from "@/context/WellnessContext";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { Stamp } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL_STAMPS: Stamp[] = ["Mind", "Food", "Move", "Community", "Experience", "Health"];

export default function PassportStamps() {
  const { stamps, points } = useWellness();
  const config = useDashboardConfig();
  const rewardMessage = getRewardMessage({
    points,
    stampCount: stamps.length,
    pointThreshold: config.reward.pointThreshold,
    requiredStamps: config.reward.requiredStamps,
    discountLabel: config.reward.discountLabel,
  });

  return (
    <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Passport stamps</p>
      <h2 className="mt-1 font-serif text-3xl text-[#0A2318]">Rewards loop</h2>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_STAMPS.map((stamp) => {
          const earned = stamps.includes(stamp);
          return (
            <div
              key={stamp}
              className={cn(
                "flex min-h-24 flex-col justify-between rounded-[1.25rem] border p-3 transition",
                earned
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10"
                  : "border-[#0A2318]/10 bg-[#E5EAE3] text-[#0A2318]/58",
              )}
            >
              <span className="text-sm font-semibold">{stamp}</span>
              <span className="text-xs font-medium">{earned ? "Earned" : "Open"}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-[#8C6246]/20 bg-[#D4C1A0]/35 p-3 text-sm leading-6 text-[#0A2318]/76">
        {rewardMessage}
      </div>
    </div>
  );
}

function getRewardMessage({
  points,
  stampCount,
  pointThreshold,
  requiredStamps,
  discountLabel,
}: {
  points: number;
  stampCount: number;
  pointThreshold: number;
  requiredStamps: number;
  discountLabel: string;
}) {
  const missingPoints = Math.max(0, pointThreshold - points);
  const missingStamps = Math.max(0, requiredStamps - stampCount);

  if (missingPoints === 0 && missingStamps === 0) {
    return `Reward unlocked: ${discountLabel}.`;
  }

  if (missingStamps === 0) {
    return `${missingPoints} more point${missingPoints === 1 ? "" : "s"} to unlock ${discountLabel}.`;
  }

  if (missingPoints === 0) {
    return `${missingStamps} more stamp${missingStamps === 1 ? "" : "s"} to unlock ${discountLabel}.`;
  }

  return `${missingStamps} more stamp${missingStamps === 1 ? "" : "s"} and ${missingPoints} more point${missingPoints === 1 ? "" : "s"} to unlock ${discountLabel}.`;
}
