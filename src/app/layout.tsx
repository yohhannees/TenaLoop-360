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
      <body className="h-full bg-[#E5EAE3] text-[#0A2318]">
        <WellnessProvider>
          <AppFrame>{children}</AppFrame>
        </WellnessProvider>
      </body>
    </html>
  );
}
