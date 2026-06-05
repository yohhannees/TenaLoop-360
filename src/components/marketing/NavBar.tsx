"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Brain,
  House,
  Leaf,
  Mail,
  Layers,
  ArrowRight,
} from "lucide-react";

const sections = [
  { href: "#cover",    icon: House,    label: "Home"     },
  { href: "#chapters", icon: Layers,   label: "Chapters" },
  { href: "#work",     icon: Brain,    label: "Loops"    },
  { href: "#services", icon: Activity, label: "Method"   },
  { href: "#contact",  icon: Mail,     label: "Contact"  },
];

export default function NavBar() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 60 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed left-1/2 top-5 z-50 -translate-x-1/2 transition-[transform,opacity] duration-500",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-[calc(100%+24px)] opacity-0",
      ].join(" ")}
    >
      <nav className="flex items-center gap-3 rounded-full border border-[#E8EDE7]/12 bg-[#0A2318]/92 px-3 py-2 shadow-[0_10px_40px_-8px_rgba(10,35,24,0.5)] backdrop-blur-md">

        {/* Logo mark */}
        <Link
          href="/"
          aria-label="TenaLoop"
          className="group flex h-8 w-8 items-center justify-center rounded-full bg-[#8C6246] text-[#E8EDE7] transition-transform duration-300 hover:rotate-12 hover:scale-110"
        >
          <Leaf size={13} />
        </Link>

        <div className="h-4 w-px bg-[#E8EDE7]/18" />

        {/* Section icons */}
        {sections.map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            aria-label={label}
            className="group relative flex h-8 w-8 items-center justify-center rounded-full text-[#E8EDE7]/45 transition-colors duration-200 hover:bg-[#E8EDE7]/10 hover:text-[#D4C1A0]"
          >
            <Icon size={16} strokeWidth={1.8} />
            {/* tooltip */}
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E8EDE7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#0A2318] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {label}
            </span>
          </a>
        ))}

        <div className="hidden h-4 w-px bg-[#E8EDE7]/18 sm:block" />

        {/* CTA */}
        <Link
          href="/signup"
          className="group hidden items-center gap-1.5 rounded-full bg-[#8C6246] px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#E8EDE7] transition-all hover:bg-[#D4C1A0] hover:text-[#0A2318] active:scale-95 sm:flex"
        >
          Start
          <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </nav>
    </header>
  );
}
