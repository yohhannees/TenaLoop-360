import { cn } from "@/lib/utils";

type Props = { label: string; checked: boolean; onChange: () => void };

export default function Toggle({ label, checked, onChange }: Props) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={cn(
        "flex h-11 items-center justify-between gap-3 rounded-md border px-3 text-sm font-semibold transition",
        checked
          ? "border-[#0f6b52] bg-[#eef6f2] text-[#0f6b52]"
          : "border-[#d7e4dc] bg-white text-[#33483e] hover:border-[#0f6b52]",
      )}
    >
      {label}
      <span className={cn("h-5 w-9 rounded-full p-0.5 transition", checked ? "bg-[#0f6b52]" : "bg-[#cddbd3]")}>
        <span className={cn("block h-4 w-4 rounded-full bg-white transition", checked && "translate-x-4")} />
      </span>
    </button>
  );
}
