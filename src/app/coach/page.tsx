import ChatWindow from "@/components/coach/ChatWindow";
import SafetyPanel from "@/components/coach/SafetyPanel";

export const metadata = { title: "TenaBot - TenaLoop 360" };

export default function CoachPage() {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
      <ChatWindow />
      <SafetyPanel />
    </div>
  );
}
