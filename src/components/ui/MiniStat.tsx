type Props = { label: string; value: string; tone: string };

export default function MiniStat({ label, value, tone }: Props) {
  return (
    <div className="rounded-md border border-[#d8e4dc] bg-[#fbfdfb] p-3">
      <p className="text-xs font-medium uppercase text-[#64756b]">{label}</p>
      <p className="mt-1 text-2xl font-semibold" style={{ color: tone }}>
        {value}
      </p>
    </div>
  );
}
