import CheckInForm from "@/components/loop/CheckInForm";
import ActionPlan from "@/components/loop/ActionPlan";

export const metadata = { title: "Daily Loop - TenaLoop 360" };

export default function LoopPage() {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <CheckInForm />
      <ActionPlan />
    </div>
  );
}
