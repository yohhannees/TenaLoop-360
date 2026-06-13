"use client";

import { useEffect, useState } from "react";
import {
  DashboardConfig,
  dashboardConfigDefaults,
  normalizeDashboardConfig,
} from "@/lib/dashboard-config";

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(dashboardConfigDefaults);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/dashboard/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { config?: unknown }) => {
        if (!cancelled) setConfig(normalizeDashboardConfig(data.config));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
