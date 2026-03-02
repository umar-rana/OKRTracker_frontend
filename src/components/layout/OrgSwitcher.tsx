"use client";

import { useAuthStore } from "@/store/auth";
import { ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function OrgSwitcher() {
    const { memberships, activeOrganizationId, switchOrganization } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    const activeOrg = memberships.find(m => m.organization === activeOrganizationId);

    if (memberships.length <= 1 && !activeOrg) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-md transition-colors text-white"
            >
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center shrink-0">
                    <Building2 size={14} />
                </div>
                <span className="text-sm font-semibold truncate max-w-[150px]">
                    {activeOrg?.organization_name || "Select Organization"}
                </span>
                <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 top-full mt-1 w-64 bg-white border shadow-lg rounded-md z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Your Organizations
                        </div>
                        {memberships.map((m) => (
                            <button
                                key={m.organization}
                                onClick={() => {
                                    switchOrganization(m.organization);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors",
                                    m.organization === activeOrganizationId ? "bg-blue-50 text-primary font-medium" : "text-gray-700"
                                )}
                            >
                                <Building2 size={16} className={m.organization === activeOrganizationId ? "text-primary" : "text-gray-400"} />
                                <span>{m.organization_name}</span>
                                {m.organization === activeOrganizationId && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
