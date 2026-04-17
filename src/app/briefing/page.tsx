"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import FadeIn from "@/components/FadeIn";
import { FadeUp, MagneticButton, AnimatedCounter } from "@/components/animations";
import { motion } from "framer-motion";
import GradientDivider from "@/components/GradientDivider";
import PorterLogo from "@/components/PorterLogo";

const MARKET_LABELS: Record<string, string> = {
  custom: "Custom Market",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  new: "Newcomer",
  medium: "Established",
  old: "Veteran",
};

const COMPETITOR_ARCHETYPE_ICONS: Record<string, string> = {
  dominant: "shield",
  follower: "group",
  disruptor: "bolt",
  opportunist: "target",
};

const MOMENTUM_STYLES: Record<string, { color: string; icon: string }> = {
  positive: { color: "text-green-400", icon: "trending_up" },
  neutral: { color: "text-gray-400", icon: "trending_flat" },
  negative: { color: "text-red-400", icon: "trending_down" },
};

export default function BriefingPage() {
  const router = useRouter();
  const { gameState } = useGame();

  const {
    playerCompany,
    market,
    customMarket,
    difficulty,
    kpis,
    competitors,
    restOfMarket,
    companyProfile,
    marketProfile,
  } = gameState;

  const sizeLabel = playerCompany.size.charAt(0).toUpperCase() + playerCompany.size.slice(1);
  const experienceLabel = EXPERIENCE_LABELS[playerCompany.experience] || playerCompany.experience;
  const marketLabel =
    market === "custom" && customMarket
      ? customMarket
      : MARKET_LABELS[market] || market;

  const formatCurrency = (value: number): string => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col text-white overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/[0.04] px-4 sm:px-10 py-3">
        <div className="flex items-center gap-2 text-white/40">
          <span className="material-symbols-outlined text-[18px]">description</span>
          <span className="text-[13px] font-medium">Mission Briefing</span>
        </div>
        <span className="text-white/20 text-[12px] font-medium">porter.ai</span>
      </header>

      <main className="flex flex-1 justify-center py-10 px-6 sm:px-10">
        <div className="flex flex-col w-full max-w-[960px] gap-10">
          {/* Hero: Company Identity */}
          <FadeIn>
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-4xl">business</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold font-heading leading-tight tracking-[-0.02em]">
                  {playerCompany.name}
                </h1>
                <p className="text-[#92adc9] text-base mt-1">
                  {sizeLabel} company, {experienceLabel}
                </p>
              </div>
            </div>
            <p className="text-[#c0d0e0] text-lg leading-relaxed italic border-l-2 border-primary/40 pl-4">
              &ldquo;{playerCompany.mission}&rdquo;
            </p>
            {companyProfile && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">What we do</p>
                  <p className="text-[#c0d0e0] text-base leading-relaxed">{companyProfile.productDescription}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Our story</p>
                  <p className="text-[#c0d0e0] text-base leading-relaxed">{companyProfile.foundingStory}</p>
                </div>
              </div>
            )}
          </section>
          </FadeIn>

          {/* Industry & Difficulty */}
          <FadeIn delay={0.1}>
          <GradientDivider />
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5">
              <span className="material-symbols-outlined text-primary text-3xl">domain</span>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Industry</p>
                <p className="text-lg font-bold text-white">{marketLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5">
              <span className="material-symbols-outlined text-primary text-3xl">speed</span>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</p>
                <p className="text-lg font-bold text-white capitalize">{difficulty}</p>
              </div>
            </div>
          </section>
          </FadeIn>

          {/* Starting KPIs */}
          <FadeIn delay={0.2}>
          <GradientDivider />
          <section>
            <h2 className="text-xl font-bold font-heading tracking-[-0.02em] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Starting Position
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">payments</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cash Balance</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{formatCurrency(kpis.cash)}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-lg">pie_chart</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Market Share</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{kpis.marketShare.toFixed(1)}%</p>
              </div>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-lg">sentiment_satisfied</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Team Morale</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{kpis.satisfaction.toFixed(0)}%</p>
              </div>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-lg">campaign</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Brand Awareness</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{kpis.brandAwareness.toFixed(0)}%</p>
              </div>
            </div>
          </section>
          </FadeIn>

          {/* Market Profile */}
          {marketProfile && (
            <FadeIn delay={0.3}>
            <GradientDivider />
            <section>
              <h2 className="text-xl font-bold font-heading tracking-[-0.02em] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">storefront</span>
                Business Landscape
              </h2>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Market structure</p>
                  <p className="text-[#c0d0e0] text-base leading-relaxed">{marketProfile.overview}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dynamics</p>
                  <p className="text-[#c0d0e0] text-base leading-relaxed">{marketProfile.dynamics}</p>
                </div>
                <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer behavior</p>
                  <p className="text-[#c0d0e0] text-base leading-relaxed">{marketProfile.customerBehavior}</p>
                </div>
              </div>
            </section>
            </FadeIn>
          )}

          {/* Competitors */}
          {competitors.length > 0 && (
            <FadeIn delay={0.35}>
            <GradientDivider />
            <section>
              <h2 className="text-xl font-bold font-heading tracking-[-0.02em] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">groups</span>
                Competitive Landscape
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competitors.map((c, i) => {
                  const momentum = MOMENTUM_STYLES[c.momentum] || MOMENTUM_STYLES.neutral;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 backdrop-blur-sm p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/[0.06]">
                            <span className="material-symbols-outlined text-[#92adc9] text-xl">
                              {COMPETITOR_ARCHETYPE_ICONS[c.archetype] || "business"}
                            </span>
                          </div>
                          <div>
                            <p className="text-base font-bold font-heading text-white">{c.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{c.archetype}</p>
                          </div>
                        </div>
                        <span className={`material-symbols-outlined text-xl ${momentum.color}`}>
                          {momentum.icon}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/70"
                            style={{ width: `${Math.min(c.marketShare, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-400 w-12 text-right">
                          {c.marketShare.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rest of Market */}
              {restOfMarket.marketShare > 0 && (
                <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/[0.1] transition-all duration-300 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-lg">more_horiz</span>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Rest of Market</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {restOfMarket.fragmentation} fragmentation &middot; {restOfMarket.dynamism}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-400">
                    {restOfMarket.marketShare.toFixed(1)}%
                  </span>
                </div>
              )}
            </section>
            </FadeIn>
          )}

          {/* CTA */}
          <section className="flex flex-col items-center gap-4 pt-4 pb-8">
            <MagneticButton>
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-glow flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">play_arrow</span>
                Begin Simulation
              </button>
            </MagneticButton>
            <p className="text-[#6b8399] text-sm">
              Your first move awaits. Good luck, CEO.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
