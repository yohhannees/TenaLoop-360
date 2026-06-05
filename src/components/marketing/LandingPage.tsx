import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  Building2,
  CalendarCheck,
  CircleDollarSign,
  ShieldCheck,
  Smartphone,
  Utensils,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ModuleTone = "forest" | "sage" | "clay" | "sand";

const modules: Array<{
  icon: typeof Brain;
  title: string;
  label: string;
  body: string;
  tone: ModuleTone;
}> = [
  {
    icon: Brain,
    title: "Mind & Breath",
    label: "TenaBot",
    body: "Stress check-ins, burnout signals, and guided breathing resets tailored for your daily pace.",
    tone: "forest",
  },
  {
    icon: Utensils,
    title: "Local Nourishment",
    label: "TenaPlate",
    body: "Nutrition guidance honoring local staples: injera, shiro, gomen, and fasting rhythms.",
    tone: "sage",
  },
  {
    icon: Users,
    title: "Community Circles",
    label: "TenaCircle",
    body: "Moderated, safe spaces for mindful movement, habit building, and peer support.",
    tone: "clay",
  },
  {
    icon: CalendarCheck,
    title: "Wellness Market",
    label: "TenaMarket",
    body: "Seamlessly book local gyms, spas, yoga retreats, and holistic coaches.",
    tone: "sand",
  },
];

const stats = [
  { value: "360", label: "Wellness loop" },
  { value: "6", label: "Passport stamps" },
  { value: "4", label: "Revenue lanes" },
  { value: "2", label: "Language modes" },
];

const workflow = [
  {
    title: "Check in intuitively",
    body: "Log mood, stress, sleep, food, movement, water, and peer support in moments.",
  },
  {
    title: "Get your plan",
    body: "Receive a dynamic score plus one clear daily action path for mind, plate, and movement.",
  },
  {
    title: "Close the loop",
    body: "Earn passport stamps through breathing exercises, better meals, walks, and local circles.",
  },
  {
    title: "Report the impact",
    body: "View personalized trend graphs to understand your deepest rhythms.",
  },
];

const membership = [
  {
    icon: Smartphone,
    title: "Consumer",
    body: "Freemium check-ins, milestone rewards, and local marketplace discovery.",
  },
  {
    icon: CircleDollarSign,
    title: "Premium",
    body: "Personalized routines, advanced meal plans, and actionable lifestyle insights.",
  },
  {
    icon: Building2,
    title: "B2B SaaS",
    body: "Secure, anonymous wellness dashboards for universities, employers, and clinics.",
  },
];

function moduleToneClasses(tone: ModuleTone) {
  return cn(
    tone === "forest" && "bg-[#0A2318] text-[#E8EDE7]",
    tone === "sage" && "border border-[#0A2318]/10 bg-[#E8EDE7] text-[#0A2318]",
    tone === "clay" && "bg-[#8C6246] text-[#E8EDE7]",
    tone === "sand" && "bg-[#D4C1A0] text-[#0A2318]",
  );
}

function moduleIconClasses(tone: ModuleTone) {
  return cn(
    tone === "forest" && "text-[#D4C1A0]",
    tone === "sage" && "text-[#8C6246]",
    tone === "clay" && "text-[#E8EDE7]",
    tone === "sand" && "text-[#0A2318]",
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#E5EAE3] font-sans text-[#0A2318] antialiased selection:bg-[#0A2318] selection:text-[#E8EDE7]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Activity size={28} strokeWidth={1.5} className="text-[#0A2318]" />
          <span className="text-xl font-bold uppercase tracking-normal">TenaLoop</span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-[#0A2318]/70 md:flex">
          {["Philosophy", "Practice", "Membership"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="transition-colors hover:text-[#0A2318]"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-sm font-medium transition-colors hover:text-[#8C6246] sm:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="hidden h-11 items-center justify-center rounded-full bg-[#0A2318] px-7 text-sm font-medium text-[#E8EDE7] transition-all hover:bg-[#1A3A2A] sm:inline-flex"
          >
            Start your journey
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-12 lg:pt-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl leading-[1.05] tracking-normal text-[#0A2318] md:text-6xl lg:text-[5rem]">
              Transform{" "}
              <span className="font-light italic text-[#8C6246]">your</span>
              <br /> Mind and Body.
            </h1>
            <p className="mt-8 text-lg font-light leading-relaxed text-[#0A2318]/70 md:text-xl">
              Join us in transforming your holistic health through our connected
              wellness ecosystem. Stress, movement, and local nourishment, all in one
              seamless daily loop.
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#0A2318] px-8 text-base font-medium text-[#E8EDE7] transition-all hover:bg-[#1A3A2A]"
              >
                Become a Member
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-[#0A2318]/20 bg-transparent px-8 text-base font-medium text-[#0A2318] transition-all hover:border-[#0A2318] hover:bg-[#0A2318]/5"
              >
                Explore the practice
              </Link>
            </div>
          </div>

          <div className="relative h-[600px] w-full overflow-hidden rounded-[3rem] border-4 border-[#E8EDE7] shadow-2xl shadow-[#0A2318]/10">
            <Image
              src="/tenaloop-hero.png"
              alt="People using a wellness app"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2318]/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-[#0A2318] px-6 py-16">
        <div className="mx-auto max-w-7xl lg:px-12">
          <div className="grid grid-cols-2 gap-8 divide-x divide-[#E8EDE7]/10 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn("flex flex-col", index !== 0 && "pl-8")}
              >
                <span className="font-serif text-4xl text-[#D4C1A0] md:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-3 text-sm font-medium uppercase tracking-normal text-[#E8EDE7]/60">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl lg:px-12">
          <div className="mb-16 max-w-2xl">
            <h2 className="font-serif text-4xl text-[#0A2318] md:text-5xl">
              Our <span className="font-light italic">Services</span>
            </h2>
            <p className="mt-6 text-lg font-light leading-relaxed text-[#0A2318]/70">
              Whether you are a beginner or an advanced practitioner, our offerings are
              designed to inspire and support you on your wellness journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <article
                  key={module.title}
                  className={cn(
                    "flex min-h-80 flex-col justify-between rounded-[2rem] p-8 transition-transform duration-500 hover:-translate-y-2",
                    moduleToneClasses(module.tone),
                  )}
                >
                  <div>
                    <div className={cn("mb-8 inline-flex", moduleIconClasses(module.tone))}>
                      <Icon size={36} strokeWidth={1.5} />
                    </div>
                    <p className="mb-3 text-xs font-semibold uppercase opacity-70">
                      {module.label}
                    </p>
                    <h3 className="mb-3 font-serif text-2xl">{module.title}</h3>
                    <p className="text-sm font-light leading-relaxed opacity-90">
                      {module.body}
                    </p>
                  </div>

                  <div className="mt-12 flex cursor-pointer items-center gap-2 text-sm font-medium uppercase tracking-normal opacity-80 transition-opacity hover:opacity-100">
                    View more <ArrowRight size={16} strokeWidth={1.5} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="philosophy"
        className="border-t border-[#0A2318]/10 bg-[#DFE5DE] px-6 py-24 sm:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.5fr] lg:px-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-normal text-[#8C6246]">
              The Philosophy
            </span>
            <h2 className="mt-4 font-serif text-4xl leading-[1.1] text-[#0A2318] md:text-5xl">
              A loop you <br />
              <span className="font-light italic">actually</span> want to close.
            </h2>
            <Link
              href="/loop"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#0A2318] px-8 text-sm font-medium text-[#0A2318] transition-all hover:bg-[#0A2318] hover:text-[#E8EDE7]"
            >
              Run the app flow
            </Link>
          </div>

          <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2">
            {workflow.map((step, index) => (
              <div key={step.title} className="relative">
                <span className="mb-4 block font-serif text-5xl font-light text-[#0A2318]/20">
                  0{index + 1}
                </span>
                <h3 className="mb-3 text-xl font-medium text-[#0A2318]">{step.title}</h3>
                <p className="text-base font-light leading-relaxed text-[#0A2318]/70">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="membership"
        className="bg-[#0A2318] px-6 py-24 text-[#E8EDE7] sm:py-32"
      >
        <div className="mx-auto max-w-7xl lg:px-12">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <h2 className="font-serif text-4xl md:text-5xl">
              Wellness for <span className="text-[#D4C1A0] italic">everyone</span>.
            </h2>
            <p className="mt-6 text-lg font-light leading-relaxed text-[#E8EDE7]/70">
              TenaLoop scales from a free daily habit to personalized coaching and
              secure organizational spaces.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {membership.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group rounded-[2rem] border border-[#E8EDE7]/10 bg-[#153023] p-10 transition-colors hover:bg-[#1A3A2A]"
                >
                  <Icon size={32} strokeWidth={1.5} className="mb-6 text-[#D4C1A0]" />
                  <h3 className="mb-4 font-serif text-2xl">{card.title}</h3>
                  <p className="text-sm font-light leading-relaxed text-[#E8EDE7]/70">
                    {card.body}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#D4C1A0]/30 bg-[#D4C1A0]/10 px-6 py-3 text-sm text-[#D4C1A0]">
              <ShieldCheck size={18} strokeWidth={1.5} />
              Enterprise data is strictly anonymized and aggregated
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#E5EAE3] px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 font-serif text-5xl leading-tight text-[#0A2318] md:text-6xl">
            Ready to start <span className="text-[#8C6246] italic">your</span> practice?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-[#0A2318]/70">
            Experience the interactive demo. Walk through the dashboard, AI coach, food
            tracker, local circles, and the organizational command center.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#8C6246] px-10 text-base font-medium text-[#E8EDE7] transition-all hover:bg-[#724F38]"
          >
            Start Demo Experience
          </Link>
        </div>
      </section>
    </main>
  );
}
