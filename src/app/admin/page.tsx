"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useWellness } from "@/context/WellnessContext";
import { cn } from "@/lib/utils";

type ProviderRow = {
  id: string; name: string; type: string; area: string; price: string;
  category: string; avgRating: number; reviewCount: number; active: boolean;
  phone: string | null; hours: string | null;
};

type CircleRow = {
  id: string; name: string; time: string; focus: string; challenge: string;
  active: boolean; memberCount: number;
};

type Tab = "providers" | "circles";

export default function AdminPage() {
  const { user } = useWellness();
  const [tab, setTab] = useState<Tab>("providers");
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [circles, setCircles] = useState<CircleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Provider edit state
  const [editingProvider, setEditingProvider] = useState<ProviderRow | null>(null);

  // Circle edit state
  const [editingCircle, setEditingCircle] = useState<CircleRow | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/admin/providers"),
          fetch("/api/admin/circles"),
        ]);
        if (pRes.status === 403 || cRes.status === 403) {
          setError("You need Admin role to access this page.");
          return;
        }
        const pData = (await pRes.json()) as { providers: ProviderRow[] };
        const cData = (await cRes.json()) as { circles: CircleRow[] };
        setProviders(pData.providers ?? []);
        setCircles(cData.circles ?? []);
      } catch {
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function saveProvider() {
    if (!editingProvider) return;
    const res = await fetch(`/api/admin/providers/${editingProvider.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingProvider.name,
        type: editingProvider.type,
        area: editingProvider.area,
        price: editingProvider.price,
        category: editingProvider.category,
        phone: editingProvider.phone,
        hours: editingProvider.hours,
      }),
    });
    if (res.ok) {
      setProviders((prev) => prev.map((p) => (p.id === editingProvider.id ? editingProvider : p)));
      setEditingProvider(null);
    }
  }

  async function toggleProviderActive(p: ProviderRow) {
    const res = await fetch(`/api/admin/providers/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    if (res.ok) {
      setProviders((prev) => prev.map((r) => (r.id === p.id ? { ...r, active: !r.active } : r)));
    }
  }

  async function saveCircle() {
    if (!editingCircle) return;
    const res = await fetch(`/api/admin/circles/${editingCircle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingCircle.name,
        time: editingCircle.time,
        focus: editingCircle.focus,
        challenge: editingCircle.challenge,
      }),
    });
    if (res.ok) {
      setCircles((prev) => prev.map((c) => (c.id === editingCircle.id ? editingCircle : c)));
      setEditingCircle(null);
    }
  }

  async function toggleCircleActive(c: CircleRow) {
    const res = await fetch(`/api/admin/circles/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    if (res.ok) {
      setCircles((prev) => prev.map((r) => (r.id === c.id ? { ...r, active: !r.active } : r)));
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-8 text-center">
          <p className="font-serif text-2xl text-[#0A2318]">Access denied</p>
          <p className="mt-2 text-sm text-[#0A2318]/55">{error}</p>
          <p className="mt-1 text-xs text-[#0A2318]/40">Logged in as: {user?.email ?? "unknown"} ({user?.role})</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#0A2318] p-6 text-[#E8EDE7]">
        <p className="text-xs font-bold uppercase text-[#D4C1A0]">Admin panel</p>
        <h1 className="mt-1 font-serif text-4xl">Content management</h1>
        <p className="mt-2 text-sm text-[#E8EDE7]/60">
          Manage providers, circles, and platform content. Changes take effect immediately.
        </p>
      </section>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["providers", "circles"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "h-10 rounded-full px-5 text-sm font-semibold transition capitalize",
              tab === t ? "bg-[#0A2318] text-[#E8EDE7]" : "border border-[#0A2318]/12 text-[#0A2318]/65 hover:border-[#0A2318]/30",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-8 text-center text-sm text-[#0A2318]/55">
          Loading...
        </div>
      ) : tab === "providers" ? (
        <ProvidersTab
          providers={providers}
          editingProvider={editingProvider}
          setEditingProvider={setEditingProvider}
          saveProvider={saveProvider}
          toggleActive={toggleProviderActive}
        />
      ) : (
        <CirclesTab
          circles={circles}
          editingCircle={editingCircle}
          setEditingCircle={setEditingCircle}
          saveCircle={saveCircle}
          toggleActive={toggleCircleActive}
        />
      )}
    </div>
  );
}

function ProvidersTab({
  providers, editingProvider, setEditingProvider, saveProvider, toggleActive,
}: {
  providers: ProviderRow[];
  editingProvider: ProviderRow | null;
  setEditingProvider: (p: ProviderRow | null) => void;
  saveProvider: () => void;
  toggleActive: (p: ProviderRow) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#0A2318]/55">{providers.length} providers total</p>
      </div>
      {providers.map((p) =>
        editingProvider?.id === p.id ? (
          <div key={p.id} className="rounded-2xl border border-[#8C6246]/30 bg-[#E8EDE7] p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["name", "type", "area", "price", "category", "phone", "hours"] as const).map((field) => (
                <div key={field} className="grid gap-1">
                  <label className="text-[10px] font-bold uppercase text-[#0A2318]/45">{field}</label>
                  <input
                    type="text"
                    value={(editingProvider[field] as string) ?? ""}
                    onChange={(e) => setEditingProvider({ ...editingProvider, [field]: e.target.value })}
                    className="h-9 rounded-xl border border-[#0A2318]/12 bg-[#E5EAE3] px-3 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={saveProvider} className="flex items-center gap-1.5 h-9 rounded-full bg-[#0A2318] px-4 text-xs font-semibold text-[#E8EDE7]">
                <Check size={13} /> Save
              </button>
              <button type="button" onClick={() => setEditingProvider(null)} className="flex items-center gap-1.5 h-9 rounded-full border border-[#0A2318]/12 px-4 text-xs font-semibold text-[#0A2318]/65">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div key={p.id} className={cn("flex flex-wrap items-center gap-3 rounded-2xl border bg-[#E8EDE7] p-4", p.active ? "border-[#0A2318]/10" : "border-[#0A2318]/5 opacity-55")}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#0A2318]">{p.name}</p>
              <p className="text-xs text-[#0A2318]/50">{p.type} · {p.area} · {p.price} · ★{p.avgRating.toFixed(1)} ({p.reviewCount})</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditingProvider(p)} className="flex items-center gap-1 h-8 rounded-full border border-[#0A2318]/12 px-3 text-xs font-semibold text-[#0A2318]/65 hover:border-[#0A2318]/30">
                <Pencil size={12} /> Edit
              </button>
              <button type="button" onClick={() => toggleActive(p)} className={cn("flex items-center gap-1 h-8 rounded-full px-3 text-xs font-semibold", p.active ? "bg-[#C4503A]/12 text-[#C4503A] hover:bg-[#C4503A]/20" : "bg-[#0A2318]/8 text-[#0A2318]/55 hover:bg-[#0A2318]/14")}>
                {p.active ? <><Trash2 size={12} /> Deactivate</> : <><Plus size={12} /> Activate</>}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function CirclesTab({
  circles, editingCircle, setEditingCircle, saveCircle, toggleActive,
}: {
  circles: CircleRow[];
  editingCircle: CircleRow | null;
  setEditingCircle: (c: CircleRow | null) => void;
  saveCircle: () => void;
  toggleActive: (c: CircleRow) => void;
}) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-[#0A2318]/55">{circles.length} circles total</p>
      {circles.map((c) =>
        editingCircle?.id === c.id ? (
          <div key={c.id} className="rounded-2xl border border-[#8C6246]/30 bg-[#E8EDE7] p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              {(["name", "time", "focus", "challenge"] as const).map((field) => (
                <div key={field} className="grid gap-1">
                  <label className="text-[10px] font-bold uppercase text-[#0A2318]/45">{field}</label>
                  <input
                    type="text"
                    value={editingCircle[field]}
                    onChange={(e) => setEditingCircle({ ...editingCircle, [field]: e.target.value })}
                    className="h-9 rounded-xl border border-[#0A2318]/12 bg-[#E5EAE3] px-3 text-sm text-[#0A2318] outline-none focus:border-[#8C6246]"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={saveCircle} className="flex items-center gap-1.5 h-9 rounded-full bg-[#0A2318] px-4 text-xs font-semibold text-[#E8EDE7]">
                <Check size={13} /> Save
              </button>
              <button type="button" onClick={() => setEditingCircle(null)} className="flex items-center gap-1.5 h-9 rounded-full border border-[#0A2318]/12 px-4 text-xs font-semibold text-[#0A2318]/65">
                <X size={13} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div key={c.id} className={cn("flex flex-wrap items-center gap-3 rounded-2xl border bg-[#E8EDE7] p-4", c.active ? "border-[#0A2318]/10" : "border-[#0A2318]/5 opacity-55")}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#0A2318]">{c.name}</p>
              <p className="text-xs text-[#0A2318]/50">{c.time} · {c.memberCount} members</p>
              <p className="mt-0.5 text-xs text-[#0A2318]/40 truncate">{c.focus}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditingCircle(c)} className="flex items-center gap-1 h-8 rounded-full border border-[#0A2318]/12 px-3 text-xs font-semibold text-[#0A2318]/65 hover:border-[#0A2318]/30">
                <Pencil size={12} /> Edit
              </button>
              <button type="button" onClick={() => toggleActive(c)} className={cn("flex items-center gap-1 h-8 rounded-full px-3 text-xs font-semibold", c.active ? "bg-[#C4503A]/12 text-[#C4503A] hover:bg-[#C4503A]/20" : "bg-[#0A2318]/8 text-[#0A2318]/55 hover:bg-[#0A2318]/14")}>
                {c.active ? <><Trash2 size={12} /> Deactivate</> : <><Plus size={12} /> Activate</>}
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
