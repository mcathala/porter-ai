"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const metrics = [
    { label: "Cash Balance", value: formatCurrency(kpis.cash) },
    { label: "Market Share", value: `${kpis.marketShare.toFixed(1)}%` },
    { label: "Team Morale", value: `${kpis.satisfaction.toFixed(0)}%` },
    { label: "Brand Awareness", value: `${kpis.brandAwareness.toFixed(0)}%` },
  ];

  return (
    <>
      <header className="shrink-0 border-b border-white/[0.06] px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left — KPIs */}
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto no-scrollbar min-w-0">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center gap-2 shrink-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white/50 text-xs font-medium">
                    {m.label}
                  </span>
                  <span className="text-white text-sm font-bold font-heading tabular-nums">
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right — context */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Company name */}
            <button
              onClick={() => setShowBriefing(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all text-white/60 hover:text-white"
            >
              <span className="material-symbols-outlined text-base text-primary/60">
                business
              </span>
              <span className="text-xs font-medium">{gameState.playerCompany.name}</span>
            </button>

            {/* Date/Turn */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/50">
              <span className="material-symbols-outlined text-base">schedule</span>
              <span className="text-xs font-medium tabular-nums">
                {gameState.currentDate || `Turn ${turn}`}
              </span>
            </div>

            {/* Token usage */}
            {totalTokenUsage.totalTokens > 0 && (
              <div className="relative" ref={tokenRef}>
                <button
                  onClick={() => setShowTokenDetails((v) => !v)}
                  className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all text-white/30 hover:text-white/60"
                >
                  <span className="material-symbols-outlined text-sm">token</span>
                  <span className="text-[11px] font-mono">
                    {formatTokenCount(totalTokenUsage.totalTokens)}
                  </span>
                </button>
                <AnimatePresence>
                  {showTokenDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-50 bg-[#0a0f14]/95 backdrop-blur-2xl border border-white/[0.06] rounded-xl shadow-xl p-3 min-w-[180px]"
                    >
                      <div className="text-[11px] font-medium text-white/40 mb-2">Token Usage</div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-white/30">Input</span>
                          <span className="text-[11px] font-mono text-white/60">{totalTokenUsage.inputTokens.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-white/30">Output</span>
                          <span className="text-[11px] font-mono text-white/60">{totalTokenUsage.outputTokens.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-white/[0.06] my-0.5" />
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-white/40 font-medium">Total</span>
                          <span className="text-[11px] font-mono text-white font-medium">{totalTokenUsage.totalTokens.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
