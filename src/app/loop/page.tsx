import CheckInForm from "@/components/loop/CheckInForm";
import ActionPlan from "@/components/loop/ActionPlan";

export const metadata = { title: "Rooted Body Intelligence - TenaLoop 360" };

export default function LoopPage() {
  return (
    <div className="loop-shell min-w-0">
      <CheckInForm />
      <ActionPlan />
    </div>
  );
}
