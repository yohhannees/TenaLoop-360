import ChatWindow from "@/components/coach/ChatWindow";
import SafetyPanel from "@/components/coach/SafetyPanel";

export const metadata = { title: "TenaBot - TenaLoop 360" };

export default function CoachPage() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <ChatWindow />
      <SafetyPanel />
    </div>
  );
}
