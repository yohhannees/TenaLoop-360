"use client";

import { usePathname } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";

const PUBLIC_ROUTES = new Set(["/", "/login", "/signup"]);

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      <main className="w-full flex-1 bg-[#E5EAE3] px-4 py-6 text-[#0A2318] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl min-w-0">{children}</div>
      </main>
    </>
  );
}
