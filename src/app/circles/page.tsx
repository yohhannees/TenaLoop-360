"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { circles as staticCircles } from "@/lib/circles";
import { Circle } from "@/lib/types";
import { CIRCLE_SESSIONS } from "@/lib/circle-content";
import { cn } from "@/lib/utils";
import MoodPulse from "@/components/circles/MoodPulse";
import CommunityFeed from "@/components/circles/CommunityFeed";
import ChallengeTracker from "@/components/circles/ChallengeTracker";
import CircleCheckIn from "@/components/circles/CircleCheckIn";

type CircleWithCount = Circle & { members: number };

export default function CirclesPage() {
  return (
    <Suspense fallback={null}>
      <CirclesPageContent />
    </Suspense>
  );
}

function CirclesPageContent() {
  const { joinedCircles, joinCircle } = useWellness();
  const searchParams = useSearchParams();
  const linkedCircleId = searchParams.get("circle");

  const [circles, setCircles] = useState<CircleWithCount[]>(staticCircles);

  useEffect(() => {
    fetch("/api/circles")
      .then((r) => r.json())
      .then((data: { circles?: CircleWithCount[] }) => {
        if (data.circles?.length) setCircles(data.circles);
      })
      .catch(() => {});
  }, []);

  const defaultId = linkedCircleId ?? joinedCircles[0] ?? circles[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);

  const selected = circles.find((c) => c.id === selectedId) ?? circles[0];
  const session  = CIRCLE_SESSIONS.find((s) => s.circleId === selectedId);

  if (!selected) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">

      {/* ── LEFT: Directory + Mood pulse ────────────────── */}
      <div className="grid content-start gap-5">

        <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
          <p className="text-xs font-bold uppercase text-[#8C6246]">TenaCircle</p>
          <h2 className="font-serif text-2xl text-[#0A2318]">Peer circles</h2>
          <p className="mt-1 text-xs text-[#0A2318]/50">{joinedCircles.length} joined · {circles.length} available</p>

          <div className="mt-4 grid gap-1.5">
            {circles.map((circle) => {
              const joined = joinedCircles.includes(circle.id);
              const active = circle.id === selectedId;
              const sess   = CIRCLE_SESSIONS.find((s) => s.circleId === circle.id);

              return (
                <button
                  key={circle.id}
                  type="button"
                  onClick={() => setSelectedId(circle.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                    active ? "bg-[#0A2318] text-[#E8EDE7]" : "hover:bg-[#0A2318]/6 text-[#0A2318]",
                  )}
                >
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    active ? "bg-[#E8EDE7]/10" : "bg-[#0A2318]/8",
                  )}>
                    <Users size={13} className={active ? "text-[#D4C1A0]" : "text-[#0A2318]/55"} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-semibold", active ? "text-[#E8EDE7]" : "text-[#0A2318]")}>
                      {circle.name}
                    </p>
                    <p className={cn("text-[10px]", active ? "text-[#D4C1A0]/70" : "text-[#0A2318]/40")}>
                      {circle.members} members
                      {sess?.isToday && <span className="ml-1.5 font-bold text-[#8C6246]">● Live</span>}
                    </p>
                  </div>
                  {joined && !active && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C6246]" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <MoodPulse circleId={selectedId} />
      </div>

      {/* ── RIGHT: Active circle detail ─────────────────── */}
      <div className="grid content-start gap-5">

        <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-[#8C6246]">Active circle</p>
              <h2 className="font-serif text-3xl text-[#0A2318]">{selected.name}</h2>
              <p className="mt-1 text-sm text-[#0A2318]/60">{selected.focus}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {session && (
                <span className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  session.isToday ? "bg-[#0A2318] text-[#D4C1A0]" : "bg-[#0A2318]/8 text-[#0A2318]/65",
                )}>
                  {session.isToday ? "🔴 Live " : "📅 "}{selected.time}
                </span>
              )}
              <button
                type="button"
                onClick={() => joinCircle(selected.id)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-semibold transition",
                  joinedCircles.includes(selected.id)
                    ? "border border-[#0A2318]/18 bg-transparent text-[#0A2318]/55"
                    : "bg-[#8C6246] text-[#E8EDE7] hover:bg-[#724F38]",
                )}
              >
                {joinedCircles.includes(selected.id) ? "Joined ✓" : "Join circle"}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-[#0A2318]/8 pt-4">
            {[
              { label: "Members", value: selected.members.toString() },
              { label: "Next session", value: selected.time },
              { label: "Focus area", value: selected.focus.split(",")[0] },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase text-[#0A2318]/40">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#0A2318]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <ChallengeTracker circleId={selectedId} />

        <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
          <p className="text-xs font-bold uppercase text-[#8C6246]">Community feed</p>
          <h2 className="font-serif text-2xl text-[#0A2318]">What members shared</h2>
          <p className="mt-1 text-xs text-[#0A2318]/50">Posts are anonymous</p>
          <div className="mt-4">
            <CommunityFeed circleId={selectedId} />
          </div>
        </section>

        <CircleCheckIn circleId={selectedId} />
      </div>
    </div>
  );
}
