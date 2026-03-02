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
    decisions: any[];
    auditLogs: AuditLog[];
    dashboardData: {
        stats: {
            total_objectives: number;
            total_krs: number;
            active_teams: number;
            completion_rate: number;
        };
        health_distribution: { name: string, value: number, color: string }[];
        top_objectives: { name: string, progress: number, status: string }[];
        recent_activity: any[];
    } | null;
    isLoading: boolean;
    error: string | null;
    fetchOKRs: () => Promise<void>;
    updateKR: (krId: string, data: any) => Promise<void>;
    updateObjective: (objId: string, data: any) => Promise<void>;
    setSelectedItem: (item: { type: 'objective' | 'kr', id: string } | null) => void;
    fetchItemDetails: (type: 'objective' | 'kr', id: string) => Promise<void>;
    fetchAuditLogs: () => Promise<void>;
    fetchDashboardData: () => Promise<void>;
    createObjective: (data: any) => Promise<void>;
    deleteObjective: (objId: string) => Promise<void>;
    createKR: (data: any) => Promise<void>;
    deleteKR: (krId: string) => Promise<void>;
}

export const useOKRStore = create<OKRState>((set, get) => ({
    objectives: [],
    selectedItem: null,
    history: [],
    risks: [],
    accomplishments: [],
    decisions: [],
    auditLogs: [],
    dashboardData: null,
    isLoading: false,
    error: null,

    fetchDashboardData: async () => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;
        try {
            const { data } = await api.get(`/orgs/${activeOrgId}/dashboard/`);
            set({ dashboardData: data });
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
    },

    fetchAuditLogs: async () => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
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
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            const baseUrl = `/orgs/${activeOrgId}/${type === 'kr' ? 'key-results' : 'objectives'}/${id}`;
            const [historyRes, risksRes, accRes, decRes] = await Promise.all([
                api.get(`${baseUrl}/history/`),
                api.get(`/orgs/${activeOrgId}/risks/?${type === 'kr' ? 'key_result' : 'objective'}=${id}`),
                api.get(`/orgs/${activeOrgId}/accomplishments/?${type === 'kr' ? 'key_result' : 'objective'}=${id}`),
                api.get(`/orgs/${activeOrgId}/decisions/?${type === 'kr' ? 'key_result' : 'objective'}=${id}`)
            ]);
            set({
                history: historyRes.data,
                risks: risksRes.data,
                accomplishments: accRes.data,
                decisions: decRes.data
            });
        } catch (err) {
            console.error("Failed to fetch item details", err);
        }
    },

    fetchOKRs: async () => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
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
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            await api.patch(`/orgs/${activeOrgId}/key-results/${krId}/`, data);
            await get().fetchOKRs(); // Reload to get consistent state
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to update KR" });
        }
    },

    updateObjective: async (objId, data) => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            await api.patch(`/orgs/${activeOrgId}/objectives/${objId}/`, data);
            await get().fetchOKRs();
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to update Objective" });
        }
    },

    createObjective: async (data) => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            await api.post(`/orgs/${activeOrgId}/objectives/`, data);
            await get().fetchOKRs();
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to create Objective" });
            throw err;
        }
    },

    deleteObjective: async (objId) => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            await api.delete(`/orgs/${activeOrgId}/objectives/${objId}/`);
            await get().fetchOKRs();
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to delete Objective" });
        }
    },

    createKR: async (data) => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            await api.post(`/orgs/${activeOrgId}/key-results/`, data);
            await get().fetchOKRs();
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to create KR" });
            throw err;
        }
    },

    deleteKR: async (krId) => {
        const activeOrgId = useAuthStore.getState().activeOrganizationId;
        if (!activeOrgId) return;

        try {
            await api.delete(`/orgs/${activeOrgId}/key-results/${krId}/`);
            await get().fetchOKRs();
        } catch (err: any) {
            set({ error: err.response?.data?.detail || "Failed to delete KR" });
        }
    },
}));
