type Props = { label: string; title: string; metric: string; body: string };

export default function BusinessCard({ label, title, metric, body }: Props) {
  return (
    <article className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5 transition hover:border-[#8C6246]/40 hover:shadow-md">
      <p className="text-xs font-bold uppercase text-[#8C6246]">{label}</p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="max-w-40 font-serif text-xl leading-snug text-[#0A2318]">{title}</h3>
        <span className="rounded-[1.25rem] bg-[#D4C1A0]/50 px-3 py-2 font-serif text-3xl text-[#0A2318]">
          {metric}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#0A2318]/64">{body}</p>
    </article>
  );
}
