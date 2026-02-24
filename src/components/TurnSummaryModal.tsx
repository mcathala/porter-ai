"use client";

import { TurnResult, CompetitorArchetype } from "@/lib/types/game";

interface TurnSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  turnResult: TurnResult | null;
  turnNumber: number;
  newDate: string;
}

export default function TurnSummaryModal({
  isOpen,
  onClose,
  turnResult,
  turnNumber,
  newDate,
}: TurnSummaryModalProps) {
  if (!isOpen || !turnResult) return null;

  const formatCurrency = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatChange = (change: number, isPercent: boolean = false): string => {
    const prefix = change >= 0 ? "+" : "";
    if (isPercent) {
      return `${prefix}${change.toFixed(1)}%`;
    }
    return `${prefix}${formatCurrency(change)}`;
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return "text-emerald-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  const getChangeIcon = (change: number): string => {
    if (change > 0) return "trending_up";
    if (change < 0) return "trending_down";
    return "remove";
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111a22]/90 backdrop-blur-sm">
      <div
        className="fixed inset-0 z-0 cursor-default"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="bg-[#1a2632] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#233648] overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200 text-white">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#233648] bg-gradient-to-r from-[#1a2632] to-[#1f3044]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">
                  flag
                </span>
                Turn {turnNumber} Complete
              </h2>
              <p className="text-gray-400 mt-1">{formatDate(newDate)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <span className="material-symbols-outlined text-[24px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Turn Summary Narrative */}
          <div className="bg-[#111a22] rounded-xl p-6 border border-[#233648]">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {turnResult.turnSummary}
            </p>
          </div>

          {/* KPI Changes */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                analytics
              </span>
              Key Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cash */}
              <div className="bg-[#111a22] rounded-xl p-5 border border-[#233648]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Cash Balance</span>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(turnResult.kpiDeltas.cash.change)}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {getChangeIcon(turnResult.kpiDeltas.cash.change)}
                    </span>
                    {formatChange(turnResult.kpiDeltas.cash.change)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(turnResult.kpiDeltas.cash.value)}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {turnResult.kpiDeltas.cash.reason}
                </p>
              </div>

              {/* Market Share */}
              <div className="bg-[#111a22] rounded-xl p-5 border border-[#233648]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Market Share</span>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(turnResult.kpiDeltas.marketShare.change)}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {getChangeIcon(turnResult.kpiDeltas.marketShare.change)}
                    </span>
                    {formatChange(turnResult.kpiDeltas.marketShare.change, true)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {turnResult.kpiDeltas.marketShare.value.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {turnResult.kpiDeltas.marketShare.reason}
                </p>
              </div>

              {/* Satisfaction */}
              <div className="bg-[#111a22] rounded-xl p-5 border border-[#233648]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Satisfaction</span>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(turnResult.kpiDeltas.satisfaction.change)}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {getChangeIcon(turnResult.kpiDeltas.satisfaction.change)}
                    </span>
                    {formatChange(turnResult.kpiDeltas.satisfaction.change, true)}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">
                  {turnResult.kpiDeltas.satisfaction.value.toFixed(0)}%
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {turnResult.kpiDeltas.satisfaction.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Arcs */}
          {turnResult.updatedNarratives.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400">
                  auto_stories
                </span>
                Active Narratives
              </h3>
              <div className="space-y-3">
                {turnResult.updatedNarratives.map((arc) => (
                  <div
                    key={arc.id}
                    className="bg-[#111a22] rounded-xl p-4 border border-[#233648]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">{arc.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        arc.status === "dominant"
                          ? "bg-purple-500/20 text-purple-400"
                          : arc.status === "active"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {arc.status}
                      </span>
                    </div>
                    <div className="w-full bg-[#233648] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          arc.status === "dominant"
                            ? "bg-purple-500"
                            : arc.status === "active"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                        style={{ width: `${arc.weight}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{arc.weight}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitor Moves */}
          {turnResult.competitorMoves.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">
                  groups
                </span>
                Competitor Activity
              </h3>
              <div className="space-y-3">
                {turnResult.competitorMoves.map((move, index) => (
                  <div
                    key={index}
                    className="bg-[#111a22] rounded-xl p-4 border border-[#233648] flex items-start gap-4"
                  >
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                      <span className="material-symbols-outlined">
                        {getCompetitorIcon(move.archetype)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">
                          {move.competitorName}
                        </span>
                        <span className="text-xs text-gray-500 bg-[#233648] px-2 py-0.5 rounded">
                          {move.archetype}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{move.action}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Impact: {move.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Headlines */}
          {turnResult.newsItems.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">
                  newspaper
                </span>
                News & Events
              </h3>
              <div className="space-y-3">
                {turnResult.newsItems.map((news, index) => (
                  <div
                    key={news.id || index}
                    className="bg-[#111a22] rounded-xl p-4 border border-[#233648]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${getCategoryStyle(news.category)}`}
                          >
                            {news.category.toUpperCase()}
                          </span>
                          <span
                            className={`text-xs ${getSentimentStyle(news.sentiment)}`}
                          >
                            {news.sentiment === "positive" && "↑"}
                            {news.sentiment === "negative" && "↓"}
                            {news.sentiment === "neutral" && "→"}
                          </span>
                        </div>
                        <h4 className="font-bold text-white mb-1">
                          {news.headline}
                        </h4>
                        <p className="text-gray-400 text-sm">{news.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Consequences */}
          {turnResult.newConsequences.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">
                  schedule
                </span>
                Upcoming Effects
              </h3>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <ul className="space-y-2">
                  {turnResult.newConsequences.map((consequence, index) => (
                    <li
                      key={consequence.id || index}
                      className="flex items-start gap-2 text-sm text-amber-200"
                    >
                      <span className="material-symbols-outlined text-[16px] mt-0.5">
                        arrow_forward
                      </span>
                      <div>
                        <span>{consequence.description}</span>
                        <span className="text-amber-400/60 text-xs ml-2">
                          (caused by: {consequence.cause})
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-[#233648] bg-[#1a2632] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getCompetitorIcon(archetype: CompetitorArchetype | string): string {
  const icons: Record<string, string> = {
    dominant: "shield",
    follower: "content_copy",
    disruptor: "bolt",
    opportunist: "explore",
  };
  return icons[archetype] || "business";
}

function getCategoryStyle(category: string): string {
  const styles: Record<string, string> = {
    industry: "bg-blue-500/20 text-blue-400",
    competitor: "bg-orange-500/20 text-orange-400",
    internal: "bg-green-500/20 text-green-400",
    market: "bg-purple-500/20 text-purple-400",
    regulatory: "bg-red-500/20 text-red-400",
  };
  return styles[category] || "bg-gray-500/20 text-gray-400";
}

function getSentimentStyle(sentiment: string): string {
  const styles: Record<string, string> = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-gray-400",
  };
  return styles[sentiment] || "text-gray-400";
}
