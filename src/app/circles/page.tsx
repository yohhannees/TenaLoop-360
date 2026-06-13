"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { circles as staticCircles } from "@/lib/circles";
import { Circle } from "@/lib/types";
import { CIRCLE_SESSIONS } from "@/lib/circle-content";
import MoodPulse from "@/components/circles/MoodPulse";
import CommunityFeed from "@/components/circles/CommunityFeed";
import ChallengeTracker from "@/components/circles/ChallengeTracker";
import CircleCheckIn from "@/components/circles/CircleCheckIn";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const GOLD = "#E0B362";
const BROWN = "#9A6B4A";

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
      .then((data: { circles?: CircleWithCount[] }) => { if (data.circles?.length) setCircles(data.circles); })
      .catch(() => {});
  }, []);

  const defaultId = linkedCircleId ?? joinedCircles[0] ?? circles[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);

  const selected = circles.find((c) => c.id === selectedId) ?? circles[0];
  const session = CIRCLE_SESSIONS.find((s) => s.circleId === selectedId);

  if (!selected) return null;

  const joined = joinedCircles.includes(selected.id);

  return (
    <div className="-mx-4 -my-6 min-h-screen px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-10" style={{ background: PAPER, color: INK }}>
      <div className="mx-auto max-w-6xl">

        {/* ── Masthead ── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color: `${INK}80` }}>
              TenaCircle &middot; You&apos;re not alone
            </p>
            <h1 className="mt-2 font-serif text-[2.6rem] leading-[1.05]">
              Find your <span className="italic">people.</span>
            </h1>
          </div>
          <p className="text-sm" style={{ color: `${INK}70` }}>
            <span className="font-semibold" style={{ color: INK }}>{joinedCircles.length}</span> joined ·{" "}
            <span className="font-semibold" style={{ color: INK }}>{circles.length}</span> circles
          </p>
        </div>

        {/* ── Body ── */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* LEFT */}
          <div className="grid content-start gap-5 lg:sticky lg:top-6">
            <section className="rounded-3xl border p-4" style={{ background: "#fff", borderColor: `${INK}12` }}>
              <p className="px-1 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: `${INK}55` }}>All circles</p>
              <div className="mt-3 grid gap-1">
                {circles.map((circle) => {
                  const isJoined = joinedCircles.includes(circle.id);
                  const active = circle.id === selectedId;
                  const sess = CIRCLE_SESSIONS.find((s) => s.circleId === circle.id);
                  return (
                    <button key={circle.id} type="button" onClick={() => setSelectedId(circle.id)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition"
                      style={{ background: active ? INK : "transparent", color: active ? PAPER : INK }}>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                        style={{ background: active ? "rgba(255,255,255,0.1)" : `${INK}0A` }}>
                        <Users size={14} style={{ color: active ? GOLD : `${INK}55` }} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{circle.name}</p>
                        <p className="text-[11px]" style={{ color: active ? `${PAPER}80` : `${INK}45` }}>
                          {circle.members} members
                          {sess?.isToday && <span className="ml-1.5 font-bold" style={{ color: active ? GOLD : SAGE }}>● Live</span>}
                        </p>
                      </div>
                      {isJoined && !active && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SAGE }} />}
                    </button>
                  );
                })}
              </div>
            </section>

            <MoodPulse key={selectedId} circleId={selectedId} />
          </div>

          {/* RIGHT */}
          <div className="grid content-start gap-5">

            {/* Active circle header — the one dark anchor */}
            <section className="overflow-hidden rounded-3xl p-6" style={{ background: INK, color: PAPER }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>Active circle</p>
                  <h2 className="mt-1.5 font-serif text-3xl">{selected.name}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: `${PAPER}99` }}>{selected.focus}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {session && (
                    <span className="rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={session.isToday ? { background: SAGE, color: "#fff" } : { background: "rgba(255,255,255,0.08)", color: `${PAPER}CC` }}>
                      {session.isToday ? "🔴 Live · " : "📅 "}{selected.time}
                    </span>
                  )}
                  <button type="button" onClick={() => joinCircle(selected.id)}
                    className="h-10 rounded-full px-5 text-sm font-semibold transition active:scale-95"
                    style={joined ? { border: "1px solid rgba(255,255,255,0.25)", color: `${PAPER}AA` } : { background: GOLD, color: INK }}>
                    {joined ? "Joined ✓" : "Join circle"}
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-6 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                {[
                  { label: "Members", value: selected.members.toString() },
                  { label: "Next session", value: selected.time },
                  { label: "Focus area", value: selected.focus.split(",")[0] },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: `${PAPER}66` }}>{label}</p>
                    <p className="mt-0.5 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <ChallengeTracker circleId={selectedId} />

            <section className="rounded-3xl border p-6" style={{ background: "#fff", borderColor: `${INK}12` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: BROWN }}>Community feed</p>
                  <h2 className="mt-1 font-serif text-2xl">What members shared</h2>
                </div>
                <span className="rounded-full px-3 py-1 text-[10px] font-semibold" style={{ background: `${INK}08`, color: `${INK}55` }}>Anonymous</span>
              </div>
              <div className="mt-5">
                <CommunityFeed circleId={selectedId} />
              </div>
            </section>

            <CircleCheckIn circleId={selectedId} />
          </div>
        </div>
      </div>
    </div>
  );
}
