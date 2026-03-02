import { useAuthStore } from "@/store/auth";

export function useOrganization() {
    const { memberships, activeOrgId, switchOrg } = useAuthStore();

    const activeOrg = memberships.find(m => m.organization.id === activeOrgId)?.organization;
    const currentRole = memberships.find(m => m.organization.id === activeOrgId)?.role;

    return {
        memberships,
        activeOrgId,
        activeOrg,
        currentRole,
        switchOrg,
        isAdmin: currentRole === 'ceo' || currentRole === 'hr_manager' || currentRole === 'platform_admin'
    };
}
