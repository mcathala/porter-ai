"use client";

import { useEffect, useState } from "react";
import { TurnResult, CompetitorArchetype } from "@/lib/types/game";

interface TurnSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  turnResult: TurnResult | null;
  turnNumber: number;
  newDate: string;
  playerActions?: string[];
}

export default function TurnSummaryModal({
  isOpen,
  onClose,
  turnResult,
  turnNumber,
  newDate,
  playerActions = [],
}: TurnSummaryModalProps) {
  const [showDevPanel, setShowDevPanel] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "d") {
        e.preventDefault();
        setShowDevPanel((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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
        day: "numeric",
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
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-[#233648] bg-gradient-to-r from-[#1a2632] to-[#1f3044]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {formatDate(newDate)}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Turn {turnNumber}</p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Key Metrics */}
          <div>
            <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                analytics
              </span>
              Michael&apos;s Report
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cash */}
              <div className="bg-[#111a22] rounded-2xl p-5 border border-[#233648]/60">
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
                <div className="text-2xl font-bold font-heading text-white">
                  {formatCurrency(turnResult.kpiDeltas.cash.value)}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {turnResult.kpiDeltas.cash.reason}
                </p>
              </div>

              {/* Market Share */}
              <div className="bg-[#111a22] rounded-2xl p-5 border border-[#233648]/60">
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
                <div className="text-2xl font-bold font-heading text-white">
                  {turnResult.kpiDeltas.marketShare.value.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {turnResult.kpiDeltas.marketShare.reason}
                </p>
              </div>

              {/* Satisfaction */}
              <div className="bg-[#111a22] rounded-2xl p-5 border border-[#233648]/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Team Morale</span>
                  <div
                    className={`flex items-center gap-1 text-sm font-bold ${getChangeColor(turnResult.kpiDeltas.satisfaction.change)}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {getChangeIcon(turnResult.kpiDeltas.satisfaction.change)}
                    </span>
                    {formatChange(turnResult.kpiDeltas.satisfaction.change, true)}
                  </div>
                </div>
                <div className="text-2xl font-bold font-heading text-white">
                  {turnResult.kpiDeltas.satisfaction.value.toFixed(0)}%
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {turnResult.kpiDeltas.satisfaction.reason}
                </p>
              </div>
            </div>
          </div>

          {/* News & Events */}
          {turnResult.newsItems.length > 0 && (
            <div>
              <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">
                  newspaper
                </span>
                News & Events
              </h3>
              <div className="space-y-3">
                {turnResult.newsItems.map((news, index) => (
                  <div
                    key={news.id || index}
                    className="bg-[#111a22] rounded-2xl p-4 border border-[#233648]/60"
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

          {/* Competitor Activity */}
          {turnResult.competitorMoves.length > 0 && (
            <div>
              <h3 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-400">
                  groups
                </span>
                Competitor Activity
              </h3>
              <div className="space-y-3">
                {turnResult.competitorMoves.map((move, index) => (
                  <div
                    key={index}
                    className="bg-[#111a22] rounded-2xl p-4 border border-[#233648]/60 flex items-start gap-4"
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

          {/* Dev Panel — hidden, toggled with Cmd+D */}
          {showDevPanel && (
            <div className="border border-dashed border-gray-600 rounded-xl p-4 sm:p-6 space-y-6 bg-[#0d1419]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">
                    code
                  </span>
                  Dev Panel (Cmd+D)
                </div>
                {turnResult.llmInfo && (
                  <span className="text-xs text-gray-600">
                    {turnResult.llmInfo.provider} / {turnResult.llmInfo.model}
                  </span>
                )}
              </div>

              {/* ── PLAYER ACTIONS ── */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2">Player Actions</h4>
                <div className="text-xs text-gray-500">
                  {playerActions.length > 0 ? (
                    <ul className="ml-4 space-y-1">
                      {playerActions.map((action, i) => (
                        <li key={i}>- {action}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-600">No specific actions — routine operations</span>
                  )}
                </div>
              </div>

              {/* ── PLAYER COMPANY AGENT ── */}
              {turnResult.playerCompanyAgentOutput && (
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-2">Player Company Agent (SWOT)</h4>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>
                      <span className="text-emerald-500 font-semibold">Strengths:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.playerCompanyAgentOutput.strengths.map((s, i) => (
                          <li key={i}>- {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-red-500 font-semibold">Weaknesses:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.playerCompanyAgentOutput.weaknesses.map((w, i) => (
                          <li key={i}>- {w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-blue-500 font-semibold">Opportunities:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.playerCompanyAgentOutput.opportunities.map((o, i) => (
                          <li key={i}>- {o}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-amber-500 font-semibold">Threats:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.playerCompanyAgentOutput.threats.map((t, i) => (
                          <li key={i}>- {t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-yellow-500 font-semibold">Proposed KPI Impacts:</span>
                      <span className="ml-2">
                        Cash: {turnResult.playerCompanyAgentOutput.proposedKPIImpacts.cash},
                        Share: {turnResult.playerCompanyAgentOutput.proposedKPIImpacts.marketShare},
                        Team Morale: {turnResult.playerCompanyAgentOutput.proposedKPIImpacts.satisfaction}
                      </span>
                    </div>
                    <div>
                      <span className="text-orange-500 font-semibold">Side Effects:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.playerCompanyAgentOutput.sideEffects.map((e, i) => (
                          <li key={i}>- {e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MARKET AGENT ── */}
              {turnResult.marketAgentOutput && (
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-2">Market Agent (Independent)</h4>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>
                      <span className="text-orange-500 font-semibold">Competitor Moves:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.marketAgentOutput.competitorMoves.map((m, i) => (
                          <li key={i}>- <span className="text-gray-400">{m.competitorName}</span> ({m.archetype}): {m.action} — {m.impact}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-purple-500 font-semibold">World Events:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {turnResult.marketAgentOutput.worldEvents.map((ev, i) => (
                          <li key={i}>- [{ev.category}] {ev.headline}: {ev.description}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-blue-500 font-semibold">Rest of Market:</span>
                      <span className="ml-2">{turnResult.marketAgentOutput.restOfMarketAssessment}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── GAMEMASTER ── */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2">Gamemaster</h4>
                <div className="space-y-3 text-xs text-gray-500">
                  {/* Turn Summary */}
                  {turnResult.turnSummary && (
                    <div>
                      <span className="text-cyan-500 font-semibold">Turn Summary:</span>
                      <p className="ml-4 mt-1 leading-relaxed whitespace-pre-line">
                        {turnResult.turnSummary}
                      </p>
                    </div>
                  )}

                  {/* Resolved KPIs */}
                  <div>
                    <span className="text-cyan-500 font-semibold">Resolved KPIs:</span>
                    <div className="ml-4 mt-1 space-y-1">
                      <div>Cash: {turnResult.kpiDeltas.cash.value} ({turnResult.kpiDeltas.cash.change >= 0 ? "+" : ""}{turnResult.kpiDeltas.cash.change}) — {turnResult.kpiDeltas.cash.reason}</div>
                      <div>Market Share: {turnResult.kpiDeltas.marketShare.value}% ({turnResult.kpiDeltas.marketShare.change >= 0 ? "+" : ""}{turnResult.kpiDeltas.marketShare.change}%) — {turnResult.kpiDeltas.marketShare.reason}</div>
                      <div>Team Morale: {turnResult.kpiDeltas.satisfaction.value}% ({turnResult.kpiDeltas.satisfaction.change >= 0 ? "+" : ""}{turnResult.kpiDeltas.satisfaction.change}%) — {turnResult.kpiDeltas.satisfaction.reason}</div>
                    </div>
                  </div>

                  {/* Updated Competitors */}
                  {turnResult.updatedCompetitors.length > 0 && (
                    <div>
                      <span className="text-cyan-500 font-semibold">Updated Competitors:</span>
                      <div className="ml-4 mt-1 space-y-1">
                        {turnResult.updatedCompetitors.map((comp, i) => (
                          <div key={i}>{comp.name} ({comp.archetype}) — {comp.marketShare}% share, {comp.momentum} momentum</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rest of Market */}
                  <div>
                    <span className="text-cyan-500 font-semibold">Rest of Market:</span>
                    <span className="ml-2">
                      {turnResult.updatedRestOfMarket.marketShare}% share, {turnResult.updatedRestOfMarket.fragmentation} fragmentation, {turnResult.updatedRestOfMarket.dynamism} dynamism, {turnResult.updatedRestOfMarket.latentPressure} pressure
                    </span>
                  </div>

                  {/* Narratives */}
                  {turnResult.updatedNarratives.length > 0 && (
                    <div>
                      <span className="text-cyan-500 font-semibold">Narrative Arcs:</span>
                      <div className="ml-4 mt-1 space-y-1">
                        {turnResult.updatedNarratives.map((arc) => (
                          <div key={arc.id} className="flex items-center gap-3">
                            <span className={`font-semibold px-2 py-0.5 rounded ${
                              arc.status === "dominant"
                                ? "bg-purple-500/20 text-purple-400"
                                : arc.status === "active"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}>
                              {arc.status}
                            </span>
                            <span className="text-gray-400">{arc.name}</span>
                            <div className="flex-1 bg-[#233648] rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  arc.status === "dominant"
                                    ? "bg-purple-500"
                                    : arc.status === "active"
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                                }`}
                                style={{ width: `${arc.weight}%` }}
                              />
                            </div>
                            <span className="text-gray-500">{arc.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Consequences */}
                  {(turnResult.newConsequences.length > 0 || turnResult.triggeredConsequences.length > 0) && (
                    <div>
                      <span className="text-cyan-500 font-semibold">Consequences:</span>
                      <div className="ml-4 mt-1 space-y-1">
                        {turnResult.triggeredConsequences.map((c, i) => (
                          <div key={c.id || i} className="text-red-400">TRIGGERED: {c.description} (from: {c.cause})</div>
                        ))}
                        {turnResult.newConsequences.map((c, i) => (
                          <div key={c.id || i} className="text-amber-400">PENDING: {c.description} (from: {c.cause})</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Turn Context */}
                  {turnResult.nextTurnContext && (
                    <div>
                      <span className="text-cyan-500 font-semibold">Next Turn Context:</span>
                      <p className="ml-4 mt-1">{turnResult.nextTurnContext}</p>
                    </div>
                  )}

                  {/* Company Culture */}
                  {turnResult.companyCulture && (
                    <div>
                      <span className="text-cyan-500 font-semibold">Company Culture:</span>
                      <p className="ml-4 mt-1">{turnResult.companyCulture}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── META ── */}
              {turnResult.tokenUsage && (
                <div>
                  <h4 className="text-sm font-bold text-gray-400 mb-2">Token Usage</h4>
                  <p className="text-gray-500 text-xs">
                    Input: {turnResult.tokenUsage.inputTokens.toLocaleString()} |
                    Output: {turnResult.tokenUsage.outputTokens.toLocaleString()} |
                    Total: {turnResult.tokenUsage.totalTokens.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-[#233648] bg-[#1a2632] flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
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
