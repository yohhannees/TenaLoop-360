"use client";

import { FormEvent, useState } from "react";
import { useWellness } from "@/context/WellnessContext";
import { coachReply } from "@/lib/score";

export function useCoachChat() {
  const { score, checkIn, addMessage, award } = useWellness();
  const [input, setInput] = useState(
    "I am tired, stressed, slept 4 hours, and ate firfir with coffee.",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    addMessage({ role: "user", text: trimmed });
    addMessage({ role: "assistant", text: coachReply(trimmed, checkIn, score) });
    setInput("");
    award("Mind", 10);
  }

  return { input, setInput, handleSubmit };
}
