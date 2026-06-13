"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Phone, ShieldAlert, Stethoscope } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const CLAY = "#C05E3A";

/**
 * Clear clinical hand-off. Renders only when the check-in carries warning signs.
 * Drop it at the top of any page — it self-hides when no referral is needed.
 */
export default function ReferToCare() {
  const { checkIn } = useWellness();
  if (!checkIn.redFlags) return null;

  const painNote = checkIn.painAreas.length > 0
    ? `pain in your ${checkIn.painAreas.slice(0, 2).join(" and ").toLowerCase()}`
    : "the warning signs you marked";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl"
      style={{ background: "#fff", border: `1.5px solid ${CLAY}55`, boxShadow: `0 10px 30px ${CLAY}22` }}
    >
      <div className="flex items-center gap-3 px-6 py-4" style={{ background: CLAY, color: "#fff" }}>
        <ShieldAlert size={20} />
        <p className="text-sm font-bold uppercase tracking-wide">Time to involve a professional</p>
      </div>

      <div className="p-6">
        <p className="text-[15px] leading-relaxed" style={{ color: `${INK}D0` }}>
          Because of {painNote}, this is beyond self-care. TenaLoop guides gentle resets —
          but these signals should be seen by a <span className="font-semibold">licensed provider</span>.
          Please pause self-guided movement until you're checked.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/market"
            className="inline-flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-bold transition active:scale-95"
            style={{ background: INK, color: PAPER }}>
            <Stethoscope size={16} /> Find a matched provider <ArrowRight size={15} />
          </Link>
          <Link href="/coach"
            className="inline-flex h-12 items-center gap-2 rounded-2xl px-5 text-sm font-bold transition active:scale-95"
            style={{ border: `1.5px solid ${INK}18`, color: INK }}>
            <Bot size={16} /> Ask TenaBot what to do
          </Link>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl p-3.5" style={{ background: `${CLAY}10` }}>
          <Phone size={15} className="mt-0.5 shrink-0" style={{ color: CLAY }} />
          <p className="text-[13px] leading-relaxed" style={{ color: `${INK}90` }}>
            If this is an emergency — chest pain, trouble breathing, severe bleeding, or thoughts of self-harm —
            contact local emergency services right away. TenaLoop is not emergency care.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
