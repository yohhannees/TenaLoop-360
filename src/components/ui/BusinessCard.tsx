type Props = { label: string; title: string; metric: string; body: string };

export default function BusinessCard({ label, title, metric, body }: Props) {
  return (
    <article className="rounded-md border border-[#d7e3db] bg-white p-5 shadow-sm transition hover:border-[#a8cdbd] hover:shadow-md">
      <p className="text-sm font-semibold uppercase text-[#64756b]">{label}</p>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="max-w-40 text-lg font-semibold leading-snug">{title}</h3>
        <span className="rounded-md bg-[#edf6f1] px-3 py-2 text-3xl font-semibold text-[#0f6b52]">
          {metric}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#52665c]">{body}</p>
    </article>
  );
}
