"use client";

import { useState, useEffect, useRef } from "react";

interface Action {
    id: string;
    text: string;
    timestamp: Date;
}

interface ActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    takenActions: Action[];
    onAddAction: (text: string) => void;
    onDeleteAction: (id: string) => void;
    onNextTurn: () => void;
}

const suggestedActions = [
    { id: "s1", icon: "trending_up", text: "Review Q3 projections" },
    { id: "s2", icon: "handshake", text: "Negotiate with supplier" },
    { id: "s3", icon: "sell", text: "Adjust pricing strategy" },
];

export default function ActionDialog({
    isOpen,
    onClose,
    takenActions,
    onAddAction,
    onDeleteAction,
    onNextTurn,
}: ActionDialogProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && inputValue.trim()) {
            handleAddAction(inputValue.trim());
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    const handleAddAction = (text: string) => {
        onAddAction(text);
        setInputValue("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-[#111a22]/80 backdrop-blur-sm transition-all duration-300">
            <div
                className="fixed inset-0 z-0 cursor-default"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="w-full max-w-2xl mx-4 transform transition-all relative z-10 flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-2xl bg-[#141f2b] shadow-2xl ring-1 ring-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-50 pointer-events-none" />

                    <div className="relative flex items-center gap-4 px-6 py-6">
                        <input
                            ref={inputRef}
                            autoFocus
                            className="h-12 w-full border-0 bg-transparent p-0 text-xl text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                            placeholder="What strategic initiative shall we launch?"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={onClose}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Close (Esc)"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    <div className="h-px w-full bg-[#233648]/60" />

                    <div className="bg-[#111a22]/50 px-6 py-4">
                        <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-semibold font-heading uppercase tracking-wider text-gray-400">
                                Suggested Actions
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {suggestedActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleAddAction(action.text)}
                                    className="flex items-center gap-2 rounded-full border border-[#233648]/60 bg-[#141f2b]/60 px-4 py-2 text-sm font-medium text-slate-300 hover:border-primary hover:text-white transition-all shadow-sm cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">
                                        {action.icon}
                                    </span>
                                    {action.text}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-2 bg-[#0d141b] border-t border-[#233648]/60 text-[10px] text-gray-500">
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="font-sans px-1.5 py-0.5 rounded bg-[#141f2b]/60 border border-[#233648]/60">
                                    ↵
                                </kbd>{" "}
                                to select
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="font-sans px-1.5 py-0.5 rounded bg-[#141f2b]/60 border border-[#233648]/60">
                                    esc
                                </kbd>{" "}
                                to close
                            </span>
                        </div>
                        <button
                            onClick={onNextTurn}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141f2b]/60 border border-[#233648]/60 hover:border-white/20 text-gray-400 hover:text-white text-xs font-medium font-heading transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[14px]">timelapse</span>
                            Next Turn
                        </button>
                    </div>
                </div>

                {/* Taken Actions History */}
                {takenActions.length > 0 && (
                    <div className="w-full">
                        <h4 className="text-xs font-semibold font-heading uppercase tracking-wider text-gray-400 mb-2 pl-2">
                            Taken Actions
                        </h4>
                        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                            {takenActions.map((action) => (
                                <div
                                    key={action.id}
                                    className="group bg-[#141f2b]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#233648]/60 shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300 hover:border-primary/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <span className="material-symbols-outlined text-[16px]">
                                                check
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {action.text}
                                            </p>
                                            <p className="text-[10px] text-gray-500">
                                                {action.timestamp.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold bg-[#111a22] text-gray-500 px-2 py-1 rounded">
                                            PROCESSING
                                        </span>
                                        <button
                                            onClick={() => onDeleteAction(action.id)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                                            title="Delete action"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
