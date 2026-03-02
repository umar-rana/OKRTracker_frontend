"use client";

import { useEffect } from "react";
import { useOKRStore } from "@/store/okr";
import { ObjectiveRow } from "./ObjectiveRow";
import { Loader2, AlertCircle } from "lucide-react";

export function OKRGrid() {
    const { objectives, isLoading, error, fetchOKRs } = useOKRStore();

    useEffect(() => {
        fetchOKRs();
    }, [fetchOKRs]);

    if (isLoading && objectives.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-text-secondary">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-medium">Loading your OKRs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <div className="p-3 bg-rag-red/10 rounded-full text-rag-red">
                    <AlertCircle size={32} />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-text-primary text-lg">Failed to load OKRs</h3>
                    <p className="text-text-secondary text-sm max-w-md">{error}</p>
                </div>
                <button
                    onClick={() => fetchOKRs()}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (objectives.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center text-text-secondary">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border-2 border-dashed">
                    <Loader2 size={32} className="text-gray-200" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-text-primary text-lg">No OKRs Found</h3>
                    <p className="text-sm max-w-sm">No objectives have been created for this organization yet. Start by creating your first objective.</p>
                </div>
                <button className="mt-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors">
                    Create Objective
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Grid Header */}
            <div className="grid grid-cols-[1fr_100px_120px_100px_150px_100px] gap-2 px-4 py-2 bg-gray-50 border-b text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                <div className="pl-8">Objective / Key Result</div>
                <div className="text-center">Status</div>
                <div className="text-center">Progress</div>
                <div className="text-center">Priority</div>
                <div className="text-right">Value / Target</div>
                <div className="text-right">Due Date</div>
            </div>

            <div className="flex-1 overflow-auto">
                {objectives.map((obj) => (
                    <ObjectiveRow key={obj.id} objective={obj} />
                ))}
            </div>
        </div>
    );
}
