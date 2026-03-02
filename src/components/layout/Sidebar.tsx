"use client";

import {
    BarChart3,
    LayoutGrid,
    Users,
    Target,
    ShieldAlert,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { icon: LayoutGrid, label: "OKR Grid", href: "/" },
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Target, label: "Objectives", href: "/objectives" },
    { icon: Users, label: "Teams", href: "/teams" },
    { icon: ShieldAlert, label: "Risks", href: "/risks" },
    { icon: Settings, label: "Settings", href: "/settings/email" },
];

export function Sidebar() {
    const { isNavCollapsed, toggleNav } = useUIStore();
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "bg-white border-r flex flex-col transition-all duration-300 ease-in-out z-40 relative group/sidebar",
                isNavCollapsed ? "w-[56px]" : "w-[220px]"
            )}
        >
            <nav className="flex-1 py-4 flex flex-col gap-1.5 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            title={isNavCollapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 h-10 rounded-md transition-all group overflow-hidden whitespace-nowrap",
                                isActive
                                    ? "bg-primary text-white font-bold shadow-md shadow-blue-100"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                            )}
                        >
                            <item.icon size={20} className={cn("shrink-0", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                            <span className={cn(
                                "text-sm tracking-tight transition-opacity duration-300",
                                isNavCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-2 border-t mt-auto">
                <button
                    onClick={toggleNav}
                    className="w-full flex items-center justify-center h-10 hover:bg-gray-50 rounded-md text-gray-400 hover:text-primary transition-all border border-transparent hover:border-gray-100 shadow-sm sm:shadow-none"
                >
                    {isNavCollapsed ? <ChevronRight size={18} /> : (
                        <div className="flex items-center gap-2">
                            <ChevronLeft size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Collapse</span>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
}
