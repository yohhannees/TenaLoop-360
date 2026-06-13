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
  const progress = Math.min(100, (stamps.length / ALL_STAMPS.length) * 100);

  return (
    <div className="h-full rounded-lg border border-[#0A2318]/10 bg-white p-5 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">Passport stamps</p>
          <h2 className="mt-1 font-serif text-2xl text-[#0A2318]">Rewards loop</h2>
        </div>
        <div className="text-right">
          <p className="font-serif text-3xl font-bold leading-none text-[#0A2318]">{stamps.length}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A2318]/45">of 6</p>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#E6ECE5]">
        <div className="h-full rounded-full bg-[#EFB84C] transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_STAMPS.map((stamp) => {
          const earned = stamps.includes(stamp);
          return (
            <div
              key={stamp}
              className={cn(
                "flex min-h-20 flex-col justify-between rounded-lg border p-3 transition",
                earned
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10"
                  : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/58",
              )}
            >
              <span className="text-sm font-semibold">{stamp}</span>
              <span className="text-xs font-medium">{earned ? "Earned" : "Open"}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-[#EFB84C]/25 bg-[#FFF6DD] p-3 text-sm leading-6 text-[#0A2318]/76">
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
