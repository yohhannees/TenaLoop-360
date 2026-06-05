import { FoodSignal } from "@/lib/types";

type Props = { signal: FoodSignal };

export default function MealGuidance({ signal }: Props) {
  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase text-[#8C6246]">AI meal guidance</p>
          <h2 className="font-serif text-3xl text-[#0A2318]">{signal.risk} risk plate</h2>
        </div>
        <span className="rounded-full bg-[#D4C1A0]/45 px-3 py-2 text-sm font-semibold text-[#0A2318]">
          {signal.score}/100
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#0A2318]/64">{signal.insight}</p>

      <div className="mt-4 rounded-[1.25rem] bg-[#D4C1A0]/30 p-3 text-sm leading-6 text-[#0A2318]/76">
        Better next choice: {signal.swap}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {signal.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#0A2318]/10 bg-[#E5EAE3] px-3 py-1 text-xs font-medium text-[#0A2318]/68"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
