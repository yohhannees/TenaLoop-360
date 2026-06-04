type Props = { score: number; color: string };

export default function ScoreRing({ score, color }: Props) {
  return (
    <div
      className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, #dce5df 0deg)` }}
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-white">
        <span className="text-xl font-semibold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}
