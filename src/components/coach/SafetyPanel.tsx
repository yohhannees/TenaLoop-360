const PRINCIPLES = [
  "Reflect and regulate stress before it becomes burnout.",
  "Suggest community and provider support when self-care is not enough.",
  "Frame guidance as wellness coaching, not diagnosis or therapy.",
  "Keep crisis and human escalation paths visible in production.",
];

export default function SafetyPanel() {
  return (
    <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
      <p className="text-sm font-medium uppercase text-[#64756b]">Safety layer</p>
      <h2 className="text-2xl font-semibold">First-line support</h2>
      <div className="mt-5 grid gap-3">
        {PRINCIPLES.map((item) => (
          <div
            key={item}
            className="rounded-md border border-[#dde8e1] bg-[#fbfdfb] p-3 text-sm leading-6 text-[#52665c]"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
