"use client";

import { useGame } from "@/context/GameContext";

export default function KPIHeader() {
  const { gameState } = useGame();
  const { kpis, turn } = gameState;

  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <header className="shrink-0 border-b border-[#233648] bg-[#111a22] px-3 sm:px-6 py-2 sm:py-3">
      <div className="flex items-center justify-between gap-2">
        {/* KPI Cards - scrollable on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar min-w-0">
          {/* Cash Balance */}
          <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-[#1a2632] px-2.5 sm:px-4 py-1.5 sm:py-2 border border-[#233648] shrink-0">
            <span className="material-symbols-outlined text-gray-500 text-base sm:text-lg">
              payments
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 hidden sm:block">
                Cash
              </span>
              <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
                {formatCurrency(kpis.cash)}
              </span>
            </div>
          </div>

          {/* Market Share */}
          <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-[#1a2632] px-2.5 sm:px-4 py-1.5 sm:py-2 border border-[#233648] shrink-0">
            <span className="material-symbols-outlined text-gray-500 text-base sm:text-lg">
              pie_chart
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 hidden sm:block">
                Share
              </span>
              <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
                {kpis.marketShare.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="flex items-center gap-2 sm:gap-3 rounded-lg bg-[#1a2632] px-2.5 sm:px-4 py-1.5 sm:py-2 border border-[#233648] shrink-0">
            <span className="material-symbols-outlined text-gray-500 text-base sm:text-lg">
              sentiment_satisfied
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-medium text-gray-400 hidden sm:block">
                Satisfaction
              </span>
              <span className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
                {kpis.satisfaction.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Turn Counter - always visible, company name hidden on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 bg-[#1a2632] px-4 py-2 rounded-lg border border-[#233648]">
            <span className="material-symbols-outlined text-primary text-lg">
              business
            </span>
            <span className="text-sm font-bold text-white">{gameState.playerCompany.name}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1a2632] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#233648]">
            <span className="material-symbols-outlined text-primary text-base sm:text-lg">
              schedule
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-white">{turn}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
