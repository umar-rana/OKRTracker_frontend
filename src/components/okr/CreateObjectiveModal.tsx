"use client";

import { useState } from "react";
import { useOKRStore } from "@/store/okr";
import { X, Save, Loader2 } from "lucide-react";

interface CreateObjectiveModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateObjectiveModal({ isOpen, onClose }: CreateObjectiveModalProps) {
    const { createObjective } = useOKRStore();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "p2",
        due_date: new Date().toISOString().split("T")[0],
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createObjective(formData);
            onClose();
            setFormData({
                title: "",
                description: "",
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
                    <h2 className="text-sm font-black uppercase tracking-widest text-text-primary">Create Strategic Objective</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none"
                            placeholder="e.g. Increase Annual Recurring Revenue by 25%"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-medium transition-all outline-none resize-none"
                            placeholder="Describe the overall strategic impact..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-xl text-sm font-bold transition-all outline-none appearance-none"
                            >
                                <option value="p0">P0 - Critical</option>
                                <option value="p1">P1 - High</option>
                                <option value="p2">P2 - Medium</option>
                                <option value="p3">P3 - Low</option>
                            </select>
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
                            {isLoading ? "Creating..." : "Create Objective"}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
