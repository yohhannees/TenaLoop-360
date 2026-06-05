import BreathingTimer from "@/components/move/BreathingTimer";
import WorkoutRoutines from "@/components/move/WorkoutRoutines";

export const metadata = { title: "TenaMove - TenaLoop 360" };

export default function MovePage() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-5 content-start">
        <BreathingTimer />

        <section className="rounded-md border border-[#d8e4dc] bg-white p-4 shadow-sm">
          <p className="text-sm font-medium uppercase text-[#64756b]">Walking challenge</p>
          <h2 className="text-2xl font-semibold">This week&apos;s goal</h2>
          <div className="mt-4 grid gap-3">
            {[
              { day: "Mon", done: true },
              { day: "Tue", done: true },
              { day: "Wed", done: false },
              { day: "Thu", done: false },
              { day: "Fri", done: false },
            ].map(({ day, done }) => (
              <div key={day} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#31463b]">{day}</span>
                <div className="flex-1 overflow-hidden rounded-sm bg-[#e5eee8]" style={{ height: 8 }}>
                  <div
                    className="h-full rounded-sm bg-[#0f6b52]"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
                <span className="w-12 text-right text-[#64756b]">{done ? "20 min" : "—"}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#52665c]">
            2 of 5 days completed. Walk 15 minutes after lunch to hit today&apos;s goal.
          </p>
        </section>
      </div>

      <WorkoutRoutines />
    </div>
  );
}
