"use client";

import { Search, User, Menu } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { NotificationCenter } from "./NotificationCenter";
import { OrgSwitcher } from "./OrgSwitcher";
import { useState } from "react";
import { CreateObjectiveModal } from "../okr/CreateObjectiveModal";

export function Header() {
    const { toggleNav } = useUIStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <header className="h-14 bg-primary text-white flex items-center justify-between px-4 z-50 shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-xl italic shadow-inner">
                        T
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">Trackr</span>
                </div>

                <div className="h-6 w-px bg-white/20" />

                <OrgSwitcher />
            </div>

            <div className="flex-1 max-w-2xl px-8 hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search objectives, KRs, or teams..."
                        className="w-full h-9 bg-white/10 border border-transparent rounded-md pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="hidden lg:flex items-center gap-2 bg-white text-primary px-4 h-9 rounded-md text-sm font-bold shadow-sm hover:bg-blue-50 transition-all active:scale-95"
                >
                    Add Objective
                </button>

                <div className="h-6 w-px bg-white/20 hidden lg:block" />

                <NotificationCenter />
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer transition-all overflow-hidden active:scale-95">
                    <User size={20} />
                </div>
            </div>

            <CreateObjectiveModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </header>
    );
}
