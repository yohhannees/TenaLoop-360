"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Sparkles,
  Store,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/loop",      label: "Daily Loop",  sub: "Check in",   Icon: RefreshCw },
  { href: "/coach",     label: "TenaBot",     sub: "AI coach",   Icon: Bot },
  { href: "/food",      label: "TenaPlate",   sub: "Nutrition",  Icon: Utensils },
  { href: "/move",      label: "TenaMove",    sub: "Movement",   Icon: Dumbbell },
  { href: "/circles",   label: "TenaCircle",  sub: "Community",  Icon: Users },
  { href: "/market",    label: "TenaMarket",  sub: "Booking",    Icon: Store },
  { href: "/dashboard", label: "Dashboard",   sub: "Analytics",  Icon: LayoutDashboard },
] as const;

const ALL_STAMPS = ["Mind", "Food", "Move", "Community", "Experience", "Health"] as const;

// Sidebar-safe score colors (all legible on #0A2318 dark bg)
function sidebarColor(score: number) {
  if (score >= 80) return "#A8D4B5";
  if (score >= 65) return "#D4C1A0";
  if (score >= 50) return "#E8BE78";
  return "#E89070";
}

function sidebarLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Stable";
  if (score >= 50) return "Watch";
  return "Reset";
}

export default function Sidebar() {
  const pathname = usePathname();
  const { score, points, stamps, language, setLanguage } = useWellness();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const color = sidebarColor(score);
  const label = sidebarLabel(score);

  // Persist collapse preference
  useEffect(() => {
    const stored = localStorage.getItem("tl-sidebar");
    if (stored !== "1") return;

    const id = window.setTimeout(() => setCollapsed(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  function toggleCollapse() {
    setCollapsed((prev) => {
      localStorage.setItem("tl-sidebar", !prev ? "1" : "0");
      return !prev;
    });
  }

  function close() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* ── Mobile top bar ───────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#0A2318]/10 bg-[#E5EAE3]/95 px-4 backdrop-blur-sm lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0A2318]">
            <Activity size={16} strokeWidth={1.5} className="text-[#D4C1A0]" />
          </span>
          <span className="font-serif text-base font-bold text-[#0A2318]">TenaLoop</span>
        </Link>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ backgroundColor: color + "22", color }}
          >
            {score} · {label}
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#0A2318]/12 bg-white/60 text-[#0A2318]"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* ── Mobile backdrop ──────────────────────────────────────────── */}
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-[#0A2318]/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0A2318] transition-[width,transform] duration-300 ease-in-out",
          // desktop
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[72px]" : "lg:w-64",
          // mobile
          mobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-white/8",
            collapsed ? "justify-center px-0" : "justify-between px-4",
          )}
        >
          {!collapsed && (
            <Link href="/" onClick={close} className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#D4C1A0]/15">
                <Activity size={16} strokeWidth={1.5} className="text-[#D4C1A0]" />
              </span>
              <div>
                <p className="font-serif text-sm font-bold leading-tight text-[#E8EDE7]">
                  TenaLoop 360
                </p>
                <p className="text-[10px] text-[#E8EDE7]/68">Wellness passport</p>
              </div>
            </Link>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            className={cn(
              "hidden h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-[#E8EDE7]/72 transition hover:border-white/25 hover:text-white lg:flex",
              collapsed && "mx-auto",
            )}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Mobile close */}
          <button
            onClick={close}
            className="ml-auto grid h-8 w-8 place-items-center text-[#E8EDE7]/82 transition hover:text-[#E8EDE7] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Score widget */}
        <div
          className={cn(
            "shrink-0 border-b border-white/8",
            collapsed ? "px-0 py-4" : "px-4 py-4",
          )}
        >
          {collapsed ? (
            <div className="flex flex-col items-center gap-2.5">
              {/* Mini ring */}
              <div
                className="grid h-11 w-11 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(${color} ${score * 3.6}deg, #1A3A2A 0deg)`,
                }}
              >
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#0A2318]">
                  <span className="text-[10px] font-bold" style={{ color }}>
                    {score}
                  </span>
                </div>
              </div>
              {/* Stamp dots */}
              <div className="flex flex-wrap justify-center gap-1">
                {ALL_STAMPS.map((s) => (
                  <span
                    key={s}
                    className="h-1.5 w-1.5 rounded-full transition"
                    style={{ backgroundColor: stamps.includes(s) ? color : "#1A3A2A" }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {/* Label row */}
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#E8EDE7]/65">
                  Today
                </p>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: color + "20", color }}
                >
                  {label}
                </span>
              </div>

              {/* Ring + points row */}
              <div className="flex items-center gap-3">
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(${color} ${score * 3.6}deg, #1A3A2A 0deg)`,
                  }}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0A2318]">
                    <span className="text-sm font-bold" style={{ color }}>
                      {score}
                    </span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#E8EDE7]/68">Points</span>
                    <span className="font-semibold text-[#D4C1A0]">{points}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (points / 600) * 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#E8EDE7]/65">
                    <span>Passport</span>
                    <span>{stamps.length}/6 stamps</span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {ALL_STAMPS.map((s) => (
                      <span
                        key={s}
                        title={s}
                        className="h-2 flex-1 rounded-full transition"
                        style={{
                          backgroundColor: stamps.includes(s) ? color : "#1A3A2A",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto py-3">
          {!collapsed && (
            <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-[#E8EDE7]/60">
              Navigate
            </p>
          )}
          <div className={cn("grid gap-0.5", collapsed ? "px-2" : "px-2")}>
            {NAV.map(({ href, label: navLabel, sub, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  title={collapsed ? navLabel : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-all duration-150",
                    active
                      ? "bg-white/10 text-[#E8EDE7]"
                      : "text-[#E8EDE7]/82 hover:bg-white/6 hover:text-white",
                    collapsed && "justify-center",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition",
                      active
                        ? "text-[#D4C1A0]"
                        : "text-current group-hover:text-[#E8EDE7]/90",
                    )}
                    style={active ? { backgroundColor: color + "20" } : undefined}
                  >
                    <Icon size={16} strokeWidth={active ? 2 : 1.5} />
                  </span>

                  {!collapsed && (
                    <>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-tight">
                          {navLabel}
                        </p>
                        <p className="truncate text-[10px] text-[#E8EDE7]/65">{sub}</p>
                      </div>
                      {active && (
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "shrink-0 grid gap-1 border-t border-white/8 py-3",
            collapsed ? "px-2" : "px-3",
          )}
        >
          {collapsed ? (
            <>
              <button
                onClick={() =>
                  setLanguage(language === "English" ? "Amharic-ready" : "English")
                }
                title="Toggle language"
                className="mx-auto grid h-8 w-8 place-items-center rounded-lg text-[#E8EDE7]/68 transition hover:text-[#E8EDE7]/90"
              >
                <Globe2 size={15} strokeWidth={1.5} />
              </button>
              <Link
                href="/"
                title="Sign out"
                className="mx-auto grid h-8 w-8 place-items-center rounded-lg text-[#E8EDE7]/65 transition hover:text-[#E8EDE7]/90"
              >
                <LogOut size={15} strokeWidth={1.5} />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                onClick={close}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#8C6246] text-sm font-semibold text-[#E8EDE7] transition hover:bg-[#724F38]"
              >
                <Sparkles size={15} />
                Upgrade to Premium
              </Link>
              <div className="flex items-center justify-between px-1 pt-1">
                <button
                  onClick={() =>
                    setLanguage(language === "English" ? "Amharic-ready" : "English")
                  }
                  className="flex items-center gap-1.5 text-[10px] text-[#E8EDE7]/65 transition hover:text-[#E8EDE7]/90"
                >
                  <Globe2 size={12} />
                  {language}
                </button>
                <Link
                  href="/"
                  onClick={close}
                  className="flex items-center gap-1.5 text-[10px] text-[#E8EDE7]/65 transition hover:text-[#E8EDE7]/90"
                >
                  <LogOut size={12} />
                  Sign out
                </Link>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
