"use client";

import { useGame, InitialBriefing } from "@/context/GameContext";

const MARKET_LABELS: Record<string, string> = {
  fashion: "Fashion Industry",
  automotive: "Automotive Industry",
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

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: InitialBriefing;
}

export default function BriefingModal({ isOpen, onClose, briefing }: BriefingModalProps) {
  const { gameState } = useGame();

  if (!isOpen) return null;

  const { playerCompany, market, customMarket, difficulty, kpis } = gameState;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f14]/90 backdrop-blur-sm">
      <div
        className="fixed inset-0 z-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="glass-modal w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/[0.06] bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-2xl">business</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  {playerCompany.name}
                </h2>
                <p className="text-gray-400 text-sm">{sizeLabel} company, {experienceLabel} &middot; Mission Briefing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Mission */}
          <p className="text-[#c0d0e0] text-base leading-relaxed italic border-l-2 border-primary/40 pl-4">
            &ldquo;{playerCompany.mission}&rdquo;
          </p>

          {/* Industry & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
              <span className="material-symbols-outlined text-primary text-2xl">domain</span>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Industry</p>
                <p className="text-base font-bold text-white">{marketLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
              <span className="material-symbols-outlined text-primary text-2xl">speed</span>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</p>
                <p className="text-base font-bold text-white capitalize">{difficulty}</p>
              </div>
            </div>
          </div>

          {/* Starting KPIs */}
          <div>
            <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Starting Position
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">payments</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cash Balance</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{formatCurrency(kpis.cash)}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-lg">pie_chart</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Market Share</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{kpis.marketShare.toFixed(1)}%</p>
              </div>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-lg">sentiment_satisfied</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Team Morale</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{kpis.satisfaction.toFixed(0)}%</p>
              </div>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-400 text-lg">campaign</span>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Brand Awareness</p>
                </div>
                <p className="text-2xl font-bold font-heading text-white mt-1">{kpis.brandAwareness.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Market Intelligence Report */}
          {briefing.marketSummary && (
            <div>
              <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">newspaper</span>
                Market Intelligence Report
              </h3>
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
                <p className="text-[#c0d0e0] text-base leading-relaxed whitespace-pre-line">
                  {briefing.marketSummary}
                </p>
              </div>
            </div>
          )}

          {/* Competitors */}
          {briefing.competitors.length > 0 && (
            <div>
              <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">groups</span>
                Initial Competitive Landscape
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {briefing.competitors.map((c, i) => {
                  const momentum = MOMENTUM_STYLES[c.momentum] || MOMENTUM_STYLES.neutral;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex flex-col gap-3"
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
              {briefing.restOfMarket.marketShare > 0 && (
                <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-500 text-lg">more_horiz</span>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Rest of Market</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {briefing.restOfMarket.fragmentation} fragmentation &middot; {briefing.restOfMarket.dynamism}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-400">
                    {briefing.restOfMarket.marketShare.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.05] bg-white/[0.02] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 btn-glow"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
