import { Objective } from "@/types";
import { KeyResultRow } from "./KeyResultRow";
import { ChevronDown, ChevronRight, Target, MoreHorizontal, Send, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { StatusBadge, PriorityBadge } from "../ui/custom-badges";
import { cn } from "@/lib/utils";
import { useOKRStore } from "@/store/okr";
import { useUIStore } from "@/store/ui";
import { EditableCell } from "../ui/EditableCell";

interface ObjectiveRowProps {
    objective: Objective;
}

export function ObjectiveRow({ objective }: ObjectiveRowProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const setSidePanelOpen = useUIStore((state) => state.setSidePanelOpen);
    const setSelectedItem = useOKRStore((state) => state.setSelectedItem);
    const updateObjective = useOKRStore((state) => state.updateObjective);

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
                className="grid grid-cols-[1fr_100px_100px_100px_120px_100px_40px] gap-2 px-4 py-3 bg-surface hover:bg-gray-100/80 cursor-pointer text-sm items-center transition-colors border-b border-gray-100 group"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded text-gray-400 shrink-0"
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    <div className="p-1 bg-[#EFF6FF] text-[#1D4ED8] rounded shrink-0">
                        <Target size={14} />
                    </div>
                    <EditableCell
                        rowId={objective.id}
                        field="title"
                        initialValue={objective.title}
                        onSave={(val) => handleUpdateField('title', val)}
                        className="font-bold text-text-primary overflow-hidden"
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
                        <StatusBadge>{objective.status}</StatusBadge>
                    </EditableCell>
                </div>

                <div className="flex justify-center">
                    <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '45%' }} />
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
                        <PriorityBadge>{objective.priority}</PriorityBadge>
                    </EditableCell>
                </div>

                <div className="text-right text-xs text-text-secondary font-medium px-2">
                    {objective.key_results?.length || 0} Key Results
                </div>

                <div className="text-right text-xs text-text-secondary">
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
                        className="p-1.5 hover:bg-gray-200 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden py-1">
                                <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-text-primary">
                                    <Send size={14} className="text-blue-500" /> Submit for Approval
                                </button>
                                <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-text-primary">
                                    <Plus size={14} className="text-green-500" /> Add Key Result
                                </button>
                                <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-text-primary border-t">
                                    <Edit2 size={14} className="text-gray-400" /> Edit Objective
                                </button>
                                <button className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-gray-50 text-rag-red">
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
        </div>
    );
}
