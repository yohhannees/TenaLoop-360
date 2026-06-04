import { clamp } from "@/lib/utils";

type Props = { label: string; value: number };

export default function MetricBar({ label, value }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[#31463b]">{label}</span>
        <span className="text-[#64756b]">{Math.round(value)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-sm bg-[#e5eee8]">
        <div className="h-full rounded-sm bg-[#1d84a6]" style={{ width: `${clamp(value)}%` }} />
      </div>
    </div>
  );
}
