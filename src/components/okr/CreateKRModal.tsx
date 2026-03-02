"use client";

import { useState } from "react";
import { useOKRStore } from "@/store/okr";
import { X, Save, Loader2 } from "lucide-react";

interface CreateKRModalProps {
    isOpen: boolean;
    onClose: () => void;
    objectiveId: string;
    objectiveTitle: string;
}

export function CreateKRModal({ isOpen, onClose, objectiveId, objectiveTitle }: CreateKRModalProps) {
    const { createKR } = useOKRStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        objective: objectiveId,
        title: "",
        description: "",
        kr_type: "numeric",
        target_value: "100",
        unit: "",
        priority: "p2",
        due_date: new Date().toISOString().split("T")[0],
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createKR({
                ...formData,
                target_value: parseFloat(formData.target_value as string)
            });
            onClose();
            setFormData({
                objective: objectiveId,
                title: "",
                description: "",
                kr_type: "numeric",
                target_value: "100",
                unit: "",
                priority: "p2",
                due_date: new Date().toISOString().split("T")[0],
            });
        } catch (err) {
            // Error managed by store
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                <header className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
                    <div className="space-y-0.5">
                        <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">New Key Result</h2>
                        <p className="text-[10px] font-bold text-gray-400 truncate max-w-[300px]">For: {objectiveTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">KR Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none"
                            placeholder="e.g. Generate $500k in new pipeline"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">KR Type</label>
                            <select
                                value={formData.kr_type}
                                onChange={(e) => setFormData({ ...formData, kr_type: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none appearance-none"
                            >
                                <option value="numeric">Numeric</option>
                                <option value="percentage">Percentage</option>
                                <option value="currency">Currency</option>
                                <option value="boolean">Boolean</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Value</label>
                            <input
                                type="number"
                                required
                                value={formData.target_value}
                                onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unit</label>
                            <input
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none"
                                placeholder="e.g. USD, Users, %"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Date</label>
                            <input
                                type="date"
                                required
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none"
                            />
                        </div>
                    </div>

                    <footer className="pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-text-primary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] h-12 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg shadow-blue-700/20 transition-all flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isLoading ? "Adding..." : "Add Key Result"}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
