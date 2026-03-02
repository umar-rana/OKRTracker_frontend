"use client";

import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

interface EditableCellProps {
    rowId: string;
    field: string;
    initialValue: string | number;
    onSave: (value: any) => Promise<void>;
    type?: 'text' | 'number' | 'select' | 'date';
    options?: { label: string, value: string }[];
    className?: string;
    children: React.ReactNode;
}

export function EditableCell({
    rowId,
    field,
    initialValue,
    onSave,
    type = 'text',
    options = [],
    className,
    children
}: EditableCellProps) {
    const { editingCell, setEditingCell } = useUIStore();
    const [value, setValue] = useState(initialValue);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const isEditing = editingCell?.rowId === rowId && editingCell?.field === field;

    useEffect(() => {
        if (isEditing) {
            if (type === 'select') {
                selectRef.current?.focus();
            } else {
                inputRef.current?.focus();
                inputRef.current?.select();
            }
        }
    }, [isEditing, type]);

    const handleStartEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCell({ rowId, field });
    };

    const handleSave = async () => {
        if (value === initialValue) {
            setEditingCell(null);
            return;
        }

        setIsSaving(true);
        try {
            await onSave(value);
            setEditingCell(null);
        } catch (err) {
            console.error("Failed to save cell", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setValue(initialValue);
            setEditingCell(null);
        }
    };

    if (isEditing) {
        return (
            <div className={cn("relative w-full", className)} onClick={(e) => e.stopPropagation()}>
                {type === 'select' ? (
                    <select
                        ref={selectRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleSave}
                        disabled={isSaving}
                        className="w-full h-8 px-2 py-1 text-sm border-2 border-primary rounded bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        ref={inputRef}
                        type={type}
                        value={value}
                        onChange={(e) => setValue(type === 'number' ? Number(e.target.value) : e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        disabled={isSaving}
                        className="w-full h-8 px-2 py-1 text-sm border-2 border-primary rounded bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                )}
                {isSaving && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            onClick={handleStartEdit}
            className={cn(
                "w-full cursor-text hover:bg-white/10 px-2 py-1 rounded transition-colors border border-transparent hover:border-gray-200 min-h-[32px] flex items-center",
                className
            )}
        >
            {children}
        </div>
    );
}
