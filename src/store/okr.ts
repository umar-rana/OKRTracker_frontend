"use client";

import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "./auth";

import { Objective, KeyResult, Notification, AuditLog } from "@/types";

interface OKRState {
    objectives: Objective[];
    selectedItem: { type: 'objective' | 'kr', id: string } | null;
    history: any[];
    risks: any[];
    accomplishments: any[];
    auditLogs: AuditLog[];
    isLoading: boolean;
    error: string | null;
    fetchOKRs: () => Promise<void>;
    updateKR: (krId: string, data: any) => Promise<void>;
    updateObjective: (objId: string, data: any) => Promise<void>;
    setSelectedItem: (item: { type: 'objective' | 'kr', id: string } | null) => void;
    fetchItemDetails: (type: 'objective' | 'kr', id: string) => Promise<void>;
    fetchAuditLogs: () => Promise<void>;
}

export const useOKRStore = create<OKRState>((set, get) => ({
    objectives: [],
    selectedItem: null,
    history: [],
    risks: [],
    accomplishments: [],
    auditLogs: [],
    isLoading: false,
    error: null,

    fetchAuditLogs: async () => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;
        try {
            const { data } = await api.get(`/orgs/${activeOrgId}/audit-logs/`);
            set({ auditLogs: data });
        } catch (err) {
            console.error("Failed to fetch audit logs", err);
        }
    },

    setSelectedItem: (item) => {
        set({ selectedItem: item });
        if (item) {
            get().fetchItemDetails(item.type, item.id);
        }
    },

    fetchItemDetails: async (type, id) => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            const baseUrl = `/orgs/${activeOrgId}/${type === 'kr' ? 'key-results' : 'objectives'}/${id}`;
            const [historyRes, risksRes, accRes] = await Promise.all([
                api.get(`${baseUrl}/history/`),
                api.get(`/orgs/${activeOrgId}/risks/?${type === 'kr' ? 'key_result' : 'objective'}=${id}`),
                api.get(`/orgs/${activeOrgId}/accomplishments/?${type === 'kr' ? 'key_result' : 'objective'}=${id}`)
            ]);
            set({
                history: historyRes.data,
                risks: risksRes.data,
                accomplishments: accRes.data
            });
        } catch (err) {
            console.error("Failed to fetch item details", err);
        }
    },

    fetchOKRs: async () => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/orgs/${activeOrgId}/objectives/`);
            set({ objectives: response.data, isLoading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.detail || "Failed to fetch OKRs",
                isLoading: false
            });
        }
    },

    updateKR: async (krId, data) => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            await api.patch(`/orgs/${activeOrgId}/key-results/${krId}/`, data);
            await get().fetchOKRs(); // Reload to get consistent state
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to update KR" });
        }
    },

    updateObjective: async (objId, data) => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            await api.patch(`/orgs/${activeOrgId}/objectives/${objId}/`, data);
            await get().fetchOKRs();
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to update Objective" });
        }
    },
}));
