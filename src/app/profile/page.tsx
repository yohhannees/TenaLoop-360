"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, Briefcase, Save, CheckCircle } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { AuthUser } from "@/lib/types";

const ROLES = ["Individual", "Provider", "Employer", "Admin"] as const;

export default function ProfilePage() {
  const { user, language, setLanguage } = useWellness();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#0A2318]">Not signed in</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-4 h-10 rounded-full bg-[#0A2318] px-6 text-sm font-semibold text-[#E8EDE7]"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProfileForm
      key={user.id}
      user={user}
      language={language}
      setLanguage={setLanguage}
    />
  );
}

function ProfileForm({
  user,
  language,
  setLanguage,
}: {
  user: AuthUser;
  language: "English" | "Amharic-ready";
  setLanguage: (language: "English" | "Amharic-ready") => void;
}) {
  const [name, setName] = useState(user.name ?? "");
  const [role, setRole] = useState(user.role ?? "Individual");
  const [org, setOrg] = useState(user.organization ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, organization: org }),
      });

      if (!res.ok) {
        setError("Failed to save. Please try again.");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
        <div className="bg-[#0A2318] p-6 rounded-t-[2rem]">
          <p className="text-xs font-bold uppercase text-[#D4C1A0]">Account</p>
          <h1 className="mt-1 font-serif text-3xl text-[#E8EDE7]">Your profile</h1>
          <p className="mt-1 text-sm text-[#E8EDE7]/60">{user.email}</p>
        </div>

        <form onSubmit={handleSave} className="grid gap-5 p-6">

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
              <User size={13} />
              Display name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-11 rounded-xl border border-[#0A2318]/12 bg-[#E5EAE3] px-4 text-sm text-[#0A2318] placeholder:text-[#0A2318]/35 outline-none focus:border-[#8C6246]"
            />
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
              <Briefcase size={13} />
              Role
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`h-9 rounded-full px-4 text-xs font-semibold transition ${
                    role === r
                      ? "bg-[#0A2318] text-[#E8EDE7]"
                      : "border border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/65 hover:border-[#0A2318]/30"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase text-[#8C6246]">
              <Building2 size={13} />
              Organization
            </label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Company or school (optional)"
              className="h-11 rounded-xl border border-[#0A2318]/12 bg-[#E5EAE3] px-4 text-sm text-[#0A2318] placeholder:text-[#0A2318]/35 outline-none focus:border-[#8C6246]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase text-[#8C6246]">Language preference</label>
            <div className="flex gap-2">
              {(["English", "Amharic-ready"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`h-9 rounded-full px-4 text-xs font-semibold transition ${
                    language === lang
                      ? "bg-[#0A2318] text-[#E8EDE7]"
                      : "border border-[#0A2318]/12 bg-[#E5EAE3] text-[#0A2318]/65 hover:border-[#0A2318]/30"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0A2318] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#1A3A2A] disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle size={16} className="text-[#D4C1A0]" />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? "Saving..." : "Save changes"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
