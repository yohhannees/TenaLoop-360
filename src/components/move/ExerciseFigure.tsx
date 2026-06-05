"use client";

import type { ExerciseCue } from "@/lib/exercises";

/* ── brand palette ───────────────────────────────────────── */
const C = {
  skin: "#D4C1A0",
  top:  "#8C6246",
  legs: "#0A2318",
  shoe: "#724F38",
  hair: "#0A2318",
  dot:  "#0A2318",
};

/* ── shared head + face ──────────────────────────────────── */
function Face({ cx = 60, cy = 24, r = 16 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={C.skin} />
      {/* hair */}
      <path
        d={`M${cx - r + 2},${cy - 3} Q${cx - r + 3},${cy - r - 5} ${cx},${cy - r - 3} Q${cx + r - 3},${cy - r - 5} ${cx + r - 2},${cy - 3} Q${cx + r - 7},${cy - r + 5} ${cx},${cy - r + 3} Q${cx - r + 7},${cy - r + 5} ${cx - r + 2},${cy - 3}Z`}
        fill={C.hair}
      />
      {/* eyes */}
      <circle cx={cx - 5} cy={cy - 1} r={2.5} fill={C.dot} />
      <circle cx={cx + 5} cy={cy - 1} r={2.5} fill={C.dot} />
      <circle cx={cx - 4}  cy={cy - 2} r={1}   fill="white" />
      <circle cx={cx + 6}  cy={cy - 2} r={1}   fill="white" />
      {/* smile */}
      <path d={`M${cx - 5},${cy + 5} Q${cx},${cy + 9} ${cx + 5},${cy + 5}`}
        stroke={C.dot} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  );
}

/* ── standing body helper ────────────────────────────────── */
function StandingBody({ y = 0, armsFwd = false }: { y?: number; armsFwd?: boolean }) {
  return (
    <>
      {/* torso */}
      <rect x="46" y={42 + y} width="28" height="28" rx="8" fill={C.top} />
      {/* arms */}
      {armsFwd ? (
        <>
          <rect x="20" y={46 + y} width="26" height="10" rx="5" fill={C.top} />
          <rect x="74" y={46 + y} width="26" height="10" rx="5" fill={C.top} />
        </>
      ) : (
        <>
          <rect x="32" y={44 + y} width="14" height="24" rx="7" fill={C.top} />
          <rect x="74" y={44 + y} width="14" height="24" rx="7" fill={C.top} />
        </>
      )}
      {/* legs */}
      <rect x="47" y={68 + y} width="11" height="34" rx="5" fill={C.legs} />
      <rect x="62" y={68 + y} width="11" height="34" rx="5" fill={C.legs} />
      {/* feet */}
      <ellipse cx="52"  cy={103 + y} rx="10" ry="4.5" fill={C.shoe} />
      <ellipse cx="68"  cy={103 + y} rx="10" ry="4.5" fill={C.shoe} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. BOUNCE — squat up / squat down cross-fade
═══════════════════════════════════════════════════════════ */
function SquatFigure() {
  return (
    <svg viewBox="0 0 120 150" width="140" height="150" aria-hidden>
      {/* up arrow */}
      <g style={{ animation: "fig-arrow-up 1.5s ease-in-out infinite" }}>
        <path d="M60,5 L54,15 M60,5 L66,15" stroke={C.top} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <line x1="60" y1="5" x2="60" y2="20" stroke={C.top} strokeWidth="1.8" strokeDasharray="3 2" strokeLinecap="round" />
      </g>

      {/* POSE A — standing (top of squat) */}
      <g style={{ animation: "fig-pose-a 1.5s ease-in-out infinite" }}>
        <Face cx={60} cy={34} />
        <StandingBody y={0} />
      </g>

      {/* POSE B — squatting (bottom) */}
      <g style={{ animation: "fig-pose-b 1.5s ease-in-out infinite" }}>
        <Face cx={60} cy={48} />
        {/* torso lower */}
        <rect x="46" y="64" width="28" height="22" rx="8" fill={C.top} />
        {/* arms forward for balance */}
        <rect x="18" y="68" width="28" height="10" rx="5" fill={C.top} />
        <rect x="74" y="68" width="28" height="10" rx="5" fill={C.top} />
        {/* bent legs as V-paths */}
        <path d="M50,85 L38,110 L54,135"   stroke={C.legs} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M70,85 L82,110 L66,135"   stroke={C.legs} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="47" cy="138" rx="10" ry="4.5" fill={C.shoe} />
        <ellipse cx="73" cy="138" rx="10" ry="4.5" fill={C.shoe} />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. HOLD — plank position + pulsing ring
═══════════════════════════════════════════════════════════ */
function PlankFigure() {
  return (
    <svg viewBox="0 0 200 90" width="200" height="90" aria-hidden>
      {/* pulsing ring behind figure */}
      <ellipse cx="100" cy="45" rx="76" ry="28"
        fill="none" stroke={C.top} strokeWidth="3"
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: "fig-b-inner 2s ease-in-out infinite" }} />

      {/* plank body — horizontal */}
      {/* feet/toes */}
      <ellipse cx="168" cy="56" rx="9" ry="5" fill={C.shoe} />
      <ellipse cx="152" cy="56" rx="9" ry="5" fill={C.shoe} />
      {/* legs horizontal */}
      <rect x="128" y="40" width="40" height="12" rx="6" fill={C.legs} />
      {/* torso */}
      <rect x="80"  y="36" width="50" height="14" rx="7" fill={C.top} />
      {/* arms straight down to floor */}
      <rect x="60"  y="44" width="12" height="22" rx="6" fill={C.top} />
      <rect x="80"  y="44" width="12" height="22" rx="6" fill={C.top} />
      {/* neck */}
      <rect x="72"  y="32" width="8"  height="8"  rx="4" fill={C.skin} />
      {/* head */}
      <Face cx={60} cy={26} r={15} />

      {/* "Hold" label under figure */}
      <text x="100" y="84" textAnchor="middle" fontSize="10" fill={C.top} fontWeight="bold" letterSpacing="1">
        PLANK HOLD
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. STRETCH — side stretch with animated arm
═══════════════════════════════════════════════════════════ */
function StretchFigure() {
  return (
    <svg viewBox="0 0 140 160" width="140" height="160" aria-hidden>
      <Face cx={68} cy={26} />
      {/* tilted body */}
      <rect x="54" y="42" width="28" height="28" rx="8" fill={C.top}
        style={{ transformBox: "fill-box", transformOrigin: "center top", transform: "rotate(8deg)" }} />
      {/* arm raised — animated */}
      <rect x="70" y="18" width="12" height="32" rx="6" fill={C.top}
        style={{
          transformBox: "fill-box", transformOrigin: "center bottom",
          animation: "fig-reach 3s ease-in-out infinite",
        }} />
      {/* other arm on hip */}
      <rect x="34" y="50" width="20" height="10" rx="5" fill={C.top} />
      {/* legs */}
      <rect x="55" y="68" width="11" height="36" rx="5" fill={C.legs} />
      <rect x="70" y="68" width="11" height="36" rx="5" fill={C.legs} />
      <ellipse cx="60" cy="106" rx="10" ry="4.5" fill={C.shoe} />
      <ellipse cx="76" cy="106" rx="10" ry="4.5" fill={C.shoe} />
      {/* stretch arc dotted line */}
      <path d="M82,18 Q110,10 112,50"
        stroke={C.top} strokeWidth="1.5" strokeDasharray="4 3" fill="none" strokeLinecap="round"
        style={{ animation: "fig-reach 3s ease-in-out infinite" }} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. SPIN — shoulder rolls with orbiting arms
═══════════════════════════════════════════════════════════ */
function SpinFigure() {
  return (
    <svg viewBox="0 0 120 130" width="130" height="130" aria-hidden>
      <Face cx={60} cy={26} />
      {/* torso */}
      <rect x="46" y="42" width="28" height="28" rx="8" fill={C.top} />
      {/* LEFT arm orbiting — pivot at shoulder (46,50) */}
      <g transform="translate(46,50)">
        <rect x="-14" y="-6" width="14" height="24" rx="7" fill={C.top}
          style={{
            transformBox: "fill-box", transformOrigin: "right center",
            animation: "fig-orbit 1.6s linear infinite",
          }} />
      </g>
      {/* RIGHT arm orbiting — pivot at shoulder (74,50) */}
      <g transform="translate(74,50)">
        <rect x="0" y="-6" width="14" height="24" rx="7" fill={C.top}
          style={{
            transformBox: "fill-box", transformOrigin: "left center",
            animation: "fig-orbit 1.6s linear infinite reverse",
          }} />
      </g>
      {/* legs */}
      <rect x="47" y="68" width="11" height="32" rx="5" fill={C.legs} />
      <rect x="62" y="68" width="11" height="32" rx="5" fill={C.legs} />
      <ellipse cx="52" cy="102" rx="9" ry="4" fill={C.shoe} />
      <ellipse cx="68" cy="102" rx="9" ry="4" fill={C.shoe} />
      {/* circular motion arrow */}
      <path d="M30,52 Q22,35 38,28 Q52,22 58,32"
        stroke={C.top} strokeWidth="2" strokeDasharray="3 2" fill="none" strokeLinecap="round"
        markerEnd="none" />
      <path d="M88,52 Q96,35 80,28 Q66,22 62,32"
        stroke={C.top} strokeWidth="2" strokeDasharray="3 2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. BREATHE — seated figure with expanding rings
═══════════════════════════════════════════════════════════ */
function BreatheFigure() {
  return (
    <svg viewBox="0 0 140 160" width="140" height="160" aria-hidden>
      {/* outer ring */}
      <circle cx="70" cy="92" r="50" fill="none" stroke={C.top} strokeWidth="2"
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: "fig-b-outer 4s ease-in-out infinite" }} />
      {/* inner ring */}
      <circle cx="70" cy="92" r="34" fill="none" stroke={C.top} strokeWidth="2.5"
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: "fig-b-inner 4s ease-in-out infinite" }} />

      {/* seated figure */}
      {/* cross-legged base */}
      <path d="M42,118 Q55,108 70,110 Q85,108 98,118 Q85,124 70,122 Q55,124 42,118Z" fill={C.legs} />
      {/* feet */}
      <ellipse cx="45"  cy="120" rx="9" ry="5" fill={C.shoe} />
      <ellipse cx="95"  cy="120" rx="9" ry="5" fill={C.shoe} />
      {/* torso */}
      <rect x="56" y="82" width="28" height="30" rx="8" fill={C.top} />
      {/* hands on knees */}
      <circle cx="48"  cy="114" r="6" fill={C.skin} />
      <circle cx="92"  cy="114" r="6" fill={C.skin} />
      {/* arms */}
      <path d="M56,98 Q50,108 48,114" stroke={C.top} strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M84,98 Q90,108 92,114" stroke={C.top} strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* head — peaceful eyes closed */}
      <circle cx="70" cy="64" r="16" fill={C.skin} />
      <path d={`M42,58 Q45,46 70,44 Q95,46 98,58 Q90,50 70,50 Q50,50 42,58Z`} fill={C.hair} />
      {/* closed eyes */}
      <path d="M63,63 Q65,66 67,63" stroke={C.dot} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M73,63 Q75,66 77,63" stroke={C.dot} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* serene smile */}
      <path d="M65,72 Q70,76 75,72" stroke={C.dot} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. REST — lying figure with floating z's
═══════════════════════════════════════════════════════════ */
function RestFigure() {
  return (
    <svg viewBox="0 0 180 100" width="180" height="100" aria-hidden>
      {/* floating Z particles */}
      {[
        { x: 114, delay: "0s",    size: 13 },
        { x: 124, delay: "0.8s",  size: 10 },
        { x: 134, delay: "1.6s",  size: 8  },
      ].map(({ x, delay, size }) => (
        <text key={x} x={x} y="30" fontSize={size} fill={C.top} fontWeight="bold" opacity="0"
          style={{ animation: `fig-float 2.4s ease-out ${delay} infinite` }}>
          z
        </text>
      ))}

      {/* lying figure */}
      {/* feet */}
      <ellipse cx="160" cy="66" rx="10" ry="5" fill={C.shoe} />
      {/* legs */}
      <rect x="110" y="56" width="50" height="12" rx="6" fill={C.legs} />
      {/* torso */}
      <rect x="65"  y="52" width="48" height="14" rx="7" fill={C.top} />
      {/* arm resting along body */}
      <rect x="52"  y="60" width="30" height="10" rx="5" fill={C.top} />
      {/* neck */}
      <rect x="57"  y="48" width="8"  height="7"  rx="3" fill={C.skin} />
      {/* head on side */}
      <circle cx="44" cy="50" r="15" fill={C.skin} />
      <path d={`M30,42 Q33,32 44,30 Q55,32 58,42 Q52,36 44,36 Q36,36 30,42Z`} fill={C.hair} />
      {/* side-facing eyes — just one visible */}
      <path d="M40,49 Q42,52 44,49" stroke={C.dot} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* small smile */}
      <path d="M42,56 Q44,59 47,57" stroke={C.dot} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* pillow */}
      <rect x="20" y="58" width="30" height="12" rx="8" fill="#E8EDE7" stroke={C.dot} strokeWidth="1" strokeOpacity="0.2" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main export
═══════════════════════════════════════════════════════════ */
export default function ExerciseFigure({ cue }: { cue: ExerciseCue }) {
  return (
    <div className="grid place-items-center">
      {cue === "bounce"  && <SquatFigure />}
      {cue === "hold"    && <PlankFigure />}
      {cue === "stretch" && <StretchFigure />}
      {cue === "spin"    && <SpinFigure />}
      {cue === "breathe" && <BreatheFigure />}
      {cue === "rest"    && <RestFigure />}
    </div>
  );
}
