import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "forest" | "sage" | "sand" | "clay";

type Props = {
  label: string;
  title: string;
  metric: string;
  body: string;
  index?: string;
  tone?: Tone;
};

const toneClasses: Record<Tone, string> = {
  forest: "border-[#0A2318] bg-[#0A2318] text-[#E8EDE7]",
  sage: "border-[#0A2318]/10 bg-[#E8EDE7] text-[#0A2318]",
  sand: "border-[#D4C1A0] bg-[#D4C1A0] text-[#0A2318]",
  clay: "border-[#8C6246] bg-[#8C6246] text-[#E8EDE7]",
};

export default function BusinessCard({
  label,
  title,
  metric,
  body,
  index = "01",
  tone = "sage",
}: Props) {
  const isDark = tone === "forest" || tone === "clay";

  return (
    <article
      className={cn(
        "group relative min-h-64 overflow-hidden rounded-[2rem] border p-5 shadow-sm shadow-[#0A2318]/5 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A2318]/10",
        toneClasses[tone],
      )}
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full border border-current/12" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-40 w-40 rounded-full border border-current/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={cn("text-xs font-bold uppercase", isDark ? "text-[#D4C1A0]" : "text-[#8C6246]")}>
            {label}
          </p>
          <h3 className="mt-4 max-w-48 font-serif text-2xl leading-tight">{title}</h3>
        </div>
        <span className="font-mono text-xs font-bold opacity-45">{index}</span>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <span className="font-serif text-6xl leading-none">{metric}</span>
        <span
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full border transition group-hover:translate-x-1",
            isDark ? "border-[#E8EDE7]/18 text-[#D4C1A0]" : "border-[#0A2318]/12 text-[#0A2318]",
          )}
        >
          <ArrowUpRight size={19} />
        </span>
      </div>

      <p className={cn("relative mt-5 text-sm leading-6", isDark ? "text-[#E8EDE7]/68" : "text-[#0A2318]/64")}>
        {body}
      </p>
    </article>
  );
}
