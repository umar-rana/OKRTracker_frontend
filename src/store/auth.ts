"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import Cookies from "js-cookie";

import { User, Membership } from "@/types";

interface AuthState {
    user: User | null;
    memberships: Membership[];
    activeOrgId: string | null;
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
    switchOrg: (orgId: string, tokens: { access: string, refresh: string }) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            memberships: [],
            activeOrgId: null,
            accessToken: null,
            refreshToken: null,
            setAuth: (data) => {
                Cookies.set('trackr-token', data.access, { expires: 1, secure: true, sameSite: 'strict' });
                set({
                    user: data.user,
                    memberships: data.memberships,
                    activeOrgId: data.active_organization_id,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                });
            },
            logout: () => {
                Cookies.remove('trackr-token');
                set({
                    user: null,
                    memberships: [],
                    activeOrgId: null,
                    accessToken: null,
                    refreshToken: null,
                });
            },
            switchOrg: (orgId, tokens) => {
                Cookies.set('trackr-token', tokens.access, { expires: 1, secure: true, sameSite: 'strict' });
                set({
                    activeOrgId: orgId,
                    accessToken: tokens.access,
                    refreshToken: tokens.refresh,
                });
            },
        }),
        {
            name: "trackr-auth",
        }
    )
);
