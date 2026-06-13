import OutcomesStrip from "@/components/dashboard/OutcomesStrip";
import ScoreTrend from "@/components/dashboard/ScoreTrend";
import ActionDeck from "@/components/dashboard/ActionDeck";
import PassportStamps from "@/components/dashboard/PassportStamps";
import BusinessMetrics from "@/components/dashboard/BusinessMetrics";
import PatternInsights from "@/components/dashboard/PatternInsights";

export const metadata = { title: "Dashboard - TenaLoop 360" };

export default function DashboardPage() {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8C6246]">Dashboard</p>
          <h1 className="mt-1 font-serif text-4xl leading-tight text-[#0A2318]">Wellness command center</h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#0A2318]/58">
          Live score, check-ins, passport progress, and recommended next actions from your real activity.
        </p>
      </div>
      <OutcomesStrip />
      <ScoreTrend />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ActionDeck />
        <PatternInsights />
      </div>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <PassportStamps />
        <BusinessMetrics />
      </div>
    </div>
  );
}
