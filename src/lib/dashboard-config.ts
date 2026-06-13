export type DashboardConfig = {
  reward: {
    pointThreshold: number;
    requiredStamps: number;
    discountLabel: string;
    discountPct: number;
    eligibleCategories: string[];
  };
  business: {
    monetizationLanes: {
      id: string;
      label: string;
    }[];
  };
};

export const dashboardConfigDefaults: DashboardConfig = {
  reward: {
    pointThreshold: 240,
    requiredStamps: 4,
    discountLabel: "20% off a yoga, spa, or nutrition booking",
    discountPct: 20,
    eligibleCategories: ["Movement", "Recovery", "Food"],
  },
  business: {
    monetizationLanes: [
      { id: "premium-ai", label: "Premium AI coaching" },
      { id: "marketplace", label: "Marketplace commission" },
      { id: "provider-saas", label: "Provider SaaS" },
      { id: "b2b-insights", label: "B2B insights" },
    ],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asPositiveInt(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[]) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : fallback;
}

export function normalizeDashboardConfig(value: unknown): DashboardConfig {
  if (!isRecord(value)) return dashboardConfigDefaults;

  const reward = isRecord(value.reward) ? value.reward : {};
  const business = isRecord(value.business) ? value.business : {};
  const lanes = Array.isArray(business.monetizationLanes)
    ? business.monetizationLanes
        .filter(isRecord)
        .map((lane, index) => ({
          id: asString(lane.id, `lane-${index + 1}`),
          label: asString(lane.label, `Lane ${index + 1}`),
        }))
    : dashboardConfigDefaults.business.monetizationLanes;

  return {
    reward: {
      pointThreshold: asPositiveInt(
        reward.pointThreshold,
        dashboardConfigDefaults.reward.pointThreshold,
      ),
      requiredStamps: Math.min(
        6,
        asPositiveInt(reward.requiredStamps, dashboardConfigDefaults.reward.requiredStamps),
      ),
      discountLabel: asString(reward.discountLabel, dashboardConfigDefaults.reward.discountLabel),
      discountPct: asPositiveInt(reward.discountPct, dashboardConfigDefaults.reward.discountPct),
      eligibleCategories: asStringArray(
        reward.eligibleCategories,
        dashboardConfigDefaults.reward.eligibleCategories,
      ),
    },
    business: {
      monetizationLanes:
        lanes.length > 0 ? lanes : dashboardConfigDefaults.business.monetizationLanes,
    },
  };
}
