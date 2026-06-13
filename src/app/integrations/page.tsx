"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plug, RefreshCw, ShieldCheck } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { INTEGRATIONS, INTEGRATION_GROUPS, Integration } from "@/lib/integrations";
import BrandLogo from "@/components/integrations/BrandLogo";
import ConnectModal from "@/components/integrations/ConnectModal";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const GOLD = "#C2913C";

function readStoredFlags(key: string) {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export default function IntegrationsPage() {
  const { award } = useWellness();
  const [connected, setConnected] = useState<Record<string, boolean>>(() => readStoredFlags("tl-integrations"));
  const [rewarded, setRewarded] = useState<Record<string, boolean>>(() => readStoredFlags("tl-integrations-rewarded"));
  const [active, setActive] = useState<Integration | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  function handleConnected(item: Integration) {
    setConnected((prev) => {
      const next = { ...prev, [item.id]: true };
      localStorage.setItem("tl-integrations", JSON.stringify(next));
      return next;
    });
    if (!rewarded[item.id]) {
      award(item.stamp, item.points);
      setRewarded((prev) => {
        const next = { ...prev, [item.id]: true };
        localStorage.setItem("tl-integrations-rewarded", JSON.stringify(next));
        return next;
      });
    }
  }

  function disconnect(item: Integration) {
    setConnected((prev) => {
      const next = { ...prev };
      delete next[item.id];
      localStorage.setItem("tl-integrations", JSON.stringify(next));
      return next;
    });
  }

  function syncNow(item: Integration) {
    setSyncing(item.id);
    setTimeout(() => setSyncing(null), 1100);
  }

  const connectedCount = INTEGRATIONS.filter((i) => connected[i.id]).length;
  const syncedPoints = INTEGRATIONS.filter((i) => connected[i.id]).reduce((s, i) => s + i.points, 0);

  return (
    <div className="-mx-4 -my-6 min-h-screen px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-10" style={{ background: PAPER, color: INK }}>
      <AnimatePresence>
        {active && (
          <ConnectModal
            integration={active}
            onClose={() => setActive(null)}
            onConnected={() => handleConnected(active)}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-5xl">

        {/* ── Masthead ── */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color: `${INK}80` }}>Integrations</p>
            <h1 className="mt-2 font-serif text-[2.6rem] leading-[1.05]">
              Bring your whole<br /><span className="italic">wellness world in.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: `${INK}80` }}>
              Connect the apps you already use. TenaLoop folds their signals into your
              score — and each connection earns passport points.
            </p>
          </div>

          <div className="rounded-3xl p-6" style={{ background: INK, color: PAPER, minWidth: 230 }}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {connectedCount > 0 && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: SAGE }} />}
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: connectedCount > 0 ? SAGE : `${PAPER}40` }} />
              </span>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: `${PAPER}99` }}>
                {connectedCount > 0 ? "Syncing live" : "Nothing connected"}
              </p>
            </div>
            <div className="mt-4 flex items-end gap-7">
              <div>
                <p className="font-serif text-4xl leading-none">{connectedCount}<span style={{ color: `${PAPER}55` }}>/{INTEGRATIONS.length}</span></p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${PAPER}66` }}>Connected</p>
              </div>
              <div>
                <p className="font-serif text-4xl leading-none" style={{ color: GOLD }}>+{syncedPoints}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${PAPER}66` }}>Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Groups ── */}
        <div className="mt-12 grid gap-10">
          {INTEGRATION_GROUPS.map((group) => (
            <section key={group}>
              <h2 className="mb-4 flex items-center gap-3 font-serif text-xl">
                <span style={{ width: 18, height: 1, background: `${INK}30` }} />
                {group}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {INTEGRATIONS.filter((i) => i.group === group).map((item) => {
                  const isConnected = connected[item.id];
                  return (
                    <motion.div key={item.id} layout
                      className="flex flex-col rounded-3xl border p-5"
                      style={{ background: "#fff", borderColor: isConnected ? `${SAGE}55` : `${INK}12` }}>

                      <div className="flex items-start justify-between">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm" style={{ border: `1px solid ${item.color}40` }}>
                          <BrandLogo slug={item.slug} color={item.color} name={item.name} Fallback={item.Icon} size={28} />
                        </span>
                        {isConnected && (
                          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase" style={{ background: `${SAGE}1A`, color: SAGE }}>
                            <Check size={11} strokeWidth={3} /> Connected
                          </span>
                        )}
                      </div>

                      <h3 className="mt-4 font-serif text-xl">{item.name}</h3>

                      <AnimatePresence mode="wait">
                        {isConnected ? (
                          <motion.div key="synced" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: SAGE }}>
                              <RefreshCw size={11} className={syncing === item.id ? "animate-spin" : ""} />
                              {syncing === item.id ? "Syncing…" : "Synced just now"}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {item.imported.map((d) => (
                                <span key={d.label} className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: PAPER, color: `${INK}85` }}>
                                  <span className="font-bold" style={{ color: INK }}>{d.value}</span> {d.label}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.p key="blurb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 flex-1 text-[13px] leading-relaxed" style={{ color: `${INK}80` }}>
                            {item.blurb}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: `${INK}0D` }}>
                        {isConnected ? (
                          <>
                            <button onClick={() => syncNow(item)} className="text-xs font-semibold transition hover:opacity-70" style={{ color: `${INK}70` }}>
                              Sync now
                            </button>
                            <button onClick={() => disconnect(item)} className="rounded-full px-3 py-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: `${INK}50` }}>
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-bold" style={{ color: GOLD }}>+{item.points} pts · {item.stamp}</span>
                            <button onClick={() => setActive(item)}
                              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-95"
                              style={{ background: INK, color: PAPER }}>
                              <Plug size={13} /> Connect
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── Footer notes ── */}
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border p-5" style={{ background: "#fff", borderColor: `${INK}12` }}>
            <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: SAGE }} />
            <div>
              <p className="text-sm font-semibold">Private by design</p>
              <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: `${INK}75` }}>
                Read-only OAuth · demo connections live on this device only, nothing leaves it.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border p-5" style={{ background: "#fff", borderColor: `${INK}12` }}>
            <RefreshCw size={18} className="mt-0.5 shrink-0" style={{ color: GOLD }} />
            <div>
              <p className="text-sm font-semibold">Auto-sync each morning</p>
              <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: `${INK}75` }}>
                Once linked, fresh steps, meals and sleep flow into your TenaScore automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
