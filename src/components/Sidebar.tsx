"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
        { href: "/dashboard/stakeholders", icon: "handshake", label: "Stakeholders" },
    ];

    return (
        <aside
            className={`flex flex-col border-r border-[#233648] bg-[#111a22] flex-shrink-0 z-20 transition-all duration-300 ease-in-out ${isCollapsed ? "w-[72px]" : "w-64"
                } hidden md:flex h-full`}
        >
            <div className="flex flex-col h-full p-4">
                {/* Logo & Collapse Toggle */}
                <div
                    className={`flex items-center mb-8 ${isCollapsed ? "justify-center" : "justify-between px-2"
                        }`}
                >
                    <div
                        className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <div className="bg-primary/20 flex items-center justify-center rounded-lg size-10 flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-[24px]">
                                rocket_launch
                            </span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <h1 className="text-white text-base font-bold leading-tight">
                                    PorterAi
                                </h1>
                                <p className="text-[#92adc9] text-xs font-normal">
                                    CEO Cockpit
                                </p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="p-1.5 rounded-md text-[#92adc9] hover:text-white hover:bg-[#233648] transition-colors"
                            title="Collapse sidebar"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                chevron_left
                            </span>
                        </button>
                    )}
                </div>

                {/* Expand button when collapsed */}
                {isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="mb-4 p-2 rounded-lg text-[#92adc9] hover:text-white hover:bg-[#233648] transition-colors flex items-center justify-center"
                        title="Expand sidebar"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            chevron_right
                        </span>
                    </button>
                )}

                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isCollapsed ? "justify-center" : ""
                                    } ${isActive
                                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                                        : "text-[#92adc9] hover:bg-[#233648] hover:text-white"
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] ${isActive ? "" : "group-hover:text-primary transition-colors"}`}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <span className="text-sm font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
