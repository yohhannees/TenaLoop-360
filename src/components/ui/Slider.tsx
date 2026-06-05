type Props = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

export default function Slider({ label, min, max, value, onChange }: Props) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#0A2318]/82">
      <span className="flex items-center justify-between gap-3">
        {label}
        <span className="rounded-full bg-[#D4C1A0]/45 px-2.5 py-0.5 text-[#0A2318]">
          {value}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 accent-[#8C6246]"
      />
    </label>
  );
}
