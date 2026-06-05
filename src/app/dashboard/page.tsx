import ScoreTrend from "@/components/dashboard/ScoreTrend";
import ActionDeck from "@/components/dashboard/ActionDeck";
import PassportStamps from "@/components/dashboard/PassportStamps";
import BusinessMetrics from "@/components/dashboard/BusinessMetrics";
import PatternInsights from "@/components/dashboard/PatternInsights";

export const metadata = { title: "Dashboard - TenaLoop 360" };

export default function DashboardPage() {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5">
      <ScoreTrend />
      <ActionDeck />
      <PatternInsights />
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <PassportStamps />
        <BusinessMetrics />
      </div>
    </div>
  );
}
