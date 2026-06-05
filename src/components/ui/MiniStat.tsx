import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  tone: string;
  variant?: "light" | "dark";
};

export default function MiniStat({ label, value, tone, variant = "light" }: Props) {
  return (
    <div
      className={cn(
        "rounded-[1.25rem] border p-3",
        variant === "dark"
          ? "border-[#E8EDE7]/12 bg-[#E8EDE7]/8"
          : "border-[#0A2318]/10 bg-[#E8EDE7]",
      )}
    >
      <p
        className={cn(
          "text-xs font-medium uppercase",
          variant === "dark" ? "text-[#E8EDE7]/62" : "text-[#0A2318]/58",
        )}
      >
        {label}
      </p>
      <p className="mt-1 font-serif text-3xl" style={{ color: tone }}>
        {value}
      </p>
    </div>
  );
}
