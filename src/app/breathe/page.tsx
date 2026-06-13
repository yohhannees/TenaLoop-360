"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const GOLD = "#C2913C";

type PhaseKey = "inhale" | "hold" | "exhale";

const PHASES: { key: PhaseKey; label: string; am: string; cue: string; secs: number; scale: number }[] = [
  { key: "inhale", label: "Inhale", am: "ትንፍስ", cue: "Tinfis. Inhale slowly through the nose.", secs: 4, scale: 1.5 },
  { key: "hold", label: "Soften", am: "ተዝናና", cue: "Tezenana. Soften your shoulders.", secs: 4, scale: 1.5 },
  { key: "exhale", label: "Exhale", am: "ዕፎይ", cue: "Efoy. Let everything go.", secs: 6, scale: 0.72 },
];

const CYCLE_OPTIONS = [4, 6, 8];

export default function BreathePage() {
  const { award } = useWellness();
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(6);
  const [sound, setSound] = useState(false);
  const awardedRef = useRef(false);

  const phase = PHASES[phaseIndex];

  // Phase sequencer
  useEffect(() => {
    if (status !== "running") return;
    const cur = PHASES[phaseIndex];
    const t = setTimeout(() => {
      if (phaseIndex < PHASES.length - 1) {
        setPhaseIndex((i) => i + 1);
      } else if (cycle >= totalCycles) {
        setStatus("done");
      } else {
        setCycle((c) => c + 1);
        setPhaseIndex(0);
      }
    }, cur.secs * 1000);
    return () => clearTimeout(t);
  }, [status, phaseIndex, cycle, totalCycles]);

  // Voice cues
  useEffect(() => {
    if (status !== "running" || !sound) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(PHASES[phaseIndex].cue);
    u.rate = 0.7;
    u.pitch = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, [status, phaseIndex, sound]);

  // Reward once on completion
  useEffect(() => {
    if (status === "done" && !awardedRef.current) {
      awardedRef.current = true;
      award("Mind", 14);
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function start() {
    awardedRef.current = false;
    setCycle(1);
    setPhaseIndex(0);
    setStatus("running");
  }
  function reset() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    awardedRef.current = false;
    setStatus("idle");
    setPhaseIndex(0);
    setCycle(1);
  }

  const isActive = status === "running" || status === "paused";
  const orbScale = status === "running" ? phase.scale : status === "paused" ? phase.scale : 1;
  const orbDuration = status === "running" ? phase.secs : 0.4;

  return (
    <div
      className="-mx-4 -my-6 flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:min-h-screen lg:px-10"
      style={{ background: PAPER, color: INK }}
    >
      {/* Header */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color: `${INK}70` }}>Tinfash breathing</p>
          <p className="mt-0.5 font-serif text-lg italic" style={{ color: `${INK}90` }}>What healing knows</p>
        </div>
        <button onClick={() => setSound((s) => !s)}
          className="grid h-10 w-10 place-items-center rounded-full transition" style={{ border: `1px solid ${INK}18`, color: sound ? SAGE : `${INK}55` }}
          title={sound ? "Voice on" : "Voice off"}>
          {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </div>

      {/* Orb */}
      <div className="relative grid place-items-center" style={{ width: 340, height: 340 }}>
        {/* breathing glow */}
        <motion.div
          className="absolute rounded-full blur-2xl"
          style={{ width: 280, height: 280, background: SAGE }}
          animate={{ scale: orbScale * 0.9, opacity: isActive ? 0.4 : 0.22 }}
          transition={{ duration: orbDuration, ease: "easeInOut" }}
        />
        {/* concentric rings */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 240, height: 240, border: `1px solid ${SAGE}55` }}
          animate={{ scale: orbScale }}
          transition={{ duration: orbDuration, ease: "easeInOut" }}
        />
        {/* core */}
        <motion.div
          className="relative grid place-items-center rounded-full"
          style={{ width: 180, height: 180, background: "#fff", border: `1.5px solid ${SAGE}`, boxShadow: `inset 0 0 50px ${SAGE}22` }}
          animate={{ scale: orbScale }}
          transition={{ duration: orbDuration, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={status === "done" ? "done" : status === "idle" ? "idle" : phase.key}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="flex flex-col items-center text-center"
            >
              {status === "done" ? (
                <Check size={40} strokeWidth={2.5} style={{ color: SAGE }} />
              ) : status === "idle" ? (
                <span className="font-serif text-xl italic" style={{ color: `${INK}70` }}>ready</span>
              ) : (
                <>
                  <span className="font-serif text-3xl" style={{ color: SAGE }}>{phase.am}</span>
                  <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: `${INK}70` }}>{phase.label}</span>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Status line */}
      <div className="mt-10 h-6 text-center">
        {status === "running" && (
          <p className="text-sm font-semibold" style={{ color: `${INK}70` }}>
            Cycle {cycle} of {totalCycles}
          </p>
        )}
        {status === "paused" && <p className="text-sm font-semibold" style={{ color: GOLD }}>Paused</p>}
        {status === "done" && <p className="font-serif text-xl" style={{ color: INK }}>ዕፎይ — rest now. +14 points earned.</p>}
        {status === "idle" && <p className="text-sm" style={{ color: `${INK}60` }}>Three counts in, soften, six counts out.</p>}
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-5">
        {status === "idle" && (
          <>
            <div className="flex gap-2">
              {CYCLE_OPTIONS.map((n) => (
                <button key={n} onClick={() => setTotalCycles(n)}
                  className="h-10 w-16 rounded-full text-sm font-semibold transition"
                  style={totalCycles === n
                    ? { background: INK, color: PAPER }
                    : { border: `1.5px solid ${INK}18`, color: `${INK}70` }}>
                  {n}×
                </button>
              ))}
            </div>
            <button onClick={start}
              className="flex h-14 items-center gap-3 rounded-full px-10 text-sm font-bold uppercase tracking-[0.2em] transition active:scale-95"
              style={{ background: SAGE, color: "#fff", boxShadow: `0 10px 30px ${SAGE}44` }}>
              <Play size={18} /> Begin
            </button>
          </>
        )}

        {isActive && (
          <div className="flex gap-3">
            <button onClick={() => setStatus(status === "running" ? "paused" : "running")}
              className="flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold transition active:scale-95"
              style={{ background: INK, color: PAPER }}>
              {status === "running" ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
            </button>
            <button onClick={reset}
              className="grid h-12 w-12 place-items-center rounded-full transition" style={{ border: `1.5px solid ${INK}18`, color: `${INK}60` }}>
              <RotateCcw size={17} />
            </button>
          </div>
        )}

        {status === "done" && (
          <button onClick={reset}
            className="flex h-14 items-center gap-3 rounded-full px-10 text-sm font-bold uppercase tracking-[0.2em] transition active:scale-95"
            style={{ background: INK, color: PAPER }}>
            <RotateCcw size={17} /> Breathe again
          </button>
        )}
      </div>

      {/* Footnote */}
      <p className="absolute bottom-6 left-0 right-0 px-6 text-center text-[11px] leading-5" style={{ color: `${INK}45` }}>
        A rooted reset, not medical care. Inspired by Ethiopian breath practice — ትንፍስ · ተዝናና · ዕፎይ.
      </p>
    </div>
  );
}
