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
        className="grid min-w-0 gap-2 rounded-[1.5rem] bg-[#0A2318]/8 p-1 sm:rounded-full"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(86px, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "h-10 min-w-0 rounded-full border px-2 text-sm font-semibold transition sm:px-3",
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
