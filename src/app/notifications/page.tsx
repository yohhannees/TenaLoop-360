"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d: { notifications?: Notification[] }) => {
        setNotifications(d.notifications ?? []);
        // Mark as read
        fetch("/api/notifications/read", { method: "PATCH" }).catch(() => {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] shadow-sm shadow-[#0A2318]/5">
        <div className="bg-[#0A2318] p-6 rounded-t-[2rem]">
          <div className="flex items-center gap-2 text-[#D4C1A0]">
            <Bell size={16} />
            <p className="text-xs font-bold uppercase">Inbox</p>
          </div>
          <h1 className="mt-1 font-serif text-3xl text-[#E8EDE7]">Notifications</h1>
        </div>

        <div className="p-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-[#0A2318]/45">Loading...</p>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 size={32} className="mx-auto text-[#0A2318]/25" />
              <p className="mt-3 font-serif text-xl text-[#0A2318]">All caught up</p>
              <p className="mt-1 text-sm text-[#0A2318]/45">No notifications yet.</p>
            </div>
          ) : (
            <div className="grid gap-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "rounded-2xl border p-4 transition",
                    n.read
                      ? "border-[#0A2318]/8 bg-[#E5EAE3]"
                      : "border-[#8C6246]/20 bg-[#D4C1A0]/20",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#0A2318]">{n.title}</p>
                    <span className="text-[10px] text-[#0A2318]/35 shrink-0">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {n.body && <p className="mt-1 text-xs leading-5 text-[#0A2318]/60">{n.body}</p>}
                  <span className="mt-2 inline-block rounded-full bg-[#0A2318]/8 px-2 py-0.5 text-[10px] font-semibold text-[#0A2318]/50">
                    {n.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
