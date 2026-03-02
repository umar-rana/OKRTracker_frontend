"use client";

import { Search, User, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { NotificationCenter } from "./NotificationCenter";

export function Header() {
    const { toggleNav } = useUIStore();

    return (
        <header className="h-12 border-b bg-white flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleNav}
                    className="p-1 hover:bg-gray-100 rounded-md lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">
                        T
                    </div>
                    <span className="font-bold text-lg tracking-tight">Trackr</span>
                </div>
            </div>

            <div className="flex-1 max-w-xl px-8 hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search objectives, KRs, or teams..."
                        className="w-full h-8 bg-gray-50 border border-transparent rounded-md pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:border-primary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <NotificationCenter />
                <div className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center text-gray-500 hover:border-primary cursor-pointer transition-colors overflow-hidden">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
}
