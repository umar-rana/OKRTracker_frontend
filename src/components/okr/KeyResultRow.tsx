import { KeyResult } from "@/types";
import { useOKRStore } from "@/store/okr";
import { StatusBadge, PriorityBadge } from "../ui/custom-badges";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";
import { EditableCell } from "../ui/EditableCell";
import { MoreHorizontal } from "lucide-react";

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
            className="grid grid-cols-[1fr_100px_120px_100px_140px_100px_100px_40px] gap-2 px-4 h-9 border-b hover:bg-gray-50/80 cursor-pointer items-center transition-all group relative"
        >
            <div className="flex items-center gap-3 pl-9 overflow-hidden h-full relative">
                {/* Visual Connector */}
                <div className="absolute left-[17px] top-[-50%] h-[150%] w-px bg-gray-100" />
                <div className="absolute left-[17px] top-1/2 w-3 h-px bg-gray-100" />

                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary/50 transition-all shrink-0 z-10" />
                <EditableCell
                    rowId={keyResult.id}
                    field="title"
                    initialValue={keyResult.title}
                    onSave={(val) => handleUpdateField('title', val)}
                    className="font-semibold text-[13px] text-text-primary tracking-tight overflow-hidden"
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
                    <StatusBadge className="scale-90 font-black tracking-widest">{keyResult.rag_status}</StatusBadge>
                </EditableCell>
            </div>

            <div className="flex flex-col gap-1 px-4">
                <div className="flex justify-between items-center px-0.5">
                    <span className="text-[9px] font-black text-text-secondary">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden border border-black/[0.02]">
                    <div
                        className={cn(
                            "h-full transition-all duration-1000 ease-out",
                            keyResult.rag_status === 'green' ? 'bg-rag-green shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                                keyResult.rag_status === 'amber' ? 'bg-rag-amber shadow-[0_0_8px_rgba(245,158,11,0.3)]' :
                                    'bg-rag-red shadow-[0_0_8px_rgba(244,63,94,0.3)]'
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
                    <PriorityBadge className="scale-90 font-bold">{keyResult.priority}</PriorityBadge>
                </EditableCell>
            </div>

            <div className="flex items-center justify-center gap-1 font-mono text-[11px] tabular-nums text-text-secondary font-bold">
                <EditableCell
                    rowId={keyResult.id}
                    field="current_value"
                    initialValue={keyResult.current_value}
                    onSave={(val) => handleUpdateField('current_value', val)}
                    type="number"
                    className="w-14 h-6 min-h-0 flex justify-end"
                >
                    <span>{keyResult.current_value}</span>
                </EditableCell>
                <span className="text-gray-300">/</span>
                <EditableCell
                    rowId={keyResult.id}
                    field="target_value"
                    initialValue={keyResult.target_value}
                    onSave={(val) => handleUpdateField('target_value', val)}
                    type="number"
                    className="w-14 h-6 min-h-0"
                >
                    <span>{keyResult.target_value}</span>
                </EditableCell>
            </div>

            <div className="flex justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[9px] font-black text-gray-500 uppercase">
                    {(keyResult as any).owner_details?.first_name?.[0] || 'U'}
                </div>
            </div>

            <div className="text-right text-[11px] font-bold text-text-secondary">
                <EditableCell
                    rowId={keyResult.id}
                    field="due_date"
                    initialValue={keyResult.due_date}
                    onSave={(val) => handleUpdateField('due_date', val)}
                    type="date"
                    className="h-6 min-h-0"
                >
                    {new Date(keyResult.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </EditableCell>
            </div>

            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                <div className="p-1 hover:bg-gray-100 rounded text-gray-400">
                    <MoreHorizontal size={14} />
                </div>
            </div>
        </div>
    );
}
