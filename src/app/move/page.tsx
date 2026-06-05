import BreathingTimer from "@/components/move/BreathingTimer";
import WorkoutRoutines from "@/components/move/WorkoutRoutines";

export const metadata = { title: "TenaMove - TenaLoop 360" };

export default function MovePage() {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid min-w-0 content-start gap-5">
        <BreathingTimer />

        <section className="rounded-[2rem] border border-[#0A2318]/10 bg-[#E8EDE7] p-5 shadow-sm shadow-[#0A2318]/5">
          <p className="text-xs font-bold uppercase text-[#8C6246]">Walking challenge</p>
          <h2 className="font-serif text-3xl text-[#0A2318]">This week&apos;s goal</h2>
          <div className="mt-4 grid gap-3">
            {[
              { day: "Mon", done: true },
              { day: "Tue", done: true },
              { day: "Wed", done: false },
              { day: "Thu", done: false },
              { day: "Fri", done: false },
            ].map(({ day, done }) => (
              <div key={day} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#0A2318]">{day}</span>
                <div
                  className="flex-1 overflow-hidden rounded-full bg-[#0A2318]/10"
                  style={{ height: 8 }}
                >
                  <div
                    className="h-full rounded-full bg-[#8C6246]"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
                <span className="w-12 text-right text-[#0A2318]/58">
                  {done ? "20 min" : "-"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#0A2318]/64">
            2 of 5 days completed. Walk 15 minutes after lunch to hit today&apos;s goal.
          </p>
        </section>
      </div>

      <WorkoutRoutines />
    </div>
  );
}
