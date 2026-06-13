"use client";

import type { ElementType } from "react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BadgeCheck,
  Check,
  CircleCheckBig,
  DatabaseZap,
  Footprints,
  HeartPulse,
  LockKeyhole,
  Moon,
  Plug,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Unplug,
  Utensils,
} from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { INTEGRATIONS, INTEGRATION_GROUPS, Integration } from "@/lib/integrations";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/integrations/BrandLogo";
import ConnectModal from "@/components/integrations/ConnectModal";

const INK = "#0A2318";
const SAGE = "#5E7A5C";
const GOLD = "#D6A64B";

type GroupName = (typeof INTEGRATION_GROUPS)[number];
type GroupFilter = "All" | GroupName;

const GROUP_META: Record<GroupName, { Icon: ElementType; description: string; color: string }> = {
  "Fitness & movement": {
    Icon: Footprints,
    description: "Workouts, steps, recovery load",
    color: "#FC6A2F",
  },
  "Health & vitals": {
    Icon: HeartPulse,
    description: "Heart, body, biometric context",
    color: "#00A38A",
  },
  Nutrition: {
    Icon: Utensils,
    description: "Meals, macros, hydration",
    color: "#3E7D44",
  },
  "Sleep & recovery": {
    Icon: Moon,
    description: "Sleep, readiness, HRV",
    color: "#8A6FE8",
  },
};

function readStoredFlags(key: string) {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export default function IntegrationsPage() {
  const { award } = useWellness();
  const [connected, setConnected] = useState<Record<string, boolean>>(() => readStoredFlags("tl-integrations"));
  const [rewarded, setRewarded] = useState<Record<string, boolean>>(() => readStoredFlags("tl-integrations-rewarded"));
  const [active, setActive] = useState<Integration | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<GroupFilter>("All");

  function handleConnected(item: Integration) {
    setConnected((prev) => {
      const next = { ...prev, [item.id]: true };
      localStorage.setItem("tl-integrations", JSON.stringify(next));
      return next;
    });
    if (!rewarded[item.id]) {
      award(item.stamp, item.points);
      setRewarded((prev) => {
        const next = { ...prev, [item.id]: true };
        localStorage.setItem("tl-integrations-rewarded", JSON.stringify(next));
        return next;
      });
    }
  }

  function disconnect(item: Integration) {
    setConnected((prev) => {
      const next = { ...prev };
      delete next[item.id];
      localStorage.setItem("tl-integrations", JSON.stringify(next));
      return next;
    });
  }

  function syncNow(item: Integration) {
    setSyncing(item.id);
    setTimeout(() => setSyncing(null), 1100);
  }

  const connectedItems = useMemo(
    () => INTEGRATIONS.filter((item) => connected[item.id]),
    [connected],
  );
  const connectedCount = connectedItems.length;
  const syncedPoints = connectedItems.reduce((sum, item) => sum + item.points, 0);
  const signalCount = connectedItems.reduce((sum, item) => sum + item.imported.length, 0);
  const completion = Math.round((connectedCount / INTEGRATIONS.length) * 100);
  const nextConnection = INTEGRATIONS.find((item) => !connected[item.id]) ?? INTEGRATIONS[0];

  const visibleIntegrations = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return INTEGRATIONS.filter((item) => {
      if (activeGroup !== "All" && item.group !== activeGroup) return false;
      if (!needle) return true;

      const haystack = [
        item.name,
        item.group,
        item.blurb,
        item.stamp,
        ...item.scopes,
        ...item.imported.map((data) => data.label),
      ].join(" ").toLowerCase();

      return haystack.includes(needle);
    });
  }, [activeGroup, query]);

  const visibleGroups = useMemo(
    () =>
      INTEGRATION_GROUPS.map((group) => ({
        group,
        items: visibleIntegrations.filter((item) => item.group === group),
      })).filter(({ items }) => items.length > 0),
    [visibleIntegrations],
  );

  const filters: GroupFilter[] = ["All", ...INTEGRATION_GROUPS];

  return (
    <div
      className="-mx-4 -my-6 min-h-screen overflow-hidden px-4 py-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      style={{
        backgroundColor: "#EEF2EA",
        backgroundImage:
          "linear-gradient(90deg, rgba(10,35,24,0.035) 1px, transparent 1px), linear-gradient(0deg, rgba(10,35,24,0.03) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        color: INK,
      }}
    >
      <AnimatePresence>
        {active && (
          <ConnectModal
            integration={active}
            onClose={() => setActive(null)}
            onConnected={() => handleConnected(active)}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto grid max-w-7xl min-w-0 gap-6">
        <section className="relative min-w-0 overflow-hidden rounded-lg border border-[#0A2318]/10 bg-[#071C13] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10">
          <div
            aria-hidden
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(214,166,75,0.24), transparent 36%), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 44px 44px, 44px 44px",
            }}
          />

          <div className="relative grid min-w-0 gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:p-8">
            <div className="flex min-w-0 flex-col justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D6A64B]">
                  <DatabaseZap size={13} />
                  Integration studio
                </div>
                <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.02] text-white sm:text-5xl lg:text-6xl">
                  Your wellness stack, beautifully in sync.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#E8EDE7]/72 sm:text-base">
                  Connect the apps you already trust. TenaLoop turns workouts, meals,
                  sleep, and vitals into one private daily signal.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <HeroStat icon={CircleCheckBig} label="Connected" value={`${connectedCount}/${INTEGRATIONS.length}`} />
                <HeroStat icon={Sparkles} label="Passport points" value={`+${syncedPoints}`} />
                <HeroStat icon={Activity} label="Live signals" value={signalCount.toString()} />
              </div>
            </div>

            <SyncPreview connected={connected} completion={completion} />
          </div>
        </section>

        <section className="min-w-0 rounded-lg border border-[#0A2318]/10 bg-white p-3 shadow-sm shadow-[#0A2318]/5">
          <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(260px,0.92fr)_minmax(0,1.55fr)] xl:items-center">
            <label className="relative block min-w-0">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A2318]/38"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search apps, permissions, or synced data"
                className="h-12 w-full rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] pl-10 pr-4 text-sm text-[#0A2318] outline-none transition placeholder:text-[#0A2318]/38 focus:border-[#8C6246]/50 focus:bg-white"
              />
            </label>

            <div className="no-scrollbar flex min-w-0 max-w-full gap-2 overflow-x-auto">
              {filters.map((group) => {
                const count =
                  group === "All"
                    ? INTEGRATIONS.length
                    : INTEGRATIONS.filter((item) => item.group === group).length;
                const selected = activeGroup === group;
                const Icon = group === "All" ? BadgeCheck : GROUP_META[group].Icon;

                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setActiveGroup(group)}
                    className={cn(
                      "inline-flex h-12 shrink-0 items-center gap-2 rounded-lg border px-3 text-left text-xs font-semibold transition",
                      selected
                        ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/12"
                        : "border-[#0A2318]/10 bg-[#F7F9F5] text-[#0A2318]/68 hover:border-[#0A2318]/24 hover:text-[#0A2318]",
                    )}
                  >
                    <Icon size={15} />
                    <span className="whitespace-nowrap">{group}</span>
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px]",
                        selected ? "bg-white/14 text-white/72" : "bg-[#0A2318]/7 text-[#0A2318]/52",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[304px_minmax(0,1fr)]">
          <aside className="grid content-start gap-4 xl:sticky xl:top-6">
            <PassportPanel
              connected={connected}
              completion={completion}
              connectedCount={connectedCount}
              syncedPoints={syncedPoints}
              nextConnection={nextConnection}
              onConnect={setActive}
            />
            <SecurityPanel />
          </aside>

          <main className="grid min-w-0 content-start gap-7">
            {visibleGroups.length > 0 ? (
              visibleGroups.map(({ group, items }) => {
                const meta = GROUP_META[group];
                return (
                  <section key={group} className="grid min-w-0 gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border bg-white shadow-sm"
                          style={{ borderColor: `${meta.color}33`, color: meta.color }}
                        >
                          <meta.Icon size={18} />
                        </span>
                        <div className="min-w-0">
                          <h2 className="font-serif text-2xl leading-tight text-[#0A2318]">
                            {group}
                          </h2>
                          <p className="truncate text-xs text-[#0A2318]/54">{meta.description}</p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A2318]/42">
                        {items.length} app{items.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="grid min-w-0 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                      {items.map((item) => (
                        <IntegrationCard
                          key={item.id}
                          item={item}
                          isConnected={Boolean(connected[item.id])}
                          syncing={syncing === item.id}
                          onConnect={() => setActive(item)}
                          onDisconnect={() => disconnect(item)}
                          onSync={() => syncNow(item)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            ) : (
              <EmptyResults query={query} onReset={() => { setQuery(""); setActiveGroup("All"); }} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/12 bg-white/8 px-3.5 py-3 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/52">
        <Icon size={13} className="text-[#D6A64B]" />
        {label}
      </div>
      <p className="mt-1 font-serif text-2xl leading-none text-white">{value}</p>
    </div>
  );
}

function SyncPreview({
  connected,
  completion,
}: {
  connected: Record<string, boolean>;
  completion: number;
}) {
  const previewItems = INTEGRATIONS.slice(0, 6);

  return (
    <div className="min-w-0 rounded-lg border border-white/12 bg-[#F7F4EC] p-4 text-[#0A2318] shadow-2xl shadow-black/16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8C6246]">
            Sync health
          </p>
          <p className="mt-1 font-serif text-3xl leading-none">{completion}%</p>
        </div>
        <div
          className="grid h-16 w-16 place-items-center rounded-full"
          style={{ background: `conic-gradient(${GOLD} ${completion * 3.6}deg, rgba(10,35,24,0.1) 0deg)` }}
        >
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0A2318]">
            <Activity size={19} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-3 gap-2">
        {previewItems.map((item) => {
          const isConnected = connected[item.id];
          return (
            <div
              key={item.id}
              className="group relative min-h-24 min-w-0 overflow-hidden rounded-lg border bg-white p-3 shadow-sm"
              style={{ borderColor: isConnected ? `${item.color}55` : "rgba(10,35,24,0.1)" }}
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: item.color, opacity: isConnected ? 1 : 0.32 }}
              />
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5]">
                <BrandLogo slug={item.slug} color={item.color} name={item.name} Fallback={item.Icon} size={19} />
              </span>
              <p className="mt-2 truncate text-xs font-bold">{item.name}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0A2318]/38">
                {isConnected ? "Live" : "Ready"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#0A2318]/8 bg-white px-3 py-2.5">
        <LockKeyhole size={14} className="text-[#5E7A5C]" />
        <p className="text-xs leading-5 text-[#0A2318]/62">
          Read-only links stay local in this demo.
        </p>
      </div>
    </div>
  );
}

function PassportPanel({
  connected,
  completion,
  connectedCount,
  syncedPoints,
  nextConnection,
  onConnect,
}: {
  connected: Record<string, boolean>;
  completion: number;
  connectedCount: number;
  syncedPoints: number;
  nextConnection: Integration;
  onConnect: (item: Integration) => void;
}) {
  return (
    <div className="rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6246]">
            Passport sync
          </p>
          <h2 className="mt-1 font-serif text-2xl leading-tight text-[#0A2318]">Connection map</h2>
        </div>
        <div
          className="grid h-14 w-14 place-items-center rounded-full"
          style={{ background: `conic-gradient(${SAGE} ${completion * 3.6}deg, rgba(10,35,24,0.1) 0deg)` }}
        >
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F7F9F5] text-sm font-bold text-[#0A2318]">
            {completion}%
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniStat label="Connected" value={`${connectedCount}/${INTEGRATIONS.length}`} />
        <MiniStat label="Points" value={`+${syncedPoints}`} />
      </div>

      <div className="mt-5 grid gap-2">
        {INTEGRATION_GROUPS.map((group) => {
          const meta = GROUP_META[group];
          const total = INTEGRATIONS.filter((item) => item.group === group).length;
          const linked = INTEGRATIONS.filter((item) => item.group === group && connected[item.id]).length;
          const width = `${(linked / total) * 100}%`;

          return (
            <div key={group} className="rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <meta.Icon size={14} style={{ color: meta.color }} />
                  <span className="truncate text-xs font-bold text-[#0A2318]">{group}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#0A2318]/48">
                  {linked}/{total}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#0A2318]/10">
                <div className="h-full rounded-full transition-all duration-500" style={{ width, background: meta.color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-lg border border-[#D6A64B]/24 bg-[#FFF8E7] p-3">
        <div className="flex items-start gap-3">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border bg-white"
            style={{ borderColor: `${nextConnection.color}40` }}
          >
            <BrandLogo
              slug={nextConnection.slug}
              color={nextConnection.color}
              name={nextConnection.name}
              Fallback={nextConnection.Icon}
              size={20}
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8C6246]">Next best link</p>
            <p className="mt-1 truncate text-sm font-bold text-[#0A2318]">{nextConnection.name}</p>
            <p className="mt-1 text-xs leading-5 text-[#0A2318]/58">{nextConnection.blurb}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onConnect(nextConnection)}
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0A2318] px-3 text-sm font-bold text-[#E8EDE7] transition hover:bg-[#123624] active:scale-[0.99]"
        >
          <Plug size={15} />
          Connect {nextConnection.name}
        </button>
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="rounded-lg border border-[#0A2318]/10 bg-[#071C13] p-4 text-[#E8EDE7] shadow-sm shadow-[#0A2318]/8">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/8 text-[#D6A64B]">
          <ShieldCheck size={18} />
        </span>
        <div>
          <p className="text-sm font-bold">Private by design</p>
          <p className="mt-1 text-xs leading-5 text-[#E8EDE7]/62">
            Demo OAuth is read-only and stored on this device. Disconnect any app whenever you want.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-[#E8EDE7]/62">
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 py-2">
          <Check size={13} className="text-[#A8D4B5]" />
          Morning auto-sync
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/5 px-3 py-2">
          <Check size={13} className="text-[#A8D4B5]" />
          Passport points on first connection
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A2318]/42">{label}</p>
      <p className="mt-1 font-serif text-2xl leading-none text-[#0A2318]">{value}</p>
    </div>
  );
}

function IntegrationCard({
  item,
  isConnected,
  syncing,
  onConnect,
  onDisconnect,
  onSync,
}: {
  item: Integration;
  isConnected: boolean;
  syncing: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
}) {
  return (
    <motion.article
      layout
      className="group relative flex min-h-[286px] min-w-0 flex-col overflow-hidden rounded-lg border border-[#0A2318]/10 bg-white p-4 shadow-sm shadow-[#0A2318]/5 transition hover:-translate-y-0.5 hover:border-[#0A2318]/20 hover:shadow-lg hover:shadow-[#0A2318]/8"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: item.color }} />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-lg border bg-[#F7F9F5] shadow-sm"
            style={{ borderColor: `${item.color}40` }}
          >
            <BrandLogo slug={item.slug} color={item.color} name={item.name} Fallback={item.Icon} size={27} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-serif text-xl leading-tight text-[#0A2318]">{item.name}</h3>
            <p className="mt-1 truncate text-xs font-semibold text-[#0A2318]/45">{item.group}</p>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
            isConnected
              ? "border-[#5E7A5C]/22 bg-[#5E7A5C]/10 text-[#3F6544]"
              : "border-[#0A2318]/8 bg-[#F7F9F5] text-[#0A2318]/44",
          )}
        >
          {isConnected ? <Check size={11} strokeWidth={3} /> : <Plug size={11} />}
          {isConnected ? "Live" : "Ready"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="synced"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-5 flex-1"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-[#5E7A5C]">
              <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing now" : "Synced just now"}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {item.imported.map((data) => (
                <div key={data.label} className="min-w-0 rounded-lg border border-[#0A2318]/8 bg-[#F7F9F5] p-2.5">
                  <p className="truncate text-sm font-bold leading-none text-[#0A2318]">{data.value}</p>
                  <p className="mt-1 truncate text-[10px] font-semibold uppercase tracking-wide text-[#0A2318]/42">
                    {data.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-5 flex-1"
          >
            <p className="text-sm leading-6 text-[#0A2318]/64">{item.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {item.scopes.slice(0, 3).map((scope) => (
                <span
                  key={scope}
                  className="rounded-md border border-[#0A2318]/8 bg-[#F7F9F5] px-2 py-1 text-[11px] font-semibold text-[#0A2318]/58"
                >
                  {scope}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#0A2318]/8 pt-4">
        {isConnected ? (
          <>
            <button
              type="button"
              onClick={onSync}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] px-3 text-xs font-bold text-[#0A2318]/68 transition hover:border-[#0A2318]/20 hover:text-[#0A2318]"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              Sync now
            </button>
            <button
              type="button"
              onClick={onDisconnect}
              className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-xs font-bold text-[#0A2318]/44 transition hover:bg-[#0A2318]/5 hover:text-[#0A2318]/70"
            >
              <Unplug size={14} />
              Disconnect
            </button>
          </>
        ) : (
          <>
            <span className="min-w-0 truncate text-xs font-bold text-[#8C6246]">
              +{item.points} pts - {item.stamp}
            </span>
            <button
              type="button"
              onClick={onConnect}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0A2318] px-4 text-xs font-bold text-[#E8EDE7] transition hover:bg-[#123624] active:scale-[0.98]"
            >
              <Plug size={14} />
              Connect
            </button>
          </>
        )}
      </div>
    </motion.article>
  );
}

function EmptyResults({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="rounded-lg border border-[#0A2318]/10 bg-white p-10 text-center shadow-sm shadow-[#0A2318]/5">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-[#0A2318]/10 bg-[#F7F9F5] text-[#8C6246]">
        <Search size={20} />
      </span>
      <h2 className="mt-4 font-serif text-3xl text-[#0A2318]">No integrations found</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#0A2318]/58">
        {query ? `Nothing matches "${query}" yet.` : "That filter is empty right now."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#0A2318] px-4 text-sm font-bold text-[#E8EDE7] transition hover:bg-[#123624]"
      >
        Show all integrations
      </button>
    </div>
  );
}
