"use client";

import { useWellness } from "@/context/WellnessContext";
import { useCoachChat } from "@/hooks/useCoachChat";

export default function ChatWindow() {
  const { messages, score } = useWellness();
  const { input, setInput, handleSubmit } = useCoachChat();

  return (
    <section className="min-w-0 rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">TenaBot</p>
          <h2 className="font-serif text-3xl text-[#0A2318]">AI wellness companion</h2>
        </div>
        <span className="rounded-full bg-[#D4C1A0]/45 px-3 py-2 text-sm font-semibold text-[#0A2318]">
          Score {score}
        </span>
      </div>

      <div className="mt-5 grid max-h-[480px] gap-3 overflow-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={
              msg.role === "assistant"
                ? "max-w-[88%] justify-self-start rounded-[1.5rem] rounded-bl-sm bg-[#E5EAE3] px-4 py-3 text-sm leading-6 text-[#0A2318]/74"
                : "max-w-[88%] justify-self-end rounded-[1.5rem] rounded-br-sm bg-[#0A2318] px-4 py-3 text-sm leading-6 text-[#E8EDE7]"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type today's stress, sleep, food, or energy..."
          className="h-12 rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-4 text-sm text-[#0A2318] outline-none placeholder:text-[#0A2318]/36 focus:border-[#8C6246] focus:bg-[#F3F5F1]"
        />
        <button
          type="submit"
          className="h-12 rounded-full bg-[#0A2318] px-6 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#1A3A2A]"
        >
          Send
        </button>
      </form>
    </section>
  );
}
