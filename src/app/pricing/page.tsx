"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2, Check, Gem, Heart, Sparkles, Store, TrendingUp, Users,
} from "lucide-react";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const GOLD = "#C2913C";
const BROWN = "#9A6B4A";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  monthly: number | null;
  features: string[];
  cta: string;
  highlight?: boolean;
  Icon: React.ElementType;
};

const PLANS: Plan[] = [
  {
    id: "free", name: "Rooted", tagline: "The daily wellness loop, free forever.", monthly: 0, Icon: Heart,
    features: ["Daily body-aware check-in", "Your TenaScore & 7-day trend", "Body map & spine-safe guidance", "Join community circles", "Basic Ethiopian food scoring"],
    cta: "Start free",
  },
  {
    id: "plus", name: "Rooted+", tagline: "Unlimited AI and your full wellness passport.", monthly: 199, Icon: Gem, highlight: true,
    features: ["Everything in Rooted", "Unlimited TenaBot AI coaching", "Personalized AI reset plans", "Full macros & local meal plans", "Tinfash breathing library", "App integrations (Strava, Apple Health…)", "Passport discounts at providers"],
    cta: "Go Rooted+",
  },
  {
    id: "teams", name: "TenaLoop for Teams", tagline: "Corporate wellness, measurable & private.", monthly: null, Icon: Building2,
    features: ["Everything in Rooted+ for staff", "Anonymized team wellness dashboard", "Company-wide challenges & circles", "Burnout & stress early-warning signals", "Dedicated provider partnerships"],
    cta: "Talk to us",
  },
];

const REVENUE_LEGS = [
  {
    Icon: Gem, color: SAGE, name: "Freemium AI subscriptions",
    desc: "Free hooks daily habit; Rooted+ unlocks unlimited AI coaching, personalized plans and integrations.",
    metric: "199 ETB", metricLabel: "per member / month",
  },
  {
    Icon: Store, color: GOLD, name: "Marketplace commission",
    desc: "TenaMarket routes check-ins to real spas, gyms and clinics. We take a commission on every booking and bundle.",
    metric: "15%", metricLabel: "take-rate per booking",
  },
  {
    Icon: Building2, color: BROWN, name: "B2B wellness insights",
    desc: "Anonymized, aggregated wellness analytics sold to employers, insurers and health systems — never personal data.",
    metric: "B2B", metricLabel: "corporate contracts",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  function price(monthly: number | null) {
    if (monthly === null) return "Custom";
    if (monthly === 0) return "0";
    return annual ? Math.round(monthly * 10).toLocaleString() : monthly.toLocaleString();
  }

  return (
    <div className="-mx-4 -my-6 min-h-screen px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-10" style={{ background: PAPER, color: INK }}>
      <div className="mx-auto max-w-6xl">

        {/* Masthead */}
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color: `${INK}80` }}>Plans & business model</p>
          <h1 className="mx-auto mt-2 max-w-2xl font-serif text-[2.6rem] leading-[1.08]">
            Wellness that pays for itself — <span className="italic">and scales.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed" style={{ color: `${INK}80` }}>
            Free for every Ethiopian to start. Three revenue engines make it sustainable.
          </p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full p-1" style={{ background: `${INK}0D` }}>
            {[{ k: false, l: "Monthly" }, { k: true, l: "Annual · 2 months free" }].map(({ k, l }) => (
              <button key={l} onClick={() => setAnnual(k)}
                className="rounded-full px-4 py-2 text-xs font-bold transition"
                style={annual === k ? { background: "#fff", color: INK, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } : { color: `${INK}60` }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const hl = plan.highlight;
            return (
              <div key={plan.id} className="relative flex flex-col rounded-3xl p-7"
                style={hl
                  ? { background: INK, color: PAPER, boxShadow: `0 20px 50px ${INK}33` }
                  : { background: "#fff", border: `1px solid ${INK}12` }}>
                {hl && (
                  <span className="absolute right-6 top-6 flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase" style={{ background: GOLD, color: INK }}>
                    <Sparkles size={11} /> Popular
                  </span>
                )}
                <span className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={hl ? { background: "rgba(255,255,255,0.1)", color: GOLD } : { background: `${SAGE}1A`, color: SAGE }}>
                  <plan.Icon size={22} />
                </span>
                <h3 className="mt-4 font-serif text-2xl">{plan.name}</h3>
                <p className="mt-1 text-[13px] leading-relaxed" style={{ color: hl ? `${PAPER}99` : `${INK}70` }}>{plan.tagline}</p>

                <div className="mt-5 flex items-end gap-1.5">
                  {plan.monthly === null ? (
                    <span className="font-serif text-4xl">Custom</span>
                  ) : (
                    <>
                      <span className="font-serif text-5xl leading-none">{price(plan.monthly)}</span>
                      <span className="pb-1 text-sm" style={{ color: hl ? `${PAPER}80` : `${INK}55` }}>
                        {plan.monthly === 0 ? "ETB" : `ETB / ${annual ? "yr" : "mo"}`}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-6 grid gap-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check size={15} className="mt-0.5 shrink-0" style={{ color: hl ? GOLD : SAGE }} />
                      <span className="text-[13px]" style={{ color: hl ? `${PAPER}E6` : `${INK}C0` }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href={plan.id === "teams" ? "mailto:ethiopia@alxafrica.com" : "/signup"}
                  className="mt-7 flex h-12 items-center justify-center rounded-2xl text-sm font-bold transition active:scale-95"
                  style={hl ? { background: GOLD, color: INK } : { background: INK, color: PAPER }}>
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Business model ── */}
        <div className="mt-16">
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BROWN }}>For investors</p>
            <h2 className="mt-2 font-serif text-3xl">Three revenue engines, one loop</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm" style={{ color: `${INK}70` }}>
              The same daily check-in that helps users also powers a diversified, defensible business.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {REVENUE_LEGS.map((leg, i) => (
              <div key={leg.name} className="flex flex-col rounded-3xl border p-6" style={{ background: "#fff", borderColor: `${INK}12` }}>
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${leg.color}1A`, color: leg.color }}>
                    <leg.Icon size={20} />
                  </span>
                  <span className="font-mono text-xs font-bold" style={{ color: `${INK}30` }}>0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-serif text-xl">{leg.name}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed" style={{ color: `${INK}80` }}>{leg.desc}</p>
                <div className="mt-4 border-t pt-4" style={{ borderColor: `${INK}0D` }}>
                  <p className="font-serif text-3xl leading-none" style={{ color: leg.color }}>{leg.metric}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: `${INK}55` }}>{leg.metricLabel}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Why it scales */}
          <div className="mt-4 grid gap-4 rounded-3xl p-7 sm:grid-cols-3" style={{ background: INK, color: PAPER }}>
            {[
              { Icon: Users, stat: "Habit-first", label: "Free daily loop drives retention before we ever charge." },
              { Icon: TrendingUp, stat: "Low CAC", label: "Community circles & passport referrals grow users organically." },
              { Icon: Store, stat: "Local supply", label: "Ethiopian providers & foods make it hard to copy from abroad." },
            ].map(({ Icon, stat, label }) => (
              <div key={stat} className="flex gap-3">
                <Icon size={20} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
                <div>
                  <p className="font-serif text-lg">{stat}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: `${PAPER}99` }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
