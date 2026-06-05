import { cn } from "@/lib/utils";

type Props = { label: string; checked: boolean; onChange: () => void };

export default function Toggle({ label, checked, onChange }: Props) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={cn(
        "flex h-11 min-w-0 items-center justify-between gap-3 rounded-full border px-3 text-sm font-semibold transition",
        checked
          ? "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7] shadow-sm shadow-[#0A2318]/10"
          : "border-[#0A2318]/12 bg-[#E8EDE7] text-[#0A2318]/72 hover:border-[#8C6246] hover:text-[#0A2318]",
      )}
    >
      {label}
      <span
        className={cn(
          "h-5 w-9 rounded-full p-0.5 transition",
          checked ? "bg-[#D4C1A0]" : "bg-[#0A2318]/18",
        )}
      >
        <span
          className={cn(
            "block h-4 w-4 rounded-full bg-[#E8EDE7] transition",
            checked && "translate-x-4",
          )}
        />
      </span>
    </button>
  );
}
