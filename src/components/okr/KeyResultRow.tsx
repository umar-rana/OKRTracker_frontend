"use client";

import { KeyResult, useOKRStore } from "@/store/okr";
import { StatusBadge, PriorityBadge } from "../ui/custom-badges";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import { EditableCell } from "../ui/EditableCell";

interface KeyResultRowProps {
    keyResult: KeyResult;
}

export function KeyResultRow({ keyResult }: KeyResultRowProps) {
    const setSidePanelOpen = useUIStore((state) => state.setSidePanelOpen);
    const setSelectedItem = useOKRStore((state) => state.setSelectedItem);
    const updateKR = useOKRStore((state) => state.updateKR);

    const handleRowClick = (e: React.MouseEvent) => {
        // Only open side panel if NOT clicking an editable input area
        if ((e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('select')) return;

        setSelectedItem({ type: 'kr', id: keyResult.id });
        setSidePanelOpen(true);
    };

    const handleUpdateField = async (field: string, value: any) => {
        await updateKR(keyResult.id, { [field]: value });
    };

    const progress = Math.min(
        100,
        Math.max(0, (keyResult.current_value / keyResult.target_value) * 100)
    );

    return (
        <div
            onClick={handleRowClick}
            className="grid grid-cols-[1fr_100px_120px_100px_150px_100px] gap-2 px-4 py-2 border-b hover:bg-gray-50 cursor-pointer text-sm items-center transition-colors group"
        >
            <div className="flex items-center gap-3 pl-8 overflow-hidden">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors shrink-0" />
                <EditableCell
                    rowId={keyResult.id}
                    field="title"
                    initialValue={keyResult.title}
                    onSave={(val) => handleUpdateField('title', val)}
                    className="font-medium text-text-primary overflow-hidden"
                >
                    <span className="truncate">{keyResult.title}</span>
                </EditableCell>
            </div>

            <div className="flex justify-center">
                <EditableCell
                    rowId={keyResult.id}
                    field="rag_status"
                    initialValue={keyResult.rag_status}
                    onSave={(val) => handleUpdateField('rag_status', val)}
                    type="select"
                    options={[
                        { label: 'Green', value: 'green' },
                        { label: 'Amber', value: 'amber' },
                        { label: 'Red', value: 'red' }
                    ]}
                >
                    <StatusBadge>{keyResult.rag_status}</StatusBadge>
                </EditableCell>
            </div>

            <div className="flex flex-col gap-1 px-2">
                <div className="flex justify-between text-[10px] text-text-secondary font-medium">
                    <span>{Math.round(progress)}%</span>
                    <span>{keyResult.target_value}{keyResult.unit}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full transition-all duration-500",
                            keyResult.rag_status === 'green' ? 'bg-rag-green' :
                                keyResult.rag_status === 'amber' ? 'bg-rag-amber' : 'bg-rag-red'
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <EditableCell
                    rowId={keyResult.id}
                    field="priority"
                    initialValue={keyResult.priority}
                    onSave={(val) => handleUpdateField('priority', val)}
                    type="select"
                    options={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' }
                    ]}
                >
                    <PriorityBadge>{keyResult.priority}</PriorityBadge>
                </EditableCell>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs tabular-nums text-text-secondary">
                <EditableCell
                    rowId={keyResult.id}
                    field="current_value"
                    initialValue={keyResult.current_value}
                    onSave={(val) => handleUpdateField('current_value', val)}
                    type="number"
                    className="w-16 h-7 min-h-0"
                >
                    <span className="text-right w-full">{keyResult.current_value}</span>
                </EditableCell>
                <span>/</span>
                <EditableCell
                    rowId={keyResult.id}
                    field="target_value"
                    initialValue={keyResult.target_value}
                    onSave={(val) => handleUpdateField('target_value', val)}
                    type="number"
                    className="w-16 h-7 min-h-0"
                >
                    <span>{keyResult.target_value}</span>
                </EditableCell>
            </div>

            <div className="text-right text-xs text-text-secondary">
                <EditableCell
                    rowId={keyResult.id}
                    field="due_date"
                    initialValue={keyResult.due_date}
                    onSave={(val) => handleUpdateField('due_date', val)}
                    type="date"
                    className="h-7 min-h-0"
                >
                    {new Date(keyResult.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </EditableCell>
            </div>
        </div>
    );
}
