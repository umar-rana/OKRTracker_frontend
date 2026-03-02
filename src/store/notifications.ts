import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "./auth";
import { Notification } from "@/types";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        set({ isLoading: true });
        try {
            const { data } = await api.get(`/orgs/${activeOrgId}/notifications/`);
            set({
                notifications: data,
                unreadCount: data.filter((n: Notification) => !n.is_read).length,
                isLoading: false
            });
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            await api.post(`/orgs/${activeOrgId}/notifications/${id}/mark_read/`);
            const updated = get().notifications.map(n =>
                n.id === id ? { ...n, is_read: true } : n
            );
            set({
                notifications: updated,
                unreadCount: updated.filter(n => !n.is_read).length
            });
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    },

    markAllAsRead: async () => {
        const activeOrgId = useAuthStore.getState().activeOrgId;
        if (!activeOrgId) return;

        try {
            await api.post(`/orgs/${activeOrgId}/notifications/mark_all_read/`);
            const updated = get().notifications.map(n => ({ ...n, is_read: true }));
            set({
                notifications: updated,
                unreadCount: 0
            });
        } catch (err) {
            console.error("Failed to mark all notifications as read", err);
        }
    }
}));
