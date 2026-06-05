"use client";

import type { ReactNode } from "react";
import type { ExerciseStep } from "@/lib/exercises";

const C = {
  skin: "#D4C1A0",
  shirt: "#8C6246",
  shirtDark: "#724F38",
  pants: "#0A2318",
  line: "#0A2318",
  paper: "#E8EDE7",
  floor: "rgba(10,35,24,0.16)",
  guide: "#D4C1A0",
};

const figureCss = `
.exercise-figure * {
  vector-effect: non-scaling-stroke;
}
.exercise-figure .pose-a {
  animation: figurePoseA 1.65s ease-in-out infinite;
}
.exercise-figure .pose-b {
  animation: figurePoseB 1.65s ease-in-out infinite;
}
.exercise-figure .pose-slow-a {
  animation: figurePoseA 2.5s ease-in-out infinite;
}
.exercise-figure .pose-slow-b {
  animation: figurePoseB 2.5s ease-in-out infinite;
}
.exercise-figure .guide-rise {
  animation: figureRise 1.65s ease-in-out infinite;
}
.exercise-figure .guide-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: figurePulse 2.2s ease-in-out infinite;
}
.exercise-figure .breath-one {
  transform-box: fill-box;
  transform-origin: center;
  animation: figureBreathOne 4s ease-in-out infinite;
}
.exercise-figure .breath-two {
  transform-box: fill-box;
  transform-origin: center;
  animation: figureBreathTwo 4s ease-in-out infinite;
}
.exercise-figure .float-z {
  animation: figureFloat 2.7s ease-out infinite;
}
.exercise-figure .lean-left {
  transform-origin: 120px 106px;
  animation: figureLeanLeft 3.2s ease-in-out infinite;
}
.exercise-figure .chest-open {
  transform-origin: 120px 88px;
  animation: figureChestOpen 2.8s ease-in-out infinite;
}
.exercise-figure .head-roll {
  transform-origin: 120px 50px;
  animation: figureHeadRoll 3s ease-in-out infinite;
}
.exercise-figure .shoulder-rise {
  animation: figureShoulderRise 1.7s ease-in-out infinite;
}
.exercise-figure .orbit-left {
  transform-box: fill-box;
  transform-origin: right center;
  animation: figureOrbit 1.7s linear infinite;
}
.exercise-figure .orbit-right {
  transform-box: fill-box;
  transform-origin: left center;
  animation: figureOrbit 1.7s linear infinite reverse;
}
@keyframes figurePoseA {
  0%, 38%, 100% { opacity: 1; transform: translateY(0); }
  50%, 86% { opacity: 0; transform: translateY(2px); }
}
@keyframes figurePoseB {
  0%, 38%, 100% { opacity: 0; transform: translateY(-2px); }
  50%, 86% { opacity: 1; transform: translateY(0); }
}
@keyframes figureRise {
  0%, 100% { opacity: 0.85; transform: translateY(8px); }
  45% { opacity: 0; transform: translateY(-12px); }
  55% { opacity: 0; transform: translateY(14px); }
}
@keyframes figurePulse {
  0%, 100% { opacity: 0.2; transform: scale(0.95); }
  50% { opacity: 0.5; transform: scale(1.08); }
}
@keyframes figureBreathOne {
  0%, 100% { opacity: 0.22; transform: scale(0.82); }
  50% { opacity: 0.06; transform: scale(1.45); }
}
@keyframes figureBreathTwo {
  0%, 100% { opacity: 0.34; transform: scale(0.9); }
  50% { opacity: 0.08; transform: scale(1.25); }
}
@keyframes figureFloat {
  0% { opacity: 0; transform: translateY(8px); }
  20% { opacity: 0.65; }
  100% { opacity: 0; transform: translateY(-28px); }
}
@keyframes figureLeanLeft {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-10deg); }
}
@keyframes figureChestOpen {
  0%, 100% { transform: scaleX(0.96); }
  50% { transform: scaleX(1.05); }
}
@keyframes figureHeadRoll {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(10deg); }
}
@keyframes figureShoulderRise {
  0%, 100% { transform: translateY(0); }
  45%, 55% { transform: translateY(-9px); }
}
@keyframes figureOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .exercise-figure * {
    animation: none !important;
  }
}
`;

type MovementKind =
  | "breath"
  | "chestOpen"
  | "childPose"
  | "circles"
  | "forwardFold"
  | "gluteBridge"
  | "hipLunge"
  | "jumpingJack"
  | "lunge"
  | "march"
  | "mountainClimber"
  | "neckRoll"
  | "palmRest"
  | "plank"
  | "pushup"
  | "quadStretch"
  | "rest"
  | "seatedFold"
  | "shoulderShrug"
  | "sideStretch"
  | "squat"
  | "twist"
  | "wallSit";

function getMovement(step: ExerciseStep): MovementKind {
  const name = step.name.toLowerCase();

  if (name.includes("jumping jack")) return "jumpingJack";
  if (name.includes("mountain climber")) return "mountainClimber";
  if (name.includes("push-up")) return "pushup";
  if (name.includes("glute bridge")) return "gluteBridge";
  if (name.includes("wall sit")) return "wallSit";
  if (name.includes("plank")) return "plank";
  if (name.includes("hip flexor lunge")) return "hipLunge";
  if (name.includes("lunge")) return "lunge";
  if (name.includes("squat")) return "squat";
  if (name.includes("high knees") || name.includes("march") || name.includes("speed step")) return "march";
  if (name.includes("quad")) return "quadStretch";
  if (name.includes("neck roll")) return "neckRoll";
  if (name.includes("shoulder roll") || name.includes("arm circle") || name.includes("wrist circle")) return "circles";
  if (name.includes("shoulder shrug")) return "shoulderShrug";
  if (name.includes("neck side") || name.includes("side stretch")) return "sideStretch";
  if (name.includes("spinal twist")) return "twist";
  if (name.includes("cross-body") || name.includes("chest opener")) return "chestOpen";
  if (name.includes("seated forward")) return "seatedFold";
  if (name.includes("forward fold")) return "forwardFold";
  if (name.includes("child")) return "childPose";
  if (name.includes("legs up")) return "rest";
  if (name.includes("eye palming")) return "palmRest";
  if (step.cue === "breathe") return "breath";
  if (step.cue === "rest") return "rest";
  if (step.cue === "spin") return "circles";
  if (step.cue === "stretch") return "sideStretch";
  if (step.cue === "hold") return "plank";
  return "squat";
}

function Shell({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid place-items-center">
      <style>{figureCss}</style>
      <svg
        viewBox="0 0 240 190"
        className={wide ? "exercise-figure h-[170px] w-[240px] max-w-full" : "exercise-figure h-[180px] w-[220px] max-w-full"}
        role="img"
        aria-label={`${label} movement guide`}
      >
        <line x1="34" y1="168" x2="206" y2="168" stroke={C.floor} strokeWidth="4" strokeLinecap="round" />
        {children}
      </svg>
    </div>
  );
}

function Head({ cx, cy, r = 13, className = "" }: { cx: number; cy: number; r?: number; className?: string }) {
  return (
    <g className={className}>
      <circle cx={cx} cy={cy} r={r} fill={C.skin} stroke={C.line} strokeWidth="2" />
      <path
        d={`M${cx - r + 2} ${cy - 5} Q${cx - r + 5} ${cy - r - 8} ${cx} ${cy - r - 5} Q${cx + r - 3} ${cy - r - 7} ${cx + r - 1} ${cy - 4} Q${cx + 3} ${cy - r + 2} ${cx - r + 2} ${cy - 5}Z`}
        fill={C.line}
      />
      <path d={`M${cx - 4} ${cy + 5} Q${cx} ${cy + 8} ${cx + 4} ${cy + 5}`} stroke={C.line} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function MotionArrow({ x = 120, y = 38 }: { x?: number; y?: number }) {
  return (
    <g className="guide-rise" opacity="0.8">
      <line x1={x} y1={y + 22} x2={x} y2={y} stroke={C.guide} strokeWidth="3" strokeDasharray="5 4" strokeLinecap="round" />
      <path d={`M${x - 7} ${y + 8} L${x} ${y} L${x + 7} ${y + 8}`} fill="none" stroke={C.guide} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function SquatFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <MotionArrow />
      <g className="pose-a">
        <Head cx={120} cy={48} />
        <rect x="103" y="64" width="34" height="44" rx="13" fill={C.shirt} />
        <path d="M101 76 L82 104" stroke={C.shirt} strokeWidth="11" strokeLinecap="round" />
        <path d="M139 76 L158 104" stroke={C.shirt} strokeWidth="11" strokeLinecap="round" />
        <path d="M111 108 L106 154" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
        <path d="M129 108 L134 154" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="104" cy="162" rx="15" ry="5" fill={C.shirtDark} />
        <ellipse cx="136" cy="162" rx="15" ry="5" fill={C.shirtDark} />
      </g>
      <g className="pose-b">
        <Head cx={120} cy={70} />
        <rect x="103" y="86" width="34" height="34" rx="13" fill={C.shirt} />
        <path d="M102 96 L72 96" stroke={C.shirt} strokeWidth="11" strokeLinecap="round" />
        <path d="M138 96 L168 96" stroke={C.shirt} strokeWidth="11" strokeLinecap="round" />
        <path d="M110 120 L84 142 L104 160" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M130 120 L156 142 L136 160" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="96" cy="164" rx="15" ry="5" fill={C.shirtDark} />
        <ellipse cx="144" cy="164" rx="15" ry="5" fill={C.shirtDark} />
      </g>
    </Shell>
  );
}

function MarchFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <g className="pose-a">
        <Head cx={120} cy={48} />
        <rect x="104" y="64" width="32" height="42" rx="12" fill={C.shirt} />
        <path d="M104 72 L82 100" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M136 72 L154 48" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M111 106 L92 124 L84 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M130 106 L154 132 L158 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="84" cy="166" rx="14" ry="5" fill={C.shirtDark} />
        <ellipse cx="158" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      </g>
      <g className="pose-b">
        <Head cx={120} cy={48} />
        <rect x="104" y="64" width="32" height="42" rx="12" fill={C.shirt} />
        <path d="M104 72 L86 48" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M136 72 L158 100" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M111 106 L86 132 L82 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M130 106 L150 124 L158 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="82" cy="166" rx="14" ry="5" fill={C.shirtDark} />
        <ellipse cx="158" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      </g>
    </Shell>
  );
}

function JumpingJackFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <path d="M67 80 L47 62 M47 62 L54 61 M47 62 L49 69" stroke={C.guide} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M173 80 L193 62 M193 62 L186 61 M193 62 L191 69" stroke={C.guide} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <g className="pose-a">
        <Head cx={120} cy={48} />
        <rect x="104" y="64" width="32" height="42" rx="12" fill={C.shirt} />
        <path d="M104 76 L84 105" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M136 76 L156 105" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M112 106 L108 160" stroke={C.pants} strokeWidth="12" strokeLinecap="round" />
        <path d="M128 106 L132 160" stroke={C.pants} strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="108" cy="166" rx="14" ry="5" fill={C.shirtDark} />
        <ellipse cx="132" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      </g>
      <g className="pose-b">
        <Head cx={120} cy={48} />
        <rect x="104" y="64" width="32" height="42" rx="12" fill={C.shirt} />
        <path d="M104 72 L72 42" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M136 72 L168 42" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M112 106 L82 160" stroke={C.pants} strokeWidth="12" strokeLinecap="round" />
        <path d="M128 106 L158 160" stroke={C.pants} strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="82" cy="166" rx="14" ry="5" fill={C.shirtDark} />
        <ellipse cx="158" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      </g>
    </Shell>
  );
}

function PushupFigure({ label }: { label: string }) {
  return (
    <Shell label={label} wide>
      <g className="pose-slow-a">
        <Head cx={62} cy={84} r={12} />
        <path d="M76 88 L132 84 L178 105" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M132 84 L178 104" stroke={C.pants} strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M82 96 L82 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M103 94 L103 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="184" cy="158" rx="15" ry="5" fill={C.shirtDark} />
      </g>
      <g className="pose-slow-b">
        <Head cx={62} cy={118} r={12} />
        <path d="M76 122 L132 118 L178 130" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M132 118 L178 130" stroke={C.pants} strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M82 128 L72 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M103 126 L113 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="184" cy="158" rx="15" ry="5" fill={C.shirtDark} />
      </g>
    </Shell>
  );
}

function MountainClimberFigure({ label }: { label: string }) {
  return (
    <Shell label={label} wide>
      <Head cx={58} cy={80} r={12} />
      <path d="M72 86 L126 88 L174 106" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" />
      <path d="M126 88 L174 106" stroke={C.pants} strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M80 94 L74 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M98 94 L104 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <g className="pose-a">
        <path d="M136 104 L112 132 L98 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M154 110 L184 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" />
      </g>
      <g className="pose-b">
        <path d="M136 104 L92 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M154 110 L170 134 L184 160" stroke={C.pants} strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Shell>
  );
}

function PlankFigure({ label }: { label: string }) {
  return (
    <Shell label={label} wide>
      <ellipse className="guide-pulse" cx="122" cy="116" rx="76" ry="28" fill="none" stroke={C.guide} strokeWidth="3" />
      <Head cx={58} cy={86} r={12} />
      <path d="M72 92 L128 92 L180 112" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" />
      <path d="M128 92 L180 112" stroke={C.pants} strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M78 100 L72 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M98 100 L104 150" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="185" cy="160" rx="14" ry="5" fill={C.shirtDark} />
    </Shell>
  );
}

function WallSitFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <line x1="76" y1="40" x2="76" y2="168" stroke={C.floor} strokeWidth="5" strokeLinecap="round" />
      <Head cx={100} cy={62} />
      <rect x="84" y="78" width="34" height="44" rx="12" fill={C.shirt} />
      <path d="M104 122 L144 122 L154 160" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M90 122 L132 122 L138 160" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M86 90 L68 120" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M118 90 L136 120" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="144" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      <ellipse cx="160" cy="166" rx="14" ry="5" fill={C.shirtDark} />
    </Shell>
  );
}

function LungeFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <g className="pose-slow-a">
        <Head cx={116} cy={46} />
        <rect x="100" y="62" width="34" height="44" rx="12" fill={C.shirt} />
        <path d="M108 106 L72 138 L60 162" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M128 106 L164 130 L180 162" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="pose-slow-b">
        <Head cx={116} cy={58} />
        <rect x="100" y="74" width="34" height="38" rx="12" fill={C.shirt} />
        <path d="M108 112 L76 130 L58 162" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M128 112 L162 140 L176 162" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="58" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      <ellipse cx="180" cy="166" rx="14" ry="5" fill={C.shirtDark} />
    </Shell>
  );
}

function HipLungeFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <Head cx={112} cy={48} />
      <rect x="96" y="64" width="34" height="44" rx="12" fill={C.shirt} />
      <path d="M101 108 L68 134 L58 162" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M125 108 L158 142 L184 162" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M96 80 L72 116" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M130 80 L154 116" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path className="guide-pulse" d="M136 96 Q150 118 160 146" stroke={C.guide} strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="58" cy="166" rx="14" ry="5" fill={C.shirtDark} />
      <ellipse cx="184" cy="166" rx="14" ry="5" fill={C.shirtDark} />
    </Shell>
  );
}

function GluteBridgeFigure({ label }: { label: string }) {
  return (
    <Shell label={label} wide>
      <g className="pose-slow-a">
        <Head cx={52} cy={132} r={12} />
        <path d="M66 138 L118 138 L168 138" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" />
        <path d="M118 138 L154 118 L176 160" stroke={C.pants} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="pose-slow-b">
        <Head cx={52} cy={132} r={12} />
        <path d="M66 138 L110 104 L154 118" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M110 104 L154 118 L176 160" stroke={C.pants} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <ellipse cx="180" cy="166" rx="14" ry="5" fill={C.shirtDark} />
    </Shell>
  );
}

function QuadStretchFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <Head cx={116} cy={46} />
      <rect x="100" y="62" width="34" height="44" rx="12" fill={C.shirt} />
      <path d="M112 106 L108 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 106 L158 126 L140 152" stroke={C.pants} strokeWidth="13" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M100 80 L72 112" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M134 82 L154 128" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="108" cy="166" rx="14" ry="5" fill={C.shirtDark} />
    </Shell>
  );
}

function SideStretchFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <g className="lean-left">
        <Head cx={120} cy={46} />
        <rect x="104" y="62" width="34" height="44" rx="12" fill={C.shirt} />
        <path d="M136 70 L162 34" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M104 78 L84 112" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M113 106 L106 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
        <path d="M129 106 L136 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      </g>
      <path d="M164 32 Q188 58 178 98" stroke={C.guide} strokeWidth="3" strokeDasharray="5 5" fill="none" strokeLinecap="round" opacity="0.7" />
    </Shell>
  );
}

function TwistFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <path d="M86 92 Q120 60 154 92" stroke={C.guide} strokeWidth="3" strokeDasharray="5 5" fill="none" strokeLinecap="round" />
      <Head cx={120} cy={58} />
      <g className="pose-slow-a">
        <rect x="102" y="76" width="36" height="42" rx="12" fill={C.shirt} />
        <path d="M104 90 L78 126" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M136 90 L162 126" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      </g>
      <g className="pose-slow-b">
        <path d="M96 78 L136 76 L144 118 L104 120Z" fill={C.shirt} />
        <path d="M102 90 L162 124" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M140 90 L82 124" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      </g>
      <path d="M86 138 Q120 124 154 138" stroke={C.pants} strokeWidth="14" fill="none" strokeLinecap="round" />
    </Shell>
  );
}

function ChestOpenFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <Head cx={120} cy={48} />
      <g className="chest-open">
        <rect x="104" y="64" width="34" height="44" rx="12" fill={C.shirt} />
        <path d="M104 76 L72 96" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
        <path d="M136 76 L168 96" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      </g>
      <path d="M112 108 L108 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 108 L132 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M92 68 Q120 52 148 68" stroke={C.guide} strokeWidth="3" strokeDasharray="5 5" fill="none" opacity="0.7" />
    </Shell>
  );
}

function ForwardFoldFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <path d="M112 92 L108 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 92 L132 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M116 92 Q92 112 92 138" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" />
      <Head cx={90} cy={142} r={12} />
      <path d="M98 120 L78 156" stroke={C.shirt} strokeWidth="9" strokeLinecap="round" />
      <path d="M112 116 L128 156" stroke={C.shirt} strokeWidth="9" strokeLinecap="round" />
    </Shell>
  );
}

function SeatedFoldFigure({ label }: { label: string }) {
  return (
    <Shell label={label} wide>
      <path d="M72 144 L184 144" stroke={C.pants} strokeWidth="15" strokeLinecap="round" />
      <path d="M84 132 Q112 112 140 136" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" />
      <Head cx={146} cy={138} r={12} />
      <path d="M116 128 L178 146" stroke={C.shirt} strokeWidth="9" strokeLinecap="round" />
    </Shell>
  );
}

function ChildPoseFigure({ label }: { label: string }) {
  return (
    <Shell label={label} wide>
      <path d="M72 146 Q104 126 136 146" stroke={C.pants} strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M92 132 Q128 108 168 132" stroke={C.shirt} strokeWidth="18" fill="none" strokeLinecap="round" />
      <Head cx={172} cy={138} r={12} />
      <path d="M150 134 L208 148" stroke={C.shirt} strokeWidth="9" strokeLinecap="round" />
      <path d="M146 126 L206 132" stroke={C.shirt} strokeWidth="9" strokeLinecap="round" />
      <circle className="breath-two" cx="124" cy="112" r="38" fill="none" stroke={C.guide} strokeWidth="3" />
    </Shell>
  );
}

function ShoulderShrugFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <Head cx={120} cy={48} />
      <rect x="104" y="68" width="34" height="42" rx="12" fill={C.shirt} />
      <g className="shoulder-rise">
        <path d="M104 72 L78 98" stroke={C.shirt} strokeWidth="12" strokeLinecap="round" />
        <path d="M136 72 L162 98" stroke={C.shirt} strokeWidth="12" strokeLinecap="round" />
      </g>
      <path d="M112 110 L108 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 110 L132 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <MotionArrow x={82} y={68} />
      <MotionArrow x={158} y={68} />
    </Shell>
  );
}

function CirclesFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <Head cx={120} cy={48} />
      <rect x="104" y="64" width="34" height="44" rx="12" fill={C.shirt} />
      <g transform="translate(104 78)">
        <path className="orbit-left" d="M0 0 L-34 4" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      </g>
      <g transform="translate(138 78)">
        <path className="orbit-right" d="M0 0 L34 4" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      </g>
      <path d="M72 74 A30 30 0 1 1 98 42" stroke={C.guide} strokeWidth="3" strokeDasharray="5 5" fill="none" opacity="0.75" />
      <path d="M168 74 A30 30 0 1 0 142 42" stroke={C.guide} strokeWidth="3" strokeDasharray="5 5" fill="none" opacity="0.75" />
      <path d="M112 108 L108 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 108 L132 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
    </Shell>
  );
}

function NeckRollFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <g className="head-roll">
        <Head cx={120} cy={48} />
      </g>
      <rect x="104" y="64" width="34" height="44" rx="12" fill={C.shirt} />
      <path d="M104 78 L82 112" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M136 78 L158 112" stroke={C.shirt} strokeWidth="10" strokeLinecap="round" />
      <path d="M94 42 A28 28 0 1 1 145 42" stroke={C.guide} strokeWidth="3" strokeDasharray="5 5" fill="none" opacity="0.75" />
      <path d="M112 108 L108 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
      <path d="M128 108 L132 160" stroke={C.pants} strokeWidth="13" strokeLinecap="round" />
    </Shell>
  );
}

function BreatheFigure({ label }: { label: string }) {
  return (
    <Shell label={label}>
      <circle className="breath-one" cx="120" cy="108" r="58" fill="none" stroke={C.guide} strokeWidth="3" />
      <circle className="breath-two" cx="120" cy="108" r="42" fill="none" stroke={C.guide} strokeWidth="3" />
      <Head cx={120} cy={72} />
      <rect x="104" y="88" width="34" height="38" rx="12" fill={C.shirt} />
      <path d="M96 140 Q120 126 144 140" stroke={C.pants} strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M104 108 Q90 126 82 142" stroke={C.shirt} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M136 108 Q150 126 158 142" stroke={C.shirt} strokeWidth="9" fill="none" strokeLinecap="round" />
    </Shell>
  );
}

function RestFigure({ label, palms = false }: { label: string; palms?: boolean }) {
  return (
    <Shell label={label} wide>
      <text className="float-z" x="166" y="64" fill={C.shirt} fontSize="18" fontWeight="700">z</text>
      <text className="float-z" x="184" y="52" fill={C.shirt} fontSize="13" fontWeight="700" style={{ animationDelay: "0.7s" }}>z</text>
      <Head cx={58} cy={122} r={12} />
      <path d="M72 128 L124 130 L178 138" stroke={C.shirt} strokeWidth="17" fill="none" strokeLinecap="round" />
      <path d="M124 130 L178 138" stroke={C.pants} strokeWidth="15" fill="none" strokeLinecap="round" />
      {palms ? (
        <>
          <circle cx="52" cy="116" r="7" fill={C.skin} />
          <circle cx="64" cy="116" r="7" fill={C.skin} />
        </>
      ) : (
        <path d="M82 132 L112 152" stroke={C.shirt} strokeWidth="9" strokeLinecap="round" />
      )}
      <rect x="34" y="136" width="40" height="14" rx="8" fill={C.paper} stroke={C.floor} />
    </Shell>
  );
}

export default function ExerciseFigure({ step }: { step: ExerciseStep }) {
  const movement = getMovement(step);
  const label = step.name;

  if (movement === "breath") return <BreatheFigure label={label} />;
  if (movement === "chestOpen") return <ChestOpenFigure label={label} />;
  if (movement === "childPose") return <ChildPoseFigure label={label} />;
  if (movement === "circles") return <CirclesFigure label={label} />;
  if (movement === "forwardFold") return <ForwardFoldFigure label={label} />;
  if (movement === "gluteBridge") return <GluteBridgeFigure label={label} />;
  if (movement === "hipLunge") return <HipLungeFigure label={label} />;
  if (movement === "jumpingJack") return <JumpingJackFigure label={label} />;
  if (movement === "lunge") return <LungeFigure label={label} />;
  if (movement === "march") return <MarchFigure label={label} />;
  if (movement === "mountainClimber") return <MountainClimberFigure label={label} />;
  if (movement === "neckRoll") return <NeckRollFigure label={label} />;
  if (movement === "palmRest") return <RestFigure label={label} palms />;
  if (movement === "plank") return <PlankFigure label={label} />;
  if (movement === "pushup") return <PushupFigure label={label} />;
  if (movement === "quadStretch") return <QuadStretchFigure label={label} />;
  if (movement === "rest") return <RestFigure label={label} />;
  if (movement === "seatedFold") return <SeatedFoldFigure label={label} />;
  if (movement === "shoulderShrug") return <ShoulderShrugFigure label={label} />;
  if (movement === "sideStretch") return <SideStretchFigure label={label} />;
  if (movement === "twist") return <TwistFigure label={label} />;
  if (movement === "wallSit") return <WallSitFigure label={label} />;
  return <SquatFigure label={label} />;
}
