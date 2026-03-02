"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import Cookies from "js-cookie";

import { User, Membership } from "@/types";

interface AuthState {
    user: User | null;
    memberships: Membership[];
    activeOrganizationId: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    setAuth: (data: {
        user: User,
        memberships: Membership[],
        active_organization_id: string,
        access: string,
        refresh: string
    }) => void;
    logout: () => void;
    switchOrganization: (orgId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            memberships: [],
            activeOrganizationId: null,
            accessToken: null,
            refreshToken: null,
            setAuth: (data) => {
                Cookies.set('trackr-token', data.access, { expires: 1, secure: true, sameSite: 'strict' });
                set({
                    user: data.user,
                    memberships: data.memberships,
                    activeOrganizationId: data.active_organization_id,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                });
            },
            logout: () => {
                Cookies.remove('trackr-token');
                set({
                    user: null,
                    memberships: [],
                    activeOrganizationId: null,
                    accessToken: null,
                    refreshToken: null,
                });
            },
            switchOrganization: async (orgId) => {
                try {
                    const { accessToken } = useAuthStore.getState();
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/switch-organization/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ organization_id: orgId })
                    });

                    if (!response.ok) throw new Error('Switch failed');

                    const data = await response.json();
                    Cookies.set('trackr-token', data.access, { expires: 1, secure: true, sameSite: 'strict' });
                    set({
                        activeOrganizationId: orgId,
                        accessToken: data.access,
                        refreshToken: data.refresh,
                    });
                    window.location.reload(); // Refresh to clear all state and re-fetch for new org
                } catch (error) {
                    console.error("Failed to switch organization", error);
                }
            },
        }),
        {
            name: "trackr-auth",
        }
    )
);
