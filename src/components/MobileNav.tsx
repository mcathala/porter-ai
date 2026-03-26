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
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden items-center justify-around glass-nav border-t border-white/[0.05] px-2 py-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const comingSoon = "comingSoon" in item && item.comingSoon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-all active:scale-95 transition-transform duration-150 ${
                            isActive
                                ? "text-primary"
                                : "text-white/40"
                        }`}
                    >
                        <span className={`material-symbols-outlined text-[22px] ${isActive ? "text-primary" : ""}`}>
                            {item.icon}
                        </span>
                        {pathname === item.href && <div className="w-1 h-1 rounded-full bg-primary" />}
                        <div className="flex items-center gap-1">
                            <span className="text-[11px] font-medium font-heading">{item.label}</span>
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
