"use client";

import { useState, useRef, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import BriefingModal from "./BriefingModal";

export default function KPIHeader() {
  const { gameState, totalTokenUsage, initialBriefing } = useGame();
  const [showBriefing, setShowBriefing] = useState(false);
  const [showTokenDetails, setShowTokenDetails] = useState(false);
  const tokenRef = useRef<HTMLDivElement>(null);
  const { kpis, turn } = gameState;

  useEffect(() => {
    if (!showTokenDetails) return;
    const handleClick = (e: MouseEvent) => {
      if (tokenRef.current && !tokenRef.current.contains(e.target as Node)) {
        setShowTokenDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTokenDetails]);

  const formatTokenCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

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
    <>
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
          <button
            onClick={() => setShowBriefing(true)}
            className="hidden sm:flex items-center gap-2 bg-[#1a2632] px-4 py-2 rounded-lg border border-[#233648] hover:border-primary/50 hover:bg-[#1f2f3f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary text-lg">
              business
            </span>
            <span className="text-sm font-bold text-white">{gameState.playerCompany.name}</span>
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#1a2632] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#233648]">
            <span className="material-symbols-outlined text-primary text-base sm:text-lg">
              schedule
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-white">{turn}</span>
          </div>
          {totalTokenUsage.totalTokens > 0 && (
            <div className="relative" ref={tokenRef}>
              <button
                onClick={() => setShowTokenDetails((v) => !v)}
                className="hidden sm:flex items-center gap-2 bg-[#1a2632] px-3 py-1.5 sm:py-2 rounded-lg border border-[#233648] hover:border-primary/50 hover:bg-[#1f2f3f] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-gray-500 text-base sm:text-lg">
                  token
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {formatTokenCount(totalTokenUsage.totalTokens)}
                </span>
              </button>
              {showTokenDetails && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-[#1a2632] border border-[#233648] rounded-lg shadow-xl p-3 min-w-[180px]">
                  <div className="text-xs font-medium text-gray-400 mb-2">Token Usage</div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Input</span>
                      <span className="text-xs font-mono text-gray-300">{totalTokenUsage.inputTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Output</span>
                      <span className="text-xs font-mono text-gray-300">{totalTokenUsage.outputTokens.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-[#233648] my-0.5" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 font-medium">Total</span>
                      <span className="text-xs font-mono text-white font-medium">{totalTokenUsage.totalTokens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>

    {initialBriefing && (
      <BriefingModal
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        briefing={initialBriefing}
      />
    )}
    </>
  );
}
