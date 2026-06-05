"use client";

import { useWellness } from "@/context/WellnessContext";
import BusinessCard from "@/components/ui/BusinessCard";

export default function BusinessMetrics() {
  const { bookedProviders, joinedCircles } = useWellness();

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
      <BusinessCard
        label="Corporate wellness"
        title="Team wellness score"
        metric="67"
        body="Anonymous trends for stress, sleep, food, movement, and support."
      />
      <BusinessCard
        label="Provider marketplace"
        title="Bookings in demo"
        metric={`${bookedProviders.length}`}
        body="Provider listings, offers, conversion, and repeat client signals."
      />
      <BusinessCard
        label="Community health"
        title="Active circles"
        metric={`${joinedCircles.length}`}
        body="Moderated peer groups for students, workers, fasting, and BP habits."
      />
      <BusinessCard
        label="Revenue model"
        title="Monetization lanes"
        metric="4"
        body="Premium AI, marketplace commission, provider SaaS, and B2B insights."
      />
    </div>
  );
}
