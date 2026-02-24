"use client";

import { useState } from "react";
import ActionDialog from "./ActionDialog";
import TurnDialog from "./TurnDialog";
import TurnSummaryModal from "./TurnSummaryModal";
import AdvisorPanel from "./AdvisorPanel";
import { useGame } from "@/context/GameContext";
import { TimeAdvance } from "@/lib/types/game";

interface Action {
  id: string;
  text: string;
  timestamp: Date;
}

export default function ActionDock() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTurnDialogOpen, setIsTurnDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    gameState,
    actions,
    addAction,
    removeAction,
    isProcessingTurn,
    processTurn,
    currentTurnResult,
    showTurnSummary,
    closeTurnSummary,
    openAdvisor,
    isAdvisorOpen,
  } = useGame();

  // Convert context actions to the format expected by ActionDialog
  const takenActions: Action[] = actions.map((text, index) => ({
    id: `action-${index}`,
    text,
    timestamp: new Date(),
  }));

  const handleAddAction = (text: string) => {
    addAction(text);
  };

  const handleDeleteAction = (id: string) => {
    const index = parseInt(id.replace("action-", ""), 10);
    if (!isNaN(index)) {
      removeAction(index);
    }
  };

  const handleTurnProceed = async (option: string, remember: boolean) => {
    setError(null);
    setIsTurnDialogOpen(false);

    try {
      await processTurn(option as TimeAdvance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process turn";
      setError(errorMessage);
      console.error("Turn processing error:", err);
    }
  };

  return (
    <>
      {/* Processing Overlay */}
      {isProcessingTurn && (
        <div className="absolute inset-0 bottom-0 z-[100] bg-[#111a22]/80 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center pointer-events-none pb-[120px]">
          <div className="flex flex-col items-center gap-4 bg-[#1a2632]/80 p-8 rounded-3xl border border-[#233648] shadow-2xl animate-in zoom-in-95 duration-300">
            <span className="material-symbols-outlined text-primary text-[48px] animate-spin">
              autorenew
            </span>
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-xl font-bold text-white tracking-wide">Processing Turn</h3>
              <p className="text-sm text-gray-400">Simulating market changes and opponent moves...</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Advisor Button */}
      <button
        onClick={openAdvisor}
        disabled={isProcessingTurn}
        className={`fixed bottom-[180px] md:bottom-[140px] right-4 sm:right-8 z-30 group flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isAdvisorOpen
          ? "bg-emerald-600 shadow-emerald-500/50"
          : "bg-[#1f2d3b] border border-[#30475e] hover:border-emerald-500 shadow-black/40"
          }`}
      >
        <span className={`material-symbols-outlined text-[28px] sm:text-[32px] ${isAdvisorOpen ? "text-white" : "text-emerald-500 group-hover:text-emerald-400"
          }`}>
          psychology
        </span>
        {/* Ping indicator when closed */}
        {!isAdvisorOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-4 sm:w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-emerald-500 border border-[#111a22]"></span>
          </span>
        )}
      </button>

      <div className="relative shrink-0 z-20 bg-[#111a22] border-t border-[#233648] p-3 sm:p-6 pb-4 sm:pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="mx-auto max-w-6xl flex flex-row items-center justify-between gap-3 sm:gap-4">

          {/* Left Side: Take Action & Queue Status */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:flex-none">
            <button
              onClick={() => setIsDialogOpen(true)}
              disabled={isProcessingTurn}
              className="group flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[24px] text-blue-200 group-hover:text-white transition-colors">
                add_circle
              </span>
              <span className="font-bold text-sm sm:text-lg tracking-wide">Take Action</span>
            </button>

            {actions.length > 0 && (
              <div className="text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-2 bg-[#1a2632] px-3 sm:px-4 py-2 rounded-lg border border-[#233648] shrink-0 hidden sm:flex">
                <span className="material-symbols-outlined text-[16px] text-blue-400">
                  checklist
                </span>
                {actions.length} action{actions.length !== 1 ? "s" : ""} queued
              </div>
            )}
          </div>

          {/* Error Message - hidden on small mobile, shown on sm+ */}
          {error && (
            <div className="hidden sm:flex bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm items-center gap-2 max-w-md mx-auto">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span className="flex-1 truncate">{error}</span>
              <button
                onClick={() => setError(null)}
                className="hover:text-red-300 transition-colors shrink-0"
                title="Clear error"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}

          {/* Right Side: Next Turn */}
          <div className="flex items-center flex-1 sm:flex-none">
            <button
              onClick={() => setIsTurnDialogOpen(true)}
              disabled={isProcessingTurn}
              className="group relative flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2.5 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto justify-center"
            >
              <span className="font-bold text-sm sm:text-lg tracking-wide">
                {isProcessingTurn ? "Simulating..." : "Next Turn"}
              </span>
              <span className={`material-symbols-outlined text-[20px] sm:text-[24px] ${isProcessingTurn ? 'animate-spin' : 'group-hover:translate-x-1 transition-transform'}`}>
                {isProcessingTurn ? "hourglass_empty" : "arrow_forward"}
              </span>
            </button>
          </div>

        </div>

        {/* Error on mobile - shown below buttons */}
        {error && (
          <div className="flex sm:hidden bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-3 py-2 text-xs items-center gap-2 mt-3">
            <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
            <span className="flex-1 truncate">{error}</span>
            <button
              onClick={() => setError(null)}
              className="hover:text-red-300 transition-colors shrink-0"
              title="Clear error"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Global Command Center Hint - hidden on mobile */}
        <div className="absolute bottom-2 left-0 right-0 hidden sm:flex justify-center pointer-events-none">
          <span className="text-[10px] text-gray-500/70 uppercase tracking-[0.2em] font-medium">
            Press Enter to Open Command Center
          </span>
        </div>
      </div>

      <ActionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        takenActions={takenActions}
        onAddAction={handleAddAction}
        onDeleteAction={handleDeleteAction}
        onNextTurn={() => {
          setIsDialogOpen(false);
          setIsTurnDialogOpen(true);
        }}
      />

      <TurnDialog
        isOpen={isTurnDialogOpen}
        onClose={() => setIsTurnDialogOpen(false)}
        onProceed={handleTurnProceed}
      />

      <TurnSummaryModal
        isOpen={showTurnSummary}
        onClose={closeTurnSummary}
        turnResult={currentTurnResult}
        turnNumber={gameState.turn}
        newDate={currentTurnResult?.newDate || gameState.currentDate}
      />

      <AdvisorPanel />
    </>
  );
}
