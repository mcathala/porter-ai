"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import PorterLogo from "@/components/PorterLogo";
import {
  FadeUp,
  GlassCard,
  MagneticButton,
  TiltCard,
  AnimatedCounter,
  StaggerText,
  TypingText,
} from "@/components/animations";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const steps = [
  { num: "01", title: "Pick your setup", desc: "Choose a company, mission, and industry to compete in." },
  { num: "02", title: "Play turn by turn", desc: "Make decisions on pricing, hiring, marketing & more." },
  { num: "03", title: "AI runs the world", desc: "Get outcomes, competitor reactions, and updated KPIs." },
  { num: "04", title: "Adapt & scale", desc: "Your story continues as long as you stay solvent." },
];

const stakeholders = [
  { name: "Michael", role: "Chief of Staff", msg: "Apex Systems just slashed prices by 20%. We need a response by end of quarter.", accent: "border-l-primary", dot: "bg-primary" },
  { name: "Investors", role: "Series A Lead", msg: "We need 20% growth this quarter or we\u2019re reconsidering the next round.", accent: "border-l-amber-400", dot: "bg-amber-400" },
  { name: "Employees", role: "Team Lead", msg: "Morale is dropping. The team needs clarity on direction \u2014 or we\u2019ll lose people.", accent: "border-l-emerald-400", dot: "bg-emerald-400" },
  { name: "Partners", role: "Market dynamics", msg: "Apex Systems proposed a distribution deal. But they poached two of our clients.", accent: "border-l-rose-400", dot: "bg-rose-400" },
];

const kpis = [
  { label: "Revenue", value: "$1.2M", change: "+18%", up: true },
  { label: "Market Share", value: "24.3%", change: "+3.1%", up: true },
  { label: "Cash", value: "$340K", change: "-8%", up: false },
  { label: "Employees", value: "47", change: "+5", up: true },
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const chartRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: chartRef,
    offset: ["start end", "end center"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const areaOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const dotScale = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const percentOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const dotGlowOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 0.15]);

  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0a0f14] overflow-x-hidden text-white">

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="animate-glow-pulse absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-[180px]"
          style={{ y: glowY }}
        />
        <div
          className="animate-glow-pulse absolute top-[60%] -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[150px]"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      {/* ── Navbar ── */}
      <header className="glass-nav sticky top-0 z-50 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-4">
        <div className="flex items-center gap-3">
          <div className="size-7 flex items-center justify-center rounded-lg bg-primary">
            <PorterLogo size={16} variant="white" />
          </div>
          <span className="text-white text-[17px] font-bold tracking-[-0.03em] font-heading">
            porter.ai
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How it Works"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s/g, "-")}`}
              className="text-[#92abbe] text-sm font-medium hover:text-white transition-colors duration-300"
            >
              {label}
            </a>
          ))}
          <Link
            href="/onboarding"
            className="inline-flex items-center h-9 px-5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-all duration-300"
          >
            Start a Run
          </Link>
        </nav>
      </header>

      {/* ── Hero + Dashboard ── */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 xl:px-20 pt-16 sm:pt-20 lg:pt-28 pb-8">
        {/* Text — left aligned, staggered word reveal */}
        <div className="max-w-[1400px] mx-auto mb-10 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[#92abbe] text-[13px] font-medium">
                AI-Powered Business Simulation
              </span>
            </div>
          </motion.div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] font-bold leading-[1.06] tracking-[-0.04em] mb-5 max-w-3xl">
            <StaggerText text="Run your company." delay={0.15} />
            <br />
            <StaggerText text="Inside a living story." delay={0.5} gradient />
          </h1>

          <motion.p
            className="text-[#8aabc5] text-lg sm:text-xl leading-relaxed mb-8 max-w-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Type your next move. Every turn writes a new chapter
            of your startup story.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <MagneticButton href="/onboarding">
              <div className="btn-glow group inline-flex items-center justify-center h-13 px-9 rounded-xl bg-primary text-white font-semibold text-base shadow-[0_8px_32px_rgba(19,127,236,0.3)] hover:shadow-[0_12px_40px_rgba(19,127,236,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2">
                Start a Run
                <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Dashboard — 3D tilt + glow */}
        <div className="relative max-w-[1400px] mx-auto">
          {/* Liquid glass glow */}
          <div className="absolute -inset-20 z-0 pointer-events-none overflow-visible">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(19,127,236,0.12) 0%, rgba(19,127,236,0.04) 40%, transparent 70%)", filter: "blur(60px)" }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-[15%] left-[10%] w-[45%] h-[50%] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(99,140,236,0.1) 0%, transparent 70%)", filter: "blur(80px)" }}
              animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-[10%] right-[8%] w-[40%] h-[45%] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(19,180,236,0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
              animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[50%] h-[30%] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(19,127,236,0.18) 0%, rgba(19,127,236,0.05) 40%, transparent 70%)", filter: "blur(40px)" }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.02, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <TiltCard
              className="relative z-10 w-full max-w-[1400px] rounded-2xl border border-white/[0.08] bg-[#0c1218]/80 backdrop-blur-2xl overflow-visible shadow-[0_32px_100px_-16px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)_inset]"
            >
              {/* Edge highlights */}
              <div className="absolute -top-px left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute top-[10%] bottom-[10%] -left-px w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

              <div ref={chartRef} className="p-6 sm:p-8 relative z-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center">
                      <PorterLogo size={18} variant="blue" />
                    </div>
                    <div>
                      <span className="text-white text-sm font-semibold block leading-tight">NovaTech Inc.</span>
                      <span className="text-[#4a6580] text-[11px]">SaaS &middot; Series A</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/[0.08] border border-primary/[0.12]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-primary text-[11px] font-semibold">Q3 2026</span>
                  </div>
                </div>

                {/* KPI Row — animated counters */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {kpis.map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      className="group rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                      initial={{ opacity: 0, y: 16, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.8 + i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[#5a7a94] text-[11px] font-medium uppercase tracking-wider">{kpi.label}</p>
                        <span className="material-symbols-outlined text-[#3a5a74] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          {kpi.up ? "trending_up" : "trending_down"}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <AnimatedCounter
                          value={kpi.value}
                          className="text-white text-[22px] font-bold tracking-[-0.03em] font-heading"
                        />
                        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${kpi.up ? "text-emerald-400 bg-emerald-400/[0.08]" : "text-orange-400 bg-orange-400/[0.08]"}`}>
                          {kpi.change}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart */}
                <div className="rounded-xl bg-white/[0.015] border border-white/[0.04] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-0.5 rounded-full bg-primary" />
                        <span className="text-[#5a7a94] text-[11px] font-medium">NovaTech (You)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-0.5 rounded-full bg-rose-400/50" />
                        <span className="text-[#5a7a94] text-[11px] font-medium">Apex Systems</span>
                      </div>
                    </div>
                    <motion.span className="text-primary text-sm font-bold font-heading" style={{ opacity: percentOpacity }}>
                      24.3% &uarr;
                    </motion.span>
                  </div>
                  <svg viewBox="0 0 400 100" className="w-full h-24 sm:h-32" preserveAspectRatio="none">
                    {[25, 50, 75].map((y) => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray="4 6" />
                    ))}
                    <motion.path
                      d="M 0 40 C 40 42 80 38 140 45 C 200 52 240 48 300 55 C 340 60 370 58 400 62"
                      fill="none" stroke="rgba(244,114,128,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4"
                      style={{ pathLength, opacity: areaOpacity }}
                    />
                    <motion.path
                      d="M 0 85 C 30 82 60 78 100 65 C 140 52 170 58 200 48 C 240 36 280 40 320 25 C 360 12 380 8 400 5 L 400 100 L 0 100 Z"
                      fill="url(#areaGrad)" style={{ opacity: areaOpacity }}
                    />
                    <motion.path
                      d="M 0 85 C 30 82 60 78 100 65 C 140 52 170 58 200 48 C 240 36 280 40 320 25 C 360 12 380 8 400 5"
                      fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round"
                      style={{ pathLength }}
                    />
                    <motion.circle cx="400" cy="5" r="4" fill="#137fec" style={{ scale: dotScale, opacity: dotScale }} />
                    <motion.circle cx="400" cy="5" r="10" fill="#137fec" style={{ scale: dotScale, opacity: dotGlowOpacity }} />
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#137fec" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#137fec" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#137fec" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-between mt-3 text-[#3a5a74] text-[10px] uppercase tracking-wider">
                    <span>Jan 2025</span><span>Jun 2025</span><span>Jan 2026</span><span>Jul 2026</span>
                  </div>
                </div>

                {/* Action input */}
                <motion.div
                  className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] px-5 py-3.5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.2 }}
                >
                  <span className="material-symbols-outlined text-primary/40 text-lg">terminal</span>
                  <TypingText text="Lower prices by 15% and launch a loyalty program..." className="text-[#5a7a94] text-sm" />
                </motion.div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider mt-16" />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 px-4 sm:px-6 py-28 sm:py-36">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-20 text-center">
              How It Works
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <GlassCard className="p-7 h-full group">
                  <span className="font-heading text-5xl font-bold gradient-text-subtle opacity-30 leading-none mb-5 block select-none group-hover:opacity-50 transition-opacity duration-500">
                    {step.num}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-white mb-2 tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[#8aabc5] text-sm leading-relaxed">{step.desc}</p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Stakeholders ── */}
      <section id="features" className="relative z-10 px-4 sm:px-6 py-28 sm:py-36">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4 text-center">
              The World Pushes Back
            </h2>
            <p className="text-[#8aabc5] text-lg sm:text-xl text-center mb-16 max-w-xl mx-auto">
              Stakeholders enter the story. You&apos;re not playing alone.
            </p>
          </FadeUp>

          <div className="space-y-3">
            {stakeholders.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div
                  className={`relative flex items-start gap-4 p-5 sm:p-6 rounded-xl border-l-[3px] ${s.accent} bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm hover:bg-white/[0.03] transition-colors duration-300`}
                  whileHover={{ x: 6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                >
                  <div className="mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${s.dot} opacity-60`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-white">{s.name}</h3>
                      <span className="text-[#4a6a86] text-xs">{s.role}</span>
                    </div>
                    <p className="text-[#8aabc5] text-sm leading-relaxed">&ldquo;{s.msg}&rdquo;</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <FadeUp delay={0.5}>
            <p className="text-[#5a7a94] text-sm text-center leading-relaxed max-w-lg mx-auto mt-12">
              Any turn can introduce a twist. Competitor attacks, customer
              crises, regulation changes, viral moments, or once-in-a-lifetime
              partnerships.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Final CTA ── */}
      <section className="relative z-10 px-4 sm:px-6 py-32 sm:py-44">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.03em] mb-10">
              Ready to enter
              <br />
              <span className="gradient-text">the market?</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <MagneticButton href="/onboarding">
              <div className="btn-glow group inline-flex items-center justify-center h-16 px-12 rounded-2xl bg-primary text-white font-semibold text-lg shadow-[0_12px_40px_rgba(19,127,236,0.35)] hover:shadow-[0_16px_50px_rgba(19,127,236,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2">
                Start a Run
                <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </MagneticButton>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="text-[#4a6a86] text-sm mt-6">
              No sign-up required. Just curiosity and good instincts.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.04] px-4 sm:px-10 py-8">
        <p className="text-center text-[#3a5a74] text-sm">
          porter.ai &mdash; An AI-powered business strategy game.
        </p>
      </footer>
    </div>
  );
}
