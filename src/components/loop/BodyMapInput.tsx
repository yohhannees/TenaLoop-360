"use client";

import { BodyArea } from "@/lib/types";
import { cn } from "@/lib/utils";

const SEL   = "#8C6246";
const DEF   = "#D4C1A0";
const PASS  = "#E5EAE3";
const DARK  = "#0A2318";

interface Props {
  selected: BodyArea[];
  onToggle: (area: BodyArea) => void;
}

export default function BodyMapInput({ selected, onToggle }: Props) {
  const on  = (a: BodyArea) => selected.includes(a);
  const f   = (a: BodyArea) => on(a) ? SEL  : DEF;
  const fo  = (a: BodyArea) => on(a) ? 0.9  : 0.42;
  const sw  = (a: BodyArea) => on(a) ? 1.8  : 1;
  const sc  = (a: BodyArea) => on(a) ? SEL  : DARK;
  const so  = (a: BodyArea) => on(a) ? 0.8  : 0.15;

  const zone = (area: BodyArea) => ({
    fill:         f(area),
    fillOpacity:  fo(area),
    stroke:       sc(area),
    strokeOpacity:so(area),
    strokeWidth:  sw(area),
    className:    "cursor-pointer transition-all duration-150 hover:brightness-110",
    onClick:      () => onToggle(area),
  });

  return (
    <div className="flex flex-col items-center gap-3">
      {/* legend hint */}
      <p className="self-start text-[10px] font-bold uppercase tracking-wider text-[#0A2318]/40">
        Tap to mark discomfort
      </p>

      <div className="flex justify-center rounded-[1.25rem] border border-[#0A2318]/10 bg-[#E5EAE3] px-4 py-3">
        <svg
          viewBox="0 0 120 300"
          style={{ width: 108, height: 270 }}
          aria-label="Interactive body map"
        >
          {/* ── passive arm outlines ─────────────────────────── */}
          <rect x="13" y="66" width="17" height="74" rx="8.5"
            fill={PASS} stroke={DARK} strokeOpacity="0.12" />
          <rect x="90" y="66" width="17" height="74" rx="8.5"
            fill={PASS} stroke={DARK} strokeOpacity="0.12" />

          {/* ── passive leg outlines ─────────────────────────── */}
          <rect x="36" y="160" width="19" height="100" rx="9.5"
            fill={PASS} stroke={DARK} strokeOpacity="0.12" />
          <rect x="65" y="160" width="19" height="100" rx="9.5"
            fill={PASS} stroke={DARK} strokeOpacity="0.12" />

          {/* ── clickable torso zones ────────────────────────── */}

          {/* Chest */}
          <rect x="38" y="62" width="44" height="32" rx="5" {...zone("Chest")}>
            <title>Chest</title>
          </rect>

          {/* Stomach */}
          <rect x="38" y="94" width="44" height="28" rx="5" {...zone("Stomach")}>
            <title>Stomach</title>
          </rect>

          {/* Lower back */}
          <rect x="38" y="122" width="44" height="24" rx="5" {...zone("Lower back")}>
            <title>Lower back</title>
          </rect>

          {/* Hips */}
          <path d="M32,146 L88,146 L93,168 L27,168 Z" {...zone("Hips")}>
            <title>Hips</title>
          </path>

          {/* Shoulders — two caps, same area */}
          <ellipse cx="27" cy="74" rx="16" ry="12" {...zone("Shoulders")}>
            <title>Shoulders</title>
          </ellipse>
          <ellipse cx="93" cy="74" rx="16" ry="12" {...zone("Shoulders")}>
            <title>Shoulders</title>
          </ellipse>

          {/* Neck */}
          <rect x="51" y="45" width="18" height="17" rx="7" {...zone("Neck")}>
            <title>Neck</title>
          </rect>

          {/* Head */}
          <circle cx="60" cy="24" r="22" {...zone("Head")}>
            <title>Head</title>
          </circle>

          {/* Wrists/hands — end of each arm */}
          <ellipse cx="21" cy="149" rx="11" ry="10" {...zone("Wrists/hands")}>
            <title>Wrists/hands</title>
          </ellipse>
          <ellipse cx="99" cy="149" rx="11" ry="10" {...zone("Wrists/hands")}>
            <title>Wrists/hands</title>
          </ellipse>

          {/* Knees — on each leg */}
          <ellipse cx="45" cy="222" rx="12" ry="13" {...zone("Knees")}>
            <title>Knees</title>
          </ellipse>
          <ellipse cx="74" cy="222" rx="12" ry="13" {...zone("Knees")}>
            <title>Knees</title>
          </ellipse>

          {/* ── area labels (pointer-events: none) ───────────── */}
          {(["Head", "Neck", "Chest", "Stomach", "Lower back", "Hips"] as BodyArea[]).map((area) => {
            const coords: Record<string, [number, number, number]> = {
              Head:          [60, 24,  6],
              Neck:          [60, 54,  5],
              Chest:         [60, 78,  5.5],
              Stomach:       [60, 108, 5.5],
              "Lower back":  [60, 134, 5],
              Hips:          [60, 157, 5.5],
            };
            const [x, y, size] = coords[area];
            return (
              <text
                key={area}
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size}
                fontWeight="bold"
                fill={DARK}
                fillOpacity={on(area) ? 0.85 : 0.48}
                className="pointer-events-none select-none uppercase tracking-wider"
                style={{ letterSpacing: "0.06em" }}
              >
                {area === "Lower back" ? "LOWER\nBACK" : area.toUpperCase()}
              </text>
            );
          })}

          {/* "LOWER BACK" needs two lines — override with two texts */}
          <text x="60" y="131" textAnchor="middle" dominantBaseline="middle"
            fontSize="4.8" fontWeight="bold" fill={DARK}
            fillOpacity={on("Lower back") ? 0.85 : 0.48}
            className="pointer-events-none select-none"
            style={{ letterSpacing: "0.06em" }}
          >LOWER</text>
          <text x="60" y="137" textAnchor="middle" dominantBaseline="middle"
            fontSize="4.8" fontWeight="bold" fill={DARK}
            fillOpacity={on("Lower back") ? 0.85 : 0.48}
            className="pointer-events-none select-none"
            style={{ letterSpacing: "0.06em" }}
          >BACK</text>
        </svg>
      </div>

      {/* Selected area pills */}
      <div className="flex min-h-6 w-full flex-wrap gap-1.5">
        {selected.length === 0 ? (
          <span className="text-xs text-[#0A2318]/38">No area selected</span>
        ) : (
          selected.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => onToggle(area)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
                "bg-[#8C6246] text-[10px] font-bold uppercase tracking-wide text-[#E8EDE7]",
                "transition hover:bg-[#724F38]",
              )}
            >
              {area} ×
            </button>
          ))
        )}
      </div>
    </div>
  );
}
