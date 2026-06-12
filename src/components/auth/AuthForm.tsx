"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

type Props = {
  mode: Mode;
};

const roles = ["Individual", "Provider", "Employer"] as const;
type Role = (typeof roles)[number];

const proofPoints = [
  "AI wellness coach and daily TenaScore",
  "Ethiopian food tracker and provider bookings",
  "Anonymous team and marketplace insights",
];

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [role, setRole] = useState<Role>("Individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      const endpoint =
        step === "request" ? "/api/auth/request-code" : "/api/auth/verify-code";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          step === "request"
            ? {
                mode,
                role,
                name,
                email,
                organization,
              }
            : {
                email,
                code,
              },
        ),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        delivery?: "smtp" | "console";
      } | null;

      if (!response.ok) {
        throw new Error(data?.error || "Authentication failed.");
      }

      if (step === "request") {
        setStep("verify");
        setNotice(
          data?.delivery === "console"
            ? "Code generated. Check the Next.js server console because SMTP is not configured yet."
            : "Code sent. Check your email to continue.",
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#E5EAE3] text-[#0A2318] antialiased lg:h-screen lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-screen lg:min-h-0 lg:grid-cols-[minmax(360px,0.88fr)_minmax(0,1.12fr)]">
        <section className="relative hidden overflow-hidden bg-[#0A2318] text-[#E8EDE7] lg:block">
          <Image
            src="/tenaloop-hero.png"
            alt="TenaLoop wellness app preview"
            fill
            priority
            sizes="46vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,35,24,0.18),rgba(10,35,24,0.9))]" />

          <div className="absolute inset-x-0 top-0 p-6 xl:p-8">
            <Link href="/" className="flex w-fit items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8EDE7] text-[#0A2318] xl:h-11 xl:w-11">
                <Activity size={21} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block font-serif text-xl leading-none xl:text-2xl">TenaLoop 360</span>
                <span className="block text-xs text-[#E8EDE7]/72 xl:text-sm">
                  AI wellness passport
                </span>
              </span>
            </Link>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 xl:p-8">
            <div className="max-w-xl rounded-[2rem] border border-[#E8EDE7]/14 bg-[#0A2318]/68 p-5 backdrop-blur xl:p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#D4C1A0] xl:text-sm">
                <Sparkles size={16} />
                Demo workspace
              </div>
              <h1 className="mt-3 font-serif text-3xl leading-tight xl:text-4xl">
                A complete wellness SaaS story in one login flow.
              </h1>
              <div className="mt-4 grid gap-2.5 xl:mt-6 xl:gap-3">
                {proofPoints.map((point) => (
                  <div key={point} className="flex items-center gap-3 text-xs text-[#E8EDE7]/82 xl:text-sm">
                    <CheckCircle2 className="text-[#D4C1A0]" size={17} />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:min-h-0 lg:px-8 lg:py-4 xl:px-10">
          <div className="w-full max-w-xl">
            <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0A2318] text-[#E8EDE7]">
                <Activity size={20} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block font-serif text-xl leading-none">TenaLoop 360</span>
                <span className="block text-xs text-[#0A2318]/58">AI wellness passport</span>
              </span>
            </Link>

            <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-[0_18px_60px_rgba(10,35,24,0.08)] sm:p-6 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase text-[#8C6246]">
                    {isSignup ? "Create workspace" : "Workspace login"}
                  </p>
                  <h2 className="mt-1 font-serif text-3xl leading-[1.08] text-[#0A2318] sm:text-4xl lg:text-[2.45rem]">
                    {isSignup ? "Start the TenaLoop demo" : "Welcome back"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#0A2318]/66 lg:leading-5">
                    {isSignup
                      ? "Choose a role and enter demo details to open the product."
                      : "Continue into the live wellness dashboard."}
                  </p>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D4C1A0]/55 text-[#0A2318]">
                  <ShieldCheck size={21} strokeWidth={1.5} />
                </div>
              </div>

              {isSignup && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {roles.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={cn(
                        "h-9 rounded-full border px-2 text-sm font-semibold transition",
                        option === role
                          ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                          : "border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/72 hover:border-[#8C6246] hover:text-[#0A2318]",
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
                {isSignup && step === "request" && (
                  <Field
                    icon={User}
                    label="Full name"
                    placeholder="Dawit Alemu"
                    value={name}
                    onChange={setName}
                  />
                )}

                <Field
                  icon={Mail}
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  disabled={step === "verify"}
                />

                {isSignup && step === "request" && (
                  <Field
                    icon={Building2}
                    label="Organization"
                    placeholder="ALX, clinic, gym, or company"
                    required={false}
                    value={organization}
                    onChange={setOrganization}
                  />
                )}

                {step === "verify" && (
                  <Field
                    icon={LockKeyhole}
                    label="Email code"
                    placeholder="6-digit code"
                    value={code}
                    onChange={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    maxLength={6}
                  />
                )}

                {!isSignup && (
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <label className="flex items-center gap-2 text-[#0A2318]/68">
                      <input type="checkbox" className="accent-[#8C6246]" />
                      Remember me
                    </label>
                    <Link href="/signup" className="font-semibold text-[#8C6246]">
                      Need access?
                    </Link>
                  </div>
                )}

                <button
                  className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0A2318] px-5 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#1A3A2A]"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Please wait"
                    : step === "request"
                      ? isSignup
                        ? "Email signup code"
                        : "Email login code"
                      : "Verify and continue"}
                  <ArrowRight size={18} />
                </button>
              </form>

              {(notice || error) && (
                <div
                  className={cn(
                    "mt-4 rounded-[1.25rem] border p-3 text-sm leading-6 lg:py-2.5 lg:leading-5",
                    error
                      ? "border-[#C4503A]/25 bg-[#C4503A]/8 text-[#C4503A]"
                      : "border-[#8C6246]/18 bg-[#D4C1A0]/30 text-[#0A2318]/72",
                  )}
                >
                  {error || notice}
                </div>
              )}

              <div className="mt-4 rounded-[1.25rem] border border-[#8C6246]/18 bg-[#D4C1A0]/30 p-3 text-sm leading-6 text-[#0A2318]/72 lg:py-2.5 lg:leading-5">
                Passwordless auth uses a one-time email code sent through Nodemailer.
              </div>

              <p className="mt-4 text-center text-sm text-[#0A2318]/62">
                {isSignup ? "Already have an account?" : "New to TenaLoop?"}{" "}
                <Link
                  href={isSignup ? "/login" : "/signup"}
                  className="font-semibold text-[#8C6246]"
                >
                  {isSignup ? "Log in" : "Create account"}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  required = true,
  type = "text",
  value,
  onChange,
  disabled = false,
  inputMode,
  maxLength,
}: {
  icon: typeof User;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputMode?: "numeric";
  maxLength?: number;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-[#0A2318]/82">
      {label}
      <span className="flex h-11 min-w-0 items-center gap-3 rounded-full border border-[#0A2318]/12 bg-[#E5EAE3] px-4 transition focus-within:border-[#8C6246] focus-within:bg-[#F3F5F1]">
        <Icon size={17} className="shrink-0 text-[#8C6246]" />
        <input
          className="min-w-0 flex-1 bg-transparent text-sm text-[#0A2318] outline-none placeholder:text-[#0A2318]/36"
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          inputMode={inputMode}
          maxLength={maxLength}
        />
      </span>
    </label>
  );
}
