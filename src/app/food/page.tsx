"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Camera, Check, ChevronDown, Droplet, Minus, Plus, Sparkles, X, Zap,
} from "lucide-react";
import { getFoodSignal, foodLibrary } from "@/lib/foods";
import { getMealNutrients } from "@/lib/nutrients";
import { MEAL_PLANS, MealPlanMode } from "@/lib/meal-plans";
import { useWellness } from "@/context/WellnessContext";

// ── Palette ──────────────────────────────────────────────────────────────────
const INK = "#211D17";
const PAPER = "#F6F1E8";
const WATER = "#3E6B86";

function tone(score: number) {
  if (score >= 75) return { hex: "#5E7A5C", soft: "#E7EEE3", name: "Nourishing" };
  if (score >= 55) return { hex: "#C2913C", soft: "#F5EBD4", name: "Balanced" };
  return { hex: "#C05E3A", soft: "#F6E2D7", name: "Go gentle" };
}

const SLOTS = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;

const MACROS = [
  { key: "protein", label: "Protein", hex: "#5E7A5C", goodHigh: true },
  { key: "carbs",   label: "Carbs",   hex: "#C2913C", goodHigh: false },
  { key: "fat",     label: "Fat",     hex: "#C05E3A", goodHigh: false },
  { key: "fiber",   label: "Fiber",   hex: "#3E6B86", goodHigh: true },
  { key: "sodium",  label: "Sodium",  hex: "#9A6B4A", goodHigh: false },
] as const;

const PLAN_TABS: { mode: MealPlanMode; label: string }[] = [
  { mode: "regular", label: "Balanced" },
  { mode: "fasting", label: "Fasting" },
  { mode: "bp", label: "BP" },
  { mode: "glucose", label: "Glucose" },
  { mode: "budget", label: "Budget" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function currentSlot(): (typeof SLOTS)[number] {
  const h = new Date().getHours();
  if (h < 11) return "Breakfast";
  if (h < 15) return "Lunch";
  if (h < 18) return "Snack";
  return "Dinner";
}

export default function FoodPage() {
  const { checkIn, logMeal, logHydration } = useWellness();

  const [draft, setDraft] = useState(checkIn.meal || "");
  const [committed, setCommitted] = useState(checkIn.meal || "Shiro, gomen, one injera");
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>(currentSlot());
  const [photo, setPhoto] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [water, setWater] = useState(checkIn.water || 0);
  const [planMode, setPlanMode] = useState<MealPlanMode>(
    checkIn.fasting ? "fasting" : checkIn.bpFocus ? "bp" : checkIn.glucoseFocus ? "glucose" : "regular",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const signal = useMemo(() => getFoodSignal(committed), [committed]);
  const nutrients = useMemo(() => getMealNutrients(committed), [committed]);
  const t = tone(signal.score);

  const matches = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return [];
    return foodLibrary.filter((f) => f.label.toLowerCase().includes(q)).slice(0, 5);
  }, [draft]);

  const showCustom = draft.trim().length > 2 && matches.length === 0;
  const plan = MEAL_PLANS.find((p) => p.mode === planMode) ?? MEAL_PLANS[0];

  // energy macro split for the composition bar
  const energy = nutrients.protein + nutrients.carbs + nutrients.fat || 1;
  const split = {
    protein: (nutrients.protein / energy) * 100,
    carbs: (nutrients.carbs / energy) * 100,
    fat: (nutrients.fat / energy) * 100,
  };

  function commit(text: string) {
    const value = text.trim();
    if (!value) return;
    setCommitted(value);
    setDraft(value);
    setLogged(false);
    inputRef.current?.blur();
  }

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleLog() {
    await logMeal(committed, slot, photo);
    setLogged(true);
  }

  function setCups(n: number) {
    const next = Math.max(0, Math.min(10, n));
    setWater(next);
    logHydration(next);
  }

  // gauge geometry
  const R = 92;
  const Circ = 2 * Math.PI * R;
  const offset = Circ - (Circ * signal.score) / 100;

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-12 sm:pt-16">

        {/* ── Masthead ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-baseline justify-between"
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color: `${INK}80` }}>
              {greeting()}
            </p>
            <h1 className="mt-1 font-serif text-[2.6rem] leading-[1.05]">
              What did you<br /><span className="italic">eat today?</span>
            </h1>
          </div>
          <span className="font-serif text-sm italic" style={{ color: `${INK}66` }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </motion.div>

        {/* ── Journal input ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="relative mt-10"
        >
          <div className="flex items-end gap-3 border-b-2 pb-3" style={{ borderColor: `${INK}1A` }}>
            <span className="font-serif text-2xl" style={{ color: `${INK}40` }}>“</span>
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commit(draft)}
              placeholder="Type your meal…"
              className="flex-1 bg-transparent font-serif text-2xl outline-none placeholder:italic"
              style={{ color: INK }}
            />
            <button
              onClick={() => commit(draft)}
              className="mb-1 grid h-10 w-10 place-items-center rounded-full transition active:scale-90"
              style={{ background: INK, color: PAPER }}
              aria-label="Analyze meal"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Live suggestions */}
          <AnimatePresence>
            {(matches.length > 0 || showCustom) && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border bg-white shadow-xl"
                style={{ borderColor: `${INK}12` }}
              >
                {matches.map((f) => {
                  const ft = tone(f.score);
                  return (
                    <button
                      key={f.label}
                      onClick={() => commit(f.label)}
                      className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-black/[0.03]"
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ft.hex }} />
                      <span className="flex-1 text-[15px]">{f.label}</span>
                      <span className="text-xs font-semibold" style={{ color: ft.hex }}>{f.score}</span>
                    </button>
                  );
                })}
                {showCustom && (
                  <button
                    onClick={() => commit(draft)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-black/[0.03]"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: INK, color: PAPER }}>
                      <Plus size={13} />
                    </span>
                    <span className="text-[15px]">Analyze “<span className="italic">{draft.trim()}</span>”</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Meal-time slots ── */}
        <div className="mt-5 flex gap-2">
          {SLOTS.map((s) => (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className="flex-1 rounded-full py-2 text-[12px] font-semibold transition"
              style={{
                background: slot === s ? INK : "transparent",
                color: slot === s ? PAPER : `${INK}70`,
                border: `1.5px solid ${slot === s ? INK : `${INK}1A`}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── The reading ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={committed}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 flex flex-col items-center text-center"
          >
            {/* Gauge */}
            <div className="relative grid place-items-center">
              <svg width="220" height="220" className="-rotate-90">
                <circle cx="110" cy="110" r={R} fill="none" stroke={`${INK}12`} strokeWidth="3" />
                <motion.circle
                  cx="110" cy="110" r={R} fill="none"
                  stroke={t.hex} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={Circ}
                  initial={{ strokeDashoffset: Circ }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                />
                {Array.from({ length: 60 }).map((_, i) => {
                  const a = (i / 60) * 2 * Math.PI;
                  const on = i / 60 <= signal.score / 100;
                  return (
                    <line
                      key={i}
                      x1={110 + Math.cos(a) * 78} y1={110 + Math.sin(a) * 78}
                      x2={110 + Math.cos(a) * 72} y2={110 + Math.sin(a) * 72}
                      stroke={on ? t.hex : `${INK}10`}
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-serif text-6xl leading-none" style={{ color: t.hex }}>{signal.score}</span>
                <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: `${INK}70` }}>
                  {t.name}
                </span>
              </div>
            </div>

            <h2 className="mt-8 font-serif text-3xl leading-tight">{committed}</h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: `${INK}B0` }}>
              {signal.insight}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {signal.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: t.soft, color: t.hex }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Swap suggestion ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-12 rounded-3xl p-7" style={{ background: t.soft }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: t.hex }}>
            One small shift
          </p>
          <p className="mt-3 font-serif text-xl leading-snug" style={{ color: INK }}>
            {signal.swap}
          </p>
        </motion.div>

        {/* ── Full analysis (expandable) ── */}
        <div className="mt-6 overflow-hidden rounded-3xl border" style={{ borderColor: `${INK}14` }}>
          <button
            onClick={() => setShowAnalysis((v) => !v)}
            className="flex w-full items-center justify-between px-7 py-5"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles size={16} style={{ color: t.hex }} />
              <span className="text-[13px] font-bold uppercase tracking-[0.2em]" style={{ color: `${INK}AA` }}>
                Full analysis
              </span>
            </span>
            <motion.span animate={{ rotate: showAnalysis ? 180 : 0 }}>
              <ChevronDown size={18} style={{ color: `${INK}80` }} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {showAnalysis && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="space-y-7 px-7 pb-7">
                  {/* Energy composition bar */}
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}55` }}>
                      Energy composition
                    </p>
                    <div className="flex h-3.5 overflow-hidden rounded-full" style={{ background: `${INK}10` }}>
                      <div style={{ width: `${split.protein}%`, background: "#5E7A5C" }} />
                      <div style={{ width: `${split.carbs}%`, background: "#C2913C" }} />
                      <div style={{ width: `${split.fat}%`, background: "#C05E3A" }} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                      {[
                        { l: "Protein", c: "#5E7A5C", v: Math.round(split.protein) },
                        { l: "Carbs", c: "#C2913C", v: Math.round(split.carbs) },
                        { l: "Fat", c: "#C05E3A", v: Math.round(split.fat) },
                      ].map(({ l, c, v }) => (
                        <span key={l} className="flex items-center gap-1.5" style={{ color: `${INK}90` }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                          {l} · {v}%
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Macro bars */}
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}55` }}>
                      Nutrient profile
                    </p>
                    <div className="space-y-3">
                      {MACROS.map(({ key, label, hex, goodHigh }) => {
                        const v = nutrients[key];
                        const isWarn = goodHigh ? v <= 3 : v >= 7;
                        const isGood = goodHigh ? v >= 6 : v <= 3;
                        return (
                          <div key={key}>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2" style={{ color: `${INK}D0` }}>
                                {label}
                                {isWarn && (
                                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#C05E3A1A", color: "#C05E3A" }}>
                                    Watch
                                  </span>
                                )}
                                {isGood && (
                                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "#5E7A5C1A", color: "#5E7A5C" }}>
                                    Good
                                  </span>
                                )}
                              </span>
                              <span className="text-xs font-semibold" style={{ color: `${INK}70` }}>{v}/10</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full" style={{ background: `${INK}10` }}>
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${v * 10}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                style={{ background: isWarn ? "#C05E3A" : hex }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick attributes */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-4" style={{ background: `${INK}06` }}>
                      <Zap size={15} style={{ color: "#C2913C" }} />
                      <p className="mt-2 text-[11px] uppercase tracking-wide" style={{ color: `${INK}60` }}>Energy</p>
                      <p className="font-serif text-lg">{nutrients.carbs >= 7 ? "Quick burn" : nutrients.protein >= 6 ? "Sustained" : "Moderate"}</p>
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: `${INK}06` }}>
                      <Droplet size={15} style={{ color: WATER }} />
                      <p className="mt-2 text-[11px] uppercase tracking-wide" style={{ color: `${INK}60` }}>Digestion</p>
                      <p className="font-serif text-lg">{nutrients.fiber >= 6 ? "Gentle" : nutrients.fat >= 7 ? "Heavy" : "Easy"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Plate photo + Log ── */}
        <div className="mt-6 flex gap-3">
          {photo ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="Plate" className="h-full w-full object-cover" />
              <button
                onClick={() => setPhoto(null)}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/55 text-white"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <label
              className="grid h-16 w-16 shrink-0 cursor-pointer place-items-center rounded-2xl border-2 border-dashed transition active:scale-95"
              style={{ borderColor: `${INK}25`, color: `${INK}70` }}
            >
              <Camera size={20} />
              <input type="file" accept="image/*" capture="environment" onChange={onPhoto} className="hidden" />
            </label>
          )}

          <motion.button
            onClick={handleLog}
            whileTap={{ scale: 0.98 }}
            className="flex h-16 flex-1 items-center justify-center gap-3 rounded-3xl text-sm font-bold uppercase tracking-[0.2em] transition"
            style={{ background: logged ? "#5E7A5C" : INK, color: PAPER }}
          >
            {logged ? <><Check size={18} /> Logged · +15 points</> : <>Log {slot.toLowerCase()}</>}
          </motion.button>
        </div>

        {/* ── Suggestions rail ── */}
        <div className="mt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}55` }}>
            Or try one of these
          </p>
          <div className="-mx-6 mt-4 flex gap-3 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {foodLibrary.slice(0, 8).map((f) => {
              const ft = tone(f.score);
              const active = f.label === committed;
              return (
                <button
                  key={f.label}
                  onClick={() => commit(f.label)}
                  className="group flex w-44 shrink-0 flex-col justify-between rounded-2xl border p-4 text-left transition"
                  style={{ borderColor: active ? INK : `${INK}14`, background: active ? INK : "#FFFFFF" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl" style={{ color: active ? PAPER : ft.hex }}>{f.score}</span>
                    <span className="h-2 w-2 rounded-full" style={{ background: ft.hex }} />
                  </div>
                  <span className="mt-3 text-[13px] leading-snug" style={{ color: active ? `${PAPER}D0` : `${INK}C0` }}>
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Plan my day ── */}
        <div className="mt-14">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}55` }}>
              Plan my day
            </p>
            <span className="font-serif text-sm italic" style={{ color: `${INK}66` }}>{plan.label}</span>
          </div>

          <div className="-mx-6 mt-4 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PLAN_TABS.map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setPlanMode(mode)}
                className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition"
                style={{
                  background: planMode === mode ? INK : "transparent",
                  color: planMode === mode ? PAPER : `${INK}70`,
                  border: `1.5px solid ${planMode === mode ? INK : `${INK}1A`}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2.5">
            {plan.entries.map((entry) => {
              const et = tone(entry.score);
              return (
                <button
                  key={entry.slot}
                  onClick={() => commit(entry.meal)}
                  className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:border-current"
                  style={{ borderColor: `${INK}12` }}
                >
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: `${INK}45` }}>
                      {entry.slot}
                    </p>
                    <p className="mt-0.5 font-medium">{entry.meal}</p>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: `${INK}80` }}>{entry.tip}</p>
                  </div>
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-serif text-base"
                    style={{ background: et.soft, color: et.hex }}
                  >
                    {entry.score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Water ── */}
        <div className="mt-14 rounded-3xl border p-7" style={{ borderColor: `${INK}14` }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}55` }}>
                Hydration
              </p>
              <p className="mt-1 font-serif text-2xl">
                {water} <span style={{ color: `${INK}55` }}>/ 10 cups</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCups(water - 1)}
                className="grid h-10 w-10 place-items-center rounded-full border transition active:scale-90"
                style={{ borderColor: `${INK}20` }}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setCups(water + 1)}
                className="grid h-10 w-10 place-items-center rounded-full transition active:scale-90"
                style={{ background: WATER, color: "#fff" }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <div className="mt-5 flex gap-1.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <button key={i} onClick={() => setCups(i + 1 === water ? i : i + 1)} className="flex-1">
                <Droplet
                  size={22}
                  className="mx-auto transition-all"
                  style={{
                    fill: i < water ? WATER : "transparent",
                    color: i < water ? WATER : `${INK}25`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
