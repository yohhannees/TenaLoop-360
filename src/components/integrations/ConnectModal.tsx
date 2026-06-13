"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Check, Lock, RefreshCw, ShieldCheck, Sparkles, X } from "lucide-react";
import { Integration } from "@/lib/integrations";
import BrandLogo from "./BrandLogo";

const GOLD = "#D6A64B";

type Phase = "consent" | "connecting" | "done";

type Props = {
  integration: Integration;
  onClose: () => void;
  onConnected: () => void;
};

export default function ConnectModal({ integration, onClose, onConnected }: Props) {
  const [phase, setPhase] = useState<Phase>("consent");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase !== "connecting") return;

    let nextProgress = 0;
    const timer = setInterval(() => {
      nextProgress += Math.random() * 11 + 6;
      if (nextProgress >= 100) {
        nextProgress = 100;
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => setPhase("done"), 450);
        return;
      }
      setProgress(Math.min(100, nextProgress));
    }, 230);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") onConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const stage =
    progress < 28
      ? "Opening secure login..."
      : progress < 58
        ? "Authenticating account..."
        : progress < 84
          ? "Granting read-only access..."
          : "Importing latest signals...";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      style={{ background: "rgba(7, 28, 19, 0.66)", backdropFilter: "blur(8px)" }}
    >
      {phase !== "connecting" && <div className="absolute inset-0" onClick={onClose} />}

      <motion.div
        initial={{ y: 28, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 12, opacity: 0, scale: 0.98 }}
        className="relative w-full max-w-lg overflow-hidden rounded-t-lg bg-white shadow-2xl shadow-black/30 sm:rounded-lg"
      >
        <div className="relative overflow-hidden bg-[#071C13] px-5 py-5 text-[#E8EDE7] sm:px-6">
          <div
            aria-hidden
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(214,166,75,0.34), transparent 44%), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 36px 36px, 36px 36px",
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D6A64B]">
                Secure connection
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-white">
                Link {integration.name}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#E8EDE7]/64">
                TenaLoop will import only the signals you approve.
              </p>
            </div>

            {phase !== "connecting" && (
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/8 text-[#E8EDE7]/72 transition hover:bg-white/12 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <BrandTile>
              <Activity size={24} strokeWidth={1.7} className="text-[#D6A64B]" />
            </BrandTile>
            <ConnectorDots active={phase === "connecting"} />
            <BrandTile border={integration.color}>
              <BrandLogo
                slug={integration.slug}
                color={integration.color}
                name={integration.name}
                Fallback={integration.Icon}
                size={28}
              />
            </BrandTile>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === "consent" && (
            <motion.div
              key="consent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-5 py-5 sm:px-6"
            >
              <div className="rounded-lg border border-[#0A2318]/10 bg-[#F7F4EC] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">
                  This will sync
                </p>
                <div className="mt-3 grid gap-2">
                  {integration.scopes.map((scope) => (
                    <div key={scope} className="flex min-w-0 items-center gap-3 rounded-lg bg-white px-3 py-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#5E7A5C]/12 text-[#5E7A5C]">
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium text-[#0A2318]/78">{scope}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-lg border border-[#5E7A5C]/18 bg-[#5E7A5C]/8 px-3 py-3">
                <Lock size={15} className="mt-0.5 shrink-0 text-[#5E7A5C]" />
                <p className="text-xs leading-5 text-[#0A2318]/68">
                  OAuth 2.0 preview, read-only permissions, and local demo storage.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 rounded-lg border border-[#0A2318]/12 bg-white text-sm font-bold text-[#0A2318]/64 transition hover:border-[#0A2318]/24 hover:text-[#0A2318]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("connecting")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0A2318] px-4 text-sm font-bold text-[#E8EDE7] transition hover:bg-[#123624] active:scale-[0.99]"
                >
                  <ShieldCheck size={16} />
                  Authorize
                </button>
              </div>
            </motion.div>
          )}

          {phase === "connecting" && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-5 py-7 text-center sm:px-6"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-[#0A2318]/10 bg-[#F7F4EC] text-[#8C6246]">
                <RefreshCw size={24} className="animate-spin" />
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-[#0A2318]">
                Connecting securely
              </h2>

              <AnimatePresence mode="wait">
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 text-sm text-[#0A2318]/58"
                >
                  {stage}
                </motion.p>
              </AnimatePresence>

              <div className="mx-auto mt-6 max-w-sm">
                <div className="h-2 overflow-hidden rounded-full bg-[#0A2318]/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${progress}%`, background: integration.color }}
                  />
                </div>
                <p className="mt-2 text-xs font-bold text-[#0A2318]/42">{Math.round(progress)}%</p>
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 py-5 text-center sm:px-6"
            >
              <motion.div
                initial={{ scale: 0.72 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-[#5E7A5C] text-white"
              >
                <Check size={32} strokeWidth={3} />
              </motion.div>

              <h2 className="mt-4 font-serif text-3xl text-[#0A2318]">{integration.name} is live</h2>
              <p className="mt-1 text-sm text-[#0A2318]/58">Latest signals imported for today.</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {integration.imported.map((data) => (
                  <div key={data.label} className="min-w-0 rounded-lg border border-[#0A2318]/8 bg-[#F7F4EC] p-3">
                    <p className="truncate font-serif text-xl leading-none text-[#0A2318]">{data.value}</p>
                    <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wide text-[#0A2318]/45">
                      {data.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#D6A64B]/22 bg-[#FFF8E7] px-4 py-3">
                <Sparkles size={15} className="text-[#8C6246]" />
                <p className="text-sm font-bold text-[#8C6246]">
                  +{integration.points} points - {integration.stamp} stamp earned
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 h-12 w-full rounded-lg bg-[#0A2318] text-sm font-bold text-[#E8EDE7] transition hover:bg-[#123624] active:scale-[0.99]"
              >
                Done
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#0A2318]/42">
                <ShieldCheck size={12} /> Synced privately to this device
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function BrandTile({ children, border }: { children: React.ReactNode; border?: string }) {
  return (
    <span
      className="grid h-16 place-items-center rounded-lg border bg-white/10 shadow-sm"
      style={{ borderColor: border ? `${border}66` : "rgba(255,255,255,0.14)" }}
    >
      {children}
    </span>
  );
}

function ConnectorDots({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: active ? GOLD : "rgba(232,237,231,0.42)" }}
          animate={active ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.6 }}
          transition={active ? { duration: 0.9, repeat: Infinity, delay: index * 0.18 } : {}}
        />
      ))}
    </div>
  );
}
