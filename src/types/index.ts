export type Role = 'platform_admin' | 'ceo' | 'hr_manager' | 'team_lead' | 'member';

export type RAGStatus = 'green' | 'amber' | 'red';

export type Priority = 'p0' | 'p1' | 'p2' | 'p3' | 'low' | 'medium' | 'high';

export type ObjectiveStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'archived';

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
}

export interface Membership {
    organization: string;
    organization_name: string;
    role: Role;
    is_active: boolean;
}

export interface KeyResult {
    id: string;
    objective: string;
    title: string;
    description: string;
    kr_type: string;
    start_value: number;
    target_value: number;
    current_value: number;
    unit: string;
    priority: Priority;
    rag_status: RAGStatus;
    due_date: string;
}

export interface Objective {
    id: string;
    organization: string;
    team: string | null;
    title: string;
    description: string;
    priority: Priority;
    status: ObjectiveStatus;
    owner: string;
    owner_details?: User;
    due_date: string;
    key_results: KeyResult[];
}

export interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    entity_type: string;
    entity_id: string;
    is_read: boolean;
    created_at: string;
}

export interface AuditLog {
    id: string;
    performed_by_details: User;
    action: string;
    entity_type: string;
    entity_id: string;
    previous_state: any;
    new_state: any;
    performed_at: string;
}
