"use client";

import { FormEvent, useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { coachReply } from "@/lib/score";
import { ChatMessage } from "@/lib/types";

const QUICK_PROMPTS = [
  "Make me a 10-minute reset plan",
  "My neck and shoulders hurt",
  "I need a cycle-aware gentle plan",
  "I feel anxious and cannot focus",
  "What should I eat next with my current score?",
  "Help me sleep better tonight",
  "Should I join a circle or book support?",
];

export function useCoachChat() {
  const { score, checkIn, messages, addMessage, award } = useWellness();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    const nextMessages = [...messages.slice(-9), userMessage];

    addMessage(userMessage);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          messages: nextMessages,
          checkIn,
          score,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        reply?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.reply) {
        throw new Error(data?.error || "TenaBot could not reach the AI service.");
      }

      addMessage({ role: "assistant", text: data.reply });
      award("Mind", 10);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "TenaBot could not reach the AI service.";
      setError(message);
      addMessage({
        role: "assistant",
        text: `${coachReply(trimmed, checkIn, score)}\n\nConnection note: ${message}`,
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return {
    input,
    setInput,
    handleSubmit,
    sendMessage,
    quickPrompts: QUICK_PROMPTS,
    isSending,
    error,
  };
}
