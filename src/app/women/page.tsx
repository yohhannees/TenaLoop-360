"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, ArrowRight, Droplet, Dumbbell, Heart, Lock, Moon, Sparkles, Utensils,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { CycleContext } from "@/lib/types";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const ROSE = "#C2748B";
const SAGE = "#5E7A5C";
const GOLD = "#C2913C";

const PHASES: CycleContext[] = ["None", "Period near", "On period", "Pregnant", "Postpartum"];

type Guidance = {
  headline: string;
  summary: string;
  nutrition: string;
  movement: string;
  mind: string;
  watchFor: string[];
};

const GUIDANCE: Record<CycleContext, Guidance> = {
  "None": {
    headline: "Cycle-steady",
    summary: "A balanced baseline. Track how energy and mood shift across your month so the loop can adapt.",
    nutrition: "Iron-rich Ethiopian plates — misir, gomen, lean tibs — keep stores topped up for the month ahead.",
    movement: "Mix strength and gentle cardio. Note which days feel strongest and plan harder sessions there.",
    mind: "A short daily Tinfash breath builds a calm baseline you'll feel most on tougher cycle days.",
    watchFor: ["Cycles shorter than 21 or longer than 35 days", "Bleeding that soaks a pad hourly", "Pain that stops daily activity"],
  },
  "Period near": {
    headline: "Winding down (luteal)",
    summary: "Hormones dip before your period — energy, mood and cravings can swing. Be gentle and plan lighter.",
    nutrition: "Magnesium and complex carbs ease PMS — add atkilt, lentils and a little dark chocolate; cut salt to reduce bloating.",
    movement: "Lighter movement: walks, yoga, mobility. Skip max-effort days if your body asks for rest.",
    mind: "Extra Tinfash sessions and earlier sleep soften irritability and tension this week.",
    watchFor: ["PMS that severely disrupts work or relationships (possible PMDD)", "Mood that turns to hopelessness"],
  },
  "On period": {
    headline: "Menstruation",
    summary: "Replenish iron and rest as needed. Light movement often eases cramps more than full rest.",
    nutrition: "Iron + vitamin C together — misir wot with tomato, gomen, citrus. Warm fluids and ginger tea ease cramps.",
    movement: "Gentle walks, stretching and breathing. Honour low-energy days without guilt.",
    mind: "Warmth, rest and a slow Tinfash exhale calm the nervous system through cramps.",
    watchFor: ["Soaking a pad/tampon every hour for 2+ hours", "Periods lasting over 7 days", "Fainting or severe dizziness"],
  },
  "Pregnant": {
    headline: "Pregnancy",
    summary: "General wellbeing support only — your antenatal provider leads your care. The loop stays gentle and safe.",
    nutrition: "Folate, iron and protein: gomen, lentils, eggs, fortified injera. Avoid raw meat (kitfo) and limit caffeine.",
    movement: "Provider-approved gentle movement — walking, prenatal stretches. Stop if anything feels wrong.",
    mind: "Calm breathing and rest support you and baby. Keep stress low and sleep prioritised.",
    watchFor: ["Bleeding or fluid leakage", "Severe headache or blurred vision", "Strong cramping or reduced baby movement"],
  },
  "Postpartum": {
    headline: "Postpartum & recovery",
    summary: "Recovery is not linear. The loop protects rest, mood and gentle return to movement — your provider guides the rest.",
    nutrition: "Nourishing, iron-rich meals and plenty of fluids — genfo, shiro, gomen support recovery and, if nursing, supply.",
    movement: "Start with breathing and gentle walks; rebuild core slowly with provider clearance.",
    mind: "Watch your mood closely. Daily check-ins and support circles matter most in these weeks.",
    watchFor: ["Heavy bleeding, fever, or wound concerns", "Persistent sadness, anxiety or detachment (postpartum depression)", "Thoughts of harming yourself or baby — seek help now"],
  },
};

export default function WomenPage() {
  const { checkIn, updateCheckIn } = useWellness();
  const active = checkIn.womenWellness;
  const phase = checkIn.cycleContext;
  const g = GUIDANCE[phase];

  return (
    <div className="-mx-4 -my-6 min-h-screen px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-10" style={{ background: PAPER, color: INK }}>
      <div className="mx-auto max-w-3xl">

        {/* Masthead */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color: `${INK}80` }}>Women's Wellness</p>
              <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide" style={{ background: `${ROSE}1F`, color: ROSE }}>FemTech</span>
            </div>
            <h1 className="mt-2 font-serif text-[2.4rem] leading-[1.05]">
              Care that moves<br /><span className="italic">with your cycle.</span>
            </h1>
          </div>
          <span className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-semibold" style={{ background: `${SAGE}15`, color: SAGE }}>
            <Lock size={13} /> Private · never shared
          </span>
        </div>

        {/* Enable / privacy */}
        {!active ? (
          <div className="mt-8 rounded-3xl border p-7 text-center" style={{ background: "#fff", borderColor: `${INK}12` }}>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: `${ROSE}1A`, color: ROSE }}>
              <Heart size={24} />
            </span>
            <h2 className="mt-4 font-serif text-2xl">Turn on Women's Wellness</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed" style={{ color: `${INK}75` }}>
              Get cycle-aware nutrition, movement and mind guidance — plus maternal and postpartum
              support. Everything stays private on your device.
            </p>
            <button onClick={() => updateCheckIn("womenWellness", true)}
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-bold transition active:scale-95"
              style={{ background: ROSE, color: "#fff" }}>
              <Sparkles size={16} /> Enable
            </button>
          </div>
        ) : (
          <>
            {/* Phase selector */}
            <div className="mt-8">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: `${INK}55` }}>Where are you right now?</p>
              <div className="flex flex-wrap gap-2">
                {PHASES.map((p) => {
                  const on = p === phase;
                  return (
                    <button key={p} onClick={() => updateCheckIn("cycleContext", p)}
                      className="rounded-full px-4 py-2 text-[13px] font-semibold transition active:scale-95"
                      style={{ background: on ? ROSE : "transparent", color: on ? "#fff" : `${INK}75`, border: `1.5px solid ${on ? ROSE : `${INK}18`}` }}>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guidance */}
            <AnimatePresence mode="wait">
              <motion.div key={phase} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 grid gap-4">
                <div className="rounded-3xl border p-7" style={{ background: "#fff", borderColor: `${ROSE}33` }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: ROSE }}>{g.headline}</p>
                  <p className="mt-2 font-serif text-xl leading-snug">{g.summary}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { Icon: Utensils, color: GOLD, label: "Nutrition", text: g.nutrition },
                    { Icon: Dumbbell, color: SAGE, label: "Movement", text: g.movement },
                    { Icon: Moon, color: ROSE, label: "Mind", text: g.mind },
                  ].map(({ Icon, color, label, text }) => (
                    <div key={label} className="rounded-3xl border p-5" style={{ background: "#fff", borderColor: `${INK}12` }}>
                      <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `${color}1A`, color }}>
                        <Icon size={18} />
                      </span>
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide" style={{ color: `${INK}55` }}>{label}</p>
                      <p className="mt-1 text-[13px] leading-relaxed" style={{ color: `${INK}90` }}>{text}</p>
                    </div>
                  ))}
                </div>

                {/* Watch for — referral */}
                <div className="rounded-3xl p-6" style={{ background: `${ROSE}10`, border: `1px solid ${ROSE}40` }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} style={{ color: ROSE }} />
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: ROSE }}>See a provider if you notice</p>
                  </div>
                  <ul className="mt-3 grid gap-2">
                    {g.watchFor.map((w) => (
                      <li key={w} className="flex items-start gap-2.5 text-[13px] leading-relaxed" style={{ color: `${INK}90` }}>
                        <Droplet size={13} className="mt-1 shrink-0" style={{ color: ROSE }} /> {w}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12px] leading-relaxed" style={{ color: `${INK}65` }}>
                    TenaLoop offers general wellness support — it never diagnoses. These signs need a licensed provider.
                  </p>
                  <Link href="/market" className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-bold transition active:scale-95" style={{ background: INK, color: PAPER }}>
                    Find women's-health providers <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Community */}
                <Link href="/circles" className="flex items-center justify-between rounded-3xl border p-5 transition hover:border-current" style={{ background: "#fff", borderColor: `${INK}12` }}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `${ROSE}1A`, color: ROSE }}><Heart size={18} /></span>
                    <div>
                      <p className="font-semibold">Join a private women's circle</p>
                      <p className="text-[13px]" style={{ color: `${INK}65` }}>Anonymous peer support, moderated weekly.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} style={{ color: `${INK}50` }} />
                </Link>

                <button onClick={() => updateCheckIn("womenWellness", false)}
                  className="justify-self-start text-xs font-semibold transition hover:opacity-70" style={{ color: `${INK}50` }}>
                  Turn off Women's Wellness
                </button>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
