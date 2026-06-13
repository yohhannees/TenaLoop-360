"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Copy, MapPin, X } from "lucide-react";
import { ExtendedProvider } from "@/lib/market-providers";
import { cn } from "@/lib/utils";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const SAGE = "#5E7A5C";
const GOLD = "#C2913C";
const BROWN = "#9A6B4A";

type Step = "slot" | "details" | "payment" | "confirmed";
type PayMethod = "telebirr" | "cbe" | "venue";
type BookingDetails = {
  providerName: string; bookingRef: string; bookingDate: string; slot: string;
  customerName: string; phone: string; note: string; paymentMethod: PayMethod; price: string;
};

const STEP_LABELS: Record<Step, string> = {
  slot: "Choose a time",
  details: "Your details",
  payment: "Payment",
  confirmed: "Booking confirmed",
};

function makeDateOptions() {
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return { id: d.toISOString().split("T")[0], label };
  });
}

function makeBookingRef() {
  return `TL-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

type Props = {
  provider: ExtendedProvider;
  onClose: () => void;
  onConfirm: (details: BookingDetails) => void;
};

export default function BookingModal({ provider, onClose, onConfirm }: Props) {
  const [dateOptions] = useState(makeDateOptions);
  const [bookingRef] = useState(makeBookingRef);

  const [step, setStep] = useState<Step>("slot");
  const [date, setDate] = useState(() => dateOptions[0].id);
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<PayMethod | null>(null);
  const [copied, setCopied] = useState(false);

  const STEPS: Step[] = ["slot", "details", "payment", "confirmed"];
  const idx = STEPS.indexOf(step);
  const dateLabel = dateOptions.find((d) => d.id === date)?.label ?? "Today";

  function copy() {
    const text = [
      `TenaLoop Booking - ${bookingRef}`,
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
    if (!method) return;
    onConfirm({
      providerName: provider.name, bookingRef, bookingDate: date, slot,
      customerName: name, phone, note, paymentMethod: method, price: provider.price,
    });
    setStep("confirmed");
  }

  const inputStyle = { background: PAPER, border: `1px solid ${INK}16`, color: INK } as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      style={{ backgroundColor: "rgba(33,29,23,0.6)", backdropFilter: "blur(6px)" }}>
      {step !== "confirmed" && <div className="absolute inset-0" onClick={onClose} />}

      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-lg shadow-2xl sm:rounded-lg"
        style={{ background: "#fff" }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4" style={{ background: "#fff", borderBottom: `1px solid ${INK}0D` }}>
          <div className="flex items-center gap-3">
            {idx > 0 && step !== "confirmed" && (
              <button type="button" onClick={() => setStep(STEPS[idx - 1])}
                className="grid h-8 w-8 place-items-center rounded-lg transition" style={{ border: `1px solid ${INK}14`, color: `${INK}60` }}>
                <ArrowLeft size={15} />
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: BROWN }}>
                {step !== "confirmed" ? `Step ${idx + 1} of 3` : "Complete"}
              </p>
              <p className="font-serif text-xl" style={{ color: INK }}>{STEP_LABELS[step]}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.slice(0, 3).map((s, i) => (
              <span key={s} className="h-2 rounded-full transition-all"
                style={{
                  width: i < idx || step === "confirmed" ? 16 : i === idx ? 12 : 8,
                  background: i < idx || step === "confirmed" ? INK : i === idx ? GOLD : `${INK}1F`,
                }} />
            ))}
            {step !== "confirmed" && (
              <button type="button" onClick={onClose} className="ml-2 grid h-7 w-7 place-items-center rounded-lg" style={{ border: `1px solid ${INK}14`, color: `${INK}45` }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Provider pill */}
          {step !== "confirmed" && (
            <div className="mb-5 flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: PAPER }}>
              <span className="grid h-10 w-10 place-items-center rounded-lg text-xs font-bold" style={{ background: INK, color: PAPER }}>{provider.emoji}</span>
              <div>
                <p className="font-semibold" style={{ color: INK }}>{provider.name}</p>
                <p className="text-xs" style={{ color: `${INK}60` }}>{provider.type} &middot; <span className="font-bold" style={{ color: BROWN }}>{provider.price}</span></p>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === "slot" && (
            <div className="grid gap-5">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}50` }}>Select date</p>
                <div className="grid grid-cols-4 gap-2">
                  {dateOptions.map(({ id, label }) => {
                    const on = date === id;
                    return (
                      <button key={id} type="button" onClick={() => setDate(id)}
                        className="rounded-lg py-3 text-center text-xs font-semibold leading-tight transition"
                        style={{ background: on ? INK : PAPER, color: on ? PAPER : `${INK}70`, border: `1px solid ${on ? INK : `${INK}12`}` }}>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}50` }}>Select time</p>
                <div className="flex flex-wrap gap-2">
                  {provider.slots.map((s) => {
                    const on = slot === s;
                    return (
                      <button key={s} type="button" onClick={() => setSlot(s)}
                        className="h-10 rounded-lg px-4 text-sm font-medium transition"
                        style={{ background: on ? GOLD : PAPER, color: on ? "#fff" : `${INK}70`, border: `1px solid ${on ? GOLD : `${INK}12`}` }}>
                        {s}
                      </button>
                    );
                  })}
                </div>
                {!provider.availableToday && (
                  <p className="mt-2 text-xs" style={{ color: `${INK}45` }}>Provider not available today - select a future date above.</p>
                )}
              </div>

              <button type="button" disabled={!slot} onClick={() => setStep("details")}
                className="flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:opacity-30"
                style={{ background: INK, color: PAPER }}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === "details" && (
            <div className="grid gap-4">
              {[
                { label: "Your name", value: name, set: setName, placeholder: "Full name" },
                { label: "Phone number", value: phone, set: setPhone, placeholder: "+251 9X XXX XXXX" },
              ].map(({ label, value, set, placeholder }) => (
                <label key={label} className="grid gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}50` }}>{label}</span>
                  <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                    className="h-11 rounded-lg px-4 text-sm outline-none" style={inputStyle} />
                </label>
              ))}
              <label className="grid gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}50` }}>Note for provider (optional)</span>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Any special requests or health notes..."
                  className="w-full resize-none rounded-lg p-3 text-sm outline-none" style={inputStyle} />
              </label>
              <button type="button" onClick={() => setStep("payment")}
                className="flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition" style={{ background: INK, color: PAPER }}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === "payment" && (
            <div className="grid gap-4">
              <div className="rounded-lg p-4 text-sm" style={{ background: PAPER, border: `1px solid ${INK}10` }}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}45` }}>Booking summary</p>
                <div className="grid gap-1.5">
                  {[["Date", dateLabel], ["Time", slot], ["Name", name || "-"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span style={{ color: `${INK}55` }}>{k}</span>
                      <span className="font-medium" style={{ color: INK }}>{v}</span>
                    </div>
                  ))}
                  <div className="mt-1 flex justify-between border-t pt-2" style={{ borderColor: `${INK}0D` }}>
                    <span className="font-semibold" style={{ color: INK }}>Total</span>
                    <span className="font-bold" style={{ color: BROWN }}>{provider.price}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}50` }}>Payment method</p>
                <div className="grid gap-2">
                  {[
                    { id: "telebirr" as PayMethod, label: "Telebirr", icon: "TB", sub: "Ethio Telecom mobile wallet" },
                    { id: "cbe" as PayMethod, label: "CBE Birr", icon: "CBE", sub: "Commercial Bank of Ethiopia" },
                    { id: "venue" as PayMethod, label: "Pay at venue", icon: "ETB", sub: "Cash or card on arrival" },
                  ].map(({ id, label, icon, sub }) => {
                    const on = method === id;
                    return (
                      <button key={id} type="button" onClick={() => setMethod(id)}
                        className="flex items-center gap-3 rounded-lg p-3.5 text-left transition"
                        style={{ background: on ? INK : PAPER, border: `1px solid ${on ? INK : `${INK}12`}` }}>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/70 text-xs font-black leading-none" style={{ color: on ? INK : BROWN }}>{icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold" style={{ color: on ? PAPER : INK }}>{label}</p>
                          <p className="text-xs" style={{ color: on ? `${PAPER}80` : `${INK}50` }}>{sub}</p>
                        </div>
                        {on && <Check size={16} className="shrink-0" style={{ color: GOLD }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {method === "telebirr" && (
                <div className="overflow-hidden rounded-lg border-2" style={{ borderColor: "#1C6B3540" }}>
                  <div className="flex items-center justify-between bg-[#1C6B35] px-4 py-3">
                    <span className="text-xl font-black tracking-tight text-white">telebirr</span>
                    <span className="text-xs text-white/60">Send Money</span>
                  </div>
                  <div className="grid gap-3 bg-white p-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-gray-400">Send to</p>
                      <p className="text-base font-semibold" style={{ color: INK }}>{provider.phone}</p>
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
                        <p className="font-mono text-base font-semibold" style={{ color: INK }}>{bookingRef}</p>
                        <p className="text-xs text-gray-400">Include when sending</p>
                      </div>
                    </div>
                    <button type="button" onClick={copy}
                      className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[#1C6B35]/10 text-xs font-semibold text-[#1C6B35] transition hover:bg-[#1C6B35]/18">
                      <Copy size={13} />{copied ? "Copied!" : "Copy payment details"}
                    </button>
                  </div>
                </div>
              )}

              {method === "cbe" && (
                <div className="overflow-hidden rounded-lg border-2" style={{ borderColor: "#003F8A33" }}>
                  <div className="flex items-center justify-between bg-[#003F8A] px-4 py-3">
                    <span className="text-base font-black tracking-tight text-white">CBE Birr</span>
                    <span className="text-xs text-white/60">Bank Transfer</span>
                  </div>
                  <div className="grid gap-2 bg-white p-4 text-sm">
                    {[["Account number", "1000 8765 4321 09"], ["Account name", "TenaLoop Wellness PLC"], ["Amount", provider.price], ["Reference", bookingRef]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-gray-400">{k}</span>
                        <span className={cn("text-right font-semibold", k === "Reference" && "font-mono")} style={{ color: INK }}>{v}</span>
                      </div>
                    ))}
                    <button type="button" onClick={copy} className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#003F8A]/8 text-xs font-semibold text-[#003F8A]">
                      <Copy size={13} />{copied ? "Copied!" : "Copy transfer details"}
                    </button>
                  </div>
                </div>
              )}

              {method === "venue" && (
                <div className="rounded-lg p-4 text-sm" style={{ background: PAPER, border: `1px solid ${INK}12` }}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}45` }}>Pay on arrival</p>
                  <p className="leading-6" style={{ color: `${INK}75` }}>
                    Show reference <span className="font-mono font-bold" style={{ color: INK }}>{bookingRef}</span> when you arrive at <strong>{provider.name}</strong>.
                  </p>
                  <div className="mt-3 grid gap-1.5 text-xs" style={{ color: `${INK}55` }}>
                    <p className="flex items-center gap-2"><MapPin size={12} /> {provider.area} &middot; {provider.distance}</p>
                    <p className="flex items-center gap-2"><Clock size={12} /> {provider.hours}</p>
                    <p className="flex items-center gap-2"><Check size={12} /> Cash and Telebirr both accepted at venue</p>
                  </div>
                </div>
              )}

              <button type="button" disabled={!method} onClick={confirm}
                className="flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition disabled:opacity-30"
                style={{ background: BROWN, color: "#fff" }}>
                Confirm booking <ArrowRight size={15} />
              </button>
            </div>
          )}

          {/* STEP 4 */}
          {step === "confirmed" && (
            <div className="grid gap-5 py-2 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-lg" style={{ background: SAGE }}>
                <Check size={36} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <p className="font-serif text-3xl" style={{ color: INK }}>You&apos;re booked!</p>
                <p className="mt-1.5 font-mono text-xl font-bold" style={{ color: BROWN }}>{bookingRef}</p>
              </div>
              <div className="rounded-lg p-4 text-left text-sm" style={{ background: PAPER }}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wide" style={{ color: `${INK}45` }}>Booking details</p>
                <div className="grid gap-1.5">
                  {[
                    ["Provider", provider.name], ["Date", dateLabel], ["Time", slot], ["Amount", provider.price],
                    ["Method", method === "telebirr" ? "Telebirr" : method === "cbe" ? "CBE Birr" : "Pay at venue"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span style={{ color: `${INK}55` }}>{k}</span>
                      <span className="font-medium" style={{ color: INK }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg px-4 py-3" style={{ background: `${GOLD}1F` }}>
                <p className="text-sm font-bold" style={{ color: BROWN }}>Experience stamp earned +30 pts</p>
                <p className="mt-0.5 text-xs" style={{ color: `${INK}60` }}>
                  Show reference <span className="font-mono font-semibold">{bookingRef}</span> on arrival.
                </p>
              </div>
              <p className="text-xs leading-5" style={{ color: `${INK}50` }}>
                {provider.name} will reach you at {phone || "your number"} to confirm.
                {method === "telebirr" && ` Send ${provider.price} to ${provider.phone} with reference ${bookingRef}.`}
                {method === "cbe" && ` Transfer to CBE account 1000 8765 4321 09 with reference ${bookingRef}.`}
                {method === "venue" && " Pay when you arrive - cash or Telebirr accepted on site."}
              </p>
              <button type="button" onClick={onClose} className="h-12 rounded-lg text-sm font-semibold transition" style={{ background: INK, color: PAPER }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
