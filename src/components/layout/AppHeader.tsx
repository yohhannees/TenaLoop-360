"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/loop", label: "Loop" },
  { href: "/coach", label: "Coach" },
  { href: "/food", label: "Food" },
  { href: "/move", label: "Move" },
  { href: "/circles", label: "Circles" },
  { href: "/market", label: "Market" },
  { href: "/dashboard", label: "Dash" },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const { score, points, language, setLanguage } = useWellness();

  return (
    <header className="border-b border-[#d8e4dc] bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo + quick stats */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0f6b52] font-semibold text-white text-sm">
                TL
              </span>
              <span>
                <span className="block text-xl font-semibold leading-tight">TenaLoop 360</span>
                <span className="block text-xs text-[#5c6e65]">AI wellness passport · Addis Ababa</span>
              </span>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              <span className="rounded-md bg-[#eef6f2] px-2.5 py-1 text-sm font-semibold text-[#0f6b52]">
                Score {score}
              </span>
              <span className="rounded-md bg-[#fdf2ec] px-2.5 py-1 text-sm font-semibold text-[#88471f]">
                {points} pts
              </span>
            </div>
          </div>

          {/* Nav + language */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <nav className="grid grid-cols-4 gap-1.5 sm:flex sm:gap-1.5">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition",
                    pathname === href
                      ? "border-[#0f6b52] bg-[#0f6b52] text-white"
                      : "border-[#d7e4dc] bg-white text-[#33483e] hover:border-[#0f6b52]",
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as typeof language)}
              className="h-9 rounded-md border border-[#cddbd3] bg-white px-2 text-sm text-[#23362c]"
            >
              <option>English</option>
              <option>Amharic-ready</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
