"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";

const PUBLIC_ROUTES = new Set(["/", "/login", "/signup"]);

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_ROUTES.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen min-w-0 max-w-full overflow-hidden bg-[#E5EAE3] text-[#0A2318]">
      <Sidebar />

      {/* Main scroll area — offset top on mobile for the fixed top bar */}
      <main className="flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pt-14 lg:pt-0">
        <div className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
