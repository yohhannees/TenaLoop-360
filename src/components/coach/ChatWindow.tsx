"use client";

import { Bot, Send, Sparkles } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { useCoachChat } from "@/hooks/useCoachChat";
import { cn } from "@/lib/utils";

export default function ChatWindow() {
  const { messages, score, scoreLabel, checkIn, foodSignal } = useWellness();
  const { input, setInput, handleSubmit, sendMessage, quickPrompts, isSending, error } =
    useCoachChat();

  return (
    <section className="min-w-0 overflow-hidden rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
            <Bot size={16} />
            TenaBot
          </div>
          <h2 className="mt-1 font-serif text-3xl text-[#0A2318]">Wellness support coach</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#0A2318]/62">
            Ask for a reset plan, food swap, sleep routine, movement break, or support path.
          </p>
        </div>

        <div className="grid w-full min-w-0 grid-cols-3 gap-2 text-center sm:w-auto sm:min-w-64">
          <SignalPill label="Score" value={`${score}`} tone={score < 55 ? "warn" : score < 70 ? "mid" : "good"} />
          <SignalPill label="Zone" value={scoreLabel} tone={score < 55 ? "warn" : "mid"} />
          <SignalPill label="Food" value={foodSignal.risk} tone={foodSignal.risk === "High" ? "warn" : foodSignal.risk === "Medium" ? "mid" : "good"} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-[1.5rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3 text-sm sm:grid-cols-3 xl:grid-cols-6">
        <MiniSignal label="Stress" value={`${checkIn.stress}/10`} />
        <MiniSignal label="Sleep" value={`${checkIn.sleep}h`} />
        <MiniSignal label="Movement" value={`${checkIn.movement}m`} />
        <MiniSignal label="Support" value={checkIn.support} />
        <MiniSignal
          label="Body"
          value={
            checkIn.painAreas.length
              ? `${checkIn.painAreas.length} area${checkIn.painAreas.length > 1 ? "s" : ""}`
              : "Clear"
          }
        />
        <MiniSignal
          label="Women"
          value={checkIn.womenWellness ? checkIn.cycleContext : "Off"}
        />
      </div>

      <div className="mt-5 flex max-w-full min-w-0 gap-2 overflow-x-auto pb-1 no-scrollbar">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={isSending}
            onClick={() => void sendMessage(prompt)}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-[#0A2318]/10 bg-[#E5EAE3] px-3.5 text-xs font-semibold text-[#0A2318]/68 transition hover:border-[#8C6246] hover:text-[#0A2318] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Sparkles size={13} />
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-4 grid max-h-[520px] gap-3 overflow-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={cn(
              "whitespace-pre-line text-sm leading-6",
              msg.role === "assistant"
                ? "max-w-[92%] justify-self-start rounded-[1.5rem] rounded-bl-sm bg-[#E5EAE3] px-4 py-3 text-[#0A2318]/76"
                : "max-w-[92%] justify-self-end rounded-[1.5rem] rounded-br-sm bg-[#0A2318] px-4 py-3 text-[#E8EDE7]",
            )}
          >
            {msg.text}
          </div>
        ))}
        {isSending && (
          <div className="max-w-[92%] justify-self-start rounded-[1.5rem] rounded-bl-sm bg-[#E5EAE3] px-4 py-3 text-sm leading-6 text-[#0A2318]/58">
            TenaBot is reading your score, body signals, and support path...
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-2xl border border-[#8C6246]/18 bg-[#D4C1A0]/24 px-4 py-2 text-xs leading-5 text-[#0A2318]/60">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          value={input}
          disabled={isSending}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell TenaBot what is happening today..."
          className="h-12 min-w-0 rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-4 text-sm text-[#0A2318] outline-none placeholder:text-[#0A2318]/36 focus:border-[#8C6246] focus:bg-[#F3F5F1] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0A2318] px-6 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#1A3A2A] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Send size={16} />
          {isSending ? "Thinking" : "Send"}
        </button>
      </form>
    </section>
  );
}

function SignalPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "mid" | "warn";
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-2xl px-2 py-2 sm:px-3",
        tone === "good" && "bg-[#0A2318] text-[#E8EDE7]",
        tone === "mid" && "bg-[#D4C1A0]/45 text-[#0A2318]",
        tone === "warn" && "bg-[#8C6246] text-[#E8EDE7]",
      )}
    >
      <p className="text-[10px] font-bold uppercase opacity-70">{label}</p>
      <p className="truncate text-xs font-semibold sm:text-sm">{value}</p>
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase text-[#0A2318]/40">{label}</p>
      <p className="mt-0.5 truncate font-semibold text-[#0A2318]">{value}</p>
    </div>
  );
}
