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
    <header className="shrink-0 flex items-center justify-between border-b border-[#233648] bg-[#111a22] px-6 py-3">
      {/* KPI Cards */}
      <div className="flex items-center gap-3">
        {/* Cash Balance */}
        <div className="flex items-center gap-3 rounded-lg bg-[#1a2632] px-4 py-2 border border-[#233648]">
          <span className="material-symbols-outlined text-gray-500 text-lg">
            payments
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400">
              Cash Balance
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                {formatCurrency(kpis.cash)}
              </span>
            </div>
          </div>
        </div>

        {/* Market Share */}
        <div className="flex items-center gap-3 rounded-lg bg-[#1a2632] px-4 py-2 border border-[#233648]">
          <span className="material-symbols-outlined text-gray-500 text-lg">
            pie_chart
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400">
              Market Share
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                {kpis.marketShare.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="flex items-center gap-3 rounded-lg bg-[#1a2632] px-4 py-2 border border-[#233648]">
          <span className="material-symbols-outlined text-gray-500 text-lg">
            sentiment_satisfied
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400">
              Cust. Satisfaction
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">
                {kpis.satisfaction.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Name + Turn Counter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#1a2632] px-4 py-2 rounded-lg border border-[#233648]">
          <span className="material-symbols-outlined text-primary text-lg">
            business
          </span>
          <span className="text-sm font-bold text-white">{gameState.playerCompany.name}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1a2632] px-4 py-2 rounded-lg border border-[#233648]">
          <span className="material-symbols-outlined text-primary text-lg">
            schedule
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-400">Turn</span>
            <span className="font-mono text-lg font-bold text-white">{turn}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
