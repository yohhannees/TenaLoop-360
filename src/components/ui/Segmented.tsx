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
      <span className="text-sm font-semibold text-[#0A2318]/82">{label}</span>
      <div
        className="grid gap-2 rounded-full bg-[#0A2318]/8 p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "h-10 rounded-full border px-3 text-sm font-semibold transition",
              option === value
                ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10"
                : "border-transparent bg-[#E8EDE7] text-[#0A2318]/72 hover:border-[#8C6246] hover:text-[#0A2318]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
