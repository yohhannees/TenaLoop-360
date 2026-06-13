"use client";

/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Activity, ArrowRight, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Pupil (bare dot, no white sclera) ──────────────────────────────────────

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: PupilProps) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const pos = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = pupilRef.current.getBoundingClientRect();
    const dx = mouseX - (r.left + r.width / 2);
    const dy = mouseY - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const { x, y } = pos();
  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`, height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

// ─── EyeBall (white sclera + pupil) ─────────────────────────────────────────

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({
  size = 48, pupilSize = 16, maxDistance = 10,
  eyeColor = "white", pupilColor = "black",
  isBlinking = false, forceLookX, forceLookY,
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const pos = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = eyeRef.current.getBoundingClientRect();
    const dx = mouseX - (r.left + r.width / 2);
    const dy = mouseY - (r.top + r.height / 2);
    const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const angle = Math.atan2(dy, dx);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const { x, y } = pos();
  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`, height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${x}px, ${y}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

// ─── Animated Characters Scene ───────────────────────────────────────────────

interface SceneProps {
  isTyping: boolean;
  isHidingSecret: boolean;  // true when entering the verification code
  showSecret: boolean;      // true when show-code toggle is on
}

function CharacterScene({ isTyping, isHidingSecret, showSecret }: SceneProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Blinking for purple
  useEffect(() => {
    const sched = () => {
      const t = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => { setIsPurpleBlinking(false); sched(); }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = sched();
    return () => clearTimeout(t);
  }, []);

  // Blinking for black
  useEffect(() => {
    const sched = () => {
      const t = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => { setIsBlackBlinking(false); sched(); }, 150);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = sched();
    return () => clearTimeout(t);
  }, []);

  // Look at each other when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple peeks when secret is visible
  useEffect(() => {
    if (isHidingSecret && showSecret) {
      const sched = () => {
        const t = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => setIsPurplePeeking(false), 800);
        }, Math.random() * 3000 + 2000);
        return t;
      };
      const t = sched();
      return () => clearTimeout(t);
    } else {
      setIsPurplePeeking(false);
    }
  }, [isHidingSecret, showSecret, isPurplePeeking]);

  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const p = calcPos(purpleRef);
  const b = calcPos(blackRef);
  const y = calcPos(yellowRef);
  const o = calcPos(orangeRef);

  return (
    <div className="relative" style={{ width: "550px", height: "400px" }}>
      {/* Purple – back layer */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "70px", width: "180px",
          height: (isTyping || (isHidingSecret && !showSecret)) ? "440px" : "400px",
          backgroundColor: "#6C3FF5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: (isHidingSecret && showSecret)
            ? "skewX(0deg)"
            : (isTyping || (isHidingSecret && !showSecret))
              ? `skewX(${(p.bodySkew || 0) - 12}deg) translateX(40px)`
              : `skewX(${p.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{
            left: (isHidingSecret && showSecret) ? "20px" : isLookingAtEachOther ? "55px" : `${45 + p.faceX}px`,
            top: (isHidingSecret && showSecret) ? "35px" : isLookingAtEachOther ? "65px" : `${40 + p.faceY}px`,
          }}
        >
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={(isHidingSecret && showSecret) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
          />
          <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D"
            isBlinking={isPurpleBlinking}
            forceLookX={(isHidingSecret && showSecret) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
          />
        </div>
      </div>

      {/* Black – middle layer */}
      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "240px", width: "120px", height: "310px",
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform: (isHidingSecret && showSecret)
            ? "skewX(0deg)"
            : isLookingAtEachOther
              ? `skewX(${(b.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
              : (isTyping || (isHidingSecret && !showSecret))
                ? `skewX(${(b.bodySkew || 0) * 1.5}deg)`
                : `skewX(${b.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{
            left: (isHidingSecret && showSecret) ? "10px" : isLookingAtEachOther ? "32px" : `${26 + b.faceX}px`,
            top: (isHidingSecret && showSecret) ? "28px" : isLookingAtEachOther ? "12px" : `${32 + b.faceY}px`,
          }}
        >
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking}
            forceLookX={(isHidingSecret && showSecret) ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? -4 : isLookingAtEachOther ? -4 : undefined}
          />
          <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D"
            isBlinking={isBlackBlinking}
            forceLookX={(isHidingSecret && showSecret) ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? -4 : isLookingAtEachOther ? -4 : undefined}
          />
        </div>
      </div>

      {/* Orange semi-circle – front left */}
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "0px", width: "240px", height: "200px", zIndex: 3,
          backgroundColor: "#FF9B6B",
          borderRadius: "120px 120px 0 0",
          transform: (isHidingSecret && showSecret) ? "skewX(0deg)" : `skewX(${o.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{
            left: (isHidingSecret && showSecret) ? "50px" : `${82 + (o.faceX || 0)}px`,
            top: (isHidingSecret && showSecret) ? "85px" : `${90 + (o.faceY || 0)}px`,
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(isHidingSecret && showSecret) ? -5 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? -4 : undefined}
          />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(isHidingSecret && showSecret) ? -5 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? -4 : undefined}
          />
        </div>
      </div>

      {/* Yellow rounded rectangle – front right */}
      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "310px", width: "140px", height: "230px",
          backgroundColor: "#E8D754",
          borderRadius: "70px 70px 0 0",
          zIndex: 4,
          transform: (isHidingSecret && showSecret) ? "skewX(0deg)" : `skewX(${y.bodySkew || 0}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{
            left: (isHidingSecret && showSecret) ? "20px" : `${52 + (y.faceX || 0)}px`,
            top: (isHidingSecret && showSecret) ? "35px" : `${40 + (y.faceY || 0)}px`,
          }}
        >
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(isHidingSecret && showSecret) ? -5 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? -4 : undefined}
          />
          <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
            forceLookX={(isHidingSecret && showSecret) ? -5 : undefined}
            forceLookY={(isHidingSecret && showSecret) ? -4 : undefined}
          />
        </div>
        <div
          className="absolute w-20 h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
          style={{
            left: (isHidingSecret && showSecret) ? "10px" : `${40 + (y.faceX || 0)}px`,
            top: (isHidingSecret && showSecret) ? "88px" : `${88 + (y.faceY || 0)}px`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────

const ROLES = ["Individual", "Provider", "Employer"] as const;
type Role = (typeof ROLES)[number];
const GENDERS = ["Male", "Female"] as const;
type Gender = (typeof GENDERS)[number];

interface AnimatedAuthPageProps {
  mode: "login" | "signup";
}

export function AnimatedAuthPage({ mode }: AnimatedAuthPageProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [age, setAge] = useState("");
  const [role, setRole] = useState<Role>("Individual");
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // flow
  const [step, setStep] = useState<"request" | "verify">("request");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // character animation triggers
  const [isTyping, setIsTyping] = useState(false);

  const isHidingSecret = step === "verify" && code.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setIsLoading(true);

    try {
      if (step === "request") {
        const ageNum = parseInt(age);
        const dateOfBirth = age && !isNaN(ageNum)
          ? new Date(new Date().getFullYear() - ageNum, 0, 1).toISOString()
          : undefined;

        const res = await fetch("/api/auth/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            email,
            ...(isSignup && { name, role, gender, dateOfBirth }),
          }),
        });

        const data = (await res.json().catch(() => null)) as {
          error?: string;
          delivery?: "smtp" | "console";
        } | null;

        if (!res.ok) throw new Error(data?.error || "Failed to send code.");

        setStep("verify");
        setNotice(
          data?.delivery === "console"
            ? "Code generated — check the Next.js server console (SMTP not configured)."
            : "Code sent! Check your email.",
        );
      } else {
        const res = await fetch("/api/auth/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });

        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (!res.ok) throw new Error(data?.error || "Invalid code.");

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* ── Left: animated characters (desktop only) ── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#0A2318] p-10 xl:p-12 text-[#E8EDE7] overflow-hidden">
        {/* Brand */}
        <Link href="/" className="relative z-20 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#E8EDE7]/10 backdrop-blur-sm">
            <Activity className="size-5" />
          </span>
          <span>
            <span className="block font-serif text-xl leading-none">TenaLoop 360</span>
            <span className="block text-xs text-[#E8EDE7]/60">AI wellness passport</span>
          </span>
        </Link>

        {/* Characters – scaled to always fit the panel */}
        <div className="relative z-20 flex items-end justify-center overflow-hidden" style={{ height: "420px" }}>
          <div style={{ transform: "scale(0.82)", transformOrigin: "bottom center" }}>
            <CharacterScene
              isTyping={isTyping}
              isHidingSecret={isHidingSecret}
              showSecret={showCode}
            />
          </div>
        </div>

        {/* Footer links */}
        <div className="relative z-20 flex items-center gap-6 text-sm text-[#E8EDE7]/50">
          <a href="#" className="hover:text-[#E8EDE7] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#E8EDE7] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#E8EDE7] transition-colors">Contact</a>
        </div>

        {/* Decorative blur */}
        <div className="absolute top-1/4 right-1/4 size-64 bg-[#E8EDE7]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-[#E8EDE7]/3 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Right: form ── */}
      <div className="flex min-h-screen lg:min-h-0 items-center justify-center px-4 py-10 sm:px-6 sm:py-12 bg-[#E5EAE3]">
        <div className="w-full max-w-sm sm:max-w-[420px]">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-8">
            <span className="grid size-8 place-items-center rounded-full bg-[#0A2318] text-[#E8EDE7]">
              <Activity className="size-4" />
            </span>
            <span className="font-serif">TenaLoop 360</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase text-[#8C6246] mb-1">
              {isSignup ? "Create account" : "Welcome back"}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0A2318]">
              {step === "verify"
                ? "Check your email"
                : isSignup
                  ? "Start your wellness journey"
                  : "Sign in to TenaLoop"}
            </h1>
            <p className="text-[#0A2318]/60 text-sm mt-2">
              {step === "verify"
                ? `We sent a 6-digit code to ${email}`
                : isSignup
                  ? "Fill in your details to get started"
                  : "Enter your email to receive a sign-in code"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {step === "request" ? (
              <>
                {/* Role selector (signup only) */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#0A2318]/80">I am a</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={cn(
                            "h-9 rounded-full border text-xs font-semibold transition",
                            r === role
                              ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                              : "border-[#0A2318]/15 bg-[#E5EAE3] text-[#0A2318]/65 hover:border-[#8C6246]",
                          )}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Name (signup) */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Hana Tesfaye"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required
                      className="h-12 bg-[#E8EDE7] border-[#0A2318]/15 focus-visible:border-[#8C6246] focus-visible:ring-[#8C6246]"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    required
                    className="h-12 bg-[#E8EDE7] border-[#0A2318]/15 focus-visible:border-[#8C6246] focus-visible:ring-[#8C6246]"
                  />
                </div>

                {/* Gender (signup) */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gender</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={cn(
                            "h-9 rounded-full border text-xs font-semibold transition",
                            g === gender
                              ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                              : "border-[#0A2318]/15 bg-[#E8EDE7] text-[#0A2318]/65 hover:border-[#8C6246]",
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age (signup) */}
                {isSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      min={10}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      onFocus={() => setIsTyping(true)}
                      onBlur={() => setIsTyping(false)}
                      required
                      className="h-12 bg-[#E8EDE7] border-[#0A2318]/15 focus-visible:border-[#8C6246] focus-visible:ring-[#8C6246]"
                    />
                  </div>
                )}

                {/* Remember me / forgot link (login) */}
                {!isSignup && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(v) => setRememberMe(!!v)}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-[#0A2318]/70">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/signup" className="text-sm text-[#8C6246] font-medium hover:underline">
                      Need an account?
                    </Link>
                  </div>
                )}
              </>
            ) : (
              /* Verify step */
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">Verification code</Label>
                <div className="relative">
                  <Input
                    id="code"
                    type={showCode ? "text" : "password"}
                    placeholder="123456"
                    value={code}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    className="h-12 pr-10 bg-[#E8EDE7] border-[#0A2318]/15 focus-visible:border-[#8C6246] focus-visible:ring-[#8C6246] tracking-[0.3em] text-center font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A2318]/50 hover:text-[#0A2318] transition-colors"
                  >
                    {showCode ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                <p className="text-xs text-[#0A2318]/50">
                  <LockKeyhole className="inline size-3 mr-1" />
                  The characters are watching — keep your code private
                </p>
              </div>
            )}

            {/* Error / notice */}
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            {notice && !error && (
              <div className="p-3 text-sm text-[#0A2318]/70 bg-[#D4C1A0]/30 border border-[#8C6246]/20 rounded-lg">
                {notice}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-[#0A2318] hover:bg-[#1A3A2A] text-[#E8EDE7] rounded-full"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait…"
                : step === "request"
                  ? isSignup ? "Create account" : "Send sign-in code"
                  : "Verify and continue"}
              {!isLoading && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </form>

          {/* Sign-up / sign-in switch */}
          <p className="text-center text-sm text-[#0A2318]/60 mt-6">
            {isSignup ? "Already have an account?" : "New to TenaLoop?"}{" "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="text-[#0A2318] font-semibold hover:underline"
            >
              {isSignup ? "Sign in" : "Create account"}
            </Link>
          </p>

          {step === "verify" && (
            <button
              type="button"
              onClick={() => { setStep("request"); setCode(""); setError(""); setNotice(""); }}
              className="mt-2 w-full text-center text-sm text-[#0A2318]/50 hover:text-[#0A2318] transition-colors"
            >
              ← Use a different email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const Component = AnimatedAuthPage;
