"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/dashboard/stakeholders", icon: "handshake", label: "Stakeholders", comingSoon: true },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden items-center justify-around border-t border-[#233648] bg-[#111a22]/95 backdrop-blur-md px-2 py-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const comingSoon = "comingSoon" in item && item.comingSoon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
                            isActive
                                ? "text-primary"
                                : "text-[#92adc9]"
                        }`}
                    >
                        <span className={`material-symbols-outlined text-[22px] ${isActive ? "text-primary" : ""}`}>
                            {item.icon}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-medium">{item.label}</span>
                            {comingSoon && (
                                <span className="text-[8px] font-semibold text-yellow-400">*</span>
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
