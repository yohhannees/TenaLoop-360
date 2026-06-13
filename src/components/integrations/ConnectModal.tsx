"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Check, Lock, ShieldCheck, Sparkles, X } from "lucide-react";
import { Integration } from "@/lib/integrations";
import BrandLogo from "./BrandLogo";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const GOLD = "#C2913C";

type Phase = "consent" | "connecting" | "done";

type Props = {
  integration: Integration;
  onClose: () => void;
  onConnected: () => void;
};

export default function ConnectModal({ integration, onClose, onConnected }: Props) {
  const [phase, setPhase] = useState<Phase>("consent");
  const [progress, setProgress] = useState(0);

  // Animated "secure import" progress
  useEffect(() => {
    if (phase !== "connecting") return;
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 11 + 6;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setProgress(100);
        setTimeout(() => setPhase("done"), 450);
      }
      setProgress(Math.min(100, p));
    }, 230);
    return () => clearInterval(t);
  }, [phase]);

  // Fire the reward exactly once, when we reach the success screen
  useEffect(() => {
    if (phase === "done") onConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const stage =
    progress < 28 ? "Opening secure login…" :
    progress < 58 ? "Authenticating your account…" :
    progress < 84 ? "Granting permissions…" :
    "Importing your latest data…";

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      style={{ background: "rgba(33,29,23,0.6)", backdropFilter: "blur(6px)" }}>
      {phase !== "connecting" && <div className="absolute inset-0" onClick={onClose} />}

      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-md overflow-hidden rounded-t-3xl shadow-2xl sm:rounded-3xl"
        style={{ background: "#fff" }}>

        {/* Brand band */}
        <div className="relative flex items-center justify-center gap-5 px-6 py-7" style={{ background: PAPER }}>
          {phase !== "connecting" && (
            <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full" style={{ border: `1px solid ${INK}14`, color: `${INK}50` }}>
              <X size={14} />
            </button>
          )}
          <Tile><Activity size={24} style={{ color: INK }} /></Tile>
          <ConnectorDots active={phase === "connecting"} />
          <Tile border={integration.color}>
            <BrandLogo slug={integration.slug} color={integration.color} name={integration.name} Fallback={integration.Icon} size={26} />
          </Tile>
        </div>

        <AnimatePresence mode="wait">
          {/* ───────── CONSENT ───────── */}
          {phase === "consent" && (
            <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pb-6">
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}50` }}>
                Authorize connection
              </p>
              <h2 className="mt-1.5 text-center font-serif text-2xl leading-tight" style={{ color: INK }}>
                TenaLoop wants to access<br />your {integration.name} data
              </h2>

              <div className="mt-5 rounded-2xl p-4" style={{ background: PAPER }}>
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}45` }}>This will sync</p>
                <div className="mt-3 grid gap-2.5">
                  {integration.scopes.map((scope) => (
                    <div key={scope} className="flex items-center gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full" style={{ background: `${SAGE}1F` }}>
                        <Check size={12} strokeWidth={3} style={{ color: SAGE }} />
                      </span>
                      <span className="text-sm" style={{ color: `${INK}D0` }}>{scope}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: `${SAGE}12` }}>
                <Lock size={13} style={{ color: SAGE }} />
                <p className="text-[11px] leading-snug" style={{ color: `${INK}90` }}>
                  Secured with OAuth 2.0 · read-only access · disconnect anytime.
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <button onClick={onClose} className="h-12 flex-1 rounded-2xl text-sm font-semibold transition" style={{ border: `1.5px solid ${INK}18`, color: `${INK}80` }}>
                  Cancel
                </button>
                <button onClick={() => setPhase("connecting")} className="h-12 flex-[1.4] rounded-2xl text-sm font-bold transition active:scale-95" style={{ background: INK, color: PAPER }}>
                  Authorize {integration.name}
                </button>
              </div>
            </motion.div>
          )}

          {/* ───────── CONNECTING ───────── */}
          {phase === "connecting" && (
            <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-6 pb-8 pt-2">
              <div className="mx-auto mt-2 max-w-xs text-center">
                <p className="font-serif text-xl" style={{ color: INK }}>Connecting securely</p>
                <AnimatePresence mode="wait">
                  <motion.p key={stage} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="mt-1 text-sm" style={{ color: `${INK}65` }}>
                    {stage}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-5 h-2 overflow-hidden rounded-full" style={{ background: `${INK}10` }}>
                  <motion.div className="h-full rounded-full" style={{ width: `${progress}%`, background: integration.color }} />
                </div>
                <p className="mt-2 text-[11px] font-semibold" style={{ color: `${INK}45` }}>{Math.round(progress)}%</p>
              </div>
            </motion.div>
          )}

          {/* ───────── DONE ───────── */}
          {phase === "done" && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-6 pt-1 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: SAGE }}>
                <Check size={32} strokeWidth={3} className="text-white" />
              </motion.div>
              <h2 className="mt-4 font-serif text-2xl" style={{ color: INK }}>{integration.name} connected</h2>
              <p className="mt-1 text-sm" style={{ color: `${INK}65` }}>Here&apos;s what we just synced for today.</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {integration.imported.map((d) => (
                  <div key={d.label} className="rounded-2xl p-3" style={{ background: PAPER }}>
                    <p className="font-serif text-xl leading-none" style={{ color: INK }}>{d.value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: `${INK}55` }}>{d.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl px-4 py-3" style={{ background: `${GOLD}1A` }}>
                <Sparkles size={15} style={{ color: GOLD }} />
                <p className="text-sm font-bold" style={{ color: GOLD }}>+{integration.points} points · {integration.stamp} stamp earned</p>
              </div>

              <button onClick={onClose} className="mt-5 h-12 w-full rounded-2xl text-sm font-bold transition active:scale-95" style={{ background: INK, color: PAPER }}>
                Done
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: `${INK}45` }}>
                <ShieldCheck size={12} /> Synced privately to this device
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Tile({ children, border }: { children: React.ReactNode; border?: string }) {
  return (
    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-sm"
      style={{ border: `1px solid ${border ? `${border}55` : "rgba(33,29,23,0.12)"}` }}>
      {children}
    </span>
  );
}

function ConnectorDots({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="h-1.5 w-1.5 rounded-full"
          style={{ background: active ? SAGE : "rgba(33,29,23,0.25)" }}
          animate={active ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
          transition={active ? { duration: 0.9, repeat: Infinity, delay: i * 0.18 } : {}}
        />
      ))}
    </div>
  );
}
