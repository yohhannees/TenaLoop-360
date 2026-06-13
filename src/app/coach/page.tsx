"use client";

import ChatWindow from "@/components/coach/ChatWindow";
import SafetyPanel from "@/components/coach/SafetyPanel";

export default function CoachPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#E5EAE3]">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C6246]">AI coach</p>
            <h1 className="mt-1 font-serif text-4xl leading-tight text-[#0A2318]">Talk it through</h1>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-lg border border-[#0A2318]/10 bg-white px-3 py-2 text-xs font-semibold text-[#0A2318]/68 shadow-sm shadow-[#0A2318]/5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4C956C]" />
            TenaBot online
          </div>
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <ChatWindow />
          <SafetyPanel />
        </div>
      </div>
    </main>
  );
}
