"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Save, Heart, Activity,
  CheckCircle, Sparkles, ShieldCheck, Mail,
  Mars, Venus, AlertTriangle, Phone,
  Plus, Briefcase, Ruler, Weight, Droplet,
  Languages, Pill, X,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES = ["Individual", "Provider", "Employer", "Admin"] as const;
const LANGUAGES = ["English", "Amharic-ready"] as const;
const DIABETES_TYPES = ["None", "Type 1", "Type 2", "Pre-diabetic"] as const;
const BLOOD_TYPES = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Unknown"] as const;
const COMMON_ALLERGIES = ["Gluten", "Dairy", "Nuts", "Peanuts", "Shellfish", "Soy"];
const COMMON_CONDITIONS = ["Hypertension", "Asthma", "PCOS", "Anemia", "Anxiety"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#5B8DEF", pos: bmi / 40 };
  if (bmi < 25) return { label: "Healthy", color: "#3FAE6F", pos: bmi / 40 };
  if (bmi < 30) return { label: "Overweight", color: "#D9A441", pos: bmi / 40 };
  return { label: "High", color: "#C4503A", pos: Math.min(bmi, 40) / 40 };
}

// ─── Reusable UI ─────────────────────────────────────────────────────────────

function BentoCard({ title, icon: Icon, children, span = "col-span-1", accent = "#0A2318", delay = 0 }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
  span?: string; accent?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative rounded-[2.25rem] bg-white/80 backdrop-blur-xl border border-white/60 p-7 flex flex-col overflow-hidden",
        "shadow-[0_10px_40px_-12px_rgba(10,35,24,0.12)] transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-[0_24px_60px_-18px_rgba(10,35,24,0.22)]",
        span,
      )}
    >
      {/* top accent glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(circle, ${accent}22, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-2xl text-white shadow-lg shadow-black/5"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <Icon size={18} />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0A2318]/45">{title}</h2>
        <div className="ml-auto h-px flex-1 bg-gradient-to-r from-[#0A2318]/10 to-transparent" />
      </div>
      <div className="relative flex-1">{children}</div>
    </motion.div>
  );
}

function CustomInput({ label, value, onChange, placeholder, type = "text", icon: Icon, unit }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; icon?: React.ElementType; unit?: string;
}) {
  return (
    <div className="space-y-2 w-full">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246] ml-1">
        {label}
      </label>
      <div className="relative group/input">
        {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A2318]/30 group-focus-within/input:text-[#8C6246] transition-colors" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-2xl bg-[#F6F8F3] border border-transparent text-sm text-[#0A2318] placeholder:text-[#0A2318]/20 transition-all outline-none",
            "focus:border-[#8C6246]/30 focus:bg-white focus:shadow-[0_4px_20px_-6px_rgba(140,98,70,0.3)]",
            Icon ? "pl-11" : "px-5",
            unit ? "pr-14" : "",
          )}
        />
        {unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0A2318]/30 uppercase tracking-wide">{unit}</span>}
      </div>
    </div>
  );
}

function MultiSelectPills({ options, selected, onToggle, removable, onRemove }: {
  options: readonly string[]; selected: string[]; onToggle: (v: string) => void;
  removable?: boolean; onRemove?: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        const isCustom = removable && !COMMON_CONDITIONS.includes(opt) && !COMMON_ALLERGIES.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => (isCustom && onRemove ? onRemove(opt) : onToggle(opt))}
            className={cn(
              "group/pill px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all border flex items-center gap-1.5 active:scale-95",
              isActive
                ? "bg-[#0A2318] border-[#0A2318] text-white shadow-md shadow-[#0A2318]/20"
                : "bg-white/70 border-[#0A2318]/10 text-[#0A2318]/50 hover:border-[#8C6246]/40 hover:text-[#0A2318]",
            )}
          >
            {opt}
            {isCustom && isActive && <X size={11} className="opacity-60 group-hover/pill:opacity-100" />}
          </button>
        );
      })}
    </div>
  );
}

function VitalChip({ icon: Icon, value, unit, label }: {
  icon: React.ElementType; value: string; unit?: string; label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3">
      <div className="p-2 rounded-xl bg-[#D4C1A0]/20 text-[#D4C1A0]">
        <Icon size={15} />
      </div>
      <div className="leading-tight">
        <p className="text-lg font-serif text-white">
          {value}{unit && <span className="text-[11px] opacity-50 ml-1">{unit}</span>}
        </p>
        <p className="text-[9px] font-bold text-[#D4C1A0]/80 uppercase tracking-[0.15em]">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, healthProfile, language, setLanguage, refreshProfile } = useWellness();

  // Personal
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<string>(user?.role ?? "Individual");
  const [org, setOrg] = useState(user?.organization ?? "");
  const [gender, setGender] = useState<"Male" | "Female">(user?.gender === "Female" ? "Female" : "Male");
  const [dob, setDob] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : "",
  );

  // Health
  const [weight, setWeight] = useState(healthProfile?.weightKg?.toString() ?? "");
  const [height, setHeight] = useState(healthProfile?.heightCm?.toString() ?? "");
  const [bloodType, setBloodType] = useState(healthProfile?.bloodType ?? "Unknown");
  const [diabetes, setDiabetes] = useState(healthProfile?.diabetesType ?? "None");
  const [allergies, setAllergies] = useState<string[]>(healthProfile?.allergies ?? []);
  const [conditions, setConditions] = useState<string[]>(healthProfile?.conditions ?? []);
  const [meds, setMeds] = useState(healthProfile?.medications ?? "");
  const [sugar, setSugar] = useState(healthProfile?.bloodSugarFasting?.toString() ?? "");
  const [pressure, setPressure] = useState(healthProfile?.bloodPressure ?? "");
  const [emergency, setEmergency] = useState(healthProfile?.emergencyContact ?? "");
  const [notes, setNotes] = useState(healthProfile?.notes ?? "");

  const [customInput, setCustomInput] = useState({ allergy: "", condition: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const bmi = useMemo(() => {
    if (!weight || !height) return null;
    return (parseFloat(weight) / (parseFloat(height) / 100) ** 2).toFixed(1);
  }, [weight, height]);

  // Profile completeness across the fields that matter most
  const completeness = useMemo(() => {
    const checks = [
      !!name.trim(), !!dob, !!weight, !!height,
      bloodType !== "Unknown", !!emergency.trim(),
      allergies.length > 0 || conditions.length > 0,
      diabetes !== "None" || conditions.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [name, dob, weight, height, bloodType, emergency, allergies, conditions, diabetes]);

  const handleToggle = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter((i) => i !== val) : [...list, val]);
  };

  const addCustom = (type: "allergy" | "condition") => {
    const val = customInput[type].trim();
    if (!val) return;
    if (type === "allergy") { if (!allergies.includes(val)) setAllergies([...allergies, val]); }
    else { if (!conditions.includes(val)) setConditions([...conditions, val]); }
    setCustomInput({ ...customInput, [type]: "" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const [profileRes, healthRes] = await Promise.all([
        fetch("/api/me/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || null,
            role,
            organization: org.trim() || null,
            gender,
            dateOfBirth: dob || null,
          }),
        }),
        fetch("/api/me/health", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weightKg: weight ? parseFloat(weight) : null,
            heightCm: height ? parseFloat(height) : null,
            bloodType: bloodType === "Unknown" ? null : bloodType,
            diabetesType: diabetes === "None" ? null : diabetes,
            allergies,
            conditions,
            medications: meds.trim() || null,
            bloodSugarFasting: sugar ? parseFloat(sugar) : null,
            bloodPressure: pressure.trim() || null,
            emergencyContact: emergency.trim() || null,
            notes: notes.trim() || null,
          }),
        }),
      ]);

      if (!profileRes.ok || !healthRes.ok) throw new Error("Save failed");

      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const bmiVal = bmi ? parseFloat(bmi) : null;
  const bmiInfo = bmiVal ? bmiCategory(bmiVal) : null;
  const ringCircumference = 2 * Math.PI * 46;

  return (
    <div className="relative min-h-screen bg-[#EDF0EA] p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-[#D4C1A0]/25 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-[#0A2318]/10 blur-[140px]" />
        <div className="absolute top-[30%] right-[20%] w-[28rem] h-[28rem] rounded-full bg-[#8C6246]/10 blur-[120px]" />
      </div>

      <form onSubmit={handleSave} className="relative z-10 mx-auto max-w-7xl">

        {/* ── HERO HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="relative rounded-[3rem] md:rounded-[3.5rem] bg-gradient-to-br from-[#0A2318] via-[#0D2A1C] to-[#08291A] p-8 md:p-12 text-white shadow-[0_30px_80px_-30px_rgba(10,35,24,0.7)] overflow-hidden">
            {/* decorative layers */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4C1A0]/15 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-[#8C6246]/15 rounded-full blur-3xl -mb-40" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Avatar + completeness ring */}
              <div className="relative flex-shrink-0">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <motion.circle
                    cx="50" cy="50" r="46" fill="none" stroke="#D4C1A0" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    initial={{ strokeDashoffset: ringCircumference }}
                    animate={{ strokeDashoffset: ringCircumference * (1 - completeness / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-[1.75rem] bg-gradient-to-br from-[#D4C1A0] to-[#8C6246] flex items-center justify-center shadow-2xl border-4 border-white/10">
                    <span className="text-4xl font-serif font-bold text-white/95">
                      {name?.trim()[0]?.toUpperCase() || <User size={34} />}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#D4C1A0] rounded-full px-3 py-1 text-[#0A2318] shadow-lg flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span className="text-[10px] font-black">{completeness}%</span>
                </div>
              </div>

              {/* Identity */}
              <div className="text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
                  <Sparkles size={12} className="text-[#D4C1A0]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4C1A0]">
                    {role} · Wellness Profile
                  </span>
                </div>
                <h1 className="font-serif text-4xl md:text-6xl mb-3 tracking-tight leading-none">{name || "Your Name"}</h1>
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-white/55 text-sm">
                  <span className="flex items-center gap-2"><Mail size={14} className="text-[#D4C1A0]" /> {user?.email}</span>
                  {bmi && (
                    <span className="flex items-center gap-2">
                      <Activity size={14} className="text-[#D4C1A0]" /> BMI {bmi}
                      {bmiInfo && <span className="text-[#D4C1A0]">· {bmiInfo.label}</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick vitals as glass chips */}
              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0">
                <VitalChip icon={Weight} value={weight || "—"} unit="kg" label="Weight" />
                <VitalChip icon={Ruler} value={height || "—"} unit="cm" label="Height" />
                <VitalChip icon={Droplet} value={sugar || "—"} unit="mg/dL" label="Sugar" />
                <VitalChip icon={Heart} value={bloodType === "Unknown" ? "—" : bloodType} label="Blood" />
              </div>
            </div>
          </div>
        </motion.header>

        {/* ── BENTO GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">

          {/* 1. Identity */}
          <BentoCard title="Core Identity" icon={User} span="lg:col-span-7" accent="#0A2318" delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <CustomInput label="Full Name" value={name} onChange={setName} placeholder="Hana Tesfaye" />
              <CustomInput label="Date of Birth" type="date" value={dob} onChange={setDob} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246] ml-1">Gender</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setGender("Male")}
                    className={cn("flex-1 h-12 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95", gender === "Male" ? "bg-[#0A2318] border-[#0A2318] text-white shadow-lg shadow-[#0A2318]/20" : "bg-[#F6F8F3] border-transparent text-[#0A2318]/40 hover:border-[#8C6246]/30")}>
                    <Mars size={16} /> <span className="text-xs font-bold">Male</span>
                  </button>
                  <button type="button" onClick={() => setGender("Female")}
                    className={cn("flex-1 h-12 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95", gender === "Female" ? "bg-[#0A2318] border-[#0A2318] text-white shadow-lg shadow-[#0A2318]/20" : "bg-[#F6F8F3] border-transparent text-[#0A2318]/40 hover:border-[#8C6246]/30")}>
                    <Venus size={16} /> <span className="text-xs font-bold">Female</span>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246] ml-1">Community Role</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-all active:scale-95", role === r ? "bg-[#D4C1A0] text-[#0A2318] shadow-md shadow-[#D4C1A0]/40" : "bg-[#F6F8F3] text-[#0A2318]/40 hover:text-[#0A2318]/70")}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. Preferences */}
          <BentoCard title="Preferences" icon={Languages} span="lg:col-span-5" accent="#8C6246" delay={0.1}>
            <div className="space-y-6">
              <CustomInput label="Organization" value={org} onChange={setOrg} placeholder="Clinic or Company name" icon={Briefcase} />
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246] ml-1">App Language</label>
                <div className="flex gap-2">
                  {LANGUAGES.map((l) => (
                    <button key={l} type="button" onClick={() => setLanguage(l)}
                      className={cn("flex-1 h-11 rounded-xl text-xs font-bold transition-all border active:scale-95", language === l ? "bg-[#0A2318] text-white border-[#0A2318] shadow-md" : "bg-[#F6F8F3] text-[#0A2318]/40 border-transparent hover:text-[#0A2318]/70")}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 3. Body Vitals */}
          <BentoCard title="Body Vitals" icon={Activity} span="lg:col-span-4" accent="#3FAE6F" delay={0.15}>
            <div className="space-y-5">
              <CustomInput label="Weight" value={weight} onChange={setWeight} unit="kg" icon={Weight} />
              <CustomInput label="Height" value={height} onChange={setHeight} unit="cm" icon={Ruler} />
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246] ml-1">Blood Type</label>
                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)}
                  className="w-full h-12 rounded-2xl bg-[#F6F8F3] border border-transparent text-sm px-4 outline-none focus:border-[#8C6246]/30 focus:bg-white transition-all">
                  {BLOOD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* BMI gauge */}
              <AnimatePresence>
                {bmiInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl bg-[#F6F8F3] p-4"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246]">BMI</span>
                      <span className="text-sm font-serif text-[#0A2318]">
                        {bmi} <span className="text-[10px] font-bold" style={{ color: bmiInfo.color }}>· {bmiInfo.label}</span>
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full bg-gradient-to-r from-[#5B8DEF] via-[#3FAE6F] via-[60%] to-[#C4503A]">
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow-md"
                        style={{ borderColor: bmiInfo.color }}
                        initial={{ left: "0%" }}
                        animate={{ left: `${Math.min(Math.max(bmiInfo.pos * 100, 2), 96)}%` }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </BentoCard>

          {/* 4. Health Conditions */}
          <BentoCard title="Health Conditions" icon={Heart} span="lg:col-span-8" accent="#C4503A" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246]">Diabetes Status</label>
                  <MultiSelectPills options={DIABETES_TYPES} selected={[diabetes]} onToggle={(v) => setDiabetes(v)} />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246]">Other Conditions</label>
                  <MultiSelectPills
                    options={[...COMMON_CONDITIONS, ...conditions.filter((c) => !COMMON_CONDITIONS.includes(c))]}
                    selected={conditions}
                    onToggle={(v) => handleToggle(conditions, setConditions, v)}
                    removable
                    onRemove={(v) => setConditions(conditions.filter((c) => c !== v))}
                  />
                  <div className="flex gap-2">
                    <input value={customInput.condition} onChange={(e) => setCustomInput({ ...customInput, condition: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom("condition"); } }}
                      placeholder="Add other..." className="flex-1 h-10 rounded-xl bg-[#F6F8F3] px-4 text-xs outline-none border border-transparent focus:border-[#8C6246]/30 focus:bg-white transition-all" />
                    <button type="button" onClick={() => addCustom("condition")}
                      className="h-10 w-10 rounded-xl bg-[#0A2318] text-white flex items-center justify-center hover:bg-[#153124] transition-colors active:scale-95">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#8C6246]">
                  <Pill size={12} /> Medications
                </label>
                <textarea value={meds} onChange={(e) => setMeds(e.target.value)}
                  placeholder="List any daily medications..."
                  className="w-full h-[150px] rounded-[1.75rem] bg-[#F6F8F3] p-5 text-sm outline-none resize-none border border-transparent focus:border-[#8C6246]/30 focus:bg-white transition-all" />
              </div>
            </div>
          </BentoCard>

          {/* 5. Allergies */}
          <BentoCard title="Allergies & Intolerances" icon={AlertTriangle} span="lg:col-span-6" accent="#D9A441" delay={0.25}>
            <div className="space-y-4">
              <MultiSelectPills
                options={[...COMMON_ALLERGIES, ...allergies.filter((a) => !COMMON_ALLERGIES.includes(a))]}
                selected={allergies}
                onToggle={(v) => handleToggle(allergies, setAllergies, v)}
                removable
                onRemove={(v) => setAllergies(allergies.filter((a) => a !== v))}
              />
              <div className="flex gap-2">
                <input value={customInput.allergy} onChange={(e) => setCustomInput({ ...customInput, allergy: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom("allergy"); } }}
                  placeholder="E.g. Pollen, Penicillin..." className="flex-1 h-11 rounded-xl bg-[#F6F8F3] px-4 text-xs outline-none border border-transparent focus:border-[#8C6246]/30 focus:bg-white transition-all" />
                <button type="button" onClick={() => addCustom("allergy")}
                  className="h-11 px-5 rounded-xl bg-[#0A2318] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#153124] transition-colors active:scale-95">
                  Add
                </button>
              </div>
            </div>
          </BentoCard>

          {/* 6. Emergency & Notes */}
          <BentoCard title="Emergency & Notes" icon={Phone} span="lg:col-span-6" accent="#5B8DEF" delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CustomInput label="Fasting Sugar" value={sugar} onChange={setSugar} unit="mg/dL" icon={Droplet} />
                <CustomInput label="Blood Pressure" value={pressure} onChange={setPressure} placeholder="120/80" icon={Activity} />
              </div>
              <div className="space-y-4">
                <CustomInput label="Emergency Contact" value={emergency} onChange={setEmergency} placeholder="Name & Phone" icon={Phone} />
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  className="w-full h-12 rounded-2xl bg-[#F6F8F3] p-4 text-xs outline-none resize-none focus:h-32 border border-transparent focus:border-[#8C6246]/30 focus:bg-white transition-all" />
              </div>
            </div>
          </BentoCard>

          {/* 7. Save */}
          <div className="lg:col-span-12 mt-2">
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 text-center text-sm text-[#C4503A] font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                "w-full h-20 rounded-[2.25rem] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-[0_20px_50px_-15px_rgba(10,35,24,0.5)] relative overflow-hidden group disabled:opacity-90",
                saved ? "bg-[#3FAE6F] text-white" : "bg-gradient-to-r from-[#0A2318] to-[#0D2A1C] text-white hover:from-[#153124] hover:to-[#153124]",
              )}
            >
              {saving && (
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
              <AnimatePresence mode="wait">
                {saved ? (
                  <motion.div key="saved" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
                    <CheckCircle size={24} />
                    <span className="font-bold uppercase tracking-[0.2em] text-sm">Profile Saved</span>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Save size={20} className="text-[#D4C1A0]" />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-sm">
                      {saving ? "Saving..." : "Save Profile"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
