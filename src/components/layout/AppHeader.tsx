"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bot,
  Dumbbell,
  Globe2,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Store,
  Users,
  Utensils,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/loop", label: "Loop", icon: Activity },
  { href: "/coach", label: "Coach", icon: Bot },
  { href: "/food", label: "Food", icon: Utensils },
  { href: "/move", label: "Move", icon: Dumbbell },
  { href: "/circles", label: "Circles", icon: Users },
  { href: "/market", label: "Market", icon: Store },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const { score, points, language, setLanguage } = useWellness();

  return (
    <header className="sticky top-0 z-40 border-b border-[#0A2318]/10 bg-[#E5EAE3]/92 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-4 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10">
                <Activity size={22} strokeWidth={1.5} />
              </span>
              <span>
                <span className="block font-serif text-xl leading-tight text-[#0A2318]">
                  TenaLoop 360
                </span>
                <span className="block text-xs text-[#0A2318]/58">Wellness command center</span>
              </span>
            </Link>

            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
              <div className="flex items-center gap-2">
                <MetricPill label="Score" value={score.toString()} />
                <MetricPill label="Points" value={points.toString()} warm />
              </div>

              <label className="flex h-10 min-w-0 max-w-[158px] flex-1 items-center gap-2 rounded-full border border-[#0A2318]/10 bg-[#E8EDE7]/85 px-3 text-sm text-[#0A2318]/72 shadow-sm shadow-[#0A2318]/5 sm:flex-none">
                <Globe2 size={16} className="text-[#8C6246]" />
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as typeof language)}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                >
                  <option>English</option>
                  <option>Amharic-ready</option>
                </select>
              </label>

              <Link
                href="/signup"
                aria-label="Upgrade"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#8C6246] px-4 text-sm font-semibold text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10 transition hover:bg-[#724F38]"
              >
                <Sparkles size={16} />
                <span className="hidden sm:inline">Upgrade</span>
              </Link>

              <Link
                href="/"
                aria-label="Sign out"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#0A2318]/12 bg-[#E8EDE7]/85 px-4 text-sm font-semibold text-[#0A2318]/72 shadow-sm shadow-[#0A2318]/5 transition hover:border-[#0A2318]/35 hover:text-[#0A2318]"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </Link>
            </div>
          </div>

          <nav className="no-scrollbar flex w-full min-w-0 gap-1.5 overflow-x-auto rounded-full border border-[#0A2318]/10 bg-[#E8EDE7]/78 p-1 shadow-sm shadow-[#0A2318]/5">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex h-10 min-w-28 flex-1 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition",
                  pathname === href
                    ? "bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/15"
                    : "text-[#0A2318]/68 hover:bg-[#D4C1A0]/25 hover:text-[#0A2318]",
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function MetricPill({
  label,
  value,
  warm = false,
}: {
  label: string;
  value: string;
  warm?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold shadow-sm shadow-[#0A2318]/5",
        warm
          ? "bg-[#D4C1A0]/55 text-[#0A2318]"
          : "bg-[#0A2318] text-[#E8EDE7]",
      )}
    >
      <span className="hidden text-xs uppercase text-current/65 sm:inline">{label}</span>
      {value}
    </span>
  );
}
