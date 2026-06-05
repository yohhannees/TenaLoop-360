type Props = { score: number; color: string };

export default function ScoreRing({ score, color }: Props) {
  return (
    <div
      className="grid h-24 w-24 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${score * 3.6}deg, rgb(10 35 24 / 0.12) 0deg)` }}
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[#E8EDE7]">
        <span className="font-serif text-2xl" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}
