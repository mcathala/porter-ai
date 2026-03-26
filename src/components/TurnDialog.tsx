"use client";

import { useState } from "react";

interface TurnDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onProceed: (option: string, remember: boolean) => void;
}

export default function TurnDialog({
    isOpen,
    onClose,
    onProceed,
}: TurnDialogProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [rememberChoice, setRememberChoice] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);

    if (!isOpen) return null;

    const handleProceed = async () => {
        if (!selectedOption) return;

        setIsSimulating(true);

        // Mock simulation delay
        setTimeout(() => {
            onProceed(selectedOption, rememberChoice);
            setIsSimulating(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f14]/80 backdrop-blur-sm transition-all duration-300">
            <div
                className="fixed inset-0 z-0 cursor-default"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="glass-modal w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-in zoom-in-95 duration-200 text-white">
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02] sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[24px]">
                                timelapse
                            </span>
                            Time Advance Configuration
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Select how you want to proceed with the simulation.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </button>
                </div>

                <div className="p-4 sm:p-8 overflow-y-auto bg-white/[0.01]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Recommended Option - Emerald */}
                        <div
                            onClick={() => setSelectedOption("event")}
                            className={`col-span-1 md:col-span-2 lg:col-span-3 bg-white/[0.02] p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md group relative overflow-hidden ${selectedOption === "event"
                                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-900/10"
                                    : "border-emerald-500/40 hover:border-emerald-500"
                                }`}
                        >
                            <div className="absolute top-0 right-0 p-2">
                                {selectedOption === "event" ? (
                                    <div className="size-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white text-[16px]">
                                            check
                                        </span>
                                    </div>
                                ) : (
                                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                        Recommended
                                    </span>
                                )}
                            </div>
                            <div className="flex items-start gap-4">
                                <div
                                    className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${selectedOption === "event"
                                            ? "bg-emerald-500 text-white"
                                            : "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[24px]">
                                        event_note
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className={`text-base font-bold font-heading transition-colors ${selectedOption === "event"
                                                ? "text-emerald-400"
                                                : "text-white group-hover:text-emerald-400"
                                            }`}
                                    >
                                        To Next Major Event
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1 mb-3">
                                        Stops simulation automatically upon encountering a Critical
                                        Decision Point.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-900/20 px-3 py-2 rounded-lg border border-amber-800/30">
                                        <span className="material-symbols-outlined text-[16px]">
                                            warning
                                        </span>
                                        <span>
                                            Upcoming: Q3 Board Meeting (Requires Preparation)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skip 1 Week - Blue */}
                        <div
                            onClick={() => setSelectedOption("week")}
                            className={`bg-white/[0.02] p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md group relative ${selectedOption === "week"
                                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-900/10"
                                    : "border-white/[0.06] hover:border-blue-500/50"
                                }`}
                        >
                            {selectedOption === "week" && (
                                <div className="absolute top-3 right-3 size-5 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[14px]">
                                        check
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`size-10 rounded-lg flex items-center justify-center transition-colors ${selectedOption === "week"
                                            ? "bg-blue-500 text-white"
                                            : "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        calendar_view_week
                                    </span>
                                </div>
                                <h3
                                    className={`text-base font-bold font-heading ${selectedOption === "week" ? "text-blue-400" : "text-white"
                                        }`}
                                >
                                    Skip 1 Week
                                </h3>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Micro-management mode. Review weekly KPIs and adjust short-term
                                marketing spend.
                            </p>
                            <div
                                className={`mt-4 pt-3 border-t flex justify-between items-center ${selectedOption === "week"
                                        ? "border-blue-800/30"
                                        : "border-white/[0.06]"
                                    }`}
                            >
                                <span className="text-[10px] uppercase font-bold text-gray-500">
                                    Granularity
                                </span>
                                <div className="flex gap-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                </div>
                            </div>
                        </div>

                        {/* Skip 1 Month - Indigo */}
                        <div
                            onClick={() => setSelectedOption("month")}
                            className={`bg-white/[0.02] p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md group relative ${selectedOption === "month"
                                    ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-900/10"
                                    : "border-white/[0.06] hover:border-indigo-500/50"
                                }`}
                        >
                            {selectedOption === "month" && (
                                <div className="absolute top-3 right-3 size-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[14px]">
                                        check
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`size-10 rounded-lg flex items-center justify-center transition-colors ${selectedOption === "month"
                                            ? "bg-indigo-500 text-white"
                                            : "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        calendar_month
                                    </span>
                                </div>
                                <h3
                                    className={`text-base font-bold font-heading ${selectedOption === "month"
                                            ? "text-indigo-400"
                                            : "text-white"
                                        }`}
                                >
                                    Skip 1 Month
                                </h3>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Standard operational cycle. Process payroll, monthly reports,
                                and supply chain updates.
                            </p>
                            <div
                                className={`mt-4 pt-3 border-t flex justify-between items-center ${selectedOption === "month"
                                        ? "border-indigo-800/30"
                                        : "border-white/[0.06]"
                                    }`}
                            >
                                <span className="text-[10px] uppercase font-bold text-gray-500">
                                    Granularity
                                </span>
                                <div className="flex gap-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Skip 1 Quarter - Purple */}
                        <div
                            onClick={() => setSelectedOption("quarter")}
                            className={`bg-white/[0.02] p-5 rounded-xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md group relative ${selectedOption === "quarter"
                                    ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-900/10"
                                    : "border-white/[0.06] hover:border-purple-500/50"
                                }`}
                        >
                            {selectedOption === "quarter" && (
                                <div className="absolute top-3 right-3 size-5 rounded-full bg-purple-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[14px]">
                                        check
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`size-10 rounded-lg flex items-center justify-center transition-colors ${selectedOption === "quarter"
                                            ? "bg-purple-500 text-white"
                                            : "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        pie_chart
                                    </span>
                                </div>
                                <h3
                                    className={`text-base font-bold font-heading ${selectedOption === "quarter"
                                            ? "text-purple-400"
                                            : "text-white"
                                        }`}
                                >
                                    Skip 1 Quarter
                                </h3>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Strategic review cycle. Fast-forward to earnings call. Ideal for
                                long-term product launches.
                            </p>
                            <div
                                className={`mt-4 pt-3 border-t flex justify-between items-center ${selectedOption === "quarter"
                                        ? "border-purple-800/30"
                                        : "border-white/[0.06]"
                                    }`}
                            >
                                <span className="text-[10px] uppercase font-bold text-gray-500">
                                    Granularity
                                </span>
                                <div className="flex gap-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/[0.08]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Skip 1 Year - Amber/Orange (Warning) */}
                        <div
                            onClick={() => setSelectedOption("year")}
                            className={`col-span-1 md:col-span-2 lg:col-span-3 bg-white/[0.02] p-4 rounded-xl border-2 cursor-pointer transition-all shadow-sm hover:shadow-md group flex items-center justify-between gap-4 relative ${selectedOption === "year"
                                    ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-900/10"
                                    : "border-white/[0.06] hover:border-amber-500/50"
                                }`}
                        >
                            {selectedOption === "year" && (
                                <div className="absolute top-3 right-3 size-5 rounded-full bg-amber-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-[14px]">
                                        check
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <div
                                    className={`size-10 rounded-lg flex items-center justify-center transition-colors ${selectedOption === "year"
                                            ? "bg-amber-500 text-white"
                                            : "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        rocket_launch
                                    </span>
                                </div>
                                <div>
                                    <h3
                                        className={`text-base font-bold font-heading ${selectedOption === "year"
                                                ? "text-amber-400"
                                                : "text-white"
                                            }`}
                                    >
                                        Skip 1 Year
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        Macro simulation only. Annual financial statements and major
                                        market shifts. High risk of missing nuances.
                                    </p>
                                </div>
                            </div>
                            {!selectedOption || selectedOption !== "year" ? (
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-amber-500 transition-colors text-[20px]">
                                    arrow_forward
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-white/[0.05] bg-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div className="flex items-center gap-2">
                        <input
                            className="rounded border-white/[0.1] bg-white/[0.03] text-primary focus:ring-primary/50"
                            id="dontShow"
                            type="checkbox"
                            checked={rememberChoice}
                            onChange={(e) => setRememberChoice(e.target.checked)}
                        />
                        <label className="text-xs sm:text-sm text-gray-400" htmlFor="dontShow">
                            Remember choice for this session
                        </label>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={onClose}
                            disabled={isSimulating}
                            className="px-4 sm:px-5 py-2.5 rounded-xl text-slate-300 font-medium hover:bg-white/[0.04] transition-colors disabled:opacity-50 cursor-pointer flex-1 sm:flex-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProceed}
                            disabled={!selectedOption || isSimulating}
                            className={`px-4 sm:px-5 py-2.5 rounded-xl text-white font-medium font-heading shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-none ${selectedOption && !isSimulating
                                    ? "bg-primary shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] btn-glow"
                                    : "bg-white/[0.08] cursor-not-allowed shadow-none"
                                }`}
                        >
                            {isSimulating ? (
                                <>
                                    <span className="material-symbols-outlined text-[18px] animate-spin">
                                        hourglass_empty
                                    </span>
                                    Simulating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">
                                        play_arrow
                                    </span>
                                    Start Simulation
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
