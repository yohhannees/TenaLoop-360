import { cn } from "@/lib/utils";

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function Segmented({ label, options, value, onChange }: Props) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-[#31463b]">{label}</span>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "h-10 rounded-md border px-3 text-sm font-semibold transition",
              option === value
                ? "border-[#0f6b52] bg-[#0f6b52] text-white"
                : "border-[#d7e4dc] bg-white text-[#33483e] hover:border-[#0f6b52]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
