"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Bot,
  BrainCircuit,
  ChevronRight,
  Moon,
  Send,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { useCoachChat } from "@/hooks/useCoachChat";
import { cn } from "@/lib/utils";

function scoreTone(score: number) {
  if (score >= 75) return { text: "#276442", bg: "#EAF4EE", border: "#4C956C44" };
  if (score >= 55) return { text: "#8C6246", bg: "#FFF6DD", border: "#EFB84C55" };
  return { text: "#B23A24", bg: "#FCECE7", border: "#D65A3144" };
}

export default function ChatWindow() {
  const { messages, score, scoreLabel, checkIn } = useWellness();
  const { input, setInput, handleSubmit, sendMessage, quickPrompts, isSending, error } = useCoachChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tone = scoreTone(score);
  const starterPrompts = quickPrompts.slice(0, 4);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending]);

  return (
    <section className="grid min-h-[720px] min-w-0 overflow-hidden rounded-lg border border-[#0A2318]/10 bg-white shadow-sm shadow-[#0A2318]/5 xl:h-[calc(100vh-150px)] xl:min-h-[680px]">
      <div className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto]">
        <header className="border-b border-[#0A2318]/10 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#0A2318] text-[#EFB84C]">
                <Bot size={24} />
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-[#4C956C]" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C6246]">TenaBot</p>
                <h2 className="mt-1 font-serif text-2xl leading-none text-[#0A2318]">Calm coaching session</h2>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[430px]">
              <SignalChip icon={BrainCircuit} label="Score" value={`${score}`} tone={tone} />
              <SignalChip icon={Zap} label="Stress" value={`${checkIn.stress}/10`} />
              <SignalChip icon={Moon} label="Sleep" value={`${checkIn.sleep}h`} />
              <SignalChip icon={Activity} label="Move" value={`${checkIn.movement}m`} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold"
              style={{ color: tone.text, backgroundColor: tone.bg, borderColor: tone.border }}
            >
              {scoreLabel} zone
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 py-1.5 text-xs font-semibold text-[#0A2318]/62">
              <ShieldCheck size={14} className="text-[#4C956C]" />
              Wellness guidance, not emergency care
            </span>
          </div>
        </header>

        <div ref={scrollRef} className="no-scrollbar min-h-0 min-w-0 overflow-x-hidden overflow-y-auto bg-[#F7F9F5] px-4 py-5 sm:px-5">
          <div className="grid w-full min-w-0 justify-items-stretch gap-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={`${msg.role}-${index}-${msg.text.slice(0, 16)}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={cn(
                    "w-full min-w-0",
                    msg.role === "assistant"
                      ? "grid grid-cols-[auto_minmax(0,1fr)] gap-3"
                      : "flex justify-end",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#0A2318] text-[#EFB84C]">
                      <Bot size={16} />
                    </span>
                  ) : null}

                  <div
                    className={cn(
                      "min-w-0 max-w-xl break-words rounded-lg px-4 py-3 text-sm leading-6 shadow-sm",
                      msg.role === "assistant"
                        ? "border border-[#0A2318]/10 bg-white text-[#0A2318]"
                        : "bg-[#0A2318] text-[#E8EDE7]",
                    )}
                  >
                    {msg.text.split("\n").map((line, lineIndex) => (
                      <p key={`${index}-${lineIndex}`} className={lineIndex > 0 ? "mt-3" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {messages.length <= 1 ? (
              <div className="grid min-w-0 gap-3 pt-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="group flex min-h-20 min-w-0 items-start justify-between gap-3 rounded-lg border border-[#0A2318]/10 bg-white p-4 text-left text-sm font-semibold leading-5 text-[#0A2318] shadow-sm shadow-[#0A2318]/5 transition hover:-translate-y-0.5 hover:border-[#0A2318]/24 hover:shadow-md"
                  >
                    <span className="min-w-0">{prompt}</span>
                    <ChevronRight size={16} className="mt-0.5 shrink-0 text-[#8C6246] transition group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            ) : null}

            {isSending ? (
              <div className="flex items-center gap-3 rounded-lg border border-[#0A2318]/10 bg-white px-4 py-3 text-sm text-[#0A2318]/62 shadow-sm">
                <span className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-1.5 w-1.5 rounded-full bg-[#8C6246]"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1, repeat: Infinity, delay: dot * 0.18 }}
                    />
                  ))}
                </span>
                TenaBot is thinking
              </div>
            ) : null}
          </div>
        </div>

        <footer className="border-t border-[#0A2318]/10 bg-white p-4 sm:p-5">
          {error ? (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-[#D65A31]/20 bg-[#FCECE7] px-3 py-2 text-xs leading-5 text-[#8A2F1E]">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          ) : null}

          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                disabled={isSending}
                className="whitespace-nowrap rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 py-2 text-xs font-semibold text-[#0A2318]/68 transition hover:border-[#0A2318]/24 hover:bg-[#EAF4EE] disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-lg border border-[#0A2318]/12 bg-[#F7F9F5] p-2 shadow-inner shadow-[#0A2318]/5">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tell TenaBot what is happening..."
              rows={1}
              className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-[#0A2318] outline-none placeholder:text-[#0A2318]/40"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#0A2318] text-[#E8EDE7] transition hover:bg-[#173829] active:scale-95 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </footer>
      </div>
    </section>
  );
}

function SignalChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: { text: string; bg: string; border: string };
}) {
  return (
    <div
      className="min-w-0 rounded-lg border bg-[#F7F9F5] px-3 py-2"
      style={tone ? { backgroundColor: tone.bg, borderColor: tone.border } : undefined}
    >
      <div className="flex items-center gap-1.5 text-[#8C6246]" style={tone ? { color: tone.text } : undefined}>
        <Icon size={13} />
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-1 truncate text-sm font-bold text-[#0A2318]">{value}</p>
    </div>
  );
}
