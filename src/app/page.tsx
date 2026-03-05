"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import PorterLogo from "@/components/PorterLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GradientDivider() {
  return (
    <div className="relative z-10">
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="h-16 bg-gradient-to-b from-primary/[0.06] to-transparent" />
    </div>
  );
}

const steps = [
  {
    num: "01",
    title: "Pick your setup",
    desc: "Choose a company name, its mission and the industry in which you want to compete.",
  },
  {
    num: "02",
    title: "Play turn by turn",
    desc: "Type actions like pricing, marketing, hiring, product decisions, partnerships, or fundraising.",
  },
  {
    num: "03",
    title: "The AI runs the world",
    desc: "Get story outcomes, stakeholder messages, competitor reactions, and updated KPIs.",
  },
  {
    num: "04",
    title: "Adapt and scale",
    desc: "Your story continues as long as you stay solvent.",
  },
];

const goals = [
  {
    word: "Survive.",
    desc: "Stay alive through downturns, surprises, and competitor attacks.",
  },
  {
    word: "Grow.",
    desc: "Turn smart decisions (and story events) into market share.",
  },
  {
    word: "Outlast rivals.",
    desc: "Competitors learn, counter, and evolve turn after turn.",
  },
];

const stakeholders = [
  {
    icon: "support_agent",
    name: "Michael",
    subtitle: "Chief of Staff",
    message:
      "Revenue is up 12%, but NovaTech just slashed prices. We need a response by end of quarter.",
    borderColor: "border-l-primary",
    bgColor: "bg-primary/15",
    textColor: "text-primary",
  },
  {
    icon: "account_balance",
    name: "Investors",
    subtitle: "Series A Lead",
    message:
      "We need 20% growth this quarter or we're reconsidering the next round.",
    borderColor: "border-l-amber-400",
    bgColor: "bg-amber-400/15",
    textColor: "text-amber-400",
  },
  {
    icon: "groups",
    name: "Employees",
    subtitle: "Team Lead",
    message:
      "Morale is dropping. The team needs clarity on direction — or we'll start losing people.",
    borderColor: "border-l-emerald-400",
    bgColor: "bg-emerald-400/15",
    textColor: "text-emerald-400",
  },
  {
    icon: "handshake",
    name: "Partners & Rivals",
    subtitle: "Market dynamics",
    message:
      "NovaTech proposed a distribution deal. But last quarter they poached two of our clients.",
    borderColor: "border-l-rose-400",
    bgColor: "bg-rose-400/15",
    textColor: "text-rose-400",
  },
];

const audiences = [
  {
    icon: "school",
    title: "Business students",
    desc: "Make strategy and cases feel real.",
  },
  {
    icon: "rocket_launch",
    title: "Entrepreneurs",
    desc: "Test decisions before they get expensive.",
  },
  {
    icon: "menu_book",
    title: "Educators",
    desc: "Teach business by doing in an immersive environment.",
  },
  {
    icon: "sports_esports",
    title: "Gamers",
    desc: "Play a strategy game with challenging stories.",
  },
];

export default function LandingPage() {
  const chartRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: chartRef,
    offset: ["start end", "end center"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const areaOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const dotScale = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const dotGlowOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 0.2]);
  const percentOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] overflow-x-hidden text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="animate-glow-pulse absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[140px]" />
        <div
          className="animate-glow-pulse absolute top-2/3 -right-48 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233648] px-4 sm:px-10 py-3 bg-[#111a22]/80 backdrop-blur-md">
        <div className="flex items-center gap-4 text-white">
          <div className="size-8 flex items-center justify-center rounded-xl bg-primary text-white">
            <PorterLogo size={20} variant="white" />
          </div>
          <h2 className="text-white text-lg font-bold font-heading leading-tight tracking-[-0.02em]">
            playporter.ai
          </h2>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 lg:pt-36 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div>
            <FadeUp>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#233648] text-[#92adc9] text-sm font-medium mb-8">
                <span className="material-symbols-outlined text-primary text-base">
                  auto_awesome
                </span>
                AI-Powered Business Game
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-[-0.035em] mb-6">
                Run your company
                <br />
                <span className="text-[#7a9bb8]">inside a living story.</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-[#92adc9] text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                Type your next move. Watch AI rivals counter. Every turn writes
                a new chapter.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <p className="font-heading text-xl sm:text-2xl font-semibold text-primary mb-10">
                Grow. Survive. Avoid bankruptcy.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex items-start mb-3">
                <Link
                  href="/onboarding"
                  className="group inline-flex items-center justify-center h-14 px-10 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 gap-2"
                >
                  Start a Company
                  <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <p className="text-[#4a6a86] text-sm">
                Low on cash? Tap a credit line... but debt changes the game.
              </p>
            </FadeUp>
          </div>

          {/* Right — Visual area */}
          <div className="relative lg:mt-0 mt-4">
            {/* Main chart card */}
            <FadeUp delay={0.5}>
              <div
                ref={chartRef}
                className="relative rounded-2xl border border-[#233648]/60 bg-[#141f2b]/60 backdrop-blur-sm overflow-hidden p-5 sm:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">
                      show_chart
                    </span>
                    <span className="text-[#6b8baa] text-xs font-medium uppercase tracking-wider">
                      Market Share
                    </span>
                  </div>
                  <motion.span
                    className="text-primary text-sm font-bold font-heading"
                    style={{ opacity: percentOpacity }}
                  >
                    24.3% ↑
                  </motion.span>
                </div>
                <svg
                  viewBox="0 0 400 100"
                  className="w-full h-24 sm:h-32"
                  preserveAspectRatio="none"
                >
                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1="25"
                    x2="400"
                    y2="25"
                    stroke="#233648"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="0"
                    y1="50"
                    x2="400"
                    y2="50"
                    stroke="#233648"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1="0"
                    y1="75"
                    x2="400"
                    y2="75"
                    stroke="#233648"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                  />
                  {/* Area fill */}
                  <motion.path
                    d="M 0 85 C 30 82 60 78 100 65 C 140 52 170 58 200 48 C 240 36 280 40 320 25 C 360 12 380 8 400 5 L 400 100 L 0 100 Z"
                    fill="url(#areaGradient)"
                    style={{ opacity: areaOpacity }}
                  />
                  {/* Main line */}
                  <motion.path
                    d="M 0 85 C 30 82 60 78 100 65 C 140 52 170 58 200 48 C 240 36 280 40 320 25 C 360 12 380 8 400 5"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ pathLength }}
                  />
                  {/* Dot at end */}
                  <motion.circle
                    cx="400"
                    cy="5"
                    r="4"
                    fill="#137fec"
                    style={{ scale: dotScale, opacity: dotScale }}
                  />
                  <motion.circle
                    cx="400"
                    cy="5"
                    r="8"
                    fill="#137fec"
                    style={{
                      scale: dotScale,
                      opacity: dotGlowOpacity,
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="areaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#137fec"
                        stopOpacity="0.15"
                      />
                      <stop
                        offset="100%"
                        stopColor="#137fec"
                        stopOpacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="lineGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#137fec"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="#137fec"
                        stopOpacity="1"
                      />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Turn labels */}
                <div className="flex justify-between mt-2 text-[#4a6a86] text-[10px] uppercase tracking-wider">
                  <span>Turn 1</span>
                  <span>Turn 5</span>
                  <span>Turn 10</span>
                  <span>Turn 15</span>
                </div>
              </div>
            </FadeUp>

            {/* Floating chat bubble from Michael */}
            <motion.div
              className="absolute -right-2 sm:right-4 -top-4 sm:-top-6 max-w-[240px] sm:max-w-[260px] p-4 rounded-xl border border-[#233648]/60 bg-[#1a2634]/90 backdrop-blur-md shadow-xl shadow-black/30"
              initial={{ opacity: 0, x: 20, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white text-xs font-semibold">
                  Michael
                </span>
                <span className="text-[#4a6a86] text-[10px]">
                  Chief of Staff
                </span>
              </div>
              <p className="text-[#92adc9] text-xs leading-relaxed">
                NovaTech just cut prices by 20%. Our margins are safe for now,
                but we&apos;re losing shelf space.
              </p>
            </motion.div>

            {/* Floating KPI badges */}
            <motion.div
              className="absolute -left-2 sm:-left-6 bottom-6 sm:bottom-2 px-4 py-3 rounded-xl border border-emerald-500/20 bg-[#1a2634]/90 backdrop-blur-md shadow-xl shadow-black/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-[#6b8baa] text-[10px] uppercase tracking-wider">
                    Revenue
                  </p>
                  <p className="text-emerald-400 text-sm font-bold font-heading">
                    $1.2M{" "}
                    <span className="text-emerald-400/60 text-xs">+18%</span>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute right-4 sm:right-8 -bottom-2 sm:-bottom-6 px-4 py-3 rounded-xl border border-amber-500/20 bg-[#1a2634]/90 backdrop-blur-md shadow-xl shadow-black/30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 2.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-400 text-lg">
                    account_balance_wallet
                  </span>
                </div>
                <div>
                  <p className="text-[#6b8baa] text-[10px] uppercase tracking-wider">
                    Cash
                  </p>
                  <p className="text-amber-400 text-sm font-bold font-heading">
                    $340K{" "}
                    <span className="text-amber-400/60 text-xs">-8%</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-12 sm:h-20" />

      <GradientDivider />

      {/* How It Works */}
      <section className="relative z-10 px-4 sm:px-6 py-24 sm:py-36">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] mb-20 text-center">
              How It Works
            </h2>
          </FadeUp>

          <div className="space-y-14 sm:space-y-20">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <div className="flex items-start gap-6 sm:gap-10">
                  <span className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-primary/20 leading-none shrink-0 select-none">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#92adc9] text-base sm:text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <GradientDivider />

      {/* Your Goal */}
      <section className="relative z-10 px-4 sm:px-6 py-24 sm:py-36">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] mb-16">
              Your Goal
            </h2>
          </FadeUp>

          <div className="space-y-10 sm:space-y-12 mb-12">
            {goals.map((item, i) => (
              <FadeUp key={item.word} delay={i * 0.12}>
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {item.word}
                  </h3>
                  <p className="text-[#92adc9] text-base sm:text-lg">
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4}>
            <p className="text-[#6b8baa] text-sm tracking-wide uppercase font-medium">
              If you go bankrupt, you lose.
            </p>
          </FadeUp>
        </div>
      </section>

      <GradientDivider />

      {/* Stakeholders — message feed style */}
      <section className="relative z-10 px-4 sm:px-6 py-24 sm:py-36">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] mb-4 text-center">
              Stakeholders Enter the Story
            </h2>
            <p className="text-[#92adc9] text-lg sm:text-xl text-center mb-16 max-w-xl mx-auto">
              You&apos;re not playing alone. The world pushes back.
            </p>
          </FadeUp>

          <div className="space-y-4">
            {stakeholders.map((s, i) => (
              <FadeUp key={s.name} delay={i * 0.12}>
                <div
                  className={`flex items-start gap-4 p-5 sm:p-6 rounded-xl border-l-2 ${s.borderColor} bg-[#141f2b]/60`}
                >
                  <div
                    className={`w-10 h-10 rounded-full ${s.bgColor} flex items-center justify-center shrink-0`}
                  >
                    <span
                      className={`material-symbols-outlined ${s.textColor} text-xl`}
                    >
                      {s.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-heading text-sm sm:text-base font-semibold text-white">
                        {s.name}
                      </h3>
                      <span className="text-[#4a6a86] text-xs">
                        {s.subtitle}
                      </span>
                    </div>
                    <p className="text-[#92adc9] text-sm sm:text-base leading-relaxed italic">
                      &ldquo;{s.message}&rdquo;
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.6}>
            <p className="text-[#6b8baa] text-sm sm:text-base text-center leading-relaxed max-w-lg mx-auto mt-12">
              Any turn can introduce a twist. Competitor attacks, customer
              crises, regulation changes, viral moments, or once-in-a-lifetime
              partnerships.
            </p>
          </FadeUp>
        </div>
      </section>

      <GradientDivider />

      {/* Designed For — icon-centered minimal grid */}
      <section className="relative z-10 px-4 sm:px-6 py-24 sm:py-36">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] mb-16 text-center">
              Designed For
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
            {audiences.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.08}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[#92adc9] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4}>
            <p className="text-[#6b8baa] text-sm sm:text-base text-center font-medium">
              No degree needed, just curiosity and good instincts.
            </p>
          </FadeUp>
        </div>
      </section>

      <GradientDivider />

      {/* Final CTA */}
      <section className="relative z-10 px-4 sm:px-6 py-28 sm:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.025em] mb-8">
              Ready to enter the market?
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link
              href="/onboarding"
              className="group inline-flex items-center justify-center h-14 sm:h-16 px-10 sm:px-14 rounded-xl bg-primary text-white font-bold text-lg sm:text-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 gap-2"
            >
              Start a Run
              <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#233648] px-4 sm:px-10 py-6">
        <p className="text-center text-[#4a6a86] text-sm">
          An AI-powered business strategy game.
        </p>
      </footer>
    </div>
  );
}
