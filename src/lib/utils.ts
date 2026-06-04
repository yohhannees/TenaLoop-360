export function cn(...values: Array<string | false | undefined | null>): string {
  return values.filter(Boolean).join(" ");
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}
