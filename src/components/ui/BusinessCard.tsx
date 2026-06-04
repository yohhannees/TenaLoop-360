type Props = { label: string; title: string; metric: string; body: string };

export default function BusinessCard({ label, title, metric, body }: Props) {
  return (
    <article className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-3xl font-semibold text-[#1d84a6]">{metric}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#52665c]">{body}</p>
    </article>
  );
}
