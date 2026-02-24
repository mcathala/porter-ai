"use client";

import { useState } from "react";
import { useGame, TurnHistoryEntry } from "@/context/GameContext";
import { NewsItem, CompetitorMove } from "@/lib/types/game";
import TurnSummaryModal from "./TurnSummaryModal";

export default function DashboardFeed() {
  const { turnHistory, gameState } = useGame();
  const [selectedEntry, setSelectedEntry] = useState<TurnHistoryEntry | null>(null);

  // If no history yet, show welcome message
  if (turnHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
          <span className="material-symbols-outlined text-4xl">
            rocket_launch
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Welcome, CEO
        </h3>
        <p className="text-gray-400 max-w-md mb-6">
          Your simulation is ready. Take strategic actions and advance the turn
          to see results appear here.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="material-symbols-outlined text-lg">info</span>
          <span>Turn {gameState.turn} • {formatDate(gameState.currentDate)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">Recent Results</h2>
        <span className="text-sm text-gray-500">
          {turnHistory.length} turn{turnHistory.length !== 1 ? "s" : ""} completed
        </span>
      </div>

      {/* Feed Items */}
      {turnHistory.map((entry) => (
        <TurnHistoryCard key={entry.turn} entry={entry} onClick={() => setSelectedEntry(entry)} />
      ))}

      {/* Timeline line */}
      <div className="absolute left-[calc(50%-384px-17px)] top-0 bottom-0 w-px bg-[#233648] -z-10 hidden xl:block" />

      {/* History Turn Recap Modal */}
      <TurnSummaryModal
        isOpen={selectedEntry !== null}
        onClose={() => setSelectedEntry(null)}
        turnResult={selectedEntry?.result ?? null}
        turnNumber={selectedEntry?.turn ?? 0}
        newDate={selectedEntry?.date ?? ""}
      />
    </div>
  );
}

function TurnHistoryCard({ entry, onClick }: { entry: TurnHistoryEntry; onClick: () => void }) {
  const { turn, date, result, playerActions } = entry;

  // Determine the primary sentiment of this turn
  const cashChange = result.kpiDeltas.cash.change;
  const shareChange = result.kpiDeltas.marketShare.change;
  const overallPositive = cashChange >= 0 && shareChange >= 0;
  const overallNegative = cashChange < 0 && shareChange < 0;

  return (
    <div className="space-y-4">
      {/* Turn Summary Card */}
      <div onClick={onClick} className="group relative flex gap-4 rounded-xl bg-[#1a2632] p-5 transition-all hover:bg-[#233648] border border-transparent hover:border-[#2f455a] cursor-pointer">
        <div className="absolute -left-[33px] top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#233648] ring-4 ring-[#101922] text-gray-400 text-xs font-bold">
          {turn}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            overallPositive
              ? "bg-emerald-500/10 text-emerald-500"
              : overallNegative
                ? "bg-red-500/10 text-red-500"
                : "bg-blue-500/10 text-blue-500"
          }`}
        >
          <span className="material-symbols-outlined">
            {overallPositive
              ? "trending_up"
              : overallNegative
                ? "trending_down"
                : "swap_vert"}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Turn {turn} Summary</h3>
            <span className="text-xs text-gray-500">{formatDate(date)}</span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            {result.turnSummary.length > 200
              ? result.turnSummary.substring(0, 200) + "..."
              : result.turnSummary}
          </p>

          {/* KPI Changes */}
          <div className="flex gap-4 mt-2">
            <KPIBadge
              label="Cash"
              change={result.kpiDeltas.cash.change}
              isPercent={false}
            />
            <KPIBadge
              label="Share"
              change={result.kpiDeltas.marketShare.change}
              isPercent={true}
            />
            <KPIBadge
              label="Satisfaction"
              change={result.kpiDeltas.satisfaction.change}
              isPercent={true}
            />
          </div>

          {/* Player Actions */}
          {playerActions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[#233648]">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Your Actions:
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {playerActions.map((action, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* News Items */}
      {result.newsItems.length > 0 && (
        <div className="ml-16 space-y-2">
          {result.newsItems.slice(0, 3).map((news, idx) => (
            <NewsCard key={news.id || idx} news={news} />
          ))}
        </div>
      )}

      {/* Competitor Moves */}
      {result.competitorMoves.length > 0 && (
        <div className="ml-16 space-y-2">
          {result.competitorMoves.slice(0, 2).map((move, idx) => (
            <CompetitorCard key={idx} move={move} />
          ))}
        </div>
      )}
    </div>
  );
}

function KPIBadge({
  label,
  change,
  isPercent,
}: {
  label: string;
  change: number;
  isPercent: boolean;
}) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const formatValue = () => {
    const prefix = isPositive ? "+" : "";
    if (isPercent) {
      return `${prefix}${change.toFixed(1)}%`;
    }
    if (Math.abs(change) >= 1000000) {
      return `${prefix}$${(change / 1000000).toFixed(1)}M`;
    } else if (Math.abs(change) >= 1000) {
      return `${prefix}$${(change / 1000).toFixed(0)}k`;
    }
    return `${prefix}$${change.toFixed(0)}`;
  };

  return (
    <div
      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
        isPositive
          ? "bg-emerald-500/10 text-emerald-400"
          : isNegative
            ? "bg-red-500/10 text-red-400"
            : "bg-gray-500/10 text-gray-400"
      }`}
    >
      <span>{label}:</span>
      <span className="font-bold">{formatValue()}</span>
    </div>
  );
}

function NewsCard({ news }: { news: NewsItem }) {
  const sentimentStyles = {
    positive: "border-l-emerald-500",
    negative: "border-l-red-500",
    neutral: "border-l-gray-500",
  };

  const categoryIcons: Record<string, string> = {
    industry: "factory",
    competitor: "groups",
    internal: "apartment",
    market: "show_chart",
    regulatory: "gavel",
  };

  return (
    <div
      className={`bg-[#111a22] rounded-lg p-3 border-l-2 ${sentimentStyles[news.sentiment]}`}
    >
      <div className="flex items-start gap-2">
        <span className="material-symbols-outlined text-gray-500 text-lg">
          {categoryIcons[news.category] || "article"}
        </span>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">{news.headline}</h4>
          <p className="text-xs text-gray-400 mt-1">{news.summary}</p>
        </div>
      </div>
    </div>
  );
}

function CompetitorCard({ move }: { move: CompetitorMove }) {
  return (
    <div className="bg-[#111a22] rounded-lg p-3 border-l-2 border-l-orange-500">
      <div className="flex items-start gap-2">
        <span className="material-symbols-outlined text-orange-500 text-lg">
          groups
        </span>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">
            {move.competitorName}
          </h4>
          <p className="text-xs text-gray-400 mt-1">{move.action}</p>
          <p className="text-xs text-orange-400/70 mt-1">
            Impact: {move.impact}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
