"use client";

import { useWellness } from "@/context/WellnessContext";
import { useCoachChat } from "@/hooks/useCoachChat";

export default function ChatWindow() {
  const { messages, score } = useWellness();
  const { input, setInput, handleSubmit } = useCoachChat();

  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase text-[#64756b]">TenaBot</p>
          <h2 className="text-2xl font-semibold">AI wellness companion</h2>
        </div>
        <span className="rounded-md bg-[#eef6f2] px-3 py-2 text-sm font-semibold text-[#0f6b52]">
          Score {score}
        </span>
      </div>

      <div className="mt-5 grid max-h-[480px] gap-3 overflow-auto pr-1">
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={
              msg.role === "assistant"
                ? "max-w-[88%] justify-self-start rounded-md bg-[#eef6f2] px-4 py-3 text-sm leading-6 text-[#20372d]"
                : "max-w-[88%] justify-self-end rounded-md bg-[#0f6b52] px-4 py-3 text-sm leading-6 text-white"
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
          className="h-12 rounded-md border border-[#cddbd3] bg-white px-3 text-sm text-[#23362c] outline-none focus:border-[#0f6b52]"
        />
        <button
          type="submit"
          className="h-12 rounded-md bg-[#0f6b52] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b5944]"
        >
          Send
        </button>
      </form>
    </section>
  );
}
