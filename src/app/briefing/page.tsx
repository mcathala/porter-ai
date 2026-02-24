"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { COMPANY_CONFIGS } from "@/lib/types/game";

const MARKET_LABELS: Record<string, string> = {
  saas: "Software as a Service (SaaS)",
  automotive: "Automotive Industry",
  random: "Randomized Market",
  custom: "Custom Market",
};

const ARCHETYPE_ICONS: Record<string, string> = {
  innovator: "rocket_launch",
  incumbent: "corporate_fare",
  costleader: "warehouse",
  premium: "diamond",
  platform: "hub",
};

const ARCHETYPE_COLORS: Record<string, string> = {
  innovator: "cyan",
  incumbent: "blue",
  costleader: "emerald",
  premium: "purple",
  platform: "indigo",
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
    lastTurnSummary,
  } = gameState;

  const config = COMPANY_CONFIGS[playerCompany.archetype];
  const accentColor = ARCHETYPE_COLORS[playerCompany.archetype] || "blue";
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
    <div className="relative flex min-h-screen w-full flex-col bg-[#101922] text-white overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#233648] px-10 py-3 bg-[#111a22]">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            MVP Simulator
          </h2>
        </div>
        <span className="text-[#92adc9] text-sm font-medium">Mission Briefing</span>
      </header>

      <main className="flex flex-1 justify-center py-10 px-6 sm:px-10">
        <div className="flex flex-col w-full max-w-[960px] gap-10">
          {/* Hero: Company Identity */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-${accentColor}-500/20 text-${accentColor}-400`}>
                <span className="material-symbols-outlined text-4xl">
                  {ARCHETYPE_ICONS[playerCompany.archetype]}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">
                  {playerCompany.name}
                </h1>
                <p className="text-[#92adc9] text-base mt-1">{config.name}</p>
              </div>
            </div>
            <p className="text-[#c0d0e0] text-lg leading-relaxed italic border-l-2 border-primary/40 pl-4">
              &ldquo;{playerCompany.mission}&rdquo;
            </p>
          </section>

          {/* Industry & Difficulty */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 rounded-xl bg-[#1a2634] border border-[#233648] p-5">
              <span className="material-symbols-outlined text-primary text-3xl">domain</span>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Industry</p>
                <p className="text-lg font-bold text-white">{marketLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-[#1a2634] border border-[#233648] p-5">
              <span className="material-symbols-outlined text-primary text-3xl">speed</span>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</p>
                <p className="text-lg font-bold text-white capitalize">{difficulty}</p>
              </div>
            </div>
          </section>

          {/* Starting KPIs */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Starting Position
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">payments</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cash Balance</p>
                </div>
                <p className="text-2xl font-black text-white mt-1">{formatCurrency(kpis.cash)}</p>
              </div>
              <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-lg">pie_chart</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Market Share</p>
                </div>
                <p className="text-2xl font-black text-white mt-1">{kpis.marketShare.toFixed(1)}%</p>
              </div>
              <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-lg">sentiment_satisfied</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer Satisfaction</p>
                </div>
                <p className="text-2xl font-black text-white mt-1">{kpis.satisfaction.toFixed(0)}%</p>
              </div>
            </div>
          </section>

          {/* Market Summary */}
          {lastTurnSummary && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">newspaper</span>
                Market Intelligence Report
              </h2>
              <div className="rounded-xl bg-[#1a2634] border border-[#233648] p-6">
                <p className="text-[#c0d0e0] text-base leading-relaxed whitespace-pre-line">
                  {lastTurnSummary}
                </p>
              </div>
            </section>
          )}

          {/* Competitors */}
          {competitors.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">groups</span>
                Competitive Landscape
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {competitors.map((c, i) => {
                  const momentum = MOMENTUM_STYLES[c.momentum] || MOMENTUM_STYLES.neutral;
                  return (
                    <div
                      key={i}
                      className="rounded-xl bg-[#1a2634] border border-[#233648] p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#233648]">
                            <span className="material-symbols-outlined text-[#92adc9] text-xl">
                              {COMPETITOR_ARCHETYPE_ICONS[c.archetype] || "business"}
                            </span>
                          </div>
                          <div>
                            <p className="text-base font-bold text-white">{c.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{c.archetype}</p>
                          </div>
                        </div>
                        <span className={`material-symbols-outlined text-xl ${momentum.color}`}>
                          {momentum.icon}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="flex-1 h-1.5 rounded-full bg-[#233648] overflow-hidden">
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
                <div className="mt-4 rounded-xl bg-[#161f2a] border border-[#1e2d3d] p-4 flex items-center justify-between">
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
          )}

          {/* CTA */}
          <section className="flex flex-col items-center gap-4 pt-4 pb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-2 h-14 px-10 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">play_arrow</span>
              Begin Simulation
            </button>
            <p className="text-[#6b8399] text-sm">
              Your first move awaits. Good luck, CEO.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
