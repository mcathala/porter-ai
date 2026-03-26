"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useGame } from "@/context/GameContext";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { gameState } = useGame();

    const navItems = [
        { href: "/dashboard", icon: "space_dashboard", label: "Dashboard" },
        { href: "/dashboard/stakeholders", icon: "forum", label: "Stakeholders" },
    ];

    return (
        <aside
            className={`flex flex-col border-r border-white/[0.05] bg-[#0a0f14]/60 backdrop-blur-2xl flex-shrink-0 z-20 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[68px]" : "w-60"
                } hidden md:flex h-full`}
        >
            <div className="flex flex-col h-full">
                {/* Company identity — not generic logo */}
                <div className={`flex items-center ${isCollapsed ? "justify-center p-4" : "justify-between px-5 pr-3"} pt-5 pb-4`}>
                    <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? "justify-center" : ""}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary text-sm font-bold font-heading">
                                {gameState.playerCompany.name?.[0] || "P"}
                            </span>
                        </div>
                        {!isCollapsed && (
                            <div className="min-w-0">
                                <h1 className="text-white text-[13px] font-semibold leading-tight truncate">
                                    {gameState.playerCompany.name || "porter.ai"}
                                </h1>
                                <p className="text-white/30 text-[11px] truncate">
                                    {gameState.currentDate || "Simulation"}
                                </p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="p-1 rounded-md text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all"
                            title="Collapse"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                chevron_left
                            </span>
                        </button>
                    )}
                </div>

                {/* Thin divider */}
                <div className="mx-4 h-px bg-white/[0.04]" />

                {/* Navigation */}
                <nav className="flex flex-col gap-1 p-3 flex-1">
                    {isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="mb-2 p-2 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all flex items-center justify-center"
                            title="Expand"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                chevron_right
                            </span>
                        </button>
                    )}
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : undefined}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group ${isCollapsed ? "justify-center" : ""
                                    } ${isActive
                                        ? "bg-white/[0.06] text-white"
                                        : "text-white/40 hover:bg-white/[0.04] hover:text-white/70"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "group-hover:text-white/60 transition-colors"}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <span className="text-[13px] font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom — porter.ai branding, subtle */}
                {!isCollapsed && (
                    <div className="px-5 pb-4 pt-2">
                        <div className="flex items-center gap-2 text-white/15">
                            <span className="text-[11px] font-medium tracking-[-0.02em]">porter.ai</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
