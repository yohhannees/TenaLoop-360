import { FoodSignal } from "@/lib/types";

type Props = { signal: FoodSignal };

export default function MealGuidance({ signal }: Props) {
  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase text-[#64756b]">AI meal guidance</p>
          <h2 className="text-2xl font-semibold">{signal.risk} risk plate</h2>
        </div>
        <span className="rounded-md bg-[#f8eadf] px-3 py-2 text-sm font-semibold text-[#88471f]">
          {signal.score}/100
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#52665c]">{signal.insight}</p>

      <div className="mt-4 rounded-md bg-[#eef6f2] p-3 text-sm leading-6 text-[#284237]">
        Better next choice: {signal.swap}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {signal.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[#ecf2fb] px-2.5 py-1 text-xs font-medium text-[#28506f]"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
