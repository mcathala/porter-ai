"use client";

import { useState } from "react";

// Types
type MoodType = "anxious" | "neutral" | "happy" | "angry";

interface Stakeholder {
    id: string;
    name: string;
    role?: string;
    lastMessage: string;
    timestamp: string;
    mood: MoodType;
    isAlert?: boolean;
    isActive?: boolean;
}

interface ChatMessage {
    id: string;
    type: "stakeholder" | "player" | "system";
    sender?: string;
    timestamp: string;
    content: string;
    isAlert?: boolean;
}

// Data
const stakeholders: Stakeholder[] = [
    {
        id: "investor",
        name: "Lead Investor",
        role: "Series A Lead",
        lastMessage: "Current Burn Rate is unsust...",
        timestamp: "NOW",
        mood: "anxious",
        isAlert: true,
    },
    {
        id: "board",
        name: "Board of Directors",
        lastMessage: "Quarterly review scheduled.",
        timestamp: "2h ago",
        mood: "neutral",
    },
    {
        id: "cmo",
        name: "CMO",
        lastMessage: "New campaign metrics are up!",
        timestamp: "1d ago",
        mood: "happy",
    },
    {
        id: "supplier",
        name: "Key Supplier",
        lastMessage: "Inventory shipment delayed.",
        timestamp: "",
        mood: "neutral",
    },
];

const messages: ChatMessage[] = [
    {
        id: "1",
        type: "stakeholder",
        sender: "Lead Investor",
        timestamp: "10:24 AM",
        content:
            "I'm looking at the Q3 projections sent over this morning. Frankly, the numbers are alarming.",
    },
    {
        id: "2",
        type: "player",
        sender: "You",
        timestamp: "10:26 AM",
        content:
            "We are aware of the burn rate increase. It's largely attributed to the R&D push for the new model training.",
    },
    {
        id: "3",
        type: "system",
        timestamp: "",
        content: "Current Burn Rate: $120k/mo - ALERT: Sustainable for 4 months only.",
        isAlert: true,
    },
    {
        id: "4",
        type: "stakeholder",
        sender: "Lead Investor",
        timestamp: "Just now",
        content:
            "R&D is fine, but not if we run out of cash before Series B. That burn rate is unsustainable. We need to cut costs or pivot immediately.\n\nWhat is your plan to extend the runway before the next board meeting?",
    },
];

const moodConfig: Record<
    MoodType,
    { icon: string; color: string; label: string }
> = {
    anxious: {
        icon: "warning",
        color: "text-amber-500",
        label: "Anxious - ALERT",
    },
    neutral: { icon: "", color: "text-slate-500", label: "Neutral" },
    happy: {
        icon: "sentiment_satisfied",
        color: "text-green-500",
        label: "Happy",
    },
    angry: {
        icon: "sentiment_dissatisfied",
        color: "text-red-500",
        label: "Angry",
    },
};

export default function StakeholdersPage() {
    const [activeStakeholderId, setActiveStakeholderId] = useState("investor");
    const [searchQuery, setSearchQuery] = useState("");
    const [showChat, setShowChat] = useState(false);

    const activeStakeholder =
        stakeholders.find((s) => s.id === activeStakeholderId) || stakeholders[0];

    const filteredStakeholders = stakeholders.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectStakeholder = (id: string) => {
        setActiveStakeholderId(id);
        setShowChat(true);
    };

    return (
        <div className="flex h-full w-full overflow-hidden relative">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 z-20 bg-[#101922]/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center px-8 py-8 rounded-2xl bg-[#111a22]/90 border border-[#233648]">
                    <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
                        <span className="material-symbols-outlined text-yellow-400 text-5xl">construction</span>
                    </div>
                    <h2 className="text-white text-2xl font-bold font-heading tracking-[-0.02em]">Coming Soon</h2>
                    <p className="text-[#92adc9] text-sm max-w-xs">
                        Stakeholder interactions are currently under development. Stay tuned!
                    </p>
                </div>
            </div>

            {/* Secondary Sidebar - Stakeholder List */}
            <aside className={`${showChat ? "hidden md:flex" : "flex"} w-full md:w-72 flex-col border-r border-[#233648] bg-[#111a22] shrink-0 z-10`}>
                {/* Search */}
                <div className="px-4 py-[18px] border-b border-[#233648]">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-[20px]">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter stakeholders..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1a2632] border border-[#233648] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <h3 className="px-1 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Priority Contacts
                    </h3>

                    {filteredStakeholders.map((stakeholder) => {
                        const isActive = stakeholder.id === activeStakeholderId;
                        const mood = moodConfig[stakeholder.mood];

                        return (
                            <div
                                key={stakeholder.id}
                                onClick={() => handleSelectStakeholder(stakeholder.id)}
                                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isActive
                                        ? "bg-[#1f2d3b] border-primary shadow-sm ring-1 ring-primary/20"
                                        : "bg-[#111a22] border-[#233648] hover:border-primary/50"
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative">
                                    <div
                                        className={`size-11 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold ${!isActive && "opacity-80"
                                            }`}
                                    >
                                        {stakeholder.name.charAt(0)}
                                    </div>
                                    {stakeholder.mood !== "neutral" && (
                                        <div className="absolute -bottom-1 -right-1 bg-[#1a2632] rounded-full p-0.5 border border-[#233648]">
                                            <span
                                                className={`material-symbols-outlined text-[14px] ${mood.color}`}
                                            >
                                                {mood.icon}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p
                                            className={`text-sm truncate ${isActive
                                                    ? "text-white font-bold"
                                                    : "text-slate-300 font-medium"
                                                }`}
                                        >
                                            {stakeholder.name}
                                        </p>
                                        {stakeholder.timestamp && (
                                            <span
                                                className={`text-[10px] ${stakeholder.timestamp === "NOW"
                                                        ? "font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                {stakeholder.timestamp}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-xs truncate">
                                        {stakeholder.lastMessage}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div
                                            className={`h-1.5 w-1.5 rounded-full ${mood.color.replace(
                                                "text-",
                                                "bg-"
                                            )}`}
                                        />
                                        <span className={`text-[10px] ${mood.color} font-medium`}>
                                            {mood.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Chat Area */}
            <section className={`${showChat ? "flex" : "hidden md:flex"} flex-col flex-1 min-h-0 bg-[#0f1a24] relative`}>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#233648] bg-[#111a22]">
                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* Back button on mobile */}
                        <button
                            onClick={() => setShowChat(false)}
                            className="flex md:hidden items-center justify-center p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                        </button>
                        <div className="size-9 sm:size-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 ring-2 ring-amber-500/50 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {activeStakeholder.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-bold font-heading text-white leading-none">
                                {activeStakeholder.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400">
                                    {activeStakeholder.role || "Stakeholder"}
                                </span>
                                <span className="h-1 w-1 bg-slate-400 rounded-full" />
                                <span className="text-xs font-bold text-amber-500">
                                    High Pressure
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
                            title="History"
                        >
                            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">history</span>
                        </button>
                        <button
                            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
                            title="Profile"
                        >
                            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">info</span>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scroll-smooth">
                    {/* Date Separator */}
                    <div className="flex justify-center">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest bg-[#1f2d3b] px-3 py-1 rounded-full">
                            Today, 10:23 AM
                        </span>
                    </div>

                    {messages.map((message) => {
                        if (message.type === "system") {
                            return (
                                <div key={message.id} className="flex justify-center w-full">
                                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
                                        <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                                            trending_down
                                        </span>
                                        <span className="text-center">{message.content}</span>
                                    </div>
                                </div>
                            );
                        }

                        const isPlayer = message.type === "player";

                        return (
                            <div
                                key={message.id}
                                className={`flex gap-3 sm:gap-4 max-w-3xl ${isPlayer ? "flex-row-reverse ml-auto" : ""
                                    }`}
                            >
                                <div className="size-8 sm:size-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shrink-0 mt-1 text-sm sm:text-base">
                                    {message.sender?.charAt(0) || "?"}
                                </div>
                                <div
                                    className={`flex flex-col gap-1 ${isPlayer ? "items-end" : ""
                                        }`}
                                >
                                    <div
                                        className={`flex items-baseline gap-2 ${isPlayer ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <span className="text-sm font-bold text-slate-200">
                                            {message.sender}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {message.timestamp}
                                        </span>
                                    </div>
                                    <div
                                        className={`p-3 sm:p-4 shadow-sm leading-relaxed text-sm sm:text-base ${isPlayer
                                                ? "bg-primary text-white rounded-2xl rounded-tr-none"
                                                : "bg-[#1f2d3b] border border-[#233648] rounded-2xl rounded-tl-none text-slate-100"
                                            }`}
                                    >
                                        <p className="whitespace-pre-line">{message.content}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message Input */}
                <div className="shrink-0 p-3 sm:p-4 border-t border-[#233648] bg-[#111a22]">
                    <div className="flex items-end gap-2 sm:gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                placeholder="Type your response..."
                                rows={1}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a2632] border border-[#233648] rounded-xl text-sm sm:text-base text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                                }}
                            />
                        </div>
                        <button className="flex items-center justify-center size-10 sm:size-12 bg-primary hover:bg-blue-600 text-white rounded-xl transition-colors shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[20px] sm:text-[24px]">send</span>
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 px-1 hidden sm:block">
                        Your response will influence stakeholder sentiment
                    </p>
                </div>
            </section>
        </div>
    );
}
