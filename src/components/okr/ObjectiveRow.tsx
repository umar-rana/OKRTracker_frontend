import { Objective } from "@/types";
import { KeyResultRow } from "./KeyResultRow";
import { ChevronDown, ChevronRight, Target, MoreHorizontal, Send, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { StatusBadge, PriorityBadge } from "../ui/custom-badges";
import { cn } from "@/lib/utils";
import { useOKRStore } from "@/store/okr";
import { useUIStore } from "@/store/ui";
import { EditableCell } from "../ui/EditableCell";
import { CreateKRModal } from "./CreateKRModal";

interface ObjectiveRowProps {
    objective: Objective;
}

export function ObjectiveRow({ objective }: ObjectiveRowProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const setSidePanelOpen = useUIStore((state) => state.setSidePanelOpen);
    const setSelectedItem = useOKRStore((state) => state.setSelectedItem);
    const updateObjective = useOKRStore((state) => state.updateObjective);
    const deleteObjective = useOKRStore((state) => state.deleteObjective);
    const [isCreateKRModalOpen, setIsCreateKRModalOpen] = useState(false);

    const handleRowClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('select') || (e.target as HTMLElement).closest('.menu-container')) return;

        setSelectedItem({ type: 'objective', id: objective.id });
        setSidePanelOpen(true);
    };

    const handleUpdateField = async (field: string, value: any) => {
        await updateObjective(objective.id, { [field]: value });
    };

    return (
        <div className="border-b last:border-0">
            <div
                onClick={handleRowClick}
                className={cn(
                    "grid grid-cols-[1fr_100px_120px_100px_140px_100px_100px_40px] gap-2 px-4 h-11 items-center transition-all cursor-pointer border-b group",
                    objective.status === 'archived' ? "bg-gray-50" : "bg-blue-50/40 hover:bg-blue-50"
                )}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-1 hover:bg-white/50 rounded text-gray-400 hover:text-primary transition-all shrink-0"
                    >
                        {isExpanded ? <ChevronDown size={14} className="animate-in fade-in" /> : <ChevronRight size={14} />}
                    </button>
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center shrink-0 shadow-sm border border-primary/5">
                        <Target size={12} strokeWidth={2.5} />
                    </div>
                    <EditableCell
                        rowId={objective.id}
                        field="title"
                        initialValue={objective.title}
                        onSave={(val) => handleUpdateField('title', val)}
                        className="font-black text-[13px] text-text-primary tracking-tight overflow-hidden"
                    >
                        <span className="truncate">{objective.title}</span>
                    </EditableCell>
                </div>

                <div className="flex justify-center">
                    <EditableCell
                        rowId={objective.id}
                        field="status"
                        initialValue={objective.status}
                        onSave={(val) => handleUpdateField('status', val)}
                        type="select"
                        options={[
                            { label: 'Draft', value: 'draft' },
                            { label: 'Pending', value: 'pending_approval' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Archived', value: 'archived' }
                        ]}
                    >
                        <StatusBadge className="scale-90 font-black">{objective.status}</StatusBadge>
                    </EditableCell>
                </div>

                <div className="flex flex-col gap-1 px-4">
                    <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden border border-black/[0.02]">
                        <div className="h-full bg-primary shadow-[0_0_8px_rgba(29,78,216,0.3)] transition-all duration-1000" style={{ width: '45%' }} />
                    </div>
                </div>

                <div className="flex justify-center">
                    <EditableCell
                        rowId={objective.id}
                        field="priority"
                        initialValue={objective.priority}
                        onSave={(val) => handleUpdateField('priority', val)}
                        type="select"
                        options={[
                            { label: 'P0', value: 'p0' },
                            { label: 'P1', value: 'p1' },
                            { label: 'P2', value: 'p2' },
                            { label: 'P3', value: 'p3' }
                        ]}
                    >
                        <PriorityBadge className="scale-90 font-bold">{objective.priority}</PriorityBadge>
                    </EditableCell>
                </div>

                <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    {objective.key_results?.length || 0} Key Results
                </div>

                <div className="flex justify-center">
                    <div className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-black text-primary shadow-sm uppercase group-hover:border-primary/30 transition-all">
                        {objective.owner_details?.first_name?.[0] || 'U'}
                    </div>
                </div>

                <div className="text-right text-[11px] font-bold text-text-secondary">
                    <EditableCell
                        rowId={objective.id}
                        field="due_date"
                        initialValue={objective.due_date}
                        onSave={(val) => handleUpdateField('due_date', val)}
                        type="date"
                    >
                        {new Date(objective.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </EditableCell>
                </div>

                <div className="flex justify-end relative menu-container">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                        className="p-1.5 hover:bg-white rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-gray-200"
                    >
                        <MoreHorizontal size={14} />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden py-1">
                                <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-text-primary">
                                    <Send size={14} className="text-blue-500" /> Submit for Approval
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsCreateKRModalOpen(true); }}
                                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-text-primary"
                                >
                                    <Plus size={14} className="text-green-500" /> Add Key Result
                                </button>
                                <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-text-primary border-t">
                                    <Edit2 size={14} className="text-gray-400" /> Edit Objective
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); if (confirm('Delete this objective?')) deleteObjective(objective.id); }}
                                    className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-rag-red"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {isExpanded && objective.key_results && (
                <div className="bg-white">
                    {objective.key_results.map((kr: any) => (
                        <KeyResultRow key={kr.id} keyResult={kr} />
                    ))}
                </div>
            )}

            <CreateKRModal
                isOpen={isCreateKRModalOpen}
                onClose={() => setIsCreateKRModalOpen(false)}
                objectiveId={objective.id}
                objectiveTitle={objective.title}
            />
        </div>
    );
}
