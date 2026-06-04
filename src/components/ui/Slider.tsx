type Props = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

export default function Slider({ label, min, max, value, onChange }: Props) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#31463b]">
      <span className="flex items-center justify-between gap-3">
        {label}
        <span className="text-[#64756b]">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 accent-[#0f6b52]"
      />
    </label>
  );
}
