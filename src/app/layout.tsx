import type { Metadata } from "next";
import "./globals.css";
import { WellnessProvider } from "@/context/WellnessContext";
import AppFrame from "@/components/layout/AppFrame";

export const metadata: Metadata = {
  title: "TenaLoop 360",
  description:
    "AI wellness passport for stress, food, movement, community, and wellness services in Addis Ababa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#f6f8f5] text-[#15231d]">
        <WellnessProvider>
          <AppFrame>{children}</AppFrame>
        </WellnessProvider>
      </body>
    </html>
  );
}
