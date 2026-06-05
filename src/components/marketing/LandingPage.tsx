import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "./NavBar";
import {
  Activity,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarCheck,
  Dumbbell,
  Mail,
  Send,
  Store,
  Users,
  Utensils,
  Wind,
} from "lucide-react";

const paperTexture: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(10,35,24,0.12) 0.7px, transparent 0.7px), linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0))",
  backgroundSize: "13px 13px, 100% 100%",
};

const darkTexture: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(232,237,231,0.08) 0.7px, transparent 0.7px)",
  backgroundSize: "12px 12px",
};

const coverTexture: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(10,35,24,0.16) 0.8px, transparent 0.8px), linear-gradient(135deg, rgba(232,237,231,0.12), rgba(140,98,70,0.16))",
  backgroundSize: "12px 12px, 100% 100%",
};

const spiralStyle: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='80' viewBox='0 0 40 80'%3E%3Cellipse cx='20' cy='40' rx='9' ry='30' fill='%230A2318' stroke='%23D4C1A0' stroke-width='4' /%3E%3C/svg%3E\")",
  backgroundPosition: "center",
  backgroundRepeat: "repeat-x",
};

const collageTiles = [
  {
    src: "/tenaloop-photo-dashboard.jpg",
    alt: "Real wellness app on a phone",
    position: "50% 50%",
  },
  {
    src: "/tenaloop-photo-mind.jpg",
    alt: "Real breath practice in a quiet room",
    position: "50% 48%",
  },
  {
    src: "/tenaloop-photo-food-plate.jpg",
    alt: "Real nourishing meal on a table",
    position: "50% 52%",
  },
  {
    src: "/tenaloop-photo-circle-group.jpg",
    alt: "Real community gathering from a distance",
    position: "50% 42%",
  },
  {
    src: "/tenaloop-photo-move.jpg",
    alt: "Real walking group from behind",
    position: "50% 50%",
  },
  {
    src: "/tenaloop-photo-market.jpg",
    alt: "Real wellness provider interior",
    position: "50% 54%",
  },
  {
    src: "/tenaloop-photo-contact.jpg",
    alt: "Real outdoor wellness path",
    position: "50% 50%",
  },
  {
    src: "/tenaloop-photo-dashboard.jpg",
    alt: "Real TenaLoop-style mobile app moment",
    position: "50% 50%",
  },
  {
    src: "/tenaloop-photo-food-plate.jpg",
    alt: "Real local meal guidance scene",
    position: "50% 52%",
  },
  {
    src: "/tenaloop-photo-mind.jpg",
    alt: "Real breathing practice from afar",
    position: "50% 48%",
  },
  {
    src: "/tenaloop-photo-circle-group.jpg",
    alt: "Real peer support circle from above",
    position: "50% 42%",
  },
  {
    src: "/tenaloop-photo-market.jpg",
    alt: "Real provider booking space",
    position: "50% 54%",
  },
  {
    src: "/tenaloop-photo-move.jpg",
    alt: "Real distant movement practice",
    position: "50% 50%",
  },
  {
    src: "/tenaloop-photo-contact.jpg",
    alt: "Real start of a wellness loop",
    position: "50% 50%",
  },
];

const contents = [
  {
    href: "#intro",
    number: "01.",
    title: "Welcome to TenaLoop",
    label: "Start here",
  },
  {
    href: "#chapters",
    number: "02.",
    title: "Product chapters",
    label: "Four layers",
  },
  {
    href: "#rooted",
    number: "03.",
    title: "Rooted Body Intelligence",
    label: "AI wellness path",
  },
  {
    href: "#work",
    number: "04.",
    title: "Selected wellness loops",
    label: "Product modules",
  },
  {
    href: "#services",
    number: "05.",
    title: "The psychology of daily care",
    label: "Our method",
  },
];

const rootedSteps = [
  { step: "Breathe", icon: Wind,          detail: "3-min Efoy reset. ትንፍስ · ተዝናና · ዕፎይ." },
  { step: "Move",    icon: Dumbbell,      detail: "Spine-safe neck release. 10-min walk after lunch." },
  { step: "Nourish", icon: Utensils,      detail: "Shiro, misir, gomen, injera. Iron-rich on cycle days." },
  { step: "Reflect", icon: BookOpen,      detail: "Where did I feel pressure before I noticed it in my mind?" },
  { step: "Connect", icon: Users,         detail: "Women's circle, ALX burnout group, or peer loop." },
  { step: "Refer",   icon: CalendarCheck, detail: "Yoga, spine check, women's telehealth, or mindfulness." },
];



const workCards = [
  {
    icon: Brain,
    title: "TenaBot Reset",
    meta: "AI Coach / Stress Signals / Breath",
    year: "01",
    src: "/tenaloop-photo-mind.jpg",
    position: "50% 48%",
  },
  {
    icon: Utensils,
    title: "TenaPlate Guidance",
    meta: "Local Meals / Fasting / BP Friendly",
    year: "02",
    src: "/tenaloop-photo-food-plate.jpg",
    position: "50% 52%",
    raised: true,
  },
  {
    icon: Users,
    title: "TenaCircle Support",
    meta: "Peer Groups / Mood Pulse / Stamps",
    year: "03",
    src: "/tenaloop-photo-circle-group.jpg",
    position: "50% 42%",
  },
];

const productChapters = [
  {
    icon: Brain,
    number: "01",
    title: "TenaBot",
    kicker: "Intelligence",
    summary: "AI coach, stress signal, breathing reset",
    body: "TenaBot reads the daily check-in and turns stress, sleep, food, movement, and support signals into one small action that can happen right now.",
    src: "/tenaloop-photo-mind.jpg",
    position: "50% 48%",
    tone: "bg-[#E8EDE7] text-[#0A2318]",
    accent: "text-[#8C6246]",
  },
  {
    icon: Utensils,
    number: "02",
    title: "TenaPlate",
    kicker: "Nourishment",
    summary: "Local meals, fasting rhythm, BP and glucose care",
    body: "The food layer understands familiar plates like shiro, misir, gomen, tibs, coffee, and injera, then suggests a better next choice without fighting local culture.",
    src: "/tenaloop-photo-food-plate.jpg",
    position: "50% 52%",
    tone: "bg-[#D4C1A0] text-[#0A2318]",
    accent: "text-[#0A2318]",
  },
  {
    icon: Dumbbell,
    number: "03",
    title: "TenaMove",
    kicker: "Momentum",
    summary: "Guided movement, simulations, and beginner-safe routines",
    body: "Movement turns from guilt into a doable progression: breathing, mobility, walk clubs, short workouts, and routines that match the user's energy.",
    src: "/tenaloop-photo-move.jpg",
    position: "50% 50%",
    tone: "bg-[#8C6246] text-[#E8EDE7]",
    accent: "text-[#D4C1A0]",
  },
  {
    icon: CalendarCheck,
    number: "04",
    title: "TenaMarket",
    kicker: "Care network",
    summary: "Providers, bookings, bundles, and passport rewards",
    body: "The marketplace closes the loop with local yoga, nutrition, screening, spa, counseling, walking, and recovery services matched to today's score.",
    src: "/tenaloop-photo-market.jpg",
    position: "50% 54%",
    tone: "bg-[#0A2318] text-[#E8EDE7]",
    accent: "text-[#D4C1A0]",
  },
];

const method = [
  {
    title: "01. Check in",
    body: "Capture mood, stress, sleep, food, movement, water, and support in one quick ritual.",
  },
  {
    title: "02. Decode",
    body: "Turn daily signals into a TenaScore that points to the next best wellness action.",
  },
  {
    title: "03. Close",
    body: "Stamp the passport through breathing, meals, walks, circles, and local experiences.",
  },
  {
    title: "04. Scale",
    body: "Give employers, clinics, and campuses anonymous wellness patterns without exposing people.",
  },
];

function RootedBodySection() {
  return (
    <section
      id="rooted"
      className="relative mb-0 rounded-[2rem] bg-[#E8EDE7] p-4 text-[#0A2318] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] sm:p-8 md:p-12"
      style={paperTexture}
    >
      {/* header */}
      <div className="mb-10 flex flex-col gap-4 border-b-4 border-[#0A2318] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C6246]">
            Rooted Body Intelligence
          </p>
          <h2 className="mt-2 font-serif text-5xl leading-none md:text-7xl">
            What is your body<br className="hidden sm:block" /> telling you today?
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#0A2318]/62">
          AI that listens to stress, pain, sleep, food, women&apos;s cycle, and culture —
          then creates one culturally rooted wellness path.
        </p>
      </div>

      {/* 6-step path */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {rootedSteps.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A2318] text-[#D4C1A0]">
                  <Icon size={17} />
                </span>
                {i < 5 && (
                  <span className="hidden h-px flex-1 bg-[#0A2318]/14 lg:block" />
                )}
              </div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8C6246]">
                {String(i + 1).padStart(2, "0")}. {item.step}
              </p>
              <p className="text-xs leading-5 text-[#0A2318]/58">{item.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Hana demo callout */}
      <div className="mt-10 overflow-hidden rounded-[1.5rem] bg-[#0A2318] p-6 text-[#E8EDE7] md:p-8">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D4C1A0]">
          Demo scenario — Hana, 26 · ALX student · Addis
        </p>
        <p className="max-w-2xl font-serif text-xl italic leading-relaxed text-[#E8EDE7]/75 md:text-2xl">
          &ldquo;I slept 4 hours, I feel stressed, my neck hurts, my period is coming,
          and I ate firfir with coffee.&rdquo;
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#E8EDE7]/18 px-3 py-1 font-mono text-xs font-semibold text-[#E8EDE7]/55">
            TenaScore: 52/100
          </span>
          <span className="text-[#D4C1A0]/40">→</span>
          {["Breathe", "Move", "Nourish", "Reflect", "Connect", "Refer"].map((s) => (
            <span
              key={s}
              className="rounded-full bg-[#E8EDE7]/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#D4C1A0]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

   

      {/* CTA */}
      <div className="mt-10">
        <Link
          href="/loop"
          className="inline-flex items-center gap-2 rounded-full bg-[#0A2318] px-6 py-3 font-sans text-sm font-bold uppercase tracking-wider text-[#E8EDE7] transition hover:bg-[#8C6246]"
        >
          Open the loop <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function SpiralDivider() {
  return (
    <div className="relative z-30 -my-6 h-16 w-full overflow-hidden">
      <div className="absolute -left-[10%] h-full w-[120%]" style={spiralStyle} />
    </div>
  );
}

function HeroTile({
  index,
  src,
  alt,
  position,
}: {
  index: number;
  src: string;
  alt: string;
  position: string;
}) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-[#0A2318]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 25vw, 140px"
        className="object-cover saturate-[0.92] transition-all duration-300 group-hover:scale-105 group-hover:saturate-100"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-[#0A2318]/18 mix-blend-multiply" />
      <div className="absolute bottom-1 left-1 text-[8px] font-mono text-[#E8EDE7] opacity-0 transition-opacity group-hover:opacity-100">
        FIG.{index + 1}
      </div>
    </div>
  );
}

function ProductChapters() {
  return (
    <section
      id="chapters"
      className="relative mb-0 rounded-[2rem] bg-[#0A2318] p-4 text-[#E8EDE7] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] sm:p-8 md:p-12"
      style={darkTexture}
    >
      <div className="mb-10 flex flex-col gap-4 border-b border-[#E8EDE7]/14 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-[#D4C1A0]">
            Product chapters
          </p>
          <h2 className="mt-2 font-serif text-5xl leading-none md:text-7xl">
            One loop, four layers.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#E8EDE7]/66">
          The app moves from signal to action to support, then brings that rhythm
          back into the next daily check-in.
        </p>
      </div>

      <div className="relative grid gap-8 pb-4">
        {productChapters.map((chapter, index) => {
          const Icon = chapter.icon;
          return (
            <article
              key={chapter.title}
              className={`sticky top-4 min-h-[calc(100svh-2rem)] overflow-hidden rounded-[1.5rem] border border-[#E8EDE7]/14 shadow-[5px_5px_20px_rgba(0,0,0,0.22)] sm:top-6 sm:min-h-[calc(100svh-3rem)] lg:top-8 lg:min-h-[calc(100vh-4rem)] ${chapter.tone}`}
              style={{ zIndex: index + 1 }}
            >
              <div className="grid min-h-[inherit] gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:p-8">
                <div className="flex min-w-0 flex-col justify-between">
                  <div>
                    <div className={`mb-6 flex items-center gap-2 text-xs font-bold uppercase ${chapter.accent}`}>
                      <Icon size={17} />
                      {chapter.kicker}
                    </div>
                    <h3 className="font-serif text-5xl leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
                      {chapter.title}
                    </h3>
                  </div>

                  <div className="mt-10 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
                    <p className="font-serif text-5xl leading-none tracking-normal opacity-28 sm:text-6xl">
                      {chapter.number}
                    </p>
                    <div className="min-w-0">
                      <p className="font-serif text-2xl leading-tight sm:text-3xl">
                        {chapter.summary}
                      </p>
                      <p className="mt-4 text-sm leading-6 opacity-72">
                        {chapter.body}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 items-center">
                  <div className="relative h-[320px] w-full overflow-hidden rounded-[1.25rem] border border-current/12 bg-[#0A2318] sm:h-[400px] lg:h-[460px]">
                    <Image
                      src={chapter.src}
                      alt={`${chapter.title} product chapter`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 340px"
                      className="object-cover saturate-[0.92] transition duration-700 hover:scale-105"
                      style={{ objectPosition: chapter.position }}
                    />
                    <div className="absolute inset-0 bg-[#0A2318]/18 mix-blend-multiply" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full border border-[#E8EDE7]/16 bg-[#0A2318]/66 px-4 py-2.5 text-[10px] font-bold uppercase text-[#E8EDE7] backdrop-blur">
                      <span>{chapter.title}</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A2318] px-2 py-8 font-sans text-[#0A2318] antialiased selection:bg-[#D4C1A0] selection:text-[#0A2318] sm:px-4 md:px-8">
      <NavBar />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={darkTexture} />

      <div className="relative z-10 mx-auto min-h-[90vh] max-w-5xl [perspective:1000px]">
        <section
          id="cover"
          className="relative mb-0 flex min-h-[60vh] origin-left flex-col justify-between overflow-hidden rounded-[2rem] bg-[#8C6246] p-4 text-[#0A2318] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] transition-transform duration-700 sm:p-8 md:p-12"
          style={coverTexture}
        >
          <div className="pointer-events-none absolute inset-0 bg-[#D4C1A0]/20 mix-blend-multiply" />

          <div className="relative z-10 mt-8 space-y-4 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] opacity-70 sm:text-xs sm:tracking-[0.3em]">
              The daily wellness, AI and local care
            </p>
            <h1 className="max-w-full text-4xl font-black uppercase leading-[0.88] tracking-normal text-[#0A2318] sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="block sm:inline">TenaLoop</span>{" "}
              <span className="block sm:inline">360</span>
            </h1>
            <div className="my-4 h-px w-full bg-[#0A2318]/22" />
            <p className="mx-auto max-w-[17rem] text-xs font-bold uppercase leading-5 tracking-[0.12em] sm:max-w-none sm:text-sm sm:tracking-[0.22em] md:text-base">
              Build a wellness loop that actually closes
            </p>
          </div>

          <div className="relative z-10 mx-auto my-8 grid w-full max-w-[18rem] grid-cols-3 gap-2 px-2 sm:max-w-none sm:grid-cols-4 md:my-12 md:grid-cols-7 md:px-12">
            {collageTiles.map((tile, index) => (
              <HeroTile
                key={`${tile.src}-${index}`}
                index={index}
                src={tile.src}
                alt={tile.alt}
                position={tile.position}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-end justify-between gap-4 border-t border-[#0A2318]/22 pt-4">
            <div className="text-xs font-mono uppercase">
              Vol. 2026
              <br />
              TenaLoop Labs
            </div>
            <div className="flex items-center gap-2 text-right text-xs font-mono uppercase">
              <Link href="/login" className="hidden hover:text-[#E8EDE7] sm:inline">
                Log in
              </Link>
              <span className="hidden opacity-35 sm:inline">/</span>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#0A2318] px-4 py-2 font-sans text-sm font-bold normal-case text-[#E8EDE7] transition hover:bg-[#1A3A2A]"
              >
                Start demo <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <SpiralDivider />

        <section
          id="contents"
          className="relative mb-0 flex min-h-[80vh] flex-col rounded-[2rem] bg-[#E5EAE3] p-4 text-[#0A2318] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] sm:p-8 md:p-12"
          style={paperTexture}
        >
          <div className="mb-8 flex flex-col gap-2 border-b-4 border-[#0A2318] pb-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-wider">
                TenaLoop 360
              </span>
              <h2 className="text-5xl font-black tracking-normal sm:text-6xl md:text-7xl">
                CONTENTS
              </h2>
            </div>
            <span className="font-mono text-sm sm:mt-2">2026</span>
          </div>

          <div className="flex flex-grow flex-col gap-8 md:flex-row">
            <div className="relative w-full md:w-5/12">
              <div className="relative min-h-[300px] h-full w-full overflow-hidden border-2 border-[#0A2318] bg-[#8C6246]">
                <Image
                  src="/tenaloop-photo-dashboard.jpg"
                  alt="Real phone wellness dashboard"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover saturate-[0.92] transition-all duration-500 hover:saturate-100"
                  style={{ objectPosition: "50% 50%" }}
                />
                <div className="absolute bottom-4 left-4 border border-[#0A2318] bg-[#E8EDE7] px-2 py-1 text-xs font-bold uppercase">
                  Daily loop
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col justify-center space-y-4 md:w-7/12">
              {contents.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group cursor-pointer border-b border-[#0A2318]/18 pb-3 transition-colors hover:border-[#0A2318]"
                >
                  <div className="flex items-baseline space-x-4">
                    <span className="font-mono text-lg font-bold text-[#0A2318]/35 transition-colors group-hover:text-[#8C6246]">
                      {item.number}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold uppercase tracking-normal transition-transform duration-300 group-hover:translate-x-2 md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs font-mono uppercase text-[#0A2318]/48 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {item.label}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <SpiralDivider />

        <section
          id="intro"
          className="relative mb-0 rounded-[2rem] border-t-8 border-[#8C6246] bg-[#E8EDE7] p-8 text-[#0A2318] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] md:p-16"
        >
          <div className="max-w-3xl">
            <h2 className="mb-8 text-4xl font-black uppercase leading-tight md:text-5xl">
              Wellness is not just about feeling{" "}
              <span className="font-serif italic lowercase text-[#8C6246]">well</span>.
              <br />
              It is about rhythm.
            </h2>
            <div className="flex flex-col gap-8 font-mono text-sm leading-relaxed md:flex-row">
              <p className="flex-1">
                TenaLoop helps people track the small daily signals that shape burnout,
                energy, movement, food, and support. The app turns those signals into
                one clear TenaScore and one action path.
              </p>
              <p className="flex-1">
                This landing page is built like an editorial wellness field guide:
                tactile, direct, and designed to make the full product story feel
                premium before users ever enter the dashboard.
              </p>
            </div>
          </div>
        </section>

        <SpiralDivider />

        <ProductChapters />

        <SpiralDivider />

        <RootedBodySection />

        <SpiralDivider />

        <section
          id="work"
          className="relative mb-0 min-h-screen rounded-[2rem] bg-[#0A2318] p-4 text-[#E8EDE7] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] sm:p-8 md:p-12"
          style={darkTexture}
        >
          <div className="mb-12 flex items-center justify-between border-b border-[#E8EDE7]/14 pb-4">
            <h2 className="text-5xl font-black uppercase text-[#E8EDE7] md:text-7xl">
              Selected Loops
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {workCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className={card.raised ? "group cursor-pointer md:mt-16" : "group cursor-pointer"}>
                  <div className="relative mb-4 aspect-[4/5] overflow-hidden border border-[#E8EDE7]/14">
                    <div className="absolute inset-0 z-10 bg-[#8C6246] opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-25" />
                    <Image
                      src={card.src}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 440px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: card.position }}
                    />
                    <div className="absolute right-4 top-4 z-20 bg-[#E8EDE7] px-3 py-1 text-xs font-bold text-[#0A2318]">
                      {card.year}
                    </div>
                  </div>
                  <div className="flex items-end justify-between border-t border-[#E8EDE7]/14 pt-2">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[#D4C1A0]">
                        <Icon size={18} strokeWidth={1.5} />
                        <span className="font-mono text-xs uppercase">{card.meta}</span>
                      </div>
                      <h3 className="text-2xl font-bold uppercase">{card.title}</h3>
                    </div>
                    <ArrowUpRight className="h-6 w-6 transition-colors group-hover:text-[#D4C1A0]" />
                  </div>
                </div>
              );
            })}

            <Link
              href="/dashboard"
              className="group flex aspect-square cursor-pointer flex-col justify-between border border-[#E8EDE7]/14 bg-[#153023] p-8 transition-colors duration-500 hover:bg-[#8C6246] hover:text-[#0A2318] md:mt-16"
            >
              <div>
                <h3 className="mb-4 text-4xl font-black uppercase leading-none">
                  Open the Product
                </h3>
                <p className="font-mono text-sm opacity-70">
                  Explore the live dashboard, AI coach, food tracker, circles,
                  movement routines, and provider marketplace.
                </p>
              </div>
              <div className="flex justify-end">
                <ArrowRight className="h-12 w-12" />
              </div>
            </Link>
          </div>
        </section>

        <SpiralDivider />

        <section
          id="services"
          className="relative mb-0 flex min-h-[80vh] flex-col justify-center rounded-[2rem] bg-[#8C6246] p-4 text-[#0A2318] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] sm:p-8 md:p-12"
          style={coverTexture}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="border-l-4 border-[#0A2318] pl-8">
              <h2 className="mb-8 text-6xl font-black uppercase leading-[0.8] tracking-normal md:text-8xl">
                The
                <br />
                Method
              </h2>
              <p className="max-w-sm text-lg font-bold md:text-xl">
                We do not guess. We listen, score, guide, and close the loop.
              </p>
            </div>

            <div className="space-y-6 md:space-y-8">
              {method.map((item) => (
                <div
                  key={item.title}
                  className="bg-[#0A2318] p-6 text-[#D4C1A0] transition-transform duration-300 hover:translate-x-4"
                >
                  <h3 className="mb-2 font-mono text-xl font-bold">{item.title}</h3>
                  <p className="font-sans text-[#E8EDE7]/90">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SpiralDivider />

        <section
          id="contact"
          className="relative flex min-h-[60vh] flex-col justify-between rounded-[2rem] bg-[#E5EAE3] p-8 text-[#0A2318] shadow-[5px_5px_15px_rgba(0,0,0,0.45)] md:p-16"
          style={paperTexture}
        >
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-between">
              <div>
                <div className="relative mb-6 h-64 w-48 rotate-[-2deg] overflow-hidden border-2 border-[#0A2318]">
                  <Image
                    src="/tenaloop-photo-contact.jpg"
                    alt="Real outdoor wellness journey"
                    fill
                    sizes="192px"
                    className="object-cover saturate-[0.92]"
                    style={{ objectPosition: "50% 50%" }}
                  />
                </div>
                <h2 className="mb-4 text-4xl font-black uppercase">
                  Start a healthier
                  <br />
                  daily loop today.
                </h2>
                <p className="mb-8 max-w-md font-mono text-sm">
                  Walk through the demo, create a passport, and see how TenaLoop can
                  serve individuals, providers, campuses, clinics, and teams.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="bg-[#0A2318] px-8 py-3 font-bold uppercase text-[#E8EDE7] transition-colors hover:bg-[#1A3A2A]"
                >
                  Start demo
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-[#0A2318] px-8 py-3 font-bold uppercase transition-colors hover:bg-[#0A2318] hover:text-[#E8EDE7]"
                >
                  Log in
                </Link>
              </div>
            </div>

            <div className="flex h-full flex-col items-start justify-between md:items-end">
              <div className="mb-8 w-full max-w-md border-l-4 border-[#0A2318] py-1 pl-6 text-left md:mb-0 md:border-l-0 md:border-r-4 md:pl-0 md:pr-6 md:text-right">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest opacity-70">
                  Have a quick question?
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="NAME"
                      className="w-full border-b border-[#0A2318]/30 bg-transparent py-2 font-mono text-xs transition-colors placeholder:text-[#0A2318]/40 focus:border-[#0A2318] focus:outline-none md:text-right"
                    />
                    <input
                      type="email"
                      placeholder="EMAIL"
                      className="w-full border-b border-[#0A2318]/30 bg-transparent py-2 font-mono text-xs transition-colors placeholder:text-[#0A2318]/40 focus:border-[#0A2318] focus:outline-none md:text-right"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="HOW CAN I HELP?"
                      className="w-full border-b border-[#0A2318]/30 bg-transparent py-2 pr-8 font-mono text-xs transition-colors placeholder:text-[#0A2318]/40 focus:border-[#0A2318] focus:outline-none md:pl-8 md:pr-0 md:text-right"
                    />
                    <button
                      type="button"
                      className="absolute bottom-2 right-0 transition-colors hover:text-[#8C6246] md:left-0 md:right-auto"
                      aria-label="Send query"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end">
                <div className="space-y-2 text-left md:text-right">
                  <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 font-bold uppercase hover:text-[#8C6246] md:justify-end"
                  >
                    <span>Dashboard</span>
                    <Activity size={20} />
                  </Link>
                  <Link
                    href="/market"
                    className="group flex items-center gap-2 font-bold uppercase hover:text-[#8C6246] md:justify-end"
                  >
                    <span>Marketplace</span>
                    <Store size={20} />
                  </Link>
                  <a
                    href="mailto:hello@tenaloop.app"
                    className="group flex items-center gap-2 font-bold uppercase hover:text-[#8C6246] md:justify-end"
                  >
                    <span>hello@tenaloop.app</span>
                    <Mail size={20} />
                  </a>
                </div>

                <div className="mt-12 text-left md:text-right">
                  <p className="text-[10px] font-mono uppercase opacity-50">
                    Copyright 2026 TenaLoop 360.
                    <br />
                    AI wellness passport.
                    <br />
                    Built for local care and daily rhythm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <a
        href="#contents"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4C1A0]/40 bg-[#0A2318] text-[#E8EDE7] shadow-2xl transition-colors hover:bg-[#8C6246] md:hidden"
        aria-label="Go to contents"
      >
        <ArrowUp size={22} />
      </a>
    </main>
  );
}
