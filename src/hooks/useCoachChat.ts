"use client";

import { FormEvent, useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { coachReply } from "@/lib/score";

const QUICK_PROMPTS = [
  "Make me a 10-minute reset plan",
  "I feel anxious and cannot focus",
  "What should I eat next with my current score?",
  "Help me sleep better tonight",
  "Should I join a circle or book support?",
];

export function useCoachChat() {
  const { score, checkIn, addMessage, award } = useWellness();
  const [input, setInput] = useState("");

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    addMessage({ role: "user", text: trimmed });
    addMessage({ role: "assistant", text: coachReply(trimmed, checkIn, score) });
    setInput("");
    award("Mind", 10);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return { input, setInput, handleSubmit, sendMessage, quickPrompts: QUICK_PROMPTS };
}
