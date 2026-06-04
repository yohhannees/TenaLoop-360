import type { Metadata } from "next";
import "./globals.css";
import { WellnessProvider } from "@/context/WellnessContext";
import AppHeader from "@/components/layout/AppHeader";

export const metadata: Metadata = {
  title: "TenaLoop 360",
  description:
    "AI wellness passport for stress, food, movement, community, and wellness services in Addis Ababa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#f3f8f5] text-[#15231d]">
        <WellnessProvider>
          <AppHeader />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </main>
        </WellnessProvider>
      </body>
    </html>
  );
}
