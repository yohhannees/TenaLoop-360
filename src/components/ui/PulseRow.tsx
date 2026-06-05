type Props = { label: string; value: number };

export default function PulseRow({ label, value }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[#0A2318]/82">{label}</span>
        <span className="text-[#0A2318]/58">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#0A2318]/10">
        <div className="h-full rounded-full bg-[#8C6246]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
