import { useAuthStore } from "@/store/auth";

export function useAuth() {
    const { user, token, isAuthenticated, login, logout, setAuth } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        setAuth,
        role: user?.role,
        isCEO: user?.role === 'ceo',
        isPlatformAdmin: user?.role === 'platform_admin',
        isHRManager: user?.role === 'hr_manager',
        isTeamLead: user?.role === 'team_lead',
    };
}
