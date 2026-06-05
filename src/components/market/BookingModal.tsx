"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, X } from "lucide-react";
import { ExtendedProvider } from "@/lib/market-providers";
import { cn } from "@/lib/utils";

type Step      = "slot" | "details" | "payment" | "confirmed";
type PayMethod = "telebirr" | "cbe" | "venue";

const STEP_LABELS: Record<Step, string> = {
  slot:      "Choose a time",
  details:   "Your details",
  payment:   "Payment",
  confirmed: "Booking confirmed!",
};

function makeDateOptions() {
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label =
      i === 0 ? "Today" :
      i === 1 ? "Tomorrow" :
      d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return { id: d.toISOString().split("T")[0], label };
  });
}

function makeBookingRef() {
  return `TL-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

type Props = { provider: ExtendedProvider; onClose: () => void; onConfirm: () => void };

export default function BookingModal({ provider, onClose, onConfirm }: Props) {
  const [dateOptions] = useState(makeDateOptions);
  const [bookingRef] = useState(makeBookingRef);

  const [step,      setStep]      = useState<Step>("slot");
  const [date,      setDate]      = useState(() => dateOptions[0].id);
  const [slot,      setSlot]      = useState("");
  const [name,      setName]      = useState("Dawit M.");
  const [phone,     setPhone]     = useState("");
  const [note,      setNote]      = useState("");
  const [method,    setMethod]    = useState<PayMethod | null>(null);
  const [copied,    setCopied]    = useState(false);

  const STEPS: Step[] = ["slot", "details", "payment", "confirmed"];
  const idx = STEPS.indexOf(step);

  const dateLabel = dateOptions.find((d) => d.id === date)?.label ?? "Today";

  function copy() {
    const text = [
      `TenaLoop Booking — ${bookingRef}`,
      `Provider: ${provider.name}`,
      `Date: ${dateLabel}  Time: ${slot}`,
      `Amount: ${provider.price}`,
      `Phone: ${provider.phone}`,
    ].join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  function confirm() {
    onConfirm();
    setStep("confirmed");
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      style={{ backgroundColor: "rgba(10,35,24,0.65)", backdropFilter: "blur(5px)" }}
    >
      {/* backdrop close */}
      {step !== "confirmed" && (
        <div className="absolute inset-0" onClick={onClose} />
      )}

      <div className="relative w-full max-w-md overflow-hidden rounded-t-[2.5rem] bg-[#E8EDE7] shadow-2xl shadow-[#0A2318]/30 sm:rounded-[2.5rem] max-h-[92vh] overflow-y-auto">

        {/* ── Sticky header ─────────────────────────── */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#0A2318]/8 bg-[#E8EDE7] px-5 py-4">
          <div className="flex items-center gap-3">
            {idx > 0 && step !== "confirmed" && (
              <button
                type="button"
                onClick={() => setStep(STEPS[idx - 1] as Step)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[#0A2318]/12 text-[#0A2318]/55 transition hover:text-[#0A2318]"
              >
                <ArrowLeft size={15} />
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase text-[#8C6246]">
                {step !== "confirmed" ? `Step ${idx + 1} of 3` : "Complete"}
              </p>
              <p className="font-serif text-xl text-[#0A2318]">{STEP_LABELS[step]}</p>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {STEPS.slice(0, 3).map((s, i) => (
              <span
                key={s}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i < idx || step === "confirmed" ? "w-4 bg-[#0A2318]" : i === idx ? "w-3 bg-[#8C6246]" : "w-2 bg-[#0A2318]/18",
                )}
              />
            ))}
            {step !== "confirmed" && (
              <button
                type="button"
                onClick={onClose}
                className="ml-2 grid h-7 w-7 place-items-center rounded-full border border-[#0A2318]/12 text-[#0A2318]/45"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Provider pill */}
          {step !== "confirmed" && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#E5EAE3] px-4 py-3">
              <span className="text-2xl leading-none">{provider.emoji}</span>
              <div>
                <p className="font-semibold text-[#0A2318]">{provider.name}</p>
                <p className="text-xs text-[#0A2318]/55">{provider.type} · <span className="font-bold text-[#8C6246]">{provider.price}</span></p>
              </div>
            </div>
          )}

          {/* ── STEP 1: Date + Time ─────────────────── */}
          {step === "slot" && (
            <div className="grid gap-5">
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/42">Select date</p>
                <div className="grid grid-cols-4 gap-2">
                  {dateOptions.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDate(id)}
                      className={cn(
                        "rounded-2xl border py-3 text-center text-xs font-semibold leading-tight transition",
                        date === id
                          ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                          : "border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/65 hover:border-[#0A2318]/30",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/42">Select time</p>
                <div className="flex flex-wrap gap-2">
                  {provider.slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cn(
                        "h-10 rounded-full border px-4 text-sm font-medium transition",
                        slot === s
                          ? "border-[#8C6246] bg-[#8C6246] text-[#E8EDE7]"
                          : "border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/65 hover:border-[#8C6246]/40",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {!provider.availableToday && (
                  <p className="mt-2 text-xs text-[#0A2318]/40">
                    Provider not available today — select a future date above.
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!slot}
                onClick={() => setStep("details")}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A] disabled:opacity-30"
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Details ─────────────────────── */}
          {step === "details" && (
            <div className="grid gap-4">
              {[
                { label: "Your name",     value: name,  set: setName,  placeholder: "Full name" },
                { label: "Phone number",  value: phone, set: setPhone, placeholder: "+251 9X XXX XXXX" },
              ].map(({ label, value, set, placeholder }) => (
                <label key={label} className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase text-[#0A2318]/42">{label}</span>
                  <input
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className="h-11 rounded-2xl border border-[#0A2318]/12 bg-[#E5EAE3] px-4 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                  />
                </label>
              ))}

              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase text-[#0A2318]/42">Note for provider (optional)</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Any special requests or health notes…"
                  className="w-full resize-none rounded-2xl border border-[#0A2318]/12 bg-[#E5EAE3] p-3 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                />
              </label>

              <button
                type="button"
                onClick={() => setStep("payment")}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ── STEP 3: Payment ─────────────────────── */}
          {step === "payment" && (
            <div className="grid gap-4">
              {/* Booking summary */}
              <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-4 text-sm">
                <p className="mb-2 text-[10px] font-bold uppercase text-[#0A2318]/40">Booking summary</p>
                <div className="grid gap-1.5">
                  {[
                    ["Date",  dateLabel],
                    ["Time",  slot],
                    ["Name",  name],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[#0A2318]/50">{k}</span>
                      <span className="font-medium text-[#0A2318]">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-[#0A2318]/8 pt-2 mt-1">
                    <span className="font-semibold text-[#0A2318]">Total</span>
                    <span className="font-bold text-[#8C6246]">{provider.price}</span>
                  </div>
                </div>
              </div>

              {/* Method selection */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/42">Payment method</p>
                <div className="grid gap-2">
                  {[
                    { id: "telebirr" as PayMethod, label: "Telebirr",     icon: "📱", sub: "Ethio Telecom mobile wallet" },
                    { id: "cbe"      as PayMethod, label: "CBE Birr",      icon: "🏦", sub: "Commercial Bank of Ethiopia" },
                    { id: "venue"    as PayMethod, label: "Pay at venue",  icon: "💵", sub: "Cash or card on arrival"     },
                  ].map(({ id, label, icon, sub }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition",
                        method === id
                          ? "border-[#0A2318] bg-[#0A2318]"
                          : "border-[#0A2318]/12 bg-[#E5EAE3] hover:border-[#0A2318]/28",
                      )}
                    >
                      <span className="shrink-0 text-xl leading-none">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold", method === id ? "text-[#E8EDE7]" : "text-[#0A2318]")}>{label}</p>
                        <p className={cn("text-xs", method === id ? "text-[#D4C1A0]/65" : "text-[#0A2318]/45")}>{sub}</p>
                      </div>
                      {method === id && <Check size={16} className="shrink-0 text-[#D4C1A0]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment detail panel */}
              {method === "telebirr" && (
                <div className="overflow-hidden rounded-2xl border-2 border-[#1C6B35]/30">
                  <div className="flex items-center justify-between bg-[#1C6B35] px-4 py-3">
                    <span className="text-xl font-black tracking-tight text-white">telebirr</span>
                    <span className="text-xs text-white/60">Send Money</span>
                  </div>
                  <div className="bg-white p-4 grid gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400">Send to</p>
                      <p className="text-base font-semibold text-[#0A2318]">{provider.phone}</p>
                      <p className="text-xs text-gray-400">{provider.name}</p>
                    </div>
                    <div className="flex items-start gap-8">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">Amount</p>
                        <p className="font-serif text-3xl font-bold text-[#1C6B35]">{provider.price.split(" ")[0]}</p>
                        <p className="text-xs text-gray-400">Ethiopian Birr</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-gray-400">Reference</p>
                        <p className="font-mono text-base font-semibold text-[#0A2318]">{bookingRef}</p>
                        <p className="text-xs text-gray-400">Include when sending</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={copy}
                      className="flex h-9 items-center justify-center gap-2 rounded-full bg-[#1C6B35]/10 text-xs font-semibold text-[#1C6B35] transition hover:bg-[#1C6B35]/18"
                    >
                      <Copy size={13} />{copied ? "Copied!" : "Copy payment details"}
                    </button>
                  </div>
                </div>
              )}

              {method === "cbe" && (
                <div className="overflow-hidden rounded-2xl border-2 border-[#003F8A]/20">
                  <div className="flex items-center justify-between bg-[#003F8A] px-4 py-3">
                    <span className="text-base font-black tracking-tight text-white">CBE Birr</span>
                    <span className="text-xs text-white/60">Bank Transfer</span>
                  </div>
                  <div className="bg-white p-4 grid gap-2 text-sm">
                    {[
                      ["Account number", "1000 8765 4321 09"],
                      ["Account name",   "TenaLoop Wellness PLC"],
                      ["Amount",         provider.price],
                      ["Reference",      bookingRef],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-gray-400">{k}</span>
                        <span className={cn("font-semibold text-right", k === "Reference" && "font-mono")}>{v}</span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={copy}
                      className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#003F8A]/8 text-xs font-semibold text-[#003F8A]"
                    >
                      <Copy size={13} />{copied ? "Copied!" : "Copy transfer details"}
                    </button>
                  </div>
                </div>
              )}

              {method === "venue" && (
                <div className="rounded-2xl border border-[#0A2318]/12 bg-[#E5EAE3] p-4 text-sm">
                  <p className="mb-2 text-xs font-bold uppercase text-[#0A2318]/40">Pay on arrival</p>
                  <p className="text-[#0A2318]/70 leading-6">
                    Show booking reference <span className="font-mono font-bold text-[#0A2318]">{bookingRef}</span> when you arrive at <strong>{provider.name}</strong>.
                  </p>
                  <div className="mt-3 grid gap-1.5 text-xs text-[#0A2318]/55">
                    <p>📍 {provider.area} · {provider.distance}</p>
                    <p>⏰ {provider.hours}</p>
                    <p>✅ Cash and Telebirr both accepted at venue</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!method}
                onClick={confirm}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#8C6246] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38] disabled:opacity-30"
              >
                Confirm booking <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* ── STEP 4: Confirmed ───────────────────── */}
          {step === "confirmed" && (
            <div className="grid gap-5 py-2 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#0A2318]">
                <Check size={36} strokeWidth={2.5} className="text-[#D4C1A0]" />
              </div>

              <div>
                <p className="font-serif text-3xl text-[#0A2318]">You&apos;re booked!</p>
                <p className="mt-1.5 font-mono text-xl font-bold text-[#8C6246]">{bookingRef}</p>
              </div>

              <div className="rounded-2xl bg-[#E5EAE3] p-4 text-left text-sm">
                <p className="mb-2 text-[10px] font-bold uppercase text-[#0A2318]/40">Booking details</p>
                <div className="grid gap-1.5">
                  {[
                    ["Provider", provider.name],
                    ["Date",     dateLabel],
                    ["Time",     slot],
                    ["Amount",   provider.price],
                    ["Method",   method === "telebirr" ? "Telebirr" : method === "cbe" ? "CBE Birr" : "Pay at venue"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[#0A2318]/50">{k}</span>
                      <span className="font-medium text-[#0A2318]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#8C6246]/12 px-4 py-3">
                <p className="text-sm font-bold text-[#8C6246]">Experience stamp earned · +30 pts</p>
                <p className="mt-0.5 text-xs text-[#0A2318]/55">
                  Show reference <span className="font-mono font-semibold">{bookingRef}</span> on arrival.
                </p>
              </div>

              <p className="text-xs leading-5 text-[#0A2318]/45">
                {provider.name} will reach you at {phone || "your number"} to confirm.
                {method === "telebirr" && ` Send ${provider.price} to ${provider.phone} with reference ${bookingRef}.`}
                {method === "cbe"      && ` Transfer to CBE account 1000 8765 4321 09 with reference ${bookingRef}.`}
                {method === "venue"    && " Pay when you arrive — cash or Telebirr accepted on site."}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
