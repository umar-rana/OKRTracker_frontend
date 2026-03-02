"use client";

import { useUIStore } from "@/store/ui";
import { useOKRStore } from "@/store/okr";
import { cn } from "@/lib/utils";
import { X, History, ShieldAlert, Trophy, FileText, Calendar, User, Info } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../ui/custom-badges";
import { Objective, KeyResult } from "@/types";

export function SidePanel() {
    const { isSidePanelOpen, setSidePanelOpen } = useUIStore();
    const { selectedItem, history, risks, accomplishments, objectives } = useOKRStore();
    const [activeTab, setActiveTab] = useState<'history' | 'risks' | 'accomplishments' | 'details'>('details');

    if (!isSidePanelOpen || !selectedItem) return null;

    let displayItem: (Objective | KeyResult | null) = null;
    if (selectedItem.type === 'kr') {
        for (const obj of objectives) {
            const kr = obj.key_results?.find(k => k.id === selectedItem.id);
            if (kr) {
                displayItem = kr;
                break;
            }
        }
    } else {
        displayItem = objectives.find(o => o.id === selectedItem.id) || null;
    }

    const tabs = [
        { id: 'details', label: 'Details', icon: Info },
        { id: 'history', label: 'History', icon: History },
        { id: 'risks', label: 'Risks', icon: ShieldAlert },
        { id: 'accomplishments', label: 'Victories', icon: Trophy },
    ];

    const isKeyResult = (item: Objective | KeyResult): item is KeyResult => {
        return 'objective' in item;
    };

    return (
        <aside
            className={cn(
                "fixed lg:relative inset-y-0 right-0 h-full bg-white border-l shadow-xl lg:shadow-none transition-all duration-300 ease-in-out z-50 overflow-hidden",
                isSidePanelOpen ? "w-[450px] translate-x-0" : "w-0 translate-x-full lg:translate-x-0"
            )}
        >
            <div className="w-[450px] h-full flex flex-col">
                <header className="h-12 border-b flex items-center justify-between px-4 shrink-0 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            {selectedItem?.type === 'kr' ? 'Key Result' : 'Objective'}
                        </span>
                    </div>
                    <button
                        onClick={() => setSidePanelOpen(false)}
                        className="p-1 hover:bg-gray-200 rounded-md text-gray-400 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </header>

                {displayItem ? (
                    <>
                        <div className="p-6 border-b bg-white">
                            <h2 className="text-xl font-bold text-text-primary leading-tight mb-3">
                                {displayItem.title}
                            </h2>
                            <div className="flex flex-wrap gap-3 items-center">
                                <StatusBadge>
                                    {isKeyResult(displayItem) ? displayItem.rag_status : displayItem.status}
                                </StatusBadge>
                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <User size={14} />
                                    <span>
                                        {isKeyResult(displayItem)
                                            ? (displayItem as any).owner_details?.first_name || 'Unassigned'
                                            : displayItem.owner_details?.first_name || 'Unassigned'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <Calendar size={14} />
                                    <span>Due {new Date(displayItem.due_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b bg-gray-50/30">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "flex-1 py-3 text-[11px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-colors border-b-2",
                                        activeTab === tab.id
                                            ? "border-primary text-primary bg-white"
                                            : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
                                    )}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-auto p-6 bg-white">
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Description</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            {displayItem.description || "No description provided."}
                                        </p>
                                    </div>
                                    {isKeyResult(displayItem) && (
                                        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-surface">
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-gray-400">Current Value</span>
                                                <span className="text-lg font-mono font-bold text-primary">{displayItem.current_value}{displayItem.unit}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-gray-400">Target</span>
                                                <span className="text-lg font-mono font-bold text-text-primary">{displayItem.target_value}{displayItem.unit}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-6">
                                    {history.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <History size={24} />
                                            </div>
                                            <p className="text-sm">No update history yet.</p>
                                        </div>
                                    ) : (
                                        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                            {history.map((entry: any) => (
                                                <div key={entry.id} className="relative">
                                                    <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-white border-2 border-primary" />
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-text-primary">
                                                            {entry.new_value ? `Value updated to ${entry.new_value}` : 'State changed'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {new Date(entry.recorded_at || entry.performed_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {entry.new_rag_status && <StatusBadge className="scale-75 origin-left">{entry.new_rag_status}</StatusBadge>}
                                                        <span className="text-[10px] text-text-secondary">by {entry.updated_by_details?.first_name || entry.performed_by_details?.first_name}</span>
                                                    </div>
                                                    {entry.note && (
                                                        <p className="text-xs text-text-secondary italic bg-gray-50 p-2 rounded">
                                                            "{entry.note}"
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'risks' && (
                                <div className="space-y-4">
                                    {risks.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <ShieldAlert size={40} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm">No active risks or blockers identified.</p>
                                        </div>
                                    ) : (
                                        risks.map((risk: any) => (
                                            <div key={risk.id} className="p-3 border rounded-md hover:border-rag-red/30 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-bold text-text-primary">{risk.title}</h4>
                                                    <StatusBadge className="scale-90">{risk.impact}</StatusBadge>
                                                </div>
                                                <p className="text-xs text-text-secondary mb-2 line-clamp-2">{risk.description}</p>
                                                <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                    <span>Owner: {risk.owner_details?.first_name}</span>
                                                    <span>{risk.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'accomplishments' && (
                                <div className="space-y-4">
                                    {accomplishments.length === 0 ? (
                                        <div className="text-center py-12 text-gray-400">
                                            <Trophy size={40} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm">No accomplishments logged yet.</p>
                                        </div>
                                    ) : (
                                        accomplishments.map((acc: any) => (
                                            <div key={acc.id} className="p-3 border-b last:border-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-text-primary">{acc.title}</span>
                                                    <span className="text-[10px] text-gray-400">{new Date(acc.date || acc.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-text-secondary">{acc.description}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <footer className="h-12 border-t p-2 bg-gray-50 flex items-center justify-center gap-2">
                            <button className="flex-1 h-8 text-[11px] font-bold uppercase bg-white border hover:bg-gray-100 rounded transition-colors">
                                Add Comment
                            </button>
                            <button className="flex-1 h-8 text-[11px] font-bold uppercase bg-primary text-white hover:bg-primary-hover rounded transition-colors">
                                Update Progress
                            </button>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400 gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed">
                            <FileText size={32} className="opacity-20" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-primary">No Selection</p>
                            <p className="text-xs">Select an Objective or Key Result to view its full history and management details.</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
