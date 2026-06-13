"use client";

import { useEffect, useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import BusinessCard from "@/components/ui/BusinessCard";

type AnalyticsData = {
  avgScore: number | null;
  checkInCount: number;
  bookingCount: number;
  joinedCircleCount: number;
};

export default function BusinessMetrics() {
  const { bookedProviders, joinedCircles, score, isBackendReady } = useWellness();
  const config = useDashboardConfig();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const lanes = config.business.monetizationLanes;
  const teamScore = analytics?.avgScore ?? (isBackendReady ? null : score);
  const bookingCount = analytics?.bookingCount ?? bookedProviders.length;
  const circleCount = analytics?.joinedCircleCount ?? joinedCircles.length;

  useEffect(() => {
    fetch("/api/analytics", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: AnalyticsData) => {
        if ("checkInCount" in data) setAnalytics(data);
      })
      .catch(() => {});
  }, [score, bookedProviders.length, joinedCircles.length]);

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
      <BusinessCard
        label="Corporate wellness"
        title="Team wellness score"
        metric={teamScore === null ? "—" : `${teamScore}`}
        body={
          analytics?.checkInCount
            ? `Average from ${analytics.checkInCount} saved check-in${analytics.checkInCount === 1 ? "" : "s"} in the last 7 days.`
            : "Save check-ins to build an anonymized wellness score trend."
        }
        index="01"
        tone="forest"
      />
      <BusinessCard
        label="Provider marketplace"
        title="Bookings in demo"
        metric={`${bookingCount}`}
        body={
          bookingCount > 0
            ? `${bookingCount} confirmed provider booking${bookingCount === 1 ? "" : "s"} tied to this account.`
            : "No bookings yet. Marketplace conversions appear here after users book."
        }
        index="02"
        tone="sand"
      />
      <BusinessCard
        label="Community health"
        title="Active circles"
        metric={`${circleCount}`}
        body={
          circleCount > 0
            ? `${circleCount} joined circle${circleCount === 1 ? "" : "s"} contributing community support signals.`
            : "Joined peer circles will appear here as community support signals."
        }
        index="03"
        tone="sage"
      />
      <BusinessCard
        label="Revenue model"
        title="Monetization lanes"
        metric={`${lanes.length}`}
        body={`Configured lanes: ${lanes.map((lane) => lane.label).join(", ")}.`}
        index="04"
        tone="clay"
      />
    </div>
  );
}
