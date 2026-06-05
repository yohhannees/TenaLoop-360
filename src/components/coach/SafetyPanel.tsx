const PRINCIPLES = [
  "Reflect and regulate stress before it becomes burnout.",
  "Suggest community and provider support when self-care is not enough.",
  "Frame guidance as wellness coaching, not diagnosis or therapy.",
  "Keep crisis and human escalation paths visible in production.",
];

export default function SafetyPanel() {
  return (
    <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
      <p className="text-xs font-bold uppercase text-[#8C6246]">Safety layer</p>
      <h2 className="font-serif text-3xl text-[#0A2318]">First-line support</h2>
      <div className="mt-5 grid gap-3">
        {PRINCIPLES.map((item) => (
          <div
            key={item}
            className="rounded-[1.25rem] border border-[#0A2318]/10 bg-[#E5EAE3] p-3 text-sm leading-6 text-[#0A2318]/66"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
