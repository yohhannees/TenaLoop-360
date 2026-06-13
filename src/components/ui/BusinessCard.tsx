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
  sage: "border-[#4C956C]/22 bg-[#F8FBF7] text-[#0A2318]",
  sand: "border-[#EFB84C]/32 bg-[#FFFCF3] text-[#0A2318]",
  clay: "border-[#D65A31]/24 bg-[#FCECE7] text-[#0A2318]",
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
        "group relative min-h-[214px] overflow-hidden rounded-lg border p-5 shadow-sm shadow-[#0A2318]/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0A2318]/10",
        toneClasses[tone],
      )}
    >
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-[0.14em]", isDark ? "text-[#EFB84C]" : "text-[#8C6246]")}>
            {label}
          </p>
          <h3 className="mt-3 max-w-52 font-serif text-xl leading-tight">{title}</h3>
        </div>
        <span className="font-mono text-xs font-bold opacity-45">{index}</span>
      </div>

      <div className="relative mt-6 flex items-end justify-between gap-4">
        <span className="font-serif text-5xl leading-none">{metric}</span>
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg border bg-white/35 transition group-hover:translate-x-1",
            isDark ? "border-[#E8EDE7]/18 text-[#EFB84C]" : "border-[#0A2318]/12 text-[#0A2318]",
          )}
        >
          <ArrowUpRight size={19} />
        </span>
      </div>

      <p className={cn("relative mt-4 text-sm leading-6", isDark ? "text-[#E8EDE7]/68" : "text-[#0A2318]/64")}>
        {body}
      </p>
    </article>
  );
}
