"use client";

import { useUIStore } from "@/store/ui";
import { useOKRStore } from "@/store/okr";
import { cn } from "@/lib/utils";
import { X, History, ShieldAlert, Trophy, FileText, Calendar, User, Info, MessageSquare, Gavel } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../ui/custom-badges";
import { Objective, KeyResult } from "@/types";

export function SidePanel() {
    const { isSidePanelOpen, setSidePanelOpen } = useUIStore();
    const { selectedItem, history, risks, accomplishments, decisions, objectives } = useOKRStore();
    const [activeTab, setActiveTab] = useState<'details' | 'history' | 'risks' | 'accomplishments' | 'decisions'>('details');

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
        { id: 'details', label: 'Overview', icon: Info },
        { id: 'history', label: 'History', icon: History },
        { id: 'risks', label: 'Risks', icon: ShieldAlert },
        { id: 'accomplishments', label: 'Accomplishments', icon: Trophy },
        { id: 'decisions', label: 'Decisions', icon: Gavel },
    ];

    const isKeyResult = (item: Objective | KeyResult): item is KeyResult => {
        return 'objective' in item;
    };

    return (
        <aside
            className={cn(
                "fixed lg:relative inset-y-0 right-0 h-full bg-white border-l shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out z-50 overflow-hidden",
                isSidePanelOpen ? "w-[450px] translate-x-0" : "w-0 translate-x-full lg:translate-x-0"
            )}
        >
            <div className="w-[450px] h-full flex flex-col bg-white">
                <header className="h-14 border-b flex items-center justify-between px-6 shrink-0 bg-gray-50/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-2 h-2 rounded-full animate-pulse",
                            selectedItem.type === 'kr' ? "bg-amber-500" : "bg-blue-500"
                        )} />
                        <span className="text-[11px] font-black uppercase text-gray-500 tracking-[0.2em]">
                            {selectedItem?.type === 'kr' ? 'Key Result Detail' : 'Objective Detail'}
                        </span>
                    </div>
                    <button
                        onClick={() => setSidePanelOpen(false)}
                        className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-900 transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </header>

                {displayItem ? (
                    <>
                        <div className="p-8 border-b bg-gradient-to-b from-white to-gray-50/30">
                            <h2 className="text-2xl font-black text-text-primary leading-tight mb-4 tracking-tight">
                                {displayItem.title}
                            </h2>
                            <div className="flex flex-wrap gap-4 items-center">
                                <StatusBadge className="h-6 px-3 text-[10px] font-bold">
                                    {isKeyResult(displayItem) ? displayItem.rag_status : displayItem.status}
                                </StatusBadge>

                                <div className="h-4 w-px bg-gray-200" />

                                <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 uppercase text-[10px]">
                                        {(isKeyResult(displayItem)
                                            ? (displayItem as any).owner_details?.first_name?.[0]
                                            : displayItem.owner_details?.first_name?.[0]) || 'U'}
                                    </div>
                                    <span>
                                        {isKeyResult(displayItem)
                                            ? (displayItem as any).owner_details?.first_name || 'Unassigned'
                                            : displayItem.owner_details?.first_name || 'Unassigned'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>Due {new Date(displayItem.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex px-2 bg-white border-b sticky top-0 z-10 shadow-sm shadow-black/[0.02]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 relative",
                                        activeTab === tab.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute inset-x-0 -bottom-[2px] h-[2px] bg-primary rounded-full animate-in fade-in slide-in-from-bottom-1" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-50/20 p-8 custom-scrollbar">
                            {activeTab === 'details' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <section>
                                        <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4">Strategic Description</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed font-medium bg-white p-5 rounded-xl border-dashed border-2 border-gray-100">
                                            {displayItem.description || "No description provided for this item."}
                                        </p>
                                    </section>

                                    {isKeyResult(displayItem) && (
                                        <section className="bg-primary text-white p-6 rounded-2xl shadow-xl shadow-blue-900/10">
                                            <h3 className="text-[10px] font-black uppercase text-white/60 tracking-[0.22em] mb-4">Current Progress</h3>
                                            <div className="flex items-end gap-3 mb-6">
                                                <span className="text-4xl font-black tracking-tighter">{displayItem.current_value}</span>
                                                <span className="text-lg font-bold text-white/50 mb-1">{displayItem.unit}</span>
                                                <span className="text-sm font-medium text-white/40 mb-1.5 ml-auto">Target: {displayItem.target_value}{displayItem.unit}</span>
                                            </div>
                                            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                                    style={{ width: `${Math.min(100, (displayItem.current_value / displayItem.target_value) * 100)}%` }}
                                                />
                                            </div>
                                        </section>
                                    )}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {history.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <History size={48} className="mx-auto mb-4 opacity-10" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No activity logged</p>
                                        </div>
                                    ) : (
                                        <div className="relative pl-8 space-y-10 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-gray-100 before:to-transparent">
                                            {history.map((entry: any) => (
                                                <div key={entry.id} className="relative group/item">
                                                    <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-primary shadow-sm z-10 group-hover/item:scale-125 transition-transform" />

                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                                            {new Date(entry.recorded_at || entry.performed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {entry.new_rag_status && <StatusBadge className="scale-75 origin-right">{entry.new_rag_status}</StatusBadge>}
                                                    </div>

                                                    <div className="bg-white p-4 rounded-xl border shadow-sm group-hover/item:border-primary/30 transition-all">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-black uppercase text-gray-500">
                                                                {entry.updated_by_details?.first_name?.[0] || 'A'}
                                                            </div>
                                                            <span className="text-xs font-black text-text-primary">
                                                                {entry.updated_by_details?.first_name || 'System'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-medium">
                                                                {entry.action || (entry.new_value ? 'updated progress' : 'modified details')}
                                                            </span>
                                                        </div>

                                                        {entry.new_value && (
                                                            <div className="flex items-center gap-4 py-2 border-y border-gray-50 mb-3 font-mono">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] uppercase text-gray-400 font-bold">Previous</span>
                                                                    <span className="text-xs text-gray-500 line-through decoration-red-400/50">{entry.previous_value}</span>
                                                                </div>
                                                                <div className="text-gray-300">→</div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] uppercase text-gray-400 font-bold">New Value</span>
                                                                    <span className="text-sm text-primary font-black">{entry.new_value}</span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {entry.note && (
                                                            <div className="flex gap-2">
                                                                <MessageSquare size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                                                <p className="text-xs text-text-secondary italic leading-relaxed">
                                                                    "{entry.note}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'risks' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {risks.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <ShieldAlert size={48} className="mx-auto mb-4 opacity-5 text-red-500" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No risks identified</p>
                                        </div>
                                    ) : (
                                        risks.map((risk: any) => (
                                            <div key={risk.id} className={cn(
                                                "p-5 bg-white rounded-2xl border-2 transition-all hover:shadow-lg",
                                                risk.impact === 'high' || risk.rag_status === 'red' ? "border-red-100 hover:border-red-200" : "border-gray-100 hover:border-gray-200"
                                            )}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="text-base font-black text-text-primary tracking-tight">{risk.title}</h4>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                        risk.impact === 'high' ? "bg-red-50 text-red-500 border-red-100" : "bg-gray-50 text-gray-500 border-gray-100"
                                                    )}>
                                                        {risk.impact} Impact
                                                    </span>
                                                </div>
                                                <p className="text-xs text-text-secondary leading-relaxed mb-4">{risk.description}</p>
                                                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold uppercase text-gray-400">
                                                            {risk.owner_details?.first_name?.[0] || 'U'}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-500">Owner: {risk.owner_details?.first_name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", risk.status === 'open' ? 'bg-red-400 animate-pulse' : 'bg-green-400')} />
                                                        <span className="text-[10px] font-black uppercase text-gray-400">{risk.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'accomplishments' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {accomplishments.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <Trophy size={48} className="mx-auto mb-4 opacity-10 text-emerald-500" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No victories yet</p>
                                        </div>
                                    ) : (
                                        accomplishments.map((acc: any) => (
                                            <div key={acc.id} className="p-5 bg-white rounded-2xl border-2 border-emerald-50/50 hover:border-emerald-100 transition-all hover:shadow-xl hover:shadow-emerald-900/[0.03]">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-xs font-black text-emerald-600 tracking-tight">{acc.title}</span>
                                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">{new Date(acc.date || acc.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <p className="text-xs text-text-secondary leading-relaxed">{acc.description}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'decisions' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {decisions.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                            <Gavel size={48} className="mx-auto mb-4 opacity-10 text-blue-500" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No decisions recorded</p>
                                        </div>
                                    ) : (
                                        decisions.map((dec: any) => (
                                            <div key={dec.id} className="p-5 bg-white rounded-2xl border-2 border-blue-50 hover:border-blue-100 transition-all">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="text-sm font-black text-text-primary tracking-tight">{dec.title}</h4>
                                                    <StatusBadge className="scale-75 origin-right">{dec.status}</StatusBadge>
                                                </div>
                                                <p className="text-xs text-text-secondary leading-relaxed mb-4">{dec.description}</p>
                                                {dec.resolution && (
                                                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 mt-2">
                                                        <span className="text-[9px] font-black uppercase text-blue-600 tracking-[0.15em] block mb-1">Resolution</span>
                                                        <p className="text-xs font-bold text-blue-800">{dec.resolution}</p>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Owner: {dec.decision_owner_details?.first_name}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{new Date(dec.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <footer className="h-20 border-t p-6 bg-white flex items-center justify-center gap-4 shrink-0">
                            <button className="flex-[0.4] h-10 text-[10px] font-black uppercase tracking-widest bg-white border-2 border-gray-100 hover:border-gray-200 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                                <MessageSquare size={14} />
                                Comment
                            </button>
                            <button className="flex-1 h-10 text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary-hover rounded-xl shadow-lg shadow-blue-700/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <History size={14} />
                                Update Progress
                            </button>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-gray-400 gap-6 animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed border-gray-100 rotate-12 group-hover:rotate-0 transition-transform">
                            <FileText size={48} className="opacity-10" />
                        </div>
                        <div className="max-w-[240px]">
                            <p className="text-lg font-black text-text-primary tracking-tight mb-2">Detailed Context</p>
                            <p className="text-xs leading-relaxed font-medium">Select an Objective or Key Result from the grid to unlock full management details, risks, and history.</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
