"use client";

import type { ElementType, FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Briefcase,
  Check,
  CheckCircle,
  Droplet,
  Heart,
  Mail,
  Mars,
  Phone,
  Pill,
  Plus,
  Ruler,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Venus,
  Weight,
  X,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { Stamp } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES = ["Individual", "Provider", "Employer", "Admin"] as const;
const LANGUAGES = ["English", "Amharic-ready"] as const;
const DIABETES_TYPES = ["None", "Type 1", "Type 2", "Pre-diabetic"] as const;
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"] as const;
const COMMON_ALLERGIES = ["Gluten", "Dairy", "Nuts", "Peanuts", "Shellfish", "Soy"];
const COMMON_CONDITIONS = ["Hypertension", "Asthma", "PCOS", "Anemia", "Anxiety"];
const ALL_STAMPS: Stamp[] = ["Mind", "Food", "Move", "Community", "Experience", "Health"];

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "#4F7DD4", pos: bmi / 40 };
  if (bmi < 25) return { label: "Balanced", color: "#4E9A62", pos: bmi / 40 };
  if (bmi < 30) return { label: "Watch", color: "#D6A64B", pos: bmi / 40 };
  return { label: "High", color: "#C4503A", pos: Math.min(bmi, 40) / 40 };
}

function initials(name: string, email?: string | null) {
  const source = name.trim() || email || "TenaLoop";
  return source
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function ProfilePage() {
  const {
    user,
    healthProfile,
    language,
    setLanguage,
    refreshProfile,
    score,
    scoreLabel,
    scoreColor,
    points,
    stamps,
  } = useWellness();

  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<string>(user?.role ?? "Individual");
  const [org, setOrg] = useState(user?.organization ?? "");
  const [gender, setGender] = useState<"Male" | "Female">(user?.gender === "Female" ? "Female" : "Male");
  const [dob, setDob] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().slice(0, 10) : "",
  );

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
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);
    if (!parsedWeight || !parsedHeight) return null;
    return (parsedWeight / (parsedHeight / 100) ** 2).toFixed(1);
  }, [weight, height]);

  const completenessItems = useMemo(
    () => [
      { label: "Identity", done: Boolean(name.trim() && dob) },
      { label: "Vitals", done: Boolean(weight && height && bloodType !== "Unknown") },
      { label: "Care notes", done: Boolean(allergies.length || conditions.length || meds.trim()) },
      { label: "Emergency", done: Boolean(emergency.trim()) },
      { label: "Metabolic", done: Boolean(diabetes !== "None" || sugar || pressure.trim()) },
    ],
    [allergies.length, bloodType, conditions.length, diabetes, dob, emergency, height, meds, name, pressure, sugar, weight],
  );

  const completeness = Math.round(
    (completenessItems.filter((item) => item.done).length / completenessItems.length) * 100,
  );

  const bmiVal = bmi ? parseFloat(bmi) : null;
  const bmiInfo = bmiVal ? bmiCategory(bmiVal) : null;
  const profileInitials = initials(name, user?.email);

  function toggleValue(list: string[], setList: (value: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function addCustom(type: "allergy" | "condition") {
    const value = customInput[type].trim();
    if (!value) return;

    if (type === "allergy") {
      if (!allergies.some((item) => item.toLowerCase() === value.toLowerCase())) {
        setAllergies([...allergies, value]);
      }
    } else if (!conditions.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setConditions([...conditions, value]);
    }

    setCustomInput((prev) => ({ ...prev, [type]: "" }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      setError("Could not save. Please sign in and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="-mx-4 -my-6 min-h-screen overflow-hidden px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      style={{
        backgroundColor: "#EEF2EA",
        backgroundImage:
          "linear-gradient(90deg, rgba(10,35,24,0.035) 1px, transparent 1px), linear-gradient(0deg, rgba(10,35,24,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <form onSubmit={handleSave} className="mx-auto grid max-w-7xl min-w-0 gap-6">
        <section className="relative min-w-0 overflow-hidden rounded-lg border border-[#0A2318]/10 bg-[#071C13] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10">
          <div
            aria-hidden
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(214,166,75,0.26), transparent 36%), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 44px 44px, 44px 44px",
            }}
          />

          <div className="relative grid min-w-0 gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:p-8">
            <div className="flex min-w-0 flex-col justify-between gap-6 lg:col-span-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/8">
                  <div
                    className="absolute inset-2 rounded-lg"
                    style={{
                      background: `conic-gradient(#D6A64B ${completeness * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
                    }}
                  />
                  <span className="relative grid h-16 w-16 place-items-center rounded-lg bg-[#F7F4EC] font-serif text-2xl font-bold text-[#0A2318]">
                    {profileInitials || <User size={26} />}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D6A64B]">
                    <User size={13} />
                    Profile studio
                  </div>
                  <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.02] text-white sm:text-5xl">
                    {name.trim() || "Build your wellness profile"}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#E8EDE7]/68">
                    <span className="inline-flex max-w-full items-center gap-2 truncate rounded-md border border-white/10 bg-white/6 px-3 py-2">
                      <Mail size={14} className="shrink-0 text-[#D6A64B]" />
                      <span className="truncate">{user?.email ?? "Not signed in"}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/6 px-3 py-2">
                      <Briefcase size={14} className="text-[#D6A64B]" />
                      {role}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/6 px-3 py-2">
                      <ShieldCheck size={14} className="text-[#D6A64B]" />
                      {completeness}% complete
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <HeroMetric icon={Activity} label="TenaScore" value={score.toString()} sub={scoreLabel} color={scoreColor} />
                <HeroMetric icon={Sparkles} label="Passport" value={`${stamps.length}/6`} sub={`${points} points`} color="#D6A64B" />
                <HeroMetric icon={Heart} label="BMI" value={bmi ?? "--"} sub={bmiInfo?.label ?? "Add vitals"} color={bmiInfo?.color ?? "#7CA6B8"} />
              </div>
            </div>

            <div className="grid content-start gap-3 rounded-lg border border-white/12 bg-[#F7F4EC] p-4 text-[#0A2318] shadow-2xl shadow-black/16 lg:col-span-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C6246]">
                    Readiness file
                  </p>
                  <p className="mt-1 font-serif text-3xl leading-none">{completeness}%</p>
                </div>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#0A2318] text-[#D6A64B]">
                  <BadgeCheck size={24} />
                </span>
              </div>

              <div className="grid gap-2">
                {completenessItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-[#0A2318]/8 bg-white px-3 py-2.5">
                    <span className="text-sm font-semibold text-[#0A2318]/76">{item.label}</span>
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-md border",
                        item.done
                          ? "border-[#5E7A5C]/30 bg-[#5E7A5C]/12 text-[#3F6544]"
                          : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/30",
                      )}
                    >
                      {item.done ? <Check size={13} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[304px_minmax(0,1fr)]">
          <aside className="grid content-start gap-4 xl:sticky xl:top-6">
            <ProfileSummary
              completeness={completeness}
              score={score}
              scoreLabel={scoreLabel}
              scoreColor={scoreColor}
              points={points}
              stamps={stamps}
              bmi={bmi}
              bmiInfo={bmiInfo}
            />
            <SavePanel saving={saving} saved={saved} error={error} />
          </aside>

          <main className="grid min-w-0 gap-5">
            <Panel title="Identity" icon={User} accent="#D6A64B">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Full name" value={name} onChange={setName} placeholder="Hana Tesfaye" icon={User} />
                <TextField label="Date of birth" type="date" value={dob} onChange={setDob} />
                <TextField label="Organization" value={org} onChange={setOrg} placeholder="Clinic or company" icon={Briefcase} />
                <SegmentedControl
                  label="Gender"
                  options={[
                    { label: "Male", value: "Male", Icon: Mars },
                    { label: "Female", value: "Female", Icon: Venus },
                  ]}
                  value={gender}
                  onChange={(value) => setGender(value as "Male" | "Female")}
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ChoiceGroup label="Community role" options={ROLES} value={role} onChange={setRole} />
                <ChoiceGroup label="App language" options={LANGUAGES} value={language} onChange={setLanguage} />
              </div>
            </Panel>

            <div className="grid min-w-0 gap-5 lg:grid-cols-2">
              <Panel title="Body Vitals" icon={Activity} accent="#4E9A62">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Weight" value={weight} onChange={setWeight} icon={Weight} unit="kg" inputMode="decimal" />
                  <TextField label="Height" value={height} onChange={setHeight} icon={Ruler} unit="cm" inputMode="decimal" />
                  <TextField label="Fasting sugar" value={sugar} onChange={setSugar} icon={Droplet} unit="mg/dL" inputMode="decimal" />
                  <TextField label="Blood pressure" value={pressure} onChange={setPressure} icon={Heart} placeholder="120/80" />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <SelectField label="Blood type" value={bloodType} onChange={setBloodType} options={BLOOD_TYPES} />
                  <ChoiceGroup label="Diabetes status" options={DIABETES_TYPES} value={diabetes} onChange={setDiabetes} compact />
                </div>

                <AnimatePresence>
                  {bmiInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-5 rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">BMI range</p>
                          <p className="mt-1 text-sm font-semibold text-[#0A2318]/70">{bmi} - {bmiInfo.label}</p>
                        </div>
                        <Activity size={18} style={{ color: bmiInfo.color }} />
                      </div>
                      <div className="relative mt-3 h-2 rounded-full bg-[linear-gradient(90deg,#4F7DD4,#4E9A62_46%,#D6A64B_70%,#C4503A)]">
                        <motion.span
                          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 bg-white shadow-sm"
                          style={{ borderColor: bmiInfo.color }}
                          initial={{ left: "0%" }}
                          animate={{ left: `${Math.min(Math.max(bmiInfo.pos * 100, 2), 96)}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Panel>

              <Panel title="Emergency" icon={Phone} accent="#4F7DD4">
                <div className="grid gap-4">
                  <TextField label="Emergency contact" value={emergency} onChange={setEmergency} placeholder="Name and phone" icon={Phone} />
                  <TextAreaField label="Additional notes" value={notes} onChange={setNotes} placeholder="Anything your care team should know..." rows={7} />
                </div>
              </Panel>
            </div>

            <Panel title="Care Details" icon={Pill} accent="#C4503A">
              <div className="grid gap-6 lg:grid-cols-2">
                <TagEditor
                  label="Allergies and intolerances"
                  options={COMMON_ALLERGIES}
                  selected={allergies}
                  onToggle={(value) => toggleValue(allergies, setAllergies, value)}
                  customValue={customInput.allergy}
                  onCustomChange={(value) => setCustomInput((prev) => ({ ...prev, allergy: value }))}
                  onAdd={() => addCustom("allergy")}
                  onRemove={(value) => setAllergies(allergies.filter((item) => item !== value))}
                  accent="#D6A64B"
                />
                <TagEditor
                  label="Conditions"
                  options={COMMON_CONDITIONS}
                  selected={conditions}
                  onToggle={(value) => toggleValue(conditions, setConditions, value)}
                  customValue={customInput.condition}
                  onCustomChange={(value) => setCustomInput((prev) => ({ ...prev, condition: value }))}
                  onAdd={() => addCustom("condition")}
                  onRemove={(value) => setConditions(conditions.filter((item) => item !== value))}
                  accent="#C4503A"
                />
              </div>

              <div className="mt-6">
                <TextAreaField
                  label="Medications"
                  value={meds}
                  onChange={setMeds}
                  placeholder="Daily medications, supplements, or recent prescriptions..."
                  rows={5}
                />
              </div>
            </Panel>

            <button
              type="submit"
              disabled={saving}
              className={cn(
                "inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg px-5 text-sm font-bold uppercase tracking-[0.16em] text-[#E8EDE7] shadow-sm transition active:scale-[0.99] disabled:opacity-80",
                saved ? "bg-[#4E9A62]" : "bg-[#0A2318] hover:bg-[#123624]",
              )}
            >
              {saved ? <CheckCircle size={18} /> : <Save size={18} />}
              {saved ? "Profile saved" : saving ? "Saving profile" : "Save profile"}
            </button>
          </main>
        </div>
      </form>
    </div>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: ElementType;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/8 px-3.5 py-3 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/52">
        <Icon size={13} style={{ color }} />
        {label}
      </div>
      <p className="mt-1 font-serif text-2xl leading-none text-white">{value}</p>
      <p className="mt-1 truncate text-xs text-[#E8EDE7]/50">{sub}</p>
    </div>
  );
}

function ProfileSummary({
  completeness,
  score,
  scoreLabel,
  scoreColor,
  points,
  stamps,
  bmi,
  bmiInfo,
}: {
  completeness: number;
  score: number;
  scoreLabel: string;
  scoreColor: string;
  points: number;
  stamps: Stamp[];
  bmi: string | null;
  bmiInfo: ReturnType<typeof bmiCategory> | null;
}) {
  return (
    <div className="rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6246]">Profile map</p>
          <h2 className="mt-1 font-serif text-2xl leading-tight text-[#0A2318]">Health passport</h2>
        </div>
        <div
          className="grid h-14 w-14 place-items-center rounded-full"
          style={{ background: `conic-gradient(#D6A64B ${completeness * 3.6}deg, rgba(10,35,24,0.1) 0deg)` }}
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F7F9F5] text-sm font-bold text-[#0A2318]">
            {completeness}%
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniStat label="Score" value={score.toString()} sub={scoreLabel} color={scoreColor} />
        <MiniStat label="Points" value={points.toString()} sub="passport" color="#D6A64B" />
        <MiniStat label="Stamps" value={`${stamps.length}/6`} sub="earned" color="#4F7DD4" />
        <MiniStat label="BMI" value={bmi ?? "--"} sub={bmiInfo?.label ?? "pending"} color={bmiInfo?.color ?? "#7CA6B8"} />
      </div>

      <div className="mt-5 grid gap-2">
        {ALL_STAMPS.map((stamp) => {
          const earned = stamps.includes(stamp);
          return (
            <div key={stamp} className="flex items-center justify-between gap-3 rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] px-3 py-2">
              <span className="text-xs font-bold text-[#0A2318]">{stamp}</span>
              <span
                className={cn(
                  "h-2.5 w-12 rounded-full",
                  earned ? "bg-[#5E7A5C]" : "bg-[#0A2318]/10",
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SavePanel({ saving, saved, error }: { saving: boolean; saved: boolean; error: string }) {
  return (
    <div className="rounded-lg border border-[#0A2318]/10 bg-[#071C13] p-4 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/8">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/8 text-[#D6A64B]">
          {saved ? <CheckCircle size={18} /> : <ShieldCheck size={18} />}
        </span>
        <div>
          <p className="text-sm font-bold">{saved ? "Saved" : saving ? "Saving" : "Ready to save"}</p>
          <p className="mt-1 text-xs leading-5 text-[#E8EDE7]/62">
            Profile updates your identity, health flags, and care notes in one secure pass.
          </p>
        </div>
      </div>
      {error ? (
        <p className="mt-4 rounded-lg border border-[#C4503A]/30 bg-[#C4503A]/12 px-3 py-2 text-xs font-semibold text-[#FFD8CF]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A2318]/42">{label}</p>
      <p className="mt-1 font-serif text-2xl leading-none text-[#0A2318]">{value}</p>
      <p className="mt-1 truncate text-[11px] font-semibold" style={{ color }}>
        {sub}
      </p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  icon: ElementType;
  accent: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5 sm:p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border bg-[#F7F9F5]" style={{ borderColor: `${accent}33`, color: accent }}>
          <Icon size={18} />
        </span>
        <h2 className="font-serif text-2xl leading-tight text-[#0A2318]">{title}</h2>
        <span className="h-px min-w-8 flex-1 bg-[#0A2318]/8" />
      </div>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  unit,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: ElementType;
  unit?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">{label}</span>
      <span className="relative block">
        {Icon ? (
          <Icon size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2318]/34" />
        ) : null}
        <input
          type={type}
          value={value}
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] text-sm text-[#0A2318] outline-none transition placeholder:text-[#0A2318]/34 focus:border-[#8C6246]/45 focus:bg-white",
            Icon ? "pl-10 pr-3" : "px-3",
            unit ? "pr-16" : "",
          )}
        />
        {unit ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wide text-[#0A2318]/36">
            {unit}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 text-sm text-[#0A2318] outline-none transition focus:border-[#8C6246]/45 focus:bg-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] p-3 text-sm leading-6 text-[#0A2318] outline-none transition placeholder:text-[#0A2318]/34 focus:border-[#8C6246]/45 focus:bg-white"
      />
    </label>
  );
}

function SegmentedControl({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string; Icon: ElementType }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ label: optionLabel, value: optionValue, Icon }) => {
          const selected = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition active:scale-[0.98]",
                selected
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                  : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/58 hover:border-[#0A2318]/22 hover:text-[#0A2318]",
              )}
            >
              <Icon size={15} />
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  compact,
}: {
  label: string;
  options: readonly T[];
  value: string;
  onChange: (value: T) => void;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg border px-3 text-xs font-bold transition active:scale-[0.98]",
                compact && "h-9 px-2.5 text-[11px]",
                selected
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                  : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/58 hover:border-[#0A2318]/22 hover:text-[#0A2318]",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TagEditor({
  label,
  options,
  selected,
  onToggle,
  customValue,
  onCustomChange,
  onAdd,
  onRemove,
  accent,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  customValue: string;
  onCustomChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (value: string) => void;
  accent: string;
}) {
  const customSelected = selected.filter((item) => !options.includes(item));

  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {[...options, ...customSelected].map((option) => {
          const isSelected = selected.includes(option);
          const isCustom = !options.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => (isCustom ? onRemove(option) : onToggle(option))}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold transition active:scale-[0.98]",
                isSelected
                  ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]"
                  : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/58 hover:border-[#0A2318]/22 hover:text-[#0A2318]",
              )}
              style={isSelected ? { backgroundColor: accent, borderColor: accent, color: accent === "#D6A64B" ? "#0A2318" : "#FFFFFF" } : undefined}
            >
              {option}
              {isCustom ? <X size={12} /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={customValue}
          onChange={(event) => onCustomChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdd();
            }
          }}
          placeholder="Add other..."
          className="h-10 min-w-0 flex-1 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 text-sm text-[#0A2318] outline-none transition placeholder:text-[#0A2318]/34 focus:border-[#8C6246]/45 focus:bg-white"
        />
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0A2318] px-3 text-xs font-bold text-[#E8EDE7] transition hover:bg-[#123624] active:scale-[0.98]"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
}
